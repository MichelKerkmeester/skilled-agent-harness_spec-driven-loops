# Iteration 1: Corpus Categorization and Domain Mapping

## Focus
Full scan of the external design-skills corpus (43 documents) to identify natural design domain clusters that could inform sub-skill boundaries.

## Actions Taken
1. Read all 41 standalone design-skill docs (headers, descriptions, key sections)
2. Read designer-skills-main README for the 9-collection/97-skill model structure
3. Read apple-bento-grid-main for layout system patterns
4. Read existing sk-design-interface and sk-design-md-generator skills for overlap analysis

## Findings

### Domain Cluster Analysis

The 43 corpus documents cluster into **7 natural design domains**:

#### 1. Visual Identity & Aesthetics (8 docs)
- **Docs**: taste-skill.md, gpt-tasteskill.md, bolder.md, quieter.md, soft-skill.md, minimalist-skill.md, brutalist-skill.md, make-interfaces-feel-better.md
- **Also touches**: bencium-innovative-ux-designer.md, emil-design-eng.md
- **Core concern**: Anti-default aesthetic choices, typography, palette, visual personality
- **Overlap with existing**: HEAVY overlap with sk-design-interface (which already covers palette, typography, anti-default critique)
- **Corpus signal**: These docs are essentially the "taste" layer — they define what looks good and why

#### 2. Color & Tokens (3 docs)
- **Docs**: colorize.md, oklch-skill.md, (palette sections of taste-skill.md)
- **Core concern**: Strategic color systems, OKLCH color space, palette generation, contrast
- **Corpus signal**: Color is deep enough to be its own sub-skill. oklch-skill.md alone covers conversion, palettes, contrast, gamut, and Tailwind integration
- **Coupling**: colorize.md explicitly references "the parent skill" and has live-mode variant params — designed as a child

#### 3. Layout & Structure (3 docs)
- **Docs**: layout.md, apple-bento-grid-main/, (layout sections of taste-skill.md)
- **Core concern**: Spacing, rhythm, grid systems, responsive structure, bento patterns
- **Corpus signal**: layout.md is a focused fix-it skill (spacing, hierarchy). apple-bento-grid-main is a complete bento grid system with design-system.md, evals, examples, and scripts

#### 4. Motion & Animation (5 docs)
- **Docs**: 12-principles-of-animation.md, animate.md, mastering-animate-presence.md, morphing-icons.md, fixing-motion-performance.md
- **Core concern**: Purposeful motion, animation principles, micro-interactions, performance
- **Corpus signal**: This is the densest cluster with a clear hierarchy — principles (12-principles) → general motion (animate) → advanced patterns (mastering-animate-presence, morphing-icons) → performance (fixing-motion-performance)
- **Coupling**: animate.md explicitly mentions "additional context needed: performance constraints" — designed for composition

#### 5. Accessibility & Polish (5 docs)
- **Docs**: fixing-accessibility.md, audit.md, baseline.md, polish.md, impeccable.md
- **Also touches**: harden.md
- **Core concern**: ARIA, keyboard nav, contrast, WCAG compliance, final quality pass
- **Corpus signal**: fixing-accessibility.md is a focused a11y audit/fix skill. audit.md is broader (a11y + performance + theming + responsive). polish.md is the shipping-quality final pass. These form a natural "quality gate" cluster

#### 6. Interaction & Feedback (4 docs)
- **Docs**: interaction-design.md, pseudo-elements.md, delight.md, overdrive.md
- **Core concern**: Micro-interactions, state transitions, gestures, tactile feedback, CSS effects
- **Corpus signal**: interaction-design.md covers state machines, gestures, feedback patterns. pseudo-elements.md handles CSS-level effects. delight.md and overdrive.md add the emotional layer

#### 7. Process, Iteration & Design Systems (8+ docs)
- **Docs**: critique.md, clarify.md, distill.md, optimize.md, redesign-skill.md, output-skill.md, adapt.md, canvas-design.md, design-lab.md, stitch-skill.md, ui-skills-root.md
- **Core concern**: Design critique, iteration workflows, redesign processes, design lab exploration, design system documentation
- **Corpus signal**: These are process-oriented — they describe HOW to work, not WHAT to build. critique.md is 812 lines of structured critique workflow. design-lab.md is 920 lines of interview-variation-feedback workflow

#### 8. Content & Presentation (2 docs)
- **Docs**: frontend-slides.md, slidev.md
- **Core concern**: Slide decks, presentation design
- **Corpus signal**: Niche; may not warrant a sub-skill. Could be absorbed into process or dropped

### designer-skills-main Mapping

The 9-plugin/97-skill model from designer-skills-main provides a strong reference taxonomy:

| designer-skills-main Plugin | Skills | Maps to Corpus Cluster |
|---|---|---|
| design-research | 12 | Process (research portion) |
| design-systems | 11 | Color & Tokens + Layout |
| ux-strategy | 12 | Process (strategy portion) |
| ui-design | 14 | Visual Identity + Layout + Color |
| interaction-design | 16 | Motion + Interaction |
| prototyping-testing | 8 | Process (testing portion) |
| design-ops | 9 | Process (ops portion) |
| designer-toolkit | 7 | Process (toolkit portion) |
| visual-critique | 7 | Accessibility & Polish |

**Key insight**: designer-skills-main uses 9 plugins but they're organized by DESIGN WORKFLOW stage (research → strategy → design → test → ship). The external standalone corpus is organized by DESIGN CRAFT DOMAIN (color, motion, layout, etc.). These are two valid axes of decomposition.

### Existing Skill Coverage Gaps

| Domain | sk-design-interface | sk-design-md-generator | Gap |
|---|---|---|---|
| Visual Identity | HEAVY (core focus) | partial (extraction) | Low |
| Color & Tokens | partial | HEAVY (extraction) | Medium (strategy missing) |
| Layout | partial | partial | HIGH (no dedicated coverage) |
| Motion | partial (references) | none | HIGH (no dedicated coverage) |
| Accessibility | none | none | HIGH (no coverage) |
| Interaction | partial (references) | none | HIGH (no coverage) |
| Process/QA | none | none | HIGH (no coverage) |

### Coupling Signals

**High coupling** (share concepts, reference each other):
- Visual Identity ↔ Color: taste-skill.md has extensive color sections
- Motion ↔ Interaction: animate.md and interaction-design.md overlap on micro-interactions
- Accessibility ↔ Polish: polish.md includes a11y checks, fixing-accessibility.md feeds into polish

**Low coupling** (independent domains):
- Color ↔ Motion: minimal cross-reference
- Layout ↔ Accessibility: different concerns, different tools
- Process ↔ any craft domain: process is meta, doesn't own craft decisions

### Structural Signal from the Corpus

The standalone docs use a **consistent pattern**: each doc is self-contained with:
1. A YAML frontmatter (name, description)
2. A "Register" section (brand vs product context)
3. Assessment → Plan → Execute → Verify workflow
4. Explicit "NEVER" prohibitions
5. Live-mode variant params (color-amount, etc.)

This pattern suggests each doc was DESIGNED to be an independent skill. The corpus authors anticipated decomposition.

## Questions Answered
- What natural domain clusters exist in the corpus? → 7 clusters identified
- How does designer-skills-main's 9-plugin model relate? → Workflow-stage axis vs craft-domain axis
- Where are the coverage gaps? → Layout, Motion, Accessibility, Interaction, Process all have HIGH gaps

## Questions Remaining
- How many sub-skills is optimal? (4-7 range, need to decide)
- Should the parent be hub or umbrella?
- How should process/QA docs be handled (own sub-skill or distributed)?
- Should content/presentation (slides) be included or dropped?

## Next Focus
Analyze the structural model: compare a single hub with nested mode packets against an umbrella router over a sibling family, using the coupling signals from this iteration.
