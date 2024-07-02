import { getClasses } from "./curseforge/getClasses.js";
import type { CurseforgeMod } from "./curseforge/types.js";
import type { ExternalFile } from "./getModFile.js";
import type { ModrithProject } from "./modrinth/project.js";

export interface NormalizedModData {
  title: string;
  summary: string;
  url: string;
  logoUrl: string;
  source: "curseforge" | "modrinth" | "external";
  version?: string;
  type: "mod" | "modpack" | "resourcepack" | "shader";
}

function isModrinthMod(
  mod: CurseforgeMod | ModrithProject | ExternalFile,
): mod is ModrithProject {
  return "client_side" in mod;
}

function isExternalFile(
  mod: CurseforgeMod | ModrithProject | ExternalFile,
): mod is ExternalFile {
  return "download" in mod;
}

export async function normalizeModData(
  mods: (CurseforgeMod | ModrithProject | ExternalFile)[],
) {
  const curseforgeCategories = await getClasses();

  return mods.map((mod): NormalizedModData => {
    if (isExternalFile(mod)) {
      return {
        source: "external",
        title: mod.name,
        summary: "",
        url: mod.download.url,
        logoUrl: "",
        type: "mod",
      };
    }

    if (isModrinthMod(mod)) {
      return {
        source: "modrinth",
        title: mod.title,
        summary: mod.description,
        logoUrl: mod.icon_url ?? "",
        url: `https://modrinth.com/mod/${mod.id}`,
        type: mod.project_type,
      };
    }

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
    };
  });
}
