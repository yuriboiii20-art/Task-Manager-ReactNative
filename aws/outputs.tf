output "s3_bucket" {
  description = "S3 bucket for assets"
  value       = aws_s3_bucket.assets.bucket
}

output "cloudfront_domain" {
  description = "CloudFront URL"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "sns_topic_arn" {
  description = "SNS topic ARN"
  value       = aws_sns_topic.notifications.arn
}

output "lambda_function_name" {
  description = "Name of the task reminder Lambda"
  value       = aws_lambda_function.task_reminder.function_name
}
