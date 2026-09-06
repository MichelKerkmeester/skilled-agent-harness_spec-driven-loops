# Iteration 8: Number and date formatting conventions

## Focus

Q7: how upstream formats numbers and dates on axes and labels (d3-format patterns in Vega-Lite/Plotly, Chart.js `ticks.callback`), and what a concrete dependency-free `fmt` helper for the corpus would look like.

## Findings

### F8.1 — Every surveyed library formats numbers with a specifier or callback; the corpus's `String(value)` is the only no-format render, and the fix is a per-template `fmt` helper that survives the single-file contract
Vega-Lite axis/legend/text `format` uses d3-format patterns for numbers and d3-time-format for time, with defaults derived from config [SOURCE: https://vega.github.io/vega-lite/docs/format.html]. Plotly's `tickformat` is explicitly "the d3 formatting mini-language" [SOURCE: https://plotly.com/javascript/tick-formatting/]. Chart.js exposes `ticks.callback` and warns that overriding it makes you "responsible for all formatting" unless you delegate to `Chart.Ticks.formatters.numeric` [SOURCE: https://www.chartjs.org/docs/latest/axes/labelling.html]. The corpus renders `String(value)` in every tick loop, value label and table cell (bar-columns.html:131,142; bar-rows.html:121,132; unit-grid.html:140; waterfall.html:157-158; candlestick.html:139; heat-matrix.html:165; box-plot.html:158; scatter.html:138,143). Today the demo data is integral and pre-scaled, so it works — but nothing stops a delivered chart from receiving `1048576` (axis prints "1048576" five times) or `0.30000000000000004` (a float step). Template-level fix (applyable now, dependency-free): a 4-line `fmt` helper per template — `const fmt = (n) => { const r = Math.round(n * 1e6) / 1e6; return String(r).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }` — thousands separators plus float-dust trimming, copied with the template like the rest of the render code. It must be locale-fixed (en-US grouping) rather than `Intl.NumberFormat()` with the ambient locale, because the corpus's `tabular-nums` and English text assume a fixed format, and a delivered file must not change shape when opened in another locale. This satisfies the contract: no library, no network, deterministic (rule 12), and it is the corpus's own idiom (per-template duplication is the design, SKILL.md:96-97).

### F8.2 — The float-dust case is real and present in the corpus today: the candlestick tick loop accumulates floating-point error
The candlestick ladder iterates `for (let value = floor; value <= ceiling; value += step)` (candlestick.html:137). With integer data the step is integral and the loop is exact; with any fractional price (e.g. step 2.5 from a range of 98-144), `value` drifts (2.5, 5, 7.5, 10.000000000000002…) and `String(value)` (candlestick.html:139) prints the dust. d3's tick machinery avoids this by computing ticks from an integer step index (d3-array tickIncrement is integer-based) [SOURCE: https://github.com/d3/d3-array#ticks]. The `fmt` helper from F8.1 fixes the *rendered* artifact; the deeper template-level fix is to compute tick values as `floor + step * t` for integer `t` (matching d3's approach) — two lines, deterministic, no dependency. Either way the corpus is one small change from d3-equivalent behaviour without d3.

### F8.3 — Time labels: the corpus sends display-ready strings in the data block, which is the right call for the contract, but the catalog never says so
Vega-Lite formats temporal fields with d3-time-format patterns and even supports *dynamic* time formats that switch by granularity (year boundary → "2015", month → "Jan 2015") [SOURCE: https://vega.github.io/vega-lite/docs/format.html]. The corpus ships pre-formatted time labels as literals: "day 1"…"day 28" (daily-line.html:84-92), "Jan 1"…"Dec 2" (stacked-area.html:88-112), "W1"…"W14" (candlestick.html:86-99), plus a months array for the calendar header (calendar-grid.html:87,186-188). This is consistent with the data-block contract — "the numbers, and nothing else" (template-contract.md:85-87) — because a date *parser* would be exactly the computing the contract forbids (template-contract.md:87). What is missing is the stated rule: the catalog's `data shape` column (catalog.md:42-63) never says "time labels arrive display-ready", so a reader pasting ISO dates has no warning that conversion is theirs. Contract-level wording candidate (needs a decision): one clause in the catalog's data-shape guidance.

### F8.4 — Vega-Lite's `labelOverlap: "parity"` ("removing every other label") is exactly what the corpus already hand-rolls, with undocumented constants
Vega-Lite axis `labelOverlap` strategies: `"parity"` removes every other label for linear axes, `"greedy"` removes overlapping labels by scan [SOURCE: https://vega.github.io/vega-lite-v4/docs/axis.html]. The corpus's thinnings: daily-line labels only `day % 7 === 0 || day === 1` (daily-line.html:141), stacked-area labels every 4th month with edge anchors (stacked-area.html:171-173), calendar-grid labels weekdays 1/3/5 (calendar-grid.html:182-184), daily-line's start/middle/end anchor flips (daily-line.html:142-143). That is parity thinning plus edge anchoring, by hand, per form — the corpus is ahead on the intent and the constants are tuned to each viewBox. The gap is only that the *rule* is invisible: a template edit changing `% 7` to `% 6` without checking label width silently collides. Template-level: a one-line comment naming the thinning rule and its budget ("labels fit at every 7th; step 6 needs a narrower font"), which the corpus's comment style already uses elsewhere (e.g. bar-columns.html:107-108).

### F8.5 — Vega-Lite's rotation/truncation defaults (labelAngle −45°, labelMaxLength 25) are runtime luxuries the corpus's fixed layout can't use; the corpus's overflow answer should stay measurement, not rotation
Vega-Lite defaults: `labelAngle` −45° for time/ordinal axes and `labelMaxLength` 25 with truncation [SOURCE: https://vega.github.io/vega-lite-v1/docs/axis.html]. Rotation needs layout (how much horizontal space a rotated label consumes is measured at render), which the corpus's fixed viewBox cannot afford — and truncation ("…") would fight the corpus's direct-labelling doctrine (F3.3: labels must be readable, not abbreviated; parallel-axes.html:132-133 explicitly rejects "truncated into initials"). So the corpus's answer to long labels is exactly what F3.2 and F6.3 recommend (real text measurement; per-form label-length budget). No additional change; this finding closes Q7's date/label half by confirming the corpus's non-rotation stance is a deliberate, upstream-informed choice.

## Sources Consulted

- [SOURCE: https://vega.github.io/vega-lite/docs/format.html] Vega-Lite format (number/time, dynamic time format)
- [SOURCE: https://vega.github.io/vega-lite-v1/docs/axis.html] Vega-Lite axis (labelAngle, labelMaxLength)
- [SOURCE: https://vega.github.io/vega-lite-v4/docs/axis.html] Vega-Lite axis (labelOverlap)
- [SOURCE: https://www.chartjs.org/docs/latest/axes/labelling.html] Chart.js ticks.callback
- [SOURCE: https://plotly.com/javascript/tick-formatting/] Plotly tickformat (d3 mini-language)
- [SOURCE: https://github.com/d3/d3-array#ticks] d3-array ticks (integer-based tickIncrement)
- Corpus: bar-columns.html, bar-rows.html, unit-grid.html, waterfall.html, candlestick.html, heat-matrix.html, box-plot.html, scatter.html, daily-line.html, stacked-area.html, calendar-grid.html, parallel-axes.html, catalog.md, template-contract.md, SKILL.md

## Assessment

- **newInfoRatio**: 0.7 — formatting mechanics are new; the float-dust case and the display-ready-time-label rule are new corpus findings.
- **Novelty justification**: F8.1/F8.2 give a concrete dependency-free helper design; F8.3-F8.5 consolidate formatting stance with fresh upstream citations.
- **Confidence**: High.

## Reflection

- **What worked**: Designing the `fmt` helper against the actual contract clauses (single file, no dependency, determinism, per-template duplication) rather than against an idealized shared module.
- **What failed / ruled out**: `Intl.NumberFormat()` with ambient locale — locale-dependent output would make a delivered file render differently across machines; ruled out rotation/truncation (layout needs a runtime; truncation fights direct labelling).
- **Ruled-out directions**: Locale-sensitive Intl formatting (renders differently per machine); Vega-Lite-style rotation/truncation defaults.

## Recommended Next Focus

Iteration 9: Interaction and tooltips (Q8) — Chart.js/ECharts/Plot default interaction (tooltips, hover), what SVG `<title>`, pointer handlers and focus styles can deliver dependency-free, and how rule 12 determinism bounds them.
