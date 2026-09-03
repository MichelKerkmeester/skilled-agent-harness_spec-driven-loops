---
title: "Open finding — live writer lock can be reclaimed under concurrency"
trigger_phrases: []
---
# Open finding — live writer lock can be reclaimed under concurrency

**Status:** CONFIRMED failure, root cause is a HYPOTHESIS (not yet proven by an instrumented repro).
**Owner:** unassigned — raised while verifying T015; NOT fixed here (outside T015 scope).

## Confirmed symptom
`tests/unit/authorized-ledger.vitest.ts › locked ordering and immutable integrity ›
serializes concurrent processes into one contiguous unambiguous head` fails at the worktree base
commit `409e2346c0a`, with T015 absent. The test spawns six real writer processes.

```
Error: Writer 3 exited 1: .../lib/authorized-ledger/immutable-frame-store.ts:590
AuthorizedLedgerError: Ledger writer lock identity changed before release
```

Reproduced in four independent runs at 15920ms / 20665ms / 28113ms / 30271ms. The longest hit the
30s cap, which then cascaded an `ENOTEMPTY` in the suite's temp-root cleanup — so the timeout and
the `ENOTEMPTY` are downstream of this failure, not separate defects.

This matters because `authorized-ledger.vitest.ts` is one of the eight suites the packet handover
claims pass **223/223 in isolation**. That claim does not hold at this commit on this machine.

## Root-cause hypothesis
The acquire path is sound: `#tryAcquireLock` writes the complete record to a candidate file, fsyncs
it, then `linkSync`s it onto the lock path. `linkSync` is atomic and fails `EEXIST` when taken, so
there is no observably-empty lock window on acquire.

The gap is in `#archiveDeadLock`:

```
const holder = readLockRecord(this.#lockPath);
if (holder && isProcessAlive(holder.owner_pid)) return;   // liveness check
...
renameSync(this.#lockPath, archivedPath);                 // reclaim
```

The liveness check and the reclaim are not atomic against each other. Between observing "no holder"
(or a dead holder) and performing the rename, a different process can legitimately `linkSync` a NEW
live lock onto the same path. The rename then archives that live holder's lock. When the victim
later calls `#releaseLock`, the record no longer matches its token and pid, which raises exactly the
observed `LOCK_LOST` / "identity changed before release".

The window is short, so the failure rate rises with the number of concurrent writers and with
scheduling jitter — consistent with it surfacing in the six-process test and with its variable
duration.

## What would confirm or refute it
Instrument `#archiveDeadLock` to log the observed holder token immediately before `renameSync` and
compare it against the token present at rename time; a mismatch on a failing run confirms the steal.
A refutation would show the victim's lock was already gone for another reason.

## Suggested direction (not implemented)
Make the reclaim identity-bound rather than path-bound: only archive when the lock still carries the
exact token and pid observed during the liveness check, so a lock that was swapped in between is
never stolen.
