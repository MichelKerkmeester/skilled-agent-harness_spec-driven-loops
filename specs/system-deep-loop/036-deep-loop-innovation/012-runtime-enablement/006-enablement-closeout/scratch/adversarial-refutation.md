---
title: "Adversarial Pass on the Closeout's Central Claim"
trigger_phrases: []
---
# Adversarial Pass on the Closeout's Central Claim

The claim that the forward flip is unreachable is load-bearing for this whole
epic, and I derived it myself. It was therefore submitted for refutation rather
than accepted. DeepSeek V4 Flash (xhigh) was dispatched read-free, with all ten
pieces of evidence inline, and instructed to refute rather than confirm.

## It returned VERDICT: REFUTED

Its central objection, quoted:

> The four-literal audit (evidence 2) only counts literal `state: '…'`
> assignments inside authority-registry.ts. It says nothing about whether a
> prepared transition persists the target state through a non-literal channel:
> a constructed object spread into the record, a JSON round-trip, a computed
> field, or a staged transition sidecar.

It also objected that "sole writer" rested on grep correlation rather than
causality.

## Both objections were tested, not argued

**The spread objection is factually right.** `preparePendingTransition` is
`Object.freeze({ ...input, preparedAt })`, and `input` carries
`expectedState: 'cutover_ready'`. So `cutover_ready` *is* persisted to disk
through a non-literal channel, exactly as predicted — my "exactly four writes"
phrasing was too strong.

**Its conclusion does not follow.** `scratch/probe-pending-transition.mjs`
drove the sequence:

```
files after prepare: [ 'authority-flip-prepare-deep-research.json' ]
  authority-flip-prepare-deep-research.json: contains cutover_ready = true
record state after prepare: legacy_authoritative
compareAndSwap AFTER PREPARE: REFUSED: Authority record no longer matches the expected state/epoch
final record state: legacy_authoritative
```

The string lands in a sidecar at `authority-flip-prepare-<mode>.json`, not in
the authority record. The record stays `legacy_authoritative`, and the flip is
still refused after a pending transition is prepared. The precondition
`compareAndSwap` reads is the record's state, which nothing writes as
`cutover_ready`.

**The sole-writer objection is answered structurally.** The record path is
constructed in exactly one place in the codebase, `authority-registry.ts:140`
(`join(this.#root, ` + "`authority-${mode}.json`" + `)`). Every other
`authority-*` match is an event stream id or idempotency key, not a file path.
That is a single construction site, not a grep correlation.

## Outcome

The claim survives, with its wording corrected. The precise form is: **no
production writer ever persists `cutover_ready` as an authority record's
state** — which is the precondition the flip reads. The loose form ("never
persists `cutover_ready`") was wrong, because the pending sidecar does.

The refutation improved the claim. It did not overturn it.
