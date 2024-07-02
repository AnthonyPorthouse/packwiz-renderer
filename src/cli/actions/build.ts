import { normalizeCurseforgeModData } from "@/curseforge/normalizeCurseforgeModData";
import { normalizeExternalModData } from "@/external/normalizeExternalModData";
import { getIndexFile } from "@/getIndexFile.js";
import {
  getModFile,
  isCurseforgeFile,
  isExternalFile,
  isModrinthFile
} from "@/getModFile.js";
import { getPackFile } from "@/getPackFile.js";
import { normalizeModrinthModData } from "@/modrinth/normalizeModrinthModData";
import { render } from "@/renderer.js";
import { NormalizedModData } from "@/types";
import chalk from "chalk";
import { mkdirSync, writeFileSync } from "fs";

export async function buildAction(
  packPath: Readonly<string>,
  options: Readonly<{ output: string }>,
) {
  console.log(`${chalk.blue("Info: ")} Parsing Pack`);

  const pack = getPackFile(packPath);
  const index = getIndexFile(packPath, pack.index.file);

  console.log(`${chalk.blue("Info: ")} Parsing Mod Files`);
  const mods = index.files.map((file) => getModFile(packPath, file.file));

  const projects: NormalizedModData[] = [];

  console.log(`${chalk.blue("Info: ")} Fetching Modrinth Metadata`);
  projects.push(...await normalizeModrinthModData(mods.filter(isModrinthFile)))

  console.log(`${chalk.blue("Info: ")} Fetching Cursforge Metadata`);
  projects.push(...await normalizeCurseforgeModData(mods.filter(isCurseforgeFile)))

  console.log(`${chalk.blue("Info: ")} Fetching External File Metadata`);
  projects.push(...normalizeExternalModData(mods.filter(isExternalFile)))

  const sortedProjects = projects.sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  console.log(`${chalk.blue("Info: ")} Rendering Template`);

  const output = render(pack, sortedProjects);

  console.log(
    `${chalk.blue("Info: ")} Outputting to ${options.output}/index.html`,
  );
  mkdirSync(options.output, { recursive: true });
  writeFileSync(`${options.output}/index.html`, output);
}
