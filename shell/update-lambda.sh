#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Packaging Lambda..."
./shell/package-lambda.sh

echo "🔄 Applying only the Lambda function..."
cd aws
terraform apply \
  -target=aws_lambda_function.task_reminder \
  -auto-approve

echo "✅ Lambda code updated in AWS."
