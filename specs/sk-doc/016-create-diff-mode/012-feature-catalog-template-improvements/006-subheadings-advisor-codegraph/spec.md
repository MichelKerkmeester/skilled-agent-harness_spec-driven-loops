---
title: "Phase 006: Sub-headings — system-skill-advisor + system-code-graph"
description: "Apply H3 sub-headings to long HOW IT WORKS sections in skill-advisor (40 files) and code-graph (14 files). Smaller scale than phase 005 — can be done in a single AI pass per skill."
importance_tier: "normal"
contextType: "general"
---
# Phase 006: Sub-headings — system-skill-advisor + system-code-graph

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Parent** | 125-feature-catalog-template-improvements |
| **Phase** | 006 |
| **Status** | Planned |
| **Method** | AI agent per skill (small scope) |
| **Prerequisite** | Phase 002 complete |
| **Input** | `002-mechanical-sweep/output/long_sections_audit.csv` |
| **Skill targets** | system-skill-advisor, system-code-graph |

---

## 2. SCOPE

### Estimate
- system-skill-advisor: 40 files, estimate 10-20 have >3 paragraphs
- system-code-graph: 14 files, estimate 5-10 have >3 paragraphs
- Total: ~15-30 files to restructure

### Same standard as phase 005
H3 vocabulary, grouping rules, and no-prose-rewrite constraint are identical to phase 005.

---

## 3. REQUIREMENTS

Same as phase 005, scoped to the two smaller skills.

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-001 | All flagged advisor files have H3 sub-headings | Re-audit shows 0 flagged in advisor |
| R-002 | All flagged code-graph files have H3 sub-headings | Re-audit shows 0 flagged in code-graph |
| R-003 | Prose unchanged | git diff shows only `### ` additions |

---

## 4. SUCCESS CRITERIA

- Zero files in either skill have HOW IT WORKS >3 paragraphs without H3 sub-headings
- Standard vocabulary used where appropriate
