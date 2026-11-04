export type RouteId = "build" | "connect" | "support" | "explore";

/** Technology tracks used by the Selected Works gallery. */
export type TrackId = "react" | "next" | "python" | "design";
export type ProjectClassification =
  | "Freelance / Client Work"
  | "Academic Project"
  | "Independent Build"
  | "Concept / Experimental Study"
  | "Fan Concept / Unofficial Study";

export type StationType = "regular" | "interchange" | "terminal" | "transfer";

export type LabelPos = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export interface CareerRoute {
  id: RouteId;
  /** Two-digit line number, e.g. "01" */
  code: string;
  name: string;
  tagline: string;
  color: string;
  description: string;
  /** Ordered station ids along the line */
  stationIds: string[];
  /** Schematic waypoints in map units (1200 x 780 canvas) */
  waypoints: [number, number][];
}

export interface CareerStation {
  id: string;
  /** Defaults to the existing id for legacy stations. */
  slug?: string;
  status?: "draft" | "published";
  createdAt?: string;
  publishedAt?: string;
  /** Provenance when a station publication date is approximated from a public repository. */
  publicationSource?: "github-repository-created";
  isFeatured?: boolean;
  /** Station code, e.g. "ST-01" */
  code: string;
  name: string;
  type: StationType;
  routeIds: RouteId[];
  x: number;
  y: number;
  labelPos: LabelPos;
  category: string;
  period: string;
  /** Chronological order for the timeline view */
  order: number;
  short: string;
  context: string;
  challenge: string;
  journey: string;
  outcome: string;
  skills: string[];
  projectIds: string[];
}

export interface ProjectProcessStep {
  title: string;
  text: string;
}

export interface Certification {
  title: string;
  issuer: string;
  href: string;
  note?: string;
}

export interface Highlight {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  classification: ProjectClassification;
  year: string;
  role: string;
  status: string;
  routeId: RouteId;
  /** Which technology track this project belongs to (works gallery). */
  track: TrackId;
  /** Live demo URL, if deployed. */
  demoUrl?: string;
  /** Repository URL, if public. */
  repoUrl?: string;
  /** Short badges, e.g. "Live · Open source". */
  badges?: string[];
  /** Full case study (deep sections) vs. compact project record. */
  caseStudy?: boolean;
  summary: string;
  description: string;
  problem?: string;
  objectives?: string[];
  stack: string[];
  process?: ProjectProcessStep[];
  results?: string[];
  lessons?: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

export interface Certification {
  title: string;
  issuer: string;
  href: string;
  note?: string;
}

export interface Highlight {
  value: string;
  label: string;
}

export interface SkillCluster {
  routeId: RouteId;
  title: string;
  skills: string[];
}

export interface ProfileLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface EducationEntry {
  period: string;
  title: string;
  place: string;
  note: string;
}

export interface Profile {
  name: string;
  role: string;
  phone?: string;
  tagline: string;
  location: string;
  status: string;
  email: string;
  availability: string;
  bio: string[];
  philosophy: string;
  skillClusters: SkillCluster[];
  tools: string[];
  education: EducationEntry[];
  certifications?: Certification[];
  highlights?: Highlight[];
  interests: string[];
  links: ProfileLink[];
  languages: string[];
}
