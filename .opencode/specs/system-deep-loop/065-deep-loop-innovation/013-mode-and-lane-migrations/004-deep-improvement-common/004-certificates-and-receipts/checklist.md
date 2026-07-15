---
title: "Checklist: Deep Improvement Common Services - certificates and receipts (013 phase 004)"
description: "Checklist for the Deep Improvement Common Services certificate, receipt, replay-fingerprint, offline-verifier, evaluator, canary, and promotion contract."
trigger_phrases:
  - "deep improvement certificates and receipts checklist"
  - "deep improvement common service verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
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
# Checklist: Deep Improvement Common Services - Certificates and Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. Every item is a check the paired verify agent
runs against the pinned candidate and shared-service contract before implementation is accepted. Each report records
the candidate SHA, BASE SHA, contract and evaluator-capsule digests, canary epoch, replay-fingerprint inputs, commands,
exit codes, fixture counts, verifier version, and unexpected tracked mutation. A missing, unknown, or redacted input
must produce an explicit incomplete or unsupported result; it must never silently become a passing score.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] The `003-sealed-artifacts` primitives and their digest/reference contract are available to the phase implementation
- [ ] CHK-007 [P2] Candidate SHA, BASE SHA, typed-ledger version, reducer version, evaluator-capsule digest, and canary-epoch digest are recorded in the verifier report
- [ ] CHK-008 [P0] Shared service ownership and variant adapter boundaries are agreed before any downstream 010 migration accepts the contract
- [ ] CHK-009 [P1] The phase-009 shared-contract freeze and write-set conflict graph handoff are recorded before the 010 migration fan-out
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] Certificate, receipt, fingerprint, verifier, evaluator, canary, and promotion changes are scoped to this phase; no adjacent cleanup is included
- [ ] CHK-011 [P1] Shared fields and decisions have one source; variant adapters do not fork certificate semantics, receipt vocabulary, fingerprint inputs, or hard veto order
- [ ] CHK-012 [P2] Raw evidence, derived scores, policy outcomes, and verifier findings remain separately addressable and content-addressed
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Complete, partial, contradictory, superseded, and tampered run fixtures emit or reject `CERTIFICATE` according to required evidence and explicit verdict rules
- [ ] CHK-002 [P0] Every evaluator, canary, scoring, promotion, abort, and restore transition emits an idempotent `RECEIPT` with predecessor links, effect identity, outcome, and uncertainty
- [ ] CHK-003 [P0] Replaying identical semantic inputs reproduces the same fingerprint across processes; each artifact, policy, evaluator, reducer, seed, budget, retry, or predecessor mutation causes a mismatch
- [ ] CHK-004 [P0] The offline verifier recomputes hashes, canonical serialization, raw-to-derived reduction, receipt-chain continuity, canary relations, and hard gates without live agent or network access
- [ ] CHK-013 [P0] Missing raw observations, changed normalizers, changed calibrations, absent predecessor receipts, and unknown schema versions return `INCOMPLETE` or `UNSUPPORTED_VERSION`, never a substituted pass
- [ ] CHK-014 [P0] Canary epochs bind deterministic ground truth, adversarial/metamorphic fixtures, freshness, and leakage checks; stale or leaked canary evidence vetoes promotion
- [ ] CHK-015 [P0] Hard schema, build, security, regression, integrity, leakage, and evidence-sufficiency failures cannot be rescued by soft evaluator scores
- [ ] CHK-016 [P0] `INSUFFICIENT_EVIDENCE`, `VETOED`, `ABORT`, `UNCERTAIN`, `RECOVERED`, and `PASS` remain distinct in the verifier and promotion state machine
- [ ] CHK-017 [P0] The evaluator preserves raw per-item observations separately from normalization, calibration, aggregation, and final policy decisions
- [ ] CHK-018 [P0] All three downstream variants consume identical shared evaluator, canary, promotion, certificate, receipt, and fingerprint fixtures through adapters
- [ ] CHK-019 [P0] A crash after an external effect and before durable receipt commit remains uncertain and requires explicit recovery evidence before retry, promote, or restore
- [ ] CHK-020 [P1] Dark-path certificate and receipt emission cannot change authority, and rollback leaves legacy projections and archival evidence readable
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P1] The shared-service reuse matrix enumerates every evaluator, canary, promotion, certificate, receipt, fingerprint, and verifier consumer and identifies the owning contract
- [ ] CHK-021 [P1] The successor `005-resume-adapter` has explicit replay, salvage, uncertain-effect, unsupported-version, and block cases for the receipt contract
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P0] Proposer-visible inputs cannot disclose secret canary content, hidden evaluator fixtures, or judge identity before the independent evidence boundary permits disclosure
- [ ] CHK-023 [P1] Certificate and receipt verification binds subject digests, authority/service epoch, verifier ruleset, and evidence inputs; signature or trust-root behavior remains delegated to sealed artifacts
- [ ] CHK-024 [P2] Redaction, path removal, process-id removal, and excluded wall-clock fields preserve digest-bound auditability without widening capability or permission scope
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P1] The phase docs define the shared contract consumed by agent-improvement, model-benchmark, and skill-benchmark without duplicating variant design
- [ ] CHK-026 [P2] The 009 freeze and 010 fan-out handoff, phase-003 primitive consumption, and phase-005 resume boundary are reflected consistently in packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-027 [P1] Changes land in dependency-closed, path-scoped commits and no files outside the target phase scope are mutated
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
