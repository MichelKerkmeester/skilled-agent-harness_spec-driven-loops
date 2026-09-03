---
title: "Rollback rehearsal — 2026-08-18"
trigger_phrases: []
---
# Rollback rehearsal — 2026-08-18

The documented procedure was rehearsed against real history rather than read and
signed off. It does not survive contact.

## What was rehearsed

Step 1 of the documented procedure: *"Revert the export demotion commit,
restoring the direct export while keeping fencing inside the gateway."*

The export demotion is `5c98e4654e feat(deep-loop): gateway-only fenced ledger
mutation`. Rehearsed in an isolated worktree at a committed, clean HEAD, with
the undo (`git reset --hard`) established before starting.

```
$ git revert --no-commit 5c98e4654e
CONFLICT (content): ... x64
```

## Result: the documented rollback is NOT executable as written

| Measure | Value |
|---|---|
| Conflicted files | **64** |
| Total files the revert touches | 99 |
| Commits to `authorized-ledger/` since the demotion | 11 |

The plan's premise was that "the surface change and the race fixes are separate
commits by design," so reverting the surface change alone would be surgical.
That was true when written. Eleven subsequent commits later it is not: the
revert now collides across the ledger, the shadow-parity adapter, blinded
adjudication, branch leases, and claim continuity.

The worktree was restored to its pre-rehearsal commit and verified clean.

## Why a revert cannot be repaired into the answer

Resolving 64 conflicts by hand is not a rollback — it is a re-implementation
performed under incident pressure, which is the worst possible time to do it.

Nor does reverting reach the stated goal any more. The exported bridge that
survives today, `invokeAppendAuthorized`, still requires a `FenceCapability` and
independently re-confirms the coordinator's current lease. There is no longer a
"direct export" sitting behind the demotion waiting to be restored; restoring an
unfenced append would mean deliberately writing a new unguarded path, not
undoing an old commit.

## The rollback that would actually work

Forward-fix, not revert. If the gateway-only surface breaks a caller that cannot
be migrated:

1. Add a narrowly-scoped exported wrapper alongside the existing seam, taking
   the capability the caller can obtain, rather than reverting history.
2. Keep fencing enforced inside the gateway — that is where the safety lives,
   and it is unaffected by the surface question.
3. Re-run the two-process harness for whichever mechanism prompted the rollback.
4. Record which mechanisms were relaxed; the corresponding blocker reopens for
   those.

The independent race fixes (`ff3a574014` and siblings) remain individually
revertible — that half of the plan is intact and was not disturbed by this
finding.

## The durable lesson

A rollback plan is a claim about the future that decays silently. This one was
accurate when written and false within eleven commits, and nothing in the
checklist would have caught that, because "documented" and "rehearsed" were
being satisfied by the same act of writing. Rehearsal is what separated them.
