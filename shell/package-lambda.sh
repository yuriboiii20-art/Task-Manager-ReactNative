#!/usr/bin/env bash
set -euo pipefail

LAMBDA_SRC="aws/lambda/taskReminder"
OUTPUT_ZIP="${LAMBDA_SRC}.zip"

echo "📦 Packaging Lambda from ${LAMBDA_SRC} → ${OUTPUT_ZIP}"
rm -f "$OUTPUT_ZIP"
cd aws/lambda/taskReminder
zip -r "../../taskReminder.zip" ./*
cd ../../../

echo "✅ Lambda package ready."
