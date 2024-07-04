import { ModrinthFile } from "@/getModFile";
import { NormalizedModData } from "@/types";
import chalk from "chalk";
import { getProjects } from "./getProjects";
import { getVersions } from "./getVersions";

export async function normalizeModrinthModData(mods: ModrinthFile[]) {
  const modData = await getProjects(
    mods.map((mod) => mod.update.modrinth["mod-id"]),
  );
  const versions = await getVersions(
    mods.map((mod) => mod.update.modrinth["version"]),
  );

  return modData.map((mod): NormalizedModData => {
    console.log(
      `${chalk.green("Mod:")} ${mod.title} ${chalk.gray(versions[mod.id])}`,
    );
    return {
      source: "modrinth",
      title: mod.title,
      summary: mod.description,
      logoUrl: mod.icon_url ?? "",
      url: `https://modrinth.com/mod/${mod.id}`,
      type: mod.project_type,
      version: versions[mod.id],
    };
  });
}
