#!/bin/bash

set -e

echo "Starting Buddyscript with Docker..."

if ! command -v docker &> /dev/null; then
    echo "Error: docker is not installed"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "Error: docker compose is not available"
    exit 1
fi

docker compose up -d --build

echo ""
echo "Waiting for services to start (can take up to 2 minutes on first run)..."

for i in $(seq 1 40); do
    if curl -fs http://localhost:8080/ > /dev/null 2>&1; then
        echo "App is up at http://localhost:8080"
        break
    fi
    echo "Waiting for app... ($i/40)"
    sleep 3
done

echo ""
echo "Open http://localhost:8080"
echo "View logs: docker compose logs -f"
echo "Stop server: ./build_down.sh"
