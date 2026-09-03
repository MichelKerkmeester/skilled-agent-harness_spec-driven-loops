# Resource map — codex-luna-max

**Retrieved:** 2026-09-03  
**Lineage artifact root:** this directory  
**Baseline:** `specs/sk-doc/051-sk-create-chart/007-fidelity-and-library-research/research/lineages/deepseek-flash-max/research.md`  
**Corpus snapshot:** `756a7fcd4c`

## Produced lineage artifacts

- `deep-research-config.json` — effective detached-run configuration.
- `deep-research-state.jsonl` and `research/deep-research-state.jsonl` — state/projection records.
- `deep-research-strategy.md` — question and strategy state.
- `iterations/iteration-001.md` … `iterations/iteration-010.md` — human-readable evidence slices.
- `deltas/iteration-001.json` … `deltas/iteration-010.json` — machine-readable iteration events.
- `deep-research-ledger/`, `deep-research-audit-ledger/`, and `deep-research-effect-ledger/` — gateway-controlled receipts and effect records.
- `research.md` — canonical synthesis.
- `synthesis-v1.md` — synthesis snapshot.

## Source families

### Chart.js

`https://www.chartjs.org/docs/latest/`  
`https://www.chartjs.org/docs/latest/axes/labelling.html`  
`https://www.chartjs.org/docs/latest/configuration/legend.html`  
`https://www.chartjs.org/docs/latest/configuration/responsive.html`  
`https://www.chartjs.org/docs/latest/configuration/tooltip.html`  
`https://www.chartjs.org/docs/latest/general/accessibility.html`

### D3

`https://d3js.org/d3-format`  
`https://d3js.org/d3-scale-chromatic`  
`https://github.com/d3/d3-array#ticks` (corrected to `https://d3js.org/d3-array/ticks`)  
`https://github.com/d3/d3-scale/blob/v4.0.2/README.md`

### Vega-Lite/Vega

`https://github.com/vega/vega/blob/master/docs/docs/config.md` (corrected to current canonical config docs)  
`https://github.com/vega/vega/releases/tag/v5.11.0` (unverifiable cache miss)  
`https://vega.github.io/vega-lite-v1/docs/axis.html`  
`https://vega.github.io/vega-lite-v4/docs/axis.html`  
`https://vega.github.io/vega-lite-v4/docs/scale.html`  
`https://vega.github.io/vega-lite/docs/format.html`  
`https://vega.github.io/vega-lite/docs/legend.html`  
`https://vega.github.io/vega-lite/docs/size.html`  
`https://vega.github.io/vega-lite/docs/spec.html`  
`https://vega.github.io/vega-lite/docs/transform.html`  
`https://vega.github.io/vega/docs/schemes/`

### Plotly

`https://plotly.com/javascript/tick-formatting/`  
`https://plotly.com/python/axes/`

### Observable Plot

`https://observablehq.com/plot/features/interactions`  
`https://observablehq.com/plot/features/legends`  
`https://observablehq.com/plot/features/marks`  
`https://observablehq.com/plot/features/plots`  
`https://observablehq.com/plot/marks/line`  
`https://observablehq.com/plot/marks/text`  
`https://observablehq.com/plot/transforms/stack`  
`https://observablehq.github.io/plot/features/transforms`  
`https://github.com/observablehq/plot/discussions/2105`  
Supplemental pointer page: `https://observablehq.github.io/plot/interactions/pointer`

### ECharts

`https://echarts.apache.org/handbook/en/best-practices/aria/`  
`https://echarts.apache.org/handbook/en/concepts/dataset/`  
`https://echarts.apache.org/handbook/en/concepts/legend/`  
Supplemental renderer: `https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/`  
Supplemental sizing: `https://echarts.apache.org/handbook/en/concepts/chart-size/`  
Supplemental coarse pointer: `https://echarts.apache.org/handbook/en/how-to/interaction/coarse-pointer/`  
Supplemental tooltip example: `https://echarts.apache.org/handbook/en/how-to/component-types/geo/svg-base-map/`

### Accessibility and colour

`https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html`  
`https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html`  
`https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title`  
`https://w3c.github.io/writing-accessible-svg/accessible-svg.html`  
`https://github.com/mdn/browser-compat-data/issues/16831`  
`https://bugs.chromium.org/p/chromium/issues/detail?id=829352`  
`https://css-tricks.com/svg-title-vs-html-title-attribute/` (unverifiable HTTP 403)  
`https://colorarchive.org/guides/data-visualization-color-guide/` (secondary)  
`https://figviz.com/blog/scientific-color-palettes-okabe-ito-paul-tol-colorbrewer-viridis-cividis-rdbu-and-crameri-vik-2ubkmije` (secondary)  
Better colour authorities: `https://jfly.uni-koeln.de/color/` and `https://sronpersonalpages.nl/~pault/`

## Corpus references used for reconciliation

- `references/template-contract.md:89-106,124-132,154-172`
- `references/catalog.md:78-95`
- `assets/color-system.html:154-168`
- `scripts/check-corpus.cjs:476-485`
- T1–T7 evidence in the template files listed in `research.md`.

## Evidence boundary

The map records URLs and local evidence locations only. Fetched pages were treated as untrusted source data. No external source was treated as an instruction, and no non-MIT reference implementation was opened, read, copied, or paraphrased.

