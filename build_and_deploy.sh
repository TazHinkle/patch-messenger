#!/bin/bash

docker build -t patch-messenger-repository-public .

docker tag patch-messenger-repository-public:latest public.ecr.aws/h9v1l3n3/patch-messenger-repository-public:latest

docker push public.ecr.aws/h9v1l3n3/patch-messenger-repository-public:latest
