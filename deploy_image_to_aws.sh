#!/bin/bash

aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/h9v1l3n3

docker tag patch-messenger-repository-public:latest public.ecr.aws/h9v1l3n3/patch-messenger-repository-public:latest

docker push public.ecr.aws/h9v1l3n3/patch-messenger-repository-public:latest
