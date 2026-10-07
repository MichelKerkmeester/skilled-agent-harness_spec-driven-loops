---
title: "Tasks: Phase 005 — Sub-headings, system-spec-kit"
description: "Task breakdown for applying H3 sub-headings to long HOW IT WORKS sections in system-spec-kit."
trigger_phrases:
  - "subheadings spec kit tasks"
  - "how it works subheadings task list"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 005 — Sub-headings, system-spec-kit

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

- [ ] T001 Read `long_sections_audit.csv` filtered to system-spec-kit
- [ ] T002 Group the flagged files by category
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Process the flagged categories largest first
- [ ] T004 Insert H3 sub-headings between existing paragraph groups without rewriting prose
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Re-run `audit_long_sections.py` to produce `post_phase_audit.csv`
- [ ] T006 Confirm zero remaining flagged files
- [ ] T007 Spot-check ten files for unchanged prose
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
