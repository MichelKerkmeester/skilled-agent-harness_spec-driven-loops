# Envelope refusal, and a deferral that was wrong

## What the record said

The envelope-refusal item was marked complete with a deferral: that the gateway does not validate
envelopes because callers prepare them, and that refusal is enforced only at the authorization
boundary. A completed item resting on a reason that is false is worse than an open one, so the
reason was tested.

## What was measured

Two malformed inputs through the shipped CLI, each into a fresh run directory:

| input | result | files written |
| ----- | ------ | ------------- |
| bare unprefixed stem `run_initialized` | `exit 1`, `Envelope field must be a bounded non-empty string` | 0 |
| record with neither stem nor event_type | `exit 1`, `Unrecognized event format` | 0 |

The gateway does validate envelopes, and refuses before anything is written. The deferral's premise
was false.

## Negative control

The bounded-string guard lives in `lib/event-envelope/event-envelope.ts`. Its condition was
replaced so the check could never fire, and the envelope suite was re-run.

    baseline            57 passed
    guard neutered       5 failed, 52 passed
    restored            57 passed

Working tree byte-identical afterwards.

One honest detail: with the guard neutered the CLI still exited 1 for the bare-stem input. That
input fails a separate stem-shape check as well, so it is not a clean probe of this guard alone.
The five failing tests are the evidence that the guard is load-bearing and falsifiable.

## Status of the item

The item as stated — the refusal test passes, and was observed red with its guard removed — is now
satisfied by measurement rather than by a deferral.

## A second item worth the operator's eye

The fan-out item in this phase is also marked complete with a deferral: that `fanout-run.cjs` is a
live dispatcher whose execution would spawn real model calls, with its state reads covered by unit
tests that pass in baseline. That reasoning is sound and transparently recorded, unlike the one
corrected above, so it was left as it stands rather than reversed unilaterally. It is flagged here
because a completed item that was not performed as written is a judgement the operator may want to
revisit, and it should not be discovered later by someone reading the checklist as literal.
