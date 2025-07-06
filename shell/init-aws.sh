#!/usr/bin/env bash
set -euo pipefail

echo "🌱 Initializing Terraform..."
cd aws
terraform init

echo "🚀 Applying Terraform plan..."
terraform apply -auto-approve

echo "✅ AWS infra provisioned!"
