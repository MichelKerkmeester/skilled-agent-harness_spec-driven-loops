# Iteration 4: Vega-Lite versioned axis and scale behavior

**Run:** 4 of 10  
**Retrieved:** 2026-09-03  
**Baseline:** `research/lineages/deepseek-flash-max/research.md:67,99-100`

## Focus

Determine what the v1 and v4 URL paths actually document, whether they are suitable for current claims, and how `labelAngle`, `labelMaxLength`/`labelLimit`, `labelOverlap`, default axes, and default color schemes changed. Current pages are included as corroborating replacements; the baseline has three versioned citations.

## Findings

### 1. Vega-Lite v1 axis page

- **Verdict:** VERIFIED for a historical v1 claim; **CORRECTED** if read as current behavior.
- **Live URL:** https://vega.github.io/vega-lite-v1/docs/axis.html `[SOURCE: https://vega.github.io/vega-lite-v1/docs/axis.html]`
- **Resolves:** Yes; the page explicitly says “This website is for Vega-Lite v1.”
- **Documented version:** Vega-Lite v1.
- **Evidence:** It says axes are automatically created for encoded `x`, `y`, `row`, and `column` channels. It documents `labelAngle:-45` for time or ordinal axes, `labelMaxLength:25` by default, and “nice” quantitative tick values. This supports the baseline's historical statement that those were v1 defaults.
- **Correction boundary:** This versioned path is the right place for a historical v1 comparison, not for a current template recommendation. Current documentation uses `labelLimit` in pixels and a different default angle. Corrected wording: “Vega-Lite v1 documented `labelAngle:-45` for time/ordinal axes and `labelMaxLength:25`; these are historical defaults and must not be presented as current Vega-Lite defaults.”

### 2. Vega-Lite v4 axis page

- **Verdict:** VERIFIED
- **Live URL:** https://vega.github.io/vega-lite-v4/docs/axis.html `[SOURCE: https://vega.github.io/vega-lite-v4/docs/axis.html]`
- **Resolves:** Yes; the page explicitly says “This website is for Vega-Lite v4.”
- **Documented version:** Vega-Lite v4.
- **Evidence:** The page says encoded x/y fields automatically create axes. It documents `labelAngle:-90` for nominal and ordinal fields, `labelLimit:180` pixels, and `labelOverlap` strategies: `true`/`"parity"` removes every other label; `"greedy"` removes labels that overlap the last visible label; defaults are `true` for non-nominal non-log scales, `"greedy"` for log scales, and `false` otherwise. This directly supports the baseline's parity/greedy comparison.
- **Corpus verdict:** The pinned corpus manually applies fixed label thinning and edge retention, with no generic runtime overlap resolver. Representative code keeps every seventh daily label plus the first, every fourth stacked-area label plus the last, and selected calendar labels. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html:201-204; .opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html:233-237; .opencode/skills/sk-doc/sk-create-chart/assets/templates/calendar-grid.html:219-224]`

### 3. Vega-Lite v4 scale page

- **Verdict:** VERIFIED for the historical v4 scale/color claims.
- **Live URL:** https://vega.github.io/vega-lite-v4/docs/scale.html `[SOURCE: https://vega.github.io/vega-lite-v4/docs/scale.html]`
- **Resolves:** Yes; the page explicitly says “This website is for Vega-Lite v4.”
- **Documented version:** Vega-Lite v4.
- **Evidence:** The page says Vega-Lite automatically creates scales for position and mark-property channels. It documents default color ranges by field type: nominal uses the categorical range with `tableau10`, ordinal uses `blues`, and quantitative/temporal uses `viridis` for rect heatmaps and `blues` for other marks. It also documents that quantitative x/y scales include zero by default when unbinned and no custom domain is supplied. This supports the baseline's color-default comparison.
- **Corpus verdict:** No Vega-Lite scale is shipped or executed. The corpus uses a local declared palette and static SVG mapping, with local contrast and lightness checks; that is intentional and contract-compatible. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/color-system.md:1-12; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:157-160]`

### 4. Current Vega-Lite axis page (supplemental replacement)

- **Verdict:** VERIFIED as the current replacement source.
- **Live URL:** https://vega.github.io/vega-lite/docs/axis.html `[SOURCE: https://vega.github.io/vega-lite/docs/axis.html]`
- **Resolves:** Yes; official current documentation.
- **Documented version:** Current documentation aligned with the v6 schema used in the current spec page; no package semver is stated.
- **Evidence:** Current docs retain automatic x/y axes, but document `labelAngle:-90` for nominal/ordinal axes, `labelLimit:180` pixels, and the same parity/greedy overlap model. Current `labelOverlap` default is `true` for non-nominal non-log scales, `"greedy"` for log scales, and `false` otherwise. The current page is therefore the correct citation for present-day behavior.

### 5. Current Vega-Lite scale page (supplemental replacement)

- **Verdict:** VERIFIED as the current replacement source.
- **Live URL:** https://vega.github.io/vega-lite/docs/scale.html `[SOURCE: https://vega.github.io/vega-lite/docs/scale.html]`
- **Resolves:** Yes; official current documentation.
- **Documented version:** Current documentation aligned with the current v6 schema.
- **Evidence:** Current docs still describe automatic scale creation and the same field-type-based color range model (`tableau10` for nominal, `blues` for ordinal, `viridis` heatmap and `blues` ramp for quantitative/temporal). The current page confirms that the v4 color-default claim remains behaviorally aligned, but the versioned v4 path remains historical.

## Assessment

The versioned paths resolve and are valid when the claim is explicitly historical. The baseline needs a scope correction wherever it treats v1/v4 pages as current documentation. In particular, v1's `-45°`/`25` values must be labelled historical; current Vega-Lite uses `-90°` for nominal/ordinal labels and a pixel `labelLimit`. The baseline's v4 parity/greedy and color-default claims are supported and remain substantively current.

The shipped commit still lacks an automatic overlap engine, but its fixed thinning is an intentional static equivalent. It does not need to reproduce Vega-Lite's runtime behavior under the one-file contract.

**New-information ratio:** 0.91  
**Answered:** Version scope of v1/v4 URLs; historical and current label defaults; parity/greedy semantics; historical/current color defaults; corpus correspondence.  
**Correction impact:** Update the research wording to pin v1/v4 claims to their documented versions and replace any current-default inference with the current axis page.

## Reflection

- **What worked and why:** The versioned pages self-identify their release line and expose the exact default properties, while current pages provide a clean comparison.
- **What did not work and why:** A versioned URL alone does not signal whether a claim is historical in downstream prose; the baseline's general wording can blur that boundary.
- **What I would do differently:** Put the documented version in every citation row whenever a default is version-sensitive.

## Sources Consulted

- https://vega.github.io/vega-lite-v1/docs/axis.html
- https://vega.github.io/vega-lite-v4/docs/axis.html
- https://vega.github.io/vega-lite-v4/docs/scale.html
- https://vega.github.io/vega-lite/docs/axis.html
- https://vega.github.io/vega-lite/docs/scale.html

## Ruled Out

- **Using the v1 page as evidence for present-day defaults:** Its own banner limits it to v1.
- **Calling fixed thinning a parity/greedy implementation:** The corpus has explicit per-form index rules, not a general bounding-box resolver; it should be described as a static approximation with budgets.

## Questions Remaining

- Do Vega's schemes/config docs and the v5.11.0 release note support the color/accessibility assertions drawn from them?
- Do Plotly's axis options remain current and materially richer than the fixed corpus viewBox?

## Recommended Next Focus

Verify Vega's scheme list, description model, and ARIA release note, then check Plotly's tick-formatting and axis defaults.
