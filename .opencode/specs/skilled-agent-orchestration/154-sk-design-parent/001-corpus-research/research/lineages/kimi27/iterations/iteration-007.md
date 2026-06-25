# Iteration 7: Final taxonomy, corpus-source assignment, and convergence

## Focus

Lock the 4–7 child taxonomy, assign corpus sources to each child, define boundaries, and confirm convergence.

## Findings

1. **Final recommended taxonomy: 6 children.**

   | Child | Scope | Boundaries | Primary Corpus Sources |
   | ----- | ----- | ---------- | ---------------------- |
   | `sk-design-direction` | Brief inference, taste/archetype selection, anti-default discipline, real-system mapping, interface writing, variation diversity. | Does **not** implement tokens, grids, or animations; sets the aesthetic lane and hands off to foundations/motion/critique. | `sk-design-interface` (vendored Anthropic frontend-design) [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:1]; `taste-skill.md` [SOURCE: file:external/taste-skill.md:1-120]; `soft-skill.md` [SOURCE: file:external/soft-skill.md:1-98]; `bolder.md` [SOURCE: file:external/bolder.md:1-120]; `brutalist-skill.md` [SOURCE: file:external/brutalist-skill.md:1-92]; `minimalist-skill.md` [SOURCE: file:external/minimalist-skill.md:1-85]; `delight.md` [SOURCE: file:external/delight.md:1-120]; `redesign-skill.md` [SOURCE: file:external/redesign-skill.md:1-120]; designer-skills `ux-strategy/design-brief` [SOURCE: file:external/designer-skills-main/ux-strategy/skills/design-brief/SKILL.md:1] and `designer-toolkit/ux-writing` [SOURCE: file:external/designer-skills-main/designer-toolkit/skills/ux-writing/SKILL.md:1]. |
   | `sk-design-foundations` | Color systems, typography scales, layout/grid, spacing systems, design tokens, OKLCH, dark mode. | Does **not** choose aesthetic lane (direction) or implement motion (motion); supplies the token/system layer that realizes the direction. | designer-skills `ui-design` cluster (`color-system` [SOURCE], `typography-scale` [SOURCE], `layout-grid` [SOURCE], `spacing-system`, `responsive-design`, `dark-mode-design`, `visual-hierarchy`) [SOURCE: file:external/designer-skills-main/ui-design/skills/color-system/SKILL.md:1]; designer-skills `design-systems` cluster (`design-token` [SOURCE], `naming-convention`, `theming-system`, `icon-system`, `component-spec`, `pattern-library`) [SOURCE: file:external/designer-skills-main/design-systems/skills/design-token/SKILL.md:1]; `colorize.md` [SOURCE: file:external/colorize.md:1-120]; `oklch-skill.md` [SOURCE: file:external/oklch-skill.md:1-90]; `layout.md` [SOURCE: file:external/layout.md:1-120]. |
   | `sk-design-motion` | Purposeful animation, micro-interactions, feedback/loading states, motion performance, reduced motion. | Does **not** set aesthetic lane; executes motion within the direction's intensity dial and quality floor. | designer-skills `interaction-design` cluster (`animation-principles` [SOURCE], `micro-interaction-spec` [SOURCE], `feedback-patterns` [SOURCE], `loading-states` [SOURCE], `navigation-patterns`, `gesture-patterns`, `state-machine`, `error-handling-ux`, `form-design`) [SOURCE: file:external/designer-skills-main/interaction-design/skills/animation-principles/SKILL.md:1]; `animate.md` [SOURCE: file:external/animate.md:1-120]; `12-principles-of-animation.md` [SOURCE: file:external/12-principles-of-animation.md:1-120]; `fixing-motion-performance.md` [SOURCE: file:external/fixing-motion-performance.md:1-120]; `mastering-animate-presence.md` [SOURCE: file:external/mastering-animate-presence.md:1-120]; `morphing-icons.md` [SOURCE: file:external/morphing-icons.md:1-120]; `make-interfaces-feel-better.md` (animation section) [SOURCE: file:external/make-interfaces-feel-better.md:1-120]; `overdrive.md` (advanced, user-confirmed) [SOURCE: file:external/overdrive.md:1-120]. |
   | `sk-design-critique` | Structured design critique, heuristic evaluation, accessibility audit, polish pass, copy clarity. | Does **not** invent new direction; evaluates existing UI against standards and the direction set by `sk-design-direction`. | designer-skills `visual-critique` cluster (`critique-composition` [SOURCE], `critique-color` [SOURCE], `critique-typography` [SOURCE], `critique-brand-consistency`, `critique-affordance`, `critique-information-density`, `critique-visual-hierarchy`) [SOURCE: file:external/designer-skills-main/visual-critique/skills/critique-composition/SKILL.md:1]; designer-skills `prototyping-testing/heuristic-evaluation` [SOURCE]; designer-skills `design-systems/accessibility-audit` [SOURCE]; `critique.md` [SOURCE: file:external/critique.md:1-120]; `audit.md` [SOURCE: file:external/audit.md:1-120]; `fixing-accessibility.md` [SOURCE: file:external/fixing-accessibility.md:1-120]; `polish.md` [SOURCE: file:external/polish.md:1-120]; `clarify.md` [SOURCE: file:external/clarify.md:1-120]; `make-interfaces-feel-better.md` (typography/surfaces sections) [SOURCE]. |
   | `sk-design-system` | Live-website CSS extraction into v3 Style Reference `DESIGN.md`, token fidelity, validation. | Does **not** invent new design; captures existing systems. Folds `sk-design-md-generator`. | `sk-design-md-generator` [SOURCE: file:.opencode/skills/sk-design-md-generator/SKILL.md:1]; designer-skills `design-systems` cluster (`design-token-audit`, `design-system-adoption`, `documentation-template`, `design-system-governance`) [SOURCE: file:external/designer-skills-main/design-systems/skills/design-token/SKILL.md:1]. |
   | `sk-design-presentation` | Visual-summary output formats: Apple-style bento grids, HTML slides, Slidev decks. | Narrow, output-format child; does not replace direction or foundations for general UI. | `apple-bento-grid-main/SKILL.md` [SOURCE: file:external/apple-bento-grid-main/SKILL.md:1-203]; `apple-bento-grid-main/design-system.md` [SOURCE: file:external/apple-bento-grid-main/design-system.md:1-120]; `frontend-slides.md` [SOURCE: file:external/frontend-slides.md:1-120]; `slidev.md` [SOURCE: file:external/slidev.md:1-120]. |

2. **Key boundary rules to prevent overlap.**
   - Direction owns *what* aesthetic lane; foundations own *the token system* that implements it; motion owns *how* things move; critique owns *whether* the result meets standards.
   - Real-world reference grounding (Mobbin/Refero) stays in direction because it informs the aesthetic default to deviate from.
   - Quality floor (responsive, accessible, reduced-motion) is referenced by direction during invention but audited by critique.
   - `sk-design-system` is the only child that touches live URLs/Playwright; all other children are design-guidance only.

3. **Corpus sources not assigned to a child.**
   - `output-skill.md` — generic output utility, excluded.
   - `ui-skills-root.md` — is itself a routing layer; could inform the parent's `family-registry.json` design but is not a child.
   - Standalone docs such as `adapt.md`, `distill.md`, `quieter.md`, `canvas-design.md`, `harden.md`, `stitch-skill.md`, `baseline.md`, `emil-design-eng.md`, `bencium-innovative-ux-designer.md`, `gpt-tasteskill.md`, etc. were not deep-read in this lineage. They likely fit under direction, foundations, or critique based on their titles; a second pass could refine assignments.

4. **Convergence assessment.**
   - All five key questions are now answered (structural model, existing-skill mapping, onboarding/back-compat, taxonomy, corpus-source assignment).
   - `newInfoRatio` has trended downward (1.0 → 0.85 → 0.75 → 0.70 → 0.65 → 0.60 → ~0.55), indicating diminishing returns.
   - No stuck state; no blocked stops.
   - Iteration cap is 7; this is the final iteration. Stop reason will be `maxIterationsReached` with a convergence note.

## Sources Consulted

- All sources from Iterations 1–6.
- `external/make-interfaces-feel-better.md` (first 120 lines)
- `external/pseudo-elements.md` (first 120 lines)
- `external/redesign-skill.md` (first 120 lines)

## Assessment

- **newInfoRatio**: 0.55
- **noveltyJustification**: Final taxonomy table and boundary rules consolidate prior iterations; remaining corpus docs are lower-priority refinements.
- **status**: complete

## Reflection

- **What worked**: Building the taxonomy iteratively by discipline (direction → foundations → motion → critique → system → presentation) kept boundaries clear.
- **What failed**: None.
- **Ruled out**: A 5-child taxonomy without a presentation child; presentation output formats are distinct enough to warrant their own packet given the corpus.

## Recommended Next Focus

Proceed to phase_synthesis and produce `research.md` with the final taxonomy, structural-model evidence, and back-compat/onboarding plan.
