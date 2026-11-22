---
title: "Tasks: Phase 56: worktree-goal-carry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "worktree goal carry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 56: worktree-goal-carry

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

`T` is `.skilled/hooks/session-handover/tests/`. `C` is `.skilled/hooks/session-handover/lib/relaunch-core.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the node suite baseline (`T`). Verify: `node --test T*.test.cjs` prints `pass 1065` and `fail 0`.
- [x] T002 Write the three CLI worktree tests and run them on the old core (`T/session-handover-cli.test.cjs`). Verify: stderr reads `goal not carried: the active goal names no packet this hand-over can find`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 List worktrees, search the ones the log names, and write and read `goal_root` (`C`). Verify: the three CLI worktree tests print `pass 3`.
- [x] T004 Write `goal_root` on prepare and report it on consume and claim (`.skilled/hooks/session-handover/bin/session-handover.cjs`). Verify: the same three tests print `pass 3`.
- [x] T005 Pass `goal_root` to the slice render on a hop and a seeded first launch (`.skilled/bin/skilled-loop`). Verify: `bash -n` prints nothing and the two wrapper worktree tests print `pass 2`, and `pass 0` `fail 2` against the unchanged wrapper.
- [x] T006 Cover the field writer (`T/relaunch-core.test.cjs`). Verify: the `goal_root` writer test passes in the full run.
- [x] T007 Document the worktree search and `goal_root` (`.skilled/hooks/session-handover/goal-carry-over.md`, `troubleshooting.md`). Verify: `rg -n 'goal_root' goal-carry-over.md` prints the new lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the node suite (`T`). Verify: `node --test T*.test.cjs` prints `pass 1073` and `fail 0`.
- [x] T009 Rerun the OpenCode plugin suite and hooks vitest. Verify: counts match the primary-checkout baseline.
- [x] T010 Resolve the real session 123e1c5d with the new core. Verify: the result names packet `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` with the worktree 505 root, and `renderGoalSlice` prints `true 3130 chars`.
- [x] T011 Fix the second-account review's three findings: no fallback for a stale `goal_root`, git repository variables stripped, the claimed note's `goal_root` counted as named (`C`, `T/session-handover-cli.test.cjs`). Verify: the five CLI worktree tests that existed then print `pass 5`, so T003 and T004's `pass 3` describe the first three only.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Deep-Review Remediation

- [x] T012 Write four failing tests and update two: a mention before the last 16 MiB, claimed root over a primary copy, claimed root over a second worktree, a prunable worktree, the refusal wording, and a substring check for the claim line (`T/session-handover-cli.test.cjs`). Verify: on the code before the fixes the selection prints `pass 2` and `fail 5` (`scratch/remediation-red.txt`).
- [x] T013 Read the whole log for worktree paths in fixed chunks that keep the bytes a path could straddle, and delete the 16 MiB tail read (`C`). Verify: the 16 MiB test passes, and fails again with the chunk overlap set to 0.
- [x] T014 Use the claimed note's `goal_root` first when its copy of the note's packet carries the headline (`C`). Verify: both claimed-root tests pass.
- [x] T015 Skip worktree blocks git marks `prunable` (`C`). Verify: the prunable test and the tampered-root test pass.
- [x] T016 Refuse with `the active goal headline appears in more than one packet` on both refusal paths (`C`). Verify: the two-worktree refusal test passes.
- [x] T017 Rerun the seven selected tests (`T/session-handover-cli.test.cjs`). Verify: `pass 7` and `fail 0` (`scratch/remediation-green.txt`).
- [x] T018 Rerun all three suites. Verify: node `pass 1077` `fail 0`, OpenCode plugin `pass 75`, hooks vitest `509 passed`.
- [x] T019 Correct the docs the review named (`goal-carry-over.md`, `troubleshooting.md`, the feature catalog entry, `spec.md`). Verify: `rg -n 'more than one packet|prunable' .skilled/hooks/session-handover/*.md` prints the new lines.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the real-session probe in T010
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
