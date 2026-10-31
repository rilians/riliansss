import { ROUTES } from "../data/routes";
import { STATION_MAP, WALK_LINKS } from "../data/stations";
import type { RouteId } from "../types";

export interface PlanLeg {
  /** Line used for this leg, or null for a walking transfer. */
  routeId: RouteId | null;
  fromId: string;
  toId: string;
  /** Stations travelled on this leg (edges, not nodes). */
  stops: number;
}

export interface PlanResult {
  /** Every station id from origin to destination, in order. */
  nodeIds: string[];
  /** Consecutive legs, one per line used. */
  legs: PlanLeg[];
  interchanges: number;
}

interface Edge {
  to: string;
  routeId: RouteId | null;
}

/** Adjacency along each line's station order (bidirectional). */
const ADJ: Map<string, Edge[]> = (() => {
  const adj = new Map<string, Edge[]>();
  for (const route of ROUTES) {
    const ids = route.stationIds;
    for (let i = 0; i < ids.length - 1; i++) {
      const a = adj.get(ids[i]) ?? [];
      const b = adj.get(ids[i + 1]) ?? [];
      a.push({ to: ids[i + 1], routeId: route.id as RouteId });
      b.push({ to: ids[i], routeId: route.id as RouteId });
      adj.set(ids[i], a);
      adj.set(ids[i + 1], b);
    }
  }
  for (const [a, b] of WALK_LINKS) {
    const ea = adj.get(a) ?? [];
    const eb = adj.get(b) ?? [];
    ea.push({ to: b, routeId: null });
    eb.push({ to: a, routeId: null });
    adj.set(a, ea);
    adj.set(b, eb);
  }
  return adj;
})();

/**
 * Fewest-stops route between two stations across the network (BFS).
 * Returns null when either id is unknown or both are the same station.
 */
export function planRoute(fromId: string | null, toId: string | null): PlanResult | null {
  if (!fromId || !toId || fromId === toId) return null;
  if (!STATION_MAP[fromId] || !STATION_MAP[toId]) return null;

  const parent = new Map<string, { prev: string; routeId: RouteId | null }>();
  const visited = new Set<string>([fromId]);
  const queue: string[] = [fromId];

  while (queue.length > 0) {
    const cur = queue.shift() as string;
    if (cur === toId) break;
    for (const edge of ADJ.get(cur) ?? []) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      parent.set(edge.to, { prev: cur, routeId: edge.routeId });
      queue.push(edge.to);
    }
  }
  if (!visited.has(toId)) return null;

  // Walk the chain back to the origin.
  const chain: Array<{ id: string; routeId: RouteId | null }> = [];
  let cur = toId;
  while (cur !== fromId) {
    const p = parent.get(cur);
    if (!p) return null;
    chain.push({ id: cur, routeId: p.routeId });
    cur = p.prev;
  }
  chain.push({ id: fromId, routeId: chain[chain.length - 1]?.routeId ?? null });
  chain.reverse();

  const nodeIds = chain.map((n) => n.id);

  // Group consecutive edges that share a line into legs.
  const legs: PlanLeg[] = [];
  for (let i = 1; i < chain.length; i++) {
    const routeId = chain[i].routeId;
    const last = legs[legs.length - 1];
    if (last && last.routeId === routeId) {
      last.toId = chain[i].id;
      last.stops += 1;
    } else {
      legs.push({ routeId, fromId: chain[i - 1].id, toId: chain[i].id, stops: 1 });
    }
  }

  // Interchanges = changes between actual lines; walking transfers are their own thing.
  const lineLegs = legs.filter((l) => l.routeId !== null);
  return { nodeIds, legs, interchanges: Math.max(0, lineLegs.length - 1) };
}
