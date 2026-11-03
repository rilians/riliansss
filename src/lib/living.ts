import type { CareerStation } from "../types";

const DAY = 86400000;
export function isNewStation(station: CareerStation, now = Date.now()): boolean {
  if (station.status === "draft" || !station.publishedAt) return false;
  const date = Date.parse(station.publishedAt);
  return Number.isFinite(date) && date <= now && date > now - 30 * DAY;
}
export function latestStations(stations: CareerStation[], now = Date.now()): CareerStation[] {
  return stations.filter((station) => isNewStation(station, now))
    .sort((a, b) => Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!));
}
export interface PopularStation { station_id: string; visitors: number }
export interface TrendingStation { station_id: string; current_visitors: number; previous_visitors: number; increase: number; growth: number | null }
export interface Analytics { popular: PopularStation[]; trending: TrendingStation[] }
