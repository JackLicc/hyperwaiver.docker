#!/bin/bash

source .env

docker compose build --no-cache caddy

if [ "$ENV" = "production" ]; then
    docker compose -f docker-compose.yaml -f docker-compose.prod.yaml build --no-cache
else
    docker compose -f docker-compose.yaml -f docker-compose.dev.yaml build --no-cache
    docker image prune -f
    docker builder prune --all -f
fi


docker compose up --remove-orphans --detach
