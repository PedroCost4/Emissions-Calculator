import { z } from "zod"

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