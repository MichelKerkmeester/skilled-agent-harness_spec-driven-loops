# Iteration 2: Adjustability and Edit-Site Count

## What was read

- The shadcn config type and generated CSS variables: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:14-23]` and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:83-114]`.
- A representative shadcn tooltip chart's separate data and config declarations: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-tooltip-default.tsx:24-42]`.
- The standalone data receipt contract and representative single-series and multi-series templates: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:142-175]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:145-177]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:183-234]`.
- The checker rules for data blocks, palette literals, determinism, and series mapping: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:566-642]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:776-789]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:852-865]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1412-1490]`.

## What was measured

The local read-only inventory found exactly one `CHART_DATA` sentinel pair in each of the 26 templates, with no literal `null` in any data block. The representative `bar-columns` template says to replace the data block and nothing else, and its entire data array is between the sentinels: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:155-177]`.

The shadcn representative has `chartData` in one declaration and `chartConfig` in another. The config carries labels, icons, colors, and theme colors, while `ChartStyle` turns those values into `--color-<key>` variables: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-tooltip-default.tsx:24-42]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:14-23]`, and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:83-114]`.

| Retarget operation | Shadcn edit surfaces observed | Standalone edit surfaces observed | Result |
|---|---:|---:|---|
| Change values while preserving the existing row schema | At least 2: data plus config when displayed names/colors remain coupled to keys | 1: the `CHART_DATA` block | Standalone is simpler and more centralized. |
| Rename or add a series in a multi-series form | Data keys plus config entries, with chart references following those keys | Data/`SERIES` block plus prose, readout, capacity, and mapping assumptions where the template is semantic | Neither is one-point for arbitrary shape changes; standalone makes the boundary visible. |
| Change palette system consistently | Config values and generated variables per component in shadcn | One palette source and per-template palette block, with checker equality and series-index rules | Standalone has the stronger corpus-wide consistency contract. |

## Findings

1. **OBSERVED, high confidence:** For a schema-preserving retarget, the standalone corpus has one intended adjustment point: the `CHART_DATA` block. All 26 templates satisfy exactly one data block, and `bar-columns` explicitly documents the replace-data-only workflow: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:142-165]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:155-177]`. This is a real advantage for small, deterministic HTML artifacts.

2. **OBSERVED, high confidence:** Shadcn separates data from chart configuration. `ChartConfig` centralizes labels, icons, and theme colors, but a normal chart still declares its data independently; `ChartStyle` then derives CSS variables from config keys: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-tooltip-default.tsx:24-42]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:14-23]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:83-110]`. A key rename or added series therefore has at least a data surface and a config surface.

3. **OBSERVED, high confidence:** One data block does not make every semantic retarget one-point. `stacked-area` keeps `SERIES` and `DATA` together in its block, but the heading, description, chart title, and table caption are separate semantic text; its tooltip/readout and capacity assumptions are also separate runtime surfaces: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:183-234]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:294-312]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:425-461]`. The measured minimum is one edit site for a stable schema and at least four semantic surfaces for a changed series story, with palette/capacity changes adding another surface.

4. **DERIVED, high confidence:** The current checker protects the shape of the adjustment point, not its meaning. `checkDataBlock` enforces one sentinel pair, determinism rejects clocks and random values, color checks reject out-of-palette literals, and series mapping enforces contiguous same-index classes and capacity: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:776-789]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:852-865]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:566-642]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1412-1490]`. None of those assertions proves that a changed label, unit, or narrative still describes the data.

5. **DERIVED, high confidence:** A `ChartConfig`-like manifest would not be an immediate improvement for this corpus. It would add a second contract to a format whose strongest current property is one named data receipt. A manifest is justified only if schema-changing retargets become a real requirement; otherwise the correct rule is to select a template whose existing schema matches the new question.

## Recommendations

1. **[implementable today]** Define “one adjustment point” narrowly as a schema-preserving replacement of the single `CHART_DATA` block. Treat a changed series shape, unit, or reader question as a template-selection decision, not as a promise of arbitrary retargeting.
2. **[implementable today]** Keep the current single-source palette and checker rules. They provide a stronger corpus-level consistency guarantee than per-component shadcn config values: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:229-247]`.
3. **[implementable today]** When reviewing a retarget, inspect the semantic surfaces outside the data block in multi-series templates; do not call a retarget safe just because the sentinel check remains green.
4. **[needs a corpus change]** If arbitrary schema-changing retargets become required, add a manifest contract and a semantic-consistency assertion. Do not add it preemptively for flexibility.

## What this iteration could not settle

It did not measure authoring time or compare runtime bundle size. It also did not establish a generic AST-level way to prove that prose and units match a newly retargeted data block.

## Assessment

- New-information ratio: **0.84**.
- Novelty: high for the distinction between schema-preserving centralization and semantic retargeting.
- Confidence: high for the observed edit surfaces and checker boundaries.
- Convergence telemetry: continue to iteration 3; the max-iterations policy remains authoritative.

## Reflection

The standalone corpus wins when a data shape is already selected: one named receipt, deterministic values, and one palette source. It does not promise a universal schema, and that restraint is part of the contract. The next focus is whether the interaction contract makes a similar corpus-wide promise.

## Recommended Next Focus

Iteration 3: hover, tooltip, pointer reach, accessibility, and the actual keyboard contract.
