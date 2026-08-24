# The effect producer is not a wrapper around the append CLI

## The plan that was about to be built

The stated next step was to "wire AuthorizedEvidenceWriter into the append path"
so that effects and receipts stop being unobservable. That would have been the
wrong thing, and wrong in the specific direction this work exists to prevent.

## What an effect actually models

The intent event's own field list settles it:

    effect_id, run_id, logical_effect_id, effect_type, operation,
    target_identity, input_digest, safe_metadata, secret_references,
    adapter, idempotency_key, recovery_policy

`operation`, `target_identity`, `adapter`, `recovery_policy` and
`secret_references` describe an action taken against something outside the
ledger. The module's own summary agrees: it owns "the durable boundary between
an effect intent and its verified outcome" and ships "replay-safe atomic
filesystem effect adapters."

An effect is an external side effect — a file written, an API called, a leaf
dispatched — that must survive a crash without being performed twice.

A ledger append is not that. It is the record, not the acted-upon world.

## Why wrapping the append CLI would have been worse than doing nothing

`append-mode-event.cjs` writes mode events. Wrapping each append in an effect
intent and confirmation would emit effect records whose `operation` and
`target_identity` describe a ledger write that the effect machinery was never
meant to govern.

The consequence is the failure mode this phase keeps running into. Today
`pendingEffects` is empty, which the derivation reads as a vacuous pass — bad,
and now refused by the reader. Wrapping appends would instead populate
`pendingEffects` and `receipts` with entries that correspond to no real external
action, and every one of them would be promptly confirmed, because the "effect"
is the append that just succeeded.

That produces `receiptCoverage: true` from records that attest to nothing. The
first case is an absence that can be detected and refused. The second is a
fabrication that looks exactly like evidence and cannot be told apart from it
downstream. Replacing the first with the second would have retired the refusal
and closed the gap with a lie.

## Where the producer actually belongs

Whatever executes a deep-research run — dispatching leaves, writing artifacts,
saving memory — is what performs external effects, and is therefore what must
record them through the effect gateway.

That is a change to the execution loop, not to a CLI that appends events, and
not to this phase's surface. It is the honest scope of the remaining work, and
it is larger than "wire a writer into the append path" implied.

## What stands unchanged

The reader's refusal is correct and stays. Until a real producer exists, the
truthful report for deep-research is that effects are unobservable, and a
certificate must not be issued on that basis.
