import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Reveal } from "../common/primitives";
import { STATIONS, STATION_MAP } from "../../data/stations";
import { ROUTE_MAP } from "../../data/routes";
import { latestStations } from "../../lib/living";
import { useAnalytics } from "../../lib/analytics";
import type { CareerStation } from "../../types";

function StationLink({ station, detail }: { station: CareerStation; detail?: string }) {
  const route = ROUTE_MAP[station.routeIds[0]];
  return <Link to={`/journey?station=${encodeURIComponent(station.id)}`} className="group flex gap-4 border-t border-line py-5 transition-colors hover:bg-card">
    <span className="mt-1 w-1 shrink-0" style={{ background: route?.color }} />
    <span className="min-w-0 flex-1">
      <span className="font-display text-lg font-bold group-hover:text-signal">{station.name} <span aria-hidden>↗</span></span>
      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{station.code} · {route?.code} {route?.name} · {station.category}{detail && ` · ${detail}`}</span>
    </span>
  </Link>;
}
function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2><p className="mt-3 text-sm text-ink/70">{text}</p></>;
}
export default function LivingNetwork() {
  const { status, data, load } = useAnalytics();
  useEffect(() => { void load(); }, [load]);
  const latest = latestStations(STATIONS).slice(0, 4);
  const empty = status === "loading" ? "Loading network activity…" : status === "unavailable" ? "Network activity is currently unavailable." : "THE NETWORK IS STILL BEING EXPLORED.";
  return <section className="border-b border-line"><Container className="py-20 md:py-28">
    <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Life in Routes — A Living Network</p>
    <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
      <Reveal><Heading eyebrow="The network is growing" title="Latest Arrivals." text="New stations recently added to the network." />
        <div className="mt-7">{latest.length ? latest.map((station) => <div key={station.id}><StationLink station={station} detail={`NEW · ${new Date(station.publishedAt!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`} /><p className="-mt-2 mb-5 pl-5 text-sm text-ink/70">{station.short}</p></div>) : <p className="border-t border-line py-6 font-mono text-xs text-muted">No new stations in the last 30 days. The network continues to grow.</p>}</div>
        <Link to="/journey?filter=new" className="inline-block border-b border-ink py-2 font-mono text-[10px] uppercase tracking-[0.16em]">View all ↗</Link>
      </Reveal>
      <Reveal><Heading eyebrow="Visitor favorites" title="Most Explored." text="Stations receiving the most exploration across the network." />
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Last 30 days · unique visitors</p>
        <div className="mt-3">{status === "ready" && data.popular.length ? data.popular.map((item, index) => <div className="flex gap-4" key={item.station_id}><span className="pt-5 font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span><div className="flex-1"><StationLink station={STATION_MAP[item.station_id]} detail={`${item.visitors} visitors`} /></div></div>) : <p className="border-t border-line py-6 font-mono text-xs text-muted">{empty}</p>}</div>
      </Reveal>
    </div>
    <div className="mt-20 border-t border-line pt-10"><Reveal><Heading eyebrow="What's moving through the network" title="Trending Now." text="Stations gaining attention across the network." />
      <div className="mt-7 grid gap-x-8 md:grid-cols-3">{status === "ready" && data.trending.length ? data.trending.map((item) => <StationLink key={item.station_id} station={STATION_MAP[item.station_id]} detail={item.previous_visitors === 0 ? "↗ Newly trending" : `↗ +${item.increase} visitors · +${Math.round(item.growth ?? 0)}%`} />) : <p className="border-t border-line py-6 font-mono text-xs text-muted">{status === "ready" ? "NO MAJOR MOVEMENT YET." : empty}</p>}</div>
    </Reveal></div>
  </Container></section>;
}
