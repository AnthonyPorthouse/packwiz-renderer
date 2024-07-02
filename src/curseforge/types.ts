export interface ModResponse {
  data: CurseforgeMod[];
}

export interface FileResponse {
  data: File[]
}

interface ModLinks {
  websiteUrl: string;
  wikiUrl: string;
  issuesUrl: string;
  sourceUrl: string;
}
enum ModStatus {
  New = 1,
  ChangesRequired,
  UnderSoftReview,
  Approved,
  Rejected,
  ChangesMade,
  Inactive,
  Abandoned,
  Deleted,
  UnderReview,
}

export interface Category {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  url: string;
  iconUrl: string;
  dateModified: string;
  isClass: boolean | null;
  classId: number | null;
  parentCategoryId: number | null;
  displayIndex: number | null;
}

interface ModAuthor {
  id: number;
  name: string;
  url: string;
}

interface ModAsset {
  id: number;
  modId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
}

interface File {
  id: number;
  gameId: number;
  modId: number;
  isAvailable: boolean;

  displayName: string;
  fileName: string;

  // releaseType: FileReleaseType
  // fileStatus: FileStatus
  // hashes: FileHash[]
  // fileDate: string
  // fileLength: number
  // downloadCount: number
  // fileSizeOnDisk: number|null
  // downloadUrl: string
  // gameVersions: string[]
  // sortableGameVersions: SortableGameVersion[]
  // dependencies: FileDependency[]
}

export interface CurseforgeMod {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  links: ModLinks;

  summary: string;
  status: ModStatus;

  downloadCount: number;
  isFeatured: boolean;
  primaryCategoryId: number;

  categories: Category[];
  classId: number;
  authors: ModAuthor[];

  logo: ModAsset;
  screenshots: ModAsset[];
  latestFiles: File[];
  // latestFileIndexes: FileIndex[]
  // latestEarlyAccessFileIndexes: FileIndex[]

  dateCreated: string;
  dateModified: string;
  dateReleased: string;

  allowModDistribution: boolean | null;
  gamePopularityRank: number;
  isAvailable: boolean;

  thumbsUpCount: number;
  rating: number | null;
}
