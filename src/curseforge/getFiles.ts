import { getCurseforgeClient } from "@/http";
import axios from "axios";
import { FileResponse } from "./types";

export async function getFiles(fileIds: number[]) {
  const client = getCurseforgeClient();

  try {
    const res = await client.post<FileResponse>("/v1/mods/files", {
      fileIds,
    });

    return res.data.data.reduce(
      (obj: { [key: string]: string }, current) => (
        (obj[current.modId] = current.displayName), obj
      ),
      {},
    );
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error(e.response);
    } else {
      console.error(e);
    }
    throw e;
  }
}
