---
title: "Implementation Summary"
description: "A single CI flake in the relaunch history log is closed: `appendLog` now holds a mkdir-based lock across its last-byte peek, its write and its fsync, so a concurrent appender's in-flight write can no longer make the peek prepend a spurious empty line. The log holds one line per event under concurrency, and a lock that cannot be taken falls through to an unlocked append, so the history log still never blocks a hook."
trigger_phrases:
  - "append log concurrency flake implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/064-append-log-concurrency-flake"
    last_updated_at: "2026-10-23T04:12:27Z"
    last_updated_by: "spec-record-writer"
    recent_action: "Filled the phase records after the fix, the regression test and the read-only review"
    next_safe_action: "Commit and push to main, then confirm CI on the pushed commit"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-064-append-log-concurrency-flake"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 064-append-log-concurrency-flake |
| **Status** | In Progress |
| **Completed** | 2026-10-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The relaunch history log now holds one line per event even when eight processes append at once. The flake that showed up once in CI is closed by holding one lock across the last-byte peek and the write, and a lock that cannot be taken falls through to an unlocked append, so logging still never blocks a hook.

### Phase 64: append-log-concurrency-flake

The Hook Node Tests case 'appendLog keeps every line when eight processes append concurrently' failed once. It ran on main commit `9c4de85d6f`, run `39880116448`, attempt 1, job 'Hook node:test suites', on ubuntu-latest, and the assertion error was `201 !== 200` at line 987, the line count, with every worker exiting 0. Attempt 2 passed. The cause was the peek rather than the write. `appendLog` reads the log's last byte through fstat size and a readSync at size-1, then prepends `\n` when that byte is not `\n`, so an event after a truncated line starts on its own line. On Linux a concurrent appender's in-flight write can make the size end mid-line, so the peek saw a non-newline byte and prepended a spurious `\n`; when the other write completed, the file held an empty line, which made the 201st line. Writes with O_APPEND are atomic, so no event line was split.

`withAppendLock(logPath, fn)` now holds a mkdir-based lock at `relaunch.log.lock` across the peek, the write and the fsync. It waits in 2 ms steps up to `APPEND_LOCK_WAIT_MS` of 2000 and reclaims a lock older than `APPEND_LOCK_STALE_MS` of 10000. On timeout or any lock error it appends without the lock, because the history log must never block a hook. The deadline is checked on every retry path and the sleep buffer is one hoisted module constant, so a lock that keeps going stale or vanishing cannot hold an appender past the wait bound.

The new test 'appendLog waits for an in-flight append before peeking the last byte' simulates an in-flight writer with a `torn` line that has no newline and the lock held, then checks that the child waits and that the file holds `torn-completed` and then the child's line, with no empty line. It failed 5 of 5 runs on the old code and 0 of 5 on the fixed code, and 0 of 100 in a later loop.

macOS does not show the torn size, so the local evidence had to come from the reproduction rather than from a rerun. The test passed 100 of 100 local runs before the fix, and a stress run of 16 workers by 300 lines by 30 rounds, plus a 9000-byte-line variant over 20 rounds, found 0 bad rounds. The CI failure is the evidence that the race is real.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | Added `withAppendLock`, ran `appendLog`'s peek, write and fsync under it, checked the deadline on every retry path and hoisted the sleep buffer to one module constant |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Added 'appendLog waits for an in-flight append before peeking the last byte' |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 064 and the 063 to 064 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash 1017 wrote the code, and a separate read-only DeepSeek session reviewed it. That review returned VERDICT: PASS with 5 P2 findings. Two were fixed: the deadline being skipped on the retry paths and the per-poll buffer allocation. Four are recorded and not fixed, because each is rare or fail-open: the stale-lock reclaim race between two waiters, which needs a crash-left lock first; the unlocked fallback after 2 s, which is accepted as fail-open; Windows `rmdir` EPERM/EBUSY; and the regression test's ability to pass vacuously when the child starts after the lock is released, which cannot false-fail.

After the fix the concurrency test passed 100 of 100 runs, the stress run of 16 workers by 300 lines by 30 rounds found 0 bad rounds, the hook node suite passed 915 of 915 against a baseline of 914 plus the 1 new test, the hooks vitest suite passed 461 of 461 and `relaunch-core.test.cjs` passed 102 of 102. The push to main is still pending, so the commit and the CI run remain open.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lock the peek rather than the write | O_APPEND writes are atomic, so no event line was ever split; the only race was between the size read and the write that followed it |
| Use a mkdir-based lock | `mkdirSync` is atomic on every platform the hook runs on and needs no lockfile library, so one directory at `relaunch.log.lock` carries the state |
| Wait in 2 ms steps up to 2 s | The wait has to be short because history logging sits on the hook path, and a 2 ms poll is fine-grained enough to cover a write that is already in flight |
| Reclaim a lock older than 10 s | A killed appender would otherwise leave the lock behind forever, and 10 s is far longer than any append takes |
| Fall through to an unlocked append on any lock error | A log write that fails must not fail the hook, so the failure mode is a rare empty line rather than a blocked session |
| Check the deadline on every retry path | The review found the deadline could be skipped when a lock kept going stale or vanishing, which would let an appender wait past the bound |
| Hoist the sleep buffer to one module constant | The review found a fresh buffer allocated per poll; one `SharedArrayBuffer` cell serves every `Atomics.wait` |
| Record the four remaining P2s instead of fixing them | Each needs a crash, a timeout or a slow child to reach, and none of them can split an event line; the record keeps them available for a later pass |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Regression test on the old code | FAIL 5 of 5 runs, which reproduces the race |
| Regression test on the fixed code | PASS 0 failures of 5 runs, and 0 of 100 in a later loop |
| Concurrency test 'appendLog keeps every line when eight processes append concurrently' | PASS: 100 of 100 runs after the fix |
| Stress run, 16 workers by 300 lines by 30 rounds | PASS: 0 bad rounds |
| Stress run, 9000-byte-line variant, 20 rounds | PASS: 0 bad rounds |
| Hook node suite, 30 files under CI's collection rule | PASS: 915 of 915, the baseline of 914 plus the 1 new test |
| Hooks vitest suite | PASS: 461 of 461 |
| `relaunch-core.test.cjs` | PASS: 102 of 102 |
| Read-only DeepSeek review | PASS: 5 P2s, two fixed (the retry-path deadline and the per-poll buffer) and four recorded |
| Commit, push and CI green on the commit | PENDING: the push to main has not happened yet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The stale-lock reclaim race between two waiters.** Two appenders can both judge the same lock stale and both remove it, so both may then take it. Reaching it needs a crash-left lock first, so it is rare. Recorded from the review and not fixed.
2. **The unlocked fallback after 2 s.** An appender that cannot take the lock within `APPEND_LOCK_WAIT_MS` writes without it, which can still leave an empty line. This is accepted as fail-open, because the history log must never block a hook.
3. **Windows `rmdir` EPERM and EBUSY.** Removing a held lock directory can fail on Windows. The failure falls through to the unlocked path and the lock ages out after 10 s. Recorded from the review and not fixed.
4. **The regression test can pass vacuously.** If the child starts after the lock is released it never exercises the wait. The test cannot false-fail, so the vacuous case only weakens the proof. Recorded from the review and not fixed.
5. **The fix is proven by the CI failure, not by a local rerun.** macOS APFS does not show the torn size, so the test passed 100 of 100 local runs before the fix. The reproduction and the CI failure together are the evidence.
<!-- /ANCHOR:limitations -->

---
