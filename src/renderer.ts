import { Eta } from "eta";
import path from "path";
import { version } from "../package.json";
import type { PackFile } from "./getPackFile.js";
import { NormalizedModData } from "./types.js";

export function render(
  pack: PackFile,
  sortedProjects: NormalizedModData[],
): string {
  const eta = new Eta({ views: path.join(__dirname, "..", "templates") });

  return eta.render("./index", {
    pack,
    mods: sortedProjects.filter((project) => project.type === "mod"),
    resourcePacks: sortedProjects.filter(
      (project) => project.type === "resourcepack",
    ),
    version,
  });
}
