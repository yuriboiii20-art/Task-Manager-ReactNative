#!/bin/bash

echo "Resetting project..."

# Navigate to the project root
cd "$(dirname "$0")/.."

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Clear Expo cache and start the project
expo start -c
