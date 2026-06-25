# Iteration 1: Survey the `designer-skills-main` plugin taxonomy and standalone doc titles

## Focus

Map the external corpus into high-level clusters to seed a 4–7 child taxonomy for `sk-design`.

## Findings

1. **Designer-skills-main is organized into 9 plugins** (41+97 model). [SOURCE: file:external/designer-skills-main/CHANGELOG.md:12]
   - `design-research` — user personas, interviews, journey maps, usability tests, surveys, card sorts, diary studies, research repositories.
   - `design-systems` — design tokens, naming conventions, icon systems, motion systems, theming, component specs, pattern libraries, governance, accessibility audits, localization.
   - `ux-strategy` — design briefs, business design, competitive analysis, content strategy, opportunity frameworks, north-star vision, service blueprints, information architecture, stakeholder alignment, metrics.
   - `ui-design` — color system, typography scale, layout grid, spacing system, visual hierarchy, responsive design, dark mode, aesthetic usability, illustration style, von Restorff effect, Gestalt laws (proximity, common region).
   - `interaction-design` — navigation patterns, micro-interaction spec, animation principles, gesture patterns, loading states, onboarding, search UX, feedback patterns, form design, state machines, Fitts/Hicks/Miller laws, Doherty threshold, interfaces-that-feel.
   - `prototyping-testing` — wireframe specs, prototype strategy, test scenarios, heuristic evaluation, accessibility test plans, click tests, A/B tests, user-flow diagrams.
   - `design-ops` — handoff specs, design sprint plans, design critiques, review processes, impact reporting, team workflows, version-control strategy, design-debt audits, design-QA checklists.
   - `designer-toolkit` — UX writing, design rationale, design negotiation, presentation decks, case studies, design-system adoption, design-token audits.
   - `visual-critique` — composition, color, typography, brand consistency, affordance, information density, visual hierarchy critique.

2. **Representative skill scopes confirm discipline boundaries.**
   - `color-system` builds brand/semantic/accessibility-compliant palettes. [SOURCE: file:external/designer-skills-main/ui-design/skills/color-system/SKILL.md:1]
   - `typography-scale` defines modular size/weight/line-height scales. [SOURCE: file:external/designer-skills-main/ui-design/skills/typography-scale/SKILL.md:1]
   - `layout-grid` defines responsive grids, gutters, breakpoints. [SOURCE: file:external/designer-skills-main/ui-design/skills/layout-grid/SKILL.md:1]
   - `micro-interaction-spec` specifies trigger/rules/feedback/loops for motion. [SOURCE: file:external/designer-skills-main/interaction-design/skills/micro-interaction-spec/SKILL.md:1]
   - `critique-composition` evaluates balance, whitespace, rhythm, Gestalt. [SOURCE: file:external/designer-skills-main/visual-critique/skills/critique-composition/SKILL.md:1]
   - `design-token` organizes global/alias/component tokens. [SOURCE: file:external/designer-skills-main/design-systems/skills/design-token/SKILL.md:1]
   - `ux-writing` writes microcopy, errors, empty states, CTAs. [SOURCE: file:external/designer-skills-main/designer-toolkit/skills/ux-writing/SKILL.md:1]
   - `design-brief` defines problem/audience/constraints/success criteria. [SOURCE: file:external/designer-skills-main/ux-strategy/skills/design-brief/SKILL.md:1]

3. **Standalone docs surface additional, often more opinionated, craft lenses.**
   - `ui-skills-root.md` is a routing layer that prefers the *smallest useful skill* (1 skill, max 3). [SOURCE: file:external/ui-skills-root.md:1]
   - `taste-skill.md` is an anti-slop frontend skill focused on landing pages/portfolios/redesigns; it uses explicit dials (DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY) and real-system mapping. [SOURCE: file:external/taste-skill.md:1]
   - `layout.md` is a layout-fix skill emphasizing spacing rhythm, hierarchy, and grid-breaking. [SOURCE: file:external/layout.md:1]

4. **Initial coarse taxonomy hypothesis (5–6 children):**
   - `sk-design-direction` — taste, style, anti-default direction, brief/audience grounding.
   - `sk-design-foundations` — color, typography, spacing, tokens, layout/grid, dark mode.
   - `sk-design-motion` — animation principles, micro-interactions, motion performance, transitions.
   - `sk-design-critique` — visual/UX critique, accessibility audit, quality floor.
   - `sk-design-system` — design-system extraction, token fidelity, DESIGN.md generation (folds `sk-design-md-generator`).
   - `sk-design-presentation` — bento grids, slides, decks, visual summaries (optional, narrow).

## Sources Consulted

- `external/designer-skills-main/CHANGELOG.md`
- `external/designer-skills-main/ui-design/skills/color-system/SKILL.md`
- `external/designer-skills-main/ui-design/skills/typography-scale/SKILL.md`
- `external/designer-skills-main/ui-design/skills/layout-grid/SKILL.md`
- `external/designer-skills-main/interaction-design/skills/micro-interaction-spec/SKILL.md`
- `external/designer-skills-main/visual-critique/skills/critique-composition/SKILL.md`
- `external/designer-skills-main/ux-strategy/skills/design-brief/SKILL.md`
- `external/designer-skills-main/design-systems/skills/design-token/SKILL.md`
- `external/designer-skills-main/design-research/skills/user-persona/SKILL.md`
- `external/designer-skills-main/designer-toolkit/skills/ux-writing/SKILL.md`
- `external/ui-skills-root.md`
- `external/taste-skill.md` (first 120 lines)
- `external/layout.md` (first 120 lines)

## Assessment

- **newInfoRatio**: 1.0
- **noveltyJustification**: First pass; establishes the 9-plugin map and an initial candidate taxonomy.
- **status**: complete

## Reflection

- **What worked**: Reading the CHANGELOG plus one skill per plugin quickly exposed the discipline boundaries.
- **What failed**: None.
- **Ruled out**: None yet.

## Recommended Next Focus

Iteration 2: Deep-read the visual/style standalone docs (taste, delight, polish, soft, bolder, brutalist, minimalist, colorize, oklch) to refine the `sk-design-direction` / `sk-design-foundations` boundary.
