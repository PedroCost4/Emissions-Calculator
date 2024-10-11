import { zValidator } from "@hono/zod-validator";
import { count, sql } from "drizzle-orm";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { mobileEmissions } from "../db/schema";
import {
  getFuelSpreadSheetInfo,
  getGWPSpreadSheetInfo,
} from "../utils/getSpreadSheetsInfo";
import { paginationSchema } from "../schema/pagination";
import { mobileEmissionCreateSchema } from "../schema/mobileEmission";

export const mobileEmissionsRouter = new Hono()
  .get("/results", async (c) => {
    const mobileEmissionsData = await db.select().from(mobileEmissions);

    const fuelTypesData = await getFuelSpreadSheetInfo();

    const GWPData = await getGWPSpreadSheetInfo();

    const data = mobileEmissionsData
      .map((row) => {
        const fuelTypeInfo = fuelTypesData?.find(
          (fuelType) => fuelType.fuel === row.fuel_type,
        );

        if (fuelTypeInfo?.fuel_type === "Fóssil") {
          const ch4GWP = GWPData.find((gwp) => gwp["Gás"].includes("CH4"))?.GWP;
          const ch4Emission =
            fuelTypeInfo.fe_CH4 * Number(row.quantity) * Number(ch4GWP);

          const n2oGWP = GWPData.find((gwp) => gwp.Gás.includes("N2O"))?.GWP;
          const n2oEmission =
            fuelTypeInfo.fe_N2O * Number(row.quantity) * Number(n2oGWP);

          const co2GWP = GWPData.find((gwp) => gwp.Gás.includes("CO2"))?.GWP;
          const co2Emission =
            fuelTypeInfo.fe_CO2 * Number(row.quantity) * Number(co2GWP);

          return {
            ch4: ch4Emission,
            n2o: n2oEmission,
            co2e: co2Emission,
            co2: 0,
          };
        }

        if (fuelTypeInfo?.fuel_type === "Biocombustível") {
          const ch4GWP = GWPData.find((gwp) => gwp.Gás.includes("CH4"))?.GWP;
          const ch4Emission =
            fuelTypeInfo.fe_CH4 * Number(row.quantity) * Number(ch4GWP);

          const n2oGWP = GWPData.find((gwp) => gwp.Gás.includes("N2O"))?.GWP;
          const n2oEmission =
            fuelTypeInfo.fe_N2O * Number(row.quantity) * Number(n2oGWP);

          const co2Emission = Number(row.quantity) * fuelTypeInfo.fe_CO2;

          return {
            ch4: ch4Emission,
            n2o: n2oEmission,
            co2e: 0,
            co2: co2Emission,
          };
        }

        return {
          ch4: 0,
          n2o: 0,
          co2e: 0,
          co2: 0,
        };
      })
      .reduce(
        (acc, curr) => {
          acc.co2e += curr.co2e;
          acc.ch4 += curr.ch4;
          acc.n2o += curr.n2o;
          acc.co2 += curr.co2;
          return acc;
        },
        {
          co2: 0,
          ch4: 0,
          n2o: 0,
          co2e: 0,
        },
      );

    return c.json(data);
  })
  .get("/many", zValidator("query", paginationSchema), async (c) => {
    const { skip, take } = c.req.valid("query");

    const mobileEmissionsData = await db
      .select()
      .from(mobileEmissions)
      .limit(Number(take))
      .offset(Number(skip));

    const total = await db
      .select({
        count: count(),
      })
      .from(mobileEmissions);

    const fuelTypesData = await getFuelSpreadSheetInfo();

    const GWPData = await getGWPSpreadSheetInfo();

    const completeData = mobileEmissionsData.map((row) => {
      const fuelTypeInfo = fuelTypesData?.find(
        (fuelType) => fuelType.fuel === row.fuel_type,
      );

      if (fuelTypeInfo?.fuel_type === "Fóssil") {
        const ch4GWP = GWPData.find((gwp) => gwp["Gás"].includes("CH4"))?.GWP;
        const ch4Emission =
          fuelTypeInfo.fe_CH4 * Number(row.quantity) * Number(ch4GWP);

        const n2oGWP = GWPData.find((gwp) => gwp.Gás.includes("N2O"))?.GWP;
        const n2oEmission =
          fuelTypeInfo.fe_N2O * Number(row.quantity) * Number(n2oGWP);

        const co2GWP = GWPData.find((gwp) => gwp.Gás.includes("CO2"))?.GWP;
        const co2Emission =
          fuelTypeInfo.fe_CO2 * Number(row.quantity) * Number(co2GWP);

        return {
          ...row,
          co2e: ch4Emission + n2oEmission + co2Emission,
        };
      }

      if (fuelTypeInfo?.fuel_type === "Biocombustível") {
        const ch4GWP = GWPData.find((gwp) => gwp.Gás.includes("CH4"))?.GWP;
        const ch4Emission =
          fuelTypeInfo.fe_CH4 * Number(row.quantity) * Number(ch4GWP);

        const n2oGWP = GWPData.find((gwp) => gwp.Gás.includes("N2O"))?.GWP;
        const n2oEmission =
          fuelTypeInfo.fe_N2O * Number(row.quantity) * Number(n2oGWP);

        return {
          ...row,
          co2e: ch4Emission + n2oEmission,
        };
      }

      return {
        ...row,
        co2e: 0,
      };
    });

    return c.json({
      data: completeData,
      total: total[0]?.count ?? 0,
    });
  })
  .post("/", zValidator("json", mobileEmissionCreateSchema), async (c) => {
    const { quantity, ...data } = c.req.valid("json");

    const res = await db
      .insert(mobileEmissions)
      .values({
        id: uuidv4(),
        quantity: sql`${quantity}::numeric`,
        ...data,
      })
      .returning();

    return c.json(res);
  });
