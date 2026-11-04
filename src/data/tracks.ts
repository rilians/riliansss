import type { TrackId } from "../types";

/**
 * WORK TRACKS — the Selected Works gallery is organised as technology lines,
 * mirroring the journey map: each stack gets its own colored line, and new
 * lines can be added here as new stacks enter the network.
 */
export interface WorkTrack {
  id: TrackId;
  code: string;
  name: string;
  tagline: string;
  color: string;
  description: string;
}

export const TRACKS: WorkTrack[] = [
  {
    id: "react",
    code: "R",
    name: "React & Interactive Web",
    tagline: "Products & browser-native experiences",
    color: "#F06442",
    description:
      "Browser-native products and experiments built with React — Motion, Three.js, canvas work and interfaces that treat the browser as a material.",
  },
  {
    id: "next",
    code: "N",
    name: "Next.js Applications",
    tagline: "Full-stack products & web applications",
    color: "#387D78",
    description:
      "Applications built with Next.js — from mobile-first learning experiences to process intelligence and connected workspaces.",
  },
  {
    id: "python",
    code: "P",
    name: "Python & Data Systems",
    tagline: "Operations, data quality & decision support",
    color: "#5268AC",
    description:
      "Service platforms and analytical tooling — FastAPI backends, explainable rule-based logic, validation engines and dashboards built for real operational questions.",
  },
  {
    id: "design",
    code: "D",
    name: "Design & Editorial",
    tagline: "Visual studies & landing pages",
    color: "#E4BD52",
    description:
      "Self-initiated visual explorations — original posters, typographic systems and story-led landing pages where art direction and front-end execution meet.",
  },
];

export const TRACK_MAP: Record<string, WorkTrack> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t]),
);
