# Iteration 7: Observable Plot text, stacking, transforms, and responsive text

**Run:** 7 of 10  
**Retrieved:** 2026-09-03  
**Baseline:** `research/lineages/deepseek-flash-max/research.md:82,104-107,212`

## Focus

Verify the remaining Observable Plot citations: direct-label guidance and text wrapping, stack semantics, the general transforms page, and discussion 2105's claim about responsive width and text sizing.

## Findings

### 1. Text marks and direct labelling

- **Verdict:** VERIFIED
- **Live URL:** https://observablehq.com/plot/marks/text `[SOURCE: https://observablehq.com/plot/marks/text]`
- **Resolves:** Yes; it redirects to https://observablehq.github.io/plot/marks/text, the official Plot documentation.
- **Documented version:** Observable Plot `0.6.17`.
- **Evidence:** The page describes the text mark as drawing text at x/y positions and says text is often used to label other marks. It recommends direct labelling as potentially faster and more accurate than reading an axis or tooltip. It warns that dense labels overlap, recommends filtering when there are too many, and states that Plot does not automatically label marks. Newlines create multiple lines; automatic wrapping through `lineWidth` is only an approximate heuristic, so explicit newlines are preferred when exact breaks matter.
- **Corpus verdict:** The corpus uses direct SVG text labels and an accessible data table, so the presentation principle is present. It does not use Plot's mark or wrapping runtime. T4's measured `getComputedTextLength()` spacing is present in the key forms, with a character-count fallback where layout measurement is unavailable; this is a bounded static equivalent, not Plot's automatic wrapping. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html:240-250; .opencode/skills/sk-doc/sk-create-chart/assets/templates/waterfall.html:210-220; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:163-167]`

### 2. Stack transform semantics

- **Verdict:** VERIFIED
- **Live URL:** https://observablehq.com/plot/transforms/stack `[SOURCE: https://observablehq.com/plot/transforms/stack]`
- **Resolves:** Yes; it redirects to https://observablehq.github.io/plot/transforms/stack, the official Plot documentation.
- **Documented version:** Observable Plot `0.6.17`.
- **Evidence:** The page says `stackY` and `stackX` convert y/x values into lower and upper positions, with the upper position of one value becoming the lower position of the next. It documents implicit `stackY` for `areaY`, `barY`, and `rectY` when no y1/y2 is supplied, and describes derived midpoint channels and input-order defaults.
- **Corpus verdict:** The stacked-area template explicitly maintains per-period floors, adds each typed series value, and constructs upper/lower polygon points before drawing each band. The contract names the stacked-area per-period total as one deliberate computed value (the other is the waterfall closing total). Thus the corpus matches the stack result needed by the chart, but computes auditable geometry locally rather than shipping a transform runtime. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html:205-219; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:89-106]`

### 3. General transforms documentation

- **Verdict:** VERIFIED
- **Live URL:** https://observablehq.github.io/plot/features/transforms `[SOURCE: https://observablehq.github.io/plot/features/transforms]`
- **Resolves:** Yes; this is the official Observable Plot documentation host.
- **Documented version:** Observable Plot `0.6.17`.
- **Evidence:** The page defines transforms as deriving data within the plot specification to put data into the required shape. It lists built-ins including bin, filter, group, normalize, select, sort, stack, and window; says transforms can be composed; and explicitly notes that transforms are optional because data can instead be aggregated and derived before being passed to a mark. It also documents implicit transforms such as `rectY` applying `stackY` when y is used.
- **Corpus verdict:** The corpus follows the documented no-runtime alternative: values are typed in one data block, and only geometry/presentation is derived in the script. Its contract permits only the named totals to be computed, while axis ceilings, tick ladders, and mark coordinates remain presentation calculations. This is a match to Plot's documented alternative, not evidence that the corpus implements Plot transforms. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:85-106]`

### 4. Discussion 2105 and responsive text

- **Verdict:** CORRECTED
- **Live URL:** https://github.com/observablehq/plot/discussions/2105 `[SOURCE: https://github.com/observablehq/plot/discussions/2105]`
- **Resolves:** Yes; it is the Observable Plot GitHub discussion “How to make the plot take full width of it's container?”.
- **Documented version:** The discussion is dated 2024-07-18 and does not declare a Plot package version.
- **What `research.md` said:** It attributed to the discussion “Plot's `ResizeObserver` + re-render” and said that Plot's maintainers “confirm even they have no static answer for responsive text.”
- **What the source says:** The question reports that a CSS `width: 100%` makes the plot fill the space but leaves text too large, and asks about responsive sizing. A Plot maintainer answers that the usual approach is to use `ResizeObserver` to observe a container's responsive width and re-render the plot, replacing the previous render; the discussion does not state that there is no static answer for text sizing.
- **Corrected wording:** “Observable Plot's maintainer recommends observing the container with `ResizeObserver` and re-rendering with the measured width; discussion 2105 is a maintainer recommendation for runtime responsive resizing, not evidence that no static responsive-text solution exists.”
- **Corpus verdict:** The pinned corpus deliberately uses static `viewBox`, `width:100%`, horizontal overflow, and a minimum SVG width; it has no observer or re-render runtime. The contract requires no remote resources/runtime fetch and requires a narrow-viewport floor, so the static strategy remains the compatible choice. C1 is still open for an actual phone-viewport render assertion even though the CSS guard is shipped. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-rows.html:45-52; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-172]`

## Assessment

Three Observable Plot citations support the baseline as stated. Discussion 2105 supports the runtime mechanism but not the broader negative claim about static responsive text, so that sentence must be narrowed. The corpus has the relevant static equivalents—direct labels, measured spacing, explicit stack geometry, and a scrollable minimum-width figure—but not Plot's runtime transforms or observer.

**New-information ratio:** 0.86  
**Answered:** Plot text/direct-labelling, stack, transforms, and discussion 2105 claims; corresponding static-corpus status.  
**Correction impact:** Replace the “no static answer” assertion with the narrower maintainer recommendation. Keep C1 as a verification gap and keep the no-runtime contract boundary.

## Reflection

- **What worked and why:** The official GitHub Pages documentation exposes the Plot version and the behavior paragraphs needed for text, transforms, and stacking.
- **What did not work and why:** Discussion pages are conversational evidence rather than versioned API documentation; the maintainer answer supports a recommended integration pattern, not every inference drawn from the question.
- **What I would do differently:** Separate direct maintainer statements from conclusions about what the library cannot do.

## Sources Consulted

- https://observablehq.com/plot/marks/text
- https://observablehq.github.io/plot/marks/text
- https://observablehq.com/plot/transforms/stack
- https://observablehq.github.io/plot/transforms/stack
- https://observablehq.github.io/plot/features/transforms
- https://github.com/observablehq/plot/discussions/2105

## Ruled Out

- **Treating discussion 2105 as a versioned API guarantee:** It has no package-version declaration and is a maintainer recommendation, so it cannot establish a universal default.
- **Adding a Plot transform or `ResizeObserver` runtime to the templates:** The shipped contract is a self-contained double-click HTML file with no remote dependency or runtime fetch; the static corpus already computes only auditable totals and drawing geometry.

## Questions Remaining

- Which ECharts accessibility, legend, dataset, and decal claims are still current?
- Do the SVG title and accessible-SVG sources support the claimed tooltip and accessible-name fallbacks?
- Which accessibility and colour-guidance citations are authoritative enough for normative recommendations?

## Recommended Next Focus

Verify ECharts dataset/legend/ARIA, the MDN SVG `title` page, and the W3C accessible-SVG draft.
