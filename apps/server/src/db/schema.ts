import { sql } from "drizzle-orm";
import {
  date,
  numeric,
  pgEnum,
  pgTable,
  text,
  uuid
} from "drizzle-orm/pg-core";

export const modeEnum = pgEnum("modal_type", ["road", "rail", "air", "waterway"]);

export const mobileEmissions = pgTable("mobile_emissions", {
  id: uuid().primaryKey().$default(() => sql`uuid_generate_v4()`),
  source: text().notNull(),
  fuel_type: text().notNull(),
  quantity: numeric().notNull(),
  quantity_unit: text().notNull(),
  mode: modeEnum().notNull(),
  created_at: date().notNull().defaultNow(),
  updated_at: date().notNull().defaultNow().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
