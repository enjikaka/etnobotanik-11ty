FROM node:20 as builder

WORKDIR /usr/src/app
COPY . .
ENV CI=1
RUN npm ci
RUN npm run build

FROM joseluisq/static-web-server
ADD _site public
ENV SERVER_PORT=5000
EXPOSE 5000
