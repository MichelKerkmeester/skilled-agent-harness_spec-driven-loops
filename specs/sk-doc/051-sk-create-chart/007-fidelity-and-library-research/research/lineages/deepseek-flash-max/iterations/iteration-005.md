# Iteration 5: Accessibility — screen-reader affordances, contrast, non-colour encoding

## Focus

Q4: what the libraries ship for accessibility (Vega ARIA generation, ECharts aria + decals, Chart.js canvas caveat), how the corpus's rule-10 trio compares, and where WCAG thresholds line up with the corpus gates.

## Findings

### F5.1 — The corpus's rule-10 trio is ahead of Chart.js by explicit admission, and its granularity is validated by Vega's own bloat concern
Chart.js renders to `<canvas>`, and its docs state plainly: "the canvas content will not be accessible to screen readers"; accessibility must be added by the user with ARIA attributes on the canvas element or fallback content [SOURCE: https://www.chartjs.org/docs/latest/general/accessibility.html]. The corpus's rule 10 requires every `svg` to carry `role="img"` plus a resolving `aria-labelledby` and a `data-chart-table` (template-contract.md:130; enforced at check-corpus.cjs:424-448). Vega generates ARIA attributes for SVG output — axes and legends get automatic `aria-label` captions, mark groups get `role`/`aria-roledescription` — but deliberately does *not* add per-mark ARIA by default because of "bloat of both the scenegraph and output SVG" [SOURCE: https://github.com/vega/vega/releases/tag/v5.11.0]. The corpus's choice — one labelled figure plus a full data table — is the same granularity trade Vega made, taken to its static extreme: the table is *better* than any aria-label list because it is navigable. Corpus is ahead; no change to the rule.

### F5.2 — Vega's per-guide ARIA (axes and legends each carry a `description` that becomes `aria-label`) is the model for the corpus's one-line-per-template gap: figure `<desc>` should enumerate the series mapping
Vega: guide definitions (axes, legends) accept a `description` property that sets `aria-label`, with auto-generated defaults, and `aria: false` hides a guide via `aria-hidden` [SOURCE: https://github.com/vega/vega/blob/master/docs/docs/config.md]. The corpus's figure desc describes the picture but not the mapping ("Five channels, each with a pair of columns…", grouped-bars.html:70) — the series-to-colour mapping lives only in the swatch row and the table header (grouped-bars.html:78,135-139). Since the table already carries the mapping in text, the one-line fix is to extend each figure's `<desc>` with "series are X, Y in order" (applyable now, template-level; no dependency, satisfies rule 10 as written since only presence + resolvability are checked, check-corpus.cjs:424-448).

### F5.3 — ECharts decal patterns (non-colour encoding for CVD) are the one upstream technique the corpus could adopt dependency-free via SVG `<pattern>` for its stacked forms
ECharts 5 "supports decal patterns that allow chart data to be distinguished by decal patterns in addition to color providing a better experience to those with color-blindness" [SOURCE: https://echarts.apache.org/handbook/en/best-practices/aria/]. The corpus's current non-colour answer is the design floor "colour is never the only cue. Categories keep labels, ordered data keeps position or length" (color-system.md:79-80) — which is stronger than decals for categories (labels beat patterns) but weaker for *segments within a stacked mark*, where the label lives inside the segment only when it is tall enough (stacked-bars.html:147-150 draws the value only when `h >= 22`). An SVG `<pattern>` decal (diagonal hatch per series) is pure vector markup: no dependency, no remote resource (rule 6, template-contract.md:126), deterministic (rule 12). Template-level candidate for stacked-bars, stacked-area and unit-ring; cost is pattern defs + a class per series, and it must stay below the surface-separator stroke (color-system.md:77). Caveat: it changes the "one visual register" look (catalog.md:82), so it should be a per-form decision, not a corpus-wide rule.

### F5.4 — ECharts auto-generates its aria description from the data; the corpus hand-writes `<desc>` and lets it go stale — data-derived desc text is deterministic and applyable now
ECharts "automatically generate[s] a description of the chart according to the title, chart, data, etc." and warns that for dense charts the default list is unusable, recommending a manual `aria.description` [SOURCE: https://echarts.apache.org/handbook/en/best-practices/aria/]. The corpus hand-writes each `<desc>` with *numbers*: "Onboarding is the longest at eighteen days" (bar-rows.html:69), "The tallest site despatched 840 pallets" (bar-columns.html:69). When the editor changes the data block (the documented workflow, template-contract.md:85-87), the desc silently disagrees with the chart — nothing checks it (check-corpus.cjs:424-448 validates presence and id resolution only; template-contract.md:158-161 admits the check "does not look at the picture"). Template-level fix: build the desc's factual clause from the data block at render time (e.g. "largest category is X at Y, from the N categories drawn below"), keeping the hand-written interpretive sentence. This is deterministic (rule 12 permits computed text), requires no dependency, and keeps the file self-consistent after an edit — matching ECharts' generate-from-data model with a fraction of the machinery.

### F5.5 — The corpus contrast gates map exactly onto WCAG 2.1 AA thresholds, and the un-gated `rule` role is defensible under the same standard
The corpus gates: `textOnSurface` 4.5:1 and `markOnSurface` 3.0:1 (palettes.json:18-24, enforced at check-corpus.cjs:136-159,190-200) — identical to WCAG 2.1 Success Criterion 1.4.3 Contrast (Minimum), 4.5:1 for normal text [SOURCE: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html], and 1.4.11 Non-text Contrast, 3:1 for graphical objects [SOURCE: https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html]. The deliberately un-gated `rule` role (palettes.json:25-27; color-system.md:100-102) is consistent with 1.4.11's scope, which applies to "graphical objects required to understand the content" — gridlines are structure, not information. And "colour is never the only cue" (color-system.md:79) is the corpus's implementation of WCAG 1.4.1 Use of Color. No library surveyed enforces any of these on its own output; the corpus computes them from the palette source on every check run (check-corpus.cjs:617-618). Corpus ahead; no change.

## Sources Consulted

- [SOURCE: https://www.chartjs.org/docs/latest/general/accessibility.html] Chart.js accessibility (canvas caveat)
- [SOURCE: https://github.com/vega/vega/releases/tag/v5.11.0] Vega ARIA generation release notes
- [SOURCE: https://github.com/vega/vega/blob/master/docs/docs/config.md] Vega config (axis/legend aria properties)
- [SOURCE: https://echarts.apache.org/handbook/en/best-practices/aria/] ECharts aria + decal patterns
- [SOURCE: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html] WCAG 2.1 1.4.3
- [SOURCE: https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html] WCAG 2.1 1.4.11
- Corpus: template-contract.md, check-corpus.cjs, palettes.json, color-system.md, bar-rows.html, bar-columns.html, grouped-bars.html, stacked-bars.html, stacked-area.html, unit-ring.html

## Assessment

- **newInfoRatio**: 0.8 — library a11y mechanics are new; corpus-side comparisons (WCAG mapping, desc staleness) are new.
- **Novelty justification**: F5.1/F5.5 are corpus-ahead results with named upstream and standard citations; F5.2-F5.4 are new actionable gaps.
- **Confidence**: High.

## Reflection

- **What worked**: Treating "screen-reader name", "series mapping", "non-colour cue" and "contrast" as four separate questions; each had a different answer.
- **What failed / ruled out**: Searching for a library that ships a data-table fallback — none does; the corpus's table is unique among the six. Ruled out: per-mark ARIA (Vega's own bloat concern validates the corpus granularity); corpus-wide decal adoption (changes the shared visual register — per-form decision instead).
- **Ruled-out directions**: Per-mark ARIA attributes (bloat, Vega release notes); corpus-wide decal patterns (register change, per-form instead).

## Recommended Next Focus

Iteration 6: Responsive sizing (Q5) — Chart.js/ECharts/Plot resize mechanisms vs the corpus's viewBox scaling, and what legibility verification at narrow widths would take (including a contract-level viewport-test candidate).
