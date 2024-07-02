import { getCurseforgeClient } from "../http.js";
import type { Category } from "./types.js";

export async function getClasses() {
  const client = getCurseforgeClient();

  const res = await client.get<{ data: Category[] }>("/v1/categories", {
    params: {
      gameId: 432,
      classesOnly: true,
    },
  });

  return res.data.data;
}
