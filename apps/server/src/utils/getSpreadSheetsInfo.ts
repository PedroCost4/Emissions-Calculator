import PublicGoogleSheetsParser from "public-google-sheets-parser";
import type { FuelTypeSheet, GWP } from "../schema/sheetsInfo";

const spreadsheetId = "1HRMglGyAjlrp4axVZtU3RqJds2r5ASViwVc0xjCUJrE";

export async function getFuelSpreadSheetInfo() {
  const fuelTypesParser = new PublicGoogleSheetsParser(spreadsheetId, {
    sheetName: "Combustíveis",
  });
  const fuelTypesData = await fuelTypesParser.parse() as FuelTypeSheet[]
  return fuelTypesData;
}

export async function getGWPSpreadSheetInfo() {
  const fuelGWPParser = new PublicGoogleSheetsParser(spreadsheetId, {
    sheetName: "GWP",
  });
  const GWPData = await fuelGWPParser.parse() as GWP[]
  return GWPData;
}
