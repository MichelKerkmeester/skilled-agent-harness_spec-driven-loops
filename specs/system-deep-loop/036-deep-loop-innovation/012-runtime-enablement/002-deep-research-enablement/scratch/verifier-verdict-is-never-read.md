# The classification manifest is the one evidence input whose verdict is never read

## What was checked, and why

Before building an effect producer to unblock the flip, the question was whether
the flip gate would have caught vacuous evidence on its own. It would not, and
the reason turns out to be more general than the effect gap.

## The asymmetry

`buildCutoverCertificate` takes seven evidence inputs. Six are checked for a
verdict:

    modeGateCertificate.readiness !== 'ready-for-phase-014-consideration'  -> REJECT
    shadowParity.exitStatus       !== 'green'                             -> REJECT
    drillFacts.passed             !== true                                -> REJECT
    mixedVersionReplay.ok         !== true                                -> REJECT
    mixedVersionReplay.certificateEligible !== true                       -> REJECT
    receipt.result_code           !== 'ok'                                -> REJECT

The seventh, the classification manifest, is checked only for structural
validity:

    if (!verifyClassificationManifest(classificationManifest)) -> REJECT

`verifyClassificationManifest` validates shape, key sets and the manifest's own
self-hash. It confirms the manifest is internally consistent with whatever it was
given. It does not read a single verdict out of the evidence rows.

Six inputs are asked "did you pass?". The seventh is asked "are you well-formed?".

## The field that is written and never read

`ClassificationEvidence` carries a `verifier` block whose `verified` boolean is
computed at

    lib/inflight-state-classification/restart-classification-evidence.ts:127
    verified: rollbackReady && receiptCoverage && leaseState !== 'uncertain'

Searching the runtime for any consumer of that value returns nothing. Not the
certificate builder, not the authority flip, not the rollback drill. The only
other matches for `verified` in the tree are unrelated fields in different
modules: shadow-parity's `VerifiedPathOutput` and the benchmark certificates'
sealed-artifact types.

A manifest whose every row reports `verified: false` binds and passes exactly
like one whose rows all report `verified: true`.

## What does protect the gate

This is not an open door, and the distinction matters. The drill does veto rows,
but on their **disposition**, not their verifier verdict:

    disposition === BLOCK                                  -> veto
    disposition === PIN   && terminalReceiptId === null    -> veto
    disposition === MIGRATE && !isQuiescent                -> veto

So dispositions are load-bearing and verdicts are not. Note also that the drill's
`row.verifier` is a string identity naming who ran the drill. It is a different
field that happens to share a name with the evidence's `verifier` block, which is
an easy thing to mistake for coverage when reading quickly.

## Why it matters here

The manifest is treated as a digest to bind rather than as evidence to read. The
drill records `classificationDigest` and the certificate confirms the two match,
which proves the drill and the certificate are talking about the same manifest.
It proves nothing about what that manifest says.

That is why the vacuous-evidence problem was not caught upstream, and it would
remain after an effect producer is wired: evidence full of `verified: false` rows
would still pass. Wiring effects fixes what the evidence says. It does not make
anything read it.

## Recorded, not fixed

Adding a verdict check to the certificate builder changes what the irreversible
flip accepts. That is the single most consequential gate in the packet, and the
change belongs in a reviewed step rather than as a side effect of unblocking a
different problem.
