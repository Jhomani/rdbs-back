# RUN AS
#
# docker build -t node-cd-sl .

FROM node:16.14.0-alpine3.15

RUN apk add --no-cache yarn
RUN npm i -g serverless

USER node

RUN mkdir -p ~/.aws
