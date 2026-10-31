import { PROJECTS } from "../data/projects";
import { ROUTES } from "../data/routes";
import { STATIONS } from "../data/stations";
import type { CareerStation, Project } from "../types";

export interface StationResult {
  station: CareerStation;
  matchedOn: string;
}

export interface ProjectResult {
  project: Project;
}

function includes(haystack: string | undefined, needle: string): boolean {
  return !!haystack && haystack.toLowerCase().includes(needle);
}

export function searchStations(query: string, limit = 8): StationResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: StationResult[] = [];
  for (const station of STATIONS) {
    const routeNames = station.routeIds
      .map((r) => ROUTES.find((route) => route.id === r)?.name ?? "")
      .join(" ");
    let matchedOn = "";
    if (includes(station.name, q)) matchedOn = "station";
    else if (includes(station.category, q)) matchedOn = "category";
    else if (includes(routeNames, q)) matchedOn = "route";
    else if (station.skills.some((s) => includes(s, q))) matchedOn = "skill";
    else if (includes(station.short, q)) matchedOn = "story";
    if (matchedOn) results.push({ station, matchedOn });
  }
  return results.slice(0, limit);
}

export function searchProjects(query: string, limit = 4): ProjectResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: ProjectResult[] = [];
  for (const project of PROJECTS) {
    const haystack = [
      project.title,
      project.category,
      project.classification,
      project.summary,
      ...project.stack,
    ]
      .join(" ")
      .toLowerCase();
    if (haystack.includes(q)) results.push({ project });
  }
  return results.slice(0, limit);
}
