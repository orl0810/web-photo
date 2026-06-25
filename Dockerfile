# -------- BUILD STAGE --------
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# -------- RUNTIME STAGE --------
FROM node:20-alpine

WORKDIR /app

COPY server.mjs ./
COPY --from=builder /app/dist ./dist

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "server.mjs"]
