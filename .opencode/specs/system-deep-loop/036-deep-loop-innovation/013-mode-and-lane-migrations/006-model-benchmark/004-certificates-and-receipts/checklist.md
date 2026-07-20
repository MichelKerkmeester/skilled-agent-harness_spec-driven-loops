---
title: "Checklist: Model Benchmark - certificates and receipts"
description: "Checklist for the model-benchmark run certificate, transition receipt, scoring-matrix replay fingerprint, offline-verifier, and shared-service adapter contract."
trigger_phrases:
  - "model benchmark certificates and receipts checklist"
  - "model benchmark offline verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined P0 checks for matrix evidence and offline receipt verification"
    next_safe_action: "Run matrix and receipt fixtures after shared contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Model Benchmark - Certificates and Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 013's `006-model-benchmark/004-certificates-and-receipts` child. Every item is a check the paired verify agent runs
against the pinned candidate, shared-service contract, and sealed model-benchmark inputs before implementation is accepted.
Each report records the candidate SHA, BASE SHA, sealed recipe and artifact digests, model/executor matrix identity,
workload profile, replay-fingerprint inputs, commands, exit codes, fixture counts, verifier version, and unexpected tracked
mutation. A missing, unknown, confounded, redacted, or non-replayable input must produce an explicit incomplete, vetoed, or
unsupported result; it must never silently become a passing score or a selected model.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] The `003-sealed-artifacts` primitives and their digest, dependency, visibility, and tamper-evident read contract are available to the phase implementation
- [ ] CHK-007 [P2] Candidate SHA, BASE SHA, typed-ledger version, reducer version, sealed recipe digest, matrix identity, workload digest, evaluator-capsule digest, and verifier version are recorded in the verifier report
- [ ] CHK-008 [P0] Deep-improvement-common shared evaluator, canary, promotion, certificate, receipt, fingerprint, and hard-veto ownership is agreed before model-benchmark fields are implemented
- [ ] CHK-009 [P1] The phase-012 shared-contract freeze and write-set conflict graph handoff are recorded before the later 013 migration fan-out accepts this contract
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] Model-benchmark certificate, receipt, fingerprint, matrix, scoring, verifier, calibration, contamination, and workload changes are scoped to this phase; no adjacent cleanup is included
- [ ] CHK-011 [P1] Shared fields and decisions have one source; model-benchmark does not fork evaluator, canary, promotion, common certificate, receipt vocabulary, fingerprint inputs, or hard-veto order
- [ ] CHK-012 [P2] Raw cell observations, score vectors, calibrated estimates, matrix reductions, operational metrics, policy outcomes, and verifier findings remain separately addressable and content-addressed
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Complete, partial, contradictory, superseded, and tampered multi-model run fixtures emit or reject `CERTIFICATE` according to required evidence and explicit outcome rules
- [ ] CHK-002 [P0] Every benchmark-start, model-cell, scoring, calibration, contamination, adaptive-allocation, selection, abort, and restore transition emits an idempotent `RECEIPT` with predecessor links, effect identity, outcome, and uncertainty
- [ ] CHK-003 [P0] Replaying identical semantic matrix inputs reproduces the same fingerprint across processes; each recipe, sealed artifact, task family, model build, executor, workload, metric, calibration, contamination, seed, budget, retry, reducer, or predecessor mutation causes a mismatch
- [ ] CHK-004 [P0] The offline verifier recomputes sealed digests, canonical serialization, matrix coverage, raw-to-derived scoring, clustered uncertainty, calibration, contamination, workload, receipt-chain continuity, and hard gates without live model or network access
- [ ] CHK-013 [P0] Missing cells, missing raw observations, changed normalizers, changed calibrations, absent predecessor receipts, confounded model/executor paths, and unknown schema versions return `INCOMPLETE`, `VETOED`, or `UNSUPPORTED_VERSION`, never a substituted pass
- [ ] CHK-014 [P0] Common sealed anchors support paired inference, adaptive diagnostic cells obey task-family coverage quotas, and seeds or perturbations remain nested under their task family
- [ ] CHK-015 [P0] Pairwise rank, quality floors, latency, cost, abstention, switching overhead, uncertainty, Pareto membership, and utility sensitivity remain distinct; unresolved evidence cannot become an unjustified winner
- [ ] CHK-016 [P0] Candidate-specific judge calibration, model-build provenance, rubric-axis isolation, contamination exposure/retirement lineage, fresh-suite comparison, and protocol-by-model/task evidence are bound to the relevant cells
- [ ] CHK-017 [P0] Shared evaluator, canary, promotion, certificate, receipt, fingerprint, and hard-veto fixtures produce semantic parity through all three benchmark variant adapters
- [ ] CHK-018 [P0] A crash after model or measurement execution and before durable receipt commit remains uncertain and requires explicit recovery evidence before retry, selection, or restore
- [ ] CHK-019 [P1] Dark-path certificate and receipt emission cannot change live router or authority state, and rollback leaves legacy projections and archival evidence readable
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P1] The model-benchmark ownership and reuse matrix enumerates every certificate, receipt, fingerprint, matrix, scoring, verifier, evaluator, canary, promotion, calibration, contamination, and workload consumer
- [ ] CHK-020 [P1] The successor `005-resume-adapter` has explicit replay, salvage, changed-matrix, uncertain-effect, unsupported-version, and block cases for the model-benchmark receipt contract
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-021 [P0] Proposer-visible inputs cannot disclose hidden task content, secret canary content, evaluator internals, judge identity, or private-case lineage beyond the sealed visibility boundary
- [ ] CHK-022 [P1] Certificate and receipt verification binds model/executor subject digests, evaluator and workload epochs, verifier ruleset, and evidence inputs; signature or trust-root behavior remains delegated to sealed artifacts
- [ ] CHK-023 [P2] Redaction, path removal, process-id removal, and excluded wall-clock fields preserve digest-bound auditability without widening model, tool, network, or permission scope
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P1] The phase docs define the model-benchmark-specific matrix and scoring adapter while reusing deep-improvement-common certificate, receipt, fingerprint, evaluator, canary, and promotion semantics
- [ ] CHK-025 [P2] The phase-006 primitive consumption, `depends_on: []` planning posture, phase-012 freeze and 013 fan-out handoff, and phase-008 resume boundary are reflected consistently in packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Changes land in dependency-closed, path-scoped commits and no files outside the target phase scope are mutated
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins candidate, sealed-input, matrix, workload, and
contract digests, the offline verifier independently accepts the certificate and receipt chain, matrix validity and hard
vetoes remain binding, all three benchmark variants show shared-service parity, the dark path changes no authority, and the
phase gate passes with no unexpected tracked mutation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 certificate, receipt, matrix, fingerprint, offline-replay, validity,
shared-service, and dark-path contracts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after
verification.
<!-- /ANCHOR:sign-off -->
