import { useQuery } from "@tanstack/react-query";
import type { Result } from "~/schema/mobileEmissionSchema";

export function useGetResults() {
  return useQuery({
    queryKey: ["get-results"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/mobile-emission/results")

      if (res.ok) {
        const data = await res.json();

        return data as Result;
      }

      return null;
    },
  });
}
