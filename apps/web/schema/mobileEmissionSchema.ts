import { z } from "zod";

export const mobileEmissionSchema = z.object({
  id: z.string(),
  source: z.string(),
  fuel_type: z.string(),
  quantity: z.number(),
  quantity_unit: z.string(),
  mode: z.enum(["road", "rail", "air", "waterway"]),
});

export type MobileEmission = z.infer<typeof mobileEmissionSchema>

export type MobileEmissionsReponse = {
  data: MobileEmissionWithCO2[],
  total: number
}

export type MobileEmissionWithCO2 = MobileEmission & { co2e: number }

export const mobileEmissionCreateSchema = mobileEmissionSchema.omit({
  id: true
}).extend({
  quantity_unit: z.string()
})

export type MobileEmissionCreateSchema = z.infer<typeof mobileEmissionCreateSchema>

export const ResultSchema = z.object({
  co2: z.number(),
  ch4: z.number(),
  n2o: z.number(),
  co2e: z.number(),
})

export type Result = z.infer<typeof ResultSchema>

export const paginationSchema = z.object({
  skip: z.number(),
  take: z.number(),
})

export type Pagination = z.infer<typeof paginationSchema>