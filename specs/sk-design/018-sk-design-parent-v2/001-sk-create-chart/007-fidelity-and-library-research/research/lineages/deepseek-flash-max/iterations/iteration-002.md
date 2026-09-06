# Iteration 2: D3 and Observable Plot baselines — ticks, formats, mark doctrine

## Focus

Close the six-library baseline with D3 (scale ticks/nice/tickFormat, d3-format) and Observable Plot (mark vocabulary, line semantics), and check the corpus's `niceStep` ladder and data-shape columns against them.

## Findings

### F2.1 — The corpus `niceStep` is a sound, *finer* hand-rolled instance of the D3 tick doctrine; the one real gap is precision, not steps
D3's contract: `scale.ticks(count)` returns "approximately count" values that are "uniformly spaced, have human-readable values (such as multiples of powers of 10), and are guaranteed to be within the extent of the domain"; `scale.nice(count)` extends the domain to nice round values, e.g. [0.201479…, 0.996679…] → [0.2, 1.0] [SOURCE: https://github.com/d3/d3-scale/blob/v4.0.2/README.md]. The corpus ladder `[1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]` (bar-columns.html:112) with `max = niceStep(peak / TICKS) * TICKS` (bar-columns.html:125) reproduces both properties: the axis is guaranteed to cover the peak, and steps are human-readable. D3's own tickStep family is 10^n × {1, 2, 5, 10} [SOURCE: https://github.com/d3/d3-array#ticks]; the corpus ladder is strictly finer (1.25, 1.5, 2.5, 3, 4, 6, 8) with an explicit rationale (bar-columns.html:107-108: "A coarse one jumps from five to ten and leaves the tallest bar filling half the plot"). That is a defensible, documented divergence. What the corpus lacks is D3's *precision half*: `tickFormat` "automatically comput[es] the appropriate precision based on the fixed interval between tick values" [SOURCE: https://github.com/d3/d3-scale/blob/v4.0.2/README.md], while the corpus renders raw `String(value)` (bar-columns.html:131; same in every tick loop, e.g. daily-line.html:133, waterfall.html:147). With fractional data (e.g. 0.35 steps) the corpus would print long decimals, and the candlestick tick loop `for (let value = floor; value <= ceiling; value += step)` (candlestick.html:137) accumulates floating-point error (2.5-step loops can emit 10.000000000000002). Template-level fix: a small `fmtTick` rounding helper per template (e.g. `Math.round(value * 1e6) / 1e6` or one-decimal formatting), which keeps the single-file contract since the helper is copied with the template.

### F2.2 — Observable Plot's mark-shape doctrine is the upstream formalisation of the corpus's "data shape" column; the corpus adds an orientation rule Plot does not enforce
Plot: "use rect when both x and y are quantitative, use barX when x is quantitative and y is ordinal, use barY when x is ordinal and y is quantitative, use cell when both x and y are ordinal" — and "beware the simple 'bar'! A bar mark is used for a bar chart, but a rect mark is needed for a histogram" [SOURCE: https://observablehq.com/plot/features/marks]. The corpus's catalog `data shape` column (catalog.md:42-63) is the same doctrine expressed per form ("8 or fewer categories, one value each", "2 series across 6 or fewer categories"). The corpus goes further than Plot in one place: orientation is a *first-class* decision — word labels go horizontal, short codes vertical (catalog.md:30,44-45; bar-rows.html:94-95). Plot leaves orientation to the author's choice of barX vs barY. Corpus is ahead on guardrailing orientation; behind on the mapping being generic (each form hand-draws its marks rather than declaring channels — which is exactly what the template-first contract trades for reliability, SKILL.md:106-113).

### F2.3 — d3-format's SI-prefix and `s` type are the upstream answer to big-number axis labels; the corpus's `String(value)` has no thousand-separator or prefix story
`d3.format(".2s")(42e6)` → `"42M"`; SI prefixes run yocto→yotta, and the `s` type picks the prefix per value [SOURCE: https://d3js.org/d3-format]. The corpus renders `String(value)` in every tick and value label (bar-columns.html:131,142; unit-grid.html:140; waterfall.html:157-158; candlestick.html:139). Today the demo data is pre-scaled so labels stay short (waterfall.html:68 declares "in thousands" in the subtitle; heat-matrix.html:71 "in hundreds"), which is a legitimate convention — but nothing stops a delivered chart from receiving `1000000` in the data block, and the axis would then print "1000000" at every tick. Template-level recommendation: a per-template `fmt` helper using `Intl.NumberFormat` (zero-dependency, all modern browsers) with locale-appropriate separators, or the corpus convention "declare the unit in the data block and keep values small" promoted from tacit practice (found in 2 subtitles only) to a stated data-shape rule. The second is contract-level.

### F2.4 — Plot's line mark breaks at invalid values; no corpus template handles a missing reading
Plot: "If any of the x or y values are invalid (undefined, null, or NaN), the line will be interrupted, resulting in a break that divides the line shape into multiple segments" [SOURCE: https://observablehq.com/plot/marks/line]. The corpus has no such handling: daily-line.html:136-138 joins every point (`points.join(' L')`) and daily-range.html:136-141 draws every day; a null in the data block produces "NaN,NaN" inside the SVG path, which browsers silently drop — the chart draws a wrong-looking line with no error, and the corpus check cannot see it (check-corpus.cjs:590-598 only counts elements; template-contract.md:158-161 admits the check "does not look at the picture"). Template-level: a null-skipping filter in the line/area/range builders, plus a data-shape note; the catalog "data shape" column (catalog.md:42-63) currently never mentions missing values.

### F2.5 — D3's two-sided `nice` is the wrong tool for most corpus forms, and the corpus already makes the right call — including the one form where range-nicing applies
`nice` extends "the domain so that it starts and ends on nice round values" [SOURCE: https://github.com/d3/d3-scale/blob/v4.0.2/README.md]. The corpus's value axes deliberately start at zero (the only exception is candlestick, whose comment states the rationale: "a price chart forced to zero flattens every move it exists to show", candlestick.html:103-104), so it nices only the ceiling: `max = niceStep(peak / TICKS) * TICKS` (bar-columns.html:125). The candlestick form hand-rolls range-nicing: `floor = Math.floor(lowest / step) * step; ceiling = Math.ceil(highest / step) * step` (candlestick.html:133-134) — the same shape as D3's nice on [lowest, highest]. So the corpus already applies each nicing mode to exactly the forms where it is honest. This is a where-it-is-ahead result: a naive adoption of D3-style two-sided nicing across the corpus would *break* the zero-baseline discipline that the corpus's own playbook tests ("axis ladder fits the tallest mark", manual-testing-playbook/reading-the-chart/axis-ladder-fits-the-tallest-mark.md).

## Sources Consulted

- [SOURCE: https://github.com/d3/d3-scale/blob/v4.0.2/README.md] d3-scale README (ticks, tickFormat, nice)
- [SOURCE: https://d3js.org/d3-format] d3-format (SI prefixes, format types)
- [SOURCE: https://observablehq.com/plot/features/marks] Plot marks feature page
- [SOURCE: https://observablehq.com/plot/marks/line] Plot line mark
- [SOURCE: https://observablehq.github.io/plot/marks/bar] Plot bar mark
- Corpus: bar-columns.html, daily-line.html, daily-range.html, waterfall.html, candlestick.html, unit-grid.html, heat-matrix.html, catalog.md, check-corpus.cjs, template-contract.md

## Assessment

- **newInfoRatio**: 0.9 — D3/Plot facts are new; the corpus-side checks build on iteration 1.
- **Novelty justification**: Two library baselines closed; four concrete template-level gaps identified (precision, nulls, big-number formatting, float accumulation).
- **Confidence**: High.

## Reflection

- **What worked**: Reading d3-scale and Plot docs directly for exact API semantics; comparing the ladder against d3's documented tickStep family.
- **What failed / ruled out**: None material. Note: the d3-array tickStep step family (10^n × {1,2,5,10}) is documented; the corpus ladder deliberately diverges finer — this is a documented decision, not a defect.
- **Ruled-out directions**: Adopting D3's tick machinery as a dependency — contract forbids (template-contract.md:93-99); adopting two-sided nice across forms — would break zero-baseline discipline (F2.5).

## Recommended Next Focus

Iteration 3: Axis ladder and tick selection, resolved — consolidate Q1 (steps, precision, zero-baseline, float accumulation) and move to label/legend placement (Q2).
