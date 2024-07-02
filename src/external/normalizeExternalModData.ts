import { ExternalFile } from "@/getModFile";
import { NormalizedModData } from "@/types";
import chalk from "chalk";

export function normalizeExternalModData(mods: ExternalFile[]) {
    return mods.map((mod): NormalizedModData => {
        console.log(`${chalk.green('Mod:')} ${mod.name}`)
        return {
            source: "external",
            title: mod.name,
            summary: "",
            url: mod.download.url,
            logoUrl: "",
            type: "mod",
          };
    })
}
