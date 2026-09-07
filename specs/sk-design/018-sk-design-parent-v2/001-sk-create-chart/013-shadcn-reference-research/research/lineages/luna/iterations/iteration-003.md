# Iteration 3: Hover, Tooltip, Pointer, and Keyboard Contract

## What was read

- The shadcn tooltip content props and rendering branches: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:116-269]`.
- Representative shadcn cartesian, pie, radar, radial, and tooltip examples: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-default.tsx:51-76]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-interactive.tsx:184-194]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-pie-simple.tsx:69-75]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-radar-default.tsx:53-62]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-radial-simple.tsx:69-75]`, and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-tooltip-default.tsx:55-83]`.
- The standalone pointer, tooltip, table, inert, and card-readout contract: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:431-503]`.
- Representative standalone static markup and keyboard/pointer handlers: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:145-164]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:182-203]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:491-499]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:605-718]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:809-839]`.

## What was measured

The frozen shadcn inventory contains `accessibilityLayer` in 38 of 70 files. Family coverage is area 9/10, bar 10/10, line 10/10, pie 0/11, radar 0/14, radial 0/6, and tooltip 9/9. The missing area case is interactive area, whose `AreaChart` has no prop: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-area-interactive.tsx:184-194]`. Polar examples omit the layer: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-pie-simple.tsx:69-75]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-radar-default.tsx:53-62]`, and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-radial-simple.tsx:69-75]`.

The standalone checker baseline found the role/label/table floor on all scanned chart artifacts. The local source inventory also found tooltip registers on 18 templates, six inert templates, and six `data-chart-dim` registrations. The browser inventory was empty (`agent.browsers.list()` returned `[]` and setup reported no browser), so no actual tab walk, focus-visible check, Enter/Space activation, pointer move, or live-tooltip test was performed.

## Findings

1. **OBSERVED, high confidence:** Shadcn's tooltip component offers a useful set of local knobs: indicator `dot|line|dashed`, `hideLabel`, `hideIndicator`, `labelFormatter`, `formatter`, `nameKey`, and `labelKey`, with fallback logic for the payload's data key and name: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:118-165]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/chart.tsx:214-260]`. These are useful per-chart semantic controls, not evidence for one global presentation setting.

2. **OBSERVED, high confidence:** `accessibilityLayer` is not a corpus-wide accessibility contract in the frozen examples. It covers 38/70 files, all bars and lines, most areas, and all tooltip examples, but none of the pie, radar, or radial families: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-tooltip-default.tsx:55-83]`, `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-pie-simple.tsx:69-75]`, and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/charts/chart-radar-default.tsx:53-62]`. That is selective support, not a stable promise across forms.

3. **OBSERVED, high confidence:** The standalone corpus makes a stronger static contract: every chart has an image role, a resolvable accessible label, and a `data-chart-table`; interactive forms must declare a tooltip/pointer register while inert forms must state why they do not need one: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:809-839]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:431-471]`. The table and card-readout floor is independent of hover support: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:473-503]`.

4. **OBSERVED, high confidence:** The standalone interactive examples expose a bounded pointer contract and keyboard handlers on focusable legend controls. `stacked-area` declares `tabindex=0`, `role=button`, and `aria-pressed`, handles Enter/Space, and bounds pointer selection using direct hit or nearest reach: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:491-499]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:605-685]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:688-718]`.

5. **UNSETTLED, high confidence about the limitation:** The source contains keyboard handlers, but an actual keyboard walk was not completed because no browser was available. Therefore this iteration makes no claim about tab order, focus visibility in the rendered page, whether Enter/Space changes state, pointer hit behavior, or live tooltip placement. The current static hygiene checks cover focus rules, inert explanations, and selection hygiene, but not execution of a keyboard sequence: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1129-1181]`.

6. **DERIVED, medium confidence:** Selective shadcn knobs worth adopting are semantic `formatter`, `labelFormatter`, and key-alias patterns where a template genuinely needs them. The indicator style and hide flags should remain per-form decisions, because the standalone contract already distinguishes readouts that are printed, tooltip-only, or inert: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:442-503]`.

## Recommendations

1. **[implementable today]** Keep the standalone table/card-readout floor and explicit inert-versus-tooltip decision as the corpus-wide contract.
2. **[implementable today]** Adopt shadcn’s idea of local semantic formatter and key-alias knobs only where a template’s data shape needs them; do not make indicator style or hide flags global.
3. **[implementable today]** Treat shadcn `accessibilityLayer` as a useful cartesian implementation detail, not as a reason to weaken the standalone role/table contract or to add it to rejected polar forms.
4. **[needs a corpus change]** Add a `keyboard-contract` assertion and a browser-backed check: every interactive register should have a reachable focus target and an Enter/Space path, followed by an actual tab/activation walk.

## What this iteration could not settle

The browser walk was blocked by the empty in-app browser inventory. Runtime claims about focus order, visual focus, pointer reach, keyboard activation, tooltip placement, and polar accessibility remain unverified. No source-only inference is substituted for those observations.

## Assessment

- New-information ratio: **0.58**.
- Novelty: medium-high; the key result is the contrast between shadcn's partial accessibility-layer coverage and the standalone static table/inert contract.
- Confidence: high for source counts and static rules; intentionally low for unrun browser behavior.
- Convergence telemetry: continue. The low ratio is telemetry only and cannot trigger early synthesis under the max-iterations policy.

## Reflection

The standalone contract is more explicit about what remains usable when hover is absent, while shadcn is more ergonomic for local tooltip presentation. The unresolved runtime walk is a real evidence gap, not a cue to infer success from handlers. The next focus moves to numeric palette evidence.

## Recommended Next Focus

Iteration 4: measured color comparison across shadcn light/dark ramps and the standalone neutral, ordered, and categorical systems.
