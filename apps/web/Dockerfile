FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm build --filter=web...

FROM base AS runner
WORKDIR /app
COPY --from=installer /app .

USER root

WORKDIR /app/apps/web

EXPOSE 3001

CMD pnpm start