
FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

EXPOSE 8000

RUN ls -al

CMD ["npm", "start"]
