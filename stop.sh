#!/bin/bash


if [ "$ENV" = "production" ]; then
    compose_files="-f docker-compose.yaml -f docker-compose.prod.yaml"
else
    compose_files="-f docker-compose.yaml -f docker-compose.dev.yaml"
fi

docker compose $compose_files  stop