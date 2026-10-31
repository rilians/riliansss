import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  Link2,
  Navigation,
  X,
} from "lucide-react";
import { PROJECT_MAP } from "../../data/projects";
import { ROUTE_MAP } from "../../data/routes";
import { getNeighbors, getRelatedStations, STATION_MAP } from "../../data/stations";
import { useJourneyStore } from "../../store/journey";
import DepartureBoard from "./DepartureBoard";
import { cn } from "../../lib/utils";
import { RouteChip } from "../common/primitives";

const STORY_SECTIONS: Array<{ key: "context" | "challenge" | "journey" | "outcome"; label: string }> = [
  { key: "context", label: "The Context" },
  { key: "challenge", label: "The Challenge" },
  { key: "journey", label: "The Journey" },
  { key: "outcome", label: "The Outcome" },
];

export default function StationPanel() {
  const selectedId = useJourneyStore((s) => s.selectedStationId);
  const selectStation = useJourneyStore((s) => s.selectStation);
  const setPlannerOpen = useJourneyStore((s) => s.setPlannerOpen);
  const setPlanTo = useJourneyStore((s) => s.setPlanTo);
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const station = selectedId ? STATION_MAP[selectedId] : undefined;

  // Esc closes the panel.
  useEffect(() => {
    if (!station) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") selectStation(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [station, selectStation]);

  useEffect(() => {
    setCopied(false);
  }, [selectedId]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — URL is in the address bar anyway */
    }
  };

  const related = station ? getRelatedStations(station.id) : [];

  return (
    <AnimatePresence>
      {station && (
        <motion.aside
          key={station.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "no-print z-30 flex flex-col border-ink/15 bg-paper",
            "fixed inset-x-0 bottom-0 max-h-[76dvh] border-t lg:absolute lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-[410px] lg:border-l lg:border-t-0 xl:w-[450px]",
          )}
          style={{ boxShadow: "0 -12px 40px rgba(24,26,28,0.10), 0 12px 40px rgba(24,26,28,0.06)" }}
          aria-label={`Station details: ${station.name}`}
        >
          {/* mobile grab handle */}
          <div className="flex justify-center pt-2 lg:hidden">
            <span className="h-1 w-10 rounded-full bg-ink/20" aria-hidden />
          </div>

          {/* header */}
          <div className="flex items-start justify-between gap-3 border-b border-line px-5 pb-4 pt-4 lg:pt-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-paper"
                  style={{ backgroundColor: ROUTE_MAP[station.routeIds[0]]?.color }}
                >
                  {station.code}
                </span>
                {station.routeIds.map((r) => (
                  <RouteChip key={r} routeId={r} />
                ))}
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight">
                {station.name}
              </h2>
              <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
                {station.category} · {station.period}
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setPlanTo(station.id);
                  setPlannerOpen(true);
                  selectStation(null);
                }}
                className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                aria-label={`Plan a route to ${station.name}`}
                title="Plan a route to this station"
              >
                <Navigation size={14} aria-hidden />
              </button>
              <button
                type="button"
                onClick={share}
                className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                aria-label="Copy link to this station"
              >
                {copied ? <Check size={14} aria-hidden /> : <Link2 size={14} aria-hidden />}
              </button>
              <button
                type="button"
                onClick={() => selectStation(null)}
                className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                aria-label="Close station details"
              >
                <X size={15} aria-hidden />
              </button>
            </div>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <DepartureBoard station={station} />

              <p className="mt-5 text-[15px] leading-relaxed text-ink/90">{station.short}</p>

              <div className="mt-6 space-y-6">
                {STORY_SECTIONS.map((section, i) => (
                  <section key={section.key}>
                    <h3 className="flex items-baseline gap-2.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ink">
                      <span className="text-signal">{String(i + 1).padStart(2, "0")}</span>
                      <span className="h-px w-5 self-center bg-ink/30" aria-hidden />
                      {section.label}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink/80">
                      {station[section.key]}
                    </p>
                  </section>
                ))}
              </div>

              {/* skills */}
              {station.skills.length > 0 && (
                <section className="mt-7">
                  <h3 className="meta-label">Related Skills</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {station.skills.map((skill) => (
                      <li key={skill} className="chip !bg-card">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* projects */}
              {station.projectIds.length > 0 && (
                <section className="mt-7">
                  <h3 className="meta-label">Related Projects</h3>
                  <ul className="mt-3 space-y-2">
                    {station.projectIds.map((pid) => {
                      const p = PROJECT_MAP[pid];
                      if (!p) return null;
                      return (
                        <li key={pid}>
                          <button
                            type="button"
                            onClick={() => navigate(`/work/${p.id}`)}
                            className="group flex w-full items-center gap-3 border border-line bg-card px-3.5 py-3 text-left transition-colors hover:border-ink"
                          >
                            <Briefcase size={15} className="shrink-0 text-muted group-hover:text-signal" aria-hidden />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">{p.title}</span>
                              <span className="block font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                                {p.category}
                              </span>
                            </span>
                            <ArrowRight size={14} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* related stations */}
              {related.length > 0 && (
                <section className="mt-7">
                  <h3 className="meta-label">Nearby Stations</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {related.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => selectStation(s.id, { zoom: true })}
                          className="inline-flex items-center gap-1.5 border border-line bg-card px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
                        >
                          <span
                            aria-hidden
                            className="inline-block h-2 w-2"
                            style={{ backgroundColor: ROUTE_MAP[s.routeIds[0]]?.color }}
                          />
                          {s.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </motion.div>
          </div>

          {/* footer: prev / next */}
          <PanelFooter stationId={station.id} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PanelFooter({ stationId }: { stationId: string }) {
  const { prev, next } = getNeighbors(stationId);
  const selectStation = useJourneyStore((s) => s.selectStation);

  const go = (id: string | null | undefined) => {
    if (!id) return;
    selectStation(id, { zoom: true });
    // keep deep link in sync
    const url = new URL(window.location.href);
    url.searchParams.set("station", id);
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <div className="grid grid-cols-2 gap-px border-t border-line bg-line">
      <button
        type="button"
        disabled={!prev}
        onClick={() => go(prev?.id)}
        className={cn(
          "group flex min-w-0 items-center gap-2.5 bg-paper px-4 py-3.5 text-left transition-colors",
          prev ? "hover:bg-card" : "cursor-not-allowed opacity-35",
        )}
        aria-label={prev ? `Previous station: ${prev.name}` : "No previous station"}
      >
        <ArrowLeft size={15} className="shrink-0 text-muted" aria-hidden />
        <span className="min-w-0">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Prev</span>
          <span className="block truncate text-[13px] font-medium">{prev?.name ?? "—"}</span>
        </span>
      </button>
      <button
        type="button"
        disabled={!next}
        onClick={() => go(next?.id)}
        className={cn(
          "group flex min-w-0 items-center justify-end gap-2.5 bg-paper px-4 py-3.5 text-right transition-colors",
          next ? "hover:bg-card" : "cursor-not-allowed opacity-35",
        )}
        aria-label={next ? `Next station: ${next.name}` : "No next station"}
      >
        <span className="min-w-0">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Next</span>
          <span className="block truncate text-[13px] font-medium">{next?.name ?? "—"}</span>
        </span>
        <ArrowRight size={15} className="shrink-0 text-muted" aria-hidden />
      </button>
    </div>
  );
}
