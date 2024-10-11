import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { create } from "src/handlers/create";
import { deleteHandler } from "src/handlers/delete";
import { getMany } from "src/handlers/getMany";
import { getResults } from "src/handlers/getResults";
import {
  deleteEmissionSchema,
  mobileEmissionCreateSchema,
} from "../schema/mobileEmission";
import { paginationSchema } from "../schema/pagination";

export const mobileEmissionsRouter = new Hono()
  .get("/results", getResults)
  .get("/many", zValidator("query", paginationSchema), getMany)
  .post("/", zValidator("json", mobileEmissionCreateSchema), create)
  .delete("/:id", zValidator("param", deleteEmissionSchema), deleteHandler);
