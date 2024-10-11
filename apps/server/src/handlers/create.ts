import type { Context } from "hono";
import { db } from "src/db";
import { mobileEmissions } from "src/db/schema";
import { mobileEmissionCreateSchema } from "src/schema/mobileEmission";
import { v4 as uuidv4 } from "uuid";
import { sql } from "drizzle-orm";

export const create = async (c: Context) => {
  const { quantity, ...data } = mobileEmissionCreateSchema.parse(await c.req.json());

  const res = await db
    .insert(mobileEmissions)
    .values({
      id: uuidv4(),
      quantity: sql`${quantity}::numeric`,
      ...data,
    })
    .returning();

  return c.json(res);
};
