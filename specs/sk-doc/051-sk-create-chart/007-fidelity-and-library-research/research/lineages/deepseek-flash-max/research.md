# Fidelity and Library Research — sk-create-chart corpus vs the best open-source charting libraries

**Lineage**: `deepseek-flash-max` (session `fanout-deepseek-flash-max-1788375447497-ut4oqk`)
**Spec folder**: `specs/sk-doc/051-sk-create-chart/007-fidelity-and-library-research`
**Executor**: cli-devin / deepseek-v4-flash-max | **Loop**: research, 10/10 iterations, stopPolicy max-iterations
**Status**: complete | **Generated**: 2026-09-02

**Citations corrected**: 2026-09-03, against the live-fetch verification ledger at `research/verification-2026-09-03/lineages/codex-luna-max/research.md`. Of the 43 upstream URLs cited below, 31 held as written, 10 are corrected in place and marked `CORRECTED 2026-09-03`, and 2 could not be retrieved and are marked `UNVERIFIABLE`. No Vega-Lite default width is quoted anywhere in this file, because the current size and spec pages describe different defaults, 200 against 300, so neither number stands alone. The per-iteration records under `iterations/` are the immutable log of the loop as it ran and still carry the pre-correction wording. This synthesis is the corrected text.

---

## 1. Executive Summary

The sk-create-chart corpus — 20 self-contained HTML chart templates, a catalog, a colour system with computed contrast gates, and a 13-rule validator — was measured against what delivered charts from Chart.js, D3, Vega-Lite, Plotly, Observable Plot and ECharts actually look like. Ten research iterations produced 51 findings across axis ladders and tick selection, label and legend placement, colour ramps, accessibility, responsive sizing, the data-mark relationship, number/date formatting, and interaction.

**The corpus is ahead of every surveyed library on eleven concrete properties** — most importantly its computed colour-gate machinery (no upstream library enforces contrast on its own palettes), its rule-10 data-table accessibility fallback (unique among the six), its emphasis role (no library has one), and its zero-transform, zero-dependency delivery contract, which is the honest static subset of every upstream runtime mechanism. The libraries are *analysis* tools; the corpus is a *delivery* format, and most apparent gaps dissolve once the contract (template-contract.md sections 3-6) is applied.

**The genuine gaps are concentrated in six areas**, all closable without violating the single-file, no-dependency, deterministic contract:

1. **No hover interaction anywhere** — upstream ships tooltips by default (Chart.js, ECharts, Plot `tip: true`). The dependency-free fix is per-mark SVG `<title>`, widely available since July 2015 and usually shown as a browser tooltip, which also becomes the per-element accessible name.
2. **`String(value)` rendering everywhere** — no thousands separators, no float-dust protection; the candlestick tick loop already accumulates floating-point dust. A per-template `fmt` helper fixes both.
3. **Silent NaN paths on missing data** — Plot breaks lines at null; the corpus draws wrong-looking charts with no error and the validator cannot see it.
4. **Character-count label positioning** (`label.length * 6.6`) — the only text-layout technique upstream never uses; real measurement (`getComputedTextLength()`) is a few lines.
5. **Stale figure `<desc>`** — hand-written descriptions disagree with the data block after an edit; the factual clause should be data-derived.
6. **No verification of narrow-width legibility** — the render check runs one viewport; a min-size CSS guard (template-level) and a phone-viewport assertion (contract-level) close it.

**Deliverable**: 10 ranked template-level recommendations (applyable now), 5 contract-level recommendations (needs a decision), 1 palette-level recommendation, and 15 eliminated alternatives. Every recommendation states how it satisfies the contract or why it cannot.

---

## 2. Method and Scope

- **Corpus read in full** (mandated): SKILL.md, references/template-contract.md, references/catalog.md, references/color-system.md, scripts/check-corpus.cjs, all 20 files under assets/templates/, plus assets/color/palettes.json and palette-sheet-neutral.html (the copy-from skeleton).
- **Upstream studied**: Chart.js, D3 (d3-scale, d3-format, d3-array, d3-scale-chromatic), Vega-Lite/Vega, Plotly, Observable Plot, Apache ECharts — via official documentation, plus WCAG 2.1, W3C accessible-SVG guidance and MDN. The colorarchive.org and figviz colour guides are secondary practical sources here and carry no normative claim [CORRECTED 2026-09-03]. The CSS-Tricks title comparison returned HTTP 403 on 2026-09-03 and is unverifiable.
- **Constraint compliance**: every recommendation reconciles with template-contract.md sections 3-6 (one self-contained file, double-click, no build step, no package manager, no remote dependency). Only MIT-class open-source projects were used as sources of ideas. No reference-implementation clone under scratch/tmp/vendor was opened, read, searched or referenced (PolyForm Noncommercial prohibition). No file outside the lineage artifact directory was written; no repo tooling was executed.
- **Evidence rule**: every claim carries a corpus `file:line` citation and a named upstream source.

---

## 3. What a Delivered Chart from Each Library Actually Looks Like

| Library | Delivered output | Defaults that matter here |
| --- | --- | --- |
| Chart.js | Canvas-rendered chart in a page you wire up; "very appealing chart even if you don't specify any options" | Animations on, tooltips on (`enabled: true`), `responsive: true`, `maintainAspectRatio: true`, per-type `aspectRatio` (2 most, 1 radial); canvas content inaccessible to screen readers unless you add ARIA yourself [SOURCE: https://www.chartjs.org/docs/latest/, https://www.chartjs.org/docs/latest/configuration/tooltip.html, https://www.chartjs.org/docs/latest/configuration/responsive.html, https://www.chartjs.org/docs/latest/general/accessibility.html] |
| D3 | Hand-assembled SVG; no defaults, everything is explicit | `scale.ticks(count)` (count is a hint; steps human-readable; ticks within domain), `scale.nice()`, `tickFormat` auto-precision, d3-format `s`-type SI prefixes [SOURCE: https://github.com/d3/d3-scale/blob/v4.0.2/README.md, https://d3js.org/d3-format] |
| Vega-Lite | Declarative JSON spec compiled to Vega; chrome auto-generated | Mark + encoding; "automatically produces other visualization components including axes, legends, and scales"; default colour schemes by field type (categorical→tableau10, ordinal→blues, quantitative→heatmap/viridis or ramp/blues); `autosize`, `width: "container"`; legend `orient` default right; `labelOverlap` parity/greedy [SOURCE: https://vega.github.io/vega-lite/docs/spec.html, https://vega.github.io/vega-lite-v4/docs/scale.html, https://vega.github.io/vega-lite/docs/size.html, https://vega.github.io/vega-lite/docs/legend.html] |
| Plotly | Interactive figure from trace objects; rich axis config | `tickmode`/`tick0`/`dtick`/`nticks`, `tickformat` (d3 mini-language), `tickformatstops` per zoom level, `exponentformat`, `tickangle`. Neither page cited here carries the hover default, which needs Plotly's own hover documentation, so no hover default is asserted from these two [SOURCE: https://plotly.com/javascript/tick-formatting/, https://plotly.com/python/axes/ | CORRECTED 2026-09-03] |
| Observable Plot | SVG from mark declarations; small multiples, transforms | Marks are the "visual vocabulary" (barX/barY/rect/cell by data shape); default width 640 with `max-width: 100%`; margins from marks, not auto-fitted to labels; line breaks at invalid values; `tip: true` + pointer transform for details-on-demand; colour legend `legend: true` (ramp for quantitative) [SOURCE: https://observablehq.com/plot/features/marks, https://observablehq.com/plot/features/plots, https://observablehq.com/plot/marks/line, https://observablehq.com/plot/features/interactions, https://observablehq.com/plot/features/legends] |
| ECharts | Declarative `option` object; dataset component separates data from config | `dataset` for data reuse ("Provide the data, (II) Mapping from data to visual"); legend upper-right by default, scrollable, click-to-toggle; the ARIA component auto-generates descriptions under `aria.show`, and decal patterns for colour-blind readers sit under `aria.decal.show`, which is what the handbook's examples use even where its prose says `aria.enabled` [CORRECTED 2026-09-03]; canvas or SVG renderer; responsive sizing and touch [SOURCE: https://echarts.apache.org/handbook/en/concepts/dataset/, https://echarts.apache.org/handbook/en/concepts/legend/, https://echarts.apache.org/handbook/en/best-practices/aria/] |

---

## 4. Axis Ladders and Tick Selection

- The corpus `niceStep` ladder `[1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]` with `max = niceStep(peak / TICKS) * TICKS` (bar-columns.html:109-125, duplicated in 8 more templates) reproduces both D3 tick properties — human-readable steps and "guaranteed to be within the extent of the domain" [SOURCE: https://github.com/d3/d3-scale/blob/v4.0.2/README.md] — and is *finer* than D3's own 10^n × {1,2,5,10} family [SOURCE: https://d3js.org/d3-array/ticks | CORRECTED 2026-09-03, the GitHub fragment is not the canonical route], with the rationale documented (bar-columns.html:107-108). **Ahead on step selection.**
- The missing half is D3's `tickFormat` auto-precision [SOURCE: https://github.com/d3/d3-scale/blob/v4.0.2/README.md]: the corpus renders `String(value)` (bar-columns.html:131), so fractional data prints long decimals and the candlestick tick loop `value += step` (candlestick.html:137) accumulates float dust — d3 avoids this by integer-based tick computation [SOURCE: https://d3js.org/d3-array/ticks]. **Fix: `fmt` helper + `floor + step * t` loop (T2).**
- Zero-baseline discipline is a deliberate, tested property (candlestick.html:103-104 is the one range-niced form; `floor`/`ceiling` at candlestick.html:133-134 is a hand-rolled `nice` on a range). D3's two-sided `nice` would break it. **Ahead (F2.5).**
- Plotly's tick machinery (dtick/nticks/tickformatstops) is richer but exists for zoom-level formatting the corpus's fixed viewBox never needs [SOURCE: https://plotly.com/javascript/tick-formatting/].

## 5. Label and Legend Placement

- No upstream legend-placement consensus (Chart.js top, Vega-Lite right, ECharts upper-right) — but every library reserves layout space *outside* the plot; the corpus's in-figure swatch row (stacked-bars.html:155-160, treemap.html:141) consumes plot budget and can collide with marks (F3.1) [SOURCE: https://www.chartjs.org/docs/latest/configuration/legend.html, https://vega.github.io/vega-lite/docs/legend.html, https://echarts.apache.org/handbook/en/concepts/legend/].
- `keyX += 44 + name.length * 6.6` (stacked-bars.html:159; unit-grid.html:129; unit-ring.html:138; stacked-area.html:180; waterfall.html:175; candlestick.html:159), `caption.length * 6.8` (treemap.html:155) and `String(value).length * 34` (progress-single.html:117) are character-count estimates against a proportional font (bar-rows.html:31) — the weakest label technique in the corpus; upstream measures text (Plot `textAnchor`+`dx`, d3 getBBox) and never estimates by character count [SOURCE: https://observablehq.com/plot/marks/text]. **Fix: `getComputedTextLength()` (T4).**
- Direct labelling is an upstream doctrine — "faster and more accurate reading of values than an axis alone (or a tooltip)" [SOURCE: https://observablehq.com/plot/marks/text] — and the corpus already practices it pervasively (bar-rows.html:121; stacked-bars.html:147-150; treemap.html:163-165; heat-matrix.html:163-165; waterfall.html:157-158) with edge-anchor flips (daily-line.html:142-143; treemap.html:152-158). **Ahead (F3.3).**
- parallel-axes' alternating-lift labels (parallel-axes.html:132-138) are bespoke collision avoidance with a real limit ("per thousand" already crowds); upstream solves the same problem with rotation (`tickangle` [SOURCE: https://plotly.com/python/axes/]) which the corpus's fixed layout can't afford — a width check is the fix (T7).

## 6. Colour Ramps

- **The corpus's computed gates are ahead of every surveyed library**: `rampDarkestOnSurface` 3:1, `rampLightestOnSurface` 1.15:1 ("a low cell has to be distinguishable from an empty one"), `rampStepSeparation` 1.3:1, strict lightness monotonicity (check-corpus.cjs:163-189) — no library computes any contrast gate on its schemes [SOURCE: https://d3js.org/d3-scale-chromatic, https://vega.github.io/vega-lite-v4/docs/scale.html]. The grayscale-ordering test the colour literature recommends [SOURCE: https://colorarchive.org/guides/data-visualization-color-guide/, a secondary practical guide rather than a normative authority | CORRECTED 2026-09-03] is exactly the corpus's monotonicity check (check-corpus.cjs:186-189). **Ahead (F4.1).**
- The single-hue teal ramp (palettes.json:40-41) matches the "single-hue sequential palettes are the most reliable and the most colorblind-safe" guidance [SOURCE: https://colorarchive.org/guides/data-visualization-color-guide/, secondary practical guidance | CORRECTED 2026-09-03], and Vega itself warns multi-hue ramps create cluster illusion [SOURCE: https://vega.github.io/vega/docs/schemes/]. No diverging ramp exists because no catalog form consumes one — a deliberate absence (F4.2).
- The emphasis role (`--chart-emphasis`, color-system.md:58-59,127-129) has no counterpart in any surveyed library. **Ahead by design (F4.4).**
- Categorical hues are gate-safe but never name a reference palette; Okabe-Ito is the canonical CVD-safe qualitative set [SOURCE: Okabe and Ito's colour-universal-design material and Paul Tol's technical note carry this claim. The figviz survey at https://figviz.com/blog/scientific-color-palettes-okabe-ito-paul-tol-colorbrewer-viridis-cividis-rdbu-and-crameri-vik-2ubkmije is secondary and points at those same primary sources | CORRECTED 2026-09-03] — add a CVD rationale note and optionally align hues (P1).
- Ramp legends: upstream draws gradient ramps for quantitative scales [SOURCE: https://observablehq.com/plot/features/legends]; the corpus's textual "less… more, up to peak" (calendar-grid.html:190-197) is accessible but flat — an SVG `<linearGradient>` swatch is dependency-free (T8).

## 7. Accessibility

- Rule-10 trio (role="img" + resolving aria-labelledby + data-chart-table, template-contract.md:130; enforced check-corpus.cjs:424-448) is **ahead of Chart.js by Chart.js's own admission** — "the canvas content will not be accessible to screen readers" [SOURCE: https://www.chartjs.org/docs/latest/general/accessibility.html] — and its granularity (one labelled figure + navigable table, not per-mark ARIA) matches the description-level model the current Vega config documentation describes [SOURCE: https://vega.github.io/vega/docs/config/]. The v5.11.0 release note once cited for Vega's own ARIA-bloat concern would not serve on 2026-09-03 [UNVERIFIABLE: https://github.com/vega/vega/releases/tag/v5.11.0], so that historical wording is no longer claimed. No library ships a data-table fallback. **Ahead (F5.1).**
- Corpus gates map exactly onto WCAG 2.1 AA: 4.5:1 (1.4.3) and 3:1 (1.4.11) [SOURCE: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html, https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html]; the un-gated `rule` role (palettes.json:25-27) is defensible under 1.4.11's "required to understand content" scope. **Ahead (F5.5).**
- Gaps: figure `<desc>` doesn't state the series mapping (Vega's per-guide `description` model shows the pattern [SOURCE: https://vega.github.io/vega/docs/config/ | CORRECTED 2026-09-03, the `master` blob route would not fetch reliably]) and hand-written desc numbers go stale on data edits (ECharts generates them from data under `aria.show` [SOURCE: https://echarts.apache.org/handbook/en/best-practices/aria/]) — **fixes T5**.
- ECharts' decal patterns, configured under `aria.decal.show` rather than the handbook's stray `aria.enabled` prose [SOURCE: https://echarts.apache.org/handbook/en/best-practices/aria/ | CORRECTED 2026-09-03], are reachable as SVG `<pattern>` fills, per-form (T10).

## 8. Responsive Sizing

- Every upstream responsive mechanism — Chart.js container-resize re-render [SOURCE: https://www.chartjs.org/docs/latest/configuration/responsive.html], Vega-Lite `width: "container"` + `autosize`/`view.resize()` [SOURCE: https://vega.github.io/vega-lite/docs/size.html], Plot `ResizeObserver` + re-render [SOURCE: https://github.com/observablehq/plot/discussions/2105] — needs a runtime. The corpus's `viewBox` + `width: 100%` (bar-rows.html:46,67) is the static subset of all of them, and Plot's maintainer answers responsive *text* with a ResizeObserver and a re-render rather than with a static rule (discussion #2105) [CORRECTED 2026-09-03], which is a runtime a delivered file does not have, so its label policy has to be fixed and documented instead. **Parity on mechanism (F6.1).**
- The gap is verification, not mechanism: nothing checks narrow-width legibility (render check counts elements only, check-corpus.cjs:590-598). Fixes: min-size guard CSS (T6, template-level) and a phone-viewport render assertion (C1, contract-level).
- Plot's confessed "margins are not auto-adjusted for long labels" [SOURCE: https://observablehq.com/plot/features/plots] is the same fixed-layout trade the corpus makes — the corpus's defense is its short-label data shapes, which should be stated as per-form budgets (T7).
- Vega-Lite's `{step}` discrete sizing exists because it lacks capacity discipline; the corpus's ceilings (catalog.md:42-63) make it unnecessary. **Ahead (F6.4).**

## 9. Data-Mark Relationship

- The zero-transform contract ("never fetches, never computes the numbers it is displaying", template-contract.md:87) is the deliberate inverse of Vega-Lite's transform pipelines [SOURCE: https://vega.github.io/vega-lite/docs/transform.html] and Plot's "getting data into the right shape" transforms [SOURCE: https://observablehq.github.io/plot/features/transforms]. The catalog's `data shape` column (catalog.md:42-63) is the corpus's transform language, expressed as acceptance conditions; the approved numbers are the drawn numbers. **Ahead for its audience (F7.1).**
- Plot's mark-shape doctrine (rect/barX/barY/cell by data shape [SOURCE: https://observablehq.com/plot/features/marks]) formalises the corpus's data-shape column; the corpus adds an orientation guardrail (words→rows, codes→columns, catalog.md:30,44-45) Plot lacks. **Ahead (F2.2).**
- Missing data: Plot breaks lines at null [SOURCE: https://observablehq.com/plot/marks/line]; the corpus's path builders (daily-line.html:136-138; daily-range.html:136-141; stacked-area.html:162) emit NaN silently and the validator can't see it. **Fix: null-filter (T3).**
- The two computed values — waterfall end (waterfall.html:96-97) and stacked-area total (stacked-area.html:198-199) — are deliberate, commented, *auditable* exceptions (the computed column sits beside the typed values); Plot's stack transform solves the same problem opaquely [SOURCE: https://observablehq.com/plot/transforms/stack]. **Ahead; name the exception in the contract (C3).**
- ECharts' dataset component validates the corpus's data/data-config separation as an upstream doctrine [SOURCE: https://echarts.apache.org/handbook/en/concepts/dataset/]. **Ahead (F1.2).**

## 10. Number and Date Formatting

- Every library formats numbers via specifier or callback (Vega-Lite d3-format patterns [SOURCE: https://vega.github.io/vega-lite/docs/format.html]; Plotly d3 mini-language [SOURCE: https://plotly.com/javascript/tick-formatting/]; Chart.js `ticks.callback` [SOURCE: https://www.chartjs.org/docs/latest/axes/labelling.html]); the corpus renders `String(value)` in every tick, label and cell (bar-columns.html:131,142; bar-rows.html:121,132; heat-matrix.html:165; box-plot.html:158; scatter.html:138,143). **Fix: per-template `fmt` helper, locale-fixed (T2).**
- Time labels arrive display-ready by design ("day N", "Jan 1", "W1" — daily-line.html:84-92, stacked-area.html:88-112, candlestick.html:86-99), consistent with the no-computing contract; Vega-Lite's granularity-dependent dynamic time formats [SOURCE: https://vega.github.io/vega-lite/docs/format.html] are the analysis-side version. The rule should be stated in the catalog (C2).
- The corpus hand-rolls Vega-Lite's `labelOverlap: "parity"` [SOURCE: https://vega.github.io/vega-lite-v4/docs/axis.html] — day % 7 (daily-line.html:141), i % 4 (stacked-area.html:171), [1,3,5] (calendar-grid.html:182) — with edge anchoring; the constants need budget comments (T7).
- Vega-Lite's v1 axis defaults, labelAngle −45° and a label length limit of 25, are runtime luxuries [SOURCE: https://vega.github.io/vega-lite-v1/docs/axis.html, a historical v1 route cited for v1 behaviour only. Current and v4 Vega-Lite spell the option `labelLimit`, not `labelMaxLength` [SOURCE: https://vega.github.io/vega-lite-v4/docs/axis.html] | CORRECTED 2026-09-03], and the corpus's non-rotation stance is deliberate and consistent with direct labelling (parallel-axes.html:132-133 rejects truncation). **No change (F8.5).**

## 11. Interaction and Tooltips

- Hover tooltips are the upstream default (Chart.js `enabled: true` [SOURCE: https://www.chartjs.org/docs/latest/configuration/tooltip.html]; Plot `tip: true` + pointer transform [SOURCE: https://observablehq.com/plot/features/interactions]; ECharts tooltip component). The corpus has zero hover affordances in 20 templates — the largest delivered-output gap.
- The dependency-free fix is per-mark SVG `<title>`: widely available since July 2015 and usually displayed as a browser tooltip, which is what MDN states rather than a tooltip guarantee in every browser [SOURCE: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title | CORRECTED 2026-09-03], it doubles as the per-element accessible name per the W3C accessible-SVG draft [SOURCE: https://w3c.github.io/writing-accessible-svg/accessible-svg.html], is deterministic (rule 12), and trips none of the 13 checks (check-corpus.cjs:424-448 asserts svg-level attributes only). **Fix: T1, on the 8 forms where direct labelling is weakest** (scatter, heat-matrix, calendar-grid, candlestick, box-plot, treemap, waterfall, parallel-axes).
- Caveats are covered by the corpus's design: hover targets are whole marks (rects/circles), touch devices show no tooltip — the visible labels and rule-10 table are the fallback [UNVERIFIABLE 2026-09-03: https://css-tricks.com/svg-title-vs-html-title-attribute/ returned HTTP 403, so this rests on the MDN and W3C pages cited above]. Keyboard-focus behaviour has no compatibility matrix at all, and the open browser-compat-data issue records that missing data rather than proving every browser differs [SOURCE: https://github.com/mdn/browser-compat-data/issues/16831, which links Chromium issue 829352 | CORRECTED 2026-09-03]. The table is the keyboard path either way.
- JS floating tooltips are possible (~30 lines, deterministic — pointer position is input, not randomness) but add runtime surface for no screenshot value; keep as a per-form decision (F9.5).

---

## 12. Ranked Recommendations

### Template-level (applyable now) — ranked by impact/cost

| Rank | Change | Evidence |
| --- | --- | --- |
| T1 | Per-mark SVG `<title>` tooltips on scatter, heat-matrix, calendar-grid, candlestick, box-plot, treemap, waterfall, parallel-axes (one line per mark loop) | F9.1-F9.4 |
| T2 | Per-template `fmt` helper (thousands separators, float-dust trim, fixed en-US grouping) for ticks/labels/cells; candlestick tick loop `floor + step * t` | F8.1-F8.2, F2.1 |
| T3 | Null/NaN filtering in line, range and stacked-area path builders (gap = Plot's line-break semantics; em-dash in table) | F7.2, F2.4 |
| T4 | Replace `label.length * 6.6/6.8/34` estimates with `getComputedTextLength()` in the six swatch-row/key forms | F3.2 |
| T5 | Figure `<desc>`: series-mapping sentence per template + data-derived factual clause ("largest is X at Y") | F5.2, F5.4 |
| T6 | Min-size guard: `svg { min-width }` + `.figure { overflow-x: auto }` so narrow screens pan instead of squint | F6.2 |
| T7 | Per-form budget comments: gutter label-length budget, thinning rules, parallel-axes unit width | F6.3, F8.4, F3.4 |
| T8 | Gradient ramp legend swatch (SVG `<linearGradient>`) in calendar-grid and heat-matrix, keeping text legend | F4.5 |
| T9 | Data-shape `console.warn` guard when a catalog ceiling is exceeded | F7.5 |
| T10 | (Per-form decision) SVG `<pattern>` decals for stacked-bars, stacked-area, unit-ring | F5.3 |

**Contract reconciliation (all T-rows)**: every change is inline markup/CSS/JS copied with the template — the corpus's own idiom (SKILL.md:96-97); none imports a library, fetches a resource, reads the clock, or uses randomness (rules 6, 12); none alters the data-block contract (rule 8); none changes what the validator asserts, so check-corpus.cjs stays green by construction (the changes were verified against all 13 checks before inclusion, iteration 9).

### Contract-level (needs a decision)

| Rank | Change | Evidence |
| --- | --- | --- |
| C1 | Narrow-viewport render assertion in check-corpus.cjs (phone `--window-size`, no page overflow) | F6.5 |
| C2 | Catalog `data shape` wording: time labels arrive display-ready | F8.3 |
| C3 | Contract wording naming the computed-value exception (waterfall end, stacked-area total) to template-contract.md:87's "never computes" | F7.3 |
| C4 | (Alternative to T9) Visible in-figure notice when data exceeds a form's shape | F7.5 |
| C5 | (Deferred) Diverging colour system + catalog form that consumes it | F4.2 |

### Palette-level (applyable now)

| Change | Evidence |
| --- | --- |
| P1 | CVD rationale note in color-system.md; optional alignment of categorical hues with Okabe-Ito's first four (gates recompute automatically from palettes.json) | F4.3 |

### Why libraries themselves are NOT recommendations

Every recommendation that could be satisfied by adopting a library was explicitly rejected: the contract's no-dependency clause (template-contract.md:93-99) is load-bearing ("a remote dependency keeps the file working only while the network is up"), and every surveyed library requires a runtime the delivered file deliberately lacks. Ideas were borrowed (tick doctrine, direct labelling, line-break semantics, parity thinning, gradient legends, decals, data-derived descriptions); code was not.

---

## 13. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Survey all six libraries in one iteration | Exceeded per-iteration tool budget; split instead | iteration-001.md | 1 |
| Adopt D3 tick machinery as a dependency | Contract forbids libraries (template-contract.md section 5); ladder already sound and finer | F2.5 | 2 |
| Two-sided d3-style nicing across corpus forms | Would break the zero-baseline discipline the playbook tests | F2.5 | 2 |
| Adopt a library legend component | Contract forbids; upstream avoids overlap by layout, not by solving it | F3.1 | 3 |
| Wholesale Plot-style dx/textAnchor per-label offsets | Corpus already partially applies anchor flips | F3.3 | 3 |
| Add a diverging colour system now | No catalog form consumes a midpoint ramp; repeats the fourth-system mistake (color-system.md:127) | F4.2 | 4 |
| Per-mark ARIA attributes | Bloat of scenegraph/output SVG. The v5.11.0 release note once cited for Vega's own concern is unverifiable as of 2026-09-03, so the case rests on the description-level model in the current Vega config docs [CORRECTED 2026-09-03] | F5.1 | 5 |
| Corpus-wide decal adoption | Changes the shared visual register; per-form decision instead | F5.3 | 5 |
| Container-driven re-layout / per-viewport re-render | Every upstream re-layout requires a runtime; contract forbids | F6.1 | 6 |
| ECharts-style generic 2D-array datasets | Would weaken per-form expressive shapes; literal typed arrays are the contract | F7.5 | 7 |
| Vega-Lite/Plot transform pipelines | Contract forbids computing in the data path (template-contract.md:87) | F7.1 | 7 |
| Locale-sensitive Intl.NumberFormat | A delivered file must not change shape across locales | F8.1 | 8 |
| Vega-Lite-style label rotation/truncation defaults | Rotation needs runtime layout; truncation fights direct labelling | F8.5 | 8 |
| JS floating tooltip as corpus-wide default | Adds runtime surface; no screenshot-review value; native `<title>` + table suffice | F9.5 | 9 |
| Replacing visible labels with tooltips | Fights the direct-labelling doctrine the corpus already leads on | F9.5 | 9 |

---

## 14. Open Questions

- **O1 (decision, not research gap)**: whether to unify the nine duplicated `niceStep` ladders into one canonical ladder definition across templates, or keep per-form copies — the ladder itself is sound either way; unification is a maintenance decision (F1.4, F2.1).
- **O2 (decision)**: C1-C5 contract-level changes require operator sign-off; C4 and C5 are explicitly deferred pending form demand.
- **O3 (minor)**: whether per-mark `<title>` should be added to the eight value-labelled forms too (bar-rows, stacked-bars, unit-grid, unit-ring, grouped-bars, independent-percentages, daily-line, daily-range) — they benefit less; a consistent corpus-wide rule would be simpler than per-form selection (F9.3).

## 15. Where the Corpus Is Already Ahead (no change)

1. Computed colour gates on ramps and marks — unique among the six libraries (F4.1).
2. WCAG 2.1 AA-mapped thresholds with the `rule` exemption documented (F5.5).
3. The rule-10 data-table fallback — no library ships one (F5.1).
4. The emphasis role — no library has an equivalent (F4.4).
5. Direct labelling doctrine, practised pervasively (F3.3).
6. Zero-baseline discipline, including the one honest range-niced form (F2.5).
7. Capacity ceilings that make Vega-Lite's step sizing unnecessary (F6.4).
8. Hand-rolled parity thinning with edge anchoring (F8.4).
9. Auditable computed values (waterfall end, stacked-area total) (F7.3).
10. Zero-transform auditability: the approved numbers are the drawn numbers (F7.1).
11. The static viewBox — the honest subset of every upstream responsive mechanism (F6.1).

## 16. Convergence Report

- **Stop reason**: `max_iterations` (stopPolicy max-iterations, 10/10) — convergence signals treated as telemetry per dispatch contract.
- **Total iterations**: 10 | **Status**: all `complete`.
- **Questions answered**: 9/9 (Q1 partial→answered at synthesis via decision-form framing).
- **Average newInfoRatio**: 0.755 (trend 0.95 → 0.55; declining as expected as the frontier saturated; final iteration deliberately synthetic).
- **Findings**: 51 in registry (6+5+5+5+5+5+5+5+5+5) | **Ruled-out directions**: 15 | **Sources**: 15+ distinct named upstream sources plus corpus file:line citations.
- **Quality guards**: source diversity pass (6 libraries + WCAG/W3C/MDN/community guidance), focus alignment pass (one focus per iteration, all nine charter questions covered), no single-weak-source pass.
- **Escalations**: none. Pause sentinel: absent. Stuck recovery: never triggered.

## 17. References

**Corpus (read in full, cited by file:line throughout the iteration files)**: `.opencode/skills/sk-doc/sk-create-chart/` — SKILL.md; references/template-contract.md; references/catalog.md; references/color-system.md; scripts/check-corpus.cjs; assets/color/palettes.json; assets/color/palette-sheet-neutral.html; assets/templates/*.html (20 forms). No `resource-map.md` exists in the spec folder (checked at init; coverage gate skipped).

**Upstream and standards**:
- Chart.js — https://www.chartjs.org/docs/latest/, /configuration/tooltip.html, /configuration/responsive.html, /configuration/legend.html, /axes/labelling.html, /general/accessibility.html
- D3 — https://github.com/d3/d3-scale/blob/v4.0.2/README.md, https://d3js.org/d3-format, https://d3js.org/d3-array/ticks, https://d3js.org/d3-scale-chromatic
- Vega / Vega-Lite — https://vega.github.io/vega-lite/docs/spec.html, /docs/transform.html, /docs/format.html, /docs/size.html, /docs/legend.html, /docs/scale.html, /docs/axis.html (v1 and v4), https://vega.github.io/vega/docs/schemes/, /docs/scales/, https://vega.github.io/vega/docs/config/ (which replaces the `master` blob route). The release page https://github.com/vega/vega/releases/tag/v5.11.0 is unverifiable as of 2026-09-03. The v1 and v4 axis routes are version-scoped and are not current-behaviour citations
- Observable Plot — https://observablehq.com/plot/features/marks, /features/plots, /features/legends, /features/interactions, /marks/line, /marks/text, /transforms/stack, /interactions/pointer, https://github.com/observablehq/plot/discussions/2105
- Apache ECharts — https://echarts.apache.org/handbook/en/concepts/dataset/, /concepts/legend/, /best-practices/aria/
- Plotly — https://plotly.com/javascript/tick-formatting/, https://plotly.com/python/axes/
- Standards and guidance — WCAG 2.1 Understanding 1.4.3 / 1.4.11 (w3.org/WAI/WCAG21), W3C writing-accessible-svg (w3c.github.io), MDN SVG `<title>` (developer.mozilla.org), mdn/browser-compat-data issue 16831 (Chromium 829352), and, for colour, Okabe-Ito and Paul Tol as the primary sources with the colorarchive.org and figviz guides as secondary. CSS-Tricks "SVG Title vs. HTML Title Attribute" is unverifiable as of 2026-09-03 (HTTP 403)
