# pull in full node:16 because we need Python/c compiling for sqlite3
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Node image already has yarn

# Bundle app source
COPY . .

# Install dependencies
RUN yarn install

RUN yarn run build_client

EXPOSE 3000
CMD [ "yarn", "run", "api" ]
