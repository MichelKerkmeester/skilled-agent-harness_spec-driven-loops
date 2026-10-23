---
title: "Tasks: Phase 64: append-log-concurrency-flake"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "append log concurrency flake tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 64: append-log-concurrency-flake

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

- [x] T001 Read `appendLog` and the failing case 'appendLog keeps every line when eight processes append concurrently', so the peek, the write and the assertion at line 987 are understood before any edit (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`)
- [x] T002 Establish the baseline the failure has to be measured against: the test passed 100 of 100 local runs before the fix, and a stress run of 16 workers by 300 lines by 30 rounds plus a 9000-byte-line variant over 20 rounds found 0 bad rounds, because macOS APFS does not show the torn size the CI run saw on ubuntu-latest (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `withAppendLock(logPath, fn)`: a mkdir-based lock at `relaunch.log.lock` held across `fn`, waiting in 2 ms steps up to `APPEND_LOCK_WAIT_MS` of 2000, reclaiming a lock older than `APPEND_LOCK_STALE_MS` of 10000, checking the deadline on every retry path, hoisting the sleep buffer to one module constant and falling through to an unlocked run on any lock error (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
- [x] T004 Run `appendLog`'s open, fchmod, last-byte peek, write and fsync inside `withAppendLock`, so a concurrent appender's in-flight write can no longer make the peek see a non-newline byte and prepend a spurious empty line (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
- [x] T005 Add the regression test 'appendLog waits for an in-flight append before peeking the last byte', which simulates an in-flight writer with a `torn` line that has no newline and the lock held, then checks that the child waits and that the file holds `torn-completed` and then the child's line, with no empty line (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Prove the regression test catches the race: it failed 5 of 5 runs on the old code, failed 0 of 5 on the fixed code, and failed 0 of 100 in a later loop (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`)
- [x] T007 Rerun the suites the change touches after the fix: the concurrency test passed 100 of 100 runs, the stress run of 16 workers by 300 lines by 30 rounds found 0 bad rounds, the hook node suite passed 915 of 915 from a baseline of 914 with the 1 new test, the hooks vitest suite passed 461 of 461 and `relaunch-core.test.cjs` passed 102 of 102 (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`)
- [x] T008 Run one separate read-only DeepSeek review. It returned VERDICT: PASS with 5 P2 findings; the deadline being skipped on the retry paths and the per-poll buffer allocation were fixed, and the stale-lock reclaim race, the unlocked fallback after 2 s, Windows `rmdir` EPERM/EBUSY and the vacuous-pass case are recorded and not fixed (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
- [x] T009 Fill this phase's four docs and the parent packet's phase-map and handoff rows from the facts and the verification record (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`)
- [ ] T010 Commit and push to main (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
- [ ] T011 Confirm CI is green on the pushed commit (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, the push and CI tasks included
- [x] No `[B]` blocked tasks remaining
- [x] Review done: one separate read-only DeepSeek session returned VERDICT: PASS with 5 P2s, two fixed and four recorded
- [x] Manual verification passed: the regression test fails on the old code and passes on the fixed one, the concurrency test passes 100 of 100 runs, the stress run finds 0 bad rounds and the hook node and vitest suites are green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **The hook this fixes**: See `../../../.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`
- **The previous phase**: See `../063-v4-0-0-13-final-changelog/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
