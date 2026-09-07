# Iteration 1: Catalog Delta and Form Classification

## What was read

- The frozen shared helper, including `ChartConfig`, `ChartContainer`, and the tooltip/legend aliases and props: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:14-23]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:41-80]`, and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:116-145]`.
- All 70 frozen shadcn chart filenames and their family descriptions, grouped below by family.
- The standalone question-first catalog, its form aliases, and its explicit radar and pie substitutions: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:22-38]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:44-69]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:128-160]`.

## What was measured

The local file inventory counted 70 examples: area 10, bar 10, line 10, pie 11, radar 14, radial 6, and tooltip 9. The family list below accounts for every file. Nine tooltip examples are the same stacked bar geometry with tooltip-focused knobs; the shared helper exposes tooltip content as a separate concern rather than a chart geometry: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:116-145]`.

| Frozen family and all entries | Distinct reader-question forms | Standalone answer |
|---|---|---|
| Area: `axes`, `default`, `gradient`, `icons`, `interactive`, `legend`, `linear`, `stacked-expand`, `stacked`, `step` | Continuous area trend; stacked area composition; step area for discrete changes | `stacked-area` answers composition. There is no separately catalogued single-series area-trend or step-area template. |
| Bar: `active`, `default`, `horizontal`, `interactive`, `label-custom`, `label`, `mixed`, `multiple`, `negative`, `stacked` | Vertical categorical comparison; horizontal categorical comparison; grouped/multiple series; stacked composition; negative/diverging values | `bar-columns`, `bar-rows`, `grouped-bars`, and `stacked-bars` answer the first four. No dedicated negative/diverging form is catalogued. |
| Line: `default`, `dots-colors`, `dots-custom`, `dots`, `interactive`, `label-custom`, `label`, `linear`, `multiple`, `step` | Single-series trend; multi-series comparison; linear versus smoothed interpolation; step series | `daily-line` answers the basic trend. The catalog has no dedicated multi-series-line or step-series form. |
| Pie: `donut-active`, `donut-text`, `donut`, `interactive`, `label-custom`, `label-list`, `label`, `legend`, `separator-none`, `simple`, `stacked` | Part-to-whole arc; donut part-to-whole; stacked multi-ring/arc composition | `unit-grid` and `unit-ring` answer countable composition without arc geometry; they are an explicit substitution. |
| Radar: `default`, `dots`, `grid-circle-fill`, `grid-circle-no-lines`, `grid-circle`, `grid-custom`, `grid-fill`, `grid-none`, `icons`, `label-custom`, `legend`, `lines-only`, `multiple`, `radius` | Multi-dimensional comparison on a common radial scale | `parallel-axes` answers the comparison question with a more inspectable axis layout; radar is an explicit omission. |
| Radial: `grid`, `label`, `shape`, `simple`, `stacked`, `text` | Single radial progress; stacked radial composition | `progress-single` answers the single target; `unit-ring` is the countable-composition substitute. No exact stacked radial bar is catalogued. |
| Tooltip: `advanced`, `default`, `formatter`, `icons`, `indicator-line`, `indicator-none`, `label-custom`, `label-formatter`, `label-none` | No new geometry; tooltip presentation and semantic-label variants | Treat as a cross-form interaction contract, not nine additional forms. |

## Findings

1. **OBSERVED, high confidence:** The 70-file count substantially overstates form diversity. Area, bar, line, pie, radar, and radial families contain geometry alternatives mixed with labels, dots, grid styles, icons, legends, active states, and interpolation choices. The tooltip family is explicitly support machinery: the shared component accepts `indicator`, `hideLabel`, `hideIndicator`, formatters, and key aliases without selecting a geometry: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:118-145]`. The corpus should compare reader questions, not example count.

2. **OBSERVED, high confidence:** The standalone catalog is stronger at preserving the reader-question boundary. It maps a form in both directions, gives each template a primary question, and records data ceilings: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:34-38]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:44-82]`. That makes `bar-columns`, `bar-rows`, `grouped-bars`, `stacked-bars`, `stacked-area`, `daily-line`, and `bar-line-composed` comparable to shadcn forms by use rather than by styling.

3. **DERIVED, high confidence:** Radar is not a real coverage hole for the corpus’s stated goals. The catalog explicitly rejects radar and sankey because radial one-scale normalization, mixed units, and polygon area/order can mislead; `parallel-axes` is the named substitute: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:143-160]`. Adopting shadcn’s radar family wholesale would import a geometry the local contract has already ruled out, not repair an accidental omission.

4. **DERIVED, high confidence:** Pie and donut are also a deliberate design choice, not a missing implementation. The catalog calls `unit-grid` and `unit-ring` the substitutes for countable shares and states the arc-form tradeoff: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:128-137]`. Shadcn’s eleven pie entries therefore supply styling and labeling options, but no evidence that arc geometry is more truthful for this corpus.

5. **INFERRED, medium confidence:** The highest-risk actual form gaps, if future reader questions require them, are a generic single-series area trend, a dedicated multi-series line comparison, a discrete step series, and a negative/diverging bar. They are not justified merely by shadcn’s variant count. The current catalog already covers more specialized standalone questions, including mixed count/rate comparison and range-oriented views: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:44-69]`. Confirming any gap would require a product question and a new corpus entry, not a restyle pass.

## Recommendations

1. **[implementable today]** Keep the question-first catalog as the comparison authority and classify shadcn’s tooltip, label, icon, grid, dot, legend, gradient, and active examples as variants or support contracts.
2. **[implementable today]** Preserve the radar omission and document `parallel-axes` as the adopted answer for inspectable multi-dimensional comparison.
3. **[implementable today]** Preserve `unit-grid` and `unit-ring` as the adopted part-to-whole answers for countable marks; do not adopt pie/donut arcs solely because shadcn has many examples.
4. **[needs a corpus change]** Add a form only if a reader-question gap is confirmed: candidate gaps are multi-series line, discrete step, negative/diverging bar, or single-series area trend. The 70-file count alone is insufficient evidence.

## What this iteration could not settle

It did not test whether every candidate gap is needed by the standalone product, and it did not assess data/config retargetability or runtime interaction behavior. Those are the next angles.

## Assessment

- New-information ratio: **0.92**.
- Novelty: high; the key reduction is 70 examples to a smaller reader-question set plus explicit substitutions.
- Confidence: high for the classification and radar/pie decisions; medium for candidate gaps because product demand was not part of the frozen corpus.
- Convergence telemetry: continue. The configured max-iterations policy keeps this as a first-angle result even if later ratios are low.

## Reflection

The useful unit of comparison is a reader question with a data-shape ceiling. The main trap is treating shadcn’s polished variants as independent forms. The next pass should count the edit sites behind one semantic data retarget, not count configuration props in isolation.

## Recommended Next Focus

Iteration 2: adjustability and the number of edit sites needed to retarget a chart while preserving the current checker contract.
