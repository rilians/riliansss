import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ROUTE_MAP } from "../../data/routes";
import { STATIONS } from "../../data/stations";
import { useJourneyStore } from "../../store/journey";
import { useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * TIMELINE MODE — the chronological service log laid out as a station
 * timetable: one row per station, line chips, and a "Board" action that
 * jumps to the map with that station open.
 */
export default function TimelineView() {
  const routeFilter = useJourneyStore((s) => s.routeFilter);
  const selectStation = useJourneyStore((s) => s.selectStation);
  const setMode = useJourneyStore((s) => s.setMode);
  const reduceMotion = useReducedMotion();

  const items = [...STATIONS]
    .filter((s) => routeFilter === "all" || s.routeIds.includes(routeFilter))
    .sort((a, b) => a.order - b.order);

  const board = (id: string) => {
    setMode("map");
    selectStation(id, { zoom: true });
  };

  return (
    <div className="h-full overflow-y-auto bg-card">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-12">
        <p className="meta-label">
          Service timetable · {items.length} stations
          {routeFilter !== "all" ? ` · ${ROUTE_MAP[routeFilter]?.name} line` : ""} · in service
          order
        </p>

        {/* table header (desktop) */}
        <div
          className={cn(
            "mt-7 hidden border-b border-ink/40 pb-2 md:grid",
            "grid-cols-[122px_76px_minmax(0,1.25fr)_minmax(0,1.15fr)_84px] gap-x-4",
          )}
          aria-hidden
        >
          {["Period", "Line", "Station", "Service", ""].map((h) => (
            <span
              key={h}
              className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted"
            >
              {h}
            </span>
          ))}
        </div>

        <ol>
          {items.map((s, i) => {
            const color = ROUTE_MAP[s.routeIds[0]]?.color ?? "#181A1C";
            return (
              <motion.li
                key={s.id}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(i * 0.025, 0.2),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group border-b border-line"
              >
                <div
                  className={cn(
                    "grid items-center gap-x-4 py-4 pl-3 md:pl-4",
                    "grid-cols-1 md:grid-cols-[122px_76px_minmax(0,1.25fr)_minmax(0,1.15fr)_84px]",
                  )}
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  {/* period */}
                  <span
                    className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]"
                    style={{ color }}
                  >
                    {s.period}
                  </span>

                  {/* line chips */}
                  <span className="mt-1.5 flex items-center gap-1 md:mt-0">
                    {s.routeIds.map((r) => (
                      <span
                        key={r}
                        title={ROUTE_MAP[r]?.name}
                        className="px-1 py-0.5 font-mono text-[8.5px] font-semibold tracking-[0.08em] text-paper"
                        style={{ backgroundColor: ROUTE_MAP[r]?.color }}
                      >
                        {ROUTE_MAP[r]?.code}
                      </span>
                    ))}
                  </span>

                  {/* station */}
                  <span className="mt-2 min-w-0 md:mt-0">
                    <span className="flex items-baseline gap-2">
                      <span className="truncate font-display text-[15.5px] font-bold tracking-tight">
                        {s.name}
                      </span>
                      <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">
                        {s.code}
                      </span>
                    </span>
                    <span className="block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                      {s.category}
                    </span>
                  </span>

                  {/* service note */}
                  <span className="mt-2 block text-[12.5px] leading-snug text-ink/70 md:mt-0">
                    <span className="line-clamp-2">{s.short}</span>
                  </span>

                  {/* action */}
                  <span className="mt-3 md:mt-0 md:text-right">
                    <button
                      type="button"
                      onClick={() => board(s.id)}
                      className="inline-flex items-center gap-1.5 border border-line bg-paper px-2.5 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                      aria-label={`Open ${s.name} on the map`}
                    >
                      Board
                      <ArrowRight
                        size={11}
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <div className={cn("mt-5 border-t border-line pt-5")}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
            The line continues —{" "}
            <Link to="/contact" className="text-signal underline-offset-4 hover:underline">
              add the next station together
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
