---
title: "Tasks: Let the doctor git check accept a hand-over hook and a hook the host declares omitted"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor host hook acceptance tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Let the doctor git check accept a hand-over hook and a hook the host declares omitted

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

`C` is `.skilled/commands/doctor/scripts/git-setup-check.cjs`. `T` is `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`. Every command runs from the worktree root, `/Users/michelkerkmeester/worktrees/public/368-host-tree-portability-fixes`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the battery suite passes before any edit (`T`). Verify: `node --test T` reports `tests 80` and `fail 0`. Evidence: 80 of 80 pass.
- [x] T002 Record the hooks row this worktree prints before any edit (`C`). Verify: `node C` prints the hooks row and the `STATUS=FAIL failed=1 degraded=0 skipped=0 unknown=0` line of the `spec.md` Measured Behavior block, and exits 1. Evidence: The hooks row fails with seven `not a hook source` lines, because a worktree's hooks resolve to the main checkout's hook source.
- [x] T003 Confirm the OLD text of Edits 1 to 4 in `plan.md` matches the current files (`C`). Verify: `rg -n 'not a hook source|^// shares\. A missing target|^// install-git-hooks\.sh is not called' C` prints lines 342, 353 and 388. Evidence: Confirmed by the planning agent before the plan was written.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Apply Edit 4 from `plan.md`, the `linkOwnHooks` helper and three hooks cases (`T`). Verify: `node --test --test-name-pattern 'marker line|declares omitted' T` exits 1, and the failing cases are the hand-over case and the omitted case. Evidence: Applied by the worker. The three hooks cases are in the test file.
- [x] T005 Apply Edit 1 from `plan.md`, the `handoverTarget` and `omittedHooks` helpers (`C`). Verify: `rg -c 'function handoverTarget|function omittedHooks' C` prints 2. Evidence: `rg -c` on the two helper names prints 2.
- [x] T006 Apply Edit 2 from `plan.md`, the comment above `checkHooks` (`C`). Verify: `rg -c 'skilled.omitHook may be absent' C` prints 1. Evidence: `rg -c "skilled.omitHook may be absent"` prints 1.
- [x] T007 Apply Edit 3 from `plan.md`, the loop and the return in `checkHooks` (`C`). Verify: `rg -c 'return pass\(source, notes\)' C` prints 1 and `node --check C` exits 0. Evidence: `rg -c "return pass\(source, notes\)"` prints 1 and `node --check` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the three new cases (`T`). Verify: `node --test --test-name-pattern 'marker line|declares omitted' T` reports `pass 3` and `fail 0`. Evidence: The three new cases pass.
- [x] T009 Run the whole battery suite (`T`). Verify: `node --test T` reports `tests 83` and `fail 0`. Evidence: 83 of 83 pass, exit 0.
- [x] T010 Rerun the battery in this worktree and compare its hooks row with T002 (`C`). Verify: `node C` prints the same hooks row line for line and the same `STATUS=FAIL failed=1 degraded=0 skipped=0 unknown=0` line, and exits 1. Evidence: The hooks row still fails with the same seven `not a hook source` lines, before and after. The cause is the worktree and is unchanged by this work.
- [x] T011 Confirm the code comments name no packet (`C`). Verify: `git diff -U0 C T | rg -n 'specs/|packet|008-'` prints nothing and exits 1. Evidence: `git diff -U0` on the check and its test, filtered for `specs/`, `packet` and `008-`, prints nothing and exits 1.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `node --test T` reports `tests 83` and `fail 0`, and the hooks row of `node C` matches the baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
