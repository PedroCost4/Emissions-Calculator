import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { mobileEmissionsRouter } from "./routers/mobileEmissionRouter";
import "dotenv/config";

const app = new Hono();

console.log(process.env.DATABASE_URL)

app.use("/*", cors());
app.get("/", (c) => {
  return c.text("Hello World!");
});
app.route("/mobile-emission", mobileEmissionsRouter);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
