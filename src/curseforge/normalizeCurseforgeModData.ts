import { CurseforgeFile } from "@/getModFile";
import { NormalizedModData } from "@/types";
import chalk from "chalk";
import { getClasses } from "./getClasses";
import { getFiles } from "./getFiles";
import { getMods } from "./getMods";

export async function normalizeCurseforgeModData(mods: CurseforgeFile[]) {
  const modData = await getMods(
    mods.map((mod) => mod.update.curseforge["project-id"]),
  );
  const versions = await getFiles(
    mods.map((mod) => mod.update.curseforge["file-id"]),
  );

  const curseforgeCategories = await getClasses();

  return modData.map((mod): NormalizedModData => {
    console.log(
      `${chalk.green("Mod:")} ${mod.name} ${chalk.gray(versions[mod.id])}`,
    );
    const category = curseforgeCategories.find(
      (cat) => cat.id === mod.classId,
    )!;

    return {
      source: "curseforge",
      title: mod.name,
      summary: mod.summary,
      logoUrl: mod.logo.thumbnailUrl,
      url: `https://curseforge.com/minecraft/${category.slug}/${mod.slug}`,
      type: ((): NormalizedModData["type"] => {
        switch (category.slug) {
          case "mc-mods":
            return "mod";
          case "shaders":
            return "shader";
          case "data-packs":
            return "mod";
          case "texture-packs":
            return "resourcepack";
          default:
            return "mod";
        }
      })(),
      version: versions[mod.id],
    };
  });
}
