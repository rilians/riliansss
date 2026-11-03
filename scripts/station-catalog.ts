// Generate an idempotent catalog sync to run in the Supabase SQL editor.
import { STATIONS } from "../src/data/stations";
const values = STATIONS.map((station) => `('${station.id.replaceAll("'", "''")}', true)`).join(",\n  ");
console.log(`begin;\nupdate public.station_catalog set published = false;\ninsert into public.station_catalog (station_id, published) values\n  ${values}\non conflict (station_id) do update set published = excluded.published;\ncommit;`);
