/* PA-Marine-Model app v1 — vanilla JS, no build step. Works from file:// and http.server. */
(function () {
"use strict";
const M = PA.meta, OUT = PA.outlook, BAYS = PA.bays;
const BANDC = {Low: "#7fbf8e", Watch: "#f2c94c", Elevated: "#f2994a", High: "#d64545"};
const VTXT = {demonstrated: "Skill: demonstrated", flat: "Skill: not demonstrated", worse: "Skill: worse than norm", "too few events": "Skill: untested"};
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const pct = p => p == null || isNaN(p) ? "–" : p === 0 ? "0%" : (p * 100 < 1 ? "<1%" : (p * 100).toFixed(0) + "%");
const pct1 = p => p == null || isNaN(p) ? "–" : (p * 100).toFixed(1) + "%";
const f2 = x => x == null || isNaN(x) ? "–" : (+x).toFixed(2);
const f3 = x => x == null || isNaN(x) ? "–" : (+x).toFixed(3);
const cells = c => c == null || isNaN(c) ? "–" : Math.round(c).toLocaleString("en-IE");
const band = p => p < .05 ? "Low" : p < .15 ? "Watch" : p < .30 ? "Elevated" : "High";
const chip = b => b ? `<span class="chip b-${b}">${b}</span>` : "";
const vclass = v => "v-" + (v === "too few events" ? "too" : v);
const badge = (v, region) => `<span class="badge ${vclass(v)}" title="${esc(M.skill_text[v] || v)}">${VTXT[v] || v}${region ? " · " + esc(region) : ""}</span>`;
const basisTag = b => b === "week-0 known" ? `<span class="w0" title="This week's MI sample was public at issue time; uses the week-0-known (operational) model">week-0 known</span>` : `<span class="prov" title="No MI sample yet this week; uses the conservative model with counts to last week">provisional</span>`;
const fmtDate = s => { if (!s) return "–"; const d = new Date(s + "T12:00:00Z"); return d.toLocaleDateString("en-IE", {day: "numeric", month: "short", year: "numeric"}); };
const shortDate = s => { const d = new Date(s + "T12:00:00Z"); return d.toLocaleDateString("en-IE", {day: "numeric", month: "short"}); };
const regionLabel = r => M.regions[r] || r || "–";
const scripts = {};
function loadScript(src) {
  if (!scripts[src]) scripts[src] = new Promise((ok, bad) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => bad(new Error("failed " + src)); document.head.appendChild(s); });
  return scripts[src];
}
const stations = {}; let pendingStation = null;
window.PA_load = obj => { stations[obj.id] = obj; };
function loadStation(id) { return stations[id] ? Promise.resolve(stations[id]) : loadScript(`data/stations/${id}.js`).then(() => stations[id]); }

/* ---------------- map helpers ---------------- */
let maps = [];
function baseMap(el, opts = {}) {
  maps.forEach(m => m.remove()); maps = [];
  const m = L.map(el, {zoomSnap: .25, scrollWheelZoom: !!opts.scroll, attributionControl: true, preferCanvas: false});
  m.fitBounds([[51.35, -10.6], [55.4, -5.4]]);
  const fc = {type: "FeatureCollection", features: PA.land.map(r => ({type: "Feature", geometry: {type: "Polygon", coordinates: [r.concat([r[0]])]}}))};
  /* land fill without outline; the coastline is drawn separately so the straight edges where the
     land layer was clipped (east of 4.6°W, north of 55.9°N) are not stroked, and Britain fades out
     towards its clipped edge instead of ending in a hard vertical line */
  const clipEdge = (a, b) => (a[0] >= -4.601 && b[0] >= -4.601) || (a[1] >= 55.899 && b[1] >= 55.899) || (a[1] <= 50.901 && b[1] <= 50.901);
  const clipped = r => r.some((a, j) => { const b = r[(j + 1) % r.length]; return a[0] >= -4.601 && b[0] >= -4.601; });
  const lg = L.geoJSON(fc, {style: f => ({stroke: false, fillColor: "#ece8dc", fillOpacity: 1, className: clipped(f.geometry.coordinates[0]) ? "land-clip" : ""}), interactive: false}).addTo(m);
  const lines = [];
  PA.land.forEach(r => { let cur = []; for (let j = 0; j < r.length; j++) { const a = r[j], b = r[(j + 1) % r.length]; if (clipEdge(a, b)) { if (cur.length > 1) lines.push(cur); cur = []; } else { if (!cur.length) cur.push([a[1], a[0]]); cur.push([b[1], b[0]]); } } if (cur.length > 1) lines.push(cur); });
  L.polyline(lines, {color: "#a9a18c", weight: .8, interactive: false, className: "coast"}).addTo(m);
  try {
    const svg = m.getPanes().overlayPane.querySelector("svg");
    if (svg && !svg.querySelector("#landfade")) {
      const ns = "http://www.w3.org/2000/svg", defs = document.createElementNS(ns, "defs");
      defs.innerHTML = '<linearGradient id="landfade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ece8dc" stop-opacity="1"/><stop offset=".55" stop-color="#ece8dc" stop-opacity="1"/><stop offset="1" stop-color="#ece8dc" stop-opacity="0"/></linearGradient>';
      svg.insertBefore(defs, svg.firstChild);
    }
    lg.eachLayer(l => { if (l.options.className === "land-clip" && l._path) l._path.setAttribute("fill", "url(#landfade)"); });
  } catch (e) {}
  m.attributionControl.setPrefix(false).addAttribution("Coast: Natural Earth · Counts: Marine Institute (CC-BY 4.0)");
  maps.push(m);
  return m;
}
function marker(m, lat, lon, p, o = {}) {
  const b = band(p);
  const r = o.r || (5 + Math.min(9, Math.sqrt(p) * 14));
  const c = L.circleMarker([lat, lon], {radius: r, color: o.ring || "#253238", weight: o.ring ? 3 : 1, dashArray: o.dash ? "3,3" : null,
    fillColor: BANDC[b], fillOpacity: o.dash ? .55 : .92});
  if (o.tip) c.bindTooltip(o.tip, {direction: "top"});
  if (o.href) c.on("click", () => { location.hash = o.href; });
  return c.addTo(m);
}
function legend(extra = "") {
  return `<div class="legend">${["Low", "Watch", "Elevated", "High"].map((b, i) => `<span><i class="dot" style="background:${BANDC[b]}"></i>${b} ${["<5%", "5–15%", "15–30%", "≥30%"][i]}</span>`).join("")}
  <span><i class="dot" style="background:#fff;border:2px dashed #555"></i>provisional (no sample this week)</span>
  <span><i class="dot" style="background:#fff;border:3px solid var(--acuta)"></i>D. acuta flag</span>${extra}</div>`;
}

/* ---------------- tiny SVG charts ---------------- */
function svgLine(pts) { return pts.filter(p => p[1] != null && !isNaN(p[1])).map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(""); }
function riskChart(st, year) {
  const H = st.hist, W = 720, h1 = 170, h2 = 90, pad = 36, gap = 18, Ht = h1 + h2 + gap + 34;
  const idx = H.ws.map((d, i) => [d, i]).filter(([d]) => +d.slice(0, 4) === year || (+d.slice(0, 4) === year - 1 && d.slice(5, 7) === "12" && +d.slice(8) > 28));
  const x0 = Date.UTC(year, 0, 1), x1 = Date.UTC(year, 11, 31);
  const X = d => pad + (Date.parse(d + "T00:00:00Z") + 6 * 864e5 - x0) / (x1 - x0) * (W - pad - 8);
  const pm = Math.max(.4, ...idx.map(([, i]) => Math.max(H.po[i] || 0, H.pc[i] || 0, H.pn[i] || 0)));
  const Y = p => 8 + (1 - p / pm) * (h1 - 8);
  const lc = c => Math.log10(1 + (c || 0)), cm = Math.max(3.5, ...idx.map(([, i]) => lc(H.c[i])));
  const Yc = c => h1 + gap + (1 - lc(c) / cm) * h2;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${Ht}" role="img" aria-label="Risk history ${year}">`;
  [[0, .05, "Low"], [.05, .15, "Watch"], [.15, .30, "Elevated"], [.30, pm, "High"]].forEach(([a, b, n]) => { if (a < pm) s += `<rect x="${pad}" y="${Y(Math.min(b, pm))}" width="${W - pad - 8}" height="${Y(a) - Y(Math.min(b, pm))}" fill="${BANDC[n]}" opacity=".13"/>`; });
  [0, .1, .2, .3, .4, .5, .6, .8, 1].filter(v => v <= pm).forEach(v => s += `<text x="${pad - 4}" y="${Y(v) + 4}" font-size="10" text-anchor="end" fill="#667">${v * 100}%</text>`);
  for (let mo = 0; mo < 12; mo++) { const xx = pad + (Date.UTC(year, mo, 1) - x0) / (x1 - x0) * (W - pad - 8); s += `<line x1="${xx}" x2="${xx}" y1="4" y2="${h1 + gap + h2}" stroke="#e3e8ec"/><text x="${xx + 3}" y="${Ht - 6}" font-size="10" fill="#667">${"JFMAMJJASOND"[mo]}</text>`; }
  const P = k => idx.map(([d, i]) => [X(d), H[k][i] == null ? null : Y(H[k][i])]);
  s += `<path d="${svgLine(P("pn"))}" fill="none" stroke="#7a8794" stroke-width="1.6" stroke-dasharray="5,4"/>`;
  s += `<path d="${svgLine(P("pc"))}" fill="none" stroke="#0f5f8a" stroke-width="1.3" stroke-dasharray="2,2" opacity=".8"/>`;
  s += `<path d="${svgLine(P("po"))}" fill="none" stroke="#0f5f8a" stroke-width="2.2"/>`;
  idx.forEach(([d, i]) => { if (H.y[i] === 1) s += `<circle cx="${X(d)}" cy="6" r="3.2" fill="#c0392b"><title>${d}: ≥100 cells/L followed in weeks +1/+2</title></circle>`; });
  s += `<line x1="${pad}" x2="${W - 8}" y1="${Yc(100)}" y2="${Yc(100)}" stroke="#c0392b" stroke-dasharray="4,3"/><text x="${W - 10}" y="${Yc(100) - 3}" font-size="10" fill="#c0392b" text-anchor="end">100 cells/L</text>`;
  idx.forEach(([d, i]) => { const c = H.c[i]; if (c == null) return; const yy = Yc(c); s += `<rect x="${X(d) - 2.5}" y="${yy}" width="5" height="${h1 + gap + h2 - yy}" fill="${c >= 100 ? "#c0392b" : "#8fb8cf"}"><title>${d}: ${cells(c)} cells/L total Dinophysis${H.ac[i] ? " (D. acuta " + cells(H.ac[i]) + ")" : ""}</title></rect>`; });
  [10, 100, 1000, 10000].forEach(v => { if (lc(v) <= cm) s += `<text x="${pad - 4}" y="${Yc(v) + 4}" font-size="10" text-anchor="end" fill="#667">${v >= 1000 ? v / 1000 + "k" : v}</text>`; });
  s += `<text x="${pad}" y="${h1 + gap - 4}" font-size="10.5" fill="#445">Weekly max total Dinophysis (cells/L, log scale)</text></svg>`;
  return s + `<div class="legend"><span><svg width="26" height="8"><line x1="0" x2="26" y1="4" y2="4" stroke="#0f5f8a" stroke-width="2.2"/></svg>model, week-0 known</span><span><svg width="26" height="8"><line x1="0" x2="26" y1="4" y2="4" stroke="#0f5f8a" stroke-dasharray="2,2"/></svg>model, conservative</span><span><svg width="26" height="8"><line x1="0" x2="26" y1="4" y2="4" stroke="#7a8794" stroke-width="1.6" stroke-dasharray="5,4"/></svg>seasonal norm</span><span><i class="dot" style="background:#c0392b;border:0;width:8px;height:8px"></i>event followed (≥100 in wk +1/+2)</span></div>`;
}
function normChart(st, year) {
  const W = 720, Hh = 150, pad = 36;
  const X = w => pad + (w - 1) / 52 * (W - pad - 8);
  const Y = f => 10 + (1 - f) * (Hh - 34);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Seasonal norm">`;
  [0, .25, .5, .75, 1].forEach(v => s += `<line x1="${pad}" x2="${W - 8}" y1="${Y(v)}" y2="${Y(v)}" stroke="#eef1f4"/><text x="${pad - 4}" y="${Y(v) + 4}" font-size="10" text-anchor="end" fill="#667">${v * 100}%</text>`);
  st.norm.forEach(([w, n, f]) => s += `<rect x="${X(w) - 4.5}" y="${Y(f)}" width="9" height="${Y(0) - Y(f)}" fill="#9db9cc"><title>ISO week ${w}: ≥100 cells/L in ${(f * 100).toFixed(0)}% of ${n} sampled years (2003–2025)</title></rect>`);
  const H = st.hist;
  H.ws.forEach((d, i) => { if (+d.slice(0, 4) !== year) return; const w = isoWeek(d); const c = H.c[i]; s += `<circle cx="${X(w)}" cy="${c >= 100 ? Y(1) + 4 : Y(0) - 4}" r="3.3" fill="${c >= 100 ? "#c0392b" : "#fff"}" stroke="#334"><title>${d}: ${cells(c)} cells/L</title></circle>`; });
  [1, 10, 20, 30, 40, 50].forEach(w => s += `<text x="${X(w)}" y="${Hh - 6}" font-size="10" fill="#667" text-anchor="middle">wk ${w}</text>`);
  return s + `</svg><div class="legend"><span><i class="dot" style="background:#9db9cc;border:0;border-radius:2px"></i>share of past years (2003–2025) with ≥100 cells/L that week</span><span><i class="dot" style="background:#c0392b"></i>${year} sample ≥100</span><span><i class="dot" style="background:#fff"></i>${year} sample &lt;100</span></div>`;
}
function isoWeek(d) { const t = new Date(d + "T12:00:00Z"); const day = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - day + 3); const f = new Date(Date.UTC(t.getUTCFullYear(), 0, 4)); return 1 + Math.round(((t - f) / 864e5 - 3 + ((f.getUTCDay() + 6) % 7)) / 7); }
function hist(values, lo, hi, W = 520, Hh = 170, col = "#0f5f8a") {
  const bins = []; for (let v = lo; v <= hi; v++) bins.push(0);
  let under = 0, over = 0; values.forEach(v => { if (v < lo) under++; else if (v > hi) over++; else bins[v - lo]++; });
  const mx = Math.max(1, ...bins), pad = 26, bw = (W - pad - 8) / bins.length;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${Hh}">`;
  bins.forEach((n, i) => { const h = n / mx * (Hh - 40); const v = lo + i; s += `<rect x="${pad + i * bw + 1}" y="${Hh - 22 - h}" width="${bw - 2}" height="${h}" fill="${v < 0 ? "#b9a3d9" : col}"><title>${v} weeks: ${n}</title></rect>`; if (v % 2 === 0) s += `<text x="${pad + i * bw + bw / 2}" y="${Hh - 8}" font-size="10" text-anchor="middle" fill="#667">${v}</text>`; });
  s += `<text x="${pad}" y="12" font-size="10.5" fill="#445">seasons per lead (weeks); purple = toxin/closure first${under || over ? ` · outside ${lo}…${hi}: ${under} earlier, ${over} later` : ""}</text>`;
  return s + `</svg>`;
}
function lineChart(series, opts) {
  const W = 720, Hh = 210, pad = 40; const n = Math.max(...series.map(s => s.v.length));
  const vals = series.flatMap(s => s.v).filter(v => v != null);
  const lo = opts.lo != null ? opts.lo : Math.min(...vals), hi = opts.hi != null ? opts.hi : Math.max(...vals);
  const X = i => pad + i / Math.max(1, n - 1) * (W - pad - 10), Y = v => 10 + (1 - (v - lo) / (hi - lo || 1)) * (Hh - 40);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${Hh}">`;
  for (let k = 0; k <= 4; k++) { const v = lo + (hi - lo) * k / 4; s += `<line x1="${pad}" x2="${W - 10}" y1="${Y(v)}" y2="${Y(v)}" stroke="#eef1f4"/><text x="${pad - 4}" y="${Y(v) + 4}" font-size="10" text-anchor="end" fill="#667">${v.toFixed(2)}</text>`; }
  (opts.labels || []).forEach((l, i) => { if (i % Math.ceil(n / 9) === 0) s += `<text x="${X(i)}" y="${Hh - 8}" font-size="10" text-anchor="middle" fill="#667">${l}</text>`; });
  series.forEach(se => { s += `<path d="${svgLine(se.v.map((v, i) => [X(i), v == null ? null : Y(v)]))}" fill="none" stroke="${se.c}" stroke-width="2" ${se.dash ? `stroke-dasharray="${se.dash}"` : ""}/>`; });
  return s + `</svg><div class="legend">${series.map(se => `<span><svg width="26" height="8"><line x1="0" x2="26" y1="4" y2="4" stroke="${se.c}" stroke-width="2" ${se.dash ? `stroke-dasharray="${se.dash}"` : ""}/></svg>${se.name}</span>`).join("")}</div>`;
}

/* ---------------- views ---------------- */
const V = {};
V.outlook = function (el) {
  const rows = OUT.slice();
  const nb = b => rows.filter(r => r.band === b).length;
  const top = rows.filter(r => r.band !== "Low").slice(0, 8);
  const sw = M.region_skill.southwest_kerry_westcork;
  el.innerHTML = `
  <div class="flex"><div><h1>Sunday outlook · ${fmtDate(M.issue_date)}</h1>
  <div class="muted small">Chance that <b>total Dinophysis</b> (all species summed) reaches <b>≥100 cells/L</b> at each MI monitoring station in the next two weeks (ISO weeks ${isoWeek(addDays(M.issue_date, 1))}–${isoWeek(addDays(M.issue_date, 8))}). MI counts up to ${fmtDate(M.fetch.latest_sample || M.data_last_sample)} · fetched ${esc(M.fetch.fetched_at ? M.fetch.fetched_at.slice(0, 16).replace("T", " ") : "–")}${M.fetch.source_note ? " · " + esc(M.fetch.source_note) : ""}.</div></div></div>
  <div class="grid g4" style="margin-top:12px">
    <div class="card"><div class="lbl">Stations with an outlook</div><div class="kpi">${rows.length} <small>${M.n_week0} sampled this week · ${rows.length - M.n_week0} provisional</small></div></div>
    <div class="card"><div class="lbl">High / Elevated</div><div class="kpi">${nb("High")} / ${nb("Elevated")} <small>Watch ${nb("Watch")} · Low ${nb("Low")}</small></div></div>
    <div class="card"><div class="lbl">D. acuta flags</div><div class="kpi">${rows.filter(r => r.acuta_flag).length} <small>flag = ≥10% chance of D. acuta ≥100 cells/L</small></div></div>
    <div class="card"><div class="lbl">Where the model has skill</div><div class="kpi" style="font-size:17px">SW Kerry / West Cork only</div><div class="small muted">PR-AUC ${f2(sw.model)} vs norm ${f2(sw.norm)} (2022–26). Elsewhere: flat or worse; see badges.</div></div>
  </div>
  <div class="mapwrap" style="margin-top:14px">
    <div><div id="map" class="map"></div>${legend()}</div>
    <div>
      <h2 style="margin-top:0">This week's notes</h2>
      ${top.length ? uniq(top.map(r => r.slug)).slice(0, 5).map(sl => { const b = BAYS[sl]; return `<div class="note ${b.top_band}"><a href="#/bay/${sl}"><b>${esc(b.area)}</b></a> ${chip(b.top_band)} ${badge(b.verdict)}<div class="small" style="margin-top:4px">${esc(b.note.replace(/^[^:]+:\s*\w+\.\s*/, ""))}</div></div>`; }).join("") : `<p class="muted">All stations Low this week.</p>`}
      <p class="small muted">Notes are generated by fixed templates from the numbers on this page (no AI text). <a href="#/bays">All bays →</a></p>
    </div>
  </div>
  <h2>All stations</h2>
  <div class="controls"><label class="small">Region <select id="reg"><option value="">All regions</option>${M.region_order.map(r => `<option value="${r}">${esc(M.regions[r])}</option>`).join("")}</select></label>
  <label class="small"><input type="checkbox" id="nonlow"> hide Low</label><span class="small muted right">Chance = model probability; norm = station × week-of-year climatology (the baseline to beat).</span></div>
  <div class="tablewrap"><table id="tbl"><thead><tr><th>Station</th><th class="hide-sm">Bay / area</th><th>Latest total Dinophysis</th><th>Basis</th><th class="num">Chance</th><th></th><th>Band</th><th class="num hide-sm">Norm</th><th class="hide-sm">D. acuta</th><th class="hide-sm">Model skill (region)</th></tr></thead><tbody></tbody></table></div>`;
  const m = baseMap($("#map"));
  rows.slice().sort((a, b) => a.p - b.p).forEach(r => {
    marker(m, r.latitude, r.longitude, r.p, {dash: r.basis !== "week-0 known", ring: r.acuta_flag ? "#7b4fd6" : null, href: "#/bay/" + r.slug,
      tip: `<b>${esc(r.location_name)}</b> · ${esc(r.area)}<br>${pct(r.p)} (${r.band}) · norm ${pct(r.p_norm)}<br>latest ${cells(r.last_count_sum)} cells/L (${esc(r.last_sample)})${r.basis !== "week-0 known" ? "<br><i>provisional – no sample yet this week</i>" : ""}`});
  });
  const draw = () => {
    const reg = $("#reg").value, nl = $("#nonlow").checked;
    $("#tbl tbody").innerHTML = rows.filter(r => (!reg || r.region === reg) && (!nl || r.band !== "Low")).map(r => `<tr class="${r.basis !== "week-0 known" ? "dim" : ""}">
      <td><a href="#/bay/${r.slug}">${esc(r.location_name)}</a></td><td class="hide-sm">${esc(r.area)}</td>
      <td>${cells(r.last_count_sum)} <span class="tiny muted">${esc(r.last_sample)}</span>${trendArrow(r)}</td><td>${basisTag(r.basis)}</td>
      <td class="num"><b>${pct(r.p)}</b></td><td style="width:90px"><div class="bar"><i style="width:${Math.min(100, r.p * 200)}%;background:${BANDC[r.band]}"></i></div></td>
      <td>${chip(r.band)}</td><td class="num hide-sm">${pct(r.p_norm)}</td><td class="hide-sm">${r.acuta_flag ? `<span class="acuta">flag ${pct(r.a)}</span>` : `<span class="tiny muted">${pct(r.a)}</span>`}</td>
      <td class="hide-sm">${badge(r.verdict)}</td></tr>`).join("");
  };
  $("#reg").onchange = draw; $("#nonlow").onchange = draw; draw();
};
function trendArrow(r) { if (r.basis !== "week-0 known" || r.prev_count_sum == null) return ""; const d = r.last_count_sum - r.prev_count_sum; return d > 0 ? ` <span title="up from ${cells(r.prev_count_sum)}" style="color:#c0392b">▲</span>` : d < 0 ? ` <span title="down from ${cells(r.prev_count_sum)}" style="color:#2e7d4f">▼</span>` : ""; }
function uniq(a) { return [...new Set(a)]; }
function addDays(d, n) { const t = new Date(d + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); }

V.bays = function (el) {
  const by = {}; Object.entries(BAYS).forEach(([sl, b]) => { (by[b.region] = by[b.region] || []).push([sl, b]); });
  el.innerHTML = `<h1>Bays and production areas</h1><p class="muted small">Grouped by the official MI/SFPA shellfish production area of each phytoplankton station (nearest MI biotoxin sampling site, ≤5 km). Each page shows the risk history, recent counts, seasonal norm, model skill for its region and the bloom→toxin history.</p>` +
    M.region_order.filter(r => by[r]).map(r => `<h2>${esc(M.regions[r])} ${badge(M.verdicts[r] || "too few events")}</h2><div class="baylist">${by[r].sort((a, b) => (b[1].max_p || -1) - (a[1].max_p || -1)).map(([sl, b]) => `<div><a href="#/bay/${sl}">${esc(b.area)}</a> ${b.top_band ? chip(b.top_band) : `<span class="tiny muted">no recent sample</span>`}</div>`).join("")}</div>`).join("");
};

V.bay = function (el, sl) {
  const b = BAYS[sl]; if (!b) { el.innerHTML = `<p>Unknown bay.</p>`; return; }
  const ids = uniq(b.stations.concat(b.history_only || []));
  const lt = b.lead && b.lead.lead_toxin;
  const year = +M.issue_date.slice(0, 4);
  el.innerHTML = `<p class="small"><a href="#/bays">← all bays</a></p>
  <div class="flex"><h1>${esc(b.area)}</h1>${chip(b.top_band)} ${badge(b.verdict, b.region_label)}</div>
  <div class="note ${b.top_band || ""}"><b>Weekly note (${fmtDate(M.issue_date)}).</b> ${esc(b.note)}</div>
  <p class="tiny muted">${esc(M.banner)}</p>
  <div class="grid g2">
    <div class="card"><div class="lbl">Model skill in ${esc(b.region_label)}</div>${skillCard(b.region)}</div>
    <div class="card"><div class="lbl">Bloom → toxin history (association, not forecast)</div>${lt && lt.n ? `<div class="kpi">${lt.median.toFixed(0)} weeks <small>median, n = ${lt.n} seasons (IQR ${lt.q25.toFixed(0)}–${lt.q75.toFixed(0)}, range ${lt.min}…${lt.max})</small></div>
      <div class="small">From first total Dinophysis ≥100 cells/L of the season to the first DSP result above the regulatory limit. Toxin came first in ${pct(lt.share_toxin_first)} of seasons. Seasons with a bloom: ${b.lead.seasons_bloom} of ${b.lead.seasons}; DSP onset followed in ${pct(b.lead.p_toxin_given_bloom)} of bloom seasons vs ${pct(b.lead.p_toxin_given_no_bloom)} without. <a href="#/leadtime">Method →</a></div>` : `<div class="small muted">Not enough paired phytoplankton + DSP seasons here.</div>`}</div>
  </div>
  <div class="controls"><label class="small">Season <select id="yr">${Array.from({length: 11}, (_, i) => 2026 - i).map(y => `<option ${y === year ? "selected" : ""}>${y}</option>`).join("")}</select></label></div>
  <div id="sts"><p class="muted">Loading station histories…</p></div>`;
  const render = () => {
    const y = +$("#yr").value;
    Promise.all(ids.map(loadStation)).then(sts => {
      $("#sts").innerHTML = sts.filter(Boolean).map(st => {
        const cur = OUT.find(r => r.location_id === st.id);
        return `<div class="card stcard"><div class="flex"><h2 style="margin:0">${esc(st.name)}</h2>${cur ? chip(cur.band) + " " + basisTag(cur.basis) + ` <b>${pct(cur.p)}</b> <span class="small muted">norm ${pct(cur.p_norm)}</span>` + (cur.acuta_flag ? ` <span class="acuta">D. acuta flag</span>` : "") : `<span class="small muted">no outlook this week</span>`}<span class="right tiny muted">MI station ${st.id} · ${st.lat.toFixed(3)}, ${st.lon.toFixed(3)} · ${st.n_weeks_total || "?"} sampled weeks since ${st.first_year || "?"}</span></div>
        ${cur ? `<p class="small">${esc(cur.note)}</p>` : ""}
        <h3>Risk history ${y}</h3>${riskChart(st, y)}
        <div class="grid g2"><div><h3>Seasonal norm vs ${y}</h3>${normChart(st, y)}</div>
        <div><h3>Recent MI samples</h3><table><thead><tr><th>Date</th><th class="num">Total Dinophysis</th><th>Species (cells/L)</th></tr></thead><tbody>${st.recent.slice(0, 8).map(s => `<tr><td>${s.t}</td><td class="num">${cells(s.sum)}</td><td class="tiny">${Object.entries(s.taxa).map(([k, v]) => esc(k.replace("Dinophysis", "D.")) + " " + cells(v)).join(", ") || "none detected"}</td></tr>`).join("")}</tbody></table></div></div></div>`;
      }).join("");
    });
  };
  $("#yr").onchange = render; render();
};
function skillCard(region) {
  const s = M.region_skill[region], o = M.region_skill_oper[region];
  if (!s) return `<p class="small muted">No test results for this region.</p>`;
  return `<div class="kpi">${f2(s.model)} <small>model PR-AUC vs ${f2(s.norm)} seasonal norm</small></div>
  <div class="small">2022–26 rolling-origin test, ${s.n_pos} events in ${s.n.toLocaleString()} station-weeks. Gain over norm, 95% CI: ${f3(s.gain_lo)} to ${f3(s.gain_hi)} (conservative). ${o ? `Week-0 known: ${f2(o.model)} (CI ${f3(o.gain_lo)} to ${f3(o.gain_hi)}).` : ""}<br><b>${esc(M.skill_text[s.verdict] || s.verdict)}</b>.</div>`;
}

V.replay = function (el) {
  el.innerHTML = `<h1>Season replay 2016–2026</h1><p class="muted small"><b>Hindcast.</b> Every Sunday re-run as if live, using only data available at that time: the model for season Y was fitted on years ≤Y−2 and calibrated on Y−1 (rolling origin). Purple rings mark stations where ≥100 cells/L actually followed in weeks +1/+2.</p><div id="rp"><p class="muted">Loading replay data…</p></div>`;
  loadScript("data/replay.js").then(() => {
    const R = PA.replay, dates = Object.keys(R.weeks).sort();
    const years = uniq(dates.map(d => d.slice(0, 4)));
    $("#rp").innerHTML = `<div class="controls"><label class="small">Season <select id="ry">${years.map(y => `<option ${y === "2026" ? "selected" : ""}>${y}</option>`).join("")}</select></label>
    <label class="small">Variant <select id="rv"><option value="2">model, week-0 known</option><option value="1">model, conservative</option><option value="3">seasonal norm</option></select></label>
    <button id="rplay" class="primary">▶ Play</button><input type="range" id="rw" style="flex:1;min-width:200px"><b id="rd"></b></div>
    <div class="mapwrap"><div><div id="rmap" class="map"></div><div class="legend">${["Low", "Watch", "Elevated", "High"].map(b => `<span><i class="dot" style="background:${BANDC[b]}"></i>${b}</span>`).join("")}<span><i class="dot" style="background:#fff;border:3px solid #7b4fd6"></i>event followed</span></div></div>
    <div><div id="rstat" class="card"></div><h3>Top 10 this week</h3><div id="rtop"></div></div></div>`;
    const m = baseMap($("#rmap")); let layer = L.layerGroup().addTo(m), timer = null, wds = [];
    const setYear = () => { const y = $("#ry").value; wds = dates.filter(d => d.slice(0, 4) === y); const r = $("#rw"); r.min = 0; r.max = wds.length - 1; const ix = wds.findIndex(d => d.slice(5, 7) >= "07"); r.value = y === "2026" ? wds.length - 1 : Math.max(0, ix); showYear(y); show(); };
    const showYear = y => { const a = R.per_year[y], o = R.per_year_oper[y]; $("#rstat").innerHTML = a ? `<div class="lbl">${y} season, all stations (rolling-origin test)</div><table><tr><th></th><th class="num">PR-AUC</th></tr><tr><td>Model, week-0 known</td><td class="num">${f3(o.V2)}</td></tr><tr><td>Model, conservative</td><td class="num">${f3(a.V2)}</td></tr><tr><td>Seasonal norm (station × week)</td><td class="num">${f3(a.station_week_clim)}</td></tr><tr><td>Same as last week</td><td class="num">${f3(a.persistence)}</td></tr></table><div class="tiny muted">${a.n_pos} events in ${a.n.toLocaleString()} station-weeks. 2026 = data to 24 Aug at model freeze.</div>` : ""; };
    const show = () => {
      const d = wds[+$("#rw").value], v = +$("#rv").value; $("#rd").textContent = fmtDate(d); layer.clearLayers();
      const rows = R.weeks[d].slice().sort((a, b) => a[v] - b[v]);
      rows.forEach(r => { const s = R.stations[r[0]]; marker(layer, s[1], s[2], r[v], {ring: r[4] === 1 ? "#7b4fd6" : null, href: "#/bay/" + s[4], tip: `<b>${esc(s[0])}</b><br>${pct(r[v])} · count ${cells(r[5])}<br>${r[4] === 1 ? "≥100 followed" : r[4] === 0 ? "no event followed" : "not verifiable"}`}); });
      $("#rtop").innerHTML = `<table><thead><tr><th>Station</th><th class="num">Chance</th><th>Band</th><th>Then</th></tr></thead><tbody>${rows.slice().reverse().slice(0, 10).map(r => `<tr><td><a href="#/bay/${R.stations[r[0]][4]}">${esc(R.stations[r[0]][0])}</a></td><td class="num">${pct(r[v])}</td><td>${chip(band(r[v]))}</td><td>${r[4] === 1 ? "<b style='color:#7b4fd6'>≥100</b>" : r[4] === 0 ? "<span class='muted'>no</span>" : "<span class='muted'>–</span>"}</td></tr>`).join("")}</tbody></table>`;
    };
    $("#ry").onchange = setYear; $("#rv").onchange = show; $("#rw").oninput = show;
    $("#rplay").onclick = () => { if (timer) { clearInterval(timer); timer = null; $("#rplay").textContent = "▶ Play"; return; } $("#rplay").textContent = "❚❚ Pause"; timer = setInterval(() => { const r = $("#rw"); if (+r.value >= +r.max) { clearInterval(timer); timer = null; $("#rplay").textContent = "▶ Play"; return; } r.value = +r.value + 1; show(); }, 700); };
    setYear();
  });
};

V.scoreboard = function (el) {
  const S = PA.scoreboard, G = S.genuine, P = S.pseudo_prospective, s = P.scored, s0 = P.scored_if_week0_known, pf = P.post_freeze;
  const bandRows = st => ["Low", "Watch", "Elevated", "High"].map(b => { const x = st.bands[b]; return `<tr><td>${chip(b)}</td><td class="num">${x.n}</td><td class="num">${x.events}</td><td class="num">${x.n ? pct1(x.events / x.n) : "–"}</td></tr>`; }).join("");
  const bi = P.by_issue;
  el.innerHTML = `<h1>Forecast scoreboard</h1>
  <p class="muted small">Event = total Dinophysis ≥100 cells/L in ISO week +1 or +2 after the issue Sunday. A forecast is scored ${S.rules.scoring_delay_days} days after issue (two forecast weeks plus one week for MI to publish counts) if at least one of the two weeks was sampled. Hit = event at Watch or above · miss = event at Low · false alarm = no event at Elevated/High.</p>
  <div class="genuine"><span class="tag">GENUINE · LOGGED BEFORE THE OUTCOME</span>
  <h2 style="margin-top:8px">Track record of issued forecasts (from 4 Oct 2026)</h2>
  <p class="small">Each Sunday issue is saved as a CSV, its SHA256 appended to <code>SHA256SUMS</code> and to a hash-chained <code>LEDGER.jsonl</code>; files are never overwritten and a file whose hash does not match is never scored. Ledger chain: <b>${G.ledger_chain_ok ? "intact" : "BROKEN"}</b> (${G.ledger_entries} entr${G.ledger_entries === 1 ? "y" : "ies"}).</p>
  <table><thead><tr><th>Issue</th><th class="num">Stations</th><th>Bands</th><th>Status</th><th>Scoring due</th><th>SHA256</th></tr></thead><tbody>${(G.issues || []).map(i => { const f = G.files["issued_" + i.issue_date + ".csv"] || {}; return `<tr><td>${fmtDate(i.issue_date)}</td><td class="num">${i.n}</td><td class="small">${["High", "Elevated", "Watch", "Low"].filter(b => i.bands[b]).map(b => chip(b) + " " + i.bands[b]).join(" ")}</td><td class="small">${Object.entries(i.status).map(([k, v]) => esc(k) + " " + v).join(", ")}</td><td>${fmtDate(i.due_for_scoring)}</td><td class="mono">${esc((f.sha256 || "").slice(0, 16))}…</td></tr>`; }).join("") || `<tr><td colspan="6" class="muted">No forecasts logged yet.</td></tr>`}</tbody></table>
  ${G.scored && G.scored.n ? `<p><b>Scored so far:</b> ${G.scored.n} forecasts, ${G.scored.events} events; Brier ${f3(G.scored.brier)} vs norm ${f3(G.scored.brier_norm)}; PR-AUC ${f3(G.scored.pr_auc)} vs ${f3(G.scored.pr_auc_norm)}; hits ${G.scored.hits_watch_or_above}, misses ${G.scored.misses_low}, false alarms ${G.scored.false_alarms_elevated_or_above}.</p>` : `<p><b>Nothing scored yet.</b> The first genuine forecast (${fmtDate(M.issue_date)}) becomes scoreable on ${fmtDate(addDays(M.issue_date, 21))}, when MI counts for its two forecast weeks should be public. Until then there is <b>no genuine track record</b>; the hindcast below is not a substitute.</p>`}
  </div>
  <div class="hindcast" style="margin-top:18px"><span class="tag">HINDCAST · PSEUDO-PROSPECTIVE · NOT ISSUED AT THE TIME</span>
  <h2 style="margin-top:8px">How the same model would have scored on 2026 Sundays (${fmtDate(P.from)} – ${fmtDate(P.to)})</h2>
  <p class="small">The 2026 rolling-origin fold (fitted on ≤2024, calibrated on 2025), <b>conservative variant</b> (counts to the previous week only, since we cannot know which week-0 samples were public on each past Sunday). Model v2 was chosen using data to ${fmtDate(P.post_freeze_from)} that include most of these weeks, so only the post-freeze subset is fully out-of-sample.</p>
  <div class="grid g4">
    <div class="card"><div class="lbl">Forecasts scored</div><div class="kpi">${s.n.toLocaleString()} <small>${s.events} events (${pct1(s.obs_rate)})</small></div></div>
    <div class="card"><div class="lbl">PR-AUC (ranking)</div><div class="kpi">${f3(s.pr_auc)} <small>vs norm ${f3(s.pr_auc_norm)}</small></div><div class="tiny muted">${s.pr_auc < s.pr_auc_norm ? "Below the seasonal norm in 2026 (conservative)." : "Above the seasonal norm."} If week-0 known: ${f3(s0.pr_auc)}.</div></div>
    <div class="card"><div class="lbl">Brier (lower is better)</div><div class="kpi">${f3(s.brier)} <small>vs norm ${f3(s.brier_norm)}</small></div><div class="tiny muted">BSS vs norm ${f2(s.bss_vs_norm)} · mean forecast ${pct1(s.mean_forecast)} vs observed ${pct1(s.obs_rate)}</div></div>
    <div class="card"><div class="lbl">Hits / misses / false alarms</div><div class="kpi">${s.hits_watch_or_above} / ${s.misses_low} / ${s.false_alarms_elevated_or_above}</div><div class="tiny muted">of ${s.events} events; false alarms = Elevated/High with no event</div></div>
  </div>
  <div class="grid g2" style="margin-top:12px"><div><h3>Running PR-AUC (cumulative over issue weeks)</h3>${lineChart([{name: "model (conservative)", c: "#0f5f8a", v: bi.map(x => x.cum_pr_auc)}, {name: "seasonal norm", c: "#7a8794", dash: "5,4", v: bi.map(x => x.cum_pr_auc_norm)}], {lo: 0, hi: 1, labels: bi.map(x => shortDate(x.issue_date))})}</div>
  <div><h3>Reliability by band</h3><table><thead><tr><th>Band</th><th class="num">Forecasts</th><th class="num">Events</th><th class="num">Observed rate</th></tr></thead><tbody>${bandRows(s)}</tbody></table>
  <p class="small">Post-freeze only (issues after ${fmtDate(P.post_freeze_from)}): ${pf.n} forecasts, ${pf.events} events, PR-AUC ${f3(pf.pr_auc)} vs norm ${f3(pf.pr_auc_norm)} — far too few events to conclude anything. D. acuta flag (hindcast): ${P.acuta_flag.flags} flags, ${P.acuta_flag.flag_hits} of ${P.acuta_flag.acuta_events} D. acuta events caught.</p></div></div>
  <h3>Week by week</h3><div class="tablewrap" style="max-height:420px"><table><thead><tr><th>Issue Sunday</th><th class="num">Scored</th><th class="num">Events</th><th class="num">Mean fcst</th><th class="num">Brier</th><th class="num">Brier norm</th><th class="num">Hits</th><th class="num">Misses</th><th class="num">FA</th><th class="hide-sm">Events (model chance)</th></tr></thead><tbody>${bi.slice().reverse().map(x => `<tr><td>${fmtDate(x.issue_date)}</td><td class="num">${x.n}</td><td class="num">${x.events}</td><td class="num">${pct1(x.mean_forecast)}</td><td class="num">${f3(x.brier)}</td><td class="num">${f3(x.brier_norm)}</td><td class="num">${x.hits_watch_or_above}</td><td class="num">${x.misses_low}</td><td class="num">${x.false_alarms_elevated_or_above}</td><td class="tiny hide-sm">${x.events_list.map(e => esc(e.station) + " " + pct(e.p)).join(", ")}</td></tr>`).join("")}</tbody></table></div>
  <h3>By region (hindcast)</h3><table><thead><tr><th>Region</th><th class="num">n</th><th class="num">Events</th><th class="num">PR-AUC</th><th class="num">Norm</th><th class="num">Brier</th><th class="num">Brier norm</th></tr></thead><tbody>${M.region_order.filter(r => P.by_region[r]).map(r => { const x = P.by_region[r]; return `<tr><td>${esc(M.regions[r])}</td><td class="num">${x.n}</td><td class="num">${x.events}</td><td class="num">${f3(x.pr_auc)}</td><td class="num">${f3(x.pr_auc_norm)}</td><td class="num">${f3(x.brier)}</td><td class="num">${f3(x.brier_norm)}</td></tr>`; }).join("")}</tbody></table>
  </div>`;
};

V.leadtime = function (el) {
  const T = PA.leadtime, sw = T.by_region["SW Kerry / West Cork"], A = T.all;
  const areas = Object.entries(T.by_area).filter(([, v]) => v.lead_toxin.n >= 3).sort((a, b) => b[1].lead_toxin.n - a[1].lead_toxin.n);
  const blk = (name, x) => `<div class="card"><div class="lbl">${esc(name)}</div><div class="kpi">${x.lead_toxin.n ? x.lead_toxin.median.toFixed(0) + " weeks" : "–"} <small>median lead, n = ${x.lead_toxin.n} area-seasons</small></div>
    <div class="small">IQR ${x.lead_toxin.n ? x.lead_toxin.q25.toFixed(0) + "–" + x.lead_toxin.q75.toFixed(0) : "–"} · within 0–4 weeks: ${pct(x.lead_toxin.share_within_4w)} · toxin first: ${pct(x.lead_toxin.share_toxin_first)}<br>
    DSP onset in ${pct(x.p_toxin_given_bloom)} of ${x.seasons_bloom} bloom seasons vs ${pct(x.p_toxin_given_no_bloom)} of ${x.seasons - x.seasons_bloom} without.<br>
    To DSP closure (2019+): ${x.lead_closure.n ? `median ${x.lead_closure.median.toFixed(0)} weeks, n = ${x.lead_closure.n}` : "n = 0"}</div></div>`;
  el.innerHTML = `<h1>Bloom → toxin lead time</h1>
  <p class="muted small">How many weeks after Dinophysis first reaches ≥100 cells/L in a season does DSP toxin in shellfish go above the regulatory limit, per production area? <b>This is a historical association, not a forecast</b>, and toxin results, not counts, decide closures.</p>
  <div class="grid g3">${sw ? blk("SW Kerry / West Cork", sw) : ""}${blk("All regions", A)}
  <div class="card"><div class="lbl">Data</div><div class="small">DSP results: ${esc(T.biotoxin_source)} (last sample ${fmtDate(T.biotoxin_last_sample)}). Closures: ${esc(T.status_source)} (to ${fmtDate(T.status_last_week)}). Counts: MI phytoplankton (ERDDAP <code>habs_phyto</code>). Season = ISO weeks ${T.season_iso_weeks[0]}–${T.season_iso_weeks[1]}; area-seasons need ≥8 phytoplankton weeks and ≥8 DSP results.</div></div></div>
  <div class="grid g2"><div class="card"><h3 style="margin-top:0">SW Kerry / West Cork: weeks from first ≥100 cells/L to DSP above limit</h3>${sw ? hist(sw.lead_toxin.values, -8, 20) : ""}</div>
  <div class="card"><h3 style="margin-top:0">SW Kerry / West Cork: weeks to DSP closure (2019 onward)</h3>${sw && sw.lead_closure.n ? hist(sw.lead_closure.values, -8, 20, 520, 170, "#b3541e") : "<p class='muted'>none</p>"}</div></div>
  <h2>Per bay / production area (n ≥ 3 paired seasons)</h2>
  <div class="tablewrap"><table><thead><tr><th>Area</th><th class="hide-sm">Region</th><th class="num">Seasons</th><th class="num">Bloom seasons</th><th class="num">n paired</th><th class="num">Median</th><th class="num">IQR</th><th class="num">Range</th><th class="num">Toxin first</th><th class="num hide-sm">P(toxin | bloom)</th><th class="num hide-sm">P(toxin | no bloom)</th><th class="num hide-sm">Closure n / median</th></tr></thead><tbody>${areas.map(([a, v]) => { const l = v.lead_toxin, c = v.lead_closure; return `<tr><td><a href="#/bay/${T.area_slugs[a]}">${esc(a)}</a></td><td class="hide-sm small">${esc(v.region)}</td><td class="num">${v.seasons}</td><td class="num">${v.seasons_bloom}</td><td class="num"><b>${l.n}</b></td><td class="num"><b>${l.median.toFixed(0)}</b></td><td class="num">${l.q25.toFixed(0)}–${l.q75.toFixed(0)}</td><td class="num">${l.min} to ${l.max}</td><td class="num">${pct(l.share_toxin_first)}</td><td class="num hide-sm">${pct(v.p_toxin_given_bloom)}</td><td class="num hide-sm">${pct(v.p_toxin_given_no_bloom)}</td><td class="num hide-sm">${c.n ? c.n + " / " + c.median.toFixed(0) : "0"}</td></tr>`; }).join("")}</tbody></table></div>
  <h2>Method and caveats</h2><ul class="tight small">
  <li><b>Bloom onset</b>: first ISO week in the season when any MI phytoplankton station in the production area had total Dinophysis (sum of all Dinophysis taxa in a sample) ≥100 cells/L.</li>
  <li><b>Toxin onset</b>: first MI DSP (okadaic-acid group) result at or above 0.16 µg OA eq/g (or a 'positive' bioassay before LC-MS) whose previous DSP result in that area was below the limit, so toxicity carried over from winter is not counted as a new onset.</li>
  <li><b>Closure</b>: first week with production-area status 'Closed' and reason 'Toxicity – DSP'; reasons are only recorded from 2019, so n is small.</li>
  <li><b>Association, not a forecast.</b> Many bloom seasons never reach the toxin limit; 100 cells/L is a low bar that is crossed in most SW seasons, sometimes months before toxin appears, which is why the distribution has a long tail. Some areas share water and phytoplankton stations, so seasons are not independent and the n's overstate the evidence.</li>
  <li>Toxin first (negative leads) happens: sampling gaps, other DSP producers (e.g. D. acuta offshore), or toxin uptake before the station count crosses 100.</li>
  <li>Monitoring frequencies changed over 2002–2026 (bioassay era until ~2011, LC-MS after), and recent seasons (2022–2026) had very few DSP exceedances, so most pairs come from 2005–2021.</li>
  <li>Open data only: Marine Institute ERDDAP <code>habs_biotoxin</code> and <code>habs_status</code>, no accounts needed. This run: biotoxin ${esc(M.fetch.habs_biotoxin_source || T.biotoxin_source)}; status ${esc(M.fetch.habs_status_source || T.status_source)}. DSP results on disk run to ${fmtDate(T.biotoxin_last_sample)}, so the 2026 season is incomplete.</li></ul>`;
};

V.honesty = function (el) {
  const Hn = PA.honesty, h = Hn.T2_cons.headline_2022_2026, fr = Hn.T2_cons.fresh_2016_2021, ho = Hn.T2_oper.headline_2022_2026, fo = Hn.T2_oper.fresh_2016_2021, a = Hn.T5_cons.headline_2022_2026;
  const ci = (x, k) => `${f3(x.pr_auc[k])} <span class="tiny muted">[${f3(x.pr_auc_ci95[k].lo)}–${f3(x.pr_auc_ci95[k].hi)}]</span>`;
  const dl = x => { const d = x.delta_ci95["V2 - station_week_clim"]; return `${d.lo >= 0 ? "+" : ""}${f3(d.lo)} to +${f3(d.hi)}`; };
  el.innerHTML = `<h1>How good is this?</h1>
  <p class="muted">Short answer: <b>modestly better than the seasonal norm overall, clearly better only in SW Kerry / West Cork, and not better (or worse) elsewhere.</b> All numbers come from rolling-origin tests: each year is scored by a model that never saw it.</p>
  <div class="grid g3">
    <div class="card"><div class="lbl">Headline 2022–26 (conservative)</div><div class="kpi">${f3(h.pr_auc.V2)} <small>PR-AUC [${f3(h.pr_auc_ci95.V2.lo)}–${f3(h.pr_auc_ci95.V2.hi)}]</small></div><div class="small">vs seasonal norm ${f3(h.pr_auc.station_week_clim)}; gain CI ${dl(h)}. ${h.n_pos} events in ${h.n.toLocaleString()} station-weeks (${pct1(h.prevalence)}).</div></div>
    <div class="card"><div class="lbl">Week-0 known (operational)</div><div class="kpi">${f3(ho.pr_auc.V2)} <small>PR-AUC [${f3(ho.pr_auc_ci95.V2.lo)}–${f3(ho.pr_auc_ci95.V2.hi)}]</small></div><div class="small">gain over norm ${dl(ho)}. Used only where this week's sample was public by Sunday.</div></div>
    <div class="card"><div class="lbl">Calibration</div><div class="kpi">${f3(h.brier.V2)} <small>Brier vs ${f3(h.brier.station_week_clim)} norm</small></div><div class="small">BSS vs norm ${f2(h.bss_vs_station_week_clim)} · mean forecast ${pct1(h.mean_pred)} vs ${pct1(h.prevalence)} observed · slope ${f2(h.calibration_slope)}</div></div>
  </div>
  <h2>Baselines (2022–26, conservative)</h2>
  <table><thead><tr><th>Method</th><th class="num">PR-AUC [95% CI]</th><th class="num">Brier</th></tr></thead><tbody>
  <tr><td><b>PA-Marine-Model v2</b></td><td class="num">${ci(h, "V2")}</td><td class="num">${f3(h.brier.V2)}</td></tr>
  <tr><td>Seasonal norm (station × week-of-year climatology)</td><td class="num">${ci(h, "station_week_clim")}</td><td class="num">${f3(h.brier.station_week_clim)}</td></tr>
  <tr><td>Same as last week (persistence)</td><td class="num">${ci(h, "persistence")}</td><td class="num">${f3(h.brier.persistence)}</td></tr>
  <tr><td>Week-of-year climatology (all stations)</td><td class="num">${ci(h, "week_clim")}</td><td class="num">${f3(h.brier.week_clim)}</td></tr></tbody></table>
  <p class="small">Earlier pool 2016–21: conservative ${f3(fr.pr_auc.V2)} vs norm ${f3(fr.pr_auc.station_week_clim)} (gain ${dl(fr)}: a tie); week-0 known ${f3(fo.pr_auc.V2)} (gain ${dl(fo)}). PR-AUC rewards ranking the riskiest station-weeks first; random ranking scores the event rate (~4%).</p>
  <h2>By region (2022–26)</h2>
  <table><thead><tr><th>Region</th><th class="num">Events</th><th class="num">Model</th><th class="num">Norm</th><th class="num">Gain 95% CI</th><th>Verdict</th></tr></thead><tbody>${M.region_order.map(r => { const s = M.region_skill[r]; return s ? `<tr><td>${esc(M.regions[r])}</td><td class="num">${s.n_pos}</td><td class="num">${f3(s.model)}</td><td class="num">${f3(s.norm)}</td><td class="num">${s.gain_lo == null ? "–" : f3(s.gain_lo) + " to " + f3(s.gain_hi)}</td><td>${badge(s.verdict)}</td></tr>` : ""; }).join("")}</tbody></table>
  <h2>D. acuta flag</h2><p class="small">PR-AUC ${f3(a.pr_auc.V2)} [${f3(a.pr_auc_ci95.V2.lo)}–${f3(a.pr_auc_ci95.V2.hi)}] vs seasonal norm ${f3(a.pr_auc.station_week_clim)} (gain ${dl(a)}), the most forecastable species relative to its own climatology, but only ${a.n_pos} events in 2022–26. The flag fires at ≥10% chance (fixed on 2016–25 hindcasts: ~6% of station-weeks flagged, 24% precision, 62% of D. acuta events caught).</p>
  <h2>What doesn't work (tested, not adopted)</h2><ul class="tight small">
  <li>Sea-surface temperature (repaired SST: −0.002; SST + marine-heatwave features: −0.018, and −0.036 at bloom onset, so harmful).</li>
  <li>Wind / upwelling-downwelling features: harmful (−0.024). Alongshore 'upstream' station counts: helped 2016–21 only, not adopted.</li>
  <li>Satellite chlorophyll, ODYSSEA/OSTIA SST products, climate indices, IBI back-trajectories, Mesodinium: no gain.</li>
  <li>Other taxa with the same recipe: Pseudo-nitzschia (gain CI −0.004 to +0.039), Alexandrium (−0.041 to +0.003): no demonstrated skill; Azadinium proxy worse than its norm. D. acuminata alone ties its norm; ≥500 cells/L is weak unless week-0 is known.</li></ul>
  <h2>Limits</h2><ul class="tight small">
  <li><b>Counts, not toxins.</b> ≥100 cells/L of total Dinophysis is the count threshold used throughout this project. It is not a closure and does not mean shellfish are toxic; DSP toxin results decide that (see Bloom → toxin).</li>
  <li>Skill is mostly <b>persistence plus season</b>: the model is good at saying an ongoing bloom will continue and weak at predicting onset from a clean station.</li>
  <li>2026 so far (hindcast, conservative): PR-AUC ${f3(PA.scoreboard.pseudo_prospective.scored.pr_auc)} vs norm ${f3(PA.scoreboard.pseudo_prospective.scored.pr_auc_norm)}, i.e. no better than the norm this season unless this week's sample is known (${f3(PA.scoreboard.pseudo_prospective.scored_if_week0_known.pr_auc)}). Mean forecast ${pct1(PA.scoreboard.pseudo_prospective.scored.mean_forecast)} vs ${pct1(PA.scoreboard.pseudo_prospective.scored.obs_rate)} observed.</li>
  <li>Week-0 counts are public for only some stations by Sunday (${M.n_week0} of ${M.n_stations} this week); the rest are provisional (conservative model).</li>
  <li>Independent check: this app re-ran the v2 model from scratch on fresh MI data and reproduced the stored pa/model-v2 predictions exactly (max |Δ| = ${Hn.reproduction ? f3(Hn.reproduction["T2_sum100/conservative_lag1"].max_abs_diff) : "–"}).</li>
  <li>No genuine prospective track record yet: logging started ${fmtDate(M.issue_date)}.</li></ul>`;
};

/* ---------------- router ---------------- */
function route() {
  const h = location.hash.replace(/^#\/?/, "") || "outlook";
  const [r, arg] = h.split("/");
  document.body.classList.remove("navopen");
  document.querySelectorAll("nav a").forEach(a => a.classList.toggle("on", a.dataset.r === r || (r === "bay" && a.dataset.r === "bays")));
  const el = $("#view"); maps.forEach(m => m.remove()); maps = [];
  try { (V[r] || V.outlook)(el, arg && decodeURIComponent(arg)); } catch (e) { el.innerHTML = `<p>Error: ${esc(e.message)}</p>`; console.error(e); }
  window.scrollTo(0, 0);
}
$("#banner").innerHTML = `<b>Not official.</b> ${esc(M.banner.replace(/^Not an official forecast or warning\.\s*/, ""))} <span class="muted">· <a href="https://www.marine.ie" rel="noopener">Marine Institute</a> · <a href="https://www.sfpa.ie" rel="noopener">SFPA</a></span>`;
$("#foot").innerHTML = `PA-Marine-Model · ${esc(M.model_version)} · issue ${esc(M.issue_date)} · built ${esc(M.built_at)}${M.log_entry ? ` · logged SHA256 <span class="mono">${esc(M.log_entry.sha256.slice(0, 16))}…</span>` : ""}<br>Data: Marine Institute HABs phytoplankton, biotoxin and production-area status datasets (ERDDAP, CC-BY 4.0). Coastline: Natural Earth. Map: Leaflet. Experimental research tool, not affiliated with MI or SFPA.`;
window.addEventListener("hashchange", route);
route();
})();
