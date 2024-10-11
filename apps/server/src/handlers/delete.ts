import { sql } from "drizzle-orm";
import type { Context } from "hono"
import { db } from "src/db";
import { mobileEmissions } from "src/db/schema";

export const deleteHandler = async (c: Context) => {
  const { id } = c.req.param()

  const emission = await db.select().from(mobileEmissions).where(sql`id = ${id}`);

  if (!emission) {
    return c.json({ error: "Emissão não encontrada" });
  }

  const deleted = await db.delete(mobileEmissions).where(sql`id = ${id}`).returning().execute();

  console.log(deleted)

  return c.json(deleted);
}