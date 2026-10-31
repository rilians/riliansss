import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, Navigation, TrainFront } from "lucide-react";
import { Page } from "../components/layout/Page";
import { Container } from "../components/common/primitives";
import TransitMap from "../components/map/TransitMap";
import MobileRouteExplorer from "../components/map/MobileRouteExplorer";
import TimelineView from "../components/timeline/TimelineView";
import StationPanel from "../components/station/StationPanel";
import { ModeToggle, RouteFilters, StationSearch } from "../components/map/MapToolbar";
import PlannerPanel from "../components/map/PlannerPanel";
import { ROUTE_MAP, isRouteId } from "../data/routes";
import { STATION_MAP, STATIONS } from "../data/stations";
import { useJourneyStore } from "../store/journey";
import { cn } from "../lib/utils";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function JourneyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFullMap, setShowFullMap] = useState(false);
  const mode = useJourneyStore((s) => s.mode);
  const routeFilter = useJourneyStore((s) => s.routeFilter);
  const selectedStationId = useJourneyStore((s) => s.selectedStationId);
  const setMode = useJourneyStore((s) => s.setMode);
  const setRouteFilter = useJourneyStore((s) => s.setRouteFilter);
  const selectStation = useJourneyStore((s) => s.selectStation);
  const requestRide = useJourneyStore((s) => s.requestRide);
  const plannerOpen = useJourneyStore((s) => s.plannerOpen);
  const setPlannerOpen = useJourneyStore((s) => s.setPlannerOpen);
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // URL -> store (deep links: ?station= &route= &mode=)
  useEffect(() => {
    const routeParam = searchParams.get("route");
    const route = isRouteId(routeParam) ? routeParam : "all";
    if (route !== useJourneyStore.getState().routeFilter) setRouteFilter(route);

    const stationId = searchParams.get("station");
    const station = stationId ? STATION_MAP[stationId] : undefined;
    const stationMatchesRoute =
      station && (route === "all" || station.routeIds.includes(route));
    const selectedStationId = stationMatchesRoute ? stationId : null;
    const currentStationId = useJourneyStore.getState().selectedStationId;
    if (selectedStationId !== currentStationId) {
      selectStation(selectedStationId, { zoom: selectedStationId !== null });
    }

    const urlMode = searchParams.get("mode");
    const nextMode = urlMode === "timeline" ? "timeline" : "map";
    if (nextMode !== useJourneyStore.getState().mode) setMode(nextMode);
  }, [searchParams, selectStation, setMode, setRouteFilter]);

  // store -> URL (shareable state). Reads fresh store state so the
  // first mount pass can't race the URL->store effect above and strip
  // deep-link params.
  useEffect(() => {
    const st = useJourneyStore.getState();
    const next = new URLSearchParams();
    if (st.selectedStationId) next.set("station", st.selectedStationId);
    if (st.routeFilter !== "all") next.set("route", st.routeFilter);
    if (st.mode !== "map") next.set("mode", st.mode);
    const same =
      searchParams.get("station") === next.get("station") &&
      searchParams.get("route") === next.get("route") &&
      searchParams.get("mode") === next.get("mode");
    if (!same) setSearchParams(next, { replace: true });
  }, [selectedStationId, routeFilter, mode, searchParams, setSearchParams]);

  const activeRoute = routeFilter !== "all" ? ROUTE_MAP[routeFilter] : null;

  return (
    <Page className="!pt-16 md:!pt-20">
      <Container>
        {/* header row */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-5 pt-4 md:pt-6">
          <div>
            <p className="eyebrow">Route explorer</p>
            <h1 className="mt-2.5 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Journey Map
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StationSearch className="w-full sm:w-[300px]" />
            <button
              type="button"
              onClick={() => setPlannerOpen(!plannerOpen)}
              aria-pressed={plannerOpen}
              className={cn(
                "inline-flex items-center gap-1.5 border px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] transition-colors",
                plannerOpen
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink hover:border-ink",
              )}
            >
              <Navigation size={13} aria-hidden /> Directions
            </button>
            <ModeToggle />
          </div>
        </div>

        {/* filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
          <RouteFilters />
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted lg:block">
            {STATIONS.length} stations · 4 lines · schematic
          </p>
        </div>

        <PlannerPanel />

        {/* active route description */}
        {activeRoute && (
          <div className="mt-3 flex items-start justify-between gap-4 border border-line bg-card px-4 py-3">
            <p className="text-[13px] leading-relaxed text-ink/75">
              <span className="mr-2 inline-block h-2.5 w-2.5 align-middle" style={{ backgroundColor: activeRoute.color }} aria-hidden />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">
                {activeRoute.code} — {activeRoute.name}.
              </span>{" "}
              {activeRoute.description}
            </p>
            <div className="flex shrink-0 items-center gap-3">
              {!reduceMotion && (
                <button
                  type="button"
                  onClick={() => {
                    if (routeFilter !== "all") requestRide(routeFilter);
                  }}
                  className="inline-flex items-center gap-1.5 border border-ink bg-ink px-3 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:border-signal hover:bg-signal"
                >
                  <TrainFront size={12} aria-hidden /> Ride this line
                </button>
              )}
              <button
                type="button"
                onClick={() => setRouteFilter("all")}
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </Container>

      {/* map / timeline canvas */}
      <Container className="pb-10 pt-4">
        {!isDesktop && mode === "map" && showFullMap && (
          <button
            type="button"
            onClick={() => setShowFullMap(false)}
            className="mb-3 inline-flex min-h-11 items-center gap-2 border border-ink/25 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] transition-colors hover:border-ink hover:bg-card"
          >
            <ArrowLeft size={14} aria-hidden /> Back to route explorer
          </button>
        )}
        {mode === "map" && !isDesktop && !showFullMap ? (
          <>
            <MobileRouteExplorer onViewFullMap={() => setShowFullMap(true)} />
            <StationPanel />
          </>
        ) : (
          <div
            className={cn(
              "relative border border-ink/20",
              isDesktop
                ? "h-[calc(100dvh-320px)] min-h-[600px]"
                : "h-[72dvh] min-h-[440px] max-h-[760px]",
            )}
          >
            {mode === "map" ? <TransitMap /> : <TimelineView />}
            <StationPanel />
          </div>
        )}
        {(mode === "timeline" || isDesktop || showFullMap) && (
          <p className="mt-3 text-center font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
            {mode === "map"
              ? "Drag to pan · scroll or pinch to zoom · click a station for the full story"
              : "Scroll the service log · open a station to switch to map focus"}
          </p>
        )}
      </Container>
    </Page>
  );
}
