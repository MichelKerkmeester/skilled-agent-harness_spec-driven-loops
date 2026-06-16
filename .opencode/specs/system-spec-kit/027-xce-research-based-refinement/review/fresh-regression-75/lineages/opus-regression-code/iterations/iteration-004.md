# Seat opus-regression-code — iteration 4 (global #4)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-regression-code
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=3

## Analysis

I've traced the full liveness logic and the test assertions. Here is my review.

## Analysis — seat `opus-regression-code`

**Scope reviewed (read in full):**
- `scripts/memory/generate-context.ts:56-59, 405-500, 845-874` — the canonical save-lock module (constants, owner-state liveness, heartbeat, acquire/reap/release, call site)
- `scripts/dist/memory/generate-context.js:395-411` — compiled runtime, confirmed byte-equivalent logic
- `scripts/tests/generate-context-save-lock.vitest.ts` (all 3 tests) — the regression suite for this module

### Regression verdict: the live-owner protection genuinely holds

The reap decision is at `generate-context.ts:485`:
```
if (ownerState === 'dead' || (ownerState === 'unknown' && ageMs > CANONICAL_SAVE_STALE_MS))
```
A lock is reapable **only** when the owner pid is provably dead, or the owner record is unreadable/corrupt *and* stale (>30s). `getCanonicalSaveLockOwnerState` (411-437) returns `'alive'` on a successful `process.kill(pid,0)` and also on `EPERM` — and for an `'alive'` owner, **age is never consulted**, so an aged-but-live lock always throws `Canonical save lock is active` (490). This is the correct, conservative bias: a live owner's lock can never be stolen, regardless of how old it looks.

The heartbeat (448-461) refreshes the directory mtime every 10s against a 30s stale window (3× margin). Notably, the heartbeat only matters for the `'unknown'` branch — a live owner is already protected by the pid check, so the heartbeat is belt-and-suspenders that additionally protects a live owner whose owner-file read transiently fails. Sound.

**The +28 regression tests do assert it** (the 3 in this file are the lock-specific ones):
- `does not reap an aged lock owned by a live pid` (73-82) — ages the lock via `utimesSync` to `STALE_MS+1000`, owner = live `process.pid`, asserts acquire **throws** and the owner file is byte-unchanged. This is a real assertion of the core regression. ✓
- `reaps an aged lock owned by a dead pid` (84-99) — uses `getExitedChildPid()` which *verifies* `ESRCH` before use (39-62), so the dead-pid precondition is provable, not assumed. Asserts reap + owner rewrite + warn. ✓
- `refreshes lock directory mtime while held` (101-118) — asserts heartbeat advances mtime. ✓

These are not vacuous — they assert the discriminating behavior, not just "no throw."

### Findings (no P0/P1; the assigned regression passes)

**P2 — concurrent reap of an abandoned lock can yield two writers.** At 485-488, two processes that both observe the *same* dead/stale-unknown lock will each `rmSync(lockPath, {force:true})` then `mkdirSync`. P2 can `rmSync` away P1's freshly-created lock dir (force ignores that it changed) and create its own, leaving both processes believing they hold the single-writer lock → concurrent canonical saves to one spec folder. This is **not** a live-owner steal (the regression angle holds), and the precondition is narrow — a pre-existing *abandoned* lock plus two simultaneous savers of the same folder — but it is a genuine single-writer gap in the reaped path. A guard (e.g. mkdir a uniquely-named temp dir and atomically rename, or re-stat ownership after reap-create) would close it.

**P2 — the reap branch is untested.** Tests cover dead-reap and live-no-reap, but the `ownerState === 'unknown' && ageMs > STALE_MS` reap (orphaned/corrupt owner file) and the `'unknown'` non-stale no-reap discrimination have no coverage; a future regression in the age comparison would pass CI silently.

**P2 — owner-file write is not atomic vs. lock visibility.** `createCanonicalSaveLock` (463-468) does `mkdirSync` then a separate `writeFileSync(owner)`. If the write throws (ENOSPC/EACCES) after mkdir, the dir exists with no owner file; the creator bails but leaves an orphan that is only recoverable after the 30s stale window (unknown+stale). Self-inflicted, recoverable, low-impact — hygiene only.

None of these undermine the assigned regression: a live owner's lock is not stealable, the liveness logic is correct, and the tests assert it. The P2s are reap-path/coverage hardening suggestions.

```json
{"seat":"opus-regression-code","model":"claude-opus-4-8","angle":"REGRESSION: save lock is no longer stealable from a live owner (reap requires a provably-dead owner pid; holders heartbeat). Verify liveness logic + that the +28 regression tests actually assert it.","verdict":"PASS","summary":"Live-owner lock is genuinely non-stealable: reap requires dead pid or unknown+stale, alive-state ignores age, and the 3 lock tests assert live-no-reap/dead-reap/heartbeat. Only narrow P2 reap-path gaps.","files_reviewed":[".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts",".opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js",".opencode/skills/system-spec-kit/scripts/tests/generate-context-save-lock.vitest.ts"],"findings":[{"severity":"P2","dimension":"correctness","title":"Concurrent reap of an abandoned lock can produce two simultaneous writers","file":".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:487","evidence":"On a dead/unknown-stale lock, acquire does rmSync(lockPath,{recursive,force}) then createCanonicalSaveLock (mkdir). Two processes reaping the same abandoned lock can each rm the other's fresh dir and re-create, both returning success.","why":"Defeats single-writer guarantee for the reaped path → concurrent canonical saves to one spec folder. Not a live-owner steal (regression holds), but a real correctness gap with a narrow precondition (pre-existing abandoned lock + concurrent savers).","recommendation":"Make reap-then-create atomic: mkdir a unique temp dir and rename into place, or re-read owner after create and abort if pid != process.pid."},{"severity":"P2","dimension":"correctness","title":"Reap branch (unknown+stale) and unknown non-stale no-reap are untested","file":".opencode/skills/system-spec-kit/scripts/tests/generate-context-save-lock.vitest.ts:64","evidence":"Suite covers live-aged-no-reap, dead-reap, and heartbeat only. No test exercises ownerState==='unknown' with ageMs>STALE_MS (reap) nor unknown+fresh (no reap).","why":"A future regression in the age comparison or owner-parse path would pass CI silently; the stale-window discrimination that protects against premature unknown reaps is unguarded by tests.","recommendation":"Add a test writing a lock dir with a missing/corrupt owner file, aged past STALE_MS (expect reap) and one within the window (expect throw)."},{"severity":"P2","dimension":"maintainability","title":"Lock dir creation is non-atomic vs. owner-file write","file":".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:463","evidence":"createCanonicalSaveLock does mkdirSync then a separate writeFileSync('owner'). If the write throws after mkdir, an owner-less dir is left and heartbeat never starts.","why":"Orphan lock is only recoverable after the 30s unknown+stale window, briefly blocking saves to that folder. Recoverable and low-probability, but avoidable.","recommendation":"Write the owner file into a temp dir first and rename the populated dir into place, so a visible lock always has an owner record."}]}
```
