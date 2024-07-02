import axios from "axios";
import { version } from "../package.json";

export function getModrinthClient() {
  return axios.create({
    baseURL: "https://api.modrinth.com/",
    headers: {
      "User-Agent": `anthonyporthouse/packwiz-renderer/${version} (anthony@porthou.se)`,
    },
  });
}

export function getCurseforgeClient() {
  return axios.create({
    baseURL: "https://api.curseforge.com/",
    headers: {
      "User-Agent": `anthonyporthouse/packwiz-renderer/${version} (anthony@porthou.se)`,
      "x-api-key": process.env.CURSEFORGE_KEY,
    },
  });
}
