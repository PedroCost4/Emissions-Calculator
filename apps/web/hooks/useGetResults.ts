import { useQuery } from "@tanstack/react-query";
import type { Result } from "~/schema/mobileEmissionSchema";

export function useGetResults() {
  return useQuery({
    queryKey: ["get-results"],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/mobile-emission/results`
      const res = await fetch(url)

      if (res.ok) {
        const data = await res.json();

        return data as Result;
      }

      return null;
    },
  });
}
