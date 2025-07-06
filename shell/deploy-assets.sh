#!/usr/bin/env bash
set -euo pipefail

# assume you've already run terraform in aws/
echo "📥 Fetching S3 bucket name from Terraform outputs..."
BUCKET=$(terraform -chdir=aws output -raw s3_bucket)

echo "📤 Syncing ./web-assets → s3://${BUCKET}"
aws s3 sync ./web-assets "s3://${BUCKET}" \
  --acl public-read \
  --delete

echo "✅ Assets deployed to S3://$BUCKET"
