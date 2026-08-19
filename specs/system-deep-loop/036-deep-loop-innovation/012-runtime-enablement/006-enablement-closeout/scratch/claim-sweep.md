# Claim Sweep: 036 Against The Built System

Method: every claim below was tested against code, not against a plan. The
decisive test is a **reachability census** of the authority state machine —
which states any production writer can actually persist.

## 1. The reachability census

`AuthorityRegistry` is the sole production writer of authority records. The
other file-writers that mention authority write leases, artifacts, or run
state, not authority records:

| File | Authority-record state writes |
|------|-------------------------------|
| `lib/per-mode-authority-flip/authority-registry.ts` | 4 |
| `lib/locks-and-fencing/fenced-lease-coordinator.ts` | 0 |
| `lib/deep-loop/leaf-artifact-writer.ts` | 0 |
| `lib/fleet-enablement/enablement-driver.ts` | 0 |

The registry's four writes, by line:

| Line | State written | Edge |
|------|---------------|------|
| `authority-registry.ts:66` | `legacy_authoritative` | seed |
| `authority-registry.ts:308` | `new_authoritative_reversible` | forward flip |
| `authority-registry.ts:386` | `rollback_pending` | rollback begin |
| `authority-registry.ts:414` | `legacy_authoritative` | rollback restore |

**No production writer ever persists `shadowing` or `cutover_ready`.**

The forward flip requires the record to already be in `cutover_ready` —
`authority-registry.ts:80` types its input as `readonly expectedState: 'cutover_ready'`.

Therefore the forward flip is **structurally unreachable in production**: its
one precondition is a state nothing can write.

### The two apparent counter-examples

Both are scaffolding, and neither reaches production:

- `lib/rollback-drills/sandbox-authority-store.ts:398` seeds `cutover_ready`
  directly, but only inside a drill-owned root (`isContained` guard at
  `sandbox-authority-store.ts:380`), refuses to overwrite an existing record,
  and is referenced nowhere outside `lib/rollback-drills/`. The drills pass
  because they *start* where production cannot arrive.
- The eight `*-shadow-parity/harness-adapter.ts` files each define
  `createAuthority()` returning a frozen literal `{ state: 'shadowing', epoch: 1 }`
  (e.g. `deep-research-shadow-parity/harness-adapter.ts:1976`), consumed by
  `createLedgerBoundary`. The harness supplies its own snapshot and never reads
  the registry.

The parity harness's self-supplied snapshot is reasonable test scaffolding. The
consequence still matters: **a green parity run carries no information about
real authority state.** It cannot detect that the fleet never entered shadowing.

Measured live state, independently, at `005-whole-system-gate/scratch/receipt.json`:
`read 8 modes; 8 on legacy_authoritative`.

## 2. Invalidated claims, packet by packet

### One invalidated claim (the packet is otherwise honest)

`003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip`
— status `Completed | 2026-08-09`.

**What is invalidated** is a single grading claim at its
`implementation-summary.md:139`: "Only the forward
`cutover_ready -> new_authoritative_reversible` edge is built here | Confirm-first
grading found every other authority edge already implemented per mode".

That grading conflated two different things. The `rollback_pending -> legacy_authoritative`
restoration **does** exist (`authority-registry.ts:386` and `authority-registry.ts:414`,
confirmed). But "the readiness gate exists" is not the same claim as "a transition
writes `cutover_ready`". A gate that *evaluates* readiness was read as an edge that
*produces* it. No such edge was ever built, so the set of remaining edges was
graded as empty when it was not.

**What is not invalidated** is the packet's own account of its boundary. Its
Known Limitations item 3 states plainly that no mode adapter consults the
selector, that no mode's real authority record was ever created, and that
wiring those is a separate operator-gated step the packet does not perform.
That is accurate and was accurate when written. The delivered flip mechanism
itself is real and unit-verified.

So this is a correction to one claim, not a supersession of the packet. Its
status stays `Completed`, because what it set out to build, it built.

### Merely out of date

The `012-runtime-enablement` children each carry a status that already matches
their own evidence, reconciled individually rather than by sweep:

| Phase | Status | Basis |
|-------|--------|-------|
| `001-append-gateway-and-projection` | Complete | checklist 32/32 |
| `002-deep-research-enablement` | Blocked | checklist 18/26; blocked on the unreachable flip |
| `003-fleet-enablement` | Blocked | checklist 19/27; same root cause |
| `004-legacy-writer-retirement` | Blocked | checklist 15/23; guard inert until a mode flips |
| `005-whole-system-gate` | Blocked | checklist 19/23; gate verdict FAIL, correctly recorded |

These are not invalidated claims. Each already says it is blocked and says why.

## 3. What this does not claim

The runtime is **not** enabled. No document in this closeout asserts otherwise.
Tasks that require describing an enabled runtime (T-006, T-007, T-008) are not
performed, because performing them would mean writing something the measurement
contradicts.

## 4. Machine confirmation (not inference)

`scratch/probe-reachability.mjs` drives a real `AuthorityRegistry` in a temp
root and reports what it will actually persist. Output:

```
PUBLIC SURFACE: ["read","withTransactionLock","compareAndSwap","compareAndSwapRollback","preparePendingTransition","readPendingTransition","clearPendingTransition"]
mode under test: deep-research
after construction: (no record)
read() -> legacy_authoritative
compareAndSwap REFUSED: Authority record no longer matches the expected state/epoch
final on-disk state: (no record)
```

The public surface is exactly seven methods. Only two mutate record state:
`compareAndSwap` (forward, demands `cutover_ready`) and `compareAndSwapRollback`
(reverse). `preparePendingTransition` and `clearPendingTransition` handle
pending-transition bookkeeping, not the record's state field.

Driving the forward flip with its required `expectedState: 'cutover_ready'` is
refused and writes nothing, because no reachable predecessor state exists to
satisfy it. This closes the loop by measurement rather than by reading: the flip
needs `cutover_ready`; nothing writes `cutover_ready`; the flip can never fire.
