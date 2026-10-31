export interface Pt {
  x: number;
  y: number;
}

export interface PathSample {
  x: number;
  y: number;
  angle: number;
}

const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: Pt, s: number): Pt => ({ x: a.x * s, y: a.y * s });
const length = (a: Pt): number => Math.hypot(a.x, a.y);
const unit = (a: Pt): Pt => {
  const l = length(a) || 1;
  return { x: a.x / l, y: a.y / l };
};
const dist = (a: Pt, b: Pt): number => Math.hypot(b.x - a.x, b.y - a.y);

/**
 * Builds a schematic transit-style path from waypoints: straight segments
 * joined by rounded (quadratic) corners, like a real metro map.
 */
export function roundedPath(points: Pt[], radius = 24): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const next = points[i + 1];
    const r = Math.min(radius, length(sub(cur, prev)) / 2, length(sub(next, cur)) / 2);
    const p1 = add(cur, mul(unit(sub(prev, cur)), r));
    const p2 = add(cur, mul(unit(sub(next, cur)), r));
    d += ` L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cur.x} ${cur.y} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

/** Position + travel angle at distance `d` along a raw waypoint polyline. */
export function pointAt(points: Pt[], d: number): PathSample {
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const seg = dist(points[i - 1], points[i]);
    if (acc + seg >= d) {
      const t = seg === 0 ? 0 : (d - acc) / seg;
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * t,
        angle: (Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x) * 180) / Math.PI,
      };
    }
    acc += seg;
  }
  const last = points[points.length - 1];
  const prev = points[points.length - 2] ?? last;
  return {
    x: last.x,
    y: last.y,
    angle: (Math.atan2(last.y - prev.y, last.x - prev.x) * 180) / Math.PI,
  };
}

/** Distance along the polyline of the point nearest to `p` (station stop positions). */
export function projectOnto(points: Pt[], p: Pt): number {
  let best = Infinity;
  let bestD = 0;
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const len2 = vx * vx + vy * vy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2));
    const qx = a.x + vx * t;
    const qy = a.y + vy * t;
    const dd = (p.x - qx) * (p.x - qx) + (p.y - qy) * (p.y - qy);
    if (dd < best) {
      best = dd;
      bestD = acc + Math.sqrt(len2) * t;
    }
    acc += Math.sqrt(len2);
  }
  return bestD;
}

/**
 * Dense polyline that follows the ROUNDED schematic path (straight runs plus
 * sampled quadratic corners). Projections onto this polyline match distances
 * along the rendered SVG path, so dash-based route overlays line up exactly.
 */
export function denseRounded(points: Pt[], radius = 24, perQ = 12): Pt[] {
  if (points.length < 2) return [];
  const out: Pt[] = [{ x: points[0].x, y: points[0].y }];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const next = points[i + 1];
    const r = Math.min(radius, length(sub(cur, prev)) / 2, length(sub(next, cur)) / 2);
    const p1 = add(cur, mul(unit(sub(prev, cur)), r));
    const p2 = add(cur, mul(unit(sub(next, cur)), r));
    for (let s = 1; s <= perQ; s++) {
      const t = s / perQ;
      const a = mul(p1, (1 - t) * (1 - t));
      const b = mul(cur, 2 * (1 - t) * t);
      const c = mul(p2, t * t);
      out.push(add(add(a, b), c));
    }
  }
  const last = points[points.length - 1];
  out.push({ x: last.x, y: last.y });
  return out;
}
