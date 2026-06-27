# Iteration 3: Reference And Asset Usefulness

## Focus

Find the smallest useful additions that improve operator outcomes without duplicating current references.

## Findings

1. Foundations already has strong axis references. OKLCH covers channel mechanics, palette generation, contrast repair, gamut, fallbacks, and review output. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:20-70]
2. Palette and theming already cover register selection, primitive versus semantic token layers, canonical color roles, tinted neutrals, dark mode, dosage, and verification. Another color-basics reference would duplicate this. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:35-113]
3. Typography and layout references already cover role-first type, measure, hierarchy, spacing scales, grid/flex choice, container queries, responsive adaptation, input method, and safe areas. The gap is not missing theory, it is output packaging. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/type/typography_system.md:35-95], [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:35-140]
4. The current token starter is useful as a fill-in scaffold, but it is not a complete `sk-code` handoff schema. It asks for register, OKLCH ramp, type scale, spacing scale, dark mode, and handoff checks, but does not include a final implementation-ready table for CSS variables, Tailwind/theme mapping, breakpoint intent, or unresolved risks. [SOURCE: file:.opencode/skills/sk-design/design-foundations/assets/token_starter.md:20-132]
5. Add a small `assets/foundations_handoff_card.md` or extend `token_starter.md` with a final handoff block: system role, source evidence, semantic token table, CSS variable names, responsive breakpoints, data-viz scale rules, verification evidence, open risks, and explicit `sk-code` handoff notes. This directly supports the success criterion that sk-code should not guess token roles or breakpoint intent. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:309-317]
6. Add one or two annotated examples, not presets: a restrained product dashboard and a brand landing surface. The README tells users to fill the scaffold after reading the register, but gives no completed example. [SOURCE: file:.opencode/skills/sk-design/design-foundations/README.md:52-68]

## Sources Consulted

- `references/color/oklch_workflow.md`
- `references/color/palette_theming.md`
- `references/type/typography_system.md`
- `references/layout/layout_responsive.md`
- `assets/token_starter.md`
- `README.md`

## Assessment

- newInfoRatio: 0.58
- Novelty: Reframed improvement from more references to better deliverables and cross-axis loading.
- Confidence: High for current reference coverage; high for handoff friction because the handoff criterion is explicit and the asset lacks a final schema.

## Reflection

- What worked: Reading the current references ruled out bulk expansion.
- What failed: No completed example exists to test how a user should fill the scaffold.
- Ruled out: Adding more color/type/layout theory as the next improvement.

## Recommended Next Focus

Check manual testing and tooling: what validation would make the skill easier to trust and benchmark?
