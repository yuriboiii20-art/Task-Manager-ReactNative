#!/bin/bash

echo "Select a platform to start the project:"
echo "1) Android"
echo "2) iOS"
echo "3) Web"

read -p "Enter the number (1-3): " choice

case $choice in
    1)
        echo "Starting on Android..."
        cd "$(dirname "$0")/.." && expo start --android
        ;;
    2)
        echo "Starting on iOS..."
        cd "$(dirname "$0")/.." && expo start --ios
        ;;
    3)
        echo "Starting on Web..."
        cd "$(dirname "$0")/.." && expo start --web
        ;;
    *)
        echo "Invalid choice. Please enter 1, 2, or 3."
        exit 1
        ;;
esac
