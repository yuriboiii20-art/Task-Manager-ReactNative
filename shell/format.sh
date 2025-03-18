#!/bin/bash

echo "Formatting code..."

# Navigate to the project root
cd "$(dirname "$0")/.."

# Run Prettier to format all relevant files
prettier --write "**/*.{ts,tsx,js,jsx,json,css,scss,md,html}"
