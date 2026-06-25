# Iteration 3: Sub-Skill Taxonomy Draft

## Focus
Draft the optimal 5-6 sub-skill taxonomy with scope, boundaries, corpus source mapping, and onboarding implications for each candidate.

## Actions Taken
1. Read remaining corpus docs (impeccable.md, harden.md, delight.md, stitch-skill.md) for boundary analysis
2. Cross-referenced designer-skills-main plugin skills against standalone corpus clusters
3. Analyzed existing sk-design-interface and sk-design-md-generator for refactoring scope
4. Drafted 6-candidate taxonomy with scope/boundaries/sources per child

## Findings

### Proposed Taxonomy: 6 Sub-Skills

The evidence supports **6 sub-skills** under the `sk-design` umbrella. This is the sweet spot: enough granularity for focused expertise, few enough to be discoverable.

---

#### 1. `sk-design-visual` — Visual Identity & Aesthetics

**Scope**: Anti-default aesthetic choices, typography direction, palette direction, visual personality, brand vs product register, design brief inference, design system grounding.

**Boundaries**:
- OWNS: Aesthetic direction, typography selection, anti-default critique, design-read inference
- DOES NOT OWN: Specific color values (→ sk-design-color), animation (→ sk-design-motion), layout structure (→ sk-design-layout)
- HANDS OFF TO: sk-code for implementation, sk-design-color for palette execution

**Corpus Sources**:
| Source | What it contributes |
|---|---|
| taste-skill.md (600+ lines) | Core anti-default discipline, three-dial system (variance/motion/density), brief inference, design system mapping |
| gpt-tasteskill.md | Variant taste perspective |
| minimalist-skill.md | Minimalist aesthetic direction |
| brutalist-skill.md | Brutalist aesthetic direction |
| bolder.md | Making designs bolder |
| quieter.md | Making designs quieter |
| soft-skill.md | Soft aesthetic direction |
| make-interfaces-feel-better.md | General feel improvement |
| bencium-innovative-ux-designer.md | Innovative UX direction |
| emil-design-eng.md | Design engineering perspective |
| design-lab.md | Design exploration workflow (interview → variations → feedback) |
| canvas-design.md | Visual art/philosophy creation |
| stitch-skill.md | Google Stitch design system generation |

**Existing Skill**: Evolves from `sk-design-interface` (rename + expand with corpus content). sk-design-interface already covers palette, typography, layout, anti-default — this is the natural home.

**Onboarding**: Rename sk-design-interface → sk-design-visual. Fold in taste-skill.md's three-dial system and brief inference. Add design-lab.md's exploration workflow as a conditional reference.

---

#### 2. `sk-design-color` — Color Systems & Tokens

**Scope**: Strategic color systems, OKLCH color space, palette generation, contrast checking, design token architecture, dark mode theming, tinted neutrals.

**Boundaries**:
- OWNS: Color strategy, palette generation, OKLCH conversion, contrast validation, token naming, dark mode token architecture
- DOES NOT OWN: Aesthetic direction of color (→ sk-design-visual), layout (→ sk-design-layout), motion color (→ sk-design-motion)
- CONSUMES: Brand direction from sk-design-visual to inform palette choices

**Corpus Sources**:
| Source | What it contributes |
|---|---|
| colorize.md (264 lines) | Strategic color introduction, 60-30-10 rule, OKLCH, tinted neutrals, live-mode variant params |
| oklch-skill.md (90 lines) | OKLCH conversion, palette generation, contrast checking, gamut handling, Tailwind v4 integration |

**Existing Skill**: Partial overlap with `sk-design-md-generator` (which extracts tokens). No rename needed — this is a NEW skill.

**Onboarding**: Create from scratch. Pull color sections from taste-skill.md's Section 4.2 (Color Calibration) as shared reference. The `colorize.md` live-mode variant params (`color-amount`) are a strong pattern to preserve.

---

#### 3. `sk-design-motion` — Motion & Animation

**Scope**: Purposeful animation, motion principles, micro-interactions, scroll-driven animation, motion performance, spring physics, GSAP patterns, CSS animations.

**Boundaries**:
- OWNS: Animation implementation, motion timing/easing, scroll-triggered animation, motion performance, reduced-motion handling
- DOES NOT OWN: State machine design (→ sk-design-interaction), aesthetic direction (→ sk-design-visual), interaction feedback (→ sk-design-interaction)
- OVERLAPS WITH: sk-design-interaction on micro-interactions (motion owns the animation, interaction owns the behavior)

**Corpus Sources**:
| Source | What it contributes |
|---|---|
| animate.md (208 lines) | Purposeful animation, register (brand vs product), assessment workflow |
| 12-principles-of-animation.md (248 lines) | Disney's 12 principles adapted for web, timing/easing/physics/staging rules |
| mastering-animate-presence.md | Advanced AnimatePresence patterns |
| morphing-icons.md | Icon animation techniques |
| fixing-motion-performance.md | Motion performance debugging |
| taste-skill.md Section 5 | GSAP sticky-stack, horizontal-pan, scroll-reveal skeletons |

**Existing Skill**: NEW skill. Some motion content exists in sk-design-interface's references but not as a standalone.

**Onboarding**: Create from scratch. The taste-skill.md GSAP skeletons (Section 5.A-5.D) are directly portable. The 12-principles audit format (file:line findings) is a strong pattern.

---

#### 4. `sk-design-layout` — Layout & Structure

**Scope**: Spacing systems, rhythm, grid layouts, responsive structure, bento grids, visual hierarchy, typography scale, section composition.

**Boundaries**:
- OWNS: Spatial design, grid systems, responsive breakpoints, section layout families, bento grid patterns
- DOES NOT OWN: Color of surfaces (→ sk-design-color), animation of layout changes (→ sk-design-motion), aesthetic direction (→ sk-design-visual)
- CONSUMES: Visual direction from sk-design-visual to inform layout personality (symmetric vs asymmetric)

**Corpus Sources**:
| Source | What it contributes |
|---|---|
| layout.md (168 lines) | Spacing, rhythm, grouping, alignment, visual hierarchy, brand vs product register |
| apple-bento-grid-main/ | Complete bento grid system with design-system.md, evals, examples, scripts |
| taste-skill.md Sections 3, 4.3, 4.7 | Layout discipline, anti-center bias, hero rules, bento rules, section-repetition bans |

**Existing Skill**: NEW skill. Layout content is scattered across sk-design-interface references.

**Onboarding**: Create from scratch. apple-bento-grid-main provides a complete reference system. taste-skill.md's Section 4.7 (Layout Discipline) hard rules are directly portable.

---

#### 5. `sk-design-a11y` — Accessibility & Quality

**Scope**: ARIA labels, keyboard navigation, focus management, WCAG compliance, contrast checking, semantic HTML, production hardening, edge cases, error states, internationalization.

**Boundaries**:
- OWNS: Accessibility audit/fix, WCAG compliance, keyboard nav, focus management, production hardening, edge cases
- DOES NOT OWN: Color contrast strategy (→ sk-design-color), motion accessibility (→ sk-design-motion), visual critique (→ sk-design-visual)
- CROSS-CUTS: Every sub-skill should honor a11y — this skill provides the audit/fix capability, not the rules (which are distributed)

**Corpus Sources**:
| Source | What it contributes |
|---|---|
| fixing-accessibility.md (136 lines) | ARIA, keyboard, focus, semantics, forms, announcements, contrast — rule categories by priority |
| audit.md (139 lines) | Technical quality audit across 5 dimensions (a11y, performance, theming, responsive, anti-patterns) |
| baseline.md | Quality baseline establishment |
| polish.md (248 lines) | Final quality pass, design system alignment, pre-polish assessment |
| impeccable.md (186 lines) | Production-grade interface design, setup workflow |
| harden.md (354 lines) | Edge cases, empty states, error states, i18n, network resilience |

**Existing Skill**: NEW skill. No existing a11y-specific skill.

**Onboarding**: Create from scratch. fixing-accessibility.md's priority-based rule categories are the core. harden.md's edge-case testing patterns add production depth.

---

#### 6. `sk-design-interaction` — Interaction & Feedback

**Scope**: State machines, gesture patterns, tactile feedback, loading/empty/error states, form design, navigation patterns, search UX, onboarding, cognitive load laws.

**Boundaries**:
- OWNS: Interaction behavior, state transitions, gesture design, feedback patterns, form design, navigation
- DOES NOT OWN: Animation implementation (→ sk-design-motion), visual design (→ sk-design-visual), layout (→ sk-design-layout)
- OVERLAPS WITH: sk-design-motion on micro-interactions (interaction owns behavior, motion owns animation)

**Corpus Sources**:
| Source | What it contributes |
|---|---|
| interaction-design.md (320 lines) | Micro-interactions, timing, easing, state transitions, page transitions, feedback patterns, gestures, CSS animations |
| pseudo-elements.md | CSS pseudo-element effects for interaction polish |
| delight.md (309 lines) | Personality moments, emotional UX, success states, empty states |
| overdrive.md | Advanced interaction effects |
| designer-skills-main/interaction-design/ | 16 skills: state-machine, gesture-patterns, error-handling-ux, loading-states, feedback-patterns, Hick's/Miller's/Fitts's laws, form-design, onboarding, navigation, search-ux |

**Existing Skill**: NEW skill. Some interaction content in sk-design-interface references.

**Onboarding**: Create from scratch. interaction-design.md is the core. delight.md adds the emotional layer. designer-skills-main's cognitive laws (Hick's, Miller's, Fitts's) are strong additions.

---

### Parent: `sk-design` — Router & Shared Resources

**Scope**: Intent detection, sub-skill dispatch, shared design principles, brand/product register pattern, family-wide conventions.

**Shared Resources at Parent Level**:
1. `references/design-principles/` — Anti-default discipline (from sk-design-interface), brand vs product register pattern (from corpus)
2. `references/conventions/` — YAML frontmatter format, verification workflow, family naming conventions
3. Router logic — Intent detection → sub-skill dispatch (lightweight, similar to deep-loop-workflows)

**What the Parent Does NOT Do**:
- Does not contain domain-specific design judgment (that lives in children)
- Does not implement any design work (hands off to children)
- Does not duplicate children's references

---

### Sub-Skill Count Rationale: Why 6, Not 4 or 7

**Against 4** (merge motion+interaction, merge a11y+layout):
- Motion and interaction have different primary concerns (physics vs behavior)
- A11y and layout are completely unrelated domains
- Merging loses the focused expertise that makes sub-skills valuable

**Against 7** (split visual into aesthetic + process):
- Process (critique, redesign, iteration) is cross-cutting — every sub-skill does its own critique
- The standalone process docs (critique.md, clarify.md, distill.md) are better as conditional references within each sub-skill than as a separate sub-skill
- 7 starts to feel like too many for discoverability

**For 6**:
- Each maps to a clear design domain with distinct expertise
- Each has 2-13 corpus sources (sufficient evidence)
- Each has a clear "when to use" trigger
- 6 is within the 4-7 range specified by the parent spec

## Questions Answered
- Optimal sub-skill count? → 6
- What are the 6 sub-skills? → visual, color, motion, layout, a11y, interaction
- How does sk-design-interface fold in? → Renamed to sk-design-visual, expanded with corpus
- How does sk-design-md-generator fold in? → Stays as-is (extraction engine), consumed by sk-design-color
- What goes in the parent? → Router + shared principles + conventions

## Questions Remaining
- Should process docs (critique, redesign) be a 7th sub-skill or distributed?
- How to handle the designer-skills-main cognitive laws (Hick's, Miller's, Fitts's)?
- What's the exact routing logic for the parent?

## Next Focus
Analyze onboarding and backward-compatibility implications for each sub-skill, especially the rename of sk-design-interface and the relationship with sk-design-md-generator.
