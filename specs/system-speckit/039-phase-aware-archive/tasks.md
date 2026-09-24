---
title: "Tasks: Archive a phase into its parent's own z_archive and restore it back into the parent, leaving the parent's phase list to the reviewed prune"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase-aware archive"
  - "archive a phase"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Archive a phase into its parent's own z_archive and restore it back into the parent, leaving the parent's phase list to the reviewed prune

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

- [x] T001 Find how a phase parent tracks its phases: `children_ids` only grows, removal is a reviewed prune, and the drift check reports only phases missing from the list
- [x] T002 Archive a phase by hand in a scratch copy: no validation rule changes, and the phase-map sync skips the archived phase
- [x] T003 Put the choice to the operator: leave the parent's list alone
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write four phase cases and run them red: 4 of 13 failed (`runtime/cli/tests/archive-track.vitest.ts`)
- [x] T005 Archive into the `z_archive/` beside the folder, restore to the place that archive belongs to, and print the prune note for a phase (`runtime/cli/spec/archive.sh`)
- [x] T006 Replace the tree search, which also found `z_archive/` folders inside research copies of a specs tree, with the packet-home rule and a walk along packet folders (`runtime/cli/spec/archive.sh`)
- [x] T007 Add cases for the research copy, an archive inside an archived packet, a restore from outside the specs root, a linked numbered folder, and a numbered folder under `research/` (`runtime/cli/tests/archive-track.vitest.ts`)
- [x] T008 [P] Describe the phase archive and the packet-home rule (`runtime/cli/spec/README.md`, the lifecycle catalogue entry and playbook), and mark packet 038's phase limitation resolved
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Remove each guarded rule on purpose, 20 in all, and watch the suite fail each time
- [x] T010 `archive-track.vitest.ts` 16 of 16, and `test-phase-validation.js` 51 passed, 0 failed
- [x] T011 A read-only `--list` on this repository: 272 entries, the 268 track entries plus 4 phase entries, no research copies, in 1.3 seconds
- [x] T012 The changed docs validate with 0 issues, and strict validation of this packet passes
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
