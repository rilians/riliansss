import { STATION_MAP } from "../data/stations";
import type { Analytics } from "./living";
import { create } from "zustand";

const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const configured = Boolean(url && key);
const headers = { apikey: key ?? "", Authorization: `Bearer ${key ?? ""}`, "Content-Type": "application/json" };
let pending: Promise<void> | undefined;
let lastFetch = 0;
const sent = new Set<string>();

type AnalyticsState = { status: "loading" | "ready" | "unavailable"; data: Analytics; load: () => Promise<void> };
export const useAnalytics = create<AnalyticsState>((set) => ({
  status: configured ? "loading" : "unavailable", data: { popular: [], trending: [] },
  load: async () => {
    if (!configured || (Date.now() - lastFetch < 300000)) return;
    if (pending) return pending;
    pending = (async () => {
      try {
        const response = await fetch(`${url}/rest/v1/rpc/station_analytics`, { method: "POST", headers, body: "{}" });
        if (!response.ok) throw new Error("Analytics unavailable");
        const data = await response.json() as Analytics;
        if (!Array.isArray(data.popular) || !Array.isArray(data.trending)) throw new Error("Invalid analytics");
        set({ status: "ready", data: {
          popular: data.popular.filter((item) => STATION_MAP[item.station_id]).slice(0, 5),
          trending: data.trending.filter((item) => STATION_MAP[item.station_id]).slice(0, 3),
        } });
        lastFetch = Date.now();
      } catch { set({ status: "unavailable" }); }
      finally { pending = undefined; }
    })();
    return pending;
  },
}));

export async function trackStation(id: string): Promise<void> {
  if (!configured || !STATION_MAP[id]) return;
  let eventKey: string | undefined;
  try {
    let visitor = localStorage.getItem("lir-visitor-id");
    if (!visitor || !/^[0-9a-f-]{36}$/i.test(visitor)) {
      visitor = crypto.randomUUID();
      localStorage.setItem("lir-visitor-id", visitor);
    }
    eventKey = `${id}:${new Date().toISOString().slice(0, 10)}`;
    if (sent.has(eventKey)) return;
    sent.add(eventKey);
    const response = await fetch(`${url}/rest/v1/rpc/record_station_exploration`, {
      method: "POST", headers, body: JSON.stringify({ p_station_id: id, p_visitor_id: visitor }),
    });
    if (!response.ok) sent.delete(eventKey);
  } catch { if (eventKey) sent.delete(eventKey); /* Browsing still works offline. */ }
}
