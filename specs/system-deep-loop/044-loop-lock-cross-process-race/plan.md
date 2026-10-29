---
title: "Implementation Plan: Fix the flaky cross-process loop-lock race test"
description: "Reproduce the double win, attribute it to a child exiting before its rival acquires, then change the test helper so each child stays alive until both results are in. Prove the lock is unchanged and the test still catches a real create race."
trigger_phrases:
  - "loop lock cross process race plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Fix the flaky cross-process loop-lock race test

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, child processes spawned with `--experimental-strip-types` |
| **Framework** | Vitest 4.1.12 |
| **Storage** | A lock file in a per-test temp directory |
| **Testing** | Vitest, plus a scratch probe that mirrors the child helper |

### Overview
One test helper changes: `runLockChild` in `tests/unit/loop-lock.vitest.ts`. Each child reports its acquire result and then blocks on a release file, so a winner's pid stays alive while its rival tries. A load loop shows the flake is gone, and a mutation run shows the test still fails on a real create race.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The CI failure reproduced locally under load (1 of 200)
- [x] The double win attributed: the rival's `reclaimed` holder was the first winner's pid
- [x] The lock module checked for a real defect on the create, read and reclaim paths

### Definition of Done
- [x] 300 of 300 runs pass under the same load
- [x] The rename-publish mutant fails the race test
- [x] The seven lock-touching unit files pass 105 of 105, and typecheck exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-barrier child harness.

### Key Components
- **`runLockChild`**: spawns a child that waits for a start barrier, acquires, writes its result with `writeSync(1, ...)`, then waits for a release barrier. It returns a `result` promise that settles on the first stdout line and an `exited` promise that settles with the exit code.
- **The race test**: starts both children, opens the start barrier, compares both results while both children are alive, then opens the release barrier and asserts both exit 0.

### Data Flow
The test writes `go`, each child acquires and prints one JSON line, the test reads both lines and checks the lock file, then writes `release` and waits for both children to exit.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces and attributes the double win. Implementation changes the helper and the test. Verification runs the load loop, the mutant and the lock suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The flake check is `npx vitest run tests/unit/loop-lock.vitest.ts -t "exactly one fresh"` in a loop of 300 under 36 busy shell loops, which must print 300 passes. The sensitivity check swaps `linkSync` for `renameSync` in `writeLoopLockExclusive`, runs the same test 20 times and expects failures with "to have a length of 1 but got 2", then restores the line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the runtime's existing Vitest and Node.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the race test hangs or fails on a child exit code. Revert the one test file to its previous content, which restores the old helper.
<!-- /ANCHOR:rollback -->

---
