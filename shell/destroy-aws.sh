#!/usr/bin/env bash
set -euo pipefail

echo "⚠️  Destroying all AWS resources (terraform destroy)..."
cd aws
terraform destroy -auto-approve

echo "✅ AWS infra destroyed."
