# Iteration 9: Matrix Validation Against Live Owners

## Focus

Check proposed additions against existing mode boundaries and integration points.

## Findings

- `interface` should own distinctive direction, redesign intake, preflight, visual assets, copy register, and real-UI loop handoffs because its integration points say it decides the look while sk-code builds it [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:197].
- `foundations` should own color, type, layout, responsive, data-viz token application, density, and adaptation because its integration points define static visual systems and token handoff [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:293].
- `motion` should own temporal patterns and reduced-motion/performance handoff because it routes motion-family prompts and audit consumes its rules [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:314].
- `audit` should own evidence, scoring, critique, and hardening, but not implementation; it delegates fixes to the proper mode and sk-code [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:337].
- `md-generator` should own extraction/Style Reference fidelity and optional authoring boundaries; it explicitly skips inventing new design direction [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:42].

## Sources Consulted

- `.opencode/skills/sk-design/SKILL.md:49`
- `.opencode/skills/sk-design/design-interface/SKILL.md:197`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:293`
- `.opencode/skills/sk-design/design-motion/SKILL.md:314`
- `.opencode/skills/sk-design/design-audit/SKILL.md:337`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:42`

## Assessment

- newInfoRatio: 0.09
- Novelty: Low. Validation reinforced selected homes.
- Confidence: High.

## Reflection

What worked: live owner checks caught the temptation to put remediation implementation inside audit.
What failed: none.
Ruled out: moving current mode boundaries.

## Recommended Next Focus

Run final convergence check and synthesize.
