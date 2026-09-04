# Iteration 8: ECharts data, legends, ARIA, and SVG titles

**Run:** 8 of 10  
**Retrieved:** 2026-09-03  
**Baseline:** `research/lineages/deepseek-flash-max/research.md:47,75,78,105`

## Focus

Verify the three ECharts citations and the two SVG accessibility citations: dataset separation/reuse, legend placement and controls, generated ARIA descriptions and decal patterns, native SVG title behavior, and the W3C accessible-SVG guidance.

## Findings

### 1. ECharts `dataset` component

- **Verdict:** VERIFIED
- **Live URL:** https://echarts.apache.org/handbook/en/concepts/dataset/ `[SOURCE: https://echarts.apache.org/handbook/en/concepts/dataset/]`
- **Resolves:** Yes; the current Apache ECharts Handbook page resolves and is served by the official project domain.
- **Documented version:** The page does not declare a single current package version; its compatibility note explicitly discusses ECharts 3 and ECharts 4, while the handbook is current as retrieved.
- **Evidence:** The page says defining data in `dataset` separates data from other configuration, allows reuse by several series or components without copying, supports common data formats, and follows the two-stage idea of providing data then mapping data to visuals. It documents `seriesLayoutBy: 'column'` as the default and shows automatic column mapping.
- **Corpus verdict:** The pinned corpus follows the same data/config separation at the delivery level: one literal data block precedes drawing code, and the contract makes that block the auditable source for the figure. It intentionally does not generalize to a reusable 2D-array component because each standalone file has one named data shape. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:85-106; .opencode/skills/sk-doc/sk-create-chart/references/catalog.md:71-76]`

### 2. ECharts legend placement, scrolling, and toggle

- **Verdict:** VERIFIED
- **Live URL:** https://echarts.apache.org/handbook/en/concepts/legend/ `[SOURCE: https://echarts.apache.org/handbook/en/concepts/legend/]`
- **Resolves:** Yes; the current Apache ECharts Handbook page resolves.
- **Documented version:** No single package version is declared on the page.
- **Evidence:** The page states that legends are placed at the upper-right corner of the chart and suggests bottom placement when space is crowded. It documents `type: 'scroll'` for many legend entries and says clicking a legend shows or hides the corresponding categories, with `selected` controlling initial selection.
- **Corpus verdict:** The shipped forms use static in-figure keys and text rather than an interactive ECharts component. The contract's self-contained file, no-runtime-fetch, accessible-SVG, and data-table rules remain the controlling boundary; none of the ECharts scroll/toggle behavior is present or required by the current static contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-164; .opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html:240-250]`

### 3. ECharts ARIA descriptions and decal patterns

- **Verdict:** CORRECTED
- **Live URL:** https://echarts.apache.org/handbook/en/best-practices/aria/ `[SOURCE: https://echarts.apache.org/handbook/en/best-practices/aria/]`
- **Resolves:** Yes; the current Apache ECharts Handbook page resolves.
- **Documented version:** The page names ECharts 4.0 for generated descriptions and ECharts 5 for decal patterns, but does not declare a current package version.
- **What `research.md` said:** The ECharts row said the aria module auto-generates descriptions and supports decal patterns for colour-blind users; the accessibility section treated ECharts' data-derived description and decal behavior as current recommendations.
- **What the source says:** The page says accessibility is off by default, requires importing `AriaComponent` in ECharts 5, and is enabled with `aria.show: true`. It says the component generates an `aria-label` from title, chart, and data, and that ECharts 5 supports decal patterns. It then says to use `aria.decal.show: true`, but the same sentence inconsistently names `aria.enabled` as the prerequisite.
- **Corrected wording:** “ECharts' imported `AriaComponent` can generate an `aria-label` from chart configuration when `aria.show` is true; ECharts 5 can add decal patterns with `aria.decal.show`. Treat the handbook's `aria.enabled` wording as an internal documentation inconsistency and verify the exact option against the target ECharts API before use.”
- **Corpus verdict:** T1's native SVG titles are present in all eight selected forms, and the rule-10 SVG/table fallback is contractual; T10 remains open because the pinned templates contain no SVG pattern/decal fills. The source therefore supports borrowing the accessibility goal, not importing the ECharts module. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/box-plot.html:135,177; .opencode/skills/sk-doc/sk-create-chart/assets/templates/calendar-grid.html:186,211; .opencode/skills/sk-doc/sk-create-chart/assets/templates/candlestick.html:144,192; .opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html:147,201; .opencode/skills/sk-doc/sk-create-chart/assets/templates/parallel-axes.html:146,185; .opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html:142,188; .opencode/skills/sk-doc/sk-create-chart/assets/templates/treemap.html:150,197; .opencode/skills/sk-doc/sk-create-chart/assets/templates/waterfall.html:137,194; .opencode/skills/sk-doc/sk-create-chart/references/color-system.md:154-168]`

### 4. MDN SVG `title` element and the July 2015 claim

- **Verdict:** CORRECTED
- **Live URL:** https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title `[SOURCE: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title]`
- **Resolves:** Yes; current MDN page last modified 2025-06-06.
- **Documented version:** MDN describes the SVG element and marks it Baseline Widely available; it is not a library-version page.
- **What `research.md` said:** The native SVG `<title>` was described as “a native browser tooltip since July 2015” and as a per-mark accessible name.
- **What the source says:** MDN's compatibility banner says the feature has been available across browsers since July 2015. The element provides an accessible short-text description; its text is not rendered, but browsers “usually” display it as a tooltip. MDN recommends `aria-labelledby` referencing visible text when such text already exists, and recommends `<title>` as the first child of its parent for SVG 1.1 compatibility.
- **Corrected wording:** “SVG `<title>` has been broadly available since July 2015 and usually produces a browser tooltip; it provides an accessible short-text description, but tooltip display is not a universal interaction guarantee and visible text should be referenced with `aria-labelledby` when available.”
- **Corpus verdict:** The T1 helper creates a `<title>` as the first child of each newly created mark, and the rule-10 figure/table path remains available. That closes the intended static fallback in the eight selected forms, subject to the corrected ‘usually’ tooltip wording. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html:139-146,187-190; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:163-167]`

### 5. W3C accessible-SVG draft

- **Verdict:** VERIFIED
- **Live URL:** https://w3c.github.io/writing-accessible-svg/accessible-svg.html `[SOURCE: https://w3c.github.io/writing-accessible-svg/accessible-svg.html]`
- **Resolves:** Yes; it is labelled “Editors' DRAFT”.
- **Documented version:** This is a living W3C editors' draft, not a library-versioned document.
- **Evidence:** The draft says `<title>` supplies a short human-readable name and `<desc>` a longer description; it recommends text alternatives for graphical content, says browsers often expose titles as tooltips when focus moves to the owning element, and says the title/desc map to accessible name/description properties. It also gives `role="img"`, `aria-label`, and `aria-labelledby` as ways to associate SVG text alternatives.
- **Corpus verdict:** Rule 10 requires `role="img"`, resolving `aria-labelledby`, and a `data-chart-table`; the eight T1 forms add per-mark title helpers. This matches the draft's accessibility pattern, while the draft status means it should guide implementation rather than be presented as a normative browser guarantee. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:163-167; .opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html:74-83,139-146,187-190]`

## Assessment

The ECharts pages confirm dataset separation, upper-right legend guidance, scrollable legends, click-to-toggle behavior, generated descriptions, and decal support. The ARIA page contains a specific option-name inconsistency: its operative examples use `aria.show`, while the decal paragraph says `aria.enabled`; the corrected wording preserves the behavior without treating the typo as an API fact. MDN and the W3C draft support the SVG title/accessibility strategy, but neither makes tooltip display universal; the July 2015 statement is a browser-availability baseline, not a tooltip guarantee. T1 is closed in the pinned corpus; T10 remains open.

**New-information ratio:** 0.84  
**Answered:** ECharts dataset/legend/ARIA/decal claims and SVG title/accessibility claims; the corresponding T1/T10 and rule-10 corpus status.  
**Correction impact:** Narrow the SVG claim from guaranteed native tooltip to broad availability plus “usually”; use `aria.show` and `aria.decal.show` while flagging the ECharts handbook's `aria.enabled` inconsistency; keep T10 as an unimplemented per-form option.

## Reflection

- **What worked and why:** The current Apache ECharts Handbook gives concise behavior statements and concrete option examples; MDN exposes compatibility and usage caveats on one page.
- **What did not work and why:** The ECharts API reference is JavaScript-driven and the handbook itself contains a conflicting option name, so a prose page cannot by itself certify every spelling.
- **What I would do differently:** Record version scope and option spelling separately from the high-level behavior claim whenever a current page mixes historical versions or has an internal inconsistency.

## Sources Consulted

- https://echarts.apache.org/handbook/en/concepts/dataset/
- https://echarts.apache.org/handbook/en/concepts/legend/
- https://echarts.apache.org/handbook/en/best-practices/aria/
- https://echarts.apache.org/en/llms.txt
- https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title
- https://w3c.github.io/writing-accessible-svg/accessible-svg.html

## Ruled Out

- **Treating ECharts' generated `aria-label` as a substitute for the corpus data table:** The generated description is runtime output, while the contract requires an auditable table in each delivered file.
- **Treating the ECharts handbook's `aria.enabled` phrase as a verified option name:** It conflicts with the page's `aria.show` examples and needs target-version API confirmation.
- **Treating “usually displays a tooltip” as keyboard or touch coverage:** The source does not make that guarantee; visible labels and the data table remain required fallbacks.

## Questions Remaining

- Which WCAG contrast criteria and browser-tooltip caveats are supported by the cited standards and issue pages?
- Are colorarchive.org and figviz.com authoritative enough for normative palette recommendations?
- Which final un-cited ECharts interaction/renderer claims need a current official source?

## Recommended Next Focus

Verify WCAG 2.1 Understanding 1.4.3/1.4.11, CSS-Tricks' SVG title comparison, the MDN browser-compat-data issue/Chromium tooltip caveat, and the two colour-guidance pages.
