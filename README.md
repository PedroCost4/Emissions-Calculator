# Source emissions calculator


## Run the app locally


### With docker

- first command is a workaround for env problems in docker
```bash
cp apps/web/.env.example apps/web/.env && cp apps/server/.env.example apps/server/.env 
docker compose up -d

```

### Without docker

- Install dependencies
```bash
pnpm install
```

```bash
pnpm dev
``

