---
title: "A deferral that was wrong about testability, not about the flip"
trigger_phrases: []
---
# A deferral that was wrong about testability, not about the flip

## What the record said

The item asking that a divergent or stale parity result block the flip rather than warn was deferred
on the grounds that the flip cannot be requested, so the property is untestable, and that the
preflight is never reached from legacy authority.

The second clause is true. The first does not follow from it, and it is what made the item look
closed.

## Where the blocking actually happens

Parity does not reach the flip through the preflight's own inputs. It reaches it through the cutover
certificate, which the preflight consumes as evidence. The certificate builder refuses outright:

    if (
      shadowParity.mode !== mode
      || shadowParity.candidateSha !== candidateSha
      || shadowParity.exitStatus !== 'green'
      || typeof shadowParity.evidenceDigest !== 'string'
      || shadowParity.evidenceDigest.length === 0
    ) return rejected('PARITY_NOT_GREEN');

So a non-green parity result blocks *upstream* of the preflight, at certificate issuance. No
authority record and no flip request is needed to observe it. The property was reachable all along.

## What is now asserted

One test, composed rather than isolated. It builds the certificate twice from one fixture, changing
only the parity status.

| parity `exitStatus` | certificate verdict |
| ------------------- | ------------------- |
| `green` | issued |
| `blocked` | refused, `PARITY_NOT_GREEN`, no certificate present |

The green control runs first and is the point of the test. Without it, a fixture broken for some
unrelated reason would also produce a refusal, and the test would pass while proving nothing about
parity. Because the two runs differ in exactly one field, the refusal is attributable to that field.

It also asserts the refusal carries a non-empty reason code, so an undefined verdict cannot satisfy
the "not issued" check by being absent, and asserts explicitly that no certificate is present —
a warning-shaped success is the failure mode this item names, so it is named in the assertion.

## Negative control, and what it revealed

The parity condition was removed from the certificate builder and the suite re-run.

    baseline                     130 passed (with the certificate suite)
    with the new test            131 passed
    parity condition removed       1 failed, 68 passed
    restored, hash-identical      69 passed

The perturbation made exactly one test fail: the new one. Sixty-eight other tests in that file stayed
green with the parity guard deleted from the shipped certificate builder. That is the measurement of
the gap this item was recording — the guard was real, and nothing was watching it.

## What this does not close

Only the certificate-layer refusal is proven. The preflight and coordinator legs remain covered by
their own isolated tests, and the end-to-end path from a real mode's authority record is still
unreachable because nothing produces the cutover-ready state. This item's property is satisfied; the
phase's enablement claims are not, and are not affected by this.
