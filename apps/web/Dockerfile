FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --force

COPY --from=builder /app/out/full/ .

RUN pnpm turbo build --filter=web...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 honojs
RUN adduser --system --uid 1001 honojs
USER honojs
COPY --from=installer /app .

CMD node apps/web/dist/index.js