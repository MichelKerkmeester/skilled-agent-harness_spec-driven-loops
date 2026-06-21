# Iteration 2: sk-design-interface Current-State Gap

## Focus

This iteration maps Claude Design parity dimensions onto `sk-design-interface`. The skill is a design-judgment surface, not a canvas tool, so the parity question is how to add context, iteration, and handoff without losing its anti-default philosophy.

## Findings

1. `sk-design-interface` already has a strong distinctive-design mandate: ground the subject, make deliberate palette/type/layout/motion choices, take one justified aesthetic risk, and reject templated defaults. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:16]
2. The skill already has a two-pass process: ground the subject, brainstorm token system, critique the plan, build from the revised plan, then self-critique. This aligns with Claude Design's iterative posture, but the iteration is mostly internal and not persisted as a user-visible revision loop. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:90]
3. The quality floor is explicit and objective: WCAG contrast, keyboard focus, real labels, reduced motion, touch targets, responsive behavior, and chart accessibility. This is stronger than many design tools and should remain a hard gate. [SOURCE: file:.opencode/skills/sk-design-interface/references/ux_quality_reference.md:41]
4. The design inventory is deliberately critique-against fuel, not a generator. That is the key philosophy guardrail: Claude Design parity must not turn it into an auto-palette/template chooser. [SOURCE: file:.opencode/skills/sk-design-interface/references/design_inventory.md:67]
5. The skill lacks a first-class design-system intake artifact analogous to Claude Design's uploaded org design system. It can read prompts and local memory, but it does not require or persist a brand/context snapshot before design work. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:90]
6. The skill hands implementation to `sk-code` and screenshot critique to browser tooling, but it does not produce a standardized handoff manifest describing tokens, decisions, risks, quality checks, and follow-up visual feedback. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:182]

## Sources Consulted

- `.opencode/skills/sk-design-interface/SKILL.md`
- `.opencode/skills/sk-design-interface/references/design_principles.md`
- `.opencode/skills/sk-design-interface/references/ux_quality_reference.md`
- `.opencode/skills/sk-design-interface/references/design_inventory.md`
- `.opencode/skills/sk-design-interface/feature_catalog/feature_catalog.md`

## Assessment

- newInfoRatio: 0.72
- Novelty justification: this pass converted the target dimensions into a concrete gap list for one skill.
- Confidence: high for current-state features, high for the no-generator constraint, medium for implementation sequencing.

## Reflection

What worked: the feature catalog made the current surface clear enough to separate strengths from gaps.

What failed: no local visual artifact samples were available in the skill itself, so visual-output quality can only be inferred from the process contract.

Ruled out: converting the data inventory into a design-system generator.

## Recommended Next Focus

Map the same dimensions onto `mcp-magicpath`, which owns canvas and CLI execution.
