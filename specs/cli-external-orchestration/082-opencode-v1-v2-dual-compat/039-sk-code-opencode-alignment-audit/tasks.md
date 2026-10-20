---
title: "Tasks: sk-code alignment audit of every OpenCode plugin and hook file"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk code opencode alignment audit tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-code alignment audit of every OpenCode plugin and hook file

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

- [x] T001 Create the worktree and this packet, register 039 in the parent
- [ ] T002 Record the file list, symlinks and the verifier baseline (scratch/)
- [ ] T003 Record the suite baselines (scratch/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Review each batch and record candidate findings (scratch/batches/)
- [ ] T005 Confirm each finding with the independent reviewer
- [ ] T006 Fix each confirmed finding in one-change briefs
- [ ] T007 Review the scanner helper after phase 038 lands
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Rerun the plugin, battery, purity and hook suites and the verifier
- [ ] T009 Write review.md with one row per file and check it against git ls-files
- [ ] T010 Validate the packet, merge main, push and record CI
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

---



