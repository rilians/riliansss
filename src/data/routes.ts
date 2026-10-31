import type { CareerRoute } from "../types";

/** Schematic map canvas in SVG units. */
export const MAP_W = 1200;
export const MAP_H = 780;

/**
 * ROUTE NETWORK — Egi Apriliansyah's real career, mapped as a transit system.
 * Waypoints snap to the schematic grid; bends are 45°/90°.
 */
export const ROUTES: CareerRoute[] = [
  {
    id: "build",
    code: "01",
    name: "Build",
    tagline: "Engineering & implementation",
    color: "#F06442",
    description:
      "The engineering line — internships, freelance builds and academic research: PHP & SQL features, a shipped Next.js product, and a C4.5 + NLG thesis.",
    stationIds: ["informatics", "fullstack-intern", "thesis", "misi-warga"],
    waypoints: [
      [100, 470],
      [500, 470],
      [620, 350],
      [860, 350],
      [980, 230],
      [1120, 230],
    ],
  },
  {
    id: "connect",
    code: "02",
    name: "Connect",
    tagline: "People, communication & creative work",
    color: "#387D78",
    description:
      "The people line — digital-literacy education, organizational leadership across four ministries, content production, and self-initiated visual design studies.",
    stationIds: ["digital-literacy", "bem-vice-president", "content-creator-intern", "visual-stories"],
    waypoints: [
      [230, 100],
      [330, 200],
      [330, 470],
      [490, 630],
      [860, 630],
      [980, 510],
      [1100, 510],
    ],
  },
  {
    id: "support",
    code: "03",
    name: "Support",
    tagline: "Operations, coordination & service",
    color: "#5268AC",
    description:
      "The operations line — delivering a 500+-attendee festival on an IDR 45M budget, coordinating a 30+-member board, and building IT service-desk tooling.",
    stationIds: ["event-chair", "bem-vice-president", "nusaops", "opis"],
    waypoints: [
      [130, 700],
      [450, 700],
      [570, 580],
      [840, 580],
      [960, 460],
      [1100, 460],
    ],
  },
  {
    id: "explore",
    code: "04",
    name: "Explore",
    tagline: "Learning & experiments",
    color: "#E4BD52",
    description:
      "The frontier line — Scrum, networking and Python certifications, independent data tooling, creative-coding experiments, and this portfolio itself.",
    stationIds: ["certifications", "data-tools", "creative-coding", "life-in-routes"],
    waypoints: [
      [150, 240],
      [595, 240],
      [715, 360],
      [900, 360],
    ],
  },
];

export const ROUTE_MAP: Record<string, CareerRoute> = Object.fromEntries(
  ROUTES.map((r) => [r.id, r]),
);

export const ROUTE_IDS = ROUTES.map((r) => r.id) as CareerRoute["id"][];

export function isRouteId(value: string | null | undefined): value is CareerRoute["id"] {
  return typeof value === "string" && Object.hasOwn(ROUTE_MAP, value);
}
