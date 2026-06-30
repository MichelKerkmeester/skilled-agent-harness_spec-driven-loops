---
title: "Research Synthesis: sk-design Parent Skill Restructuring"
description: "Deep-research synthesis (mimo25pro lineage, 8 iterations) over the external design-skills corpus to determine the optimal sub-skill taxonomy, structural model, and onboarding strategy for the sk-design family."
trigger_phrases:
  - "sk-design restructuring"
  - "design skill taxonomy"
  - "design parent skill"
importance_tier: important
contextType: research
_lineage:
  label: mimo25pro
  executor: cli-opencode
  model: xiaomi/mimo-v2.5-pro
  session_id: fanout-mimo25pro-1782386817945-6shco2
  iterations: 8
  convergence: reached (newInfoRatio trend 0.95→0.35, all questions answered)
---

# Research Synthesis: sk-design Parent Skill Restructuring

**Lineage**: mimo25pro (xiaomi/mimo-v2.5-pro) | **Iterations**: 8 | **Converged**: Yes

---

## 1. EXECUTIVE SUMMARY

This research determines how to restructure the existing `sk-design-interface` skill into a parent skill named `sk-design` that contains multiple focused design sub-skills. The analysis is grounded in the external design-skills corpus (41 standalone design-skill docs, the designer-skills-main 9-collection/97-skill model, and apple-bento-grid-main).

**Three deliverables**:

1. **Sub-skill taxonomy**: 6 children — visual, color, motion, layout, a11y, interaction
2. **Structural model**: Umbrella router over sibling family (not a single hub)
3. **Onboarding strategy**: 10-16 day effort with backward compatibility plan

---

## 2. SUB-SKILL TAXONOMY (6 Children)

### 2.1 sk-design-visual — Visual Identity & Aesthetics

**Scope**: Anti-default aesthetic choices, typography direction, palette direction, visual personality, brand vs product register, design brief inference, design system grounding.

**Boundaries**:
- OWNS: Aesthetic direction, typography selection, anti-default critique, design-read inference
- DOES NOT OWN: Specific color values (→ sk-design-color), animation (→ sk-design-motion), layout structure (→ sk-design-layout)
- HANDS OFF TO: sk-code for implementation, sk-design-color for palette execution

**Corpus Sources** (13 docs):
- Primary: taste-skill.md (600+ lines — three-dial system, brief inference, design system mapping, anti-default discipline, AI tells catalog)
- Aesthetic variants: gpt-tasteskill.md, minimalist-skill.md, brutalist-skill.md, bolder.md, quieter.md, soft-skill.md
- Design exploration: design-lab.md (920-line interview→variations→feedback workflow)
- Visual art: canvas-design.md, stitch-skill.md
- General improvement: make-interfaces-feel-better.md, bencium-innovative-ux-designer.md, emil-design-eng.md

**Existing Skill**: Evolves from `sk-design-interface` (rename + expand). sk-design-interface already covers palette, typography, layout, anti-default — this is the natural home.

**designer-skills-main Absorption**: ui-design plugin (typography-scale, visual-hierarchy, readable-measure, illustration-style, aesthetic-usability), visual-critique plugin (critique-visual-hierarchy, critique-brand-consistency, critique-typography)

---

### 2.2 sk-design-color — Color Systems & Tokens

**Scope**: Strategic color systems, OKLCH color space, palette generation, contrast checking, design token architecture, dark mode theming, tinted neutrals.

**Boundaries**:
- OWNS: Color strategy, palette generation, OKLCH conversion, contrast validation, token naming, dark mode token architecture
- DOES NOT OWN: Aesthetic direction of color (→ sk-design-visual), layout (→ sk-design-layout)
- CONSUMES: Brand direction from sk-design-visual to inform palette choices

**Corpus Sources** (2 docs):
- colorize.md (264 lines — strategic color introduction, 60-30-10 rule, OKLCH, tinted neutrals, live-mode variant params with `color-amount`)
- oklch-skill.md (90 lines — OKLCH conversion, palette generation, contrast checking, gamut handling, Tailwind v4 integration)

**Existing Skill**: NEW. Partial overlap with `sk-design-md-generator` (which extracts tokens) — sk-design-color handles strategy, md-generator handles extraction.

**designer-skills-main Absorption**: ui-design plugin (color-system, dark-mode-design), design-systems plugin (design-token, theming-system), visual-critique plugin (critique-color)

---

### 2.3 sk-design-motion — Motion & Animation

**Scope**: Purposeful animation, motion principles, micro-interactions, scroll-driven animation, motion performance, spring physics, GSAP patterns, CSS animations.

**Boundaries**:
- OWNS: Animation implementation, motion timing/easing, scroll-triggered animation, motion performance, reduced-motion handling
- DOES NOT OWN: State machine design (→ sk-design-interaction), aesthetic direction (→ sk-design-visual)
- OVERLAPS WITH: sk-design-interaction on micro-interactions (motion owns the animation, interaction owns the behavior)

**Corpus Sources** (5 docs):
- animate.md (208 lines — purposeful animation, register, assessment workflow)
- 12-principles-of-animation.md (248 lines — Disney's 12 principles adapted for web, timing/easing/physics/staging rules with file:line audit format)
- mastering-animate-presence.md (advanced AnimatePresence patterns)
- morphing-icons.md (icon animation techniques)
- fixing-motion-performance.md (motion performance debugging)
- taste-skill.md Section 5 (GSAP sticky-stack, horizontal-pan, scroll-reveal canonical skeletons)

**Existing Skill**: NEW. Some motion content exists in sk-design-interface references.

**designer-skills-main Absorption**: interaction-design plugin (animation-principles, micro-interaction-spec), design-systems plugin (motion-system)

---

### 2.4 sk-design-layout — Layout & Structure

**Scope**: Spacing systems, rhythm, grid layouts, responsive structure, bento grids, visual hierarchy, typography scale, section composition.

**Boundaries**:
- OWNS: Spatial design, grid systems, responsive breakpoints, section layout families, bento grid patterns
- DOES NOT OWN: Color of surfaces (→ sk-design-color), animation of layout changes (→ sk-design-motion), aesthetic direction (→ sk-design-visual)
- CONSUMES: Visual direction from sk-design-visual to inform layout personality (symmetric vs asymmetric)

**Corpus Sources** (2 docs + 1 system):
- layout.md (168 lines — spacing, rhythm, grouping, alignment, visual hierarchy, brand vs product register)
- apple-bento-grid-main/ (complete bento grid system with design-system.md, evals, examples, scripts)
- taste-skill.md Sections 3, 4.3, 4.7 (layout discipline, anti-center bias, hero rules, bento rules, section-repetition bans)

**Existing Skill**: NEW. Layout content is scattered across sk-design-interface references.

**designer-skills-main Absorption**: ui-design plugin (layout-grid, spacing-system, responsive-design, data-visualization, von-restorff-effect, law-of-proximity, law-of-common-region), design-systems plugin (component-spec, pattern-library, icon-system), visual-critique plugin (critique-composition, critique-information-density)

---

### 2.5 sk-design-a11y — Accessibility & Quality

**Scope**: ARIA labels, keyboard navigation, focus management, WCAG compliance, contrast checking, semantic HTML, production hardening, edge cases, error states, internationalization.

**Boundaries**:
- OWNS: Accessibility audit/fix, WCAG compliance, keyboard nav, focus management, production hardening, edge cases
- DOES NOT OWN: Color contrast strategy (→ sk-design-color), motion accessibility (→ sk-design-motion)
- CROSS-CUTS: Every sub-skill should honor a11y — this skill provides the audit/fix capability

**Corpus Sources** (6 docs):
- fixing-accessibility.md (136 lines — ARIA, keyboard, focus, semantics, forms, announcements, contrast — rule categories by priority)
- audit.md (139 lines — technical quality audit across 5 dimensions: a11y, performance, theming, responsive, anti-patterns)
- baseline.md (quality baseline establishment)
- polish.md (248 lines — final quality pass, design system alignment, pre-polish assessment)
- impeccable.md (186 lines — production-grade interface design, setup workflow)
- harden.md (354 lines — edge cases, empty states, error states, i18n, network resilience)

**Existing Skill**: NEW. No existing a11y-specific skill.

**designer-skills-main Absorption**: design-systems plugin (accessibility-audit, localization-design), interaction-design plugin (error-handling-ux, loading-states), visual-critique plugin (critique-affordance)

---

### 2.6 sk-design-interaction — Interaction & Feedback

**Scope**: State machines, gesture patterns, tactile feedback, loading/empty/error states, form design, navigation patterns, search UX, onboarding, cognitive load laws.

**Boundaries**:
- OWNS: Interaction behavior, state transitions, gesture design, feedback patterns, form design, navigation
- DOES NOT OWN: Animation implementation (→ sk-design-motion), visual design (→ sk-design-visual), layout (→ sk-design-layout)
- OVERLAPS WITH: sk-design-motion on micro-interactions (interaction owns behavior, motion owns animation)

**Corpus Sources** (4 docs + designer-skills-main):
- interaction-design.md (320 lines — micro-interactions, timing, easing, state transitions, page transitions, feedback patterns, gestures, CSS animations)
- pseudo-elements.md (CSS pseudo-element effects for interaction polish)
- delight.md (309 lines — personality moments, emotional UX, success states, empty states)
- overdrive.md (advanced interaction effects)

**Existing Skill**: NEW. Some interaction content in sk-design-interface references.

**designer-skills-main Absorption**: interaction-design plugin (state-machine, gesture-patterns, feedback-patterns, form-design, onboarding-design, navigation-patterns, search-ux, hicks-law, millers-law, fitts-law, doherty-threshold)

---

## 3. STRUCTURAL MODEL EVIDENCE

### 3.1 Recommendation: Umbrella Router over Sibling Family

The `sk-design` parent should be a **thin router/dispatcher** that detects design intent and dispatches to the appropriate sub-skill. Sub-skills are **independent skills** with their own SKILL.md, references, and assets.

### 3.2 Evidence

| # | Evidence | Source |
|---|---|---|
| 1 | Each corpus doc is self-contained by design (YAML frontmatter, Register pattern, workflow, prohibitions) | All 43 external docs |
| 2 | Hub pattern works for 2-3 surfaces (sk-code) but fails for 5-7 with different workflows | sk-code SKILL.md analysis |
| 3 | Each domain has fundamentally different workflows (color palette ≠ motion audit ≠ a11y fix) | Corpus workflow analysis |
| 4 | deep-loop-workflows is the opencode precedent for umbrella-over-siblings | .opencode/skills/deep-loop-workflows/ |
| 5 | designer-skills-main uses 9 independent plugins (not a hub) | designer-skills-main README |
| 6 | Loose coupling between domains; high-coupling pairs handled by cross-references | Coupling analysis (iteration 1) |

### 3.3 Why NOT a Single Hub

| Criterion | Hub (rejected) | Umbrella (accepted) |
|---|---|---|
| Sub-domains | 5-7 modes in 1 SKILL.md | 5-7 independent skills |
| SKILL.md size | 3000+ lines | 200-400 lines each |
| Routing complexity | High (7-way intent) | Low (parent dispatches) |
| Independent development | No (monolith) | Yes |
| Corpus alignment | Poor (docs are standalone) | Strong (1 doc ≈ 1 skill) |
| Existing pattern match | sk-code (2 surfaces) | deep-loop-workflows (5 children) |

### 3.4 Parent: Shared Resources

The parent holds:
1. **Router logic**: Intent detection → sub-skill dispatch (priority-ordered keyword detection, default to sk-design-visual)
2. **Design principles**: Anti-default discipline, brand/product register pattern, design-read protocol
3. **Cognitive laws**: Hick's, Miller's, Fitts's, Doherty Threshold, Aesthetic-Usability, Von Restorff, Proximity, Common Region
4. **Conventions**: Family YAML frontmatter format, verification workflow, naming rules

---

## 4. ONBOARDING & BACKWARD COMPATIBILITY

### 4.1 Per-Child Onboarding

| Sub-skill | Effort | Type | Key Actions |
|---|---|---|---|
| sk-design (parent) | 1 day | NEW | Create router SKILL.md, shared references, cognitive laws |
| sk-design-visual | 2-3 days | RENAME + EXPAND | Rename from sk-design-interface, fold in taste-skill.md content, extract domain content to siblings |
| sk-design-color | 1-2 days | NEW | Create from colorize.md + oklch-skill.md, integrate with md-generator token extraction |
| sk-design-motion | 2-3 days | NEW | Create from animate.md + 12-principles.md + GSAP skeletons from taste-skill.md |
| sk-design-layout | 1-2 days | NEW | Create from layout.md + apple-bento-grid-main, pull layout discipline from taste-skill.md |
| sk-design-a11y | 1-2 days | NEW | Create from fixing-accessibility.md + audit.md + harden.md |
| sk-design-interaction | 2-3 days | NEW | Create from interaction-design.md + delight.md + designer-skills-main interaction-design |
| sk-design-md-generator | 0.5 days | UPDATE | Add family relationship, cross-reference to sk-design-color |
| **Total** | **10-16 days** | | |

### 4.2 Backward Compatibility Strategy

1. **Compatibility aliases**: Keep `sk-design-interface` as a thin redirect to `sk-design-visual` for 28 days (migration window)
2. **Advisor rebuild**: Run `mk_skill_advisor_skill_graph_scan` after all changes
3. **Reference updates**: Update any spec folders, commands, or agents that reference `sk-design-interface` by name
4. **Deprecation notices**: Add deprecation notice to old skill directory

### 4.3 designer-skills-main Absorption

Of the 97 skills in designer-skills-main:
- **~55 absorbed** into the 6 sub-skills (craft-domain skills)
- **~46 dropped** (process skills covered by existing opencode skills: deep-research, deep-review, sk-code, sk-doc, sk-git)
- **8 cognitive laws** go to parent shared references

---

## 5. OPEN QUESTIONS FOR 002-ARCHITECTURE-DECISION

1. **Sub-skill count confirmation**: 6 is recommended; 5 (merge motion+interaction) is a viable alternative
2. **Process sub-skill**: Should there be a 7th sub-skill for design process (critique, redesign, iteration)?
3. **Parent routing precision**: Should the parent use keyword detection or a more sophisticated intent classifier?
4. **Compatibility alias duration**: 28 days is proposed; longer/shorter?
5. **sk-design-md-generator integration**: Should extracted tokens flow directly into sk-design-color?

---

## 6. REFERENCES

### Corpus Sources
- 41 standalone design-skill docs at `../external/`
- designer-skills-main (97 skills, 30 commands, 9 plugins) at `../external/designer-skills-main/`
- apple-bento-grid-main at `../external/apple-bento-grid-main/`

### Existing Skills
- `sk-design-interface` at `.opencode/skills/sk-design-interface/`
- `sk-design-md-generator` at `.opencode/skills/sk-design-md-generator/`

### Precedent Skills
- `deep-loop-workflows` at `.opencode/skills/deep-loop-workflows/` (umbrella pattern)
- `sk-code` at `.opencode/skills/sk-code/` (hub pattern — rejected for this use case)

### Research Artifacts
- Per-lineage state: `research/lineages/mimo25pro/deep-research-state.jsonl`
- Iteration details: `research/lineages/mimo25pro/iterations/iteration-001.md` through `iteration-008.md`
