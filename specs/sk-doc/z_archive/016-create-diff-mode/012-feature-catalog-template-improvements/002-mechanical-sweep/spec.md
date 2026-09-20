---
title: "Phase 002: Mechanical Sweep — All Skills"
description: "Script-driven bulk fixes across all 370 catalog files: rename CURRENT REALITY heading, insert template marker, fix validation table columns."
trigger_phrases:
  - "mechanical sweep"
  - "catalog heading rename"
  - "bulk catalog fix"
importance_tier: "normal"
contextType: "general"
---
# Phase 002: Mechanical Sweep — All Skills

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Parent** | 125-feature-catalog-template-improvements |
| **Phase** | 002 |
| **Status** | Planned |
| **Method** | Python scripts (automated, idempotent) |
| **Prerequisite** | Phase 001 complete (done) |

---

## 2. PROBLEM & PURPOSE

365+ snippet files still use the old heading, 328 lack the template marker, and 249 have a 2-column validation table. These are purely mechanical fixes — no AI judgment needed. Running scripts first establishes a clean, consistent baseline before the judgment-intensive phases begin.

---

## 3. SCOPE

### Target files
- `system-spec-kit/feature_catalog/**/*.md` (313 snippets, excluding master catalog)
- `system-skill-advisor/feature_catalog/**/*.md` (40 snippets, excluding master catalog)
- `system-code-graph/feature_catalog/**/*.md` (14 snippets, excluding master catalog)
- **Total**: ~367 snippet files

### Operations (3 scripts)

| Script | Operation | Files affected |
|---|---|---|
| `heading_rename.py` | `## 2. CURRENT REALITY` → `## 2. HOW IT WORKS` | 365 |
| `insert_template_marker.py` | Insert `<!-- sk-doc-template: ... -->` after H1 | 328 |
| `fix_validation_table.py` | `\| File \| Focus \|` → `\| File \| Type \| Role \|` + derive Type from filename | 249 |
| `audit_long_sections.py` | Count HOW IT WORKS paragraphs, emit CSV for phase 005 | all |

### Out of scope
- Master catalog files (`feature_catalog.md`) — handled in phase 008
- `trigger_phrases` frontmatter — handled in phases 003+004
- Sub-headings — handled in phases 005+006
- Related references — handled in phase 007

---

## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-001 | Heading rename applied to all snippets | `grep -r "## 2. CURRENT REALITY" */feature_catalog/` returns 0 results |
| R-002 | Template marker present in all snippets | `grep -rL "sk-doc-template" */feature_catalog/**/*.md` returns only master catalogs |
| R-003 | Validation table updated to 3 columns | `grep -r "| File | Focus |" */feature_catalog/` returns 0 results |
| R-004 | All scripts idempotent | Re-running changes nothing, no duplicate markers |
| R-005 | Audit CSV produced | `long_sections_audit.csv` exists with filepath + paragraph count for all snippets |

---

## 5. SUCCESS CRITERIA

- All 3 scripts execute without errors
- Zero files retain `## 2. CURRENT REALITY` heading
- Zero files retain `| File | Focus |` validation table header
- `long_sections_audit.csv` produced for phase 005 input
- Git diff shows only targeted mechanical changes (no prose alterations)
