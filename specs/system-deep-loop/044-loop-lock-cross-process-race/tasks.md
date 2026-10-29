---
title: "Tasks: Fix the flaky cross-process loop-lock race test"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "loop lock cross process race tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Fix the flaky cross-process loop-lock race test

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

`T` is `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts`. `L` is `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts`. Commands run from `.skilled/skills/system-deep-loop/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the CI failure (`gh run view 40957459754 --log-failed`). Verify: the log prints "to have a length of 1 but got 2" at `T:212:59`.
- [x] T002 Reproduce the failure under load (`T`). Verify: 200 runs under 36 busy loops print `pass=199 fail=1`.
- [x] T003 Attribute the double win with a probe that reports `reclaimed` and timings (scratchpad probe). Verify: the late winner's `reclaimedPid` equals the early winner's pid, and its acquire began after that pid exited.
- [x] T004 Check the lock for a real defect (`L`). Verify: the create path publishes with `linkSync` (line 283), and a reclaim needs a stale holder (lines 546 and 641).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Hold each child alive until a release barrier and report with `writeSync` (`T`, `runLockChild`). Verify: `rg -n "waitForFile\(releasePath" T` prints one line.
- [x] T006 Compare results while both children run, assert no reclaimed win, then release and assert exit codes (`T`, the race test). Verify: `rg -n "toEqual\(\[0, 0\]\)" T` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the race test under load (`T`). Verify: 300 runs under 36 busy loops print `pass=300 fail=0`, and 100 idle runs print `pass=100 fail=0`.
- [x] T008 Run the rename-publish mutant (`L` line 283 swapped, then restored). Verify: 20 runs print `pass=3 fail=17` with "to have a length of 1 but got 2", and `git diff --quiet -- L` exits 0 afterwards.
- [x] T009 Run the lock-touching unit files and the typecheck. Verify: vitest prints `Test Files 7 passed (7)` and `Tests 105 passed (105)` with exit 0, and `npm run typecheck` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Load loop, mutant and suite runs recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
