import { useAnalytics } from "../../lib/analytics";
import { interestIds } from "../../lib/interest";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DoorOpen, ImageDown, Loader2, Minus, MoreHorizontal, Plus, RotateCcw, TrainFront, Volume2, VolumeX, X } from "lucide-react";
import { MAP_H, MAP_W, ROUTES, ROUTE_MAP } from "../../data/routes";
import { STATION_MAP } from "../../data/stations";
import { useJourneyStore } from "../../store/journey";
import type { CareerStation, RouteId } from "../../types";
import { clamp, cn, gridRef } from "../../lib/utils";
import { clientToGrid } from "../../lib/mapView";
import { denseRounded, pointAt, projectOnto, roundedPath, type Pt } from "../../lib/mapPath";
import { planRoute } from "../../lib/planner";
import { downloadPoster } from "../../lib/poster";
import { playDoorChime } from "../../lib/chime";
import NetworkPoster from "./NetworkPoster";
import RideTicket from "./RideTicket";
import { usePanZoom } from "../../hooks/usePanZoom";
import NetworkGraphic from "./NetworkGraphic";
import MapLegend from "./MapLegend";

export interface RideState {
  routeId: RouteId;
  status: "move" | "dwell" | "end";
  station: CareerStation;
  idx: number;
  total: number;
}

const MOVE_MS = 1500;
const DWELL_MS = 1700;
const END_MS = 2600;
const TRAIL_DOTS = 13;

/** Pre-rendered geometry per route: svg d-string + dense samples for exact projections. */
const ROUTE_GEO: Record<string, { d: string; dense: Pt[] }> = Object.fromEntries(
  ROUTES.map((r) => {
    const pts = r.waypoints.map(([x, y]) => ({ x, y }));
    return [r.id, { d: roundedPath(pts, 24), dense: denseRounded(pts, 24) }];
  }),
);

const easeInOutQuad = (p: number): number =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

const RIDE_COPY: Record<RideState["status"], string> = {
  move: "Now approaching",
  dwell: "Doors open — now at",
  end: "End of the line — all change, please",
};

/**
 * The full interactive journey map: schematic SVG + pan/zoom + rideable
 * train + overlays.
 */
export default function TransitMap() {
  const interestFilter = useJourneyStore((s) => s.interestFilter);
  const analyticsData = useAnalytics((s) => s.data);
  const {
    containerRef,
    t,
    animating,
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    zoomBy,
    zoomToUnit,
    wasDrag,
  } = usePanZoom({ width: MAP_W, height: MAP_H, minK: 0.6, maxK: 3, initialK: 1.3 });

  const routeFilter = useJourneyStore((s) => s.routeFilter);
  const selectedId = useJourneyStore((s) => s.selectedStationId);
  const selectStation = useJourneyStore((s) => s.selectStation);
  const zoomRequest = useJourneyStore((s) => s.zoomRequest);
  const rideRequest = useJourneyStore((s) => s.rideRequest);
  const requestRide = useJourneyStore((s) => s.requestRide);
  const planFromId = useJourneyStore((s) => s.planFromId);
  const planToId = useJourneyStore((s) => s.planToId);

  const plan = useMemo(() => planRoute(planFromId, planToId), [planFromId, planToId]);
  const planLegs = plan?.legs ?? [];
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [ref_, setRefReadout] = useState("—");
  const [ride, setRide] = useState<RideState | null>(null);
  const [chimeOn, setChimeOn] = useState(() => {
    try {
      return window.localStorage.getItem("lir-chime") === "on";
    } catch {
      return false;
    }
  });
  const [posterBusy, setPosterBusy] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const posterRef = useRef<SVGSVGElement | null>(null);
  const trainRef = useRef<SVGGElement | null>(null);
  const trailRefs = useRef<Array<SVGCircleElement | null>>([]);
  const reduceMotion = useReducedMotion();
  /** Screen-constant sizing reads the live zoom through this ref. */
  const kRef = useRef(t.k);
  kRef.current = t.k;

  /** Fit the whole network (plus label padding) to the current container. */
  const fitNetwork = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xs = ROUTES.flatMap((r) => r.waypoints.map((w) => w[0]));
    const ys = ROUTES.flatMap((r) => r.waypoints.map((w) => w[1]));
    const pad = 90; // room for edge labels
    const minX = Math.min(...xs) - pad;
    const maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad;
    const maxY = Math.max(...ys) + pad;
    const fitScale = Math.min(rect.width / MAP_W, rect.height / MAP_H) || 1;
    const k = clamp(
      Math.min(rect.width / (fitScale * (maxX - minX)), rect.height / (fitScale * (maxY - minY))),
      0.6,
      2,
    );
    zoomToUnit({ x: (minX + maxX) / 2, y: (minY + maxY) / 2 }, k);
  }, [containerRef, zoomToUnit]);

  // Open fitted to the whole network (deep links take over).
  const initialViewDone = useRef(false);
  useEffect(() => {
    if (initialViewDone.current) return;
    initialViewDone.current = true;
    if (useJourneyStore.getState().zoomRequest) return;
    fitNetwork();
  }, [fitNetwork]);

  // Deep links / search: fly to the requested station.
  useEffect(() => {
    if (!zoomRequest) return;
    const s = STATION_MAP[zoomRequest.id];
    if (s) zoomToUnit({ x: s.x, y: s.y }, Math.max(1.55, t.k));
  }, [zoomRequest, zoomToUnit, t.k]);

  const onSelect = (stationId: string, e?: React.MouseEvent) => {
    // Suppress the synthetic click that follows a drag-pan, but never block
    // keyboard activation (detail === 0).
    if (wasDrag() && (e?.detail ?? 0) > 0) return;
    if (selectedId === stationId) {
      selectStation(null);
    } else {
      selectStation(stationId);
    }
  };

  const transformStyle = useMemo(
    () => ({
      transition: animating && !dragging ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
    }),
    [animating, dragging],
  );

  /* ------------------------------ train ride ------------------------------ */
  useEffect(() => {
    if (!rideRequest) {
      setRide(null);
      return;
    }
    if (reduceMotion) {
      useJourneyStore.getState().clearRide();
      return;
    }
    const route = ROUTE_MAP[rideRequest.routeId];
    if (!route) {
      useJourneyStore.getState().clearRide();
      return;
    }

    const pts: Pt[] = route.waypoints.map(([x, y]) => ({ x, y }));
    const stops = route.stationIds
      .map((id) => STATION_MAP[id])
      .filter((s): s is CareerStation => Boolean(s))
      .map((st) => ({ st, d: projectOnto(pts, { x: st.x, y: st.y }) }))
      .sort((a, b) => a.d - b.d);
    if (stops.length < 2) {
      useJourneyStore.getState().clearRide();
      return;
    }

    let dead = false;
    let raf = 0;
    let idx = 0;
    let phase: RideState["status"] = "move";
    let phaseStart = performance.now();
    const trail: Pt[] = [];

    const renderTrain = (pos: { x: number; y: number; angle: number }) => {
      trainRef.current?.setAttribute(
        "transform",
        `translate(${pos.x} ${pos.y}) rotate(${pos.angle}) scale(${1 / kRef.current})`,
      );
      trail.unshift({ x: pos.x, y: pos.y });
      if (trail.length > 26) trail.pop();
      trailRefs.current.forEach((c, i) => {
        if (!c) return;
        const p = trail[Math.min(i * 2, trail.length - 1)];
        c.setAttribute("cx", String(p.x));
        c.setAttribute("cy", String(p.y));
        c.setAttribute("r", String(Math.max(1.5, 5 - i * 0.32) / kRef.current));
        c.setAttribute("opacity", String(Math.max(0, 0.5 - i * 0.05)));
      });
    };

    const info = (status: RideState["status"], i: number): RideState => ({
      routeId: route.id,
      status,
      station: stops[Math.min(i, stops.length - 1)].st,
      idx: Math.min(i, stops.length - 1),
      total: stops.length,
    });

    setRide(info("move", 0));

    const tick = (now: number) => {
      if (dead) return;
      const from = idx === 0 ? 0 : stops[idx - 1].d;
      const to = stops[Math.min(idx, stops.length - 1)].d;
      const el = now - phaseStart;
      if (phase === "move") {
        // Zero-length segment (station sits on the path origin) — skip ahead.
        if (to - from < 1) {
          phase = "dwell";
          phaseStart = now;
          setRide(info("dwell", idx));
        } else {
          const p = Math.min(1, el / MOVE_MS);
          const e = easeInOutQuad(p);
          renderTrain(pointAt(pts, from + (to - from) * e));
          if (p >= 1) {
            phase = "dwell";
            phaseStart = now;
            setRide(info("dwell", idx));
          }
        }
      } else if (phase === "dwell") {
        if (el > DWELL_MS) {
          idx += 1;
          if (idx >= stops.length) {
            phase = "end";
            phaseStart = now;
            setRide(info("end", idx));
          } else {
            phase = "move";
            phaseStart = now;
            setRide(info("move", idx));
          }
        }
      } else if (el > END_MS) {
        dead = true;
        useJourneyStore.getState().clearRide();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
    };
  }, [rideRequest, reduceMotion]);

  // Door chime: plays once whenever the train enters a station (dwell).
  const prevStatus = useRef<RideState["status"] | null>(null);
  useEffect(() => {
    const enteredDwell = ride?.status === "dwell" && prevStatus.current !== "dwell";
    prevStatus.current = ride?.status ?? null;
    if (enteredDwell && chimeOn) playDoorChime();
  }, [ride?.status, chimeOn]);

  const toggleChime = () => {
    setChimeOn((on) => {
      try {
        window.localStorage.setItem("lir-chime", on ? "off" : "on");
      } catch {
        /* storage unavailable */
      }
      return !on;
    });
  };

  const onDownloadPoster = async () => {
    if (posterBusy || !posterRef.current) return;
    setPosterBusy(true);
    try {
      await downloadPoster(posterRef.current);
    } catch {
      /* poster rendering unsupported here — fail quietly */
    } finally {
      setPosterBusy(false);
    }
  };

  const rideRoute = ride ? ROUTE_MAP[ride.routeId] : null;
  const rideColor = rideRoute?.color ?? "#181A1C";

  return (
    <div
      ref={containerRef}
      className="map-surface relative h-full w-full touch-none select-none overflow-hidden"
      role="application"
      aria-label="Interactive career transit map. Drag to pan, use the zoom controls, and activate a station to read its story."
      onPointerDown={onPointerDown}
      onPointerMove={(e) => {
        onPointerMove(e);
        const unit = clientToGrid(e.clientX, e.clientY, containerRef.current, MAP_W, MAP_H);
        setRefReadout(unit ? gridRef(unit.x, unit.y) : "—");
      }}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={() => setHoverId(null)}
    >
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${t.x} ${t.y}) scale(${t.k})`} style={transformStyle}>
          <NetworkGraphic
            k={t.k}
            animated
            interactive={!ride}
            routeFilter={routeFilter}
            interestIds={interestIds(interestFilter, analyticsData)}
            interestLabel={interestFilter === "new" ? "NEW" : interestFilter === "popular" ? "★" : "↗"}
            selectedId={selectedId}
            hoverId={ride?.status === "dwell" ? ride.station.id : hoverId}
            rideRouteId={ride?.routeId ?? null}
            onSelect={(s, e) => onSelect(s.id, e)}
            onHover={(s) => setHoverId(s ? s.id : null)}
          />

          {/* trail + train */}
          {ride && (
            <g pointerEvents="none">
              {Array.from({ length: TRAIL_DOTS }).map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => {
                    trailRefs.current[i] = el;
                  }}
                  r={Math.max(1.5, 5 - i * 0.3)}
                  fill={rideColor}
                  opacity={0}
                />
              ))}
              <g ref={trainRef}>
                <rect
                  x={-21}
                  y={-12}
                  width={42}
                  height={24}
                  rx={11}
                  fill="var(--color-ink)"
                  stroke={rideColor}
                  strokeWidth={3}
                />
                <circle cx={13} cy={0} r={4} fill="#FFFFFF" />
                <circle cx={-9} cy={0} r={2.8} fill={rideColor} />
              </g>
            </g>
          )}

          {/* planned route overlay: each leg as an exact dash segment */}
          {planLegs.map((leg) => {
            const from = STATION_MAP[leg.fromId];
            const to = STATION_MAP[leg.toId];
            if (!from || !to) return null;
            if (!leg.routeId) {
              // walking transfer — dashed straight link
              return (
                <line
                  key={`walk-${leg.fromId}-${leg.toId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="var(--color-ink)"
                  strokeWidth={3.5}
                  strokeDasharray="2 7"
                  strokeLinecap="round"
                  opacity={0.85}
                  pointerEvents="none"
                />
              );
            }
            const geo = ROUTE_GEO[leg.routeId];
            if (!geo) return null;
            const dFrom = projectOnto(geo.dense, { x: from.x, y: from.y });
            const dTo = projectOnto(geo.dense, { x: to.x, y: to.y });
            return (
              <path
                key={`${leg.routeId}-${leg.fromId}-${leg.toId}`}
                d={geo.d}
                fill="none"
                stroke={ROUTE_MAP[leg.routeId]?.color}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(1, dTo - dFrom)} ${1e6}`}
                strokeDashoffset={-dFrom}
                pointerEvents="none"
              />
            );
          })}

          {/* A/B endpoint markers (screen-constant size) */}
          {[planFromId, planToId].map((id, i) => {
            const st = id ? STATION_MAP[id] : null;
            if (!st) return null;
            return (
              <g key={`${id}-${i}`} transform={`translate(${st.x} ${st.y}) scale(${1 / t.k})`} pointerEvents="none">
                <rect x={-10} y={-10} width={20} height={20} rx={3} fill="var(--color-ink)" stroke="#FFFFFF" strokeWidth={2} />
                <text
                  y={0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={12}
                  fontWeight={700}
                  fill={i === 0 ? "#F06442" : "#E4BD52"}
                >
                  {i === 0 ? "A" : "B"}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* ride toast */}
      <AnimatePresence>
        {ride && rideRoute && (
          <motion.div
            key="ride-toast"
            initial={{ y: -16, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="absolute left-1/2 top-3 z-20 w-[min(440px,92%)] -translate-x-1/2"
          >
            <div
              className="border border-ink/20 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.2em] text-muted">
                {ride.status === "end" ? (
                  <DoorOpen size={13} className="text-signal" aria-hidden />
                ) : (
                  <TrainFront size={13} style={{ color: rideColor }} aria-hidden />
                )}
                <span style={{ color: rideColor }}>
                  {rideRoute.code} · {rideRoute.name} line
                </span>
                <span className="ml-auto">
                  Stop {ride.idx + 1}/{ride.total}
                </span>
                <button
                  type="button"
                  onClick={() => useJourneyStore.getState().clearRide()}
                  aria-label="End the ride"
                  className="text-muted transition-colors hover:text-ink"
                >
                  <X size={13} aria-hidden />
                </button>
              </div>
              <p className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.28em] text-muted">
                {RIDE_COPY[ride.status]}
              </p>
              <p className="truncate font-display text-lg font-bold tracking-tight">
                {ride.status === "end" ? "Thank you for riding" : ride.station.name}
              </p>
              <div className="mt-2 h-0.5 w-full bg-line">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${((ride.idx + (ride.status === "dwell" ? 1 : ride.status === "end" ? 1 : 0.35)) / ride.total) * 100}%`,
                    backgroundColor: rideColor,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ride ticket keepsake */}
      <AnimatePresence>
        {ride && rideRoute && ride.status !== "end" && rideRequest && (
          <RideTicket ride={ride} nonce={rideRequest.nonce} />
        )}
      </AnimatePresence>

      {/* Coordinate + zoom readout */}
      <div
        aria-hidden
        className="no-print pointer-events-none absolute left-3 top-3 border border-ink/15 bg-card/90 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted"
      >
        REF {ref_} · ZOOM {Math.round(t.k * 100)}%
      </div>

      {/* Primary navigation stays visible; optional preferences live in the menu. */}
      <div className="no-print absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => zoomBy(1.4)}
          className="flex h-11 w-11 items-center justify-center border border-ink/20 bg-card/95 text-ink transition-colors hover:border-ink"
          aria-label="Zoom in"
        >
          <Plus size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => zoomBy(1 / 1.4)}
          className="flex h-11 w-11 items-center justify-center border border-ink/20 bg-card/95 text-ink transition-colors hover:border-ink"
          aria-label="Zoom out"
        >
          <Minus size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={fitNetwork}
          className="flex h-11 w-11 items-center justify-center border border-ink/20 bg-card/95 text-ink transition-colors hover:border-ink"
          aria-label="Fit the whole network to the view"
        >
          <RotateCcw size={15} aria-hidden />
        </button>
        <button
          type="button"
          disabled={routeFilter === "all" || !!reduceMotion}
          onClick={() => {
            if (routeFilter !== "all") requestRide(routeFilter);
          }}
          title={
            routeFilter === "all"
              ? "Select a line first, then ride it"
              : `Ride the ${ROUTE_MAP[routeFilter]?.name} line`
          }
          className={cn(
            "flex h-11 w-11 items-center justify-center border transition-colors",
            routeFilter === "all" || reduceMotion
              ? "cursor-not-allowed border-ink/10 bg-card/60 text-muted/50"
              : "border-ink/20 bg-card/95 text-ink hover:border-ink hover:bg-ink hover:text-paper",
          )}
          aria-label={
            routeFilter === "all"
              ? "Ride a line — select a line filter first"
              : `Ride the ${ROUTE_MAP[routeFilter]?.name} line`
          }
        >
          <TrainFront size={15} aria-hidden />
        </button>
        <div className="relative">
          {extrasOpen && (
            <div className="absolute bottom-[calc(100%+6px)] right-0 w-52 border border-ink/20 bg-card p-1.5 shadow-lg">
              <button
                type="button"
                onClick={toggleChime}
                aria-pressed={chimeOn}
                className="flex min-h-11 w-full items-center gap-3 px-3 text-left font-mono text-[9px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-paper"
              >
                {chimeOn ? <Volume2 size={14} aria-hidden /> : <VolumeX size={14} aria-hidden />}
                Door chime {chimeOn ? "on" : "off"}
              </button>
              <button
                type="button"
                onClick={onDownloadPoster}
                disabled={posterBusy}
                className="flex min-h-11 w-full items-center gap-3 px-3 text-left font-mono text-[9px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-paper disabled:opacity-50"
              >
                {posterBusy ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                ) : (
                  <ImageDown size={14} aria-hidden />
                )}
                Download poster
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setExtrasOpen((open) => !open)}
            aria-expanded={extrasOpen}
            aria-label="Map options"
            className="flex h-11 w-11 items-center justify-center border border-ink/20 bg-card/95 text-ink transition-colors hover:border-ink"
          >
            <MoreHorizontal size={17} aria-hidden />
          </button>
        </div>
      </div>

      {/* Hidden poster source (rasterised on demand) */}
      <NetworkPoster svgRef={posterRef} />

      {/* Legend */}
      <MapLegend />
    </div>
  );
}

/** Small helper exported for tests/storybook-less reuse. */
export const ROUTE_COUNT = Object.keys(ROUTE_MAP).length;
