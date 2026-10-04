---
title: "Tasks: Phase 23: release-update-symlink-parent"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "release update symlink parent tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 23: release-update-symlink-parent

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Write the regression test and confirm it fails on the old engine
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Tag the symlinked-parent error and catch it in `worktreeEntry`
- [x] T003 Classify the entry as a `symlink-parent` conflict and recommend keep-local
- [x] T004 Record no local state for it in the plan
- [x] T005 Name the new conflict in the align eligibility rule
- [x] T006 Copy the fixed updater into the fixture and revert the workaround commit
- [x] T007 Update the README fixture list and DOC-379
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the engine suite
- [x] T009 Run the fixture checks, an unscoped check and the apply and rollback round trip
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



