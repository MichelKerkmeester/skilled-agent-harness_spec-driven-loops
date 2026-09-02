# Iteration 6: Responsive sizing conventions

## Focus

Q5: how Plot, Vega-Lite, Chart.js and ECharts handle size and resize, what the corpus's fixed-viewBox scaling buys and costs, and what legibility-at-narrow-width would require.

## Findings

### F6.1 — Every upstream responsive mechanism needs a runtime; the corpus's viewBox scaling is the only static answer, and Plot's own discussion confirms responsive text is the unsolved part everywhere
Plot: fixed pixel `width` (default 640), height auto-derived from scales, margins from marks, and a default style of `max-width: 100%` so the plot shrinks to fit — but its maintainers' answer to "how do I make text stay correctly sized when responsive" is: use a `ResizeObserver` and re-render the plot [SOURCE: https://observablehq.com/plot/features/plots; https://github.com/observablehq/plot/discussions/2105]. Vega-Lite: `width: "container"` plus `autosize` (`pad`/`fit`/`fit-x`/`fit-y`), with `resize` defaulting to false "for performance reasons" and a manual `view.resize()` escape hatch [SOURCE: https://vega.github.io/vega-lite/docs/size.html]. Chart.js re-renders on container resize with `responsive: true` (iteration 1, F1.3). All three re-layout at runtime. The corpus's `viewBox` + `width: 100%; height: auto` (bar-rows.html:46,67) scales uniformly with zero runtime — the same mechanism Plot's SVG output uses for its *initial* fit, minus the re-render half. So on the sizing question the corpus is not behind on mechanism (it is the static subset of every upstream answer); it is behind only on *verification* (nothing checks legibility at a phone width) and on *text* (labels shrink with marks — the exact problem Plot's maintainers also have no static answer for). Template-level consequence: there is no dependency-free re-layout available, so the honest lever is a minimum legible size.

### F6.2 — A minimum-visible-size guard is the one dependency-free responsive improvement available: let the card scroll rather than shrink below legibility
The corpus card is `max-width: 760px` (bar-rows.html:36) and the figure is `width: 100%` (bar-rows.html:46); at a 320px viewport a 720-unit viewBox renders 13px labels at ~5.8px. Upstream's answer is re-render; the static equivalent is a floor: `svg { min-width: <px>; }` with `.figure { overflow-x: auto; }` so the drawing never scales below the size at which its smallest text (11px, e.g. bar-columns.html:59 `.tick`) is legible, and narrow screens pan instead of squint. This is pure CSS — no dependency, no remote resource (rule 6), deterministic (rule 12), and it cannot break any of the 13 checks (check-corpus.cjs:615-665 runs the same assertions regardless of CSS). It is a per-template value choice (what floor? 11px * 720/… — a 480px floor keeps the smallest labels at ~7.3px), so it is a template-level change with a per-form constant, not a contract change. Caveat: it changes nothing on a desktop double-click — the fix is only visible on narrow screens, which is exactly the emailed-file case the contract names (template-contract.md:22-23).

### F6.3 — Plot's "margins are not auto-adjusted for long labels" confession is the same fixed-Layout decision the corpus makes; the corpus's defense is its short-label discipline, which should be stated as a rule
Plot documents: "Plot does not adjust margins automatically to make room for long tick labels", suggesting larger `marginLeft` or an SI-prefix `tickFormat` instead [SOURCE: https://observablehq.com/plot/features/plots]. The corpus hardcodes plot geometry per form (LEFT=54, RIGHT=706, TOP=16, BASE=262, bar-columns.html:119-122) — the same fixed-layout model. Where the corpus differs is that its *data shapes* keep labels short by design ("8 or fewer categories", "short codes" — catalog.md:44-45), and its left gutters are sized for those shapes (156px for word labels, bar-rows.html:107). What is missing is the explicit rule: nothing states that a data block longer than the form's gutter is out of scope — a reader pasting a 40-char category name into bar-rows gets a clipped label with no warning and no check. Template-level: a comment in each template naming its gutter budget ("labels up to N characters"), or contract-level: a data-shape note in the catalog rows. Plot's admission is the upstream citation that the corpus's fixed-layout choice is a recognized trade, not a defect.

### F6.4 — Vega-Lite's `{step: number}` discrete sizing is the upstream mechanism for "fixed bar width, variable chart width"; the corpus's slot math is the static equivalent and is sound
Vega-Lite lets discrete fields size by `{step: number}` — width per category, so a longer category list makes a wider chart [SOURCE: https://vega.github.io/vega-lite-v4/docs/spec.html]. The corpus's `slot = (RIGHT - LEFT) / DATA.length` (bar-columns.html:134) is the inverse: fixed chart, shrinking slot. Given the corpus's capacity ceilings (≤8 categories, catalog.md:44), the fixed-chart model is correct — the ceiling is what keeps slots ≥ ~80px. This is a where-it-is-ahead result: Vega-Lite needs the step mechanism precisely because it has no capacity discipline; the corpus's ceilings (catalog.md:42-63) make the mechanism unnecessary. No change.

### F6.5 — The render check's viewport is unconstrained; a narrow-width render assertion is the contract-level candidate for closing F6.1's verification gap
check-corpus.cjs:580-585 runs Chrome headless with `--dump-dom` at the default viewport and counts figure elements (check-corpus.cjs:590-598). It could equally run with `--window-size=390,844` (a phone viewport) and assert the figure's rendered width is ≤ the viewport (no horizontal page overflow) — catching a card that overflows the viewport, which the current check cannot see. That assertion is contract-level (it changes what the validator enforces, template-contract.md:155-161 states what the check does not observe) and needs a decision; it complements the F6.2 template fix rather than replacing it. Nothing in it requires a library or a network — it uses the same headless browser the check already invokes.

## Sources Consulted

- [SOURCE: https://observablehq.com/plot/features/plots] Plot layout options (width 640, margins, max-width 100%)
- [SOURCE: https://github.com/observablehq/plot/discussions/2105] Plot responsiveness discussion (ResizeObserver + re-render)
- [SOURCE: https://vega.github.io/vega-lite/docs/size.html] Vega-Lite size/autosize
- [SOURCE: https://vega.github.io/vega-lite-v4/docs/spec.html] Vega-Lite view spec (step sizing)
- [SOURCE: https://www.chartjs.org/docs/latest/configuration/responsive.html] Chart.js responsive (iteration 1)
- Corpus: bar-rows.html, bar-columns.html, catalog.md, check-corpus.cjs, template-contract.md

## Assessment

- **newInfoRatio**: 0.65 — Plot/Vega-Lite sizing mechanics are new; the minimum-size guard and gutter-budget gaps are new; some ground (Chart.js responsive) restated from iteration 1 for the record.
- **Novelty justification**: F6.2/F6.3/F6.5 are new actionable findings; F6.1/F6.4 consolidate with fresh upstream citations.
- **Confidence**: High.

## Reflection

- **What worked**: Framing responsiveness as "mechanism vs verification vs text" — the corpus is at parity on mechanism (static subset), behind on verification, and tied with upstream on text (nobody has a static answer).
- **What failed / ruled out**: Seeking a dependency-free re-layout technique — none exists (all re-layouts need a runtime); ruled out adopting `width: "container"`-style container sizing (needs a runtime).
- **Ruled-out directions**: Container-driven re-layout (runtime required, contract); per-viewport re-render (same).

## Recommended Next Focus

Iteration 7: Data-mark relationship (Q6) — how Vega-Lite/Plot/ECharts encode data→mark (channels, transforms), what the corpus's data-block contract implies for editing, and missing-data handling (follow-up to F2.4).
