import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { isRouteId, ROUTES } from "../../src/data/routes";
import { STATIONS, STATION_MAP, getNeighbors } from "../../src/data/stations";
import { useJourneyStore } from "../../src/store/journey";

function resetJourney() {
  const state = useJourneyStore.getState();
  state.setRouteFilter("all");
  state.selectStation(null);
  state.setMode("map");
  state.clearRide();
  state.clearPlan();
  state.setPlannerOpen(false);
}

describe("journey route and station state", () => {
  it("connects OpsFlow to its support line and project identity", () => {
    const station = STATION_MAP.opsflow;
    assert.equal(station.code, "ST-16");
    assert.deepEqual(station.projectIds, ["opsflow"]);
    assert.deepEqual(station.routeIds, ["support"]);
    assert.equal(getNeighbors("opsflow").prev?.id, "nusaops");
    assert.equal(getNeighbors("opsflow").next?.id, "opis");
  });

  beforeEach(resetJourney);

  it("only accepts explicit route ids from URL parameters", () => {
    assert.equal(isRouteId("build"), true);
    assert.equal(isRouteId("constructor"), false);
    assert.equal(isRouteId(null), false);
  });

  it("clears stations and zoom requests when a selected station is outside the filtered route", () => {
    for (const route of ROUTES) {
      for (const station of STATIONS) {
        resetJourney();
        useJourneyStore.getState().selectStation(station.id, { zoom: true });
        useJourneyStore.getState().setRouteFilter(route.id);

        const state = useJourneyStore.getState();
        const belongsToRoute = station.routeIds.includes(route.id);
        assert.equal(
          state.selectedStationId,
          belongsToRoute ? station.id : null,
          `${station.name} under ${route.name}`,
        );
        assert.equal(
          state.zoomRequest?.id ?? null,
          belongsToRoute ? station.id : null,
          `${station.name} zoom request under ${route.name}`,
        );
      }
    }
  });

  it("preserves selection for valid interchanges and when switching to all routes", () => {
    const interchange = STATIONS.find((station) => station.type === "interchange");
    assert.ok(interchange);

    useJourneyStore.getState().selectStation(interchange.id, { zoom: true });
    useJourneyStore.getState().setRouteFilter(interchange.routeIds[0]);
    useJourneyStore.getState().setRouteFilter(interchange.routeIds[1]);
    useJourneyStore.getState().setRouteFilter("all");

    const state = useJourneyStore.getState();
    assert.equal(state.selectedStationId, interchange.id);
    assert.equal(state.zoomRequest?.id, interchange.id);
  });

  it("keeps all route filters independent of selection, including timeline mode", () => {
    for (const route of ROUTES) {
      resetJourney();
      useJourneyStore.getState().selectStation("nusaops");
      useJourneyStore.getState().setMode("timeline");
      useJourneyStore.getState().setRouteFilter(route.id);
      assert.equal(useJourneyStore.getState().routeFilter, route.id);
      assert.equal(useJourneyStore.getState().mode, "timeline");
    }

    resetJourney();
    useJourneyStore.getState().selectStation("nusaops");
    useJourneyStore.getState().setRouteFilter("support");
    useJourneyStore.getState().setRouteFilter("all");
    assert.equal(useJourneyStore.getState().routeFilter, "all");
    assert.equal(useJourneyStore.getState().selectedStationId, "nusaops");
  });
});
