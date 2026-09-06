# Iteration 10: Authority and remaining corpus-capability checks

**Run:** 10 of 10  
**Session:** `fanout-codex-luna-max-1788404469193-3b2771`  
**Retrieved:** 2026-09-03  
**Scope:** final uncited upstream behaviours, the two colour-guidance citations, and a complete T1–T10/C1–C3 corpus audit at commit `756a7fcd4c`.

## Focus

This pass closes the citation inventory without synthesizing early. Convergence telemetry from earlier passes is treated as telemetry only because the configured stop policy is `max-iterations`. The remaining checks are limited to public live sources and the shipped corpus; no reference implementation under scratch, tmp, or vendor was inspected.

## Findings

### Finding 1 — Figviz colour article: CORRECTED (authority)

**Citation checked:** `[SOURCE: https://figviz.com/blog/scientific-color-palettes-okabe-ito-paul-tol-colorbrewer-viridis-cividis-rdbu-and-crameri-vik-2ubkmije]`

- **URL resolution:** The page resolves today and identifies itself as a practical colour-palette guide. Its text discusses Okabe–Ito, Paul Tol, ColorBrewer, Matplotlib, Cividis, RdBu, and Crameri palettes, and links to primary or technical sources.
- **What it supports:** It supports the broad practical advice to choose palettes with distinguishable colours and to consider colour-vision deficiencies. It is not a standards body, peer-reviewed source, or original colour-science note, and the page is commercial/editorial content.
- **Version/date:** Retrieved 2026-09-03; the page displays a 2026-06-27 update date, but it documents palette guidance rather than a library release.
- **Verdict:** `CORRECTED` — the article is usable as an example or lead, not as the authoritative basis for a normative recommendation.
- **Corrected wording:** “For colour-accessibility and palette-selection guidance, cite the primary Okabe–Ito colour-vision-design material and Paul Tol’s technical colour notes; use Figviz only as a secondary practical summary.”
- **Better sources:** `[SOURCE: https://jfly.uni-koeln.de/color/]` identifies Masataka Okabe and Kei Ito’s colour-vision-design material and redundant-coding guidance; `[SOURCE: https://sronpersonalpages.nl/~pault/]` documents Paul Tol’s qualitative, diverging, and sequential schemes and their distinctness for colour-blind viewers.

### Finding 2 — Observable Plot pointer interaction: VERIFIED (supplemental uncited claim)

**Citation checked:** `[SOURCE: https://observablehq.github.io/plot/interactions/pointer]`

- **URL resolution:** The official Observable Plot documentation resolves today.
- **Claim checked:** Pointer interaction filters data to the closest nearby point, can operate in one or two dimensions, can be paired with channels, and has a default `maxRadius` of 40 pixels; `Plot.pointer` re-renders interactively. The page also documents a tip-oriented usage pattern.
- **Version/date:** The page is the official Plot documentation for the shipped 0.6.17 documentation set; retrieved 2026-09-03.
- **Verdict:** `VERIFIED` for the narrower API claim. It does not justify assuming that a static, dependency-free template can reproduce Plot’s runtime pointer behavior.

### Finding 3 — ECharts renderer choice: VERIFIED (supplemental uncited claim)

**Citation checked:** `[SOURCE: https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/]`

- **URL resolution:** The official ECharts handbook page resolves today.
- **Claim checked:** ECharts supports both Canvas and SVG renderers; Canvas is the default renderer, while SVG can be selected. The handbook describes SVG as useful for lower memory use and Canvas as useful for very large or high-performance scenes.
- **Version/date:** Current ECharts handbook; retrieved 2026-09-03. The page describes the renderer choice rather than pinning a specific package version.
- **Verdict:** `VERIFIED` for renderer availability/default selection. This is background context only; it does not relax the template contract’s no-library/no-build constraint.

### Finding 4 — ECharts responsive sizing and coarse pointer: CORRECTED (supplemental uncited claims)

**Citations checked:** `[SOURCE: https://echarts.apache.org/handbook/en/concepts/chart-size/]` and `[SOURCE: https://echarts.apache.org/handbook/en/how-to/interaction/coarse-pointer/]`

- **URL resolution:** Both official ECharts handbook pages resolve today.
- **What the sources say:** Chart size follows the container when dimensions are supplied, but changes to a container or window require an explicit `echartsInstance.resize`; the handbook recommends `ResizeObserver` for container changes. ECharts 5.4 introduced intelligent coarse-pointer snapping, enabled by default on mobile and disabled by default on non-mobile devices, with a documented 44-pixel default pointer size.
- **Version/date:** Current handbook; coarse-pointer page documents ECharts 5.4 behavior; retrieved 2026-09-03.
- **Verdict:** `CORRECTED` — “ECharts is responsive by default” is too broad. Correct wording: “ECharts can respond to container changes when the host calls `resize` (often from `ResizeObserver`); its coarse-pointer snapping has mobile-specific defaults from ECharts 5.4.”
- **Template consequence:** No runtime resize or pointer implementation belongs in the self-contained static templates. Preserve the existing overflow and minimum-width safeguards and make the static artifact legible at narrow widths.

### Finding 5 — ECharts tooltip default: CORRECTED (supplemental uncited claim)

**Citation checked:** `[SOURCE: https://echarts.apache.org/handbook/en/how-to/component-types/geo/svg-base-map/]`

- **URL resolution:** The official ECharts handbook example resolves today.
- **What the source says:** The SVG-base-map example enables a tooltip by declaring a root `tooltip: {}` component and then configures interaction. The example demonstrates tooltip support, but it does not establish a global default that tooltips are enabled for every chart.
- **Version/date:** Current ECharts handbook; retrieved 2026-09-03.
- **Verdict:** `CORRECTED` — change “ECharts tooltips are on by default” to “ECharts supports tooltips; a chart can enable/configure the tooltip component explicitly.”
- **Template consequence:** The corpus’s static visible labels and tables remain the reliable no-runtime fallback; no tooltip dependency or implicit default should be added.

## Corpus audit at commit `756a7fcd4c`

The following verdicts are against the shipped files, not against a later working-tree interpretation. Line references are to the pinned corpus snapshot.

| Checklist item | Shipped verdict | Evidence |
|---|---|---|
| T1 — accessible SVG title/description helpers and calls | **CLOSED** for the eight detached-key forms | `assets/templates/box-plot.html:135,177`; `calendar-grid.html:186,211`; `candlestick.html:144,192`; `heat-matrix.html:147,201`; `parallel-axes.html:146,185`; `scatter.html:142,188`; `treemap.html:150,197`; `waterfall.html:137,194` |
| T2 — display-ready number formatting and sensible ticks | **CLOSED** in the targeted bar and candlestick forms | `assets/templates/bar-columns.html:120-160` defines `fmt`, `niceStep`, and ticks; `assets/templates/candlestick.html:129-139,172-181` formats values and uses a floor/step loop |
| T3 — invalid-value segmentation/handling | **CLOSED** in the targeted line/range/area forms | `assets/templates/daily-line.html:151-195`; `daily-range.html:149-158,181-187`; `stacked-area.html:169-203,221-227` |
| T4 — measured label budgets | **CLOSED for the six targeted forms, with a documented character fallback** | `assets/templates/candlestick.html:208`; `progress-single.html:148`; `stacked-area.html:250`; `stacked-bars.html:190`; `unit-grid.html:160`; `unit-ring.html:169` |
| T5 — data-derived accessible descriptions | **PARTIAL** — mapping prose is present in five detached-key forms, but data-derived factual clauses are still static in other forms | Mapping evidence: `assets/templates/candlestick.html:76`; `grouped-bars.html:75`; `stacked-area.html:78`; `stacked-bars.html:77`; `waterfall.html:77`. Static factual-clause examples: `assets/templates/scatter.html:77`; `heat-matrix.html:82`; `waterfall.html:77` |
| T6 — narrow viewport overflow/min-width guard | **CLOSED** across all 20 templates | Seventeen templates use `.figure` overflow and SVG minimum width at line 50; `assets/templates/calendar-grid.html:51`, `heat-matrix.html:51`, and `progress-single.html:51` use the same guard |
| T7 — label-thinning and name/gutter budgets | **CLOSED** in the targeted crowded forms | `assets/templates/bar-rows.html:142-145`; `daily-line.html:197-205`; `parallel-axes.html:167-175`; `stacked-area.html:229-237`; the measurement comments and values remain in the six T4 forms |
| T8 — continuous heat/ramp legend | **OPEN/PARTIAL** — the corpus has discrete swatches, not the requested SVG `linearGradient` ramp | `assets/templates/calendar-grid.html:229-239` explicitly says “Five discrete swatches, not a gradient bar”; `assets/templates/heat-matrix.html:219-223` draws discrete rect swatches and text |
| T9 — console warning guard for overlarge datasets | **OPEN as requested; PARTIAL alternative** — no requested `console.warn` guard; two forms show visible bounded notices | Visible notices: `assets/templates/scatter.html:198-210`; `assets/templates/heat-matrix.html:225-238`. The shipped inventory contains no `console.warn` implementation |
| T10 — SVG pattern/decal fills | **OPEN/DEFERRED** | `assets/color-system.html:154-168` records pattern fills as considered/deferred; no template contains an SVG `<pattern>`/decal fill |
| C1 — exact phone-viewport render assertion | **PARTIAL/OPEN** — stylesheet guard exists, but the corpus checker does not render or assert actual phone legibility | `scripts/check-corpus.cjs:476-485` says the narrow check is stylesheet-only and does not verify actual phone legibility; representative CSS is `assets/templates/bar-rows.html:50-51` |
| C2 — time formatting contract | **CLOSED** — time labels are display-ready and are not parsed/reformatted | `references/catalog.md:78-95` |
| C3 — derived closing total/per-period total exception | **CLOSED** — the named presentation-derivation exception is explicit | `references/template-contract.md:89-106` |

## Assessment

The remaining upstream evidence does not justify importing a charting runtime. Observable Plot’s pointer, ECharts’ resize, and ECharts’ coarse-pointer behavior are real library capabilities, but each depends on runtime code or host integration. Under the template contract, the corpus should continue to use inline SVG, static tables, visible labels, and CSS overflow/minimum-width guards.

The shipped corpus has closed T1, T2, T3, T4, T6, T7, C2, and C3. T5 remains partial; T8, T9, T10, and C1 remain open or partial. The most material remaining fidelity gaps are the continuous ramp legend, pattern/decal encoding, a real phone-viewport render gate, and dynamic accessible prose for data-derived facts. The requested warning mechanism is also not present, although bounded visible notices exist in two forms.

## Reflection

- The authority check matters separately from URL liveness: both colour pages resolve, but their evidentiary weight differs.
- Runtime features need a second test beyond “the library supports it”: the feature must be expressible in one double-clickable HTML file without a package manager, build step, or remote dependency. These features fail that portability test even when their library documentation is verified.
- The corpus audit distinguishes a true remaining gap from work already shipped. In particular, T1/T2/T3/T4/T6/T7 and C2/C3 are not still-open recommendations.

## Sources Consulted

- `[SOURCE: https://figviz.com/blog/scientific-color-palettes-okabe-ito-paul-tol-colorbrewer-viridis-cividis-rdbu-and-crameri-vik-2ubkmije]`
- `[SOURCE: https://jfly.uni-koeln.de/color/]`
- `[SOURCE: https://sronpersonalpages.nl/~pault/]`
- `[SOURCE: https://observablehq.github.io/plot/interactions/pointer]`
- `[SOURCE: https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/]`
- `[SOURCE: https://echarts.apache.org/handbook/en/concepts/chart-size/]`
- `[SOURCE: https://echarts.apache.org/handbook/en/how-to/interaction/coarse-pointer/]`
- `[SOURCE: https://echarts.apache.org/handbook/en/how-to/component-types/geo/svg-base-map/]`

## Ruled Out

- Treating the Figviz or ColorArchive articles as primary authority for normative colour guidance.
- Claiming that ECharts globally enables tooltips or automatically resizes without host code.
- Reproducing Observable Plot pointer/tip behavior or ECharts runtime interaction in a static template.
- Treating a stylesheet narrow-width check as proof of phone-viewport legibility.
- Counting discrete swatches as an implemented continuous gradient or treating deferred pattern fills as shipped.

## Questions Remaining

- Whether to implement T8, T9, T10, and C1 is a subsequent scoped change; this verification lineage does not modify corpus files.
- T5 needs a separate decision about how much data-derived accessible prose can remain literal while preserving the data-block contract.

## Recommended Next Focus

If a follow-up implementation is authorized, prioritize C1’s actual narrow-viewport render check and T8’s continuous ramp legend, then address T5 dynamic factual descriptions. Keep T9’s warning behavior aligned with the contract and treat T10 as optional only if a static, self-contained pattern vocabulary can be documented and verified.

