import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { MAP_H, MAP_W, ROUTES, ROUTE_MAP } from "../../data/routes";
import { STATIONS, WALK_LINKS, STATION_MAP } from "../../data/stations";
import { roundedPath } from "../../lib/mapPath";
import type { CareerStation, LabelPos, RouteId } from "../../types";

export interface NetworkGraphicProps {
  /** Current zoom factor — used to keep nodes and labels at constant size. */
  k: number;
  animated?: boolean;
  showLabels?: boolean;
  showGrid?: boolean;
  routeFilter?: RouteId | "all";
  selectedId?: string | null;
  hoverId?: string | null;
  trainRouteId?: RouteId | null;
  /** Route currently being ridden by the train — emphasised while riding. */
  rideRouteId?: RouteId | null;
  /** Route planner focus: emphasise these routes/stations, dim the rest. */
  planFocus?: { routes: RouteId[]; stations: string[] } | null;
  interactive?: boolean;
  onSelect?: (s: CareerStation, e?: React.MouseEvent) => void;
  onHover?: (s: CareerStation | null) => void;
  /** Ref collector for route paths (used by the traveling-train marker). */
  registerTrainPath?: (routeId: RouteId, el: SVGPathElement | null) => void;
}

const LABEL_OFFSET: Record<LabelPos, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  n: { dx: 0, dy: -15, anchor: "middle" },
  s: { dx: 0, dy: 25, anchor: "middle" },
  e: { dx: 14, dy: 4, anchor: "start" },
  w: { dx: -14, dy: 4, anchor: "end" },
  ne: { dx: 12, dy: -12, anchor: "start" },
  nw: { dx: -12, dy: -12, anchor: "end" },
  se: { dx: 12, dy: 17, anchor: "start" },
  sw: { dx: -12, dy: 17, anchor: "end" },
};

const COL_LETTERS = "ABCDEFGHIJ";

function StationNode({
  station,
  color,
  isActive,
  dimmed,
  showLabel,
  labelActive,
  interactive,
  selected,
  k,
  onSelect,
  onHover,
  appearDelay,
  animated,
}: {
  station: CareerStation;
  color: string;
  isActive: boolean;
  dimmed: boolean;
  showLabel: boolean;
  labelActive: boolean;
  interactive: boolean;
  selected: boolean;
  k: number;
  onSelect?: (s: CareerStation, e?: React.MouseEvent) => void;
  onHover?: (s: CareerStation | null) => void;
  appearDelay: number;
  animated: boolean;
}) {
  const off = LABEL_OFFSET[station.labelPos];
  const handleClick = (e: React.MouseEvent) => {
    if (interactive && onSelect) onSelect(station, e);
  };
  const handleKey = (e: React.KeyboardEvent) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(station);
    }
  };

  return (
    <g
      className={`station-g${selected ? " is-selected" : ""}${
        isActive ? " is-hover" : ""
      }${animated ? " station-pop" : ""}`}
      transform={`translate(${station.x} ${station.y}) scale(${1 / k})`}
      style={{ opacity: dimmed ? 0.14 : 1, pointerEvents: dimmed ? "none" : undefined }}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      aria-label={
        interactive
          ? `Station ${station.name}, ${station.routeIds
              .map((r) => ROUTE_MAP[r]?.name)
              .filter(Boolean)
              .join(" and ")} line, ${station.category}`
          : undefined
      }
      data-station-id={station.id}
      onClick={handleClick}
      onKeyDown={handleKey}
      onMouseEnter={() => interactive && onHover?.(station)}
      onMouseLeave={() => interactive && onHover?.(null)}
      onFocus={() => interactive && onHover?.(station)}
      onBlur={() => interactive && onHover?.(null)}
    >
      {/* hover halo */}
      <circle className="halo" r={16} fill={color} stroke="none" />
      {/* selection pulse */}
      {selected && (
        <>
          <circle className="pulse-ring" r={13.5} fill="none" stroke={color} strokeWidth={2} />
          <circle
            className="pulse-ring"
            r={13.5}
            fill="none"
            stroke={color}
            strokeWidth={2}
            style={{ animationDelay: "1.05s" }}
          />
        </>
      )}
      {/* focus ring */}
      <circle
        className="focus-ring"
        r={14.5}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />

      <g className={animated ? "pop-scale" : undefined} style={animated ? { animationDelay: `${appearDelay}s` } : undefined}>
        <g className="node">
          {station.type === "regular" && (
            <>
              <circle r={6.5} fill="var(--color-card)" stroke={color} strokeWidth={3} />
              <circle r={2.1} fill={color} />
            </>
          )}
          {station.type === "interchange" && (
            <>
              <circle r={9.5} fill="var(--color-card)" stroke="var(--color-ink)" strokeWidth={2.2} />
              <circle r={3.6} fill="var(--color-ink)" />
            </>
          )}
          {station.type === "terminal" && (
            <rect
              x={-7.5}
              y={-7.5}
              width={15}
              height={15}
              rx={1.5}
              fill={color}
              stroke="var(--color-ink)"
              strokeWidth={2.2}
            />
          )}
          {station.type === "transfer" && (
            <>
              <rect
                x={-6.5}
                y={-6.5}
                width={13}
                height={13}
                fill="var(--color-card)"
                stroke="var(--color-ink)"
                strokeWidth={2.2}
                transform="rotate(45)"
              />
              <circle r={2.1} fill="var(--color-ink)" />
            </>
          )}
        </g>
      </g>

      {showLabel && (
        <text
          className={`st-label${labelActive ? " st-label--active" : ""}`}
          x={off.dx}
          y={off.dy}
          textAnchor={off.anchor}
          dominantBaseline="middle"
        >
          {station.name.toUpperCase()}
        </text>
      )}
      {/* transparent hit area for reliable taps */}
      <circle r={17} fill="transparent" stroke="none" pointerEvents={interactive ? "all" : "none"} />
    </g>
  );
}

export default function NetworkGraphic({
  k,
  animated = false,
  showLabels = true,
  showGrid = true,
  routeFilter = "all",
  selectedId = null,
  hoverId = null,
  trainRouteId = null,
  rideRouteId = null,
  planFocus = null,
  interactive = false,
  onSelect,
  onHover,
  registerTrainPath,
}: NetworkGraphicProps) {
  const reduceMotion = useReducedMotion();
  const animate = animated && !reduceMotion;
  const trainRef = useRef<SVGGElement | null>(null);

  const routePaths = useMemo(() => {
    const map: Record<string, string> = {};
    for (const route of ROUTES) {
      map[route.id] = roundedPath(
        route.waypoints.map(([x, y]) => ({ x, y })),
        24,
      );
    }
    return map;
  }, []);

  const gridPath = useMemo(() => {
    let d = "";
    for (let x = 0; x <= MAP_W; x += 60) d += `M ${x} 0 V ${MAP_H} `;
    for (let y = 0; y <= MAP_H; y += 60) d += `M 0 ${y} H ${MAP_W} `;
    return d;
  }, []);

  // Route emphasis ---------------------------------------------------
  const hoverStation = hoverId ? STATION_MAP[hoverId] : null;
  const selectedStation = selectedId ? STATION_MAP[selectedId] : null;

  const rideActive = rideRouteId !== null;
  const planActive = planFocus !== null;

  const routeOpacity = (routeId: RouteId): number => {
    if (planActive) return planFocus.routes.includes(routeId) ? 1 : 0.08;
    if (rideActive) return rideRouteId === routeId ? 1 : 0.1;
    if (routeFilter !== "all" && routeFilter !== routeId) return 0.08;
    if (hoverStation && !hoverStation.routeIds.includes(routeId)) return 0.22;
    if (selectedStation && !selectedStation.routeIds.includes(routeId)) return 0.22;
    return 1;
  };

  const stationDimmed = (s: CareerStation): boolean => {
    if (planActive) return !planFocus.stations.includes(s.id);
    if (rideActive) return !s.routeIds.includes(rideRouteId);
    if (routeFilter !== "all" && !s.routeIds.includes(routeFilter)) return true;
    return false;
  };

  const stationLabelVisible = (s: CareerStation): boolean => {
    if (!showLabels) return false;
    if (planActive) return planFocus.stations.includes(s.id);
    if (rideActive) return s.routeIds.includes(rideRouteId);
    if (routeFilter !== "all") return s.routeIds.includes(routeFilter);
    if (hoverStation) return hoverStation.id === s.id || s.routeIds.some((r) => hoverStation.routeIds.includes(r));
    if (selectedStation) return s.routeIds.some((r) => selectedStation.routeIds.includes(r));
    return true;
  };

  const isLabelActive = (s: CareerStation): boolean =>
    hoverId === s.id || selectedId === s.id;

  const stationOpacity = (s: CareerStation): number => {
    if (planActive) return planFocus.stations.includes(s.id) ? 1 : 0.14;
    if (rideActive) return s.routeIds.includes(rideRouteId) ? 1 : 0.14;
    if (routeFilter !== "all") return s.routeIds.includes(routeFilter) ? 1 : 0.14;
    if (selectedStation && !selectedStation.routeIds.some((r) => s.routeIds.includes(r))) return 0.4;
    return 1;
  };

  // Ambient shuttle marker on the filtered route -----------------------
  const kRef = useRef(k);
  kRef.current = k;

  useEffect(() => {
    if (!trainRouteId || reduceMotion) return;
    const pathEl = document.querySelector<SVGPathElement>(
      `path[data-train-path="${trainRouteId}"]`,
    );
    if (!pathEl) return;
    let len = 0;
    try {
      len = pathEl.getTotalLength();
    } catch {
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const trainEl = trainRef.current;
      if (trainEl) {
        const p = ((now - start) / 9000) % 1;
        const pt = pathEl.getPointAtLength(p * len);
        const pt2 = pathEl.getPointAtLength(Math.min(len, p * len + 2));
        const angle = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
        trainEl.setAttribute(
          "transform",
          `translate(${pt.x} ${pt.y}) rotate(${angle}) scale(${1 / kRef.current})`,
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trainRouteId, reduceMotion]);

  const trainColor = trainRouteId ? ROUTE_MAP[trainRouteId]?.color : null;

  return (
    <g>
      {/* Coordinate grid */}
      {showGrid && (
        <g aria-hidden>
          <path d={gridPath} stroke="var(--color-line)" strokeWidth={1} opacity={0.5} fill="none" className={animate ? "fade-in-late" : undefined} />
          {/* frame letters + numbers */}
          <g className={`map-frame-text ${animate ? "fade-in-late" : ""}`}>
            {Array.from({ length: 10 }).map((_, i) => (
              <text key={`c${i}`} x={i * 120 + 60} y={13} textAnchor="middle">
                {COL_LETTERS[i]}
              </text>
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <text key={`r${i}`} x={10} y={i * 130 + 65} dominantBaseline="middle">
                {i + 1}
              </text>
            ))}
          </g>
        </g>
      )}

      {/* Walking transfer links */}
      {WALK_LINKS.map(([a, b]) => {
        const sa = STATION_MAP[a];
        const sb = STATION_MAP[b];
        if (!sa || !sb) return null;
        return (
          <line
            key={`walk-${a}-${b}`}
            x1={sa.x}
            y1={sa.y}
            x2={sb.x}
            y2={sb.y}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
            opacity={0.5}
            className="walk-link"
          />
        );
      })}

      {/* Routes: casing + colour per line (later lines bridge over earlier ones) */}
      {ROUTES.map((route, i) => {
        const d = routePaths[route.id];
        const opacity = routeOpacity(route.id);
        const emphasized =
          (planActive && planFocus.routes.includes(route.id)) ||
          (routeFilter !== "all" && routeFilter === route.id) ||
          (hoverStation && hoverStation.routeIds.includes(route.id)) ||
          (selectedStation && selectedStation.routeIds.includes(route.id));
        const width = emphasized ? 7 : 5.5;
        return (
          <g key={route.id} opacity={opacity}>
            <path
              d={d}
              fill="none"
              stroke="var(--color-paper)"
              strokeWidth={width + 5}
              strokeLinecap="round"
              className={animate ? "route-draw" : undefined}
              style={animate ? { animationDelay: `${i * 0.16 + 0.1}s` } : undefined}
            />
            <path
              d={d}
              fill="none"
              stroke={route.color}
              strokeWidth={width}
              strokeLinecap="round"
              data-train-path={route.id}
              ref={(el) => registerTrainPath?.(route.id, el)}
              className={animate ? "route-draw" : undefined}
              style={animate ? { animationDelay: `${i * 0.16 + 0.1}s` } : undefined}
            />
          </g>
        );
      })}

      {/* Ambient shuttle (mini capsule) on the filtered line */}
      {trainRouteId && trainColor && (
        <g ref={trainRef} aria-hidden>
          <rect
            x={-13}
            y={-7.5}
            width={26}
            height={15}
            rx={7.5}
            fill="var(--color-ink)"
            stroke={trainColor}
            strokeWidth={2.5}
          />
          <circle cx={8} cy={0} r={2.4} fill="#FFFFFF" />
        </g>
      )}

      {/* Stations */}
      {STATIONS.map((s, idx) => {
        const color = ROUTE_MAP[s.routeIds[0]]?.color ?? "var(--color-ink)";
        return (
          <StationNode
            key={s.id}
            station={s}
            color={color}
            k={k}
            animated={animate}
            appearDelay={0.75 + idx * 0.045}
            interactive={interactive}
            selected={selectedId === s.id}
            isActive={hoverId === s.id}
            dimmed={stationDimmed(s)}
            showLabel={stationLabelVisible(s)}
            labelActive={isLabelActive(s)}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
    </g>
  );
}
