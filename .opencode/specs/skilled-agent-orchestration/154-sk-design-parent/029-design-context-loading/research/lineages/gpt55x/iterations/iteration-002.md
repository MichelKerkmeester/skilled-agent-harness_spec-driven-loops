# Iteration 2: Foundations token vocabulary and contrast timing

## Focus

Investigate how foundations context should load when interface work creates or changes color tokens, text pairs, or theme surfaces.

## Findings

1. Foundations owns static visual-system work, including color systems, OKLCH palettes, themes, semantic tokens, typography, layout, hierarchy and design tokens. Its trigger list explicitly includes `contrast`, `theme tokens`, `color token system`, `spacing`, `grid`, and `responsive`. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:15] [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:31]

2. Foundations always loads the shared register first, because register posture sets the inherited color strategy and token density. That directly connects the skipped-register miss to late contrast and token discipline: posture comes before palette and token density. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:85] [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:87]

3. Foundations decision rules say to use semantic token names before implementation values and to check contrast and gamut for color work. The repair rule is concrete: fix contrast by changing OKLCH lightness first. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:270] [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:272] [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:256]

4. The OKLCH workflow says contrast repair starts by identifying the actual foreground/background pair and checking APCA and WCAG where available; normal text targets APCA `|Lc| >= 60` and WCAG AA `4.5:1`. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:60] [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:62]

5. The interface quality floor independently says color contrast meets WCAG AA and must be verified, not eyeballed. This makes late WCAG-AA P1 findings a missing-preflight symptom, not a normal polish iteration. [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:40] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:42]

## Sources Consulted

- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/shared/design_token_vocabulary.md`
- `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md`
- `.opencode/skills/sk-design/design-foundations/references/color/palette_theming.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md`

## Assessment

`newInfoRatio`: 0.86

Novelty justification: added a concrete mechanism for preventing late contrast misses: foreground/background pair inventory plus semantic token role checks before implementation.

Confidence: high. The relevant files independently align on measured contrast.

## Reflection

What worked: Treating contrast as token-pair inventory clarified where the gate belongs. It belongs before handoff and again before release.

What failed or was ruled out: Visual inspection or final audit alone cannot be the first contrast check. The documented workflow needs actual pairs and thresholds.

## Recommended Next Focus

Read audit contract and pre-flight references to separate a build-time pre-flight gate from a formal audit report.
