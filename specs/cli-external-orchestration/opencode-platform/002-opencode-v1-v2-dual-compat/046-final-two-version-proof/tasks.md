---
title: "Tasks: Phase 46: final-two-version-proof"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "final two version proof tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 46: final-two-version-proof

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

- [x] T001 Create worktree 190 from origin/main `eb0c18f7e9` with sk-git's `create` and provision it (11 installed, 5 built, 0 failed)
- [x] T002 Extract each scenario's `Exact Command Sequence` block from `plugin-utilization/*.md` (17 blocks)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the 17 blocks in sequence on v1 and v2; each block exits 0 (`scratch/live-runs/summary.txt`)
- [x] T004 Read each cell's verdict from the evidence and write the matrix (`scratch/live-runs/results-matrix.md`)
- [x] T005 [P] Rerun every tracked suite in worktree 188 at the same commit (`scratch/suites/suites.txt`)
- [x] T006 Run one OpenCode 1 dispatch on the default `opencode-go` model under a 180 s alarm (`scratch/v1-default/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Check that no evidence file contains the llmgateway key (0 matches across all four evidence folders)
- [x] T008 Recursive strict validation of 082 prints `RESULT: PASSED` for every folder
- [x] T009 Push to main and record CI on the final commit (`implementation-summary.md`)
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



