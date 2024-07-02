import { getMods } from "@/curseforge/getMods.js";
import { getIndexFile } from "@/getIndexFile.js";
import {
  getModFile,
  isCurseforgeFile,
  isExternalFile,
  isModrinthFile,
} from "@/getModFile.js";
import { getPackFile } from "@/getPackFile.js";
import { getProjects } from "@/modrinth/getProjects.js";
import { NormalizedModData, normalizeModData } from "@/normalizeModData.js";
import { render } from "@/renderer.js";
import { mkdirSync, writeFileSync } from "fs";

export async function buildAction(
  packPath: Readonly<string>,
  options: Readonly<{ output: string }>,
) {
  const pack = getPackFile(packPath);

  const index = getIndexFile(packPath, pack.index.file);
  const mods = index.files.map((file) => getModFile(packPath, file.file));

  const projects: NormalizedModData[] = [];

  try {
    const modrinthProjects = mods
      .filter(isModrinthFile)
      .map((mod) => mod.update.modrinth["mod-id"]);

    const modrinthMods = await getProjects(modrinthProjects);

    const curseforgeModIds = mods
      .filter(isCurseforgeFile)
      .map((mod) => mod.update.curseforge["project-id"]);
    const curseforgeMods = await getMods(curseforgeModIds);

    projects.push(
      ...(await normalizeModData([
        ...modrinthMods,
        ...curseforgeMods,
        ...mods.filter(isExternalFile),
      ])),
    );
  } catch (e) {
    console.error(e);
    return;
  }

  const sortedProjects = projects.sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const output = render(pack, sortedProjects);

  mkdirSync(options.output, { recursive: true });

  writeFileSync(`${options.output}/index.html`, output);
}
