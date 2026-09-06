# Iteration 3: Current Vega-Lite specification, sizing, legends, formatting, and transforms

**Run:** 3 of 10  
**Retrieved:** 2026-09-03  
**Baseline:** `research/lineages/deepseek-flash-max/research.md:44,60-63,89-100`

## Focus

Verify the current Vega-Lite pages for the declarative mark/encoding model, automatically generated axes and legends, responsive width and autosize, legend defaults, formatting, and transform behavior. Check whether the shipped corpus has those capabilities or an intentional contract-compatible equivalent.

## Findings

### 1. Mark plus encoding and automatic guides

- **Verdict:** VERIFIED
- **Live URL:** https://vega.github.io/vega-lite/docs/spec.html `[SOURCE: https://vega.github.io/vega-lite/docs/spec.html]`
- **Resolves:** Yes; the official current Vega-Lite documentation page resolves.
- **Documented version:** The page's schema example is Vega-Lite `v6` (`https://vega.github.io/schema/vega-lite/v6.json`); the page does not state a package semver.
- **Evidence:** The page defines a single-view specification as a `mark` plus `encoding`, where encoding maps data values to mark properties, and says Vega-Lite automatically produces axes, legends, and scales when those properties are not explicitly specified. It lists the current mark vocabulary as `bar`, `circle`, `square`, `tick`, `line`, `area`, `point`, `rule`, `geoshape`, and `text`. It also lists `transform` as a common property.
- **Corpus verdict:** The templates do not contain Vega-Lite JSON or automatic guide generation. They hand-assemble SVG axes, labels, legends, and marks, which is a different implementation of a static chart. The contract requires one self-contained file and forbids runtime fetching, so importing Vega-Lite would not be a contract-compatible fix. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-163]`

### 2. Autosize and `width: "container"`

- **Verdict:** VERIFIED
- **Live URL:** https://vega.github.io/vega-lite/docs/size.html `[SOURCE: https://vega.github.io/vega-lite/docs/size.html]`
- **Resolves:** Yes; the official current size documentation resolves.
- **Documented version:** Current Vega-Lite documentation; the page describes the schema's `autosize` property and does not give a package semver.
- **Evidence:** The page says `width` and `height` normally size the data rectangle, while `autosize` controls overall visualization sizing. Setting `width` or `height` to `"container"` makes that dimension equal to the surrounding container; the container must have an externally determined size. It says Vega listens to `window.resize` for this responsive mode. `autosize` supports `pad`, `fit`, `fit-x`, `fit-y`, and `none`, with `pad` as the default and `resize:false` as the default object setting.
- **Corpus verdict:** The corpus implements static responsive width with `viewBox`, `width:100%`, a horizontally scrollable figure, and an SVG minimum width. This matches the no-runtime subset but does not observe container resize or calculate `fit` layouts. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-rows.html:31-49; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-167]`
- **Caveat:** The current `spec.html` and `size.html` pages disagree about the numeric default continuous width (the former shows `300`, while the size page's prose says `200`). That discrepancy is immaterial to the baseline's `width:"container"` claim, but numeric default-width claims should cite a schema/version-specific source rather than infer a universal value.

### 3. Automatic legends, default color legend type, and default orientation

- **Verdict:** VERIFIED
- **Live URL:** https://vega.github.io/vega-lite/docs/legend.html `[SOURCE: https://vega.github.io/vega-lite/docs/legend.html]`
- **Resolves:** Yes; the official current legend documentation resolves.
- **Documented version:** Current Vega-Lite documentation; the page is aligned with the current v6 schema shown elsewhere in the docs.
- **Evidence:** The page says legends are automatically created for field-encoded `color`, `opacity`, `size`, and `shape` channels. Non-binned quantitative and temporal color fields produce gradient legends; otherwise symbol legends are generated. The `orient` property lists the available placements and gives `"right"` as the default. The page also documents `labelOverlap`: `true` or `"parity"` removes every other label, while `"greedy"` removes labels that overlap the last visible label; its gradient-legend default is `true`. The legend has `aria:true` by default and automatically generates a description when one is not supplied for SVG output.
- **Corpus verdict:** The corpus has explicit in-figure swatch rows and text labels rather than auto-generated legend placement. Calendar and heat-matrix ramps use discrete swatches/text, not a Vega-Lite gradient legend; no runtime legend orientation or overlap algorithm is present. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/calendar-grid.html:180-197; .opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html:176-192]`

### 4. Number, time, axis, legend, text-mark, and tooltip formatting

- **Verdict:** VERIFIED
- **Live URL:** https://vega.github.io/vega-lite/docs/format.html `[SOURCE: https://vega.github.io/vega-lite/docs/format.html]`
- **Resolves:** Yes; the official current format documentation resolves.
- **Documented version:** Current Vega-Lite documentation; the page does not state a package semver.
- **Evidence:** `format` applies to text marks, tooltips, axis labels, legend labels, and headers. Number formats use D3 number-format patterns; time formats can be static D3 time-format strings or dynamic objects selected by date granularity. Defaults derive from the number/time format configuration, and `formatType` defaults to `time` for temporal/time-unit fields and `number` for quantitative and non-time-unit ordinal/nominal fields.
- **Corpus verdict:** All templates use local `fmt` helpers for displayed numbers; time labels are supplied display-ready and are not reparsed. This is deliberate contract behavior, not a missing Vega-Lite formatter. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html:112-130; .opencode/skills/sk-doc/sk-create-chart/references/catalog.md:78-95]`

### 5. Transform pipeline and field transforms

- **Verdict:** VERIFIED
- **Live URL:** https://vega.github.io/vega-lite/docs/transform.html `[SOURCE: https://vega.github.io/vega-lite/docs/transform.html]`
- **Resolves:** Yes; the official current transformation documentation resolves.
- **Documented version:** Current Vega-Lite documentation; the page does not state a package semver.
- **Evidence:** View-level transforms are an ordered array. Field transforms can include `bin`, `timeUnit`, `aggregate`, `sort`, and `stack`; view-level transforms run first, followed by those inline transforms in the documented order. The page lists aggregate, bin, calculate, filter, stack, time unit, window, and other transform types.
- **Corpus verdict:** The corpus intentionally does not transform or fetch data at render time. The catalog's data-shape requirements and the literal data block are the analysis boundary; the two documented computed-value exceptions are local, visible calculations. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:180-201; .opencode/skills/sk-doc/sk-create-chart/references/catalog.md:71-76]`

## Assessment

All five current-page claims are supported. Vega-Lite's declarative and runtime behaviors are real, but they are not a reason to add a dependency to this corpus. The shipped templates provide the static, inspectable equivalents required by the contract: explicit marks/guides, local formatting, display-ready time labels, and pre-shaped data. The only citation caution is the inconsistent numeric default-width prose across current docs; do not carry an unqualified default-width number forward.

**New-information ratio:** 0.86  
**Answered:** Current mark/encoding and auto-guide behavior; `width:"container"` and autosize; legend orientation, type, and overlap strategies; formatting scope; transform ordering.  
**Correction impact:** No template change. Keep the current no-runtime approach; qualify or omit numeric Vega-Lite default width claims.

## Reflection

- **What worked and why:** The official per-topic pages expose the behavior and the current schema context directly.
- **What did not work and why:** The current docs do not provide a single stable package-semver statement, and their numeric continuous-width prose is inconsistent.
- **What I would do differently:** Use schema-versioned docs or release metadata whenever a recommendation depends on a numeric default rather than a qualitative behavior.

## Sources Consulted

- https://vega.github.io/vega-lite/docs/spec.html
- https://vega.github.io/vega-lite/docs/size.html
- https://vega.github.io/vega-lite/docs/legend.html
- https://vega.github.io/vega-lite/docs/format.html
- https://vega.github.io/vega-lite/docs/transform.html

## Ruled Out

- **Adding Vega-Lite as a runtime dependency:** It would conflict with the contract's no-remote-resource/no-runtime-fetch rule and the double-click, no-build delivery model. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]`
- **Using an unqualified numeric default width:** The current pages expose conflicting values; it cannot support a stable corpus rule without a pinned schema/version.

## Questions Remaining

- Which versioned Vega-Lite axis and scale pages are historical versus suitable for current claims?
- Do Vega's schemes/configuration and the v5.11.0 ARIA release note support the baseline's accessibility and color assertions?

## Recommended Next Focus

Check Vega-Lite v1/v4 axis and scale pages against current axis behavior, then verify Vega schemes, the Vega config description model, and the v5.11.0 release note.
