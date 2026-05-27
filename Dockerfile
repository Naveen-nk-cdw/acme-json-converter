# base image
FROM node:24.16.0-alpine

# application root directory
WORKDIR /app

# copy package.json first for caching
COPY package*.json .

# install dependencies
RUN npm install

# copy rest of the files other than files from .dockerignore
COPY . .

# build the application
RUN npm run build

# expose port 3000
EXPOSE 3000

# startup command
ENTRYPOINT ["npm", "run"]
CMD ["start:prod"]
