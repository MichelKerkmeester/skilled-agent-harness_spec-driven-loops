# Iteration 9: Interaction and tooltips — what dependency-free affordances can deliver

## Focus

Q8: upstream default interaction (Chart.js tooltips, Plot tip/pointer, ECharts tooltip), the dependency-free ceiling for the corpus (native SVG `<title>`, pointer handlers), and the determinism boundary (rule 12).

## Findings

### F9.1 — Hover tooltips are the *default* interaction upstream; the corpus ships none, and the dependency-free fix is per-mark SVG `<title>` — the largest delivered-output gap closes with pure markup
Chart.js enables tooltips by default (`options.plugins.tooltip.enabled: true`, iteration 1 F1.3) [SOURCE: https://www.chartjs.org/docs/latest/configuration/tooltip.html]. Plot ships a `tip: true` one-liner on marks ("reveal details on demand when hovering") via the tip mark + pointer transform [SOURCE: https://observablehq.com/plot/features/interactions]; ECharts has a tooltip component with formatters (iteration 1) [SOURCE: https://echarts.apache.org/handbook/en/concepts/dataset/]. The corpus has no hover affordance in any of the 20 templates — every mark is inert. The dependency-free answer is the SVG `<title>` child element: MDN documents that it "provides an accessible, short-text description of any SVG container element or graphics element", is "not rendered as part of the graphic, but browsers usually display it as a tooltip", and has been available across browsers since July 2015 [SOURCE: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title]. Adding a `<title>` per mark is pure markup created by the same `node()` helper every template already uses (e.g. bar-rows.html:99-105) — no library, no network, deterministic (rule 12: content is fixed at render), and it cannot trip any of the 13 checks (check-corpus.cjs:424-448 asserts svg-level `role`/`aria-labelledby` and table presence only; per-mark `<title>` elements carry no ids). This is the single highest-value template-level change in the whole comparison.

### F9.2 — Native `<title>` doubles as the accessible name per element (W3C), and the data table remains the keyboard path because focus-tooltips are browser-inconsistent
The W3C accessible-SVG draft: "Browsers often make the title element available as a tooltip when focus moves to the element that the title belongs to", and "the title element maps to the accessible name property in the browser's accessibility API" [SOURCE: https://w3c.github.io/writing-accessible-svg/accessible-svg.html]. So each `<title>` is both a hover tooltip and an accessible name. The hover-on-focus behaviour is not reliably implemented (Chromium bug 829352 tracks making the title attribute visible on keyboard focus [SOURCE: https://github.com/mdn/browser-compat-data/issues/16831]); the corpus's existing rule-10 data table (template-contract.md:130) is the keyboard- and screen-reader-accessible value path, which is exactly why the corpus can add hover affordances without building a keyboard tooltip system. MDN's guidance — "If an element can be described by visible text, it is recommended to reference that text with an aria-labelledby attribute rather than using the title element" [SOURCE: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title] — points the other way for *labelled* elements, but for value-on-hover (the tooltip use case) `<title>` is the standard, and the corpus's visible labels stay untouched.

### F9.3 — The forms that need `<title>` most are exactly the ones where direct labelling is weakest: scatter, heat-matrix, calendar-grid, candlestick, box-plot, treemap, waterfall, parallel-axes
Plot's own doctrine (F3.3): direct labels beat tooltips "when space is available" [SOURCE: https://observablehq.com/plot/marks/text]. The corpus already direct-labels where space allows (bar-rows value per bar, bar-rows.html:121; stacked-bars segments when `h >= 22`, stacked-bars.html:147-150). The gap is the forms that cannot: scatter labels only the outlier (scatter.html:151-154) leaving 17 unlabelled points; heat-matrix prints values (heat-matrix.html:163-165) but a `<title>` can carry the row/column/value sentence; calendar-grid cells carry only colour (calendar-grid.html:176-179); candlestick shows four values per body with no labels (candlestick.html:147-150); box-plot boxes carry no values (box-plot.html:136-144); treemap cells below the label threshold (treemap.html:163-166) are silent; waterfall labels moves but not running totals (waterfall.html:157-158); parallel-axes shows values only at the right edge (parallel-axes.html:144-149). A `<title>` per mark ("Squad 16: 14 people, 9 closed per person") closes each of those holes with one line in the render loop. This is the same "details on demand" purpose Plot documents for its pointer/tip pair [SOURCE: https://observablehq.com/plot/features/interactions], delivered without the runtime.

### F9.4 — Two caveats are real and both are already covered by the corpus's design: `<title>` on painted pixels only, and no tooltips on touch — the data table is the fallback for both
CSS-Tricks documents that a `<title>` inside a `<path>` only fires over painted pixels (hover target is the fill, not the bounding box), while on a plain element the hoverable area is the whole rectangle [SOURCE: https://css-tricks.com/svg-title-vs-html-title-attribute/]. For the corpus's marks (rects, circles, thin bars) the painted area is the whole mark, so the caveat is mostly moot — but it is a reason to attach `<title>` to the mark element itself (rect/circle/line) rather than to wrapping groups. Touch devices show no native tooltip; the corpus's visible value labels plus the data table (rule 10) remain the touch path. Neither caveat blocks the change; both should be named in the template comment when the titles are added.

### F9.5 — A JS-enhanced floating tooltip is possible (~30 lines, deterministic) but should stay a per-form decision: it adds a runtime surface to every delivered file for a gain the native `<title>` + direct labels + table already covers
Plot's pointer transform listens to pointer events and re-renders the closest point within a 40px default radius [SOURCE: https://observablehq.com/plot/interactions/pointer]. The corpus could emulate a floating tooltip with a pointer handler + absolutely-positioned div — pointer position is input, not randomness, so rule 12 (template-contract.md:132) is not violated, and it needs no dependency. But it adds ~30 lines of JS to every delivered file, changes nothing for screenshot review (hover state isn't in a screenshot), and duplicates what native `<title>` plus the existing table already provide. Recommendation: ship native `<title>` corpus-wide (template-level, applyable now); leave the JS tooltip as an explicit per-form decision for scatter and candlestick if a future review finds the native tooltip insufficient — with the contract note that it remains deterministic and dependency-free.

## Sources Consulted

- [SOURCE: https://observablehq.com/plot/features/interactions] Plot interactions (tip: true, details on demand)
- [SOURCE: https://observablehq.com/plot/interactions/pointer] Plot pointer transform (40px radius, midpoints)
- [SOURCE: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title] MDN SVG <title>
- [SOURCE: https://w3c.github.io/writing-accessible-svg/accessible-svg.html] W3C writing accessible SVG (title/desc, tooltip on focus)
- [SOURCE: https://github.com/mdn/browser-compat-data/issues/16831] Tooltip display on focus (Chromium bug 829352)
- [SOURCE: https://css-tricks.com/svg-title-vs-html-title-attribute/] SVG title vs HTML title attribute
- [SOURCE: https://www.chartjs.org/docs/latest/configuration/tooltip.html] Chart.js tooltip defaults (iteration 1)
- Corpus: bar-rows.html, stacked-bars.html, scatter.html, heat-matrix.html, calendar-grid.html, candlestick.html, box-plot.html, treemap.html, waterfall.html, parallel-axes.html, check-corpus.cjs, template-contract.md

## Assessment

- **newInfoRatio**: 0.75 — native-title mechanics and the per-form mapping are new; the corpus's no-interaction stance was known from iteration 1.
- **Novelty justification**: F9.1-F9.5 turn the iteration-1 observation into a concrete, contract-safe, per-form change list.
- **Confidence**: High.

## Reflection

- **What worked**: Checking the proposed `<title>` change against every one of the 13 corpus checks before recommending it (no check trips); that is the discipline the contract demands (template-contract.md:117-134).
- **What failed / ruled out**: JS floating tooltips as the default (added runtime surface, no screenshot value, native titles suffice); per-element aria-labelledby instead of title (MDN recommends title for unlabelled descriptive content; visible labels already exist).
- **Ruled-out directions**: JS floating tooltip as a corpus-wide default; replacing visible labels with tooltips (fights direct-labelling doctrine).

## Recommended Next Focus

Iteration 10: Reconciliation and ranking (Q9) — assemble the ranked recommendation list, each marked template-level or contract-level with its explicit contract reconciliation, and verify question coverage before synthesis.
