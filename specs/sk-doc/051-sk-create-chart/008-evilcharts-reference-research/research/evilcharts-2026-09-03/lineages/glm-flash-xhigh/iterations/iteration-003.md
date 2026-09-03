# Iteration 003 — Catalog of forms (KQ2)

- **Focus:** What forms evilcharts ships and how each is composed, versus the 20 corpus templates: exists-in-both / only-there / only-here.
- **Method:** Read `registry.json` (3,935 lines — structure, counts, block items), the 16 `src/registry/charts/*` (line counts + feature grep per file), `src/registry/blocks/` listing (22 demo cards), `src/registry/examples/` listing, `src/content/docs/` listing; target `references/catalog.md` (all). Prior iterations supplied composition detail.
- **All citations resolve inside `.../context/evilcharts/`.**

## Key findings

**F3.1 — Two engines, eight forms, one registry.** `src/registry/charts/` ships 8 forms × 2 engines = 16 components: area, bar, composed, line, pie, radar, radial, sankey — each in a recharts-* and an echarts-* twin. Composition sizes: recharts 449–1,502 lines; echarts 1,235–2,358 lines. Brush attach points are wired only into cartesian forms (8 refs in area/line, 6 in bar/composed, 0 in pie/radar/radial/sankey); decorative background patterns appear in bar/pie/radar/radial/sankey (echarts ships its own). [SOURCE: src/registry/charts/ directory (wc + grep per file); registry.json items at e.g. 1–27]

**F3.2 — Registry is a two-layer product.** Layer 1: 54 `registry:component` items (16 charts + 11 shared UI + assets). Layer 2: demo blocks — 22 scenario cards in `src/registry/blocks/` (b-{scenario}-{engine}-{form}: b-payouts-echarts-line-chart, b-latency-echarts-area-chart, b-budget-echarts-radial-chart, b-cache-tiers-echarts-radial-chart, b-shipments-echarts-line-chart…) plus style variants (b-monospace-bar-chart, b-isometric-bar-chart, b-grid-bar-chart, b-hover-trace-bar-chart). registry.json carries 504 `registry:block` file entries. Each block is a named real-world scenario — the demo data is a story, not sample rows. [SOURCE: registry.json:3530 (b-monospace), registry.json:3587 (b-isometric); src/registry/blocks/recharts/ + src/registry/blocks/echarts/ listings]

**F3.3 — Docs mirror the split.** `src/content/docs/` = chart-config.mdx + recharts/ + echarts/ subfolders: per-form documentation pages, not a catalog. There is no question→form index anywhere in evilcharts; discovery is by name. [SOURCE: src/content/docs/ listing]

**F3.4 — Form-level comparison.**

| Form (evilcharts) | Corpus equivalent | Class |
|---|---|---|
| area (stackable, brush) | stacked-area | both (corpus adds total-readability + gap honesty; 30-day labels display-ready) |
| line (brush, dots, reveal) | daily-line | both (corpus is 30-day single-series; evilcharts general-purpose) |
| bar (brush, backgrounds) | bar-rows, bar-columns, grouped-bars, stacked-bars | both (corpus splits one generic bar into four question-driven forms) |
| radial (progress arc) | progress-single, unit-ring | both (corpus replaces arcs with countable ticks/linear target) |
| pie (arc-based) | unit-grid / unit-ring / independent-percentages | only-there — corpus deliberately refuses arcs (catalog.md §5: "no arc-based pie or donut") |
| composed (dual-axis bar+line) | — | only-there |
| sankey (flow) | — | only-there |
| radar (star plot, shared normalized scale) | parallel-axes | only-there (corpus answers the question with per-axis independent scales) |

| Corpus form (13) | evilcharts equivalent |
|---|---|
| box-plot, calendar-grid, candlestick, daily-range, distribution-strip, heat-matrix, parallel-axes, scatter, treemap, unit-grid, waterfall, progress-single, independent-percentages | none shipped (ECharts as an engine could draw several; evilcharts does not productize them) |

**F3.5 — Data-honesty ceiling marks are corpus-ahead.** Corpus prints in-figure notices when data exceeds documented shape (scatter >20 points, heat-matrix >100 cells; gap-break marks in daily-line/daily-range/stacked-area). Evilcharts has no equivalent: shape violations fail silently or render badly. [SOURCE: target references/template-contract.md §4 — corpus side; absence across src/registry/charts/]

## RANKED CHANGES TO sk-create-chart

| # | Change | Evilcharts evidence (resolves) | Target | Verdict | Level | Route to single self-contained offline HTML |
|---|---|---|---|---|---|---|
| 1 | Scenario-named demo data in catalog examples: name each family's example delivery after a real-world story (payouts, latency, budget, shipments) so the headline-as-argument rule is demonstrated, not asserted — matches evilcharts' block naming practice | registry.json:3530-3587 + src/registry/blocks/recharts/ listing | `assets/examples/*` (6 family deliveries) — naming/headline polish only | ADOPT AS IDEA | template-level | Nothing new to render — editorial change to existing example files |
| 2 | Document sankey as a known, deliberate gap in catalog §5 name table ("reader says sankey → gap to report") so a flow request routes to a reported gap instead of a silent miss | src/registry/charts/recharts-sankey-chart.tsx (753 lines, only-there) | `references/catalog.md` §5 (prose outside sentinels — free to edit) | ADOPT AS IDEA | template-level (doc prose; frozen sentinel table untouched) | Doc-only; no rendering |
| 3 | Document composed/dual-axis (bar+line overlay) the same way, with the note that waterfall covers signed step movement but not two-axis overlay | src/registry/charts/recharts-composed-chart.tsx (1,502 lines) | `references/catalog.md` §5 | ADOPT AS IDEA | template-level (doc prose) | Doc-only |
| 4 | Name-map "radar chart" → parallel-axes in catalog §5 with the caveat that parallel-axes uses independent per-axis scales while radar normalizes to one shared radial scale — honest when the dimensions share a unit, misleading when they don't | src/registry/charts/recharts-radar-chart.tsx (611 lines) vs corpus parallel-axes row (catalog.md index) | `references/catalog.md` §5 | ADOPT AS IDEA | template-level (doc prose) | Doc-only |
| 5 | Arc-based pie | src/registry/charts/echarts-pie-chart.tsx (1,235 lines) | — | REJECT WITH REASON: corpus cuts this deliberately and substitutes countable marks (unit-ring ticks, unit-grid squares); arc-angle estimation is the known perceptual failure corpus design exists to avoid (catalog.md §5) | contract-level | n/a (rejected) |
| 6 | Engine twins (echarts-* variant of every form) | registry.json item structure: 16 charts with echarts/recharts pairs; src/registry/registry-chart.ts:5-27 | — | REJECT WITH REASON: doubles corpus maintenance for zero reader value; the corpus's single inline renderer is already the whole delivery | contract-level | Cannot — the inline-SVG renderer is the contract |
| 7 | Style-variant blocks (b-monospace, b-isometric, b-grid, b-hover-trace skins of one form) | src/registry/blocks/recharts/ listing | — | REJECT WITH REASON: register-skinned variants fragment the one-product look the corpus exists to ship (color-system.md §3: chrome identical everywhere) | contract-level | Could render offline — rejected on editorial grounds |
| 8 | In-figure shape-violation notices (evilcharts lacks them) | absence across src/registry/charts/ | corpus already has it (template-contract §4) | no change (corpus-ahead) | — | already satisfied |

## Ruled out / tried and failed this iteration

- Grepping all 16 composition files for full animation/axis props — deferred to iteration 4 (beauty physics) where physical values, not existence, are the finding.
- Block-item counting beyond what citations need (504 type entries vs 22 tsx cards): the discrepancy is registry.json also typing docs pages as blocks; immaterial to any ranked change.

## newInfoRatio: 0.5 (partially new — the 8-form/2-engine structure, 22-block scenario practice and the per-form comparison matrix are new; the corpus-side verdicts confirm deliberate existing decisions on 5 of 8 rows)

**Next focus (iteration 4):** KQ4 beauty physics — deep-read `recharts-bar-chart.tsx` + `recharts-line-chart.tsx` + one echarts twin for concrete values (grid/axis weight, tick density, radius, padding, opacity, hover states, first-paint) and one corpus template (daily-line) for the same values; produce the physical delta table.
