# Iteration 2: Catalog of Forms — evilcharts' eight types vs the corpus's twenty forms

## Focus

Compare the form catalog of evilcharts (8 chart types × 2 providers, 22 blocks, ~300 examples) against the twenty corpus templates and their question-first index, and name forms that exist in both, only on one side, or nowhere.

## Findings

**F2-1. evilcharts ships exactly eight chart types, twice.** `area`, `line`, `bar`, `composed`, `radar`, `pie`, `radial`, `sankey`, each as a provider-qualified pair (`recharts-*` and `echarts-*`), registered in `registry-chart.ts` with full dependency chains (e.g. `recharts-line-chart` pulls chart, tooltip, legend, dot, brush, background) and consumer targets under `components/evilcharts/charts/`. Blocks add 22 polished compositions (`b-grid-bar-chart`, `b-monospace-bar-chart`, `b-isometric-bar-chart`, `b-hover-trace-bar-chart`, `b-market-share-echarts-pie-chart`, `b-progress-rings-echarts-pie-chart`, …). [SOURCE: context/evilcharts/src/registry/registry-chart.ts:5-27] [SOURCE: context/evilcharts/src/registry/registry-chart.ts:179-198] [SOURCE: context/evilcharts/src/registry/registry-blocks.ts:7-49]

**F2-2. The corpus answers a wider question space than evilcharts covers.** Twelve of the twenty corpus forms have no evilcharts twin: `calendar-grid`, `daily-range`, `waterfall`, `candlestick`, `box-plot`, `distribution-strip`, `scatter`, `heat-matrix`, `treemap`, `unit-grid`, `independent-percentages`, `parallel-axes`. evilcharts has no heatmap, no box plot, no strip plot, no treemap, no waterfall, no candlestick, no calendar view, no unit-quantity forms at all. The corpus is not a smaller library; it is a different library, question-first rather than type-first. [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/catalog.md:42-63] [SOURCE: context/evilcharts/src/registry/registry-chart.ts:5-316]

**F2-3. Five question-pairs exist on both sides.** `bar-rows`/`bar-columns`/`grouped-bars` ↔ bar; `daily-line` ↔ line; `stacked-area` ↔ area; `stacked-bars` ↔ bar stacked; `progress-single` ↔ radial (full/semi-circle "how far to target"); `unit-ring` ↔ radial/pie (share of a whole — with the corpus's countable-ticks substitution). For these, the catalog gap is zero and the styling gap is everything: the operator's dissatisfaction lives in *how the same form is drawn*, which iterations 3-4 take up. [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/catalog.md:44-58] [SOURCE: context/evilcharts/src/registry/registry-chart.ts:260-277]

**F2-4. The composed chart (bars + line) is the one evilcharts form with no corpus answer.** `composed` is one of the eight types on both providers, described as "combining bar and line charts" — the classic magnitude-and-rate picture. No corpus row answers "how does the count and the rate move together"; the closest rows are `grouped-bars` (two periods) and `daily-line` (one measure). This is a genuine catalog gap, not a styling finding. [SOURCE: context/evilcharts/src/registry/registry-chart.ts:220-239] [SOURCE: context/evilcharts/src/registry/registry-chart.ts:69-87] [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/catalog.md:44-63]

**F2-5. Pie/donut exists only in evilcharts, and the corpus's rejection of it is documented, not accidental.** The catalog names `unit-ring` and `unit-grid` as the deliberate substitutes ("a reader counts marks instead of estimating angles") and states plainly: "This corpus draws no binned histogram and no arc-based pie or donut." [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/catalog.md:127-131]

**F2-6. Radar exists only in evilcharts and answers a question the corpus already answers.** `parallel-axes` covers "how does one entity set compare across several dimensions" (3-6 continuous dimensions). Radar is the alternative mark for the same question; it is not a new question. [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/catalog.md:62] [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/catalog.md:129] [SOURCE: context/evilcharts/src/registry/registry-chart.ts:279-297]

**F2-7. Sankey exists only in evilcharts and the corpus contract already excludes its engine.** The template contract's dependency clause names exactly this case: "forms that genuinely need a layout engine, such as dense node-link networks, are out of the corpus rather than in it with a library attached." A sankey's node and link layout is an iterative optimisation, not a closed-form geometry. [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:130] [SOURCE: context/evilcharts/src/registry/registry-chart.ts:299-315]

**F2-8. The blocks layer is the corpus's `examples/` layer, and its names reveal a styling theme pack.** evilcharts blocks are scenario deliveries (`b-latency-echarts-area-chart`, `b-where-the-budget-went` equivalent `b-budget-echarts-radial-chart`) exactly like the corpus's six `assets/examples/` files. But three block names are *styling* not form: `monospace-bar-chart`, `grid-bar-chart`, `isometric-bar-chart`. The monospace and grid themes carry over to iteration 3 (typography, background); the isometric theme is flagged now for iteration 4 with a likely rejection (3D bars distort length reading, which the corpus's honesty-first contract protects). [SOURCE: context/evilcharts/src/registry/registry-blocks.ts:7-49] [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/catalog.md:112]

## Ranked changes (catalog of forms)

| # | Change | Evidence | Target | Verdict | Level | One-file route |
|---|--------|----------|--------|---------|-------|----------------|
| R2-1 | Add a composed magnitude-and-rate form to the catalog: a new template (e.g. `bar-line-composed`) drawing bars for a count series and a line for a rate series on a shared time axis, with the rate on its own right-hand scale only when the two magnitudes differ by an order | `registry-chart.ts:220-239` (composed as a first-class type), `registry-chart.ts:69-87` | `references/catalog.md` (new row) + `assets/templates/bar-line-composed.html` | ADOPT AS IDEA | Template-level, apply now (the catalog's own authoring workflow at `catalog.md:143-147` covers new rows; the spec's open question "whether any evilcharts form belongs in the catalog" is answered yes for this one) | Hand-drawn bars + polyline in the file's own script, both scales computed from the data block; deterministic; one file |
| R2-2 | Do NOT add a pie/donut form. The corpus's unit-ring/unit-grid substitution is a documented honesty rule, and the operator's complaint is that output does not look good, not that arc-based pies are missing | `catalog.md:127-131` (deliberate rejection) | n/a — rejection | REJECT WITH REASON | n/a | The substitution stands; adoption would contradict the catalog's own clause |
| R2-3 | Do NOT add a radar form. `parallel-axes` already answers the multi-dimension comparison question; radar re-introduces angle-and-area estimation, the same perception problem the corpus rejects for pies | `catalog.md:62`, `catalog.md:129`; `registry-chart.ts:279-297` (radar exists there) | n/a — rejection | REJECT WITH REASON | n/a | n/a |
| R2-4 | Do NOT add a sankey form. The contract already excludes layout-engine forms (`template-contract.md:130`); a hand-drawn approximation would be less honest than the real thing and would carry the full layout cost anyway | `template-contract.md:130`; `registry-chart.ts:299-315` | n/a — rejection; if the operator ever wants flow, the exclusion itself is the thing to revisit | REJECT WITH REASON | Contract-level only if revisited | Cannot reach one-file honesty without the layout engine the contract excludes |
| R2-5 | No change for the twelve corpus-only forms. The mode's question-first catalog is broader than evilcharts' type list; the beauty gap is in the shared pairs (R2-3 note), not in missing forms | `catalog.md:42-63` vs `registry-chart.ts:5-316` | none | REJECT WITH REASON (already exceeds the reference here) | n/a | n/a |
| R2-6 | Feed the styling variants named by the blocks into the right later iterations: `monospace-bar-chart` → iteration 3 typography; `grid-bar-chart` → iteration 4 background; `isometric-bar-chart` → iteration 4 with a probable honesty rejection | `registry-blocks.ts:7-49` | deferred | ADOPT AS IDEA (routed) | n/a | n/a |

## Sources Consulted

- `context/evilcharts/src/registry/registry-chart.ts` (full, 316 lines)
- `context/evilcharts/src/registry/registry-blocks.ts` (names + first entries)
- `context/evilcharts/registry.json` (item shape for `recharts-line-chart`)
- `context/evilcharts/src/registry/blocks/{recharts,echarts}/` (directory listing, 22 blocks)
- `.opencode/skills/sk-doc/sk-create-chart/references/catalog.md` (full, 157 lines)
- `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` (lines 124-134, from iteration 1)

## Assessment

- **newInfoRatio**: 0.80 — the form inventory and the corpus-vs-evilcharts mapping are new; the contract's sankey exclusion and the catalog's pie substitution were already in the packet's own references (read in iteration 1), so part of the mapping confirms known constraints rather than discovering them.
- **Confidence**: High on the evilcharts side (manifests read directly, block list from disk); high on the corpus side (catalog read in full).

## Reflection

- **What worked**: Reading the catalog's "WHAT IS NOT INDEXED" and substitution sections before comparing prevented two false gaps (histogram, donut) from being reported as missing forms.
- **What failed / ruled out**: Pie, radar, sankey ruled out with the corpus's own documented reasons; isometric bars flagged for the same honesty test in iteration 4.
- **Follow-up**: the composed form is the strongest catalog-level candidate and must appear in the synthesis with a concrete template shape; styling pairs (progress-single ↔ radial, unit-ring ↔ pie/radial, stacked-area ↔ area) feed iterations 3-4.

## Recommended Next Focus

Iteration 3: Styling and theming — read `src/app/globals.css` (Tailwind v4 theme tokens), `components.json`, `package.json`, the chart docs pages and the target's `references/color-system.md` + `assets/color/palettes.json`; name concrete values (radius, spacing, typography, motion) and map them onto the corpus's three colour systems.
