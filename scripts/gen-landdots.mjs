// One-off generator for the globe's land dot-matrix (app/assets/landdots.json).
// Samples an equal-ish area grid against world country polygons (public-domain
// GeoJSON) and writes the lat/lng of every land hit. Run once; the JSON is
// committed so builds never fetch anything.
//
//   node scripts/gen-landdots.mjs

import { writeFileSync } from "node:fs";

const SRC = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

// Ray-casting point-in-ring test (lng/lat degrees).
function inRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function inPolygon(lng, lat, poly) {
  if (!inRing(lng, lat, poly[0])) return false;
  for (let h = 1; h < poly.length; h++) if (inRing(lng, lat, poly[h])) return false;
  return true;
}

const geo = await (await fetch(SRC)).json();
const polys = [];
for (const f of geo.features) {
  const g = f.geometry;
  if (!g) continue;
  if (g.type === "Polygon") polys.push(g.coordinates);
  else if (g.type === "MultiPolygon") for (const p of g.coordinates) polys.push(p);
}
console.log(`${polys.length} polygons`);

// Pre-compute bounding boxes so the grid scan skips most polygons instantly.
const boxed = polys.map((p) => {
  let minx = 180, maxx = -180, miny = 90, maxy = -90;
  for (const [x, y] of p[0]) {
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
  }
  return { p, minx, maxx, miny, maxy };
});

const LAT_STEP = 1.4;
const dots = [];
for (let lat = -60; lat <= 85; lat += LAT_STEP) {
  // Constant surface density: widen the longitude step toward the poles.
  const lngStep = LAT_STEP / Math.max(0.25, Math.cos((lat * Math.PI) / 180));
  for (let lng = -180; lng < 180; lng += lngStep) {
    for (const b of boxed) {
      if (lng < b.minx || lng > b.maxx || lat < b.miny || lat > b.maxy) continue;
      if (inPolygon(lng, lat, b.p)) {
        dots.push([Math.round(lat * 10) / 10, Math.round(lng * 10) / 10]);
        break;
      }
    }
  }
}
console.log(`${dots.length} land dots`);
writeFileSync(new URL("../app/assets/landdots.json", import.meta.url), JSON.stringify(dots));
