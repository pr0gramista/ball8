FROM node:alpine

WORKDIR /app

ADD package.json yarn.lock /app/
RUN yarn install --production --frozen-lockfile

COPY . /app

ENTRYPOINT ["node", "index.js"]

EXPOSE 8080