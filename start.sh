#!/bin/bash

source .env

if [ "$ENV" = "production" ]; then
    docker compose -f docker-compose.yaml -f docker-compose.prod.yaml build
else
    docker compose -f docker-compose.yaml -f docker-compose.dev.yaml build
    docker image prune -f
    docker builder prune --all -f
fi


docker compose up --remove-orphans --detach
