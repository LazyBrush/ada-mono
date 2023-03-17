#!/bin/bash

echo "Shell script to build image"
APP=$1
TAG=$(jq -S -r '.version' package.json)

if [ "$APP" == "" ]
then
  echo "Error: name of app required"
  exit 1
fi

echo Running:
echo docker build --build-arg APP="$APP" -t "$APP":"$TAG" .
docker build --build-arg APP="$APP" -t "$APP":"$TAG" .