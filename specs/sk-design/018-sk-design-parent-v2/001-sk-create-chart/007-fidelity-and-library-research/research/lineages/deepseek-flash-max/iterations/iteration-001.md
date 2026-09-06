# Iteration 1: Upstream baseline — what the six libraries deliver

## Focus

Establish what a delivered chart from Chart.js, Vega-Lite, ECharts and Plotly actually looks like (D3 and Observable Plot land in iteration 2), and open the corpus-vs-upstream comparison matrix. This iteration is the survey that the remaining convention-by-convention iterations build on.

## Findings

### F1.1 — Vega-Lite's core doctrine is "data-to-mark mapping with machine-produced chrome", which the corpus already mirrors structurally
Vega-Lite defines a chart as a `mark` plus an `encoding` (mapping between data values and mark properties), and "automatically produces other visualization components including axes, legends, and scales... based on a set of carefully designed rules" [SOURCE: https://vega.github.io/vega-lite/docs/spec.html]. The corpus has the same separation, inverted: the chrome (axes, legend, labels) is hand-authored per form, and only the data block is "the only part to edit" [SOURCE: file:.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-rows.html:92]. The corpus goes further than Vega-Lite on one axis: its chrome is *frozen per form* (catalog row = one file = one rendering), which is exactly the reliability property the "template-first" rule wants (SKILL.md:106-113), whereas Vega-Lite's rules regenerate chrome from data shape every render. Corpus is ahead on determinism and reviewability; behind on expressiveness (no composition operators, no aggregation — catalog.md:16-63 names no transform capability).

### F1.2 — ECharts' `dataset` component is the closest upstream analogue to the corpus data block, and it validates the separation
ECharts recommends managing data in a `dataset` component because "data is the most common part to be changed while other configurations will mostly not change at runtime", following "Provide the data, (II) Mapping from data to visual to become a chart" [SOURCE: https://echarts.apache.org/handbook/en/concepts/dataset/]. The corpus contract makes the same bet harder: the data block is not just separated, it is *the only thing an editor touches* (template-contract.md:85-87), and it is a literal array that "never fetches, never computes... and never reads the clock" (template-contract.md:87). Upstream datasets are runtime-configurable; the corpus's are compile-time literals. The corpus property is stronger for the emailed-file reader, weaker for anyone wanting the same data twice (ECharts' reuse argument) — not a gap for this mode's audience.

### F1.3 — Chart.js ships interaction by default (tooltips on, animation on, responsive on); the corpus ships none of the three, by explicit contract choice
Chart.js defaults: animations enabled by default [SOURCE: https://www.chartjs.org/docs/latest/], tooltips enabled by default (`enabled: true`, background `rgba(0,0,0,0.8)`) [SOURCE: https://www.chartjs.org/docs/latest/configuration/tooltip.html], and `responsive: true` with `maintainAspectRatio: true` default and per-type `aspectRatio` (2 for most, 1 for radial) [SOURCE: https://www.chartjs.org/docs/latest/configuration/responsive.html]. The corpus has none: no tooltip code in any template, no animation (the `motion` check passes trivially because no template animates — check-corpus.cjs:476-485 only fires when `@keyframes`/`animation`/`transition` appears), and fixed `viewBox` scaling rather than re-layout (e.g. bar-rows.html:67 `viewBox="0 0 720 292"` with `.figure svg { width: 100%; height: auto }` bar-rows.html:46). Whether that is a gap depends on the mode contract: determinism rule 12 (template-contract.md:132) forbids time-dependent rendering but not hover-driven *reading* — hover reveals are still deterministic per pointer position. This is the largest convention surface where the corpus is behind, and the cheapest to close dependency-free (SVG `<title>` per mark, or CSS/JS pointer handlers), because every mark is an SVG element the file already creates.

### F1.4 — Plotly's tick machinery is the richest upstream reference for the corpus's `niceStep` ladder
Plotly axes expose `tickmode` (auto/linear/array), `tick0`/`dtick`, `nticks`, `tickformat` (the d3-format mini-language), `tickformatstops` for zoom-dependent formats, `tickprefix`/`ticksuffix`, `exponentformat` (none/e/E/power/SI/B), and `tickangle` for label rotation [SOURCE: https://plotly.com/javascript/tick-formatting/]. The corpus's whole tick story is the `niceStep` ladder `[1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]` with `max = niceStep(peak / TICKS) * TICKS` and `TICKS = 5` or `4` (bar-columns.html:109-125; duplicated in grouped-bars.html:110-126, daily-line.html:110-126, daily-range.html:108-124, waterfall.html:111-141, stacked-area.html:128-146, box-plot.html:107-123, scatter.html:115-131). Upstream convention has two parts the corpus lacks: (a) tick *formatting* — Plotly applies d3-format specifiers so 8400 reads "8.4k" rather than "8400" [SOURCE: https://plotly.com/python/tick-formatting/], while the corpus renders `String(value)` (bar-columns.html:131); (b) tick *count adaptation* — Plotly's `nticks`/auto mode adapts to the plot size, while the corpus hardcodes TICKS per form. The ladder itself is corpus-authored and sound (it matches the "1-2-5" family of nice steps used by d3-scale's `tickStep`, which generates steps of the form 10^n × {1,2,5,10} [SOURCE: https://github.com/d3/d3-scale#continuous_ticks]); the corpus ladder is *finer* (adds 1.25, 1.5, 2.5, 3, 4, 6, 8) with an explicit rationale comment (bar-columns.html:107-108). It is a defensible divergence, but it is also pure per-template duplication — nine templates carry the same function, which a single shared helper or a contract-level "one ladder" decision would remove.

### F1.5 — ECharts' legend placement convention (upper-right, horizontal, bottom when crowded) and interaction differ from the corpus's top-left fixed swatch row
ECharts: "Legend is always placed at the upper right corner of the chart... when the chart has little vertical space or the content area is crowded... put the legend on the bottom"; legends are interactive (click to show/hide series), and scrollable when there are many [SOURCE: https://echarts.apache.org/handbook/en/concepts/legend/]. The corpus places legends as a fixed row of SVG swatches at the top-left of the figure, positioned by approximate text-width math `keyX += 46 + d.label.length * 6.6` (unit-grid.html:125-130; same pattern at unit-ring.html:134-139, stacked-bars.html:155-160, stacked-area.html:176-181, waterfall.html:171-176, candlestick.html:154-160). The width estimate is a real fragility: `d.label.length * 6.6` assumes a constant advance per character, which breaks on wide glyphs, mixed case, or a different font; a long label silently overlaps the next swatch. ECharts' scrollable legend exists for many categories, which the corpus's capacity ceilings (4 series, color-system.md:33-35) deliberately avoid — so the interaction half is out of scope by design, but the *placement and overlap* half is a genuine template-level gap: the corpus has no collision handling anywhere.

### F1.6 — All surveyed libraries assume a container-driven layout; the corpus's fixed-viewBox scaling is the one convention where it is *ahead* for its delivery mode
Chart.js resizes by detecting the parent container and re-rendering [SOURCE: https://www.chartjs.org/docs/latest/configuration/responsive.html]; ECharts markets "responsive sizing" and touch support for mobile [SOURCE: https://apache-echarts.mintlify.app/introduction]; Vega-Lite compiles to Vega with width/height properties [SOURCE: https://vega.github.io/vega-lite/docs/spec.html]. All of them re-layout on resize, which needs a runtime and (in Chart.js/ECharts) a library. The corpus's `viewBox` + `width: 100%; height: auto` (bar-rows.html:46,67) scales the whole picture uniformly — text scales with marks, which is the known weakness (a chart read on a phone renders 13px labels at ~6px), but the file stays one static document with zero runtime. For the double-click delivery contract this is the right trade, and no upstream library can claim a static equivalent. The gap is not the mechanism but the *verification*: nothing in check-corpus.cjs measures legibility at narrow widths (the render check only counts elements — check-corpus.cjs:590-598).

## Sources Consulted

- [SOURCE: https://vega.github.io/vega-lite/docs/spec.html] Vega-Lite view specification
- [SOURCE: https://echarts.apache.org/handbook/en/concepts/dataset/] ECharts dataset concept
- [SOURCE: https://www.chartjs.org/docs/latest/] Chart.js docs (features/defaults)
- [SOURCE: https://www.chartjs.org/docs/latest/configuration/tooltip.html] Chart.js tooltip config
- [SOURCE: https://www.chartjs.org/docs/latest/configuration/responsive.html] Chart.js responsive config
- [SOURCE: https://plotly.com/javascript/tick-formatting/] Plotly JS tick formatting
- [SOURCE: https://plotly.com/python/axes/] Plotly axes reference
- [SOURCE: https://apache-echarts.mintlify.app/introduction] ECharts introduction
- [SOURCE: https://echarts.apache.org/handbook/en/concepts/legend/] ECharts legend concept
- [SOURCE: https://github.com/d3/d3-scale#continuous_ticks] d3-scale ticks (read in iteration 2 for detail)
- Corpus: all files read per dispatch mandate (SKILL.md, template-contract.md, catalog.md, color-system.md, check-corpus.cjs, palettes.json, palette-sheet-neutral.html, 20 templates)

## Assessment

- **newInfoRatio**: 0.95 — first pass over this packet; nearly all upstream facts are new to the lineage.
- **Novelty justification**: Baseline survey; only the corpus's own structure was previously known.
- **Confidence**: High for the four libraries documented; D3/Plot deferred to iteration 2 (explicitly, not silently).

## Reflection

- **What worked**: Batching the library surveys per library-doc page rather than per convention; the ECharts dataset parallel is a strong anchor for the data-block contract.
- **What failed / ruled out**: Trying to survey all six libraries in one pass exceeded the per-iteration tool budget; split instead. Ruled out: reading the scratch/ reference clone (forbidden by dispatch constraints).
- **Ruled-out directions**: none beyond the split above.

## Recommended Next Focus

Iteration 2: D3 and Observable Plot baselines (scale.ticks/scale.nice, d3-format, Plot's marks/ticks/labels), then close the comparison matrix with the corpus's where-it-is-ahead column.
