#!/bin/bash

echo "Shell script to build image"
APP=$1
TYPE=$2
TAG=$(jq -S -r '.version' package.json)

echo "APP $APP"
echo "TYPE $TYPE"
echo "TAG $TAG"

if [ "$APP" == "" ]
then
  echo "Error: name of app required"
  exit 1
fi

if [ "$TYPE" != "nodejs" ] && [ "$TYPE" != "react" ]
then
  echo "Error: only 'nodejs' and 'react' TYPE Dockerfiles supported"
  exit 1
fi

echo Running:
echo docker build -f dockerfiles/Dockerfile."$TYPE" --build-arg APP="$APP" -t "$APP":"$TAG" .
docker build -f dockerfiles/Dockerfile."$TYPE" --build-arg APP="$APP" -t "$APP":"$TAG" .