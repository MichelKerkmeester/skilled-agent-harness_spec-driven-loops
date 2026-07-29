---
title: "Checklist: Deep Improvement Common Services - certificates and receipts"
description: "Checklist for the Deep Improvement Common Services certificate, receipt, replay-fingerprint, offline-verifier, evaluator, canary, and promotion contract."
trigger_phrases:
  - "deep improvement certificates and receipts checklist"
  - "deep improvement common service verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined P0 verifier checks for offline replay and guarded promotion"
    next_safe_action: "Run certificate and receipt fixtures after shared contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep Improvement Common Services - Certificates and Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 013's `004-certificates-and-receipts` child. Every item is a check the paired verify agent
runs against the pinned candidate and shared-service contract before implementation is accepted. Each report records
the candidate SHA, BASE SHA, contract and evaluator-capsule digests, canary epoch, replay-fingerprint inputs, commands,
exit codes, fixture counts, verifier version, and unexpected tracked mutation. A missing, unknown, or redacted input
must produce an explicit incomplete or unsupported result; it must never silently become a passing score.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] The `003-sealed-artifacts` primitives and their digest/reference contract are available to the phase implementation [EVIDENCE: imports from `deep-improvement-common-sealed-artifacts`]
- [x] CHK-007 [P2] Candidate SHA, BASE SHA, typed-ledger version, reducer version, evaluator-capsule digest, and canary-epoch digest are recorded in the verifier report [EVIDENCE: run certificate subject, ruleset, artifact claims, and verifier receipt]
- [x] CHK-008 [P0] Shared service ownership and variant adapter boundaries are agreed before any downstream 010 migration accepts the contract [EVIDENCE: `implementation-summary.md` shared contract section]
- [x] CHK-009 [P1] The phase-012 shared-contract freeze and write-set conflict graph handoff are recorded before the 010 migration fan-out [EVIDENCE: `spec.md` dependencies and reuse boundary]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] Certificate, receipt, fingerprint, verifier, evaluator, canary, and promotion changes are scoped to this phase; no adjacent cleanup is included [EVIDENCE: final `git status --short` scope audit]
- [x] CHK-011 [P1] Shared fields and decisions have one source; variant adapters do not fork certificate semantics, receipt vocabulary, fingerprint inputs, or hard veto order [EVIDENCE: exported `DEEP_IMPROVEMENT_COMMON_SHARED_CERTIFICATE_CONTRACT`]
- [x] CHK-012 [P2] Raw evidence, derived scores, policy outcomes, and verifier findings remain separately addressable and content-addressed [EVIDENCE: typed artifact claims, certificate digest, and verification receipt]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] Complete, partial, contradictory, superseded, and tampered run fixtures emit or reject `CERTIFICATE` according to required evidence and explicit verdict rules [EVIDENCE: targeted certificate issuance and fail-closed Vitest fixtures]
- [x] CHK-002 [P0] Every evaluator, canary, scoring, promotion, abort, and restore transition emits an idempotent `RECEIPT` with predecessor links, effect identity, outcome, and uncertainty [EVIDENCE: exported transition vocabulary and deterministic receipt issuer]
- [x] CHK-003 [P0] Replaying identical semantic inputs reproduces the same fingerprint across processes; each artifact, policy, evaluator, reducer, seed, budget, retry, or predecessor mutation causes a mismatch [EVIDENCE: targeted Vitest fingerprint and mutation fixtures]
- [x] CHK-004 [P0] The offline verifier recomputes hashes, canonical serialization, raw-to-derived reduction, receipt-chain continuity, canary relations, and hard gates without live agent or network access [EVIDENCE: `verifyDeepImprovementCommonCertificateOffline` and targeted Vitest]
- [x] CHK-013 [P0] Missing raw observations, changed normalizers, changed calibrations, absent predecessor receipts, and unknown schema versions return `INCOMPLETE` or `UNSUPPORTED_VERSION`, never a substituted pass [EVIDENCE: missing-artifact, broken-predecessor, and unsupported-version fixtures]
- [x] CHK-014 [P0] Canary epochs bind deterministic ground truth, adversarial/metamorphic fixtures, freshness, and leakage checks; stale or leaked canary evidence vetoes promotion [EVIDENCE: real-store stale-canary Vitest fixture]
- [x] CHK-015 [P0] Hard schema, build, security, regression, integrity, leakage, and evidence-sufficiency failures cannot be rescued by soft evaluator scores [EVIDENCE: hard-veto and admissibility checks precede verdict acceptance]
- [x] CHK-016 [P0] `INSUFFICIENT_EVIDENCE`, `VETOED`, `ABORT`, `UNCERTAIN`, `RECOVERED`, and `PASS` remain distinct in the verifier and promotion state machine [EVIDENCE: exported verdict, outcome, and uncertainty unions]
- [x] CHK-017 [P0] The evaluator preserves raw per-item observations separately from normalization, calibration, aggregation, and final policy decisions [EVIDENCE: deep-improvement-common-certificates.ts:839 compares raw and normalized score vectors]
- [x] CHK-018 [P0] All three downstream variants consume identical shared evaluator, canary, promotion, certificate, receipt, and fingerprint fixtures through adapters [EVIDENCE: shared-consumer identity assertion in targeted Vitest]
- [x] CHK-019 [P0] A crash after an external effect and before durable receipt commit remains uncertain and requires explicit recovery evidence before retry, promote, or restore [EVIDENCE: deep-improvement-common-certificates.ts:547 derives unknown-effect uncertainty]
- [x] CHK-020 [P1] Dark-path certificate and receipt emission cannot change authority, and rollback leaves legacy projections and archival evidence readable [EVIDENCE: certificate authority mode is `dark-evidence-only`]
- [x] CHK-028 [P0] A declared field-to-expected-kind closure map covers at least `PROMOTION_EVIDENCE.unresolvedEvidenceDigests` and `PROMOTION_EVIDENCE.vetoEvidenceDigests`, checks array elements independently, and binds the recomputed ordered closure across certificates, receipts, replay fingerprints, and event-ledger evidence [EVIDENCE: four offline-verifier tests cover fabricated and wrong-kind digests independently for both declared fields]
- [x] CHK-029 [P0] Real-store fixtures reject missing, fabricated, wrong-kind, mutated, stale, reordered, visibility-denied, or authority-dead named evidence; missing offline bytes are typed `unverifiable`, and selector syntax passes only after real target-context resolution [EVIDENCE: 18/18 targeted Vitest tests pass, including a pruned offline store and forged exact-reference binding]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 [P1] The shared-service reuse matrix enumerates every evaluator, canary, promotion, certificate, receipt, fingerprint, and verifier consumer and identifies the owning contract [EVIDENCE: `DEEP_IMPROVEMENT_COMMON_SHARED_CERTIFICATE_CONTRACT.consumers`]
- [x] CHK-021 [P1] The successor `005-resume-adapter` has explicit replay, salvage, uncertain-effect, unsupported-version, and block cases for the receipt contract [EVIDENCE: `implementation-summary.md` successor contract]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P0] Proposer-visible inputs cannot disclose secret canary content, hidden evaluator fixtures, or judge identity before the independent evidence boundary permits disclosure [EVIDENCE: deep-improvement-common-certificate-types.ts:149 exposes digest claims rather than sealed bytes]
- [x] CHK-023 [P1] Certificate and receipt verification binds subject digests, authority/service epoch, verifier ruleset, and evidence inputs; signature or trust-root behavior remains delegated to sealed artifacts [EVIDENCE: deep-improvement-common-certificates.ts:1427 performs the offline verified-read sequence]
- [x] CHK-024 [P2] Redaction, path removal, process-id removal, and excluded wall-clock fields preserve digest-bound auditability without widening capability or permission scope [EVIDENCE: canonical identities contain semantic digests and exclude runtime storage metadata]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P1] The phase docs define the shared contract consumed by agent-improvement, model-benchmark, and skill-benchmark without duplicating variant design [EVIDENCE: `implementation-summary.md` successor contract]
- [x] CHK-026 [P2] The 009 freeze and 010 fan-out handoff, phase-006 primitive consumption, and the `005-resume-adapter` resume boundary are reflected consistently in packet docs [EVIDENCE: `spec.md` and `implementation-summary.md`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P1] Changes land in dependency-closed, path-scoped commits and no files outside the target phase scope are mutated [EVIDENCE: final `git status --short` scope audit]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the candidate and contract digests, the
offline verifier independently accepts the certificate and receipt chain, all hard vetoes remain binding, all three
variants show shared-service parity, the dark path changes no authority, and the phase gate passes with no unexpected
tracked mutation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 certificate, receipt, fingerprint, offline-replay, canary, and
promotion contract and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
