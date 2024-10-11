wait-for-it db:5432 -t 10 -- echo "DB is up"

pnpm db:migrate --filter=server

node apps/server/dist/server.js