#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="/workspace/docker-compose.codespaces.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "No docker-compose file found at $COMPOSE_FILE, skipping services bring-up."
  exit 0
fi

# Prefer docker compose v2 (docker compose) if available
if command -v docker >/dev/null 2>&1; then
  echo "Docker CLI found: $(docker --version)"
  if docker compose version >/dev/null 2>&1; then
    echo "Using 'docker compose' to start services"
    docker compose -f "$COMPOSE_FILE" up -d
  elif command -v docker-compose >/dev/null 2>&1; then
    echo "Using 'docker-compose' to start services"
    docker-compose -f "$COMPOSE_FILE" up -d
  else
    echo "Docker is available but no compose command found; skipping services bring-up."
    exit 0
  fi
else
  echo "Docker CLI not found in the Codespace; skipping services bring-up."
  exit 0
fi

# Wait a short while for services to report healthy
echo "Waiting for services to initialize..."
# Simple wait loop; increase if your services need more time
for i in {1..30}; do
  # Check postgres (5432), mysql (3306) and redis (6379)
  nc -z localhost 5432 >/dev/null 2>&1 || { sleep 1; continue; }
  nc -z localhost 3306 >/dev/null 2>&1 || { sleep 1; continue; }
  nc -z localhost 6379 >/dev/null 2>&1 || { sleep 1; continue; }
  echo "All services appear to be accepting connections."
  exit 0
done

echo "Timed out waiting for services to become ready."
exit 1
