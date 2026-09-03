---
title: "The behaviour-preserving move had nothing to preserve it against"
trigger_phrases: []
---
# The behaviour-preserving move had nothing to preserve it against

## What was nearly shipped

The plan was to move `restartClassificationEvidence` out of the fixtures module
into a shared one, unchanged, and to rely on the existing tests to prove the move
changed nothing. The dispatch prompt said, in capitals, that digest stability was
the point of the task.

Digest stability is not currently checked anywhere.

## What was actually checked

The derivation emits seven content hashes: `stateDigest`, `schemaDigest`,
`leaseSetDigest`, `pendingEffectSetDigest`, `rollbackAnchor.digest`,
`verifier.receiptDigest`, `verifier.rollbackScenarioDigest`.

Searching the suite for assertions on any of them returns nothing.

- `assertResumeClassification` compares a disposition string (`'pin-legacy'`
  against `'block'`). It never looks at a digest.
- `verifyClassificationManifest` checks the manifest's own self-hash. That
  confirms the manifest is internally consistent with whatever it was given; it
  cannot notice that the input changed.

So the failure mode was concrete, not theoretical. `digest(Object.keys(restart).sort())`
hashes the key set of the object it is handed. An extraction that rebuilt or
spread that object — the obvious thing to write when moving a function across a
module boundary — would change `schemaDigest` and `stateDigest` for every record,
and the entire suite would stay green.

The claim "zero behaviour change, proven by tests" would have been false, and
nothing in the run would have said so.

## What was done instead

The guard is being added first, as its own change, before the move:
a characterization test that pins the full evidence record — every digest as a
literal — for one fixed restart input.

Two properties make it a guard rather than decoration:

- The expected values are pasted from an observed run, not recomputed by calling
  the function under test. A test that recomputes its own expectation agrees with
  any behaviour, including the changed one.
- It is committed and seen green BEFORE the move, then seen red under a
  deliberate perturbation of the hashed input, then green again. A guard that has
  only ever been green is not known to be a guard.

## The general shape

This is the same error as the seeded `cutover_ready` in the rollback drills and
the disposition filled from policy rather than the classifier: a check positioned
where it cannot observe the thing it is supposed to be checking. The tell is that
the check passes for a reason unrelated to the property. Here the suite passed
because it never read a digest, not because the digests were right.
