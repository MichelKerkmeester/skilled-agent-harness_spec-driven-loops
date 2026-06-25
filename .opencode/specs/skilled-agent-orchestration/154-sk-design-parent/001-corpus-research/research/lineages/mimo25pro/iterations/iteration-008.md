# Iteration 8: Synthesis & Convergence

## Focus
Final convergence assessment and synthesis of all findings into the canonical research.md.

## Convergence Assessment

| Signal | Value | Assessment |
|---|---|---|
| Rolling Average (last 3 newInfoRatios) | (0.65 + 0.55 + 0.45) / 3 = 0.55 | Above threshold (0.05) |
| Question Coverage | 7/7 key questions answered (100%) | STOP threshold met (≥85%) |
| New Info Ratio Trend | 0.95 → 0.88 → 0.82 → 0.72 → 0.65 → 0.55 → 0.45 | Declining — converging |
| Quality Guards | Source diversity: PASS (43 corpus docs + 2 existing skills + designer-skills-main) | PASS |
| Focus Alignment | All 8 iterations focused on taxonomy/structure/compat | PASS |

**Verdict**: Research has converged. All key questions answered, new info ratio is declining, quality guards pass. Ready for synthesis.

## Synthesis Summary

### Deliverable 1: Sub-Skill Taxonomy (6 Children)

| # | Sub-Skill | Scope | Corpus Sources | Existing Skill |
|---|---|---|---|---|
| 1 | sk-design-visual | Visual identity, aesthetics, typography, anti-default critique | 13 docs (taste-skill, bolder, quieter, etc.) | Evolves from sk-design-interface |
| 2 | sk-design-color | Color systems, OKLCH, palettes, tokens, dark mode | 2 docs (colorize, oklch-skill) | NEW |
| 3 | sk-design-motion | Animation, motion principles, GSAP, scroll-driven, performance | 5 docs (animate, 12-principles, etc.) | NEW |
| 4 | sk-design-layout | Layout, grids, spacing, responsive, bento patterns | 2 docs + apple-bento-grid-main | NEW |
| 5 | sk-design-a11y | Accessibility, WCAG, audit, hardening, edge cases | 6 docs (fixing-accessibility, audit, etc.) | NEW |
| 6 | sk-design-interaction | Interaction, state machines, gestures, feedback, forms | 4 docs + designer-skills-main | NEW |

### Deliverable 2: Structural Model Evidence

**Umbrella router over sibling family** is strongly preferred over single hub with nested mode packets.

Evidence:
1. Corpus docs are self-contained by design (each has YAML, Register, workflow, prohibitions)
2. 5-7 routing modes is too complex for a hub (sk-code works with 2 surfaces)
3. Each domain has different workflows (color palette ≠ motion audit ≠ a11y fix)
4. deep-loop-workflows is the opencode precedent for umbrella-over-siblings
5. designer-skills-main uses 9 independent plugins (external evidence)
6. Loose coupling between domains (high-coupling pairs handled by cross-references)

### Deliverable 3: Onboarding & Backward Compatibility

**Total effort**: 10-16 days

| Sub-skill | Effort | Type |
|---|---|---|
| sk-design (parent) | 1 day | NEW |
| sk-design-visual | 2-3 days | RENAME + EXPAND |
| sk-design-color | 1-2 days | NEW |
| sk-design-motion | 2-3 days | NEW |
| sk-design-layout | 1-2 days | NEW |
| sk-design-a11y | 1-2 days | NEW |
| sk-design-interaction | 2-3 days | NEW |
| sk-design-md-generator | 0.5 days | UPDATE ONLY |

**Backward compatibility strategy**:
- Keep `sk-design-interface` as compatibility alias for 28 days
- Rebuild advisor skill-graph after changes
- Update all references in spec folders, commands, agents
