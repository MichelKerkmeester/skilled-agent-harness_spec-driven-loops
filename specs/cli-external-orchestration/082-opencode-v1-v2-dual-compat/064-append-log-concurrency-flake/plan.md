---
title: "Implementation Plan: Phase 64: append-log-concurrency-flake"
description: "Put a mkdir-based lock around `appendLog`'s last-byte peek, its write and its fsync, so a concurrent appender's in-flight write can no longer make the peek see a non-newline byte and prepend a spurious empty line. The lock waits in 2 ms steps up to 2 s, reclaims a lock older than 10 s and falls through to an unlocked append on any lock error. A new regression test simulates an in-flight append and fails on the old code."
trigger_phrases:
  - "append log concurrency flake plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 64: append-log-concurrency-flake

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | `node:test` for the hook node suite, vitest for the hooks suite |
| **Storage** | Plain-text relaunch log on disk, `relaunch.log` in the state directory |
| **Testing** | `node --test`, vitest, a concurrent-append stress run and a regression test that simulates an in-flight writer |

### Overview
One failing CI run on ubuntu-latest showed 201 lines where the concurrency test expected 200, with every worker exiting 0. `appendLog` peeks the log's last byte and prepends `\n` when that byte is not one, and on Linux a concurrent appender's in-flight write can make the size end mid-line, so the peek added a spurious empty line. A new helper `withAppendLock(logPath, fn)` holds a mkdir-based lock at `relaunch.log.lock` across the peek, the write and the fsync, waiting in 2 ms steps up to `APPEND_LOCK_WAIT_MS` of 2000 and reclaiming a lock older than `APPEND_LOCK_STALE_MS` of 10000. On timeout or any lock error it appends without the lock, because the history log must never block a hook. A new regression test simulates an in-flight writer and fails 5 of 5 on the old code and 0 of 5 on the fixed code. The commit, push and CI run stay open.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
- [x] Read-only review findings fixed or recorded (one PASS with 5 P2s, two fixed and four recorded)
- [x] Commit pushed to main with CI green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One mutual-exclusion wrapper around an existing read-then-append sequence, with fail-open error handling.

### Key Components
- **`withAppendLock(logPath, fn)`**: Takes a mkdir-based lock at `${logPath}.lock`, runs `fn`, and removes the lock in a `finally`. Every retry path re-checks the deadline, so a lock that keeps going stale or vanishing cannot hold an appender past the wait bound.
- **`appendLog`**: Runs its open, fchmod, last-byte peek, write and fsync inside `withAppendLock`, so the peek and the write see one consistent file state.
- **Module constants**: `APPEND_LOCK_WAIT_MS` at 2000 and `APPEND_LOCK_STALE_MS` at 10000 bound the wait and the reclaim, and `APPEND_LOCK_SLEEP_CELL` is one hoisted buffer rather than one allocated per poll.
- **Regression test**: 'appendLog waits for an in-flight append before peeking the last byte' simulates an in-flight writer with a `torn` line and the lock held, then checks that the child waits and that the file holds `torn-completed` and then the child's line, with no empty line.

### Data Flow
`appendLog` formats the event line, then enters `withAppendLock`. The lock is taken with `mkdirSync`; a second appender sees `EEXIST`, checks the lock's age, and either waits 2 ms, reclaims a lock older than 10 s or breaks out. Inside the lock the log is opened with O_APPEND, re-pinned to mode 0600, its last byte peeked and the line written and fsynced. On timeout or any lock error the same body runs unlocked. Writes with O_APPEND stay atomic, so only the peek needed the guard.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---
