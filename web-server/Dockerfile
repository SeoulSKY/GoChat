FROM node:21.7.3

WORKDIR /app

COPY package.json /app

RUN npm install --omit=dev

COPY . /app

ARG NODE_ENV=production

ENV NODE_ENV=$NODE_ENV

RUN npm run build

CMD ["npm", "start"]
