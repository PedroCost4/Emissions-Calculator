import { useQuery } from "@tanstack/react-query";
import PublicGoogleSheetsParser from "public-google-sheets-parser";

export function useFuelTypes() {
  return useQuery({
    queryKey: ["fuel-types"],
    queryFn: async () => {
      const spreadsheetId = "1HRMglGyAjlrp4axVZtU3RqJds2r5ASViwVc0xjCUJrE";
     
      const parser = new PublicGoogleSheetsParser(spreadsheetId, {
        sheetName: "Combustíveis"
      });
      return await parser
        .parse()
        .then((data) => data.map((row) => ({
          fuel: row.fuel,
          quantity_unit: row.unit
        })).flat() as {
          fuel: string,
          quantity_unit: string
        }[])
        .catch(() => null);
    },
  });
}
