import { useQuery } from "@tanstack/react-query";
import type {
  MobileEmissionsReponse,
  Pagination,
} from "~/schema/mobileEmissionSchema";

type UseGetEmissionProps = Pagination;

export function useGetEmissions({ skip, take }: UseGetEmissionProps) {
  return useQuery({
    queryKey: ["get-emissions"],
    queryFn: async () => {
      const params = new URLSearchParams({
        skip: skip.toString(),
        take: take.toString(),
      }).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/mobile-emission/many?${params}`;

      const res = await fetch(url, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        return data as MobileEmissionsReponse;
      }

      return null;
    },
  });
}
