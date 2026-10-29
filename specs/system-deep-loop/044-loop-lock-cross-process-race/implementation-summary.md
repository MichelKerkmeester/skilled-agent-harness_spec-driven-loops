---
title: "Implementation Summary"
description: "The loop-lock race test failed because a winning child exited before its rival tried, and the rival correctly reclaimed the dead owner's lock. The test now keeps both children alive until both have reported. The lock module is unchanged."
trigger_phrases:
  - "loop lock cross process race implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/044-loop-lock-cross-process-race"
    last_updated_at: "2026-10-29T22:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed the race test harness; lock unchanged"
    next_safe_action: "Operator reviews and commits the test change"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "loop-lock-cross-process-race"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is the double win a lock bug? No. The winner exited first and the rival reclaimed a dead owner's lock."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 044-loop-lock-cross-process-race |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The loop-lock race test no longer fails on startup timing, and it still fails when two live processes really both win. The lock was never broken. The test let a winning child exit before its rival tried, and reclaiming a dead owner's lock is what the lock is meant to do.

### Fix the flaky cross-process loop-lock race test

Each child spawned by `runLockChild` now prints its acquire result and then waits for a release file. The test compares both results while both children are still running, so a second win can only mean a live, fresh holder lost the lock. The test also asserts that no child won by reclaiming, writes the release file, and checks that both children exit 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts` | Modified | `runLockChild` holds each child alive until a release barrier, and the race test asserts against live children |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failure was reproduced first: 1 of 200 runs under 36 busy loops on 18 cores. A probe that mirrors the old helper caught one double win in 200 races and showed the late child's `reclaimed` holder was the early child's pid, with its acquire starting after that pid exited. Delaying the second child by 150 ms turned that into 20 of 20 double wins, and holding the winner alive brought it to 0 of 20. After the change, the race test passed 300 of 300 under the same load and 100 of 100 idle. To show the test still guards the lock, `linkSync` in `writeLoopLockExclusive` was swapped for `renameSync`, which made the test fail 17 of 20 runs with the CI message. The line was then restored and `git diff --quiet` on the lock module exited 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the test, not the lock | The double win came from reclaiming a dead owner's record. Refusing that reclaim would leave a crashed holder's lock stuck for good |
| Report with `writeSync(1, ...)` | The child blocks with `Atomics.wait` after reporting, and an async pipe write could sit unflushed behind that wait |
| No new sequential cross-process test | `tests/unit/loop-lock-cli.vitest.ts:89` already makes a second process refuse a live, fresh holder |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Race test, 300 runs under 36 busy loops | PASS, `pass=300 fail=0` (before: `pass=199 fail=1` of 200) |
| Race test, 100 idle runs | PASS, `pass=100 fail=0` (before: `pass=100 fail=0`) |
| Rename-publish mutant, 20 runs | Caught, `pass=3 fail=17`, "to have a length of 1 but got 2" |
| `loop-lock.vitest.ts` alone | PASS, 20 of 20 tests |
| Seven lock-touching unit files | PASS, `Test Files 7 passed (7)`, `Tests 105 passed (105)`, exit 0 |
| `npm run typecheck` | PASS, exit 0, no diagnostics |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The race test rarely reaches the reclaim path.** Two children usually collide on the create path, so a mutant that treats every holder as stale passed it 5 of 5 times. That bug class is caught by the sequential refusal tests in `loop-lock.vitest.ts` and `loop-lock-cli.vitest.ts`, not by this race.
2. **The full deep-loop runtime suite was not run.** Only the seven unit files that exercise the lock were run. `tests/unit/runtime-bootstrap.test.cjs` is outside the Vitest include pattern and was not run.
<!-- /ANCHOR:limitations -->

---
