---
title: "The drill and the classifier do not share a contract"
trigger_phrases: []
---
# The drill and the classifier do not share a contract

## Two corrections to earlier notes

Earlier notes here claimed the drill's block was caused by asserting policy where an
observation belongs, and that a real observation over a quiescent system would clear it. Both
claims were wrong, in different ways, and the record is corrected below.

**First correction.** `decideRow` does return `BLOCK` from policy alone:

    if (policy.disposition === InflightDisposition.BLOCK) {
      return block(ClassificationReasonCodes.POLICY_BLOCK, policy.rationale);
    }

That branch runs after every evidence gate and ignores what the evidence says. The seven
control rows therefore classify as `BLOCK` no matter how quiescent the system is. Observation
quality cannot change it.

**Second correction, and the real finding.** It does not matter, because the drill never
consumes the classifier's output at all.

## The shapes are incompatible

`RollbackDrillManifest.classification` is typed `InflightClassificationManifest` — the
classifier's output. The drill then validates it with `assertExactKeys` against a sixteen-key
row shape:

    activeLeaseIds, authorityEpoch, disposition, identityCoverageComplete, isQuiescent,
    lifecyclePoint, mutability, orderCoverageComplete, pendingEffectIds, reasonCode,
    rollbackAnchorDigest, rowId, shapeVersion, stateDigest, terminalReceiptId, verifier

The classifier actually emits `ClassifiedInflightStateRow`:

    rowId, censusRowDigest, modes, disposition, reasonCode, rationale, evidence

Three keys in common. The classifier's row carries four keys the drill forbids and is missing
ten the drill requires. The drill additionally requires a top-level `expectedRowIds`, which
`InflightClassificationManifest` does not have at all.

So a manifest produced by `createClassificationManifest` fails the drill's validation on its
first row, on key-set grounds, before any disposition is examined.

## What this means

The declared type and the enforced contract disagree. The annotation says these two subsystems
compose; the validator says they never could. Nothing caught it because nothing has ever passed
a real classifier manifest to the drill — the drill's tests build their own sixteen-key rows by
hand, and the classifier's tests never touch the drill.

The practical consequence is that "wire the classifier into the drill" is not a wiring task. One
of two contracts has to change, or an adapter has to be written that translates a classified row
into a drill row — and that adapter would have to source `rollbackAnchorDigest`, `verifier`,
`terminalReceiptId`, `activeLeaseIds`, and `pendingEffectIds`, none of which survive into the
classifier's output. It keeps only a sanitized `ClassifiedEvidenceSnapshot`.

That is a design decision about which contract is authoritative, not something to settle by
picking whichever makes the build proceed.

## Revised scope for the attestation layer

The approved plan was: build producers for rollback anchors, verifier receipts, replay
fingerprints, and parity digests; then an observer; then the flip. That work is still required,
but it is not sufficient, and it is not first. Before any of it pays off, the drill and the
classifier need one agreed contract — otherwise the evidence gets built to a shape the consumer
rejects.
