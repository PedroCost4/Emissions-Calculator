import { useMutation } from "@tanstack/react-query";
import type { MobileEmissionCreateSchema } from "~/schema/mobileEmissionSchema";

export function useCreateEmission() {
  return useMutation({
    mutationKey: ["create-emission"],
    mutationFn: async (data: MobileEmissionCreateSchema) => {
      return await fetch(`${process.env.API_URL}/mobile-emission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
  })
}