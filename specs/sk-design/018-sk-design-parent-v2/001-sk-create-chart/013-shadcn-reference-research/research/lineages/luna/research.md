# Shadcn Reference Research

This record is append-only within the `luna` fan-out lineage. Findings are based on the frozen local corpus and local standalone corpus.

## Iteration 1 — Catalog Delta and Form Classification

The 70 frozen shadcn files are not 70 distinct forms. The complete family inventory is area (10), bar (10), line (10), pie (11), radar (14), radial (6), and tooltip (9). The tooltip family is support machinery around a stacked bar, not nine geometries: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:116-145]`.

The standalone corpus is better at making the reader-question boundary explicit. Its catalog maps each form in both directions and records data ceilings: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:34-38]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:44-82]`. It answers vertical and horizontal comparison, grouped and stacked composition, continuous trend, mixed count/rate comparison, and countable composition through `bar-columns`, `bar-rows`, `grouped-bars`, `stacked-bars`, `daily-line`, `bar-line-composed`, `unit-grid`, and `unit-ring`.

Radar is a deliberate omission, not a gap to fill. The catalog rejects radial one-scale normalization, mixed-unit comparison, and polygon area/order effects, and names `parallel-axes` as the substitute: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:143-160]`. Pie and donut are likewise deliberate arc omissions in favor of countable marks: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:128-137]`.

Ranked decisions:

1. `[implementable today]` Compare reader questions, not shadcn’s 70-file count.
2. `[implementable today]` Keep radar out and retain `parallel-axes` as the adopted multi-dimensional answer.
3. `[implementable today]` Keep `unit-grid` and `unit-ring` as the countable-share answers.
4. `[needs a corpus change]` Consider a new form only when a product question confirms a generic area trend, multi-series line, step series, or negative/diverging bar gap.

## Iteration 2 — Adjustability and Edit-Site Count

All 26 standalone templates have exactly one `CHART_DATA` block and no literal `null` in that block. `bar-columns` explicitly says to replace the data block and nothing else: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:155-177]`. For a schema-preserving retarget, that is one intended edit site.

The representative shadcn chart declares `chartData` and `chartConfig` separately: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-tooltip-default.tsx:24-42]`. `ChartConfig` centralizes labels, icons, and theme colors, and `ChartStyle` emits `--color-<key>` variables, but the data remains separate: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:14-23]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:83-110]`. A key or series change therefore has at least two surfaces.

The one-block property stops being one-point when the semantic story changes. `stacked-area` keeps `SERIES` and `DATA` together, but its heading, description, title, table caption, tooltip/readout, and capacity assumptions are outside the data receipt: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:183-234]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:294-312]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:425-461]`. The measured minimum is four semantic surfaces, plus palette/capacity when those change.

The current checker intentionally guards structure rather than meaning: one data block, no clocks/randomness, palette-only literals, and contiguous same-index series mapping are all enforced: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:566-642]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:776-789]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:852-865]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1412-1490]`.

Ranked decisions:

1. `[implementable today]` Promise one adjustment point only for schema-preserving replacement of `CHART_DATA`.
2. `[implementable today]` Keep the single-source palette and inspect semantic surfaces when a multi-series story changes.
3. `[needs a corpus change]` Add a manifest and semantic-consistency assertion only if arbitrary schema-changing retargets become a real requirement.

## Iteration 3 — Hover, Tooltip, Pointer, and Keyboard Contract

Shadcn's shared tooltip exposes local knobs for indicator style, hidden labels/indicators, label and value formatters, and key aliases: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:118-165]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:214-260]`. Those are useful per-chart semantic controls, not a reason to force one global tooltip presentation.

`accessibilityLayer` appears in 38 of 70 frozen files: area 9/10, bar 10/10, line 10/10, tooltip 9/9, and zero pie, radar, or radial files. The interactive area example lacks the prop, while polar examples omit it: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-interactive.tsx:184-194]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-pie-simple.tsx:69-75]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-radar-default.tsx:53-62]`.

The standalone corpus makes the static floor explicit: role, label, and `data-chart-table` for every chart; a tooltip/pointer register for interactive forms; and an inert rationale for forms that do not need hover: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:809-839]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:431-503]`. `stacked-area` also exposes focusable legend controls, Enter/Space handlers, and bounded direct-or-nearest pointer reach: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:491-499]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:605-718]`.

The browser inventory was empty, so no actual keyboard or pointer walk was run. Source handlers prove only that handlers are present. They do not prove tab order, focus visibility, activation, hit testing, tooltip placement, or live state.

Ranked decisions:

1. `[implementable today]` Keep the standalone table/card-readout floor and explicit inert-versus-tooltip register.
2. `[implementable today]` Adopt semantic formatter and key-alias ideas locally where a template needs them; keep indicator/hide choices per form.
3. `[implementable today]` Treat `accessibilityLayer` as a useful cartesian implementation detail, not as a corpus-wide contract.
4. `[needs a corpus change]` Add a browser-backed keyboard/pointer gate and a static `keyboard-contract` assertion before claiming runtime parity.

## Iteration 4 — Measured Color Comparison

The local comparison parsed the frozen shadcn light/dark OKLCH tokens, converted to sRGB, then measured WCAG contrast on each set's own and opposite ground, adjacent OKLCH hue gap, and adjacent-pair OKLab separation after severity-1 protan, deutan, and tritan simulations. The shadcn source values are local and frozen: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:54-79]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:102-126]`.

| System | Min adjacent hue gap | Min contrast own / opposite ground | Min CVD deltaE P / D / T |
|---|---:|---:|---:|
| Shadcn light | 16.0° | 1.72 / 2.18 | 0.079 / 0.058 / 0.077 |
| Shadcn dark | 71.1° | 2.92 / 2.15 | 0.084 / 0.145 / 0.183 |
| Standalone categorical light | 92.9° | 3.37 / 1.72 | 0.126 / 0.062 / 0.148 |
| Standalone categorical dark | 96.5° | 3.38 / 1.72 | 0.161 / 0.153 / 0.221 |

The standalone neutral system is intentionally non-hued, and the ordered system is intentionally one hue: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:126-166]`. Their small hue gaps are not categorical failures. The standalone palette also has explicit light/dark grounds and numeric gates for text, marks, ramp steps, and emphasis: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-23]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58-96]`.

The result is to adopt shadcn-style source-token indirection, not the raw five-token ramp. The standalone role split is more useful for this corpus, and the current checker enforces palette source/literal consistency and existing contrast gates but not CVD or hue thresholds: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:229-247]`.

Ranked decisions:

1. `[implementable today]` Keep neutral, ordered, and categorical roles with explicit light/dark values.
2. `[implementable today]` Keep existing contrast, ramp-step, emphasis, and source-equality gates.
3. `[implementable today]` Adopt token indirection as the shadcn idea worth carrying over.
4. `[needs a corpus change]` Consider a CVD/hue assertion only after agreeing on a model and threshold.

## Iteration 5 — Data Accuracy and Geometry Defaults

The frozen 70-file scan found 22 `type="natural"`, 3 `type="monotone"`, 2 `type="linear"`, and 2 `type="step"` props; 18 `stackId` occurrences; one `stackOffset="expand"`; zero `domain`, `baseValue`, or `connectNulls` props; and one `tickCount`. No data array contains an explicit null. The negative-bar data is present without explicit domain/base props: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-bar-negative.tsx:23-60]`.

Natural interpolation is the concrete risk to carry forward. `chart-area-default` uses discrete observations with `type="natural"`: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-default.tsx:23-30]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-default.tsx:70-76]`. A smooth curve can show an apparent between-point extremum that is not an observation; a rendered overshoot was not claimed because no browser was available.

Shadcn's transferable decision is to expose explicit linear, step, monotone, and normalized-stack variants: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-linear.tsx:66-74]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-step.tsx:66-75]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-line-interactive.tsx:211-220]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-stacked-expand.tsx:66-102]`. The standalone corpus already exposes baseline, peak, ticks, mixed-unit dual scales, finite runs, and direct paths: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:370-431]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:379-461]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:386-451]`.

Ranked decisions:

1. `[implementable today]` Use linear/direct paths for measured trends, step only for discrete state, and natural/monotone only after semantic review.
2. `[implementable today]` Keep finite-run gaps, explicit scale/tick calculations, and mixed-unit dual-scale logic; these are already better aligned with honest standalone readouts.
3. `[implementable today]` Treat domain, zero baseline, stacking order, and tick density as per-template review decisions.
4. `[needs a corpus change]` Add a curve/data-accuracy assertion only if semantic metadata can identify gap-sensitive forms.

## Iteration 6 — Checker-Enforceable Findings and Judgement Boundaries

The static baseline was `RESULT: PASSED`: 35 files scanned, 26 chart forms, 0 errors. The relevant current assertion/error map is:

| Assertion | Current error boundary |
|---|---|
| `catalog` | Missing sentinels, duplicate IDs, missing/nonexistent files, row/file identity mismatch, or an on-disk form with no row. |
| `catalog-system` | Missing/unknown system or row/system disagreement. |
| `data-block` | Anything other than exactly one `CHART_DATA` sentinel pair, or an end marker before its begin marker. |
| `script-parses`, `determinism` | Inline script compile failure, `Math.random()`, or current time reaching rendering code. |
| `palette-source`, `palette-source-dark` | Missing roles, below-gate text/mark/emphasis contrast, capacity/order/ramp-step failures, or invalid dark rule alpha. |
| `palette-block`, `colour-literals` | Palette sentinel/source drift or raw hex/rgb/hsl/named/non-token paint outside the palette block. |
| `series-mapping`, `gradient-sweep` | Wrong indexed token, missing rung, over-capacity ladder, `CAPACITY` mismatch, or a non-ordered gradient between series values. |
| `accessibility`, `card-parts`, `empty-notice`, `number-format` | Missing image role/label/table, wrong fixed card parts, malformed/non-stopping empty guard, locale formatter, or tooltip without local `fmt()`. |
| `interaction-hygiene`, `interaction-state`, `pointer-contract-coverage` | Inert/active conflict, inert without reason, missing focus hygiene, unconditional outline removal or text-selection lock, pre-open state, or missing/stale pointer-contract row. |
| `card-readout`, `pointer-reach` | Browser-dependent missing card/table values, wrong mark, dead near-mark sample, or incomplete driver result. |
| `geometry-block`, `radius`, `type-scale` | Missing/drifting shared geometry record, radius outside the published ladder, or text size outside published rungs. |

The current checker therefore enforces the mechanical parts of the six-angle conclusion. It does not decide whether radar is the right form, whether a tooltip indicator is warranted, whether a domain or curve is semantically honest, or whether a CVD/hue result crosses a policy threshold: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:220-363]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:457-642]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:776-865]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:809-839]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1129-1238]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1412-1490]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1492-1592]`.

Four new assertion families would require a corpus change: `keyboard-contract`, `palette-cvd`/`palette-hue`, metadata-driven `curve-contract`/`data-accuracy`, and `retargetability`. The render-dependent checks also require a browser for proof: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1713-1912]`.

Ranked decisions:

1. `[implementable today]` Use the current checker as the hard static gate for structure, palette/index consistency, catalog identity, accessible table fallback, static interaction hygiene, deterministic numbers, and pointer-contract coverage.
2. `[implementable today]` Leave form substitutions, tooltip indicator choices, domains, baselines, tick budgets, stacking order, interpolation intent, and semantic formatter choice to per-template judgement.
3. `[implementable today]` Report browser-dependent card/pointer/keyboard behavior as unknown when no browser exists.
4. `[needs a corpus change]` Add keyboard, CVD/hue, data-accuracy, and retargetability contracts only with the metadata and policy that make their failures meaningful.

## Final Synthesis

### Executive Decision

Adopt three shadcn decisions selectively: semantic token indirection and per-key colors; local tooltip knobs for real semantic needs; and explicit linear, step, monotone, or normalized-composition variants when the data meaning requires them. Do not adopt the raw five-token ramp, natural interpolation as the measured-data default, or `accessibilityLayer` as the sole corpus accessibility contract.

Retain the standalone decisions that are already better for this deliverable: question-first cataloging, deliberate radar and arc-pie omissions, role-specific palettes with numeric gates, direct paths with explicit gap handling, visible scale/tick decisions, a table fallback, and explicit inert-versus-tooltip behavior. Evidence for the catalog substitutions is `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:128-160]`; evidence for direct paths and gaps is `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:370-431]` and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:379-461]`.

### Ranked Recommendations

1. **[implementable today]** Keep the question-first form boundary, `parallel-axes` radar substitution, and `unit-grid`/`unit-ring` countable-share substitution: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:34-82]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:128-160]`.
2. **[implementable today]** Keep one `CHART_DATA` edit point for schema-preserving retargets, and treat changed schema, units, prose, or reader question as template selection: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:142-175]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:155-177]`.
3. **[implementable today]** Adopt shadcn token indirection and local formatter/key-alias ideas, but retain the standalone palette roles and gates: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:14-23]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:118-165]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58-96]`.
4. **[implementable today]** Use direct/linear paths for measured trends, step for discrete states, and natural/monotone only after semantic review. Keep explicit finite-run gaps and scale/tick calculations: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-linear.tsx:66-74]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-step.tsx:66-75]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:370-431]`.
5. **[implementable today]** Keep the role/label/table floor and per-form inert-versus-tooltip contract. Shadcn's accessibility layer is partial at 38/70, while the standalone static floor is corpus-wide: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:809-839]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:431-503]`.
6. **[needs a corpus change]** Add browser-backed keyboard/pointer proof, CVD/hue policy checks, metadata-driven data-accuracy checks, or a retargetability manifest only when the corresponding release requirement and policy exist.

### Evidence and Boundaries

The static checker baseline passed with 35 files scanned, 26 chart forms, 0 errors, and `RESULT: PASSED`. It can enforce catalog identity/system agreement, one data receipt, deterministic source, palette/source/literal/index consistency, accessible role/label/table markup, static interaction hygiene/state, number formatting, pointer-contract coverage, empty notices, and browser-dependent card/pointer checks when a browser exists. It cannot choose a reader-question form, tooltip indicator, domain, baseline, tick budget, stacking order, interpolation intent, CVD threshold, or prose/unit meaning: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1492-1592]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1713-1912]`.

The measured color comparison found shadcn light at 16.0° minimum hue gap, 1.72:1 own-ground contrast, and 0.058 minimum simulated deutan separation; standalone categorical light/dark measured 92.9°/96.5° and 3.37:1/3.38:1: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:54-126]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:70-96]`. These support retaining the standalone role split, not a hard CVD gate without a policy.

The browser inventory was empty, so keyboard order, focus visibility, Enter/Space activation, pointer reach, tooltip placement, and rendered natural-curve overshoot remain unverified. No source-only inference is substituted for those observations.

### Eliminated Alternatives

| Alternative | Why eliminated |
|---|---|
| Treat all 70 shadcn files as distinct forms | Variants and nine tooltip support examples inflate the count; compare reader questions instead. |
| Add radar to fill a numeric gap | The catalog deliberately rejects radial normalization, mixed units, and polygon area/order effects in favor of parallel axes. |
| Replace the palette with shadcn's raw five-token ramp | Its light minimums are weaker than the standalone categorical system, and it lacks the standalone role split. |
| Make natural interpolation the measured-data default | Smooth curves can imply between-point extrema; direct paths preserve observed gaps. |
| Make accessibilityLayer the complete accessibility contract | It appears in only 38/70 files and none of the polar families; the table floor is broader. |
| Add a universal config manifest now | Schema-preserving standalone retargets already have one data receipt; arbitrary semantic retargets need a real requirement first. |

### Divergence Map

- Saturated directions: form-count reduction, radar/pie substitution, palette role split, static table/interaction contract, and direct-path/gap evidence.
- Pivot taken: runtime interaction claims were narrowed to source evidence after the browser inventory returned empty.
- Policy frontier: CVD/hue thresholds, semantic domain/curve metadata, and arbitrary retargetability require an owner decision before new assertions can be meaningful.
- Remaining frontier: product demand for candidate forms, a rendered natural-curve comparison, and browser-backed keyboard/pointer behavior.
- Council artifacts: none; this lineage used only frozen local sources and the inline executor.

### Open Questions

1. Which candidate form gaps are demanded by the product rather than suggested by shadcn's variant inventory?
2. Which reproducible CVD model and threshold should become policy, if any?
3. When a browser is available, do focus order, Enter/Space handlers, pointer reach, and card values pass at runtime?
4. Is semantic metadata worth the maintenance cost for domain/curve/null/tick and arbitrary retargetability checks?

### Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 6
- Questions answered: 6 / 6
- Remaining questions: four residual product/runtime/policy questions above
- Last three iteration summaries: run 4 palette metrics (0.93); run 5 data accuracy and geometry defaults (0.90); run 6 checker boundaries (0.88)
- Convergence threshold: 0.05
- Policy: convergence was telemetry only until the six-iteration cap
