terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  bucket_name      = "${var.project_name}-assets"
  lambda_role_name = "${var.project_name}-lambda-role"
  sns_topic_name   = "${var.project_name}-topic"
}

#
# 1. S3 Bucket for static assets
#
resource "aws_s3_bucket" "assets" {
  bucket = local.bucket_name
  acl    = "public-read"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"]
  }
}

#
# 2. CloudFront distribution fronting the S3 bucket
#
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${local.bucket_name}"
}

resource "aws_s3_bucket_policy" "cf_access" {
  bucket = aws_s3_bucket.assets.id
  policy = data.aws_iam_policy_document.cf_oai.json
}

data "aws_iam_policy_document" "cf_oai" {
  statement {
    actions = ["s3:GetObject"]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.oai.iam_arn]
    }
    resources = ["${aws_s3_bucket.assets.arn}/*"]
  }
}

resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = local.bucket_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.bucket_name
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.domain_name == ""
    acm_certificate_arn            = var.domain_name != "" ? var.certificate_arn : null
    ssl_support_method             = var.domain_name != "" ? "sni-only" : null
  }

  aliases = var.domain_name != "" ? [var.domain_name] : []
}

#
# 3. SNS topic for notifications
#
resource "aws_sns_topic" "notifications" {
  name = local.sns_topic_name
}

#
# 4. Lambda role and policy
#
resource "aws_iam_role" "lambda_role" {
  name               = local.lambda_role_name
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_sns_publish" {
  name   = "${local.lambda_role_name}-sns"
  role   = aws_iam_role.lambda_role.id
  policy = data.aws_iam_policy_document.sns_publish.json
}

data "aws_iam_policy_document" "sns_publish" {
  statement {
    actions   = ["sns:Publish"]
    resources = [aws_sns_topic.notifications.arn]
  }
}

#
# 5. Secrets Manager for Supabase service_role
#
resource "aws_secretsmanager_secret" "supabase" {
  name = "${var.project_name}/supabase"
}

resource "aws_secretsmanager_secret_version" "supabase_version" {
  secret_id     = aws_secretsmanager_secret.supabase.id
  secret_string = var.supabase_service_role
}

#
# 6. Lambda function for scheduled tasks
#
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/taskReminder"
  output_path = "${path.module}/lambda/taskReminder.zip"
}

resource "aws_lambda_function" "task_reminder" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${var.project_name}-task-reminder"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handler.main"
  runtime          = "nodejs18.x"
  timeout          = 30
  environment {
    variables = {
      SUPABASE_SECRET_ARN = aws_secretsmanager_secret.supabase.arn
      SNS_TOPIC_ARN       = aws_sns_topic.notifications.arn
    }
  }
}

#
# 7. CloudWatch Event Rule → Lambda (run daily at 8am UTC)
#
resource "aws_cloudwatch_event_rule" "daily" {
  name                = "${var.project_name}-daily-rule"
  schedule_expression = "cron(0 8 * * ? *)"
}

resource "aws_cloudwatch_event_target" "daily_target" {
  rule      = aws_cloudwatch_event_rule.daily.name
  arn       = aws_lambda_function.task_reminder.arn
  input     = jsonencode({})
}

resource "aws_lambda_permission" "allow_events" {
  statement_id  = "AllowCWInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.task_reminder.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily.arn
}

#
# 8. Route53 record
#
resource "aws_route53_record" "cdn_alias" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }

  # only create if domain_name is set
  count = var.domain_name == "" ? 0 : 1
}

data "aws_route53_zone" "main" {
  name         = var.domain_name
  private_zone = false
}
