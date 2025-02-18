FROM node:23-alpine

WORKDIR /app

RUN npm i -g turbo@^2.3.4
COPY . .
RUN turbo prune webapp --docker

RUN npm ci && mkdir -p ./node_modules/.vite

ENV NODE_ENV=development

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "dev:webapp"]
