# Iteration 2: Structural Model Analysis

## Focus
Compare single hub with nested mode packets against umbrella router over a sibling family, analyzing coupling, shared-runtime signals, and alignment with opencode skill architecture patterns.

## Actions Taken
1. Read designer-skills-main plugin structures (design-systems, interaction-design, visual-critique, design-research READMEs)
2. Read sk-code SKILL.md for the existing hub-with-surface-detection pattern
3. Scanned all 25 existing opencode skills for structural patterns
4. Analyzed coupling signals from iteration 1 against both structural models

## Findings

### Model A: Single Hub with Nested Mode Packets

**Architecture**: `sk-design` is a single large skill. Smart router detects design intent (visual-identity, color, motion, layout, accessibility, interaction, process) and loads the matching "mode packet" from `references/`.

**Precedent**: `sk-code` uses this pattern — surface detection (WEBFLOW vs OPENCODE) loads different reference sets from a single SKILL.md.

**Analysis**:
- sk-code works because it has **2 surfaces** with clear CWD/file markers. The design family would need **5-7 intent modes** — a much harder routing problem.
- sk-code's surfaces share most of the SKILL.md (Phase 0-3 workflow is identical). Design sub-domains have **different workflows** (color palette generation ≠ motion audit ≠ accessibility fix).
- The taste-skill.md alone is 600+ lines. Combining 5-7 domains into one SKILL.md would produce a 3000+ line monolith — unmanageable.
- Each corpus doc is self-contained by design. Merging them into one file destroys that property.

**Coupling assessment**: Visual Identity ↔ Color coupling is high, but that's handled by cross-references, not co-location. Motion ↔ Interaction coupling exists but they have different primary concerns (animation physics vs user feedback patterns).

**Verdict**: **REJECT for 5-7 sub-domains.** The hub pattern works for 2-3 tightly coupled surfaces, not for 5-7 loosely coupled craft domains. The routing surface is too large and the workflows are too different.

### Model B: Umbrella Router over Sibling Family

**Architecture**: `sk-design` is a thin router/dispatcher skill. Sub-skills are independent skills (`sk-design-visual`, `sk-design-color`, `sk-design-motion`, etc.) each with their own SKILL.md, references, and assets.

**Precedent**: 
- `deep-loop-workflows` is an umbrella with `deep-research`, `deep-review`, `deep-context`, `deep-improvement`, `deep-ai-council` as children.
- `system-spec-kit` bundles related capabilities under one parent.
- The designer-skills-main model uses 9 independent plugins referenced from a parent README.

**Analysis**:
- Each corpus doc is already structured as a standalone skill (YAML frontmatter, self-contained workflow, explicit boundaries). The umbrella model preserves this.
- The opencode skill-graph supports parent-child relationships natively (advisor can route to the family).
- Each sub-skill can be developed, tested, and validated independently.
- The parent router is lightweight — just intent detection + dispatch.
- Backward compatibility: `sk-design-interface` becomes `sk-design-visual` (or stays as-is under the umbrella). `sk-design-md-generator` stays as-is.

**Coupling assessment**: High-coupling pairs (Visual↔Color, Motion↔Interaction) are handled via `enhances` edges in the skill-graph, not co-location. This is the existing pattern (sk-code enhances sk-code-review).

**Shared-runtime signals**:
- Shared references: design_principles.md (anti-default discipline) could live at the parent level
- Shared assets: None needed — each sub-skill has its own
- Shared scripts: None — each sub-skill's tools are domain-specific
- No shared runtime state between sub-skills (color generation doesn't need motion state)

**Verdict**: **ACCEPT.** The umbrella model aligns with (1) the corpus's self-contained doc structure, (2) opencode's existing skill architecture patterns, (3) the loose coupling between design domains, and (4) independent development/maintenance needs.

### Hybrid Consideration: Umbrella with Shared Parent References

A refinement: the parent `sk-design` holds:
1. **Router logic**: Intent detection → sub-skill dispatch
2. **Shared references**: Anti-default discipline, design principles (from sk-design-interface), brand/product register pattern (from corpus)
3. **Family-wide conventions**: YAML frontmatter format, Register pattern, verification workflow

Each sub-skill inherits these shared references and adds its domain-specific content.

This mirrors how `deep-loop-workflows` holds shared runtime logic while children (`deep-research`, `deep-review`) hold mode-specific logic.

### Structural Comparison Table

| Criterion | Hub (Model A) | Umbrella (Model B) |
|---|---|---|
| Sub-domains | 5-7 modes in 1 SKILL.md | 5-7 independent skills |
| SKILL.md size | 3000+ lines | 200-400 lines each |
| Routing complexity | High (7-way intent detection) | Low (parent dispatches) |
| Independent development | No (monolith) | Yes |
| Shared references | Easy (same file) | Requires parent-level refs |
| Corpus alignment | Poor (docs are standalone) | Strong (1 doc ≈ 1 skill) |
| Existing pattern match | sk-code (2 surfaces) | deep-loop-workflows (5 children) |
| Skill-graph integration | Single node | Parent + children with edges |
| Backward compat | Harder (rename + merge) | Easier (rename + nest) |

### Evidence from designer-skills-main

The 9-plugin model is **not** a hub. Each plugin (design-research, design-systems, etc.) is a standalone directory with its own `skills/`, `commands/`, and `.claude-plugin/`. The parent README is a routing guide, not a monolith.

This is strong external evidence that the design community considers the umbrella model the right decomposition for design skills.

### Evidence from Coupling Analysis

The highest-coupling pair (Visual Identity ↔ Color) still has **distinct primary concerns**:
- Visual Identity: "what aesthetic direction?" (taste, personality, anti-default)
- Color: "which specific colors?" (OKLCH, palettes, contrast, tokens)

These are different decisions made at different times. Coupling is handled by cross-reference, not co-location.

## Questions Answered
- Which structural model is better? → Umbrella (Model B) is strongly preferred
- Why not a hub? → 5-7 routing modes is too complex, workflows differ, corpus is standalone
- What about shared resources? → Parent-level shared references (design principles, register pattern)
- What's the precedent? → deep-loop-workflows, designer-skills-main, system-spec-kit

## Questions Remaining
- Exact sub-skill count (4, 5, 6, or 7?)
- Which corpus docs map to which sub-skill?
- What goes in the parent vs. children?
- How to handle process/QA docs (own sub-skill or distributed?)

## Next Focus
Draft the optimal sub-skill taxonomy (4-7 children) with scope, boundaries, and corpus source mapping for each candidate.
