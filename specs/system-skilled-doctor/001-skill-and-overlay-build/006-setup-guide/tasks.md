---
title: "Tasks: Setup guide for using Skilled in your own project"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "setup guide tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Setup guide for using Skilled in your own project

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `SETUP.md`. `R` is the root `README.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run every link step on an empty repo (`symlink-engine.cjs`). Verify: two `link` runs end `linked-merge` and two `unlink` runs leave a clean tree.
- [x] T002 Run every copy step on a copy from `877c9b021c` (`overlay-engine.cjs`). Verify: apply, capture, staged and live re-pin and rollback each end `RESULT: PASSED` or `STAGED`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the guide (`S`). Verify: `validate_document.py S` reports no blocking error.
- [x] T004 Cut section 5 of `R` to a pointer and retarget its links (`R`, `.skilled/skills/system-skilled-doctor/README.md`). Verify: the reference check prints `fail=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Validate the phase (`spec.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both setup paths were run before the guide describes them
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: the operator's request in chat
<!-- /ANCHOR:cross-refs -->

---
