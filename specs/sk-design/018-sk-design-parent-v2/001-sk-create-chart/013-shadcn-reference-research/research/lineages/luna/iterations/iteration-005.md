# Iteration 5: Data Accuracy and Geometry Defaults

## What was read

- Representative shadcn area, bar, and line examples and the shared chart helper: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-default.tsx:23-30]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-default.tsx:59-76]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-stacked-expand.tsx:66-102]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-bar-negative.tsx:23-60]`, and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-line-default.tsx:68-76]`.
- The complete local prop scan across the 70 frozen files and the standalone data and geometry contracts: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:142-175]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:370-431]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:379-461]`.
- The dual-scale and specialized-domain logic in the standalone corpus: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:386-451]` and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/scatter.html:331-391]`.

## What was measured

The frozen 70-file source scan found these literal prop occurrences: `type="natural"` 22, `type="linear"` 2, `type="monotone"` 3, `type="step"` 2; `stackId` 18; `stackOffset="expand"` 1; `domain=` 0; `baseValue=` 0; `connectNulls=` 0; and `tickCount=` 1. No data array contains an explicit null. The two `null` occurrences found are control returns in custom renderers, not data values: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-line-dots-custom.tsx:78-80]` and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-pie-interactive.tsx:123-125]`.

The standalone scan found 0 curved path methods (`quadraticCurveTo`, `bezierCurveTo`, `arcTo`, `arc`, or `ellipse`) in template drawing code, 26/26 templates with exactly one data block, and 0 literal null values in those blocks. `daily-line` builds straight `M`/`L` segments and breaks at non-finite gaps; `stacked-area` builds direct polygon paths and refuses incomplete periods rather than inventing values: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:401-431]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:384-423]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:450-461]`.

| Accuracy dimension | Shadcn evidence | Standalone evidence | Assessment |
|---|---|---|---|
| Domain and zero baseline | No explicit `domain` or `baseValue` props in 70 files; negative data exists without those props | Explicit `BASE`, computed peaks, ceilings, and `niceStep`/`TICKS` in representative templates | Standalone exposes the domain decision more clearly; exact semantics remain per form. |
| Stacking | 18 `stackId` occurrences and one `stackOffset="expand"`; order follows the declared series/components | Stacked-area and stacked-bars build from named series, capacity, floors/runs, and readable table data | Shadcn offers more direct library options; standalone makes incomplete/gap handling more explicit. |
| Interpolation | 22 natural, 3 monotone, 2 linear, and 2 step props | No curve methods; direct straight segments and polygons | Straight paths are safer for measured data; curves need explicit semantic justification. |
| Nulls and gaps | No data nulls and no `connectNulls` evidence in the frozen examples | No data nulls; finite-run checks break lines/areas and preserve gap notices | Standalone has the clearer displayed-gap policy. |
| Ticks | Only one explicit `tickCount`; other examples rely on library defaults | Dynamic `niceStep`, fixed tick budgets, peak-aware labels, and form-specific scales | Standalone is more explicit and deterministic about the visible axis. |

## Findings

1. **OBSERVED, high confidence:** Shadcn's frozen corpus exposes interpolation choices but very little explicit domain policy. The source scan found 22 natural, 3 monotone, 2 linear, and 2 step props, but zero `domain`, `baseValue`, or `connectNulls` props. The negative bar example includes negative data while leaving those domain decisions to the chart library: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-bar-negative.tsx:23-60]`.

2. **INFERRED, medium confidence:** Natural interpolation is a concrete risk for measured data. In `chart-area-default`, the data points are discrete observations and the Area explicitly requests `type="natural"`: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-default.tsx:23-30]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-default.tsx:70-76]`. A smooth curve can introduce an apparent extremum between observations that is not in the data. The source establishes the choice; a rendered overshoot would require the unavailable browser and is not claimed here.

3. **OBSERVED, high confidence:** Shadcn does provide meaningful alternatives when the data semantics warrant them: linear area and line, step area and line, monotone lines, and normalized composition with `stackOffset="expand"`: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-linear.tsx:66-74]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-step.tsx:66-75]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-line-interactive.tsx:211-220]`, and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-stacked-expand.tsx:66-102]`. The decision worth adopting is explicit per-form interpolation, not a natural default.

4. **OBSERVED, high confidence:** The standalone templates encode the axis decision in ordinary source rather than delegating it to an implicit library default. `daily-line` and `stacked-area` calculate a baseline, peak, tick budget, and nice step; `bar-line-composed` derives separate left/right maxima and scales only when the count/rate spread warrants it: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:370-399]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:379-412]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:386-451]`.

5. **OBSERVED, high confidence:** The standalone corpus is more honest about gaps. `daily-line` breaks the path at non-finite values, and `stacked-area` only draws complete finite runs and retains an explicit gap/zero warning; neither uses smoothing commands: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:401-431]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:384-423]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:450-461]`. This is already better for standalone HTML that must not invent missing observations.

6. **DERIVED, high confidence:** Domains, baselines, tick budgets, stacking order, and interpolation are not one universal rule. The data contract freezes display-ready data and caps, while the catalog assigns each form a ceiling: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:142-175]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:73-101]`. These remain per-template judgement unless the corpus adds machine-readable semantic metadata.

## Recommendations

1. **[implementable today]** Adopt shadcn's explicit interpolation-choice idea, but use linear/direct paths for measured trends, step only for discrete state changes, and natural/monotone only when the template's semantic review justifies smoothing.
2. **[implementable today]** Keep the standalone finite-run gap policy, explicit baseline/peak/tick calculations, and dual-scale condition for mixed units. These are already better aligned with honest standalone readouts.
3. **[implementable today]** Treat stacking order, zero baseline, domain ceiling, and tick density as per-template review decisions; do not infer them from shadcn defaults.
4. **[needs a corpus change]** Add a `curve-contract` or `data-accuracy` assertion only if the corpus records metadata for gap-sensitive forms. A static rule can reject prohibited smoothing or null coercion, but it cannot choose the correct domain or tick count without semantics.

## What this iteration could not settle

The source scan cannot prove the exact runtime behavior of Recharts' implicit domains or natural curves, and no browser was available for a rendered overshoot or gap walk. It also cannot decide whether a given product series is continuous, stepwise, or sparse without domain context.

## Assessment

- New-information ratio: **0.90**.
- Novelty: high; the key evidence is the explicit-prop inventory plus the standalone direct-path and gap policy.
- Confidence: high for source counts and standalone behavior; medium for the inferred natural-curve risk until rendered.
- Convergence telemetry: continue to iteration 6; max-iterations remains authoritative.

## Reflection

Shadcn's strongest transferable decision here is offering explicit curve variants. Its weakest default evidence is leaving domains, baselines, null policy, and most ticks implicit. The standalone corpus already does more to preserve gaps and expose scale choices. The final angle will sort these findings into checker assertions versus human judgement.

## Recommended Next Focus

Iteration 6: what the existing checker can enforce, what new assertions would require a corpus change, and what remains per-template judgement.
