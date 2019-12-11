FROM node:10.16.3-alpine AS dev-stage

WORKDIR /usr/app

COPY package*.json ./

RUN npm i

COPY . .

FROM dev-stage AS build-stage

RUN npm run build

RUN npm i -g pm2@4