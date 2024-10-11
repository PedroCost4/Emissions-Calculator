import { z } from "zod";

export const paginationSchema = z.object({
  skip: z.string(),
  take: z.string(),
});