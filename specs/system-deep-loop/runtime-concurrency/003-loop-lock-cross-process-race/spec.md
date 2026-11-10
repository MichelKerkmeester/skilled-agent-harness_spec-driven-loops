---
title: "Feature Specification: Fix the flaky cross-process loop-lock race test"
description: "The loop-lock test that races two child processes for one lock failed once in CI with two winners. The lock was correct: the first winner exited before its rival tried, so the rival rightly reclaimed a dead owner's lock. The test now keeps each child alive until both have reported."
trigger_phrases:
  - "loop lock cross process race"
  - "fix the flaky cross process loop lock race"
  - "exactly one fresh cross-process acquire"
  - "loop lock two winners"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Fix the flaky cross-process loop-lock race test

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/278-loop-lock-race` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
CI run 40957459754 ("Deep-Loop Runtime Tests", commit `c82a9aaa57`) failed one test: `tests/unit/loop-lock.vitest.ts` "allows exactly one fresh cross-process acquire to win", where `expect(results.filter(r => r.acquired)).toHaveLength(1)` got 2. The runs on the commits before and after passed, so the failure is intermittent. Two processes reporting a win on one lock reads as a broken mutual-exclusion guarantee, so the cause had to be settled before anyone trusts or ignores the test.

The lock is correct. Each test child acquired the lock, printed its result and exited at once. When the rival child started late, it found a lock whose owner pid was already dead. `isStaleLoopLock` treats a dead owner as stale (`lib/deep-loop/loop-lock.ts:641`), so the rival reclaimed it through `tryReclaimStaleLoopLock` (line 546). That is the designed recovery for a crashed holder, so the second win was legitimate.

### Purpose
The race test asserts mutual exclusion between two live processes and cannot pass or fail on process startup timing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ gh run view 40957459754 --log-failed
FAIL tests/unit/loop-lock.vitest.ts > loop-lock > allows exactly one fresh cross-process acquire to win
AssertionError: expected [ { acquired: true, ...(1) }, ...(1) ] to have a length of 1 but got 2
 tests/unit/loop-lock.vitest.ts:212:59
Test Files  1 failed | 170 passed (171)

# probe mirroring the old child helper, 200 races under 36 busy loops on 18 cores
doubleWins: 1
  b: acquired true, reclaimedPid null, acquire started 290, process exit seen at 306
  a: acquired true, reclaimedPid 29909 (b's pid), acquire started 307

# the real test, 200 runs under the same load, then 100 runs idle
BEFORE under load: pass=199 fail=1
BEFORE idle: pass=100 fail=0

# probe with the second child's acquire delayed 150 ms
winner exits at once (old harness): doubleWins 20 of 20
winner held alive (new harness):    doubleWins 0 of 20
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep each lock child alive after it reports its result, until the test writes a release file.
- Report the result with a synchronous write so the blocking wait cannot hold it back.
- Assert that no child won by reclaiming, and that both children exit 0.

### Out of Scope
- Any change to `lib/deep-loop/loop-lock.ts`. The investigation found no mutual-exclusion defect in it.
- A new sequential cross-process refusal test. `tests/unit/loop-lock-cli.vitest.ts:89` already covers a second process refusing a live, fresh holder.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts` | Modify | `runLockChild` holds the child alive until a release barrier, and the race test asserts against live children |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both racing children are alive when their results are compared | The child writes its result, then waits for `releasePath`. The test writes that file only after both results arrive |
| REQ-002 | The race test still catches a real create-path mutual-exclusion bug | With `linkSync` swapped for `renameSync` in `writeLoopLockExclusive`, the test fails with "to have a length of 1 but got 2" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The test no longer flakes under the load that reproduced the CI failure | 300 runs under 36 busy loops pass 300 of 300 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run tests/unit/loop-lock.vitest.ts -t "exactly one fresh"` passes 300 of 300 under CPU load and 100 of 100 idle.
- **SC-002**: The seven unit files that exercise the lock pass with 105 of 105 tests, and `npm run typecheck` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node `--experimental-strip-types` in the child spawn | The child cannot import the TypeScript lock module without it | Unchanged from the old helper |
| Risk | A child that never sees the release file would hang the test | Low | The child gives up after 10 s, and the test writes the release file in `finally` before it awaits the exits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
