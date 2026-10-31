---
title: "Tasks: Build: improve the Jev fetched-text injection screen (035)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "injection screen improvements tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Build: improve the Jev fetched-text injection screen (035)

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

- [x] T001 Read 048's research for this feature and the scorer's keep rule
- [x] T002 Capture the suite baseline before any change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Restore the untracked corpus rows and pin their digest
- [x] T004 Add label and planted hashes, Brier, recall split and close-call flags to the report
- [x] T005 Move the flag line to 0.6 and adopt confirm-then-verify reruns
- [x] T006 Harden the lexical comparator and report the hybrid floor
- [x] T007 Add the reworded and review-band question arms
- [x] T008 Record the amendment, then re-measure with `--out`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the scorer's tests
- [x] T010 Confirm a changed corpus row is refused
- [x] T011 Run `validate.sh --strict` on this phase
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



