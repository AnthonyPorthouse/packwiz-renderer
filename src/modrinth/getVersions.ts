import { getModrinthClient } from "../http.js";
import type { ModrinthVersion } from "./project.js";

export async function getVersions(versions: string[]) {
  const client = getModrinthClient();

  try {
    const res = await client.get<ModrinthVersion[]>("/v2/versions", {
      params: {
        ids: JSON.stringify(versions),
      },
    });

    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
