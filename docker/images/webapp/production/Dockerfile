FROM node:23-alpine AS base

FROM base AS builder
RUN apk update
WORKDIR /app
RUN npm i -g turbo@^2.3.4
COPY . .
RUN turbo prune webapp --docker

FROM base AS installer
RUN apk update
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm ci && mkdir -p ./node_modules/.vite

# Build the project
COPY --from=builder /app/out/full/ .
RUN npm i -g turbo@^2.3.4
RUN turbo run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 webuser
RUN adduser --system --uid 1001 webuser
USER webuser

COPY --from=installer --chown=webuser:webuser /app/apps/webapp/server.js ./server.js
COPY --from=installer --chown=webuser:webuser /app/apps/webapp/package*.json ./
COPY --from=installer --chown=webuser:webuser /app/node_modules ./node_modules
COPY --from=installer --chown=webuser:webuser /app/apps/webapp/build ./build

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["node", "/app/server.js"]
