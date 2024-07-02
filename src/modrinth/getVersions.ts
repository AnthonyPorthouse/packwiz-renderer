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

    return res.data.reduce((obj: {[key: string]: string}, current) => (obj[current.project_id]=current.version_number, obj) , {});
  } catch (e) {
    console.error(e);
    throw e;
  }
}
