# Iteration 3: Label and legend placement conventions

## Focus

Q2: what the six libraries do for labels and legends — direct labelling vs legends, placement defaults, collision handling — and where the corpus's fixed swatch row and width-estimate positioning deviate.

## Findings

### F3.1 — Upstream legend placement has no consensus default (top / right / top-right), but every library lays legends out *outside the plot area*; the corpus's in-figure swatch row is the one real deviation
Chart.js defaults `position: 'top'`, `align: 'center'` [SOURCE: https://www.chartjs.org/docs/latest/configuration/legend.html]; Vega-Lite defaults `orient: "right"` (with `direction` horizontal for top/bottom and vertical for left/right) [SOURCE: https://vega.github.io/vega-lite/docs/legend.html]; ECharts documents upper-right as the convention (iteration 1, F1.5) [SOURCE: https://echarts.apache.org/handbook/en/concepts/legend/]. None of the three places a legend *inside* the drawing region: the layout engine reserves space and marks never overlap the legend. The corpus places legends as a fixed swatch row inside the figure's top band — stacked-bars.html:155-160 draws the key at `y: 8` and starts bars at `TOP = 44` (stacked-bars.html:131); treemap.html:141 starts cells at `TOP = 30` below a group label; unit-grid.html:125-130 draws the key inside the same 720×230 viewBox as the grid. Because the row is inside the viewBox, it consumes plot height that a layout engine would not steal, and it can collide with the marks when a data block grows (the catalog ceilings exist precisely because the forms are fixed-size). The fix direction is not "move the legend" (each library disagrees on where) but "never let legend and marks share a budget": either reserve a fixed legend band inside the figure (template-level) or move the key out of the figure into the card (contract-level, since `data-chart-part="figure"` is a contract part, template-contract.md:31-36).

### F3.2 — The corpus's width-estimate positioning (`label.length * 6.6`) is the weakest label technique in the corpus, and upstream libraries do not use character-count estimates anywhere
The swatch rows advance by `keyX += 44 + name.length * 6.6` (stacked-bars.html:159; identical at unit-grid.html:129, unit-ring.html:138, stacked-area.html:180, waterfall.html:175, candlestick.html:159); the same estimate appears for group captions in the treemap (`caption.length * 6.8`, treemap.html:155) and for the progress value (`String(MEASURE.value).length * 34`, progress-single.html:117). Character-count × constant-advance assumes a monospace-equivalent font; the corpus's own font stack is `ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif` (bar-rows.html:31), where advance varies per glyph, so a label like "WWWW" or an emphasised headline word overruns its estimate and silently overlaps the next swatch. No upstream library positions text this way: Plot's text mark places labels by anchor + offset (`textAnchor`, `dx`) at data coordinates [SOURCE: https://observablehq.com/plot/marks/text]; Vega-Lite's legend component measures and lays out entries; d3-axis measures text via `getBBox` after rendering. Template-level fix options: (a) measure real width at render time via `getComputedTextLength()` and advance by it (a few lines, keeps the single-file contract); or (b) drop the inline key entirely and let the data table's caption/headers carry the series names (the corpus already ships a full `data-chart-table` with series columns, e.g. stacked-bars.html:78-80). Option (a) is the minimal change that kills the whole class of overlap bugs.

### F3.3 — Direct labelling is an upstream doctrine ("faster and more accurate reading than an axis alone"), and the corpus is already ahead of most libraries on it
Plot's text mark docs: "When space is available, direct labeling can allow faster and more accurate reading of values than an axis alone (or a tooltip)", and Plot examples replace an axis entirely with direct labels (the civilizations bar chart labels bars with text and drops the y axis) [SOURCE: https://observablehq.com/plot/marks/text]. The corpus applies direct value labels pervasively: bar-rows.html:121 draws the value beside every bar; stacked-bars.html:147-150 prints segment values when `h >= 22`; treemap.html:163-165 prints leaf labels when the cell fits; heat-matrix.html:163-165 prints every cell value; waterfall.html:157-158 labels each move; daily-line.html:146-149 labels the low point. That is the direct-labelling doctrine already in force, with the one upstream refinement missing: Plot's text mark honours `textAnchor` and `dx` per label and flips anchors at edges [SOURCE: https://observablehq.com/plot/marks/text], and the corpus does the same in two places (daily-line.html:142-143 start/middle/end anchors; treemap.html:152-158 end-anchor flip when the caption would overflow). So: corpus is ahead on direct labelling as a convention; the gap is only the shared-measurement technique from F3.2.

### F3.4 — Parallel-axes labels are the corpus's one hand-rolled collision-avoidance system, and it shows what a general rule would cost
parallel-axes.html:132-138 alternates axis names on two vertical rows (`const lift = j % 2 === 1 ? 18 : 0`) with an explicit comment ("Neighbouring axis names collide the moment one of them is more than a word long, so alternate axes sit a row higher rather than being truncated into initials"). Upstream equivalents: Vega-Lite would rotate labels (`labelAngle`/`labelOverlap` on axes) [SOURCE: https://vega.github.io/vega-lite/docs/axis.html]; Plotly exposes `tickangle` for the same problem [SOURCE: https://plotly.com/python/axes/]. The corpus's alternating-lift solution is bespoke and works for its demo (units are one word); a longer unit string ("per thousand" at parallel-axes.html:93) already makes the two-row scheme collide at the middle axis. This is a template-level robustness note: the alternating scheme needs a width check or a smaller font, and the axis-name collision rule should be named in the template comment so a future edit knows the constraint. Not contract-level: the form can absorb a fix without changing the contract.

### F3.5 — Vega-Lite legends carry `aria` and `description` properties; the corpus legends are plain SVG swatches with no accessible description of their own
Vega-Lite's legend config exposes `aria` (Boolean), `description`, `offset`, `padding`, `zindex`, `tickCount`, `values` [SOURCE: https://vega.github.io/vega-lite/docs/legend.html]. The corpus legend swatches are `<rect>` + `<text>` pairs inside the figure SVG (e.g. stacked-bars.html:157-158) — the figure's `aria-labelledby` points at the `<title>`/`<desc>` (rule 10, template-contract.md:130), but the legend's meaning (which colour is which series) is not in the desc; it lives only in the swatch text labels, which screen readers do not read as a series-key mapping. The corpus's own fallback — the data table with series columns (stacked-bars.html:162-168) — carries the mapping in text, so the information exists in the file; the gap is that the SVG `<desc>` does not point at it. Template-level fix: extend each figure's `<desc>` to state the series mapping ("segments are Platform, Services, Support, in order"), which is a one-line edit per template and closes the affordance gap without any dependency.

## Sources Consulted

- [SOURCE: https://observablehq.com/plot/marks/text] Plot text mark (direct labelling doctrine)
- [SOURCE: https://observablehq.com/plot/features/legends] Plot legends feature page
- [SOURCE: https://vega.github.io/vega-lite/docs/legend.html] Vega-Lite legend reference
- [SOURCE: https://www.chartjs.org/docs/latest/configuration/legend.html] Chart.js legend reference
- [SOURCE: https://plotly.com/python/axes/] Plotly axes (tickangle)
- Corpus: stacked-bars.html, unit-grid.html, unit-ring.html, stacked-area.html, waterfall.html, candlestick.html, treemap.html, progress-single.html, parallel-axes.html, daily-line.html, heat-matrix.html, bar-rows.html, template-contract.md

## Assessment

- **newInfoRatio**: 0.8 — placement conventions confirmed across libraries; the width-estimate fragility and in-figure legend budget are the new corpus-side findings.
- **Novelty justification**: F3.1-F3.5 all tie upstream placement/measurement techniques to specific corpus lines; no re-survey of known ground.
- **Confidence**: High.

## Reflection

- **What worked**: Comparing placement *mechanisms* (layout-engine-reserved space vs in-figure coordinates) rather than just positions; that exposed the real divergence.
- **What failed / ruled out**: Looking for an upstream "legend overlap solver" — none exists; libraries avoid the problem by layout. Ruled out: adopting any library's legend component (contract).
- **Ruled-out directions**: Moving legends outside the figure (contract-level, needs decision — recorded as a candidate recommendation); adopting Plot-style `dx`/`textAnchor` per-label offsets wholesale (already partially present).

## Recommended Next Focus

Iteration 4: Colour ramps (Q3) — d3-scale-chromatic interpolation, Vega-Lite schemes, Plot colour scales, ColorBrewer/Okabe-Ito colour-blind safety, vs the corpus's 5-step gated ramp and its contrast gates.
