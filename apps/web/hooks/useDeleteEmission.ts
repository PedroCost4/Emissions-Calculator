import { useMutation } from "@tanstack/react-query"

export const useDeleteEmission = () => {
  return useMutation({
    mutationKey: ["delete-emission"],
    mutationFn: async (id: string) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/mobile-emission/${id}`;
      const res = await fetch(url, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        return res.json();
      }

      return null;
    },
  })
}