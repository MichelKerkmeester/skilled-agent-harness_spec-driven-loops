---
title: "Tasks: Build: improve the Jev citation drift scan (032)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Build: improve the Jev citation drift scan (032)

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

- [x] T001 Read 048's research for this feature and the scan's keep rule
- [x] T002 Capture the suite baseline before any change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Flag on the lowest rerun and keep the modal pick for reporting
- [x] T004 Report live and constructed columns with a live-only sign test
- [x] T005 Send the enclosing paragraph as the claim and drop claim-less live lines
- [x] T006 Validate the claim and window hashes, and widen requalification
- [x] T007 Cache document reads and add adaptive reruns in [0.35, 0.65]
- [x] T008 Record the amendment, then re-measure with `--out`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the scan's suite, including new stop-branch cases
- [x] T010 Count census reads on a fixture tree
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



