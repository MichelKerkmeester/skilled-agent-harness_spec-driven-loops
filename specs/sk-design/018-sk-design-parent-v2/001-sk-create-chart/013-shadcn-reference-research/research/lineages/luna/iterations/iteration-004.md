# Iteration 4: Measured Color Comparison

## What was read

- The frozen local shadcn light and dark chart tokens and their backgrounds: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:54-79]` and `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:102-126]`.
- The standalone surface/ink grounds, palette systems, capacities, and numeric gates: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-23]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58-96]`.
- The color-system guidance on neutral, ordered, categorical, and gradient roles: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:126-166]`.

## What was measured

I used a read-only inline calculation: parse each OKLCH token, convert to sRGB, calculate WCAG relative luminance and contrast against the set's own and opposite ground, calculate adjacent OKLCH hue gaps, and calculate minimum OKLab Euclidean separation after severity-1 protan, deutan, and tritan simulation matrices. `min CVD deltaE` is the smallest adjacent-pair separation for the named deficiency simulation. This is a comparison metric, not a claim that any one CVD model is a complete accessibility test.

| System and ground | Min adjacent hue gap | Min contrast on own / opposite ground | Min CVD deltaE, protan / deutan / tritan |
|---|---:|---:|---:|
| Shadcn light, `#FFFFFF` / `#090909` | 16.0° | 1.72 / 2.18 | 0.079 / 0.058 / 0.077 |
| Shadcn dark, `#090909` / `#FFFFFF` | 71.1° | 2.92 / 2.15 | 0.084 / 0.145 / 0.183 |
| Standalone neutral light, `#FAF8F5` / `#161513` | N/A; hue is intentionally non-semantic | 3.20 / 1.24 | 0.112 / 0.111 / 0.111 |
| Standalone neutral dark, `#161513` / `#FAF8F5` | N/A; hue is intentionally non-semantic | 3.15 / 1.23 | 0.117 / 0.117 / 0.117 |
| Standalone ordered light, `#FAF8F5` / `#161513` | 0.3° | 1.76 / 1.53 | 0.113 / 0.109 / 0.115 |
| Standalone ordered dark, `#161513` / `#FAF8F5` | 0.2° | 1.76 / 1.53 | 0.106 / 0.099 / 0.104 |
| Standalone categorical light, `#FAF8F5` / `#161513` | 92.9° | 3.37 / 1.72 | 0.126 / 0.062 / 0.148 |
| Standalone categorical dark, `#161513` / `#FAF8F5` | 96.5° | 3.38 / 1.72 | 0.161 / 0.153 / 0.221 |

The shadcn light ramp's adjacent hue gaps were `[147.0, 43.4, 146.1, 16.0]` degrees; its dark gaps were `[104.1, 95.0, 120.0, 71.1]`. The standalone categorical light ramp's adjacent mark-to-mark contrasts were `[1.45, 1.45, 1.41]`, which demonstrates why hue separation and adjacent-mark readability must not be treated as the same metric.

## Findings

1. **OBSERVED, high confidence:** Shadcn light has a 16.0° minimum adjacent hue gap, 1.72:1 minimum contrast on its own white ground, and 0.058 minimum simulated deutan separation. The closest light tokens are visibly close in hue/value by this measurement: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:54-79]`.

2. **OBSERVED, high confidence:** Shadcn dark improves hue separation to a 71.1° minimum and own-ground contrast to 2.92:1, but its minimum simulated protan separation is still 0.084. Its five-token ramp is more distinguishable than its light counterpart, not uniformly robust: `[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/src/app/globals.css:102-126]`.

3. **OBSERVED, high confidence:** The standalone categorical system is more cross-hue than shadcn in both themes: 92.9° light and 96.5° dark minimum adjacent hue gaps versus 16.0° and 71.1°. Its own-ground minimum contrast is also higher at 3.37:1 light and 3.38:1 dark. The source palette assigns categorical roles four distinct hues and keeps explicit light/dark values: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:70-96]`.

4. **OBSERVED, high confidence:** The standalone neutral and ordered systems are intentionally not categorical competitors. Neutral has no semantic hue separation, while ordered uses one hue ramp with small hue gaps; their purpose is order or chrome, not five independent categories. The color guidance makes that role distinction explicit: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:126-166]`.

5. **DERIVED, high confidence:** The standalone palette is stronger for this corpus's semantic roles because it separates neutral, ordered, and categorical use and carries separate light/dark sources. Its numeric gates require 4.5:1 text contrast, 3.0:1 mark contrast, 1.3 step separation, and 1.5 emphasis against the first series: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58-68]`. The checker enforces palette-source, dark-source, and literal consistency, but the current gate does not enforce the measured CVD or hue-gap metrics: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:229-247]`.

6. **DERIVED, high confidence:** The corpus should not adopt shadcn's raw five-token ramp as a universal palette. It should adopt the decision to provide explicit light/dark source tokens and per-series variables, then retain the standalone role-specific ramps and numeric gates. A CVD threshold would be a new policy, not an existing checker fact.

## Recommendations

1. **[implementable today]** Keep the standalone neutral/ordered/categorical role split and explicit light/dark palette source. It is better aligned with semantic use than one five-token ramp.
2. **[implementable today]** Keep the existing contrast, ramp-step, and emphasis gates; do not replace them with raw shadcn token values.
3. **[implementable today]** If a shadcn idea is adopted, adopt source-token indirection and per-key semantic colors, not the measured light ramp itself.
4. **[needs a corpus change]** Add a `palette-cvd` or `palette-hue` assertion only after agreeing on a color model and threshold. The current measurements justify investigation, not an unreviewed hard gate.

## What this iteration could not settle

The CVD values depend on the stated conversion and simulation matrices and are not a substitute for human review or a browser render. No rendered comparison was performed because the browser was unavailable. The current checker does not yet have a CVD or hue-gap assertion.

## Assessment

- New-information ratio: **0.93**.
- Novelty: high; the comparison separates role semantics, own/opposite-ground contrast, hue gap, and CVD separation.
- Confidence: high for the local token values and the stated calculations; medium for using these metrics as future gates.
- Convergence telemetry: continue to iteration 5; max-iterations remains authoritative.

## Reflection

The useful shadcn decision is indirection, not the exact ramp. The standalone system is already better at saying when color means order, category, or chrome. The next pass checks whether shadcn's chart defaults are as honest about data geometry.

## Recommended Next Focus

Iteration 5: domains, baselines, stacking, interpolation, gaps, and ticks.
