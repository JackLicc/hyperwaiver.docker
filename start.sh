#!/bin/bash

source .env

if [ "$ENV" = "production" ]; then
    compose_files="-f docker-compose.yaml -f docker-compose.prod.yaml"
else
    compose_files="-f docker-compose.yaml -f docker-compose.dev.yaml"
fi


if [ "$ENV" = "production" ]; then
    docker compose $compose_files up --detach
else
    docker compose $compose_files up --detach
    docker image prune -f
    docker builder prune --all -f
fi


docker compose $compose_files up --remove-orphans --detach
