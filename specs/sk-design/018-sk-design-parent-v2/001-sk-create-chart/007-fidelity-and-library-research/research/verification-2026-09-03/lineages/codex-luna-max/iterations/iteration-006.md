# Iteration 6: Observable Plot marks, layout, invalid values, tips, and legends

**Run:** 6 of 10  
**Retrieved:** 2026-09-03  
**Baseline:** `research/lineages/deepseek-flash-max/research.md:46,82,89,104-107`

## Focus

Verify the first five Observable Plot citations: marks as the visual vocabulary, the default width and max-width behavior, margin treatment for long labels, line breaks at invalid values, pointer/tip interaction, and `legend:true` with ramp legends.

## Findings

### 1. Marks as the visual vocabulary

- **Verdict:** VERIFIED
- **Live URL:** https://observablehq.com/plot/features/marks `[SOURCE: https://observablehq.com/plot/features/marks]`
- **Resolves:** Yes; it redirects to the official project documentation at https://observablehq.github.io/plot/features/marks, not an unrelated site.
- **Documented version:** The page identifies Observable Plot `0.6.17`.
- **Evidence:** The page explicitly says Plot has no chart types and that charts are constructed by layering marks. It calls marks the “visual vocabulary” and gives the geometric distinctions: `barX` for horizontal bars, `barY` for vertical bars, and `cell`/`rect` for different data shapes. It also says Plot automatically creates axes and legends to document scale encodings.
- **Corpus verdict:** The corpus is hand-authored SVG rather than a mark runtime, but its catalog still encodes data-shape decisions and the templates use explicit mark geometry. This is a conceptual match, not an imported Plot API. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/catalog.md:42-63,99-110; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-163]`

### 2. Default width 640, responsive max-width, and margins

- **Verdict:** VERIFIED
- **Live URL:** https://observablehq.com/plot/features/plots `[SOURCE: https://observablehq.com/plot/features/plots]`
- **Resolves:** Yes; it redirects to https://observablehq.github.io/plot/features/plots, the official Plot docs.
- **Documented version:** Observable Plot `0.6.17`.
- **Evidence:** The page states that the default width is `640`, that Observable's standard width can make plots responsive, and that the returned plot has `max-width:100%`. It says default margins depend on the maximum margins of constituent marks and explicitly warns that Plot does not automatically enlarge margins for long tick labels; the author must increase `marginLeft` or format labels more compactly.
- **Corpus verdict:** The pinned templates use a static SVG `viewBox`, CSS width behavior, and horizontal overflow/minimum-width guards; they do not have Plot's JavaScript layout calculation or automatic responsive re-render. The long-label strategy is bounded input plus explicit local positioning, not automatic margin fitting. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-rows.html:31-49; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-172]`

### 3. Invalid values interrupt lines

- **Verdict:** VERIFIED
- **Live URL:** https://observablehq.com/plot/marks/line `[SOURCE: https://observablehq.com/plot/marks/line]`
- **Resolves:** Yes; it redirects to https://observablehq.github.io/plot/marks/line, the official Plot docs.
- **Documented version:** Observable Plot `0.6.17`.
- **Evidence:** The line-mark page says that if x or y is `undefined`, `null`, or `NaN`, the line is interrupted and the break divides the line into multiple segments. It separately warns that filtering invalid data is not equivalent because filtering can interpolate between the remaining points.
- **Corpus verdict:** The pinned commit closed T3 for the applicable daily-line, daily-range, and stacked-area path builders by filtering non-finite values and showing an in-figure notice. This matches the observable visual outcome for missing readings while keeping the data block and drawing code local. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html:145-154; .opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-range.html:145-155; .opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html:183-192]`

### 4. `tip:true` and the pointer transform

- **Verdict:** VERIFIED
- **Live URL:** https://observablehq.com/plot/features/interactions `[SOURCE: https://observablehq.com/plot/features/interactions]`
- **Resolves:** Yes; it redirects to https://observablehq.github.io/plot/features/interactions, the official Plot docs.
- **Documented version:** Observable Plot `0.6.17`.
- **Evidence:** The page says the pointer transform dynamically filters to the datum closest to the pointer and is often paired with the tip mark for interactive tooltips. Its example uses `tip:true`. The marks documentation further says a truthy `tip` option derives a tip mark with the pointer transform, places it above other marks, and offers details on demand.
- **Corpus verdict:** No pointer or hover runtime exists in the shipped templates. The static fallback is the visible chart, native SVG titles where T1 applies, and the required data table. Adding Plot's interaction runtime would violate the corpus's no-remote/no-build delivery boundary. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-164; .opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html:139-146,187-190]`

### 5. `legend:true`, swatches, and ramp legends

- **Verdict:** VERIFIED
- **Live URL:** https://observablehq.com/plot/features/legends `[SOURCE: https://observablehq.com/plot/features/legends]`
- **Resolves:** Yes; it redirects to https://observablehq.github.io/plot/features/legends, the official Plot docs.
- **Documented version:** Observable Plot `0.6.17`.
- **Evidence:** The page says Plot can generate legends for color, opacity, and symbol scales. `color:{legend:true}` produces a legend; ordinal color uses swatches, while a continuous color scale generates a ramp with a smooth gradient. It also says redundant color and symbol legends can improve accessibility for readers with color-vision deficiency.
- **Corpus verdict:** The corpus has explicit swatch rows and accessible text labels. T8 is only partial at the pinned commit: the discrete stepped ramp/text treatment is present, but the exact requested SVG `<linearGradient>` ramp is absent. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/calendar-grid.html:180-197; .opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html:176-192]`

## Assessment

All five Observable Plot citations resolve to the official Plot documentation (with a consistent redirect from `observablehq.com` to `observablehq.github.io`) and document Plot `0.6.17`. The baseline is accurate on the mark vocabulary, 640px default width, max-width, non-auto-adjusted long-label margins, invalid-value line breaks, pointer/tip semantics, and swatch/ramp legends. The shipped corpus matches the static layout and missing-value outcomes, has no interaction runtime by design, and still lacks the exact gradient-bar form named by T8.

**New-information ratio:** 0.9  
**Answered:** Observable Plot marks/layout/invalid-value/tip/legend claims and the corresponding shipped-template status.  
**Correction impact:** Keep the no-runtime contract; rank the missing SVG gradient as a real but lower-priority presentation gap, separate from the already-closed T3 behavior.

## Reflection

- **What worked and why:** The current Plot docs expose version, defaults, warnings, and examples together, making behavior easy to check.
- **What did not work and why:** The old `observablehq.com` host is a redirect target rather than the final documentation host, so the final URL must be recorded too.
- **What I would do differently:** Record both the user-facing URL and the resolved official host whenever a documentation site has moved.

## Sources Consulted

- https://observablehq.com/plot/features/marks
- https://observablehq.com/plot/features/plots
- https://observablehq.com/plot/marks/line
- https://observablehq.com/plot/features/interactions
- https://observablehq.com/plot/features/legends
- https://observablehq.github.io/plot/features/marks
- https://observablehq.github.io/plot/features/plots
- https://observablehq.github.io/plot/marks/line
- https://observablehq.github.io/plot/features/interactions
- https://observablehq.github.io/plot/features/legends

## Ruled Out

- **Copying Plot's runtime pointer/tip implementation:** It is not needed for a double-click, static HTML artifact and would introduce runtime/dependency surface forbidden by the contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]`
- **Calling Plot's swatch/ramp legend behavior a shipped dependency:** The corpus has local SVG/text legend code and no Plot bundle.

## Questions Remaining

- Does the Plot text-mark page support direct-label guidance and measured positioning?
- Does the Plot stack page and the old `observablehq.github.io/plot/features/transforms` URL support the transform comparison?
- What does discussion 2105 actually say about responsive text?

## Recommended Next Focus

Check text marks, stack/transforms, and discussion 2105 in the next iteration.
