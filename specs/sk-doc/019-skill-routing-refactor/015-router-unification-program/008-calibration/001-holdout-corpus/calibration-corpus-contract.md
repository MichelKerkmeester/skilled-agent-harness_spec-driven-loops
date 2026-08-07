---
title: "CalibrationCorpusV1 Contract"
description: "Normative identity, immutability, evidence, and downstream binding contract for held-out routing calibration corpora."
importance_tier: "critical"
contextType: "implementation"
---
# CalibrationCorpusV1 Contract

## 1. Contract boundary

`CalibrationCorpusV1` is an immutable evidence artifact. It is not a routing
capability, a policy overlay, a destination proof, or a source of COMMIT
authority. A corpus or certificate may raise the evidential `basis` of a route
only after its offline and live gates pass; destination-local VERIFY remains the
only path to destination-local COMMIT (synthesis §2.3, §8.1, §10).

The machine-readable shape is
`schemas/calibration-corpus.v1.schema.json`. The record binds:

- immutable request facts after PII scrubbing;
- intent-derived gold in the closed algebra `{route, clarify, defer, reject}`;
- a full destination identity tuple for the risk context;
- exactly one risk-slice cell;
- independent-author provenance and blindness attestation;
- an integer-basis-point calibration prediction;
- a replay lane and deletion key.

Only `route` may carry `selectionKind` and non-empty targets. Negative branches
are target-free and authority-free. `single`, `orderedBundle`, and
`surfaceBundle` remain fields inside `route`, matching the closed decision
algebra (synthesis §2.2, §2.3).

## 2. Content identity

`corpusHash` is lowercase hexadecimal SHA-256 over the frozen canonical UTF-8
bytes of the complete corpus body, excluding only the two self-referential
identity fields `corpusHash` and `corpusId`. The preimage therefore binds the
records, hub, EffectivePolicy identity, schema, generation, frozen coverage
declarations, policy binding class, privacy sign-off, retention policy, and
seal. Relabeling any admission-critical trust metadata mints a new identity;
presenting the relabeled body or a claim under the old id fails closed.

The implementation imports the frozen `canonicalBytes`; it does not use a local
serializer or self-oracle. `corpusId` equals `corpusHash`. This extends the
EffectivePolicy content-addressing discipline to the full immutable evidence
artifact while leaving the frozen domain-tag registry unchanged (synthesis
§2.1, §9).

Each corpus also carries the four-field EffectivePolicy identity body. The
validator imports `computeEffectivePolicyHash` and rejects a corpus whose
`effectivePolicyHash` is not the canonical digest of its base hash, optional
overlay hash, schema, and activation generation. Representative corpora use
`policyBindingClass: shadow-fixture`; an operational certificate remains
inadmissible until a compiler-produced multi-hub identity replaces that shadow
binding.

## 3. Seal and generation rules

A seal is valid only when all records pass leakage, risk-slice, privacy,
coverage, and identity checks. The seal asserts:

- `immutable = true`;
- independent privacy approval predates sealing;
- the prior generation remains available byte-for-byte;
- activation requires a token-locked, preimage-checked fenced CAS.

Records never change in place. Adding, deleting, relabeling, re-scrubbing, or
changing any record mints a new corpus generation and therefore a new
`corpusHash`. A deletion request can retract a generation and require a new one;
it cannot silently rewrite sealed bytes. Pointer rollback returns to the retained
prior generation, while post-COMMIT effect recovery stays destination-owned
(synthesis §9, §10).

Validation may receive a sealed prior corpus as a lineage marker. When canonical
record bytes differ, the new corpus generation must be strictly greater than the
prior generation; a same-generation new sample is rejected. Metadata-only trust
changes still mint a new content id because those bytes are in the preimage.

## 4. Binding contract

`CalibrationClaimV1` covers both calibration certificates and per-hub canary
claims. Admission fails closed when any of these are missing or mismatched:

- sealed `corpusId`;
- corpus generation;
- `effectivePolicyHash`;
- hub and risk-slice cell.

A stale generation, policy mismatch, missing id, or different id is
inadmissible. `grantsCommitAuthority` is always `false`. This makes the corpus a
Stage-4 precondition without allowing evidence to become capability (synthesis
§9, §11 open-q 2).

## 5. Hard-block invariants

The validator hard-blocks label leakage, target-bearing negative decisions,
evidence destinations that mutate, zero-signal default unions, unreviewed PII,
coverage gaps, mutable seals, non-fenced promotion, policy/hash drift, and
authority escalation. The protected benchmark scorer and router replay remain
read-only; a scorer change needed for a green result is migration failure
(synthesis §8.2, §10).
