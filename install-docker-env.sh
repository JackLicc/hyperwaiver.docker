#!/bin/bash

[ ! -d "codebases/hyperwaiver" ] && git clone --branch main git@github.com:JackLicc/hyperwaiver.git codebases/hyperwaiver
[ ! -d "codebases/hyperwaiver-fe" ] && git clone --branch main git@github.com:JackLicc/hyperwaiver-fe.git codebases/hyperwaiver-fe

docker compose up --no-start

docker compose up --detach
sleep 60

docker exec -it mysql bash -c "chmod 444 /etc/mysql/my.cnf"

docker compose -f ./docker-compose.yaml stop
sleep 20

docker compose -f ./docker-compose.yaml up --detach
sleep 60

echo "Environment created ok. Run start.sh to run."
