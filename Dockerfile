FROM node:10.1.0

# Create directories and ensure good permissions
RUN chown -R root /opt
RUN chmod 755 /usr/local/bin/*

RUN mkdir -p /app

ENV PATH "$PATH:/app/node_modules/.bin"

RUN apt-get update && apt-get install -y \
  libjpeg-dev \
  libpng12-dev

# npm install
COPY package.json yarn.lock /tmp/
RUN cd /tmp && \
    yarn install -d --frozen-lockfile && \
    yarn cache clean && \
    mv /tmp/node_modules /app/

RUN apt-get purge -y \
  automake \
  autoconf \
  gcc \
  g++ \
  make python

ENV NODE_ENV=production
ARG ENV_FILE=local

# Copy app
WORKDIR /app

COPY . /app/
COPY ./.env.$ENV_FILE /app/.env

RUN yarn build

USER node

#CMD yarn start
