---
title: "Verification Checklist: Calibration Held-Out Routing Corpus"
description: "Level-2 verification evidence for the immutable corpus contract, representative data, and zero-dependency validator harness."
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist

<!-- ANCHOR:protocol -->
## Protocol

- [x] The checked artifact is evidence-only and cannot grant destination COMMIT authority.
  - **Evidence**: `CalibrationClaimV1.grantsCommitAuthority` is fixed to `false`; the validator rejects authority escalation.
- [x] Labels are intent-derived, independent, and blind to router output.
  - **Evidence**: `labeling-protocol.md` and `validateAttestation()` define and enforce the ordering and attestation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] Frozen policy identity and canonical serialization contracts were bound read-only.
  - **Evidence**: `lib/calibration-corpus.cjs` imports `canonicalBytes` and `computeEffectivePolicyHash` from the frozen contract library.
- [x] The protected scorer and replay digests were pinned before execution.
  - **Evidence**: the harness asserts trusted SHA-256 constants for the scorer, router replay, and playbook scenario loader before replay.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] The implementation uses Node built-ins plus the frozen canonical helper only.
  - **Evidence**: import inspection and `node --check` passed for both CommonJS files.
- [x] Singleton handling is generic data validation, not a skill-name branch.
  - **Evidence**: `validateHubCoverage()` consumes `candidateCount`, `noCalibrationSlice`, and `reason` without comparing a hub name.
- [x] Durable comments contain no packet, task, requirement, or phase labels.
  - **Evidence**: the project comment-hygiene checker passed on both CommonJS files.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] The planted router-derived label fails for the exact leakage reason.
  - **Evidence**: harness result `LABEL_LEAKAGE_ROUTER_SOURCE`.
- [x] Trust metadata is content-addressed and stale identities fail closed.
  - **Evidence**: relabeling policy binding plus privacy attestation changes the computed id; the stale body rejects with `CORPUS_HASH_MISMATCH` and the stale claim with `CORPUS_ID_MISMATCH`.
- [x] A changed sample cannot reuse its prior generation.
  - **Evidence**: the same-generation fixture rejects with `CORPUS_GENERATION_NOT_INCREMENTED`; the identical changed sample passes after incrementing the generation.
- [x] Bundle risk is derived from the strictest target and uses the fixed taxonomy tolerance.
  - **Evidence**: the evidence/800-bps reclassification rejects with `RISK_STRICTEST_TARGET_MISMATCH`; a correctly classified actor bundle with 800 bps rejects with `RISK_TOLERANCE_MISMATCH`.
- [x] Frozen topology cannot be weakened by corpus-local declarations.
  - **Evidence**: removing the `surfaceBundle` record and its self-declared requirement rejects with `HUB_TOPOLOGY_CELL_MISSING`.
- [x] Missing, stale, policy-mismatched, and id-mismatched bindings fail closed.
  - **Evidence**: harness reasons `CORPUS_ID_MISSING`, `CORPUS_GENERATION_STALE`, `CORPUS_POLICY_MISMATCH`, and `CORPUS_ID_MISMATCH`.
- [x] Operational activation requires an external, independently issued attestation.
  - **Evidence**: the harness rejects omitted attestation, omitted proof, omitted authority, and self-issued review with `ACTIVATION_EXTERNAL_ATTESTATION_REQUIRED`, `ACTIVATION_EXTERNAL_PROOF_MISSING`, `ACTIVATION_ATTESTATION_AUTHORITY_MISSING`, and `ACTIVATION_ATTESTATION_SELF_ISSUED`; the fully bound control is accepted.
- [x] The live gate binds corpus identity, sample floors, and retention lineage before measuring divergence.
  - **Evidence**: planted inputs reject with `LIVE_CORPUS_ID_MISMATCH`, `LIVE_SAMPLE_FLOOR_UNMET`, `LIVE_RETENTION_LINEAGE_MISSING`, and `LIVE_OFFLINE_DIVERGENCE`; the bound summary is accepted with taxonomy-derived tolerances.
- [x] Typed rows exercise the real projector chain and the real scorer has a falsifier.
  - **Evidence**: five rows run `projectTypedRouteGold -> projectLegacyObservation`; all 15 reach `evaluateRouteGold`, and a deliberately corrupted observation is rejected.
- [x] Replay is byte-deterministic across at least three runs.
  - **Evidence**: three frozen-canonical serialized outputs are byte-equal with SHA-256 `9ee9f59882cb4215a36d408db736ca9029eba1cd5bb01ae1c38f141d15769e01`.
- [x] The explicit singleton record is accepted without creating a required calibration hub.
  - **Evidence**: harness output reports `mcp-code-mode`, `candidateCount: 1`, and `noCalibrationSlice: true`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Three representative multi-candidate corpora are sealed and content-addressed.
  - **Evidence**: corpus validation recomputes and matches all three `corpusId` values from frozen canonical bytes.
- [x] All four decision branches and every frozen reachable positive selection kind have structural coverage.
  - **Evidence**: `validateCoverage()` checks declared minimums plus the external frozen topology for `sk-code`, `system-deep-loop`, and `mcp-tooling`.
- [x] Every new fixture has an assertion that becomes red when its guard is removed.
  - **Evidence**: exact-code rejections are paired with accepted controls for repaired label provenance, restored topology and strictest risk, reminted trust identity, incremented lineage, corrected corpus binding, complete external attestation, and fully bound live-gate data.
- [x] Offline/live divergence and shadow activation inadmissibility have negative cases.
  - **Evidence**: planted inputs reject with `LIVE_OFFLINE_DIVERGENCE` and `ACTIVATION_EVIDENCE_INADMISSIBLE`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] Privacy sign-off is a sealing precondition.
  - **Evidence**: a pending-signoff corpus rejects with `PRIVACY_SIGNOFF_REQUIRED`.
- [x] Retention, partitioning, deletion lineage, and right-to-be-forgotten are explicit.
  - **Evidence**: schema fields and `gates-and-governance.md` define the governance contract; the live fixture binds its corpus id, retention-policy hash, sample floor, and per-sample deletion-key count.
- [x] External attestation validation does not overstate cryptographic assurance.
  - **Evidence**: the validator checks reference, authority, identity, and independence structure; `implementation-summary.md` records cryptographic signature verification as an activation-stage limitation.
- [x] Promotion remains reversible and fenced.
  - **Evidence**: every seal requires CAS fencing and prior-generation retention; no live pointer is changed here.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] Contract, labeling, taxonomy, gates, and governance are documented with synthesis citations.
  - **Evidence**: the four authored protocol documents cite the relevant synthesis sections.
- [x] Known shadow-stage limitations are recorded without upgrading them to passes.
  - **Evidence**: `implementation-summary.md`, packet status fields, and nested harness route-gold verdict use `shadow-partial`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] All created and modified files are rooted in this phase folder.
  - **Evidence**: the final `rg --files` inventory is phase-relative.
- [x] Protected scorers, registries, routers, manifests, and skills remain read-only.
  - **Evidence**: all three protected digest assertions passed before and after replay; no external file was written.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary

- [x] Targeted executable verification passes with an explicit shadow-partial status.
  - **Evidence**: `node harness/validate-calibration-corpus.cjs` exits 0 and reports SC-001 through SC-007.
- [ ] Repository strict spec validation is green.
  - The orchestrator owns this check by explicit instruction; it was not run here.
<!-- /ANCHOR:summary -->
