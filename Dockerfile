FROM node:20-alpine

WORKDIR /app

COPY  package*.json ./

RUN npm ci

COPY  . . 

ENV PORT=3000

EXPOSE $PORT

CMD [ "npm", "start" ]