variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project prefix"
  type        = string
  default     = "tasknexus"
}

variable "domain_name" {
  description = "Optional: your domain (e.g. example.com) for CloudFront + Route53"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "Optional: ACM certificate ARN for your domain"
  type        = string
  default     = ""
}

variable "supabase_service_role" {
  description = "Supabase service_role key for Lambda secrets"
  type        = string
  default     = ""
}
