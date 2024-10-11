FROM node:18-slim  AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune server --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm turbo build --filter=server...

FROM base AS runner
WORKDIR /app
COPY --from=installer /app .

USER root

# ENV DATABASE_URL postgresql://postgres:password@db:5432/zaya

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

RUN chmod -R 777 apps/server/docker.sh

CMD sh apps/server/docker.sh