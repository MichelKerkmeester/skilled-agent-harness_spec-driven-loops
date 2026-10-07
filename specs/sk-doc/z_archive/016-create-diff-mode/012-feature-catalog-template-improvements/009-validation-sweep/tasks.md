---
title: "Tasks: Phase 009 — Validation Sweep, All Skills"
description: "Task breakdown for the final compliance check across all 370 catalog files."
trigger_phrases:
  - "validation sweep tasks"
  - "catalog compliance task list"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 009 — Validation Sweep, All Skills

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

- [ ] T001 Author `validate_catalog_compliance.py` per the plan script specification
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Run the validation script summary
- [ ] T003 Produce `validation_report.csv` for all 370 files
- [ ] T004 Fix check 1-3 failures first
- [ ] T005 Batch-fix the check 4-6 failures
- [ ] T006 Write `known_exceptions.md` for accepted remaining gaps
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Re-run validation to confirm the overall compliance target
- [ ] T008 Apply the closure updates at the parent level
- [ ] T009 Commit the validation sweep
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
