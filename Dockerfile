FROM node:9.2.0-alpine

# Prepare the environment
# RUN apk update && \
#     apk add --no-cache python

RUN mkdir -p /app && \
    chown -R node /app && \
    chown -R node /home/node

ENV PATH "$PATH:/app/node_modules/.bin"

# npm install
COPY package.json yarn.lock /tmp/
RUN cd /tmp && \
    yarn install && \
    yarn cache clean && \
    mv /tmp/node_modules /app/

ENV NODE_ENV=production
ARG ENV_FILE=local

WORKDIR /app

COPY . /app/
COPY ./.env.$ENV_FILE /app/.env

#RUN yarn build
CMD echo "Project built"
