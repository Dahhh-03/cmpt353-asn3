FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install express
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]