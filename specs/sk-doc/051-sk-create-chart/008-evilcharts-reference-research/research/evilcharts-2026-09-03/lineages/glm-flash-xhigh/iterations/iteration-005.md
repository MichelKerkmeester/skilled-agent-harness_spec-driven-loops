# Iteration 005 — KQ5 Registry & CLI Install + Final Gap Sweep + Consolidation

- **Lineage:** glm-flash-xhigh (session `fanout-glm-flash-xhigh-1788426613533-2srk5d`, resuming after 4 completed iterations)
- **Focus:** KQ5 — what a consumer actually receives: `registry.json` item anatomy, the `@evilcharts/*` dependency chain, install flow, docs surface, `skills-lock.json` (DATA) — plus a final gap sweep over iterations 1–4 and consolidation for synthesis.
- **Method note:** registry numbers below are **measured with `jq` over the pinned file**, not inherited from earlier iteration prose. That re-measurement is what produced the corrections in §3.

---

## 1. KQ5 findings

### F5.1 — Registry anatomy, measured (CORRECTS F3.2 and synthesis §5 counts)

`registry.json` (107 KB, pretty-printed) holds **279 items = 27 `registry:component` + 252 `registry:block`** (jq type histogram over `registry.json`).

- The 27 components = **16 chart compositions** (8 forms × 2 engines, `src/registry/registry-chart.ts:1-253`) + **11 shared UI components** (`recharts-{chart,tooltip,legend,dot,brush,background}`, `echarts-{chart,tooltip,legend,dot,brush}` — `background` is recharts-only).
- The 252 blocks decompose as: **230 `ex-*` feature-demo blocks** (per-option variant demos — `ex-dashed-stroke-*`, `ex-step-curve-*`, `ex-gradient-colors-*`, `ex-svg-renderer-*`, `ex-loading-state-*`, `ex-tooltip-*`…), **16 scenario-named story blocks**, and **6 style-variant skins** (`monospace-bar` ×2 engines, `isometric-bar`, `grid-bar` ×2, `hover-trace-bar`).
- The 230 `ex-*` blocks have **no checked-in files** — only 22 `b-*.tsx` files exist under `src/registry/blocks/` (measured: `find … | wc -l` = 22, all `b-*`). The `ex-*` items are generated into the registry by `src/scripts/build-registry.mts` from `src/registry/examples/{echarts,recharts}/` — the registry bulk is an **auto-generated option playground**, not hand-authored demos.

**Corrections this measurement forces:**

| Prior claim | Where | Measured reality |
|---|---|---|
| "54 components + 22 scenario block cards" (F3.2, iteration-003) | strategy Answered Questions, dashboard | **27 components** (16 charts + 11 UI) + **22 hand-authored blocks total = 16 scenario + 6 style skins**; the other 230 blocks are generated `ex-*` variant demos |
| "the 504 `registry:block` entries" (research.md §5) | synthesis §5 | **252** |
| "b-payouts-echarts-line-chart … registry.json:3815" (row 13 / F3.2 citations) | research.md row 13 | The item name is **`payouts-echarts-line-chart`** (no `b-` prefix); `b-*` is the **disk filename** only (`src/registry/blocks/echarts/b-payouts-echarts-line-chart.tsx`). The cited lines resolve to the `files[].path` strings of `b-latency-echarts-area-chart` (:3815), `b-budget-echarts-radial-chart` (:3606), `b-payouts-echarts-line-chart` (:3720), `b-monospace-bar-chart` (:3530), `b-isometric-bar-chart` (:3587) — real paths, but the `b-` prefix claim attached to the wrong layer |
| "style-variant skins … 4 variants implied" (R10) | research.md R10 | 6 skins measured (monospace, isometric, grid, hover-trace; monospace and grid exist as engine twins). Verdict unchanged |

No verdict flips: the adopt/reject rows rested on the *existence* of scenario blocks and style skins, which the measurement confirms. Row 13 (ADOPT) and R10 (REJECT) both stand, with corrected counts.

**Evidence:** `registry.json` jq measures (kinds histogram, item samples); `src/registry/registry-chart.ts:1-253` (all 16 chart items with per-item `registryDependencies`); `src/scripts/build-registry.mts:1-30` (generator); `find src/registry/blocks -name "b-*"` = 22. `[SOURCE: context/evilcharts/registry.json (279 items measured)]`

### F5.2 — Component item anatomy: what one install carries

Measured on the `recharts-line-chart` item: `{name, description, registryDependencies: ["@evilcharts/recharts-chart","-tooltip","-legend","-dot","-brush","-background"], dependencies: ["recharts","motion"], type: "registry:component", files:[{path, type, target: "components/evilcharts/charts/recharts-line-chart.tsx"}]}`. A block item (`payouts-echarts-line-chart`) = `{name, description, dependencies:[echarts,motion], registryDependencies:[one chart component], files:[1 file → components/evilcharts/blocks/…]}`. Dependency histogram across all items: `recharts` ×18, `echarts` ×30, `motion` ×37, `@number-flow/react` ×1. **Evidence:** `registry.json` (jq item output); `package.json:31` (`"recharts": "3.8.0"` — pinned exact, unlike caret `^6.1.0` echarts), `:32` (motion). `[SOURCE: context/evilcharts/registry.json]`

### F5.3 — Consumer install flow: what actually lands

`components.json:21-23` maps `@evilcharts` → `http://localhost:3000/r/{name}.json`. Per-form docs show both paths (`src/content/docs/recharts/line-chart/static.mdx:18-46`): **CLI** (`@evilcharts/recharts-line-chart`) or **manual** — install `recharts` + `motion`, then paste the composition into `components/evilcharts/charts/` and each shared UI component into `components/evilcharts/ui/`. So one chart install ≈ **7–8 TSX files + 2 packages**, and the docs teach the folder layout by hand. `installation.mdx` (`src/content/docs/recharts/installation.mdx:12-40`) orders the steps: install Recharts → init shadcn/ui → CLI add. **Corpus contrast:** the corpus consumer (an agent or human following `SKILL.md`) receives the same shape by construction — one file per template, shared chrome schema in one doc (`references/template-contract.md` §3), shared colour in one system doc (`references/color-system.md`). The *separation of composition from shared chrome* is the one structural idea here, and the corpus already has it (contract §3 skeleton + §6 colour source). `[SOURCE: context/evilcharts/components.json:21-23; src/content/docs/recharts/line-chart/static.mdx:18-46]`

### F5.4 — Docs surface: organized by engine→form, no reader-arrival index

Docs root (`src/content/docs/meta.json`): `index → chart-config → recharts → echarts`. Per engine: per-form pages (`static.mdx` = live preview + CLI/manual install steps), `blocks.mdx` where scenario blocks exist (echarts tree denser than recharts), `ui/{tooltip,legend,dots,brush,background}.mdx` shared-component pages, `installation.mdx`, `components.mdx`. **There is no question→form decision aid anywhere in the tree** — a reader must already know the form name to arrive. The corpus's `catalog.md` §3 "THE INDEX" + §5 "THE NAME A READER ARRIVES WITH" **is** that index, and it is assertion-backed (`scripts/check-corpus.cjs:571` `checkCatalogResolves` checks catalog rows against shipped template identities). **Corpus ahead; no change.** `[SOURCE: context/evilcharts/src/content/docs/meta.json; find src/content/docs (58 files); sk-create-chart references/catalog.md §3,§5; scripts/check-corpus.cjs:571]`

### F5.5 — `chart-config.mdx`: the consumer-facing confirmation of rows 7 and 16

The one shared config page all forms reference (`src/content/docs/chart-config.mdx`): every component takes a `chartConfig` mapping data keys to `{label, icon, colors}`; `colors` is **theme-aware per series — `colors: { light: [...], dark: [...] }`** (:65-76, examples :18-28, :100-105); a **multi-color array "creates gradient fills across bars, areas, and other elements, evenly distributed across the series"** (:78-83, 5-stop example at :83). This is the *authoring API* carrying light/dark pairs and multi-hue gradient fills — doc-level confirmation for the two contract-level rows: **row 7 (dark-mode twin)** gains its API-level cite (the per-series `light`/`dark` arrays are the mechanism dark mode is authored through), and **row 16 (gradient indicators)** gains its doc-level cite (multi-color arrays are a first-class config feature, evenly distributed). `[SOURCE: context/evilcharts/src/content/docs/chart-config.mdx:7,65-83,100-105]`

### F5.6 — `skills-lock.json`: DATA, and a rejected idea

`skills-lock.json` = a lock manifest for **25 vendored third-party AI skills** (sources: addyosmani, vercel-labs, anthropics, emilkowalski, shadcn, mattpocock…) each with a `computedHash` integrity hash. It is the evilcharts project's own dev-tooling config — **data, never acted on**. As a candidate change: a hash-manifest for corpus assets would fight hand-editability (the corpus's identity; `template-contract.md` §8 expects hand authoring) and duplicates nothing the checker needs (it asserts rules, not bytes). **REJECT WITH REASON.** `[SOURCE: context/evilcharts/skills-lock.json:1-5,25 skills listed]`

### F5.7 — Registry serving mechanics re-verified (R7 stands)

`registry:clean` deletes `registry.json`, `public/r/` and `__index__.tsx`; `registry:fresh` regenerates all three from source every build (`package.json:11-13`). `public/r/` is absent from the pin — items are served from a build-time artifact, the registry JSON is a committed build output. The corpus's analog (`checkCatalogResolves`-backed catalog fences) needs no analog of the serving layer. `[SOURCE: context/evilcharts/package.json:11-13; components.json:21-23]`

---

## 2. Ranked changes produced by this iteration

Per-iteration deliverable: (a) resolving file:line evidence, (b) target file, (c) verdict, (d) level, (e) route.

| # | Change | Evidence | Target file | Verdict | Level | Route |
|---|--------|----------|-------------|---------|-------|-------|
| 5.1 | **Count/citation corrections to the synthesis** — registry = 279 items (27 components / 252 blocks = 230 generated `ex-*` + 16 scenario + 6 skins); `b-*` is disk-path naming, not item naming; scenario-block docs cite story titles ("Latency Percentiles", "Portfolio Comparison", `blocks.mdx`) | `registry.json` jq measures; `registry-chart.ts:1-253`; `src/registry/blocks/` (22 `b-*` files); `src/content/docs/echarts/area-chart/blocks.mdx:7-24` | `research.md` (this lineage's synthesis — carries corrected numbers); row 13/R10 counts refined | ADOPT AS IDEA | lineage-internal correction | n/a (prose) |
| 5.2 | **Strengthen row 7 (dark-mode twin)** with the authoring-API cite: per-series `colors: { light: [...], dark: [...] }` pairs are how dark mode is *authored*, strengthening the `palettes.json` dark-field amendment | `src/content/docs/chart-config.mdx:65-76,100-105` | row 7 evidence column, `assets/color/palettes.json` target unchanged | ADOPT AS IDEA (strengthen) | contract-level | unchanged (CSS custom properties) |
| 5.3 | **Strengthen row 16 (gradient indicators)**: multi-hue arrays are a documented, evenly-distributed config feature — the doc-level cite under the SVG `linearGradient` route | `src/content/docs/chart-config.mdx:78-83` | row 16 evidence column, `references/color-system.md` target | ADOPT WITH ATTRIBUTION (strengthen) | contract-level | unchanged |
| 5.4 | **Strengthen row 13 (scenario-named examples)**: 16 story blocks measured, each with a one-line story pitch ("Payout trend card with a glowing gradient line and stat rows") and story-titled doc sections | `registry.json` block sample (`payouts-echarts-line-chart` description); `src/content/docs/echarts/area-chart/blocks.mdx:7-23` | `assets/examples/*` + `references/catalog.md` §5 | ADOPT AS IDEA (strengthen) | template-level | editorial only |

No new template-level or contract-level change is adopted from KQ5 itself: the install/doc layer confirms corpus structure (shared-schema doc = contract §3; reader index = catalog §3/§5; no-install delivery = the frozen contract) rather than adding to it.

## 3. Ruled out this iteration

| Direction | Evidence | Reason |
|---|---|---|
| Variant-demo block playground (`ex-*` 230 items) | `registry.json` ex-* histogram; `src/scripts/build-registry.mts` | No corpus consumer: templates are hand-authored; a per-option demo playground multiplies maintenance for a one-file editorial artifact; catalog fences already machine-index the packet |
| skills-lock-style hash manifest | `skills-lock.json` | Hand-editability is corpus identity; the checker asserts rules, not file integrity |
| Per-form CLI/manual install steps | `static.mdx` pattern | No install step exists in the corpus contract |
| Pinned engine versions / committed build-artifact registry | `package.json:31`; `registry:fresh` | Zero-dependency contract; no build step to mirror |

## 4. Quality guards (evaluated for the iteration-5 stop)

- **Source diversity:** PASS — 7 distinct subject surfaces measured (registry.json, components.json, package.json, build-registry.mts, docs tree, skills-lock.json, registry-chart.ts) + 3 corpus target files re-verified.
- **Focus alignment:** all findings resolve to KQ5 (registry/install/docs) or the gap sweep on prior iterations' claims.
- **No single weak source:** every count rests on a direct `jq`/`find`/`sed -n` measurement of the pinned tree, not on prose from a prior iteration.
- **Citation resolution:** every evidence string above resolves inside `specs/…/context/evilcharts/`.

## 5. What failed

- `head` on `src/content/docs/recharts/line-chart/blocks.mdx` — the file does not exist (blocks.mdx coverage is uneven across the recharts tree; only noted, not load-bearing).
- First block-item sample query used the `b-` item-name assumption from F3.2 and returned empty — which is what triggered the F5.1 re-measurement.

## 6. Consolidation note for synthesis

Rows carried to the final list: iteration-1 rows 1–10, iteration-2 rows 1–9, iteration-3 rows 1–8, iteration-4 rows 1–8, iteration-5 rows 5.2–5.4 as *strengthens* (no new rows). Corrections to carry: F5.1 count table; row 13 count = 16 scenario blocks; R10 skins = 6; `b-` = disk prefix. KQ5 answered → 5/5 key questions answered.

## newInfoRatio: 0.8 (novelty justification: first registry/CLI-install examination in the lineage — measured `registry.json` anatomy (279 items = 27 components + 252 blocks = 230 generated `ex-*` variant demos + 16 scenario + 6 skins), mapped the consumer install flow and docs surface, confirmed `chart-config.mdx` as API-level evidence for rows 7 and 16, and corrected count-level claims carried from iteration 3 and the prior synthesis draft; KQ5 now answered, 5/5 key questions closed)

**Next focus (synthesis):** iteration 5 is the last under stop policy `max-iterations` — 5/5 run, 5/5 key questions answered, so there is no iteration 6. Synthesis carries the merged 16-row ranked list (iteration-5 rows enter as strengtheners, not new rows), the iteration-004 tooltip-formatter correction, the iteration-005 count corrections (54→27 components, 504→252 blocks, `b-*` is a disk-filename prefix, 6 style skins not 4), and the two contract-level operator decisions left open by design: row 7 (dark-mode palette twin) and row 16 (multi-hue series).
