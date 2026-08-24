# Two of the five facts have no production producer, and their absence reads as green

## What was being built

The reader that turns real on-disk state into the five restart facts
(`stopSequence`, `pendingEffects`, `receipts`, `leases`, `continuityId`), so a
classification manifest can be built from observation rather than from fixtures.

Three of the five have a production source that was confirmed earlier:
`getVerifiedHead` and `readVerifiedEvents` on the mode ledger, and
`peekCurrentLease` on the fenced lease coordinator.

## What stops it

`pendingEffects` and `receipts` come from a separate effect ledger. Nothing in
production constructs one.

    grep -rln "AppendOnlyLedger" scripts/          -> scripts/append-mode-event.cjs   (only)
    grep -rln "AuthorizedEvidenceWriter|effectLedger|EvidenceControl" scripts/  -> none

`append-mode-event.cjs` builds exactly two ledgers, `{mode}-ledger` and
`{mode}-audit-ledger`. There is no effect ledger and no evidence writer on any
runnable path. Every construction of one lives in a test harness, which invents
its own ids (`effects-${label}`).

The machinery is not missing — `receipts-and-effect-recovery` and
`createEvidenceControlEventRegistry` are shipped library code. It is unwired. No
production run has ever written an effect or a receipt.

## Why that is worse than a gap

A reader built today would faithfully report `pendingEffects: []` and
`receipts: []`, because that is what is on disk. The derivation then turns that
into a clean bill of health:

    const receiptCoverage = restart.pendingEffects.every(
      (effectId) => restart.receipts.some((r) => r.effectId === effectId));

`[].every(...)` is `true`. Executed against a restart with no effects and no
receipts, the derivation returns:

    receiptCoverage         = true
    idempotencyCoverage     = true
    verifier.verified       = true
    boundedCompletion       = true
    pendingEffectsState     = none
    terminalReceiptRequired = false

Every field that is supposed to answer "were the in-flight effects accounted
for?" answers yes. Not because they were accounted for, but because there were
none to account for, and there were none because nothing has ever recorded one.

"No effects occurred" and "effects were never recorded" produce identical
evidence. The first is a fact about the run. The second is a fact about the
instrumentation. Only one of them should support a cutover certificate.

## Why this is a halt and not a workaround

The standing rule for this phase is that a green which a perturbation cannot
turn red is not evidence. This is that failure one level below where it has been
looked for so far. The parity oracle can be perturbed and does go red; that was
proven. But the *inputs* to this evidence are structurally empty, so no
perturbation of the run can change them. The green is not measuring the system.

Wiring the reader now would produce a cutover certificate whose verifier block
says `verified: true` on the strength of an unwired subsystem. That certificate
would then satisfy the flip gate, and the flip is irreversible by decision.

## The shape of the fix

The derivation is not the right place to fix it. It receives five facts and has
no way to know whether an empty list means "nothing happened" or "nothing was
watching"; asking it to guess would make it wrong in the other direction for
runs that legitimately have no effects.

The reader is the right place, because the reader is the only component that can
see the difference: it either finds an effect ledger or it does not. An absent
producer should be reported as unobservable, not as empty. In the derivation's
existing vocabulary that is `pendingEffectsState: 'uncertain'`, which already
propagates to `verified: false` — the fail-closed path exists and is reachable
without inventing a new state.

That is a decision about what the phase now includes, so it is recorded here
rather than taken unilaterally.
