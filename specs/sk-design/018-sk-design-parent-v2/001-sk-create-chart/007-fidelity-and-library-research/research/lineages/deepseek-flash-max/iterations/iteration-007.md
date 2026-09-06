# Iteration 7: Data-mark relationship — transforms, data shapes, missing data

## Focus

Q6: how Vega-Lite and Plot encode data→mark (encodings, transforms), what the corpus's zero-transform data-block contract means, and the missing-data follow-up to F2.4.

## Findings

### F7.1 — The corpus's zero-transform contract is the deliberate inverse of the libraries' transform machinery, and the catalog's "data shape" column is its transform language
Vega-Lite runs view-level transforms (`aggregate`, `bin`, `filter`, …) and inline encoding transforms (`bin`, `timeUnit`, `aggregate`, `sort`, `stack`) in a documented order [SOURCE: https://vega.github.io/vega-lite/docs/transform.html]. Plot: "Transforms derive data as part of the specification. This accelerates what is often the most onerous task in visualization: getting data into the right shape", with bin/group/stack/dodge/window/… as composable transforms [SOURCE: https://observablehq.github.io/plot/features/transforms]. The corpus's contract is the opposite: "It never fetches, never computes the numbers it is displaying" (template-contract.md:87) — the data block must already be in final shape. The catalog's `data shape` column (catalog.md:42-63: "Parts summing to 100", "2 series across 6 or fewer categories") is the corpus's transform language, expressed as *acceptance conditions* instead of *operations*. Both choices are right for their audience: the libraries serve analysis (data arrives raw), the corpus serves delivery (the approved numbers are the drawn numbers — a reader can audit the file's table against the source of truth without trusting a pipeline). Corpus is ahead for this mode. The cost is that a shape mismatch (12 categories pasted into bar-rows, which documents "8 or fewer", catalog.md:44) renders crowded-but-not-broken with no signal — see F7.5.

### F7.2 — Missing data: Plot breaks the line at null and Vega-Lite filters with a `valid` predicate; the corpus silently draws NaN paths
Plot: "If any of the x or y values are invalid (undefined, null, or NaN), the line will be interrupted, resulting in a break" [SOURCE: https://observablehq.com/plot/marks/line] (established in F2.4). Vega-Lite's supported aggregation ops include `valid` and its filter transform supports a `valid` field predicate [SOURCE: https://vega.github.io/vega-lite/docs/transform.html], i.e. missing values are a first-class input condition upstream. The corpus: daily-line joins every point (`points.join(' L')`, daily-line.html:136-138), daily-range draws every day (daily-range.html:136-141), and stacked-area accumulates `floors[i] += d.values[s]` (stacked-area.html:162) — a null anywhere produces "NaN" coordinates that browsers drop silently, and the check cannot see it (check-corpus.cjs:590-598 counts elements only). Template-level fix: filter null/NaN points in the path builders (a 3-line `.filter` per template) and render an em-dash in the table cell; the visual result then matches Plot's break behavior exactly — a gap in the line — which is the honest reading. This is applyable now, dependency-free, and deterministic.

### F7.3 — The corpus's two computed values (waterfall end, stacked-area total) are its documented exceptions to "never computes", and Plot's stack transform shows the same numbers are the hard part — the corpus's version is *more auditable*
waterfall.html:96-97 deliberately computes the end column from the steps ("so a step edited in the data block can never disagree with the total drawn beside it") and stacked-area.html:198-199 computes the Total column for the table. Plot's stack transform exists for the same reason — "stacking transforms a length into lower and upper positions… the upper position of each element equals the lower position of the next" [SOURCE: https://observablehq.com/plot/transforms/stack] — but hides it inside the pipeline. The corpus's running-total is the static, line-by-line equivalent, and because the computed column sits in the visible data table beside the typed values, a reader can verify it by hand. This is a where-it-is-ahead result: the corpus's single computed-value discipline (two values in twenty forms, each with a comment stating why) is exactly the right scope for "the numbers, and nothing else" (template-contract.md:85-87). No change; the discipline should be *named* in the contract as the allowed exception (contract-level wording candidate, needs a decision).

### F7.4 — Plot's bin-transform "one-pixel gap between adjacent rects" default is the same touching-marks problem the corpus solves with surface-colour separators; outcomes equivalent, corpus mechanism already documented
Plot's bin transform "sets default insets for a one-pixel gap between adjacent rects" [SOURCE: https://observablehq.github.io/plot/features/transforms]. The corpus separates touching shapes with a stroke in the surface role: "Shapes that touch are separated by a stroke in surface… with the separator, every mark is read against the ground rather than against its neighbour" (color-system.md:77-78), implemented as `.seg { stroke: var(--chart-surface); stroke-width: 3 }` (stacked-bars.html:58) and `.cell { stroke: var(--chart-surface); stroke-width: 3 }` (treemap.html:59). Plot's inset creates a physical gap; the corpus's stroke creates an optical one — both prevent adjacent marks sharing an edge. The corpus's variant is the right one for its colour-gate design (a gap would show the surface through, which is equivalent, but the stroke is what the gate commentary documents, color-system.md:77). No change.

### F7.5 — The one genuine data-mark gap is *shape enforcement*: nothing stops a delivered data block from violating its form's documented shape
ECharts' dataset exists partly "to avoid users from converting for data format" [SOURCE: https://echarts.apache.org/handbook/en/concepts/dataset/] — upstream bends the format to the user; the corpus bends the user to the format and documents it only in the catalog (catalog.md:42-63) and in template comments (e.g. bar-rows.html:94-95, stacked-bars.html:95-96). A delivered file whose data exceeds a ceiling (9 categories in bar-rows, 6 segments in stacked-bars, catalog.md:44,50) renders a crowded but technically valid chart, and the corpus check stays green (check-corpus.cjs never parses data values). Template-level candidate (applyable now): a 4-line shape guard at the top of each render script that `console.warn`s on ceiling violation (deterministic, invisible to non-developers, catches nothing visually but surfaces the issue in the one channel a developer editing the file will see). Contract-level candidate (needs a decision): a visible "exceeds this form's shape" notice in the figure, or a check-corpus data-shape assertion. The console-warn step is the minimal honest bridge and does not change any rule.

## Sources Consulted

- [SOURCE: https://vega.github.io/vega-lite/docs/transform.html] Vega-Lite transforms (aggregate/bin/filter, `valid`)
- [SOURCE: https://observablehq.github.io/plot/features/transforms] Plot transforms overview
- [SOURCE: https://observablehq.com/plot/transforms/stack] Plot stack transform
- [SOURCE: https://echarts.apache.org/handbook/en/concepts/dataset/] ECharts dataset (2D arrays)
- Corpus: template-contract.md, catalog.md, daily-line.html, daily-range.html, stacked-area.html, waterfall.html, stacked-bars.html, treemap.html, check-corpus.cjs, color-system.md

## Assessment

- **newInfoRatio**: 0.7 — transforms/stack mechanics are new; shape-enforcement gap and the auditable-computed-values result are new.
- **Novelty justification**: F7.1-F7.4 consolidate prior corpus facts against fresh upstream citations; F7.2/F7.5 are new actionable gaps.
- **Confidence**: High.

## Reflection

- **What worked**: Reading the corpus's two computed-value exceptions as deliberate and naming them as the audit-friendly scope of "never computes".
- **What failed / ruled out**: Looking for an upstream data-shape validation feature — none exists (upstream bends formats to users); ruled out ECharts-style 2D-array datasets (would weaken the per-form expressive shapes).
- **Ruled-out directions**: ECharts-style generic dataset formats; adding Vega-Lite/Plot transform pipelines (contract: no computing in the data path, template-contract.md:87).

## Recommended Next Focus

Iteration 8: Number and date formatting (Q7) — d3-format/Plotly tickformat/Intl conventions, the corpus's `String(value)` everywhere, and a concrete per-template `fmt` helper design that survives the single-file contract.
