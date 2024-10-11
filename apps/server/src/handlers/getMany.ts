import { count } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "src/db";
import { mobileEmissions } from "src/db/schema";
import { paginationSchema } from "src/schema/pagination";
import {
  getFuelSpreadSheetInfo,
  getGWPSpreadSheetInfo,
} from "src/utils/getSpreadSheetsInfo";

export const getMany = async (c: Context) => {
  const { skip, take } = paginationSchema.parse(c.req.query());

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
};
