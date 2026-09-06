# Live upstream citation verification and shipped-corpus reconciliation

**Lineage:** `codex-luna-max`  
**Session:** `fanout-codex-luna-max-1788404469193-3b2771`  
**Executor:** `cli-codex model=gpt-5.6-luna`  
**Retrieved:** 2026-09-03  
**Iterations:** 10 of 10, with `stopPolicy: max-iterations`  
**Baseline:** `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/007-fidelity-and-library-research/research/lineages/deepseek-flash-max/research.md`  
**Corpus snapshot:** commit `756a7fcd4c`

## Executive result

All 43 `[SOURCE: ...]` URLs in the baseline were checked against live public sources, in ten iterations. The final citation counts are:

| Verdict | Count |
|---|---:|
| VERIFIED | 31 |
| CORRECTED | 10 |
| UNVERIFIABLE | 2 |
| **Total** | **43** |

The two `UNVERIFIABLE` citations are the CSS-Tricks article, which returned HTTP 403, and the exact Vega v5.11.0 GitHub release page, which repeatedly returned a cache miss. Neither is treated as evidence. The ten corrections mostly narrow wording, replace a noncanonical URL, or replace secondary authority with a primary source; they do not justify adding a charting runtime to the templates.

The corpus audit confirms that T1, T2, T3, T4, T6, T7, C2, and C3 are shipped. T5 is partial. T8, T9, T10, and C1 remain open or partial. These are corpus findings only; this lineage writes no corpus changes.

Convergence was observed only as telemetry. The configured maximum of ten main-loop iterations was honored before synthesis.

## Method and constraints

Each baseline URL was checked for liveness, semantic support, and current API/default/version context. A source was marked `VERIFIED` only when its live text supported the attributed claim; a source was marked `CORRECTED` when it resolved but the baseline wording, URL, attribution, or scope needed adjustment; and a source was marked `UNVERIFIABLE` when the claim could not be checked from the public page reached.

The corpus check used the shipped files at `756a7fcd4c`, the T1–T10/C1–C3 checklist, and the named skill/reference files. The review did not inspect or use any reference-implementation clone under scratch, tmp, or vendor. No package was installed and no repository generation, validation, checkout, commit, or other out-of-scope write was run.

Every recommendation below is reconciled with the template contract: one self-contained HTML file opened by double-click, no build step, no package manager, no remote dependency, inline vector graphics, and accessible visible/table fallbacks. Runtime-library behavior is evidence about the upstream library, not permission to add that library to the corpus.

## Citation ledger

All rows below were retrieved on 2026-09-03. “Current” means the page did not pin a package release; the page’s own release/date context is stated where available.

### Chart.js

| # | Live URL | Verdict | Version/date and carrying text or option |
|---:|---|---|---|
| 36 | https://www.chartjs.org/docs/latest/ | VERIFIED | Current Chart.js documentation, page updated 2025-10-13; the defaults/configuration overview carries the library’s default option model and canvas-based chart context. |
| 37 | https://www.chartjs.org/docs/latest/axes/labelling.html | VERIFIED | Current docs; `ticks.callback` is the documented tick-label callback and receives the tick value/context used to format labels. |
| 38 | https://www.chartjs.org/docs/latest/configuration/legend.html | VERIFIED | Current docs; the legend configuration documents a displayed legend and the default `position: 'top'`. |
| 39 | https://www.chartjs.org/docs/latest/configuration/responsive.html | VERIFIED | Current docs; `responsive: true`, `maintainAspectRatio: true`, and `aspectRatio: 2` are documented defaults, with radial charts using aspect ratio 1. |
| 40 | https://www.chartjs.org/docs/latest/configuration/tooltip.html | VERIFIED | Current docs; the tooltip configuration documents `enabled: true` as the default and the interaction/configuration model. |
| 41 | https://www.chartjs.org/docs/latest/general/accessibility.html | VERIFIED | Current docs; the canvas rendering is not inherently accessible, so a fallback such as a data table or text summary is required. |

**Chart.js conclusion:** the baseline’s defaults, tooltip, responsive/aspect-ratio, legend, tick callback, and canvas-accessibility claims are supported. The static corpus should keep its own visible/table fallback rather than depend on Chart.js.

### D3

| # | Live URL | Verdict | Version/date and carrying text or option |
|---:|---|---|---|
| 3 | https://d3js.org/d3-format | VERIFIED | Current d3-format documentation (7.9.0 docs); the `s` type and SI-prefix formatting are documented in the format-specifier table. |
| 4 | https://d3js.org/d3-scale-chromatic | VERIFIED | Current d3-scale-chromatic documentation (7.9.0 docs); sequential, diverging, and categorical scheme families are listed. |
| 10 | https://github.com/d3/d3-array#ticks | CORRECTED | The GitHub fragment is not the canonical live documentation route for the cited API. Correct URL: https://d3js.org/d3-array/ticks. The current page documents approximate tick counts, the 1/2/5 family, and integer precision. |
| 11 | https://github.com/d3/d3-scale/blob/v4.0.2/README.md | VERIFIED | D3 scale v4.0.2 README; `ticks`, `nice`, and `tickFormat` document generated ticks, domain nicening, and automatic precision tied to the tick step. |

**D3 conclusion:** the baseline describes the relevant D3 behavior accurately after changing the d3-array citation to the official page. D3’s algorithms are useful design references, but the shipped templates implement small local format/tick helpers to preserve the no-dependency contract.

### Vega-Lite and Vega

| # | Live URL | Verdict | Version/date and carrying text or option |
|---:|---|---|---|
| 14 | https://github.com/vega/vega/blob/master/docs/docs/config.md | CORRECTED | The `master` URL was not a reliable fetch target. Use the current canonical docs URL https://vega.github.io/vega/docs/config/ or the GitHub `main` equivalent. The config docs describe view/axis/legend/mark description and ARIA-related configuration. |
| 15 | https://github.com/vega/vega/releases/tag/v5.11.0 | UNVERIFIABLE | The exact release page returned a cache miss during repeated live fetches. Nearest authoritative sources are the current Vega config and mark/view accessibility documentation; they do not prove the historical release-note wording. |
| 26 | https://vega.github.io/vega-lite-v1/docs/axis.html | CORRECTED | The page is a valid historical v1 route, but it should not be cited as current behavior. Use it only for a v1 compatibility claim; current or version-specific claims need the matching current/versioned documentation. |
| 27 | https://vega.github.io/vega-lite-v4/docs/axis.html | VERIFIED | Valid Vega-Lite v4 axis docs; the page documents `labelOverlap`, including parity/greedy behavior and label-angle/label-limit controls in that version. |
| 28 | https://vega.github.io/vega-lite-v4/docs/scale.html | VERIFIED | Valid Vega-Lite v4 scale docs; field-type-dependent scale/color defaults and scale configuration are documented. |
| 29 | https://vega.github.io/vega-lite/docs/format.html | VERIFIED | Current Vega-Lite format docs; number/time formatting options and the format channel behavior are documented. |
| 30 | https://vega.github.io/vega-lite/docs/legend.html | VERIFIED | Current Vega-Lite legend docs; automatic legends and `orient` configuration/default placement behavior are documented. |
| 31 | https://vega.github.io/vega-lite/docs/size.html | VERIFIED | Current Vega-Lite size docs; autosize and container-related width behavior are documented. The current pages expose a default-width inconsistency (the size page describes 200 while the spec overview describes 300), so no single numeric default is asserted without naming the page/version. |
| 32 | https://vega.github.io/vega-lite/docs/spec.html | VERIFIED | Current Vega-Lite spec docs; a mark plus encoding produces the declarative view, with axes and legends generated from encodings when applicable. |
| 33 | https://vega.github.io/vega-lite/docs/transform.html | VERIFIED | Current Vega-Lite transform docs; data transforms are declaratively specified before encoding/rendering. |
| 34 | https://vega.github.io/vega/docs/schemes/ | VERIFIED | Current Vega scheme docs; named continuous/discrete schemes and the available colour families are documented, with guidance to avoid misleading multi-hue mappings. |

**Vega-Lite/Vega conclusion:** mark plus encoding, generated guides, colour scheme behavior, autosize/width, legend orientation, label overlap/angle/length controls, formatting, and transforms are live-library capabilities. Versioned v1/v4 routes are historical/version-specific, not interchangeable current citations. The current Vega-Lite docs use `labelLimit` terminology where the baseline sometimes said `labelMaxLength`; the implementation recommendation must follow the cited version’s actual option name.

### Plotly

| # | Live URL | Verdict | Version/date and carrying text or option |
|---:|---|---|---|
| 24 | https://plotly.com/javascript/tick-formatting/ | VERIFIED | Current Plotly.js docs; `tickmode` (`auto`, `linear`, `array`), `tick0`, `dtick`, `nticks`, `tickformat`, `tickformatstops`, and `exponentformat` are documented. `tickangle` is not established by this page. |
| 25 | https://plotly.com/python/axes/ | CORRECTED | Current Plotly Python axes docs support `nticks`, `tick0`, `dtick`, `tickangle`, `tickformat`, and automatic tick-angle/automargin behavior. They do not carry the baseline’s hover-default claim; use the dedicated hover documentation for `hovermode`/hover-label behavior. |

**Plotly conclusion:** the axis/tick claims stand with corrected source attribution. Hover defaults must not be inferred from an axes page. Plotly remains a runtime dependency and therefore is not a contract-compatible implementation choice for these templates.

### Observable Plot

| # | Live URL | Verdict | Version/date and carrying text or option |
|---:|---|---|---|
| 16 | https://observablehq.com/plot/features/interactions | VERIFIED | Redirects to the official Observable Plot docs, Plot 0.6.17; pointer interaction and `tip: true`/pointer-transform usage are documented. |
| 17 | https://observablehq.com/plot/features/legends | VERIFIED | Redirects to official Plot 0.6.17 docs; ordinal swatch legends and continuous smooth ramp legends are documented. |
| 18 | https://observablehq.com/plot/features/marks | VERIFIED | Redirects to official Plot 0.6.17 docs; the marks vocabulary and composable/layered mark model are documented. |
| 19 | https://observablehq.com/plot/features/plots | VERIFIED | Redirects to official Plot 0.6.17 docs; default width 640 and `max-width: 100%` are documented, while margins are derived from the plot/marks rather than automatically expanded for every long label. |
| 20 | https://observablehq.com/plot/marks/line | VERIFIED | Official Plot 0.6.17 line-mark docs; null, undefined, or NaN values interrupt a line into separate segments. |
| 21 | https://observablehq.com/plot/marks/text | VERIFIED | Redirects to official Plot 0.6.17 text-mark docs; direct labels can communicate values faster/more accurately than axes or tooltips in appropriate cases, but labeling is not automatic. |
| 22 | https://observablehq.com/plot/transforms/stack | VERIFIED | Redirects to official Plot 0.6.17 stack docs; `stackY`/`stackX` derive lower/upper positions and are implicit for relevant area/bar/rect marks. |
| 23 | https://observablehq.github.io/plot/features/transforms | VERIFIED | Official Plot 0.6.17 transform docs; transforms derive/reshape data and are composable built-ins. |
| 13 | https://github.com/observablehq/plot/discussions/2105 | CORRECTED | The discussion is live, but the maintainer’s solution is ResizeObserver plus rerendering. It does not support the stronger baseline wording that there is simply “no static answer” for responsive text. Correct wording: responsive text sizing needs host/runtime measurement and rerendering; static templates need a fixed, documented label policy. |

**Observable Plot conclusion:** the marks, width, legend, invalid-value, stack, direct-label, pointer, and transform claims are supported by the official Plot docs. The responsive-text discussion is narrower than the baseline stated. Plot’s runtime interactions and rerendering are not portable into the self-contained corpus.

### ECharts

| # | Live URL | Verdict | Version/date and carrying text or option |
|---:|---|---|---|
| 6 | https://echarts.apache.org/handbook/en/best-practices/aria/ | CORRECTED | Current ECharts handbook describes ECharts 4 generated descriptions and ECharts 5 decal patterns, and requires the ARIA component/import. The page contains inconsistent `aria.enabled` wording; the documented examples use `aria.show` and `aria.decal.show`. Correct wording must use the actual option and acknowledge the page inconsistency. |
| 7 | https://echarts.apache.org/handbook/en/concepts/dataset/ | VERIFIED | Current ECharts handbook; the dataset component separates data from series configuration, supports reusable/common data formats, and documents column-oriented default layout. |
| 8 | https://echarts.apache.org/handbook/en/concepts/legend/ | VERIFIED | Current ECharts handbook; the legend is placed upper-right by default in the illustrated layout, supports `scroll`, and click selection toggles series visibility. |

**ECharts conclusion:** dataset, legend, ARIA descriptions, and decal capabilities are real, but ARIA option spelling must be corrected. Renderer, resize, coarse-pointer, and tooltip checks in iteration 10 add the following narrower conclusions: Canvas and SVG are supported with Canvas as the default renderer; resize needs an explicit host call; coarse-pointer snapping has documented mobile defaults from 5.4; tooltip support does not prove a global enabled-by-default setting.

### Accessibility, browser behavior, and colour guidance

| # | Live URL | Verdict | Version/date and carrying text or option |
|---:|---|---|---|
| 1 | https://colorarchive.org/guides/data-visualization-color-guide/ | CORRECTED | Live practical colour guide; it discusses grayscale ordering, single-hue ramps, and defaults, but supplies insufficient authorship/method/citation authority for a normative recommendation. Prefer Okabe–Ito and Paul Tol as primary/technical sources. |
| 2 | https://css-tricks.com/svg-title-vs-html-title-attribute/ | UNVERIFIABLE | The URL returned HTTP 403 during live retrieval, so the article’s exact comparison could not be checked. Nearest authoritative material: MDN SVG `<title>` and the W3C accessible-SVG draft. |
| 5 | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title | CORRECTED | MDN page last modified 2025-06-06; it documents short accessible title text, usual browser tooltip display, and the July 2015 Baseline. Correct wording is “widely available and usually tooltip-bearing,” not a universal native tooltip-on-focus guarantee. |
| 9 | https://figviz.com/blog/scientific-color-palettes-okabe-ito-paul-tol-colorbrewer-viridis-cividis-rdbu-and-crameri-vik-2ubkmije | CORRECTED | Live page updated 2026-06-27; it is a practical secondary guide and points toward Okabe–Ito, Paul Tol, ColorBrewer, Matplotlib, and Crameri. Use those primary/technical sources for normative colour guidance. |
| 12 | https://github.com/mdn/browser-compat-data/issues/16831 | CORRECTED | Live open issue created 2022-06-30 about missing compatibility data for tooltip-on-focus behavior; it records uncertainty and links Chromium issue 829352, but is not itself a browser compatibility matrix or proof of a universal inconsistency. |
| 35 | https://w3c.github.io/writing-accessible-svg/accessible-svg.html | VERIFIED | W3C writing-accessible-SVG draft; title/desc alternative text, accessible name/description, and `role="img"`/`aria-labelledby` patterns support the baseline accessibility guidance. Treat the document as draft guidance. |
| 42 | https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html | VERIFIED | WCAG 2.1 Understanding 1.4.3; normal text contrast 4.5:1, large text 3:1, with documented exceptions. |
| 43 | https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html | VERIFIED | WCAG 2.1 Understanding 1.4.11; meaningful non-text graphics and UI indicators need 3:1 contrast, subject to the documented essential/active/inactive and user-agent exceptions. |

**Accessibility/colour conclusion:** WCAG and the W3C/MDN accessibility guidance carry the normative parts of the recommendation. The two commercial/editorial colour guides are live but secondary. The BCD issue and Chromium reference are evidence that focus-tooltip behavior needs cautious wording, not a promise of a browser-independent default.

## Supplemental live checks for uncited upstream claims

These are not additional baseline URL rows, so they do not change the 31/10/2 count.

| Capability | Verdict | Evidence and contract consequence |
|---|---|---|
| Observable Plot pointer transform | VERIFIED | https://observablehq.github.io/plot/interactions/pointer documents nearest-point filtering, two-dimensional behavior, paired channels, a default `maxRadius` of 40 pixels, and interactive rerendering. It requires runtime Plot behavior and is not copied into static templates. |
| ECharts Canvas/SVG renderer | VERIFIED | https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/ documents both renderers and Canvas as default. This is background only; inline SVG remains the contract-compatible choice. |
| ECharts responsive sizing/coarse pointer | CORRECTED | https://echarts.apache.org/handbook/en/concepts/chart-size/ requires `resize`/often `ResizeObserver`; https://echarts.apache.org/handbook/en/how-to/interaction/coarse-pointer/ documents ECharts 5.4 mobile defaults. Do not call ECharts automatically responsive without host code. |
| ECharts tooltip default | CORRECTED | https://echarts.apache.org/handbook/en/how-to/component-types/geo/svg-base-map/ demonstrates tooltip support by declaring `tooltip: {}`; it does not establish a global default-on setting. |
| Browser focus-tooltip reference | CORRECTED | https://bugs.chromium.org/p/chromium/issues/detail?id=829352 resolves, but its body was not readable in the live fetch. Together with BCD issue 16831 it supports cautious wording, not a complete cross-browser behavior matrix. |

## Ranked corrections that change template guidance

1. **Do not add runtime defaults by inference.** ECharts tooltip support is not proof of a global default-on tooltip, and ECharts resize requires host code. Observable Plot pointer/tip behavior likewise requires runtime rerendering. The templates should retain visible labels/tables and static sizing safeguards.
2. **Keep the portability boundary explicit.** Verified upstream interactivity, Canvas/SVG renderers, auto-generated guides, and responsive measurement are library capabilities, not contract-compatible template features. The one-file/no-build/no-remote-dependency rule remains controlling.
3. **Correct the accessibility wording around SVG titles and focus tooltips.** MDN says SVG `<title>` provides short accessible text and browsers usually display a tooltip; the July 2015 baseline does not prove a universal native tooltip-on-focus behavior. The BCD issue and Chromium reference show that browser support/behavior is not a complete compatibility matrix. Use title/description plus visible/table fallbacks and do not promise focus tooltips.
4. **Use the actual versioned Vega-Lite option and URL.** The v1 axis path is historical, the v4 path is version-specific, and current pages use `labelLimit` terminology rather than assuming `labelMaxLength`. Cite a matching version and option name.
5. **Correct ECharts ARIA option spelling and scope.** Use `aria.show` and `aria.decal.show` with the ARIA component/import; mention the current handbook’s conflicting `aria.enabled` text rather than copying it as an API contract.
6. **Separate Plotly tick evidence from hover evidence.** The JavaScript tick-formatting page carries axis options; the Python axes page carries axis behavior, not the hover default. Use a dedicated hover source for `hovermode` and hover-label claims.
7. **Replace secondary colour authority.** ColorArchive and Figviz are live practical guides, but their authorship/method/authority is insufficient for a normative accessibility recommendation. Prefer Okabe–Ito’s original colour-vision-design material and Paul Tol’s technical note, alongside WCAG where contrast is the claim.
8. **Repair the D3 and Vega source routes.** Cite the canonical d3-array ticks page and current Vega config docs. Do not rely on the inaccessible v5.11.0 release page for a load-bearing historical claim.
9. **Qualify Vega-Lite numeric defaults.** The current size and spec pages expose different default-width descriptions (200 versus 300); name the page/version when a numeric default matters instead of presenting one number as universal.

## Shipped-corpus checklist

| Item | Verdict at `756a7fcd4c` | File:line evidence |
|---|---|---|
| T1 — accessible SVG title/description helpers and calls | **CLOSED** for the eight detached-key forms | `assets/templates/box-plot.html:135,177`; `calendar-grid.html:186,211`; `candlestick.html:144,192`; `heat-matrix.html:147,201`; `parallel-axes.html:146,185`; `scatter.html:142,188`; `treemap.html:150,197`; `waterfall.html:137,194` |
| T2 — display-ready number formatting and sensible ticks | **CLOSED** in the targeted bar and candlestick forms | `assets/templates/bar-columns.html:120-160` (`fmt`, `niceStep`, and ticks); `assets/templates/candlestick.html:129-139,172-181` |
| T3 — invalid-value segmentation/handling | **CLOSED** in the targeted line/range/area forms | `assets/templates/daily-line.html:151-195`; `daily-range.html:149-158,181-187`; `stacked-area.html:169-203,221-227` |
| T4 — measured label budgets | **CLOSED** for the six targeted forms, with a documented character fallback | `assets/templates/candlestick.html:208`; `progress-single.html:148`; `stacked-area.html:250`; `stacked-bars.html:190`; `unit-grid.html:160`; `unit-ring.html:169` |
| T5 — data-derived accessible descriptions | **PARTIAL** | Mapping prose: `assets/templates/candlestick.html:76`; `grouped-bars.html:75`; `stacked-area.html:78`; `stacked-bars.html:77`; `waterfall.html:77`. Static data-derived factual clauses remain, for example `assets/templates/scatter.html:77`, `heat-matrix.html:82`, and `waterfall.html:77`. |
| T6 — narrow viewport overflow/min-width guard | **CLOSED** across all 20 templates | Seventeen templates use the guard at line 50; `assets/templates/calendar-grid.html:51`, `heat-matrix.html:51`, and `progress-single.html:51` use it at line 51. |
| T7 — label-thinning and name/gutter budgets | **CLOSED** in the targeted crowded forms | `assets/templates/bar-rows.html:142-145`; `daily-line.html:197-205`; `parallel-axes.html:167-175`; `stacked-area.html:229-237`; measurement comments/values remain in the six T4 forms. |
| T8 — continuous heat/ramp legend | **OPEN/PARTIAL** | `assets/templates/calendar-grid.html:229-239` explicitly records five discrete swatches, not a gradient bar; `assets/templates/heat-matrix.html:219-223` uses discrete rect swatches and text. |
| T9 — console warning guard for overlarge datasets | **OPEN as requested; PARTIAL alternative** | No requested `console.warn` implementation; visible bounded notices are in `assets/templates/scatter.html:198-210` and `heat-matrix.html:225-238`. |
| T10 — SVG pattern/decal fills | **OPEN/DEFERRED** | `assets/color-system.html:154-168` records pattern fills as considered/deferred; no template contains an SVG `<pattern>`/decal fill. |
| C1 — exact phone-viewport render assertion | **PARTIAL/OPEN** | `scripts/check-corpus.cjs:476-485` states that the narrow check is stylesheet-only and does not verify actual phone legibility; representative guard is `assets/templates/bar-rows.html:50-51`. |
| C2 — time formatting contract | **CLOSED** | `references/catalog.md:78-95` requires display-ready time labels and no parse/reformat step. |
| C3 — derived closing/per-period total exception | **CLOSED** | `references/template-contract.md:89-106` names the waterfall closing-total and stacked-area per-period-total presentation exceptions. |

### Corpus interpretation

The shipped templates all retain their static narrow-width safeguards and local display formatting. T4 is closed for the six targeted forms, but its documented character fallback is still a fallback rather than a full font-measurement guarantee. T5 is not a blanket closure because several descriptions contain literal data-derived facts that will not update if the data block changes. T8’s discrete swatches are not a continuous ramp. T9’s visible notices are useful, but they are not the requested console-warning guard. C1’s CSS test is not an actual phone-viewport render assertion.

## Contract reconciliation

The relevant contract statements are in `references/template-contract.md:89-106` (data block and named presentation-derivation exceptions), `references/template-contract.md:124-132` (no charting library, web font, icon package, CDN, or remote fetch), and `references/template-contract.md:154-172` (inline/accessibility/narrow-viewport rules). `references/catalog.md:78-95` makes time labels display-ready, and `assets/color-system.html:154-168` explicitly defers pattern fills.

Accordingly:

- D3/Chart.js/Vega-Lite/Plotly/Observable Plot/ECharts API behavior may inform visual and accessibility decisions, but none should be loaded at runtime.
- Pointer tips, hover defaults, automatic guide generation, runtime resize, and mobile coarse-pointer snapping are not reproducible by simply adding static markup; they require library or host code.
- Static labels, accessible descriptions, data tables, inline SVG, local formatting helpers, overflow, and minimum SVG widths remain the appropriate contract-compatible mechanisms.
- T8/T10 can only be implemented later if their static SVG forms remain self-contained and accessible. C1 needs an actual render assertion, not a stylesheet-only proxy.

## Negative knowledge

- A live URL is not sufficient authority for a normative claim: both colour articles resolve, but their provenance is secondary.
- A library’s documented default is not transferable to a static template.
- A historical/versioned documentation page is not a current API source unless the claim is explicitly scoped to that version.
- A stylesheet rule that allows horizontal overflow is not evidence that a real phone viewport is legible.
- Discrete colour swatches do not implement a continuous gradient legend, and a deferred pattern note is not a shipped decal implementation.

## Output and provenance

The per-iteration records are `iterations/iteration-001.md` through `iterations/iteration-010.md`; machine-readable iteration deltas are in `deltas/iteration-001.json` through `deltas/iteration-010.json`. The gateway receipt for the tenth iteration is sequence 10 in the lineage’s `deep-research-ledger`. This synthesis was produced after exactly ten main-loop passes and is intended to be the authoritative lineage result.

## Convergence Report

- **Stop reason:** `maxIterationsReached`
- **Total iterations:** 10
- **Questions answered:** 9 / 9 tracked questions
- **Remaining questions:** 0 for this verification pass; the explicitly deferred corpus items are recorded as follow-up scope, not unanswered citation checks.
- **Last three iteration summaries:** run 8 — ECharts/MDN/W3C and T1/T10 audit (0.84); run 9 — WCAG, browser tooltip evidence, and colour-source authority (0.79); run 10 — final colour-authority, Observable Plot/ECharts supplements, and T1–T10/C1–C3 reconciliation (0.82).
- **Convergence threshold:** 0.05
- **Divergence summary:** no divergent pivot was required. The review deliberately broadened from cited URLs to uncited runtime claims and then to the shipped-corpus checklist before synthesis. The remaining frontier is T5, T8, T9, T10, and C1.
