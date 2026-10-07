---
title: "Tasks: Phase 002 — Mechanical Sweep"
description: "Task breakdown for the script-driven mechanical sweep across all three skill catalogs."
trigger_phrases:
  - "mechanical sweep tasks"
  - "catalog sweep task list"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 002 — Mechanical Sweep

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Author `heading_rename.py` for the heading rename
- [ ] T002 Author `insert_template_marker.py` for the template marker insert
- [ ] T003 Author `fix_validation_table.py` for the two-column to three-column table conversion
- [ ] T004 Author `audit_long_sections.py` for the paragraph and H3 audit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Dry-run each script and review the reported file counts
- [ ] T006 Execute `heading_rename.py`
- [ ] T007 Execute `insert_template_marker.py`
- [ ] T008 Execute `fix_validation_table.py`
- [ ] T009 Run `audit_long_sections.py` to produce `long_sections_audit.csv`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the R-001 to R-003 verification greps
- [ ] T011 Confirm idempotency by re-running the scripts
- [ ] T012 Review `git diff --stat` for scope and commit the sweep
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
