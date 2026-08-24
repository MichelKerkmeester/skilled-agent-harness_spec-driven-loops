# The reader's five fact sources are all non-mutating

## Why this was checked

The classification evidence every attestation derives from reduces to five facts:
`stopSequence`, `pendingEffects`, `receipts`, `leases`, `continuityId`.

An observer that had to mutate state in order to observe it would report a system it
had itself changed. Lease state is the sharp case: acquiring a lease to find out
whether a lease is held converts `quiescent` into `active` and reports the latter.
So before specifying the reader, each fact's source was checked for a read-only path.

## Confirmed (by reading the shipped interfaces)

| Fact | Production source | Read-only accessor |
|------|-------------------|--------------------|
| `stopSequence` | `AppendOnlyLedger` | `getVerifiedHead()` |
| `receipts` | `AppendOnlyLedger` | `readVerifiedEvents()` |
| `pendingEffects` | effect ledger | `readVerifiedEvents()`, minus receipted effect ids |
| `leases` | `FencedLeaseCoordinator` | `peekCurrentLease()`, `inspect()` |
| `continuityId` | lineage id carried on the head / persisted lease | via the above |

`peekCurrentLease` additionally returns `null` for an expired lease, so expiry is
handled by the shipped accessor rather than re-derived by the caller.

## Confirmed: the reader does not already exist

A resume request carries these facts, and `parseDeepResearchResumeRequest` ingests
one from `unknown`. That looked like an existing production ingestion point. It is
not one. Every caller outside the module itself is either the parity harness
(`deep-research-shadow-parity/harness-adapter.ts`) or a test:

    lib/deep-research-shadow-parity/harness-adapter.ts:820, 1273
    tests/unit/deep-research-resume-adapter.vitest.ts
    tests/unit/deep-research-shadow-parity.vitest.ts

Nothing observes real on-disk state to build one. The adapter consumes a request;
it never produces one. That is the gap, and it is a single gap rather than one per
attestation.

## What this changes about the plan

The reader is a new module, but it composes existing read-only accessors rather
than reaching into storage itself. It therefore cannot perturb the state it
measures, and that is a property to keep rather than an accident to rely on: a
later change that swaps `peekCurrentLease` for an acquire would silently convert
this observer into a participant.
