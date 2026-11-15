---
title: "Implementation Plan: Phase 6: append-lock-stale-reclaim"
description: "Plan for phase 6: replace the check-then-act stale append-lock reclaim in relaunch-core.cjs with a reclaim under a reclaim directory that reads the lock's age again before removal. The work changes one helper in one module and adds a two-waiter and an eight-waiter case to its test file."
trigger_phrases:
  - "append lock stale reclaim plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: append-lock-stale-reclaim

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS module |
| **Framework** | None, a hook library helper |
| **Storage** | The file system, lock directories beside the log and the state files |
| **Testing** | `node --test` |

### Overview
Change the stale reclaim inside `withAppendLock` at `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1397`. A waiter takes `<lockPath>.reclaim`, reads the lock's age again while holding it and removes the lock only when it is still stale. Prove the result with `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`, where two waiters and eight waiters on one stale lock never hold the lock together.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with a case where two waiters never hold the lock together
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: single-helper lock fix

### Key Components
- **`withAppendLock`** in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`: takes the mkdir lock beside a file, reclaims a stale lock and releases the lock, starting at line 1397.
- **`removeStaleLock`** in `.skilled/hooks/session-relaunch/lib/killer.cjs`: the existing takeover-mutex pattern, renames a stale directory to a private name at line 245 and removes that private path at line 250.
- **`removeOwnerlessMutex`** in `.skilled/hooks/session-relaunch/lib/killer.cjs`: the same pattern with an inode identity check at line 400, a post-rename inode read at line 414 and a restore on mismatch at line 433.
- **Two-waiter case** in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`: starts two waiters on one stale lock and asserts that their critical sections never overlap.

### Unsafe Directory
The review of phase 002 found that `withAppendLock` still created its lock directory inside a state directory the read check refuses. A new helper, `withStateLock`, takes the lock for a relaunch record. When `inspectStateDir` answers false for the directory that holds the record, it takes no lock and runs the callback, whose own check then refuses the read or throws on the write. A directory that does not exist yet keeps today's behavior. `arm`, `markSignalled`, `unarm`, `markDeferred` and `withdrawRecord` use the helper. The review of this phase found `arm` still on the generic lock, and it was switched. `withAppendLock` itself stays generic, because it also serializes handoff notes, and a note in a linked handoffs directory must keep its lock.

### Data Flow
A waiter calls `fs.mkdirSync(lockPath)`. On `EEXIST` it stats the lock and reads its age. When the age exceeds `APPEND_LOCK_STALE_MS`, it creates `<lockPath>.reclaim`. A waiter that finds that directory already there sleeps and retries, and removes it first when it is itself older than the stale bound. The waiter that holds it stats the lock again, removes the lock only when it is still stale and then removes the reclaim directory. The waiter then re-enters the acquire loop. The release path still removes `lockPath` only when this waiter holds it.

**Amendment, 2026-11-12.** The first design renamed the stale directory to a private name, compared inodes and renamed a fresh lock back. A stress run with one stale lock and eight waiters measured 127 to 176 overlapping critical sections per 60 rounds for that design in a scratch copy, and 0 with two waiters. A fresh lock that is renamed away leaves its path free for a third waiter. The reclaim directory measured 0 overlaps in 180 rounds of eight waiters and 30 rounds of sixteen. The operator chose the reclaim directory. The two `killer.cjs` patterns stay listed as the reference that was read, not as the shape that was built.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Finding class: `algorithmic`. The stale reclaim is a check-then-act sequence that two waiters can interleave.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `withAppendLock` stale reclaim at `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1409` to line 1422 | Owns the age check and the reclaim removal at line 1413 | update | `rg -c 'const reclaimPath' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 1 |
| `withAppendLock` release at `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1429` to line 1435 | Removes `lockPath` only when `held` is true | unchanged | `rg -c 'rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 2, the reclaim and the release |
| `removeStaleLock` in `.skilled/hooks/session-relaunch/lib/killer.cjs:225` to line 251 | Reference pattern, renames a stale directory before removal | not a consumer | `rg -n 'renameSync\(lockPath, stalePath\)' .skilled/hooks/session-relaunch/lib/killer.cjs` prints one line |
| `removeOwnerlessMutex` in `.skilled/hooks/session-relaunch/lib/killer.cjs:392` to line 440 | Reference pattern, checks the renamed inode and restores a mismatch | not a consumer | `rg -n 'renamedInode === mutexInode' .skilled/hooks/session-relaunch/lib/killer.cjs` prints one line |
| Callers of `withAppendLock` under `.skilled/hooks/session-relaunch` | Pass `fn` and receive its return value, with no change to the signature | not a consumer | `rg -n 'withAppendLock\(' .skilled/hooks/session-relaunch` prints the definition and every call site |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Observes the helper through two waiters on one stale lock | update | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with the two-waiter case |

Required inventories:
- Same-class producers: `rg -n 'rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints the one reclaim site and the one release site, both in `relaunch-core.cjs`. No other module owns an append-lock reclaim.
- Consumers of changed symbols: `rg -n 'withAppendLock' .skilled/hooks/session-relaunch` prints the definition and every call site. None changes, because the signature, the return value and the run-without-lock fallback stay the same.
- Matrix axes: waiter count (one, two, eight), lock state (absent, fresh, stale) and reclaim directory state (free, held, abandoned). Required rows: one waiter on an absent lock acquires, one waiter on a fresh lock waits, one waiter on a stale lock reclaims and acquires, two waiters on one stale lock serialize, eight waiters on one stale lock serialize, and a waiter that reads a fresh lock under the reclaim directory removes nothing.
- Algorithm invariant: at most one waiter holds `<logPath>.lock` at a time. A waiter removes the lock path only while it holds the reclaim directory and only after it read the lock as stale there, so a lock created after the first age check is never removed by another waiter. Adversarial cases: several waiters stat one stale lock, one takes the reclaim directory and removes the lock, each later one reads a fresh or missing lock and removes nothing, and a reclaim directory left by a killed waiter is removed by age.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: read `withAppendLock` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` and record the current age check and removal.
- **Implementation**: add the failing two-waiter and eight-waiter cases in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`, then replace the reclaim with the reclaim-directory step in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`.
- **Verification**: run `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` and the strict packet validator.

The ordered tasks live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `withAppendLock` reclaim with one waiter and a stale lock | `node --test` |
| Integration | Two waiters on one stale lock, each recording when its critical section starts and ends | `node --test` |
| Manual | None. The two-waiter case covers the concurrency path | `node --test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node` with the built-in test runner | Internal | Green | The proof command cannot run |
| `fs`, already imported in `relaunch-core.cjs` | Internal | Green | The reclaim directory cannot be created, but no new package is needed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A stale lock is no longer reclaimed, or the two-waiter case fails after the change.
- **Procedure**: Revert the phase commit that changes `withAppendLock` and the two-waiter case.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Implementation -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---
