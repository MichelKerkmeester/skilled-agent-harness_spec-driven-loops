// Faithful Claude-DC -> Open Design transpiler.
//
// WHY: the .dc.html prototypes are Claude-design's format (x-dc / helmet / sc-for /
// {{ }} / DCLogic / dc-import / style-hover / support.js). Open Design has no runtime
// for any of it, so a literal copy renders broken. This evaluates that template/logic
// layer down to static, self-contained HTML that Open Design renders natively, keeping
// the visual design byte-faithful. Loop data for the Tokens page is the ground truth
// lifted verbatim from the source's DCLogic.renderVals() block.

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Websites/anobel.com/src/4_prototyping";
const OUT = join(HERE, "dist");

// Maps each Claude-DC document name (used by the index hrefs and aggregation
// dc-import names) to the clean OD-native filename. A page links/embeds live
// only when its file actually exists in dist/, else it degrades honestly.
const PAGE_MAP = {
  "Bento-Kwartaalcijfers": "kwartaalcijfers-v1.html",
  "Bento-Maandfactuur": "maandfactuur-v1.html",
  "Bento-OCI": "oci-v1.html",
  "Bento-Marad": "marad-v1.html",
  "Bento-Kwartaalcijfers-v2": "kwartaalcijfers-v2.html",
  "Bento-Maandfactuur-v2": "maandfactuur-v2.html",
  "Bento-OCI-v2": "oci-v2.html",
  "Bento-Marad-v2": "marad-v2.html",
  "Bento-Kwartaalcijfers-v3": "kwartaalcijfers-v3.html",
  "Bento-Maandfactuur-v3": "maandfactuur-v3.html",
  "Bento-OCI-v3": "oci-v3.html",
  "Bento-Marad-v3": "marad-v3.html",
};
const hasPage = (dcName) => {
  const file = PAGE_MAP[dcName];
  return file && existsSync(join(OUT, file)) ? file : null;
};

// Navigator material added beyond the original prototype: the v4 direction round
// and the new Vloot-functies category. Each row/iframe wires live when its file
// exists, else degrades (dimmed link / dashed placeholder) — same discipline as
// the faithful set, so a failed build never 404s.
const arrowSvg = (sz, col) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
function compactRow(file, title, subtitle, count) {
  const live = existsSync(join(OUT, file));
  const attr = live ? `href="${file}"` : `data-soon="1"`;
  return `        <a ${attr} style="display:flex;align-items:center;justify-content:space-between;border-radius:12px;padding:18px 20px;background:#161616;border:1px solid #262626;transition:transform .2s ease;">
          <span style="display:flex;flex-direction:column;gap:3px;"><span style="font-size:15px;font-weight:800;color:#fff;letter-spacing:-.02em;">${title}</span><span style="font-size:12px;color:#8a8a8a;font-weight:500;">${subtitle}</span></span>
          <span style="display:flex;align-items:center;gap:6px;color:#fd4f19;font-size:12px;font-weight:800;flex:none;margin-left:14px;">${count}${arrowSvg(14, "#fd4f19")}</span>
        </a>`;
}
function indexSection(label, rows) {
  return `\n    <div style="margin-top:30px;padding-top:30px;border-top:1px solid #2a2a2a;">
      <div style="font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#fd4f19;font-weight:700;margin-bottom:18px;">${label}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
${rows.join("\n")}
      </div>
    </div>`;
}
const V4_ROWS = [
  ["kwartaalcijfers-v4.html", "Kwartaal- &amp; jaarcijfers.", "Telt op · vult · tekent · veegt · doel", 5],
  ["maandfactuur-v4.html", "Eén factuur per maand.", "Dashboard · ticker · meter · sparklines · status", 5],
  ["oci-v4.html", "OCI-koppeling.", "−70% · 0× · OCI 5.0 · ~3 min · 2→1", 5],
  ["marad-v4.html", "Marad-koppeling.", "Gelaagd · ringen · stapel · diepte · release", 5],
];
const VLOOT_ROWS = [
  ["vloot-functies-groep-1.html", "Vloot-functies · groep 1", "Goedkeuring · budget · limieten · assortiment · accounts", 5],
  ["vloot-functies-groep-2.html", "Vloot-functies · groep 2", "Eigen assortiment · lijsten · winkelwagens · vrije invoer", 4],
];
// Each Vloot-functie expanded to its own page of 5 visual treatments.
const VLOOT_FUNCTION_ROWS = [
  ["goedkeuringssysteem.html", "Goedkeuringssysteem", "Poort · wachtrij · trechter · matrix · tijdlijn", 5],
  ["budgetteren.html", "Budgetteren", "Balken · meter · periode · donut · plafond", 5],
  ["bestellimieten.html", "Bestellimieten", "Segmentmeter · caps · matrix · gauge · aftelling", 5],
  ["aangepast-assortiment.html", "Aangepast assortiment", "Grid · toggles · split · matrix · filter", 5],
  ["accountbeheer.html", "Accountbeheer", "Switcher · impersonatie · grid · realtime · activiteit", 5],
  ["eigen-assortiment.html", "Eigen assortiment", "Afgeschermd · merge · beheer · scope · inventaris", 5],
  ["standaardlijsten.html", "Standaardlijsten", "Koppeling · kaarten · matrix · herbestellen · samenstelling", 5],
  ["meerdere-winkelwagens.html", "Meerdere winkelwagens", "Parallel · splits · tabs · uitsplitsing · checkout", 5],
  ["vrije-artikelinvoer.html", "Vrije artikelinvoer", "Invoer · aanvraag · status · wagen · bevestiging", 5],
];
// Second page of 5 more visuals per function (the "nog vijf richtingen" set).
const VLOOT_FUNCTION_ROWS_2 = [
  ["goedkeuringssysteem-2.html", "Goedkeuringssysteem", "Regels · hiërarchie · ratio · veroudering · bulk", 5],
  ["budgetteren-2.html", "Budgetteren", "Kalender · prognose · ledger · burn-down · categorie", 5],
  ["bestellimieten-2.html", "Bestellimieten", "Historie · frequentie · ladder · stapel · waarschuwing", 5],
  ["aangepast-assortiment-2.html", "Aangepast assortiment", "Boom · aandeel · aantal · zoek · log", 5],
  ["accountbeheer-2.html", "Accountbeheer", "Rechten · sessies · gezondheid · organigram · audit", 5],
  ["eigen-assortiment-2.html", "Eigen assortiment", "Eigen vs Nobel · onboarding · SKU · gebruik · toegang", 5],
  ["standaardlijsten-2.html", "Standaardlijsten", "Frequentie · versies · dekking · vergelijking · suggesties", 5],
  ["meerdere-winkelwagens-2.html", "Meerdere winkelwagens", "Statusbord · tijdlijn · donut · budget · verplaatsen", 5],
  ["vrije-artikelinvoer-2.html", "Vrije artikelinvoer", "Wachtrij · sourcing-tijd · match · historie · suggesties", 5],
];
function aggSectionHeader(label, count) {
  return `\n  <div style="padding:54px 60px 4px;border-top:1px solid #2a2a2a;">
    <div style="display:flex;align-items:baseline;gap:14px;"><span style="font-size:13px;letter-spacing:.26em;text-transform:uppercase;color:#fff;font-weight:800;">${label}</span><span style="font-size:12px;color:#6f6f6f;font-weight:600;">${count} visuals</span></div>
  </div>`;
}
function aggFrame(file) {
  const title = file.replace(".html", "");
  if (existsSync(join(OUT, file))) return `\n  <iframe src="${file}" title="${title}" loading="lazy" style="display:block;width:100%;height:880px;border:0;"></iframe>`;
  return `\n  <div style="margin:0 60px 14px;height:200px;border:1px dashed #333;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:#6f6f6f;font-size:13px;"><span style="font-weight:700;color:#8a8a8a;">${title}</span><span style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;">nog niet gebouwd</span></div>`;
}

// --- shared scaffold -------------------------------------------------------
function unwrap(src) {
  const helmet = (src.match(/<helmet>([\s\S]*?)<\/helmet>/i) || [, ""])[1].trim();
  let body = (src.match(/<x-dc>([\s\S]*?)<\/x-dc>/i) || [, ""])[1];
  body = body.replace(/<helmet>[\s\S]*?<\/helmet>/i, "").trim();
  return { helmet, body };
}
function doc({ head = "", body = "" }) {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${head}
</head>
<body>
${body}
</body>
</html>
`;
}

// --- 1) Design tokens: expand the three sc-for loops ----------------------
const brandSwatches = [
  { name: "Brand blue", hex: "#06458C", bg: "#06458c", use: "secondary-500 · headings, links, brand fills" },
  { name: "Blue darker", hex: "#043367", bg: "#043367", use: "secondary-800 · hover / deep accent" },
  { name: "Blue darkest", hex: "#031D3C", bg: "#031d3c", use: "secondary-1000 · deepest surface" },
  { name: "Highlight orange", hex: "#FD4F19", bg: "#fd4f19", use: "primary-500 · the accent, one CTA" },
  { name: "Gold", hex: "#DBAB00", bg: "#dbab00", use: "tertiary-500 · rare premium touch" },
  { name: "Dark board", hex: "#282828", bg: "#282828", use: "neutral-1300 · bento background" },
];
const ramps = [
  { label: "Primary / Orange", note: "0 → 1000", stops: ["#fff3f2","#ffe9e7","#fed1cc","#feb5ad","#fe9587","#fd4f19","#f14b18","#d84315","#bb3a12","#99300f","#6c220b"] },
  { label: "Secondary / Blue", note: "0 → 1000", stops: ["#f2f3f6","#e7e9ee","#cbd0dc","#acb3c9","#8591b3","#06458c","#064286","#053b77","#043367","#042a54","#031d3c"] },
  { label: "Tertiary / Gold", note: "0 → 1000", stops: ["#fcf8f2","#f9f2e7","#f3e4cb","#ecd5ac","#e5c585","#dbab00","#d1a300","#bb9200","#a27e00","#846700","#5d4900"] },
  { label: "Neutral", note: "0 → 1400", stops: ["#fefefe","#fcfcfc","#f8f8f8","#f4f4f4","#efefef","#ececec","#e8e8e8","#e2e2e2","#cfcfcf","#b5b5b5","#979797","#787878","#4e4e4e","#282828","#0a0a0a"] },
  { label: "Positive / Green", note: "0 → 1000", stops: ["#f5faf3","#e6f4e5","#b3ddb5","#97d099","#7ac37d","#4bae4f","#3f9142","#367e39","#2f6c31","#1e4720","#173418"] },
  { label: "Negative / Red", note: "0 → 1000", stops: ["#faf2f2","#f5e9e9","#f0cccc","#e8adac","#e08686","#d31510","#c9140f","#b4120e","#9c100c","#7f0d0a","#5a0907"] },
];
const radii = [
  { label: "2px", px: "2px" }, { label: "4px", px: "4px" }, { label: "8px", px: "8px" },
  { label: "12px", px: "12px" }, { label: "16px", px: "16px" },
];

function tokensDoc() {
  const swatchCards = brandSwatches.map((sw) => `        <div style="background:#fefefe;border:1px solid #e2e2e2;border-radius:12px;overflow:hidden;">
          <div style="height:88px;background:${sw.bg};"></div>
          <div style="padding:12px 14px;">
            <div style="font-weight:600;color:#0a0a0a;font-size:14px;">${sw.name}</div>
            <div style="font-size:12px;color:#979797;margin-top:3px;">${sw.hex}</div>
            <div style="font-size:11px;color:#787878;margin-top:6px;line-height:1.4;">${sw.use}</div>
          </div>
        </div>`).join("\n");

  const rampRows = ramps.map((ramp) => {
    const stops = ramp.stops.map((c) => `<div style="flex:1;height:40px;background:${c};position:relative;" title="${c}"></div>`).join("");
    return `        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span style="font-weight:600;color:#0a0a0a;font-size:13px;">${ramp.label}</span>
            <span style="font-size:11px;color:#979797;">${ramp.note}</span>
          </div>
          <div style="display:flex;border-radius:8px;overflow:hidden;border:1px solid #e2e2e2;">${stops}</div>
        </div>`;
  }).join("\n");

  const radiusSwatches = radii.map((r) => `          <div style="text-align:center;">
            <div style="width:56px;height:56px;background:#e7e9ee;border:1px solid #06458c;border-radius:${r.px};"></div>
            <div style="font-size:11px;color:#787878;margin-top:7px;">${r.label}</div>
          </div>`).join("\n");

  const head = `<style>
  *{box-sizing:border-box}
  body{margin:0}
  @media print{.sheet{box-shadow:none}}
</style>`;

  const body = `<div style="font-family:'Silka Webfont',Arial,sans-serif;background:#f4f4f4;min-height:100vh;padding:48px 5vw;color:#4e4e4e;-webkit-font-smoothing:antialiased;">

  <!-- Header -->
  <header style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:40px;border-bottom:2px solid #06458c;padding-bottom:24px;">
    <div>
      <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#979797;font-weight:600;margin-bottom:10px;">A. Nobel &amp; Zn — Maritiem totaalleverancier</div>
      <h1 style="font-family:inherit;margin:0;font-weight:600;line-height:1.05;font-size:52px;color:#06458c;letter-spacing:-.01em;">Design tokens.</h1>
    </div>
    <div style="font-size:13px;color:#979797;line-height:1.6;text-align:right;">Silka · Lucide icons<br/>Source of truth: <span style="color:#4e4e4e;font-weight:500;">anobel-tokens.css</span></div>
  </header>

  <!-- BRAND + ACCENT -->
  <section style="margin-bottom:44px;">
    <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#979797;font-weight:600;margin-bottom:16px;">Brand &amp; accent</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;">
${swatchCards}
    </div>
  </section>

  <!-- RAMPS -->
  <section style="margin-bottom:44px;">
    <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#979797;font-weight:600;margin-bottom:16px;">Full ramps</div>
    <div style="display:flex;flex-direction:column;gap:14px;">
${rampRows}
    </div>
  </section>

  <!-- TYPE + secondary panels -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;margin-bottom:44px;">

    <!-- Type scale -->
    <section style="background:#fefefe;border:1px solid #e2e2e2;border-radius:16px;padding:28px 28px 32px;">
      <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#979797;font-weight:600;margin-bottom:6px;">Typography — Silka</div>
      <div style="font-size:12px;color:#787878;margin-bottom:20px;">Weights 400 · 500 · 600 only. Headings 600 / blue / 120%.</div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:baseline;gap:14px;border-bottom:1px solid #f4f4f4;padding-bottom:14px;">
          <span style="font-size:11px;color:#979797;width:64px;flex:none;">H1 · 64</span>
          <span style="font-weight:600;color:#06458c;font-size:40px;line-height:1.1;letter-spacing:-.01em;">Prijzen.</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:14px;border-bottom:1px solid #f4f4f4;padding-bottom:14px;">
          <span style="font-size:11px;color:#979797;width:64px;flex:none;">H4 · 40</span>
          <span style="font-weight:600;color:#06458c;font-size:28px;line-height:1.1;">Budgetteren.</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:14px;border-bottom:1px solid #f4f4f4;padding-bottom:14px;">
          <span style="font-size:11px;color:#979797;width:64px;flex:none;">H6 · 24</span>
          <span style="font-weight:600;color:#06458c;font-size:20px;">Afleverlocaties.</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:14px;border-bottom:1px solid #f4f4f4;padding-bottom:14px;">
          <span style="font-size:11px;color:#979797;width:64px;flex:none;">Body · 16</span>
          <span style="font-weight:400;color:#4e4e4e;font-size:16px;line-height:1.45;">Bekijk direct uw persoonlijke prijzen en condities.</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:14px;">
          <span style="font-size:11px;color:#979797;width:64px;flex:none;">Caption</span>
          <span style="font-weight:600;color:#979797;font-size:12px;letter-spacing:.14em;text-transform:uppercase;">Pro-Functie</span>
        </div>
      </div>
    </section>

    <!-- Radius + spacing -->
    <section style="background:#fefefe;border:1px solid #e2e2e2;border-radius:16px;padding:28px;">
      <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#979797;font-weight:600;margin-bottom:20px;">Radius &amp; surface</div>
      <div style="display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap;margin-bottom:26px;">
${radiusSwatches}
      </div>
      <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#979797;font-weight:600;margin-bottom:14px;">Status</div>
      <div style="display:flex;gap:22px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:8px;font-size:14px;color:#4e4e4e;"><span style="width:8px;height:8px;border-radius:50%;background:#4bae4f;"></span>Op voorraad</div>
        <div style="display:flex;align-items:center;gap:8px;font-size:14px;color:#4e4e4e;"><span style="width:8px;height:8px;border-radius:50%;background:#d31510;"></span>Niet op voorraad</div>
      </div>
    </section>
  </div>

  <!-- COMPONENTS preview -->
  <section style="margin-bottom:20px;">
    <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#979797;font-weight:600;margin-bottom:16px;">Components</div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;">
      <button style="font-family:inherit;border:none;background:#06458c;color:#fefefe;font-weight:600;font-size:15px;padding:13px 24px;border-radius:8px;cursor:pointer;">Lijst toevoegen</button>
      <button style="font-family:inherit;border:none;background:#fd4f19;color:#fefefe;font-weight:600;font-size:15px;padding:13px 24px;border-radius:8px;cursor:pointer;">Highlight CTA</button>
      <button style="font-family:inherit;background:#fefefe;color:#06458c;font-weight:600;font-size:15px;padding:12px 23px;border-radius:8px;border:1px solid #e2e2e2;cursor:pointer;">Secundair</button>
      <span style="display:inline-flex;align-items:center;gap:6px;background:#e7e9ee;color:#06458c;font-weight:600;font-size:13px;padding:7px 13px;border-radius:999px;">Pro-Functie</span>
      <div style="display:flex;align-items:stretch;border:1px solid #cfcfcf;border-radius:8px;overflow:hidden;background:#fefefe;">
        <span style="padding:11px 16px;font-weight:600;color:#0a0a0a;font-size:15px;">€5.000</span>
        <span style="display:flex;flex-direction:column;border-left:1px solid #e2e2e2;color:#06458c;font-size:10px;">
          <span style="flex:1;display:flex;align-items:center;padding:0 9px;border-bottom:1px solid #e2e2e2;">▲</span>
          <span style="flex:1;display:flex;align-items:center;padding:0 9px;">▼</span>
        </span>
      </div>
    </div>
  </section>

</div>`;
  return doc({ head, body });
}

// --- 2) OCI v3: pure static, just unwrap ----------------------------------
function ociDoc(src) {
  const { helmet, body } = unwrap(src);
  return doc({ head: helmet, body });
}

// --- 3) Index: convert style-hover, degrade the 11 missing links ----------
function indexDoc(src) {
  let { helmet, body } = unwrap(src);
  let missing = 0;
  // Wire each feature link to its built page; degrade only the truly-missing ones.
  body = body.replace(/href="(Bento-[^"]*)\.dc\.html"/g, (_m, name) => {
    const file = hasPage(name);
    if (file) return `href="${file}"`;
    missing += 1;
    return 'data-soon="1"';
  });
  // style-hover is a Claude-DC attribute with no browser meaning -> drop (hover handled in CSS).
  body = body.replace(/\s+style-hover="[^"]*"/g, "");
  // Honest banner only while something is still unbuilt.
  if (missing > 0) {
    const banner = `\n    <div style="margin-top:22px;padding:13px 16px;border:1px solid #3a2a16;background:#241a10;border-radius:10px;color:#e6a15c;font-size:13px;line-height:1.5;max-width:560px;">${missing} richting(en) zijn nog niet gebouwd — die kaarten zijn <em>gedimd</em> en niet aanklikbaar.</div>`;
    body = body.replace(/(<\/p>)/i, `$1${banner}`);
  }
  // Append the v4 round + the new Vloot-functies category as sibling sections
  // inside the max-width container (after the v2/v3 rows, before its closing div).
  const extra = indexSection("Meer richtingen / v4", V4_ROWS.map((r) => compactRow(...r)))
    + indexSection("Vloot-functies — nieuwe categorie", VLOOT_ROWS.map((r) => compactRow(...r)))
    + indexSection("Vloot-functies — per functie · 5 visuals elk", VLOOT_FUNCTION_ROWS.map((r) => compactRow(...r)))
    + indexSection("Vloot-functies — per functie · nog 5 visuals elk", VLOOT_FUNCTION_ROWS_2.map((r) => compactRow(...r)));
  body = body.replace(/(\s*<\/div>\s*<\/div>\s*)$/, `${extra}\n$1`);
  const head = `${helmet}
<style>
  a[href]{transition:transform .2s ease}
  @media (prefers-reduced-motion: no-preference){a[href]:hover{transform:translateY(-3px)}}
  a[data-soon]{opacity:.38;filter:saturate(.3);pointer-events:none;cursor:not-allowed}
</style>`;
  return doc({ head, body });
}

// --- 4) Aggregation: stub dc-import -> iframe(OCI v3) + placeholders -------
function aggregationDoc(src) {
  let { helmet, body } = unwrap(src);
  const placeholder = (name) => `<div style="margin:0 60px 14px;height:200px;border:1px dashed #333;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:#6f6f6f;font-size:13px;">` +
    `<span style="font-weight:700;color:#8a8a8a;">${name}</span><span style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;">nog niet gebouwd</span></div>`;
  body = body.replace(/<dc-import\s+name="([^"]+)"[^>]*><\/dc-import>/g, (_m, name) => {
    const file = hasPage(name);
    if (file) return `<iframe src="${file}" title="${name}" loading="lazy" style="display:block;width:100%;height:880px;border:0;"></iframe>`;
    return placeholder(name);
  });
  // Append the v4 round + Vloot-functies sections before the footer tally.
  let extra = aggSectionHeader("Richting 04 · Meer richtingen v4", 20);
  for (const [file] of V4_ROWS) extra += aggFrame(file);
  extra += aggSectionHeader("Vloot-functies · nieuwe categorie", 9);
  for (const [file] of VLOOT_ROWS) extra += aggFrame(file);
  extra += aggSectionHeader("Vloot-functies · per functie (5 visuals elk)", 45);
  for (const [file] of VLOOT_FUNCTION_ROWS) extra += aggFrame(file);
  extra += aggSectionHeader("Vloot-functies · per functie (nog 5 visuals elk)", 45);
  for (const [file] of VLOOT_FUNCTION_ROWS_2) extra += aggFrame(file);
  body = body.replace(/(<div style="padding:60px;border-top:1px solid #2a2a2a;text-align:center;">)/, `${extra}\n  $1`);
  body = body.replace(/60 feature-visuals/, "179 feature-visuals");
  return doc({ head: helmet, body });
}

// --- run -------------------------------------------------------------------
const reads = {
  oci: await readFile(join(SRC, "Bento-OCI-v3.dc.html"), "utf8"),
  index: await readFile(join(SRC, "Anobel Visuals.dc.html"), "utf8"),
  agg: await readFile(join(SRC, "Bento-Alle-Visuals.dc.html"), "utf8"),
};

const outputs = {
  "tokens.html": tokensDoc(),
  "oci-v3.html": ociDoc(reads.oci),
  "index.html": indexDoc(reads.index),
  "aggregation.html": aggregationDoc(reads.agg),
};

for (const [name, html] of Object.entries(outputs)) {
  await writeFile(join(OUT, name), html, "utf8");
  console.log(`wrote ${name} (${html.length} bytes)`);
}

// --- self-check asserts (fidelity guards) ---------------------------------
const t = outputs["tokens.html"];
const a = (cond, msg) => console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`);
a((t.match(/height:88px/g) || []).length === 6, "tokens: 6 brand swatches");
a((t.match(/0 → 1000/g) || []).length === 5 && t.includes("0 → 1400"), "tokens: 6 ramps (5×1000 + 1×1400)");
const stopCount = (t.match(/height:40px;background:#/g) || []).length;
a(stopCount === 70, `tokens: 70 ramp stops (11*5+15) -> got ${stopCount}`);
a((t.match(/width:56px;height:56px/g) || []).length === 5, "tokens: 5 radius swatches");
for (const hex of ["#06458c","#fd4f19","#dbab00","#282828","#031d3c","#d31510","#4bae4f"]) a(t.includes(hex), `tokens: contains ${hex}`);
const idx = outputs["index.html"];
const idxLive = (idx.match(/href="[a-z0-9-]+\.html"/g) || []).length;
const idxDegraded = (idx.match(/data-soon="1"/g) || []).length;
a(!/href="Bento-[^"]*\.dc\.html"/.test(idx), "index: no dead .dc.html hrefs remain");
a(!/style-hover=/.test(idx), "index: no style-hover attrs remain");
a(idxDegraded === 0, `index: 0 degraded -> got ${idxDegraded}`);
a(idxLive === 36, `index: 36 live links (12 + 4 v4 + 2 vloot + 9 + 9 per-functie) -> got ${idxLive}`);
console.log(`INFO  index: ${idxLive} live links, ${idxDegraded} degraded`);
const agg = outputs["aggregation.html"];
const aggIframes = (agg.match(/<iframe /g) || []).length;
const aggPlaceholders = (agg.match(/nog niet gebouwd/g) || []).length;
a(!/dc-import/.test(agg), "aggregation: no dc-import remains");
a(aggPlaceholders === 0, `aggregation: 0 placeholders -> got ${aggPlaceholders}`);
a(aggIframes === 36, `aggregation: 36 iframes (12 + 4 v4 + 2 vloot + 9 + 9 per-functie) -> got ${aggIframes}`);
console.log(`INFO  aggregation: ${aggIframes} live iframes, ${aggPlaceholders} placeholders`);
for (const out of Object.keys(outputs)) a(!/<x-dc>|<helmet>|support\.js|<sc-for|{{/.test(outputs[out]), `${out}: no Claude-DC scaffold leaks`);
console.log("done");
