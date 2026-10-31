import { create } from "zustand";
import { STATION_MAP } from "../data/stations";
import type { RouteId } from "../types";

export type JourneyMode = "map" | "timeline";
export type RouteFilter = RouteId | "all";

interface ZoomRequest {
  id: string;
  nonce: number;
}

interface RideRequest {
  routeId: RouteId;
  nonce: number;
}

interface JourneyState {
  mode: JourneyMode;
  routeFilter: RouteFilter;
  selectedStationId: string | null;
  /** Bumped whenever a station should be centred/zoomed on the map. */
  zoomRequest: ZoomRequest | null;
  /** Bumped whenever a train ride should start on a route. */
  rideRequest: RideRequest | null;
  /** Route planner: open panel + selected endpoints (station ids). */
  plannerOpen: boolean;
  planFromId: string | null;
  planToId: string | null;
  setPlannerOpen: (open: boolean) => void;
  setPlanFrom: (id: string | null) => void;
  setPlanTo: (id: string | null) => void;
  swapPlan: () => void;
  clearPlan: () => void;
  setMode: (mode: JourneyMode) => void;
  setRouteFilter: (route: RouteFilter) => void;
  selectStation: (id: string | null, opts?: { zoom?: boolean }) => void;
  requestRide: (routeId: RouteId) => void;
  clearRide: () => void;
}

export const useJourneyStore = create<JourneyState>()((set) => ({
  mode: "map",
  routeFilter: "all",
  selectedStationId: null,
  zoomRequest: null,
  rideRequest: null,
  plannerOpen: false,
  planFromId: null,
  planToId: null,
  setPlannerOpen: (plannerOpen) => set({ plannerOpen }),
  setPlanFrom: (planFromId) => set({ planFromId }),
  setPlanTo: (planToId) => set({ planToId }),
  swapPlan: () =>
    set((s) => ({ planFromId: s.planToId, planToId: s.planFromId })),
  clearPlan: () => set({ planFromId: null, planToId: null }),
  setMode: (mode) => set({ mode }),
  setRouteFilter: (routeFilter) =>
    set((state) => {
      if (routeFilter === "all") return { routeFilter };

      const selectedStation = state.selectedStationId
        ? STATION_MAP[state.selectedStationId]
        : undefined;
      if (selectedStation && !selectedStation.routeIds.includes(routeFilter)) {
        return {
          routeFilter,
          selectedStationId: null,
          zoomRequest: null,
        };
      }

      return { routeFilter };
    }),
  selectStation: (id, opts) =>
    set((state) => ({
      selectedStationId: id,
      zoomRequest:
        id && opts?.zoom ? { id, nonce: Date.now() } : id ? state.zoomRequest : null,
    })),
  requestRide: (routeId) => set({ rideRequest: { routeId, nonce: Date.now() } }),
  clearRide: () => set({ rideRequest: null }),
}));
