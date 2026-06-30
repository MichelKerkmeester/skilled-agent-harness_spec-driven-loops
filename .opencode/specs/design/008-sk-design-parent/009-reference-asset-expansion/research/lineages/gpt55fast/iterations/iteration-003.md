# Iteration 3: Foundations Expansion Leverage

## Focus

Identify the highest-leverage reference and asset additions for `design-foundations`.

## Findings

- Add register-aware color guidance. `colorize` explicitly splits Brand and Product color behavior: brand palettes can be voice and exceed restrained dosage, while product color is semantic-first and restrained [SOURCE: .opencode/specs/design/008-sk-design-parent/external/colorize.md:14].
- Add a data-visualization color reference or subsection. `colorize` calls out charts, heatmaps, comparisons, and dataset encoding as a distinct color application surface [SOURCE: .opencode/specs/design/008-sk-design-parent/external/colorize.md:85].
- Add a density/structure asset for layout decisions. `layout.md` gives spacing systems, rhythm, Flexbox vs Grid, container queries, card-grid monotony checks, and live-mode density/structure params [SOURCE: .opencode/specs/design/008-sk-design-parent/external/layout.md:61], [SOURCE: .opencode/specs/design/008-sk-design-parent/external/layout.md:150].
- Add responsive adaptation matrix. `adapt` frames adaptation as rethinking the experience for the target context, not scaling pixels, and lists mobile/tablet/desktop strategies [SOURCE: .opencode/specs/design/008-sk-design-parent/external/adapt.md:37].
- Do not duplicate basic OKLCH math. Current `oklch_workflow.md` already covers conversion, palette generation, contrast, gamut, and review output [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:269].

## Sources Consulted

- `.opencode/skills/sk-design/design-foundations/SKILL.md:269`
- `.opencode/specs/design/008-sk-design-parent/external/colorize.md:14`
- `.opencode/specs/design/008-sk-design-parent/external/colorize.md:85`
- `.opencode/specs/design/008-sk-design-parent/external/layout.md:61`
- `.opencode/specs/design/008-sk-design-parent/external/adapt.md:37`

## Assessment

- newInfoRatio: 0.58
- Novelty: Medium-high. The foundations additions are refinements around decision gates and under-covered domains, not new basics.
- Confidence: High for register/data-viz/adaptation; medium for whether data-viz should be its own file or a layout/color subsection.

## Reflection

What worked: checking current foundations coverage prevented recommending another generic palette guide.
What failed: broad designer-skills design-system docs mostly duplicate current token vocabulary.
Ruled out: splitting foundations into separate color/type/layout modes.

## Recommended Next Focus

Investigate motion to distinguish principles already covered from reusable assets that reduce implementation ambiguity.
