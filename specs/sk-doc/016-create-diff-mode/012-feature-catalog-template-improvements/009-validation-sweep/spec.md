---
title: "Phase 009: Validation Sweep — All Skills"
description: "Final compliance check across all 370 catalog files. Run the validation script, review the report, apply targeted fixes, confirm 95%+ compliance on all 6 checks before closing the rework project."
importance_tier: "normal"
contextType: "general"
---
# Phase 009: Validation Sweep — All Skills

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Parent** | 125-feature-catalog-template-improvements |
| **Phase** | 009 |
| **Status** | Planned |
| **Method** | Validation script + targeted manual fixes |
| **Prerequisite** | Phases 002–008 all complete |
| **Skill targets** | All three skills |

---

## 2. PURPOSE

After 8 phases of scripted and AI-assisted edits, this phase runs a comprehensive compliance check to confirm the retroactive rework is complete. Any remaining gaps identified by the script get fixed in this phase.

---

## 3. COMPLIANCE CHECKS (6 dimensions)

| # | Check | Target | Acceptable exceptions |
|---|---|---|---|
| 1 | `trigger_phrases:` in frontmatter | 100% of snippets | None |
| 2 | Template marker after H1 | 100% of snippets | None |
| 3 | `## 2. HOW IT WORKS` heading (not CURRENT REALITY) | 100% of snippets | None |
| 4 | Validation table has `\| File \| Type \| Role \|` (3 cols) | 100% of snippets with validation section | Snippets with no validation section |
| 5 | `Related references:` in SOURCE METADATA | All multi-file categories | Singleton categories (1 file) |
| 6 | H3 sub-headings in long HOW IT WORKS (>3 paragraphs) | 100% of long sections | None |

**Target**: 95%+ compliance on all checks. 100% on checks 1-3 (hard requirements).

---

## 4. SCOPE

All 370 .md files:
- 313 spec-kit snippets
- 40 skill-advisor snippets
- 14 code-graph snippets
- 3 master catalogs (checks 1, 3 only — no template marker needed in master catalogs)

---

## 5. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-001 | Validation script produces per-file report | `validation_report.csv` exists with all 370 files |
| R-002 | Checks 1-3 at 100% | Zero files fail heading, marker, or trigger_phrases checks |
| R-003 | Overall compliance ≥ 95% | Fewer than 20 files have any remaining gap |
| R-004 | Remaining gaps documented | Known exceptions listed in `009-validation-sweep/known_exceptions.md` |

---

## 6. SUCCESS CRITERIA

- `validation_report.csv` produced with all 370 files
- Zero failures on checks 1, 2, 3 (hard requirements)
- ≥ 95% overall compliance
- `known_exceptions.md` documents any accepted remaining gaps with justification
- `125-feature-catalog-template-improvements` spec folder status set to `complete`
