import { useMutation } from "@tanstack/react-query";
import type { MobileEmissionCreateSchema } from "~/schema/mobileEmissionSchema";

export function useCreateEmission() {
  return useMutation({
    mutationKey: ["create-emission"],
    mutationFn: async (data: MobileEmissionCreateSchema) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/mobile-emission`;
      return await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
  })
}