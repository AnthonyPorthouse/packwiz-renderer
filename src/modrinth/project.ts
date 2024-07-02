type Support = "required" | "optional" | "unsupported";

type RequestStatus = "approved" | "archived" | "unlisted" | "private" | "draft";
type Status =
  | RequestStatus
  | "rejected"
  | "processing"
  | "withheld"
  | "scheduld"
  | "unknown";

type ProjectType = "mod" | "modpack" | "shader" | "resourcepack";

type MonetizationStatus = "monetized" | "demonetized" | "force-demonetized";

export interface ModrithProject {
  slug: string;
  title: string;
  description: string;
  categories: string[];
  client_side: Support;
  server_side: Support;
  body: string;
  status: Status;
  requested_status?: RequestStatus;
  additional_categories?: string[];
  issues_url?: string | null;
  source_url?: string | null;
  wiki_url?: string | null;
  discord_url?: string | null;
  donation_urls?: {
    id: string;
    platform: string;
    url: string;
  }[];
  project_type: ProjectType;
  downloads: number;
  icon_url?: string | null;
  color?: number | null;
  thread_id?: string;
  monetization_status?: MonetizationStatus;
  id: string;
  team: string;

  published: string;
  updated: string;
  approved?: string | null;
  queued?: string | null;

  followers: number;

  license?: {
    id: string;
    name: string;
    url: string | null;
  };

  versions?: string[];
  game_versions?: string[];
  loaders?: string[];
  gallery?: {
    url: string;
    featured: boolean;
    title?: string | null;
    description?: string | null;
    created: string;
    ordering?: number;
  }[];
}

export interface ModrinthVersion {
  id: string;
  project_id: string;
}
