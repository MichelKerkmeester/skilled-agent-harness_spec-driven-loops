---
title: "The three missing attestations are one missing reader"
trigger_phrases: []
---
# The three missing attestations are one missing reader

## Correction to the earlier scope estimate

An earlier note concluded that completing the flip needed production paths across four
subsystems — rollback anchors, verifier receipts, replay fingerprints, parity digests — and
called it a multi-session build. That estimate was too large, and the reason is worth recording
because it changes what the remaining work is.

## Every attestation derives from five observable facts

The one module that has ever built a classification evidence record does not hardcode the
attestations. It derives all of them from a five-field observation of a state surface:

    { stopSequence, pendingEffects[], receipts[], leases[], continuityId }

From those alone:

| Field | Derivation |
|---|---|
| `rollbackReady` | `stopSequence !== null && continuityId !== null` |
| `receiptCoverage` | every pending effect has a matching receipt |
| `leaseState` | from the lease set |
| `pendingEffectsState` | from pending effects plus receipt coverage |
| `rollbackAnchor.retained` / `.restorable` | `rollbackReady` |
| `verifier.verified` | `rollbackReady && receiptCoverage && leaseState !== 'uncertain'` |
| `proof.*` | continuity id, stop sequence, pending effects, receipt coverage |

So there are not three independent attestation producers to build. There is one reader to
build, and a derivation that already exists and is already exercised.

## The retention minimums are policy, not observation

`minimumRetentionDays` and `minimumSuccessfulRuns` are copied from the frozen census contract,
and `hasSafeRollbackAnchor` then compares them against that same contract. That looks circular
and is not: the anchor declares the retention policy it satisfies, and the check enforces that
the declared policy is at least as strict as the census requires. Copying the contract value is
the correct way to declare conformance, not a fabricated observation.

Recording this because the shape invites the opposite reading, and "fixing" it would break a
real conformance check.

## What is genuinely missing

A production reader that extracts those five facts from a real state surface, given the census
row's `resolvedPath`:

- `leases` — lock and pause files under the row's control surface
- `pendingEffects` and `receipts` — the row's effect and receipt records
- `continuityId` and `stopSequence` — the tail of the row's state file

The derivation itself should move out of the fixtures module into a shared one so production
and fixtures compute evidence the same way. That matters beyond tidiness: if the two diverge,
the fixtures keep passing while production reports something else, and the tests stop being
evidence about the system.

## Revised remaining work

1. Extract the evidence derivation into a shared module, unchanged, with the fixtures module as
   its first caller so the existing tests keep proving it.
2. Build the reader that produces the five facts per census row from real paths.
3. Feed reader → derivation → `createClassificationManifest` → adapter → drill.

That is one subsystem, not four. The earlier estimate counted the attestations as separate
producers because each has its own type; they share a single source.
