#!/usr/bin/env bash

#https://docs.travis-ci.com/user/environment-variables/#convenience-variables
#https://docs.travis-ci.com/user/deployment/script/

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

if [ "$TRAVIS_BRANCH" = "development" ]; then
    echo "Deploy da imagem de desenvolvimento..."
    docker push marcelomaia/terceirizadas_frontend
fi

tag="$TRAVIS_TAG"
if [ -n "$tag" ]; then
    echo "Deploy da imagem de produção..."
    docker tag marcelomaia/terceirizadas_frontend:latest marcelomaia/terceirizadas_frontend:$tag
    docker push marcelomaia/terceirizadas_frontend:$tag
fi
