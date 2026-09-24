---
title: "Tasks: Number create.sh packets at the specs root from the highest existing number"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "create.sh root numbering"
  - "duplicate packet number 001"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Number create.sh packets at the specs root from the highest existing number

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

- [x] T001 Reproduce the duplicate 001 and the pruned remote-tracking ref in a throwaway repository
- [x] T002 Confirm `check_existing_branches` has one caller and no document describes its behaviour
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the numbering test and run it red (`runtime/cli/tests/create-root-numbering.vitest.ts`)
- [x] T004 Replace `check_existing_branches` with `highest_branch_number`, counting only `NNN-` names (`runtime/cli/lib/git-branch.sh`)
- [x] T005 Number from the highest root folder and, without a track, the highest packet branch (`runtime/cli/spec/create.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 All five cases pass, and removing only the branch count turns the two branch cases red
- [x] T007 The `cli` vitest project, `test:legacy` and `test:validation` pass
- [x] T008 No `git fetch` or `git ls-remote` remains in `create.sh` or its libraries
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
