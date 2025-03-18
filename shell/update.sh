#!/bin/bash

echo "Updating dependencies..."

# Navigate to the project root
cd "$(dirname "$0")/.."

# Run npm update to update dependencies
npm update
