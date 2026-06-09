#!/bin/bash

set -e

echo "Stopping Buddyscript containers..."

if ! command -v docker &> /dev/null; then
    echo "Error: docker is not installed"
    exit 1
fi

docker compose down

echo "All containers stopped"
