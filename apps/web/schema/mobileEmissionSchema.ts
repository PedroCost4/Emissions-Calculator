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

export type MobileEmissionWithCO2 = MobileEmission & { co2e: number }

export const mobileEmissionCreateSchema = mobileEmissionSchema.omit({
  id: true
}).extend({
  quantity_unit: z.string()
})

export type MobileEmissionCreateSchema = z.infer<typeof mobileEmissionCreateSchema>

export const FuelTypeSheetSchema = z.object({
  fuel: z.string(),
  fuel_type: z.enum(["Fóssil", "Biocombustível"]),
  subdivision: z.number(),
  unit: z.string(),
  "PCI(kcal/kg)": z.number(),
  density: z.number(),
  reference: z.string(),
  fe_CO2: z.number(),
  fe_CH4: z.number(),
  fe_N2O: z.number(),
})

export type FuelTypeSheet = z.infer<typeof FuelTypeSheetSchema>

export const GWPSchema = z.object({
  "Gás": z.string(),
  GWP: z.number(),
  "referência": z.string(),
})

export type GWP = z.infer<typeof GWPSchema>

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