FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install express
COPY . .
EXPOSE 80
CMD ["node", "server.js"]