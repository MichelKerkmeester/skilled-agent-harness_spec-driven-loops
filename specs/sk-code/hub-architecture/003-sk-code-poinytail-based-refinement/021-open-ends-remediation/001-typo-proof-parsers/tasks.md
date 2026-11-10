---
title: "Tasks: Phase 1: typo-proof-parsers"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "typo proof parsers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: typo-proof-parsers

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

- [x] T001 Create the builder worktree from the scaffold commit
- [x] T002 Reproduce U1 to U4 in throwaway locations under the session scratchpad
- [x] T003 [P] Search every caller of each flagged script in hooks, workflows and scripts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the typo-flag tests per skill and record their failing runs
- [x] T005 Add the rejecting branch to the 54 class 1 parsers
- [x] T006 Make the ten class 2 paths exit non-zero
- [x] T007 Fix U1 to U4 and add the create.sh help line
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the typo-flag tests and every touched skill suite
- [x] T009 Run the compiled route, canary, Hermes and trigger index gates
- [x] T010 Bump each touched skill once with a changelog entry
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



