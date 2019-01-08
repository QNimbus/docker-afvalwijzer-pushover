FROM node:10.15-alpine

WORKDIR /app
COPY package.json /app
RUN npm install
COPY main.js /app

CMD node main.js