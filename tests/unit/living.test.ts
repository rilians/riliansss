import { test } from "node:test";
import assert from "node:assert/strict";
import { isNewStation, latestStations } from "../../src/lib/living";
import { STATIONS } from "../../src/data/stations";

const now = Date.parse("2026-11-03T12:00:00Z");
const base = STATIONS[0];
test("new stations use publication date, exclude drafts and invalid or future dates", () => {
  assert.equal(isNewStation({ ...base, createdAt: "2020-01-01", publishedAt: "2026-11-02" }, now), true);
  assert.equal(isNewStation({ ...base, publishedAt: "2026-09-01" }, now), false);
  assert.equal(isNewStation({ ...base, status: "draft", publishedAt: "2026-11-02" }, now), false);
  assert.equal(isNewStation({ ...base, publishedAt: undefined }, now), false);
  assert.equal(isNewStation({ ...base, publishedAt: "not a date" }, now), false);
  assert.equal(isNewStation({ ...base, publishedAt: "2027-01-01" }, now), false);
});
test("latest stations are sorted by publication, not creation", () => {
  const older = { ...base, id: "older", publishedAt: "2026-10-10", createdAt: "2026-11-01" };
  const newer = { ...base, id: "newer", publishedAt: "2026-11-01", createdAt: "2020-01-01" };
  assert.deepEqual(latestStations([older, newer], now).map((s) => s.id), ["newer", "older"]);
});
