---
title: "Verification Checklist: Rank-vs-Calibrated Route Contract"
description: "Level-2 evidence for certificate-gated calibrated routing, rank-only fallback, projection invisibility, and reversible lifecycle behavior."
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Rank-vs-Calibrated Route Contract

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-001 [P1] Ranking evidence remains authority-free and calibration remains evidence-only.
  - **Evidence**: `validateRouteDecision()` imports the frozen `parseRouteDecisionShape()` oracle; public evidence is the exact `rankScore`/`scoreMargin` array with `nonAuthority:true`, while calibration is a sibling envelope field.
- [x] CHK-002 [P1] Calibration legality depends on distinct request, registry, and corpus authorities.
  - **Evidence**: `evaluateCalibratedRoute()` resolves the active external certificate, compares request-pinned policy generation/risk slice, and recomputes the held-out corpus hash before admitting calibrated evidence.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-003 [P1] The frozen canonical hashing and corpus identity contracts were reused rather than duplicated.
  - **Evidence**: `lib/calibration-contract.cjs` imports `canonical.cjs` plus upstream `computeCorpusHash`; the harness imports the same whole-object corpus hash for load-time verification.
- [x] CHK-004 [P1] The held-out corpus identity and recovery fall-through were bound read-only.
  - **Evidence**: resolver results must match recomputed canonical bytes, declared `corpusId`/`corpusHash`, policy, generation, and risk slice; any miss produces one-turn `clarify` or typed `defer`.
- [x] CHK-005 [P1] All protected scorer, registry, and skill digests were pinned before execution.
  - **Evidence**: `PROTECTED_DIGESTS` holds the three required scorer hashes plus the live `sk-code` registry and skill hashes, and the harness checks them before and after scoring.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P1] Runtime dependencies are limited to Node built-ins, packet-local modules, and the two frozen local contract helpers.
  - **Evidence**: `assertSourceDiscipline()` rejects external packages; the calibration contract imports the real frozen decision validator plus canonical/corpus helpers, and `node --check` exits 0 for all four CommonJS files.
- [x] CHK-007 [P1] Singleton behavior is data-driven rather than a skill-name branch.
  - **Evidence**: legality derives `noCalibrationSlice` from `candidateCount === 1`; the source-discipline grep rejects literal skill/hub equality branches.
- [x] CHK-008 [P1] Code comments contain durable rationale only.
  - **Evidence**: the required comment-hygiene script exits 0 for each of the four modified CommonJS files, and the harness source-discipline scan rejects ephemeral labels.
- [x] CHK-009 [P1] JSON contracts and fixtures are strict JSON.
  - **Evidence**: the fresh Node parser check parsed all six packet JSON files.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P1] An unvalidated branch carrying `estimatedError` is structurally rejected.
  - **Evidence**: the planted out-of-band envelope rejects with `CALIBRATION_UNVALIDATED_FIELDS`; no public `RouteDecisionV1` field can represent the claim.
- [x] CHK-011 [P1] Candidate, expired, and revoked certificates cannot be attached or self-project as routes.
  - **Evidence**: every `attachCalibration()` attempt rejects with `CERTIFICATE_STATUS_NOT_VALIDATED`; evaluator verdicts project `clarify`/`defer`, while a raw decision rejects with `PROJECTION_LEGALITY_RESULT_REQUIRED`.
- [x] CHK-012 [P1] Policy, generation, and risk-slice mismatches fail against request-pinned identities.
  - **Evidence**: exact results are `CERTIFICATE_POLICY_MISMATCH`, `CERTIFICATE_GENERATION_MISMATCH`, and `CERTIFICATE_RISK_SLICE_MISMATCH`; every result removes calibrated evidence and clarifies.
- [x] CHK-013 [P1] Missing or byte-tampered corpus artifacts fail closed for attachment and evaluation.
  - **Evidence**: unresolved identities return `CERTIFICATE_CORPUS_UNRESOLVED`; mutated records with retained declared ids reject with `CERTIFICATE_CORPUS_HASH_MISMATCH` after canonical recomputation.
- [x] CHK-014 [P1] Negative decisions enforce exact branch fields and reject probability language in the input decision.
  - **Evidence**: `defer + estimatedError` and `clarify + confidence` reject with `PROBABILITY_LANGUAGE_FORBIDDEN`; a non-probability extra rejects with `NEGATIVE_DECISION_FIELDS_INVALID`.
- [x] CHK-015 [P1] Projection invisibility is externally licensed, byte-for-byte, and hash-compared.
  - **Evidence**: evaluator-produced envelopes with unvalidated versus validated sibling calibration share compatibility SHA-256 `0034e66902fdaafcf09cc3586f0e2e556e15f47d1c12f4a2f1fa14c8239973c1` and typed route-gold SHA-256 `7150aa5515c0557403ca29f10ef3ca71dced5f5875592e4b71d4ba50d025c53f`.
- [x] CHK-016 [P1] The real scorer evaluates distinct intent-derived gold and has a falsifier.
  - **Evidence**: a committed held-out corpus record supplies independently locked gold; exported `evaluateRouteGold` returns `pass:true`, while the corrupted observation returns `pass:false`.
- [x] CHK-017 [P1] Certificate identities have fixed reproducibility vectors.
  - **Evidence**: both method candidates reproduce fixture-pinned `certificateId` and `certHash` values through frozen `hashArtifact`; changing a metric changes both digests.
- [x] CHK-018 [P1] Candidate widening and authority escalation reject for exact reasons.
  - **Evidence**: the planted certified routes reject with `CANDIDATE_SET_WIDENED` and `ROUTE_AUTHORITY_INVALID`.
- [x] CHK-019 [P1] Fenced CAS restores the retained validated certificate and rejects stale expected-active ids.
  - **Evidence**: temperature→selective rotation is followed by `restoreRetainedPrior()` returning the original validated temperature artifact byte-identically; stale restore rejects with `CAS_PREIMAGE_MISMATCH`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P1] Every certificate admission decision consults a distinct authority.
  - **Evidence**: promotion consumes a registry-owned trusted attestation and fixed method metric; route legality consumes request-pinned identity plus an independently resolved corpus artifact.
- [x] CHK-021 [P1] Every required negative fixture becomes red at its guarded boundary.
  - **Evidence**: exact reason assertions cover status attachment, external projection licensing, negative branch closure, canonical corpus identity, stale restore CAS, authority, and candidate-set boundaries.
- [x] CHK-022 [P1] Both method families are executable contract data for the downstream controller.
  - **Evidence**: `calibration-method-envelope.v1.json` fixes parameter names and acceptance metrics for temperature scaling and selective-classification thresholding; both candidate shapes promote through the same registry logic.
- [x] CHK-023 [P1] Retained-prior restore does not re-run candidate promotion.
  - **Evidence**: restore returns the already validated certificate with the original `certificateId` and `certHash`, swaps only active/retained pointers under fenced CAS, and increments the fence.
- [x] CHK-024 [P1] Revocation demonstrates rank-only fallback without serving-policy mutation.
  - **Evidence**: the active certificate becomes `revoked`, evaluation returns `clarify` with sibling calibration `{status:"unvalidated"}`, and serving policy SHA-256 remains `a4940ea2c83b0b6a15c6cfef3cae2d72db147e9230725566057e5d197e9e479f`.
- [x] CHK-025 [P1] The calibration schema no longer forks the public V1 identity.
  - **Evidence**: the repurposed schema is `CalibrationEvidenceEnvelopeV1`, references the frozen route schema for `decision`, and never defines object-shaped `route.evidence`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] A decision cannot self-license calibrated output.
  - **Evidence**: `attachCalibration()` requires validated external status and request/corpus bindings; `projectAll()` requires the evaluator result and never licenses from `calibration.status`.
- [x] CHK-031 [P1] Certificate promotion and retained-prior restore are fenced and preimage-checked.
  - **Evidence**: `CertificateRegistry.rotate()` and `restoreRetainedPrior()` both call the same CAS guard with the current fence token and active-certificate preimage before pointer mutation.
- [x] CHK-032 [P1] Evidence cannot become destination commit authority.
  - **Evidence**: the imported frozen oracle fixes route authority to `WithheldUntilVerify`; negative decisions fix `Withheld`; the registry exposes no commit operation.
- [x] CHK-033 [P1] Resolver paths are trusted constants rather than caller-controlled paths.
  - **Evidence**: the harness derives fixed repository locations and passes only content identities through the legality interface.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Contract decisions cite the approved synthesis rather than inventing architecture.
  - **Evidence**: `implementation-summary.md` cites synthesis §2.1, §2.3, §3 Idea 5, §5.3, §8.1, §8.2, and §10.
- [x] CHK-041 [P1] Shadow-stage limits are reported as partial rather than upgraded to production claims.
  - **Evidence**: packet status and validator output use `shadow-partial`; live fitting, issuance, and activated-hub replay remain in Known Limitations.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All edited files are rooted inside this phase folder.
  - **Evidence**: the final phase-relative inventory contains the schemas, method envelope, fixtures, three libraries, harness, and packet docs only.
- [x] CHK-051 [P1] Protected scorers, live registry, and skill remain byte-unchanged.
  - **Evidence**: all five pinned hashes match before and after the read-only scorer subprocess.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-060 [P1] Targeted executable verification reaches the intended shadow gate.
  - **Evidence**: `node harness/validate-calibration-contract.cjs` exits 0 and reports SC-001, SC-002, SC-004, and SC-005 as `PASS`, with SC-003 honestly `shadow-partial`.
- [ ] CHK-061 [P1] Repository strict spec validation is green.
  - **Evidence**: `validate.sh --strict` was run and exited 2; current-template anchor/header/frontmatter checks fail, while rule bridges cannot load `level-contract-resolver.js` and generated-metadata checks cannot find the repository-local `tsx` runtime. The gate remains unchecked.
<!-- /ANCHOR:summary -->
