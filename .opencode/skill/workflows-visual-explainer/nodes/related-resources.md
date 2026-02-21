---
description: "Index of all reference files, asset files, template files, and related skills for the workflows-visual-explainer skill"
---
# Related Resources

This node is the master index of every file in the skill, organized by type and loading level. Use it to know what exists and when to load it.

---

## Reference Files (`references/`)

These are read-only reference documents loaded into context as needed.

| File | Description | Loading Level | Loaded For |
|------|-------------|---------------|-----------|
| `references/quick_reference.md` | Command cheat sheet, CDN snippets, font pairings table, output naming convention | ALWAYS | Every activation |
| `references/css_patterns.md` | Full CSS pattern library for all 9 aesthetics — CSS custom properties, depth tiers, background atmospheres, animation system | CONDITIONAL | GENERATE, DIFF_REVIEW, PLAN_REVIEW, RECAP, AESTHETIC |
| `references/library_guide.md` | Deep-dive for Mermaid.js v11, Chart.js v4, anime.js v3.2.2 — initialization, rendering patterns, known gotchas | CONDITIONAL | GENERATE, DIFF_REVIEW, DIAGRAM_TYPE |
| `references/navigation_patterns.md` | Sticky TOC, scroll-spy, mobile navigation, active section highlighting — for pages with 4+ sections | ON_DEMAND | Detected during Phase 2 when section count >= 4 |
| `references/quality_checklist.md` | Detailed verification procedure for all 9 quality checks — step-by-step instructions for each check | ON_DEMAND | FACT_CHECK; also when any quality check needs detailed guidance |

---

## Asset Files (`assets/`)

Template HTML files used as structural references in Phase 2.

| File | Description | Aesthetic | Diagram Type | Loading Level |
|------|-------------|-----------|-------------|---------------|
| `assets/templates/architecture.html` | Architecture cards template — CSS Grid layout, terracotta/sage color palette, card hover effects | Editorial variant | Type 1 (Architecture Text-Heavy) | ON_DEMAND |
| `assets/templates/mermaid-flowchart.html` | Mermaid flowchart template — teal/cyan palette, ELK layout, zoom controls wired, `classDef` examples | Blueprint variant | Type 2/3 (Architecture Topology / Flowchart) | ON_DEMAND |
| `assets/templates/data-table.html` | Data table template — rose/cranberry accent, sortable columns, zebra striping, sticky header | Editorial/Data-dense | Type 9 (Data Table) | ON_DEMAND |

**Template usage rule:** Always read template files fresh using the `Read` tool before using them in Phase 2. Never reconstruct from memory. Templates evolve — memory-based copies will drift.

---

## Skill Graph Nodes (`nodes/`)

Content nodes in the supplemental skill graph. Listed in recommended reading order for full skill comprehension.

| Node | Description | Primary Use |
|------|-------------|------------|
| `nodes/when-to-use.md` | Activation triggers, decision matrix, 5 command overview, proactive table rendering, exclusions | Command selection |
| `nodes/rules.md` | Full ALWAYS/NEVER/ESCALATE IF behavioral rules with rationale | Pre-delivery compliance |
| `nodes/success-criteria.md` | 9 pre-delivery quality checks with step-by-step verification instructions | Phase 4 delivery |
| `nodes/how-it-works.md` | 4-phase Think > Structure > Style > Deliver workflow with all sub-steps | Full workflow reference |
| `nodes/smart-routing.md` | Intent classification pseudocode, scoring algorithm, resource loading levels, proactive table detection | Routing and resource loading |
| `nodes/commands.md` | Full contracts for all 5 commands — argument parsing, data gathering, section architecture, output conventions | Command execution |
| `nodes/diagram-types.md` | All 11 diagram types with rendering approach, constraints, and decision tree | Phase 1 diagram type selection |
| `nodes/aesthetics.md` | 9 aesthetic profiles with CSS variables, font pairings, atmosphere, and compatibility matrix | Phase 1 and 3 aesthetic selection |
| `nodes/integration-points.md` | CDN libraries (Mermaid, Chart.js, anime.js), Google Fonts pairings, cross-skill wiring, output convention | Phase 2/3 implementation |
| `nodes/related-resources.md` | This file — master index of all skill resources | Resource discovery |

---

## Related Skills

Skills that this skill integrates with or complements:

| Skill | Integration Type | When |
|-------|----------------|------|
| `system-spec-kit` | READ — loads memory context | `/recap`, `/plan-review` |
| `workflows-git` | READ — gathers diff data | `/diff-review`, `/recap --include-git` |
| `workflows-chrome-devtools` | READ — validates HTML output | Post-delivery quality validation |
| `workflows-documentation` | Complementary — text documentation | When user needs Markdown docs instead of HTML visuals |

---

## File Tree

Complete file structure of this skill:

```
.opencode/skill/workflows-visual-explainer/
├── SKILL.md                          # Primary entrypoint — always loaded first
├── index.md                          # Supplemental skill graph navigation (MOC)
├── nodes/
│   ├── when-to-use.md
│   ├── rules.md
│   ├── success-criteria.md
│   ├── how-it-works.md
│   ├── smart-routing.md
│   ├── commands.md
│   ├── diagram-types.md
│   ├── aesthetics.md
│   ├── integration-points.md
│   └── related-resources.md          # This file
├── references/
│   ├── quick_reference.md            # ALWAYS loaded
│   ├── css_patterns.md               # CONDITIONAL
│   ├── library_guide.md              # CONDITIONAL
│   ├── navigation_patterns.md        # ON_DEMAND
│   └── quality_checklist.md          # ON_DEMAND
└── assets/
    └── templates/
        ├── architecture.html         # ON_DEMAND
        ├── mermaid-flowchart.html    # ON_DEMAND
        └── data-table.html           # ON_DEMAND
```

---

## Quick Lookup: "Where is X?"

| I need... | Go to... |
|-----------|---------|
| Command arguments and section architecture | `nodes/commands.md` |
| CSS variables for an aesthetic | `nodes/aesthetics.md` → `references/css_patterns.md` |
| Mermaid initialization code | `nodes/integration-points.md` → `references/library_guide.md` |
| Decision tree for diagram type | `nodes/diagram-types.md` |
| Quality check instructions | `nodes/success-criteria.md` → `references/quality_checklist.md` |
| Navigation (TOC, scroll-spy) | `references/navigation_patterns.md` |
| Template HTML to reference | `assets/templates/` |
| Intent scoring algorithm | `nodes/smart-routing.md` |
| When NOT to use this skill | `nodes/when-to-use.md` |
| Cross-skill calls (git, spec-kit) | `nodes/integration-points.md` |

---

## Cross References
- [[when-to-use]] — First node to read when evaluating whether to activate
- [[smart-routing]] — Determines which of these resources are loaded
- [[how-it-works]] — References templates from `assets/` in Phase 2
