#!/bin/bash

[ ! -d "codebases/hyperwaiver" ] && git clone --branch main git@github.com:JackLicc/hyperwaiver.git codebases/hyperwaiver
[ ! -d "codebases/hyperwaiver-fe" ] && git clone --branch main git@github.com:JackLicc/hyperwaiver-fe.git codebases/hyperwaiver-fe

if [ "$ENV" = "production" ]; then
    compose_files="-f docker-compose.yaml -f docker-compose.prod.yaml"
else
    compose_files="-f docker-compose.yaml -f docker-compose.dev.yaml"
fi

docker compose $compose_files up --no-start

docker compose $compose_files up --detach

sleep 60

docker exec -it mariadb bash -c "chmod 444 /etc/mysql/my.cnf"

docker compose $compose_files stop

sleep 20

docker compose $compose_files up --detach

sleep 60

echo "Environment created ok. Run start.sh to run."
