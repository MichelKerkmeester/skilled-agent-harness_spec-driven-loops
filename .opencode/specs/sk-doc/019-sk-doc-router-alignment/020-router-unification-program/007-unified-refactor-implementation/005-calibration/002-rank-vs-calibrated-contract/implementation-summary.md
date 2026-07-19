---
title: "Implementation Summary: Rank-vs-Calibrated Route Contract"
description: "Delivered externally licensed calibration attachment and projection, canonical corpus verification, closed negative branches, fenced retained-prior restore, and scorer-backed shadow verification."
importance_tier: "critical"
contextType: "implementation"
status: "shadow-partial"
---
# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Delivery status | Implemented; shadow contract checks pass, live activation deferred |
| Primary artifacts | `CalibrationCertificateV1`, `CalibrationEvidenceEnvelopeV1`, and frozen `RouteDecisionV1` |
| Runtime dependencies | Node built-ins, packet-local modules, frozen decision/canonical contracts, and corpus hash helper |
| Routing authority | Evidence only; `WithheldUntilVerify` remains mandatory |
| Migration gate | Stage 3 shadow evaluation; activated per-hub behavior remains downstream |
| Route-gold status | `shadow-partial`; real scorer pass over distinct intent-derived gold, no activated hub router |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Built

The phase now contains a separately hashed `CalibrationCertificateV1`, an
out-of-band `CalibrationEvidenceEnvelopeV1`, and the unchanged frozen
`RouteDecisionV1`. Public route evidence is the canonical array of exactly two
rank-evidence kinds, `rankScore` and `scoreMargin`, each carrying a decimal
string and `nonAuthority:true`. Calibration is never in the decision. Its
sibling envelope union has an unvalidated discriminant-only branch and a
validated branch requiring certificate, corpus, method, policy, risk slice,
evaluation window, and `estimatedError` in `[0,1]` (synthesis §2.3, §4 Seam C).

Certificate bodies bind one corpus generation, effective policy, risk slice,
method, method parameters, evaluation window, and held-out metrics. Candidate,
validated, expired, and revoked states are immutable successor artifacts.
Promotion and terminal transitions use a fenced, preimage-checked registry
pointer with the prior active certificate retained. A separate fenced restore
swaps the already validated retained certificate back into service without
re-running candidate promotion; stale expected-active ids reject. Revocation
still produces rank-only fallback, and the serving policy is never edited to
enable, restore, or revoke calibration (synthesis §2.1, §10).

Secondary export paths now share the external trust boundary. `attachCalibration()`
requires validated certificate status plus exact request policy, generation,
risk slice, candidate set, and canonical corpus resolution before it can return
the validated sibling envelope. `projectAll()` accepts the evaluator's legality
result rather than deriving permission from public decision fields.
Negative decisions are closed to their branch-specific fields and scanned for
probability language before any projection is emitted (synthesis §2.3, §8.2).

The method envelope is a strict JSON consumer contract for temperature scaling
with Expected Calibration Error and selective-classification thresholding with
selective risk at coverage. It fixes field names, numeric encodings, probability
vocabulary, lifecycle states, and authority boundaries without fitting live
values. This implements calibrated negotiation as recovery evidence rather than
a new authority surface (synthesis §3 Idea 5, §8.1).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How Delivered

`evaluateCalibratedRoute()` validates three distinct authorities. The request
pins the effective policy generation and risk slice; the external registry
resolves the active immutable certificate; the held-out corpus resolver confirms
the exact `corpusId`/`corpusHash`, policy generation, and slice still exist.
Resolution recomputes `computeCorpusHash()` over canonical whole-object bytes,
so retained declarations cannot bless altered records. A sibling calibration
claim cannot substitute for any external authority. If one check fails, the
result carries sibling calibration `{status:"unvalidated"}` and uses one-turn
`clarify` when the request says one
answer discriminates to a legal local route, otherwise typed `defer`. This is
the recovery ladder's certificate-gated rung falling through to clarification
and defer (synthesis §2.3, §3 Idea 5).

The compatibility projector unwraps only `decision`, never serializes sibling
calibration, and consumes only an externally established evaluator verdict. An evaluator-produced rank-only route
and a certified route produce identical `observedIntents`, `observedResources`,
Advisor projection, typed route-gold projection, and policy card content. Raw
decisions lacking that verdict reject instead of self-licensing. The harness
passes the projected observations to the exported real
`evaluateRouteGold` in a read-only subprocess. Expected intents/resources come
from a distinct, independently locked held-out corpus record, and a deliberately
corrupted observation must fail. The shared scorer and router replay remain
unchanged, as required by the compatibility adapter design (synthesis §8.2,
§10).

Singleton handling reads `candidateCount` and `noCalibrationSlice` data. With
one candidate, any certificate is a no-op, rank calls remain zero, and the route
keeps rank-only evidence. No skill name participates in control flow, preserving
the N=1 degeneracy as data rather than a special implementation (synthesis
§5.3).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Decisions

- The frozen domain-tag registry has no certificate entry and was not edited.
  Both certificate digests call its `hashArtifact` with an immutable
  `artifactType` plus distinct `hashPurpose` envelopes (`certificate-id` and
  `fenced-cas`). This keeps canonical serialization and hashing in the frozen
  authority while separating the two preimages (synthesis §2.1).
- Certificate numeric parameters and metrics use canonical decimal strings.
  `estimatedError` remains an out-of-band envelope number in `[0,1]`; this avoids
  placing non-integer JavaScript numbers in the frozen canonical certificate
  serializer.
- Candidate promotion never trusts caller thresholds. A registry-owned external
  attestation must bind corpus, policy, generation, risk slice, method, the
  fixed method-specific metric name, and its observed value. Real acceptance
  fitting stays downstream rather than being invented here (synthesis §3 Idea
  5, §8.1).
- The request's ranked target ids are the distinct candidate-set authority.
  Certificate evidence must reproduce that ordered set exactly; an added target
  rejects before legality evaluation. Authority remains
  `WithheldUntilVerify`, so evidence never becomes destination commit capability
  (synthesis §2.3, §10).
- Projection invisibility compares two evaluator verdicts: the data-driven
  singleton no-calibration route and the externally licensed calibrated route.
  Their compatibility and typed-gold bytes remain identical, while candidate,
  expired, and revoked verdicts project only `clarify`/`defer` (synthesis §8.2).
- Corpus identity is recomputed with the upstream whole-object hash rather than
  accepted from matching declarations. This preserves the frozen serializer
  and makes altered held-out records fail with a distinct hash-mismatch reason.
- Retained-prior rollback is a pointer restoration, not a second promotion. The
  registry returns the original validated artifact and swaps active/retained ids
  under the same fence and preimage discipline used by rotation.
- The phase imports `parseRouteDecisionShape()` from the frozen decision
  evaluator rather than maintaining a local public-route validator. The
  repurposed calibration schema references the frozen route schema and uses a
  distinct envelope version, so it cannot masquerade as another V1 decision.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

All four CommonJS files pass `node --check`; all six JSON files parse; the
source-discipline and comment-hygiene checks report zero violations. The
packet harness exits 0 with
these results:

- external oracle: both rank-only and licensed decisions pass the real frozen
  `parseRouteDecisionShape()` guard with evidence kinds
  `rankScore,scoreMargin`;

- SC-001: `PASS` — attachment and evaluation require validated external status,
  exact policy/generation/risk bindings, and recomputed canonical corpus identity.
- SC-002: `PASS` — negative branches have exact fields, probability-bearing
  decisions reject, and uncertified verdicts project only `clarify` or `defer`.
- SC-003: `shadow-partial` — compatibility SHA-256 is
  `0034e66902fdaafcf09cc3586f0e2e556e15f47d1c12f4a2f1fa14c8239973c1`;
  typed route-gold SHA-256 is
  `7150aa5515c0557403ca29f10ef3ca71dced5f5875592e4b71d4ba50d025c53f`;
  the real scorer passes and its corrupted-observation falsifier fails.
- SC-004: `PASS` — candidate cardinality and authority stay fixed; fenced CAS
  restores the retained validated temperature certificate, stale preimages
  reject, and later revocation returns rank-only evidence without changing
  serving-policy SHA-256
  `a4940ea2c83b0b6a15c6cfef3cae2d72db147e9230725566057e5d197e9e479f`.
- SC-005: `PASS` — both fixed method envelopes validate and promote through the
  same lifecycle contract.

Exact negative results include `CALIBRATION_UNVALIDATED_FIELDS`,
`CERTIFICATE_STATUS_NOT_VALIDATED`, `CERTIFICATE_POLICY_MISMATCH`,
`CERTIFICATE_RISK_SLICE_MISMATCH`, `CERTIFICATE_GENERATION_MISMATCH`,
`CERTIFICATE_CORPUS_UNRESOLVED`, `CERTIFICATE_CORPUS_HASH_MISMATCH`,
`PROBABILITY_LANGUAGE_FORBIDDEN`, `NEGATIVE_DECISION_FIELDS_INVALID`,
`PROJECTION_LEGALITY_RESULT_REQUIRED`, `CANDIDATE_SET_WIDENED`,
`ROUTE_AUTHORITY_INVALID`, `CAS_FENCE_MISMATCH`, and `CAS_PREIMAGE_MISMATCH`.

Protected SHA-256 values remain:

- scorer: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`;
- router replay: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`;
- scenario loader: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`;
- live registry: `8caec917815b5704bcfb534f5d6b557403d76161678c87b327f6ecb35533ff91`;
- live skill: `3e519c8f77768960a169f3a9906bbdc7afc68fe273b2d3f606f0d83fa2f7df84`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- This is a Stage-3 shadow contract. No live thresholds were fit, no operational
  certificate was issued, and no per-hub activation pointer was changed.
- The real scorer consumes projections backed by distinct intent-derived gold,
  but the route itself is a typed shadow fixture rather than output from an
  activated real-hub typed router. Full live route-gold remains downstream.
- External validation attestations are structural trust references in this
  harness. Cryptographic signature verification and production trust roots are
  activation concerns.
- The fixed method envelope names acceptance metrics but intentionally does not
  invent acceptance tolerances absent from the approved design. The downstream
  controller must fit and validate those values against operational policy.
- Strict packet validation was run and failed outside the executable contract:
  the packet predates current template/anchor requirements, and the repository
  validator cannot load `level-contract-resolver.js` or its local `tsx` runtime.
  Those dependencies and structural migrations are outside this phase's allowed
  edit surface, so the strict gate remains open.
<!-- /ANCHOR:limitations -->
