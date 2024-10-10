import { useQuery } from "@tanstack/react-query";
import type { MobileEmissionWithCO2, Pagination } from "~/schema/mobileEmissionSchema";

type UseGetEmissionProps = Pagination

export function useGetEmissions({skip, take}: UseGetEmissionProps) {
  return useQuery({
    queryKey: ["get-emissions"],
    queryFn: async () => {
      const res = await fetch(`${process.env.API_URL}/mobile-emission/many`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skip,
          take
        })
      });

      if (res.ok) {
        const data = await res.json();

        return data as MobileEmissionWithCO2[];
      }

      return null;
    },
  });
}
