# Iteration 4: Colour ramps — upstream conventions vs the corpus's gated 5-step ramp

## Focus

Q3: sequential/categorical colour conventions in d3-scale-chromatic, Vega-Lite/Vega schemes, ColorBrewer-derived palettes and Okabe-Ito colour-blind safety, measured against the corpus's `ordered` ramp, `categorical` hues and its computed contrast gates.

## Findings

### F4.1 — The corpus's ramp gates are *ahead of every surveyed library*: no library computes contrast gates on its own schemes
d3-scale-chromatic ships interpolators and discrete schemes (Blues, Greens, viridis…) with no contrast enforcement [SOURCE: https://d3js.org/d3-scale-chromatic]. Vega-Lite defaults quantitative fields to the "heatmap" (viridis) or "ramp" (blues) scheme with no legibility gate [SOURCE: https://vega.github.io/vega-lite-v4/docs/scale.html]. The corpus computes, on every check run, `rampDarkestOnSurface` (3.0:1), `rampLightestOnSurface` (1.15:1, "a low cell has to be distinguishable from an empty one"), `rampStepSeparation` (1.3:1) and strict lightness monotonicity from the palette source itself (check-corpus.cjs:163-189; gates declared in palettes.json:18-27). The closest upstream equivalent is *guidance*, not enforcement: the data-viz colour guide states "any valid sequential palette should pass as a correct ordering when converted to grayscale" [SOURCE: https://colorarchive.org/guides/data-visualization-color-guide/] — which is exactly what the corpus's monotonic-lightness check (check-corpus.cjs:186-189) mechanises. This is a where-it-is-ahead result with a concrete citation for every gate.

### F4.2 — The corpus's single-hue teal ramp is the convention upstream guides recommend (and viridis-style multi-hue carries a documented warning); the real missing piece is a *diverging* ramp, which the corpus has no form for
"Single-hue sequential palettes are the most reliable and the most colorblind-safe" [SOURCE: https://colorarchive.org/guides/data-visualization-color-guide/]; the corpus `ordered` system is one hue, five steps, `#213B3D → #A3C4C7` (palettes.json:40-41). Vega's scheme docs warn that multi-hue sequential schemes "may cause viewers to inaccurately see the data range as grouped into color-coded clusters" [SOURCE: https://vega.github.io/vega/docs/schemes/] — the exact failure the corpus's single-hue choice avoids. Vega's scale model also defines diverging scales (domain with three values: two hues + neutral middle) [SOURCE: https://vega.github.io/vega/docs/scales/], and ColorBrewer RdBu is the canonical diverging ramp [SOURCE: https://figviz.com/blog/scientific-color-palettes-okabe-ito-paul-tol-colorbrewer-viridis-cividis-rdbu-and-crameri-vik-2ubkmije]. The corpus has no diverging system and no catalog form whose question needs one (the nearest is waterfall, whose up/down encoding uses two *categorical* hues with a surface connector, waterfall.html:55-58). Recommendation: note the absence as a known catalog gap (contract-level, needs a decision when a midpoint form is added); do not add a ramp no form consumes — that would violate "a system whose only difference… adds a name without adding an answer" (color-system.md:127).

### F4.3 — Okabe-Ito is the canonical CVD-safe qualitative palette; the corpus's categorical hues achieve the same goals by gates and luminance, but a documented comparison is missing
Okabe-Ito (8 colours from the Color Universal Design work) is the recommended categorical default: "designed so that colors remain distinguishable for readers with common forms of color vision deficiency" [SOURCE: https://figviz.com/blog/scientific-color-palettes-okabe-ito-paul-tol-colorbrewer-viridis-cividis-rdbu-and-crameri-vik-2ubkmije], with usage guidance "2-8 named groups… Do not use it for a heatmap or any smooth numeric scale" [SOURCE: https://figviz.com/blog/scientific-color-palettes-okabe-ito-paul-tol-colorbrewer-viridis-cividis-rdbu-and-crameri-vik-2ubkmije]. The corpus categorical hues (#28405C, #874420, #487B3B, #A377B6, palettes.json:48) are not Okabe-Ito's, but the packet enforces the properties Okabe-Ito provides by other means: 3:1 mark-on-surface gate for every series value (check-corpus.cjs:190-200), luminance spread across the set so the palette survives greyscale (advisory, color-system.md:119), and "colour is never the only cue" (color-system.md:79) — matching "avoid red-green as the sole differentiator" [SOURCE: https://colorarchive.org/guides/data-visualization-color-guide/]. Gap: the colour system doc never names Okabe-Ito or any reference palette, so a future palette editor cannot audit the choice. Template/palette-level (applyable now): add a "CVD rationale" note to color-system.md and/or align the categorical set with Okabe-Ito's first four hues; the check recomputes all gates from palettes.json on the next run (check-corpus.cjs:617-618), so the gate machinery self-validates the swap.

### F4.4 — The emphasis role has no upstream counterpart; the corpus is ahead by design
Every corpus system defines `--chart-emphasis`, "for the single mark the headline is about" (color-system.md:58-59), and the fourth-system cut is documented: neutral-with-accent was considered and rejected because emphasis already fills that role (color-system.md:125-129). None of the six libraries surveyed has a first-class "emphasis" encoding channel: Vega-Lite has no `emphasis` channel (encodings are x/y/color/size/shape/…, spec.html), Chart.js colours datasets uniformly, ECharts has no per-mark emphasis role in its dataset model. The corpus's emphasis + headline-coupled design (bar-rows.html:64-65, 120: `d.lead ? 'bar-lead' : 'bar'`) is a deliberate annotation device upstream charts achieve only by hand-authoring a second dataset. This is a where-it-is-ahead result; no change recommended.

### F4.5 — Ramp legends: upstream draws gradient ramps for continuous scales; the corpus's textual "less… more, up to peak" legend is accessible but loses the ramp's shape — an SVG gradient legend is dependency-free and template-level
Plot renders a gradient ramp legend for quantitative colour scales (`legend: true` with `ramp` default for quantitative scales) [SOURCE: https://observablehq.com/plot/features/legends]. The corpus's ramp forms substitute: calendar-grid draws swatch steps with "none / less / more, up to peak" text (calendar-grid.html:190-197) and heat-matrix prints values in every cell (heat-matrix.html:163-165). The textual legend is *more* accessible to screen readers than a gradient (rule 10's data table carries the values), but a reader comparing two cells mid-ramp has no continuous reference. An SVG `<linearGradient>` swatch is pure vector markup — no dependency, no remote resource (rule 6, template-contract.md:126), deterministic (rule 12) — so a gradient swatch in the calendar-grid and heat-matrix legends is an applyable-now template-level change that closes the visual gap while keeping the text legend for accessibility.

## Sources Consulted

- [SOURCE: https://d3js.org/d3-scale-chromatic] d3-scale-chromatic (sequential schemes, ColorBrewer derivation)
- [SOURCE: https://vega.github.io/vega-lite-v4/docs/scale.html] Vega-Lite scale defaults by field type
- [SOURCE: https://vega.github.io/vega/docs/schemes/] Vega colour schemes (multi-hue warning)
- [SOURCE: https://vega.github.io/vega/docs/scales/] Vega scales (interpolate spaces, diverging)
- [SOURCE: https://colorarchive.org/guides/data-visualization-color-guide/] Colour guide (grayscale ordering test, CVD defaults)
- [SOURCE: https://figviz.com/blog/scientific-color-palettes-okabe-ito-paul-tol-colorbrewer-viridis-cividis-rdbu-and-crameri-vik-2ubkmije] Scientific palette comparison (Okabe-Ito, viridis, RdBu)
- [SOURCE: https://observablehq.com/plot/features/legends] Plot legends (ramp for quantitative)
- Corpus: palettes.json, check-corpus.cjs, color-system.md, calendar-grid.html, heat-matrix.html, waterfall.html, bar-rows.html, template-contract.md

## Assessment

- **newInfoRatio**: 0.75 — upstream scheme mechanics confirmed; corpus-side gate superiority and the missing-CVD-documentation gap are new.
- **Novelty justification**: F4.1/F4.4 establish corpus-ahead results with named upstream sources; F4.3/F4.5 are new actionable gaps.
- **Confidence**: High.

## Reflection

- **What worked**: Separating "ramp shape" (discrete vs continuous), "ramp safety" (gates), and "ramp legend" (rendering) into three distinct comparisons; each resolved differently.
- **What failed / ruled out**: Searching for an upstream contrast-gate equivalent — none exists (F4.1); ruled out adding a diverging system with no consuming form (F4.2).
- **Ruled-out directions**: Adding a diverging colour system now (no catalog form consumes it — would repeat the fourth-system mistake, color-system.md:127).

## Recommended Next Focus

Iteration 5: Accessibility (Q4) — screen-reader affordances and contrast in the libraries (aria support in Vega/Vega-Lite, ECharts aria, Chart.js accessibility, Plot a11y), vs the corpus's rule-10 trio (role="img", aria-labelledby, data-chart-table) and its un-gated `rule` role.
