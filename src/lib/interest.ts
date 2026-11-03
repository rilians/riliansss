import { STATIONS } from "../data/stations";
import { latestStations } from "./living";
import type { Analytics } from "./living";
import type { InterestFilter } from "../store/journey";
export function interestIds(filter: InterestFilter, data: Analytics): Set<string> | null {
  if (filter === "all") return null;
  return new Set(filter === "new" ? latestStations(STATIONS).map((s) => s.id) : data[filter].map((s) => s.station_id));
}
