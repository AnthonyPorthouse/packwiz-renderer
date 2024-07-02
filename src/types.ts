export interface NormalizedModData {
    title: string;
    summary: string;
    url: string;
    logoUrl: string;
    source: "curseforge" | "modrinth" | "external";
    version?: string;
    type: "mod" | "modpack" | "resourcepack" | "shader";
    projectId?: string;
    versionId?: string;
  }
