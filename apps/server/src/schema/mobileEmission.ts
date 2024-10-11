import z from "zod";

export const mobileEmissionSchema = z.object({
  id: z.string(),
  source: z.string(),
  fuel_type: z.string(),
  quantity: z.number(),
  quantity_unit: z.string(),
  mode: z.enum(["road", "rail", "air", "waterway"]),
});

export const mobileEmissionCreateSchema = mobileEmissionSchema.omit({
  id: true
}).extend({
  quantity_unit: z.string()
})