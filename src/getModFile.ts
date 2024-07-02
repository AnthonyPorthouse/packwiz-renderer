import { readFileSync } from "node:fs";
import { parse } from "smol-toml";
export type ModFile = ExternalFile | ModrinthFile | CurseforgeFile;

interface BaseModFile {
  name: string;
  filename: string;
  side: "client" | "server" | "both";

  download: {
    "hash-format": string;
    hash: string;
  };

  update?: {};
}

export interface ExternalFile extends BaseModFile {
  download: {
    url: string;
    "hash-format": string;
    hash: string;
  };
}

export interface ModrinthFile extends BaseModFile {
  download: {
    url: string;
    "hash-format": string;
    hash: string;
  };

  update: {
    modrinth: {
      "mod-id": string;
      version: string;
    };
  };
}

export interface CurseforgeFile extends BaseModFile {
  download: {
    mode: string;
    "hash-format": string;
    hash: string;
  };

  update: {
    curseforge: {
      "project-id": number;
      "file-id": number;
    };
  };
}

function isModFile(data: object): data is ModFile {
  return "side" in data;
}

export function getModFile(packPath: string, filePath: string): ModFile {
  const data = readFileSync(`${packPath}/${filePath}`, "utf-8");
  const modFile = parse(data);

  if (!isModFile(modFile)) {
    throw Error("Not a valid mod file");
  }

  return modFile;
}

export function isExternalFile(file: ModFile): file is ExternalFile {
  return file.update === undefined || Object.keys(file.update).length === 0;
}

export function isModrinthFile(file: ModFile): file is ModrinthFile {
  return file.update != undefined && "modrinth" in file.update;
}

export function isCurseforgeFile(file: ModFile): file is CurseforgeFile {
  return file.update != undefined && "curseforge" in file.update;
}
