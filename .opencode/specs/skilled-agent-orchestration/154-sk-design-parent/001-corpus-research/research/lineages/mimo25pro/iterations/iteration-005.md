# Iteration 5: designer-skills-main Mapping & Absorption Analysis

## Focus
Map the 97 skills from designer-skills-main's 9 plugins to the 6 proposed sub-skills. Identify which to absorb, adapt, or drop.

## Actions Taken
1. Read ui-design plugin README (14 skills, 4 commands)
2. Read design-ops plugin structure
3. Cross-referenced all 9 plugin skill lists against the 6 sub-skill taxonomy

## Findings

### designer-skills-main → Sub-Skill Mapping

| Plugin | Skills | Maps to Sub-Skill | Absorption |
|---|---|---|---|
| **ui-design** (14) | layout-grid, color-system, typography-scale, readable-measure, responsive-design, visual-hierarchy, spacing-system, dark-mode-design, illustration-style, data-visualization, aesthetic-usability, von-restorff-effect, law-of-proximity, law-of-common-region | Split: color-system→sk-design-color, layout-grid/spacing-system/responsive-design→sk-design-layout, typography-scale/visual-hierarchy→sk-design-visual, dark-mode-design→sk-design-color, data-visualization→sk-design-layout, cognitive laws→sk-design-interaction | 12/14 absorbed |
| **interaction-design** (16) | micro-interaction-spec, animation-principles, state-machine, gesture-patterns, error-handling-ux, loading-states, feedback-patterns, hicks-law, millers-law, fitts-law, doherty-threshold, form-design, onboarding-design, navigation-patterns, search-ux | Split: animation-principles→sk-design-motion, state-machine/gesture-patterns/feedback-patterns/form-design/onboarding/navigation/search→sk-design-interaction, error-handling/loading-states→sk-design-a11y, cognitive laws→sk-design-interaction | 16/16 absorbed |
| **design-systems** (11) | design-token, component-spec, pattern-library, naming-convention, accessibility-audit, theming-system, icon-system, documentation-template, motion-system, design-system-governance, localization-design | Split: design-token/theming-system→sk-design-color, accessibility-audit→sk-design-a11y, motion-system→sk-design-motion, component-spec/pattern-library/icon-system→sk-design-layout, naming-convention/documentation-template/governance/localization→distributed | 11/11 absorbed |
| **visual-critique** (7) | critique-visual-hierarchy, critique-brand-consistency, critique-composition, critique-typography, critique-color, critique-affordance, critique-information-density | Split: visual-hierarchy/brand/typography→sk-design-visual, color→sk-design-color, composition/information-density→sk-design-layout, affordance→sk-design-interaction | 7/7 absorbed |
| **design-research** (12) | personas, empathy-maps, journey-maps, interviews, usability-testing, card-sorting, surveys, research-repositories, etc. | Mostly process — distributed as conditional references OR a 7th process sub-skill | 0-6/12 absorbed |
| **ux-strategy** (12) | competitive-analysis, design-principles, experience-mapping, information-architecture, content-strategy, service-blueprints, etc. | Process — distributed as conditional references | 0/12 absorbed |
| **prototyping-testing** (8) | prototyping-strategies, usability-testing, heuristic-evaluation, A/B-experiments, etc. | Process — distributed as conditional references | 0/8 absorbed |
| **design-ops** (9) | critique-frameworks, handoff-specs, sprint-planning, team-workflows, design-debt, impact-reporting, etc. | Process — distributed as conditional references | 0/9 absorbed |
| **designer-toolkit** (7) | design-rationale, presentations, case-studies, ux-writing, system-adoption, design-negotiation, etc. | Process — distributed as conditional references | 0/7 absorbed |

### Absorption Summary

| Sub-Skill | Absorbed Skills | Source |
|---|---|---|
| sk-design-visual | ~12 | ui-design (typography, hierarchy), visual-critique (brand, typography), standalone corpus |
| sk-design-color | ~8 | ui-design (color-system, dark-mode), design-systems (token, theming), visual-critique (color), colorize.md, oklch-skill.md |
| sk-design-motion | ~5 | interaction-design (animation-principles), design-systems (motion-system), standalone corpus (5 docs) |
| sk-design-layout | ~10 | ui-design (layout-grid, spacing, responsive, data-viz), design-systems (component-spec, pattern-library), visual-critique (composition), layout.md, apple-bento-grid-main |
| sk-design-a11y | ~6 | design-systems (accessibility-audit), interaction-design (error-handling, loading-states), standalone corpus (fixing-accessibility, audit, harden) |
| sk-design-interaction | ~14 | interaction-design (all 16 minus animation), visual-critique (affordance), ui-design (cognitive laws), interaction-design.md, delight.md |

### designer-skills-main Cognitive Laws

The interaction-design and ui-design plugins include **7 cognitive/UX laws**:
1. **Hick's Law** — reduce decision time by limiting choices
2. **Miller's Law** — chunk information into groups of ~4
3. **Fitts's Law** — size/position interactive targets
4. **Doherty Threshold** — system response < 400ms
5. **Aesthetic-Usability Effect** — polished = perceived usable
6. **Von Restorff Effect** — make important elements distinct
7. **Law of Proximity** — group related elements spatially
8. **Law of Common Region** — group using containers/backgrounds

**Recommendation**: These are **universal design principles**, not domain-specific. They should live in the **parent** `sk-design` shared references, not in any single sub-skill. Every sub-skill benefits from them.

### Process Content: Drop or Distribute?

The 5 process-oriented plugins (design-research, ux-strategy, prototyping-testing, design-ops, designer-toolkit) contain 46 skills focused on **design workflow** (research, strategy, testing, operations, presentation).

**Recommendation**: These are **NOT sub-skills** of `sk-design`. They are:
1. **Research/strategy** → Better handled by the existing `deep-research` and `deep-review` skills
2. **Testing/prototyping** → Better handled by `sk-code` verification phase
3. **Ops/handoff** → Better handled by `sk-doc` and `sk-git`
4. **Presentation** → Not a design sub-skill

**Drop these 46 skills from the taxonomy.** They represent a different axis of concern (design process workflow) that opencode already covers through other skills.

## Questions Answered
- How many designer-skills-main skills get absorbed? → ~55 of 97 (the craft-domain ones)
- Where do cognitive laws go? → Parent shared references
- What about process skills? → Drop (covered by existing opencode skills)

## Questions Remaining
- Exact parent router logic
- Progressive synthesis strategy
- Final convergence assessment

## Next Focus
Refine the parent router logic and analyze convergence signals.
