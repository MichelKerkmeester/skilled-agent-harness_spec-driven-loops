---
title: "Phase 005: Sub-headings — system-spec-kit"
description: "Apply H3 sub-headings to system-spec-kit HOW IT WORKS sections that exceed 3 paragraphs. Uses the long_sections_audit.csv from phase 002 to target only files that need restructuring."
importance_tier: "normal"
contextType: "general"
---
# Phase 005: Sub-headings — system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Parent** | 125-feature-catalog-template-improvements |
| **Phase** | 005 |
| **Status** | Planned |
| **Method** | AI agents per category, targeting audit-flagged files |
| **Prerequisite** | Phase 002 complete (audit CSV must exist) |
| **Input** | `002-mechanical-sweep/output/long_sections_audit.csv` |
| **Skill target** | system-spec-kit |

---

## 2. PROBLEM & PURPOSE

Long HOW IT WORKS sections without navigation anchors are hard to scan. The 3-paragraph rule: any HOW IT WORKS section with >3 paragraphs MUST have H3 sub-headings. The phase 002 audit identifies all such files. This phase applies the restructuring.

---

## 3. SCOPE

### Input
`long_sections_audit.csv` from phase 002, filtered to:
- `skill = system-spec-kit`
- `needs_subheadings = true` (paragraph_count > 3 AND h3_count = 0)

### Estimate
Based on spec-kit's complexity (many features with multi-stage behavior): ~100-150 of 313 snippets likely qualify. Exact count from audit CSV.

### Operations
For each flagged file:
1. Read HOW IT WORKS section content
2. Group related paragraphs under appropriate H3 sub-headings
3. Do NOT rewrite prose — only add H3 headings between existing paragraph groups
4. Use standard vocabulary where it fits (see below)

### Standard H3 vocabulary
```
### Core Behavior          — fundamental what-it-does
### Entry Point & Routing  — for features with content routing or dispatch
### Quality Gates & Validation — for pre/post-storage quality checks
### Prediction Error (PE) Arbitration — for PE-related behavior
### Reconsolidation & Chunking — for merge/split operations
### Configuration          — for env flags, parameters, toggles
### Edge Cases & Caveats   — for non-obvious behavior or failure modes
### Async & Safety         — for async modes and safety mechanisms
### Post-Action Behavior   — for things that happen after the primary action
### Trigger / Auto-Fire Path — for auto-triggered features
### Class                  — for manual/half-auto/auto classification
```

Agents may use different headings when none of the above fit the content.

---

## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-001 | All audit-flagged files have H3 sub-headings | Re-running audit CSV shows h3_count > 0 for all previously flagged files |
| R-002 | Sub-headings don't alter prose | git diff shows only added `### ` lines, no changed prose |
| R-003 | Groupings are logical | Each H3 group contains semantically related paragraphs |
| R-004 | Short sections untouched | Files with ≤3 paragraphs are not modified |

---

## 5. SUCCESS CRITERIA

- Zero files in spec-kit have HOW IT WORKS with >3 paragraphs and no H3 sub-headings
- Prose content unchanged — only H3 headings added
- Standard vocabulary used where it fits, custom headings used where standard doesn't fit
