# Iteration 1: Chart.js defaults, interaction, sizing, accessibility

**Run:** 1 of 10  
**Retrieved:** 2026-09-03  
**Baseline:** `research/lineages/deepseek-flash-max/research.md:42,60,75,97,104-106`  
**Scope note:** The live pages were treated as citation evidence only. No Chart.js or other dependency was added to the corpus.

## Focus

Verify the six Chart.js URLs that carry claims about defaults, tooltips, responsive sizing, canvas accessibility, legend placement, and tick callbacks, then compare the equivalent shipped-corpus behavior at commit `756a7fcd4c`.

## Findings

### 1. Chart.js overview and default configuration

- **Verdict:** VERIFIED
- **Live URL:** https://www.chartjs.org/docs/latest/ `[SOURCE: https://www.chartjs.org/docs/latest/]`
- **Resolves:** Yes; official Chart.js documentation.
- **Documented version:** The page is the current `latest` documentation and reports a last-updated date of 2025-10-13; it does not name a semver release.
- **Evidence:** The page says Chart.js has a default configuration and that a chart can be appealing without options; it also explicitly says animations are on by default and identifies canvas rendering. This supports the baseline's general “defaults” claim. It does not, by itself, prove every individual default in the baseline table; those are checked below.

### 2. On-canvas tooltip enabled by default

- **Verdict:** VERIFIED
- **Live URL:** https://www.chartjs.org/docs/latest/configuration/tooltip.html `[SOURCE: https://www.chartjs.org/docs/latest/configuration/tooltip.html]`
- **Resolves:** Yes; official configuration page.
- **Documented version:** Current `latest` docs; semver not stated on the page.
- **Evidence:** In the `options.plugins.tooltip` table, `enabled` is a boolean with default `true` and the description “Are on-canvas tooltips enabled?”. This exactly supports the baseline's `enabled: true` claim. The same page distinguishes the on-canvas tooltip from an HTML external tooltip, so “tooltip enabled” must not be read as keyboard-accessible HTML content.

### 3. Responsive, aspect-ratio, and container behavior

- **Verdict:** VERIFIED
- **Live URL:** https://www.chartjs.org/docs/latest/configuration/responsive.html `[SOURCE: https://www.chartjs.org/docs/latest/configuration/responsive.html]`
- **Resolves:** Yes; official configuration page.
- **Documented version:** Current `latest` docs; semver not stated.
- **Evidence:** The options table gives `responsive: true`, `maintainAspectRatio: true`, and `aspectRatio` with default `2` for ordinary charts and `1` for radial charts. It says Chart.js resizes the canvas when its container does, requires a relatively positioned dedicated container, and requires `maintainAspectRatio: false` when explicitly resizing height. The baseline's values and container-resize description are current.

### 4. Canvas accessibility statement

- **Verdict:** VERIFIED
- **Live URL:** https://www.chartjs.org/docs/latest/general/accessibility.html `[SOURCE: https://www.chartjs.org/docs/latest/general/accessibility.html]`
- **Resolves:** Yes; official accessibility page.
- **Documented version:** Current `latest` docs; semver not stated.
- **Evidence:** The page says Chart.js renders into a user-provided canvas, that canvas content is not accessible to screen readers, and that authors must add ARIA attributes or fallback content inside the canvas element. The baseline's warning and its suggested ARIA remedy are accurate.

### 5. Legend placement

- **Verdict:** VERIFIED
- **Live URL:** https://www.chartjs.org/docs/latest/configuration/legend.html `[SOURCE: https://www.chartjs.org/docs/latest/configuration/legend.html]`
- **Resolves:** Yes; official configuration page.
- **Documented version:** Current `latest` docs; semver not stated.
- **Evidence:** The `options.plugins.legend` table gives `display: true` and `position: 'top'`; the position section lists `top`, `left`, `bottom`, `right`, and `chartArea`. The page warns that doughnut, pie, and polar-area charts override legend defaults. The baseline's “Chart.js top” comparison is valid for the general default, with that chart-type caveat.

### 6. `ticks.callback`

- **Verdict:** VERIFIED
- **Live URL:** https://www.chartjs.org/docs/latest/axes/labelling.html `[SOURCE: https://www.chartjs.org/docs/latest/axes/labelling.html]`
- **Resolves:** Yes; official axis-labelling page.
- **Documented version:** Current `latest` docs; semver not stated.
- **Evidence:** The page says custom tick formatting is done by overriding `ticks.callback`, documents its `(value, index, ticks)` arguments, and warns that the callback author then owns all label formatting. It also documents the category-axis `getLabelForValue` distinction. The baseline's use of this API as a formatting precedent is current.

## Corpus at commit `756a7fcd4c228b1faeddbf10f449cfbc2409656f`

- **Tooltip equivalent:** The corpus does not ship Chart.js, but the dependency-free replacement is present on the eight targeted forms. `scatter.html` defines a native SVG `title` helper at lines 139-146 and attaches it to each circle at lines 187-190. This is an equivalent hover affordance, not a Chart.js tooltip implementation. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html:139-146,187-190]`
- **Canvas accessibility equivalent:** The corpus uses SVG with a resolving figure title/description and a text table rather than canvas. The contract requires `role="img"`, resolving `aria-labelledby`, and `data-chart-table` at rule 10. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:163-164]`
- **Responsive equivalent:** The corpus has a static pan affordance, not runtime container re-rendering. Rule 14 requires a sideways-scrollable figure and a drawing `min-width`; the contract explicitly says the check does not measure a narrow screen. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:167-172,197-201]`
- **Legend placement:** There is no Chart.js legend component. The templates' in-figure keys remain a local SVG layout decision; no upstream default should be copied into the single-file contract.

## Assessment

All six Chart.js citations resolve and support the attributed option or behavior. The only qualification is scope: the overview page supports the general defaults narrative, while the individual pages are the evidence for exact values. The shipped corpus now matches the relevant *outcomes* through native SVG titles, explicit SVG/table accessibility, and a static overflow floor; it intentionally lacks Chart.js's runtime canvas resize and plugin machinery because the contract requires a self-contained, no-remote-dependency HTML file. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159,163-167]`

**New-information ratio:** 0.90  
**Answered:** Chart.js default tooltip, responsive/aspect-ratio, canvas accessibility, legend position, and tick callback are current.  
**Correction impact:** None to T1/T6; retain the native SVG-title and static-pan recommendations. Add the radial-chart caveat wherever `aspectRatio` is summarized.

## Reflection

- **What worked and why:** Official Chart.js pages exposed the exact current option tables and accessibility wording, so each claim could be checked without relying on a runtime bundle.
- **What did not work and why:** The overview page did not enumerate every individual default; exact values had to be checked on the dedicated tooltip, responsive, legend, and axes pages.
- **What I would do differently:** Start future library checks from the dedicated option page and use overview pages only for general framing.

## Sources Consulted

- https://www.chartjs.org/docs/latest/
- https://www.chartjs.org/docs/latest/configuration/tooltip.html
- https://www.chartjs.org/docs/latest/configuration/responsive.html
- https://www.chartjs.org/docs/latest/general/accessibility.html
- https://www.chartjs.org/docs/latest/configuration/legend.html
- https://www.chartjs.org/docs/latest/axes/labelling.html

## Ruled Out

- **Chart.js runtime/canvas implementation:** It would violate the self-contained no-remote-dependency delivery contract and would not improve the corpus's SVG/table accessibility boundary. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159,163-167]`

## Questions Remaining

- Which D3 citation URLs and versioned API descriptions remain current?
- Which Vega-Lite versioned URLs are authoritative for the cited defaults?

## Recommended Next Focus

D3 tick generation, nicening, auto-precision, SI formatting, color schemes, and the corrected official location for the ticks API.
