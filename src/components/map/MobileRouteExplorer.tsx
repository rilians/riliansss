import { Expand } from "lucide-react";
import { ROUTES } from "../../data/routes";
import { STATION_MAP } from "../../data/stations";
import { useJourneyStore } from "../../store/journey";

export default function MobileRouteExplorer({
  onViewFullMap,
}: {
  onViewFullMap: () => void;
}) {
  const routeFilter = useJourneyStore((state) => state.routeFilter);
  const selectedStationId = useJourneyStore((state) => state.selectedStationId);
  const selectStation = useJourneyStore((state) => state.selectStation);
  const visibleRoutes =
    routeFilter === "all"
      ? ROUTES
      : ROUTES.filter((route) => route.id === routeFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-md text-sm leading-relaxed text-ink/70">
          Follow each line in service order. Select a station to open its story.
        </p>
        <button
          type="button"
          onClick={onViewFullMap}
          className="inline-flex min-h-12 shrink-0 items-center gap-2 border border-ink bg-ink px-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:border-signal hover:bg-signal"
        >
          <Expand size={14} aria-hidden /> View full map
        </button>
      </div>

      <div className="space-y-9">
        {visibleRoutes.map((route) => {
          const stations = route.stationIds
            .map((stationId) => STATION_MAP[stationId])
            .filter((station) => station !== undefined);

          return (
            <section key={route.id} aria-labelledby={`mobile-route-${route.id}`}>
              <header
                className="border-t-2 pb-3 pt-4"
                style={{ borderColor: route.color }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                  Route {route.code}
                </p>
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h2
                    id={`mobile-route-${route.id}`}
                    className="font-display text-2xl font-bold tracking-tight"
                  >
                    {route.name}
                  </h2>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                    {stations.length} stations
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-ink/70">
                  {route.tagline}
                </p>
              </header>

              <ol className="border-t border-line">
                {stations.map((station, index) => {
                  const selected = station.id === selectedStationId;
                  return (
                    <li key={station.id} className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => selectStation(selected ? null : station.id)}
                        aria-pressed={selected}
                        className="grid min-h-[76px] w-full grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-3 px-2 py-3 text-left transition-colors hover:bg-card focus-visible:bg-card"
                      >
                        <span
                          className="flex h-4 w-4 items-center justify-center border-2"
                          style={{
                            borderColor: route.color,
                            backgroundColor: selected ? route.color : "var(--color-paper)",
                          }}
                          aria-hidden
                        >
                          {station.type === "interchange" && (
                            <span className="h-1 w-1 bg-ink" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="font-display text-[15px] font-bold leading-tight tracking-tight">
                              {station.name}
                            </span>
                            <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted">
                              {station.code}
                            </span>
                          </span>
                          <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                            {station.period} · {station.category}
                          </span>
                        </span>
                        <span
                          className="font-mono text-[9px] tabular-nums text-muted"
                          aria-label={`Stop ${index + 1}`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
