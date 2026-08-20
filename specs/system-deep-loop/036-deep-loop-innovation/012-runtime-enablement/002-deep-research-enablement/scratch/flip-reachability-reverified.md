# The forward flip, re-verified

## Why this was checked again

This claim gates every remaining open item in the packet, and it was first established before a
context compaction. A gating claim carried across a context boundary is worth re-deriving rather
than quoting. This is an independent re-derivation from the source.

## The requirement

The coordinator exposes exactly one mutator for moving authority forward, `requestCutover`. Inside
the transaction lock it reads the durable record and denies unless the record is already in
`cutover_ready`:

    if (current.state !== 'cutover_ready' || current.epoch !== expectedEpoch)

and the compare-and-swap it then issues pins the same expectation:

    expectedState: 'cutover_ready' as const

## The gap

`cutover_ready` is a member of the state union in the types module. Outside that declaration it
appears only in the two consumer checks above. No production path writes it as a record state.

The registry's public mutators are `compareAndSwap`, `compareAndSwapRollback`,
`preparePendingTransition` and `clearPendingTransition`. The states they persist as a record are
`legacy_authoritative` when seeding or restoring, `new_authoritative_reversible` as the result of
a successful flip, and `rollback_pending`. None writes `cutover_ready`.

`preparePendingTransition` does persist an input carrying `cutover_ready`, but to a separate
pending-transition sidecar, not to the authority record, and the reconciliation path only completes
a transition whose event the ledger already holds. It cannot originate one.

A registry constructed against a fresh root writes no record at all; each mode reads
`legacy_authoritative` as a read-time default.

## Consequence

The forward transition requires a state that nothing produces. It is not blocked by a failing
check that could pass with better inputs; the precondition is unreachable by construction.

Every remaining open item that waits on an enabled mode therefore waits on a promotion path that
does not exist in the code and is not described by any frozen document in this packet. Building one
is new design touching the irreversible edge, so it is escalated rather than invented.

## Why the gates stayed green regardless

The drills seed the required state directly in a sandbox registry rather than reaching it through
a transition, so they exercise the flip's mechanics without exercising its reachability. The parity
harnesses never read the registry at all; their authority snapshot is a constant. Neither surface
was positioned to notice that the precondition has no producer.
