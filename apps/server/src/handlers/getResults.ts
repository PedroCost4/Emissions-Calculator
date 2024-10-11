import type { Context } from "hono";
import { db } from "src/db";
import { mobileEmissions } from "src/db/schema";
import {
  getFuelSpreadSheetInfo,
  getGWPSpreadSheetInfo,
} from "src/utils/getSpreadSheetsInfo";

export const getResults = async (c: Context) => {
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
};
