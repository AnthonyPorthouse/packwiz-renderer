import "@templates/templates.js";
import Handlebars from "handlebars";
import type { PackFile } from "./getPackFile.js";
import { NormalizedModData } from "./types.js";

export function render(
  pack: PackFile,
  sortedProjects: NormalizedModData[],
): string {
  Handlebars.registerHelper(
    "lte",
    (val1: number, val2: number) => val1 <= val2,
  );
  Handlebars.registerHelper(
    "gte",
    (val1: number, val2: number) => val1 >= val2,
  );

  Handlebars.registerPartial("item", Handlebars.templates["item"]);

  const template = Handlebars.templates["index"];

  return template({
    pack: pack,
    mods: sortedProjects.filter((project) => project.type === "mod"),
    resourcePacks: sortedProjects.filter(
      (project) => project.type === "resourcepack",
    ),
    versions: {},
  });
}
