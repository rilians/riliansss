import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpDown, Footprints, Navigation, TrainFront, X } from "lucide-react";
import { ROUTE_MAP } from "../../data/routes";
import { STATIONS, STATION_MAP } from "../../data/stations";
import { planRoute } from "../../lib/planner";
import type { RouteId } from "../../types";
import { useJourneyStore } from "../../store/journey";

const SORTED = [...STATIONS].sort((a, b) => a.order - b.order);
/** Metaphor ride time: ~2 minutes on board per stop, like a real metro. */
const MIN_PER_STOP = 2;

function StationSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <label className="min-w-0 flex-1">
      <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full cursor-pointer appearance-none border border-line bg-paper px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink outline-none transition-colors hover:border-ink focus:border-ink"
      >
        <option value="">Select station…</option>
        {SORTED.map((s) => (
          <option key={s.id} value={s.id}>
            {s.code} · {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Route planner: pick two stations, get the itinerary across lines,
 * with the path highlighted on the map (see TransitMap overlay).
 */
export default function PlannerPanel() {
  const open = useJourneyStore((s) => s.plannerOpen);
  const setPlannerOpen = useJourneyStore((s) => s.setPlannerOpen);
  const fromId = useJourneyStore((s) => s.planFromId);
  const toId = useJourneyStore((s) => s.planToId);
  const setPlanFrom = useJourneyStore((s) => s.setPlanFrom);
  const setPlanTo = useJourneyStore((s) => s.setPlanTo);
  const swapPlan = useJourneyStore((s) => s.swapPlan);
  const clearPlan = useJourneyStore((s) => s.clearPlan);
  const setRouteFilter = useJourneyStore((s) => s.setRouteFilter);
  const requestRide = useJourneyStore((s) => s.requestRide);
  const selectStation = useJourneyStore((s) => s.selectStation);

  const plan = useMemo(() => planRoute(fromId, toId), [fromId, toId]);
  const ready = Boolean(fromId && toId);
  const minutes = plan ? plan.legs.reduce((acc, l) => acc + l.stops, 0) * MIN_PER_STOP : 0;

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.section
          key="planner"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
          aria-label="Route planner"
        >
          <div className="mt-3 border border-line bg-card px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <Navigation size={13} className="text-signal" aria-hidden />
              <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]">
                Plan a route
              </h2>
              <button
                type="button"
                onClick={() => setPlannerOpen(false)}
                className="ml-auto text-muted transition-colors hover:text-ink"
                aria-label="Close route planner"
              >
                <X size={14} aria-hidden />
              </button>
            </div>

            {/* controls */}
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <StationSelect id="plan-from" label="From" value={fromId} onChange={setPlanFrom} />
              <button
                type="button"
                onClick={swapPlan}
                disabled={!fromId && !toId}
                className="mb-[1px] flex h-[38px] w-9 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
                aria-label="Swap origin and destination"
              >
                <ArrowUpDown size={14} aria-hidden />
              </button>
              <StationSelect id="plan-to" label="To" value={toId} onChange={setPlanTo} />
              <button
                type="button"
                onClick={() => clearPlan()}
                disabled={!fromId && !toId}
                className="mb-[1px] h-[38px] shrink-0 border border-line px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
              >
                Clear
              </button>
            </div>

            {/* result */}
            {plan && plan.legs.length > 0 && (
              <motion.div
                key={`${fromId}-${toId}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="mt-3 border-t border-line pt-3"
              >
                <ol className="space-y-0">
                  {plan.legs.map((leg, i) => {
                    const route = leg.routeId ? ROUTE_MAP[leg.routeId] : null;
                    const from = STATION_MAP[leg.fromId];
                    const to = STATION_MAP[leg.toId];
                    if ((!route && leg.routeId) || !from || !to) return null;
                    return (
                      <li key={`${leg.routeId ?? "walk"}-${leg.fromId}`}>
                        {i > 0 && (
                          <p className="flex items-center gap-2 py-1.5 pl-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                            <span className="inline-block h-3 w-px bg-ink/30" aria-hidden />
                            Change at {from.name}
                          </p>
                        )}
                        <div className="flex items-center gap-2.5 border border-line bg-paper px-2.5 py-2">
                          {route ? (
                            <>
                              <span
                                aria-hidden
                                className="h-6 w-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: route.color }}
                              />
                              <span
                                className="shrink-0 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-paper"
                                style={{ backgroundColor: route.color }}
                              >
                                {route.code}
                              </span>
                            </>
                          ) : (
                            <>
                              <span aria-hidden className="h-6 w-1.5 shrink-0 rounded-full border border-dashed border-ink/50" />
                              <span className="shrink-0 border border-dashed border-ink/50 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-ink">
                                WALK
                              </span>
                            </>
                          )}
                          <span className="min-w-0 flex-1 text-[12.5px] leading-snug">
                            <span className="font-medium">{from.name}</span>
                            <span className="mx-1.5 text-muted">→</span>
                            <span className="font-medium">{to.name}</span>
                          </span>
                          <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                            {leg.stops} {leg.stops === 1 ? "stop" : "stops"}
                          </span>
                          {route ? (
                            <button
                              type="button"
                              onClick={() => {
                                setRouteFilter(leg.routeId as RouteId);
                                requestRide(leg.routeId as RouteId);
                              }}
                              className="flex h-7 w-7 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                              aria-label={`Simulate riding the ${route.name} line`}
                              title="Simulate this ride"
                            >
                              <TrainFront size={12} aria-hidden />
                            </button>
                          ) : (
                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center text-muted"
                              title="Walking transfer"
                              aria-hidden
                            >
                              <Footprints size={13} />
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-2.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                  {plan.nodeIds.length - 1} stops total ·{" "}
                  {plan.interchanges === 0
                    ? "no interchange"
                    : `${plan.interchanges} interchange${plan.interchanges > 1 ? "s" : ""}`}
                  {plan.legs.some((l) => !l.routeId) &&
                    ` · ${plan.legs.filter((l) => !l.routeId).length} walking transfer${plan.legs.filter((l) => !l.routeId).length > 1 ? "s" : ""}`}{" "}
                  · ≈ {minutes} min on board
                </p>
              </motion.div>
            )}

            {!ready && (
              <p className="mt-3 border-t border-line pt-2.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                Choose an origin and a destination — the map will light up the way.
              </p>
            )}
            {ready && !plan && (
              <p className="mt-3 border-t border-line pt-2.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                {fromId === toId
                  ? "Origin and destination are the same station."
                  : "No route found on this network."}
              </p>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
