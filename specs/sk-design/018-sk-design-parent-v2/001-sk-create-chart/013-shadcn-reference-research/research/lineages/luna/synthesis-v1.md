# Synthesis v1: Shadcn Decisions for the Standalone HTML Corpus

## Executive Decision

Adopt three shadcn decisions selectively:

1. Use semantic token indirection and per-key colors, while retaining the standalone corpus's single palette source and one `CHART_DATA` receipt.
2. Use local tooltip knobs for real semantic needs: formatter, label formatter, name/key aliases, and indicator choice where the form warrants it.
3. Expose explicit geometry variants when meaning requires them: linear, step, monotone, or normalized composition. Do not make smoothing the default for measured data.

Retain the standalone decisions that are already better for this deliverable: question-first cataloging, deliberate radar and arc-pie omissions, role-specific palettes with numeric gates, direct paths with explicit gap handling, visible scale/tick decisions, a table fallback, and an explicit inert-versus-tooltip contract.

## Evidence Summary

The 70 frozen shadcn files reduce to a smaller set of reader-question forms because labels, grids, dots, icons, legends, active states, gradients, interpolation variants, and nine tooltip examples are mixed into the family count. The standalone catalog maps forms to reader questions and data ceilings: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:34-82]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:116-145]`.

Shadcn's `ChartConfig` and `ChartStyle` provide useful per-key labels/colors/theme indirection, but representative charts still declare data and config separately. A stable standalone data retarget is one `CHART_DATA` edit site across 26/26 templates; arbitrary semantic shape changes are not one-point in either system: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:14-23]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:83-114]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:142-175]`.

The frozen shadcn accessibility layer appears in 38/70 files and in none of the pie, radar, or radial families. The standalone checker enforces role/label/table coverage and a per-form pointer decision, so `accessibilityLayer` is useful cartesian machinery but not a sufficient corpus contract: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-tooltip-default.tsx:55-83]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:809-839]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:431-503]`.

The measured shadcn light ramp had 16.0° minimum adjacent hue gap, 1.72:1 own-ground minimum contrast, and 0.058 minimum simulated deutan separation. The standalone categorical ramp measured 92.9°/96.5° minimum hue gap and 3.37:1/3.38:1 own-ground minimum contrast in light/dark. Neutral and ordered ramps intentionally are not categorical competitors: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:54-79]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:102-126]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58-96]`.

The shadcn scan found 22 natural, 3 monotone, 2 linear, and 2 step props, but no explicit domain, baseValue, or connectNulls props. The standalone templates use direct `M`/`L` paths, finite runs, explicit baselines/ticks, and a conditional dual scale for mixed units: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:370-431]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:379-461]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:386-451]`.

## Ranked Recommendations

1. **[implementable today] Adopt semantic indirection, not shadcn's raw ramp.** Keep the palette source as the authority and continue using per-series tokens with explicit light/dark values: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-96]`.
2. **[implementable today] Keep the question-first form boundary.** Count reader questions, retain `parallel-axes` for multidimensional comparison, and retain `unit-grid`/`unit-ring` for countable composition: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:128-160]`.
3. **[implementable today] Keep the one-receipt retarget contract.** Promise one edit site only for schema-preserving `CHART_DATA` replacement; select another template when the shape or question changes: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:155-177]`.
4. **[implementable today] Adopt shadcn's local tooltip and interpolation ideas selectively.** Use formatter/key aliases and explicit linear/step/monotone choices only when the template semantics justify them: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:118-165]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-linear.tsx:66-74]`.
5. **[implementable today] Retain the standalone honesty floor.** Keep direct paths, finite-run gaps, explicit scale/tick decisions, table fallback, inert rationale, and current static checker gates: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:431-503]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:776-865]`.
6. **[needs a corpus change] Add runtime keyboard/pointer proof.** A browser-backed `keyboard-contract` check is needed before claiming focus, activation, or pointer parity; this run had no browser.
7. **[needs a corpus change] Add CVD/hue policy only with agreed thresholds.** The measured metrics justify a policy discussion, not an unreviewed hard gate.
8. **[needs a corpus change] Add semantic data-accuracy or retargetability metadata only if required.** Domain, baseline, stacking, interpolation, prose/unit alignment, and arbitrary schema retargets cannot be inferred safely from current source structure.

## Checker-Enforceable Boundary

The current checker can enforce catalog identity/system agreement, one data-block receipt, deterministic source, palette/source/literal consistency, indexed series mapping, accessible role/label/table markup, static interaction hygiene/state, number formatting, pointer-contract coverage, empty notices, and render-dependent card/pointer checks when a browser exists. Its errors are concrete: duplicate or unreachable catalog rows, wrong/missing sentinels, clocks/randomness, raw paint literals, palette drift, wrong series tokens or capacity, missing role/table, inert/register conflict, pre-open state, locale formatting, missing contract rows, missing card values, wrong marks, or dead near-mark samples: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1492-1592]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1713-1912]`.

It cannot choose the right reader-question form, radar/pie substitution, tooltip indicator, domain, zero baseline, stacking order, curve intent, null policy, tick budget, CVD threshold, or prose/unit meaning. Four future assertion families are identifiable: `keyboard-contract`, `palette-cvd`/`palette-hue`, metadata-driven `curve-contract`/`data-accuracy`, and `retargetability`.

## Eliminated Alternatives

| Alternative | Why eliminated | Evidence |
|---|---|---|
| Treat all 70 shadcn files as separate forms | The inventory mixes geometry with presentation/support variants; nine tooltip examples do not add geometry | `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:116-145]` |
| Add radar to close an apparent catalog gap | The catalog deliberately rejects radial normalization/mixed-unit/polygon risks and names parallel axes as the substitute | `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:143-160]` |
| Replace the palette with shadcn's raw five-token light ramp | Its measured minimums are weaker than the standalone categorical ramp and it lacks the standalone role split | `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:54-79]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:70-96]` |
| Make natural interpolation the measured-data default | Smooth curves can imply between-point extrema, while direct paths preserve observed gaps | `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-default.tsx:23-30]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:401-431]` |
| Use accessibilityLayer as the sole accessibility contract | It covers only 38/70 frozen files and no polar family; the table floor is broader | `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:809-839]` |
| Add a universal config/manifest now | Stable standalone retargets already have one data receipt; a manifest would add an unearned second contract | `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:142-175]` |

## Divergence Map

- **Saturated directions:** form-count reduction, radar/pie substitution decisions, palette role split, static table/interaction contract, and direct-path/gap evidence were independently covered and do not need another sibling pass.
- **Pivot taken:** runtime interaction claims were narrowed to source evidence after the browser inventory returned empty. The unresolved runtime walk is recorded as a limitation rather than a guessed pass.
- **Policy frontier:** CVD/hue thresholds, semantic domain/curve metadata, and arbitrary retargetability need an owner decision before a new checker assertion can be meaningful.
- **Remaining frontier:** product demand for candidate forms (multi-series line, step, negative/diverging bar, generic area trend), a rendered natural-curve comparison, and browser-backed keyboard/pointer behavior.
- **Council artifacts and pivots:** none; this detached lineage used only the frozen local sources and inline executor.

## Open Questions

1. Which candidate form gaps are demanded by the standalone product rather than suggested by shadcn's variant inventory?
2. Which reproducible CVD model and threshold should become policy, if any?
3. When a browser is available, do the focus order, Enter/Space handlers, pointer reach, and card values pass at runtime?
4. Is semantic metadata worth the maintenance cost for domain/curve/null/tick and arbitrary retargetability checks?

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 6
- Questions answered: 6 / 6
- Remaining questions: four residual product/runtime/policy questions listed above
- Last three iteration summaries: run 4 measured palette metrics (0.93); run 5 measured data accuracy and geometry defaults (0.90); run 6 mapped checker boundaries (0.88)
- Convergence threshold: 0.05
- Convergence handling: telemetry only until the six-iteration cap, as required by the detached fan-out execution parameters
