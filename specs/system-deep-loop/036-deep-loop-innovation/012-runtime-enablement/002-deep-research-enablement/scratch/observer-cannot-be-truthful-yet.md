---
title: "Why the classification observer cannot be written truthfully today"
trigger_phrases: []
---
# Why the classification observer cannot be written truthfully today

The previous note called the observer "the only thing genuinely missing" and described it as
resolving each census row's path and reporting what is there. That description was too small,
and the difference decides whether the flip can proceed on real evidence.

## What an evidence record must actually assert

`decideRow` gates each row on twenty-five fields. Most are filesystem-observable — is the file
present, what is its digest, is its shape registered. Three are not:

    rollbackAnchor: { anchorId, digest, retained, restorable,
                      minimumRetentionDays, minimumSuccessfulRuns }
    verifier:       { verified, receiptDigest, replayFingerprintDigest,
                      rollbackScenarioDigest, parityCaseDigest }
    proof:          DispositionProof

These are not observations of a file. They are attestations produced by other subsystems: that a
rollback anchor is retained and restorable under a stated retention policy, that a verifier ran
and produced a receipt, that a replay fingerprint and a parity case exist and match.

`hasSafeRollbackAnchor` then requires all of `retained`, `restorable`,
`minimumRetentionDays >= 14`, and `minimumSuccessfulRuns >= 5` before a row may avoid a veto.

## Nothing produces any of them

Searching the runtime for modules outside the classifier that reference these types:

| Type | Non-classifier producers |
|---|---|
| `RollbackAnchorEvidence` | 0 |
| `VerifierEvidence` | 0 |
| `DispositionProof` | 0 |
| `ClassificationEvidence` | 1 — `mixed-version-fixtures/reducer-resume-oracle.ts` |

The single module that has ever constructed a classification evidence record is the fixtures
generator. No production code has ever produced one, and no production code produces any of the
three attestations a record must carry.

## The consequence, stated plainly

An observer written today has exactly two options for those three fields:

1. Source them from the subsystems that should attest them — which means building production
   paths for rollback anchors, verifier receipts, replay fingerprints, and parity case digests
   first. Each has the same shape as everything else in this bundle: the checking machinery is
   built, the attesting machinery is not.
2. Fill them with plausible constants — `retained: true`, `restorable: true`,
   `minimumRetentionDays: 14`, `minimumSuccessfulRuns: 5`, `verified: true`.

Option 2 produces a classification manifest that verifies, a drill that passes, a certificate
that assembles, a preflight that returns ready, and an authority flip that succeeds. Every gate
would be green and every green would be manufactured. The resulting certificate would be
indistinguishable, afterwards, from one earned by a system that actually held those properties.

That is the precise failure this phase's own plan warns about: the parity gate and the fan-out
proof are the entire safety margin, and a green that a perturbed run cannot turn red is not
evidence. Option 2 is worse than an oracle that cannot fail — it is an oracle whose output is
chosen by the person writing it.

## Assessment

This is not a blocker that another dispatch clears. Completing the pilot flip on real evidence
requires an attestation layer spanning at least four subsystems, for all forty-six census rows,
none of which currently emits anything in production.

What has been established is worth keeping: the authority edge exists and is green, the census
document is located and hash-verified, the drill runs for real against the live tree without
touching it, and the exact set of missing producers is now enumerated rather than guessed. The
flip is blocked on the construction of an evidence layer, not on a missing state or an unknown.
