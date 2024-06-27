#! /bin/sh

echo "Deploying ..."

git pull origin main
docker compose up -d --build
