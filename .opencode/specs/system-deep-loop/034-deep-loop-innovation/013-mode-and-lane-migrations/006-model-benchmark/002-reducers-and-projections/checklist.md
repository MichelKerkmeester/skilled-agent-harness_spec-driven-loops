---
title: "Checklist: Model Benchmark — Reducers & Projections"
description: "Blocking verification checklist for the deterministic model-benchmark reducers, multi-model matrix projections, raw-trial artifact index, uncertainty-aware scoring, and shared deep-improvement service consumption."
trigger_phrases:
  - "model benchmark reducers checklist"
  - "model benchmark projection verification"
  - "scoring matrix replay verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined matrix replay, evidence, scoring, and common-service checks"
    next_safe_action: "Run the matrix reducer verifier after the typed schema is frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Model Benchmark — Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the model-benchmark reducers and projections phase. Every item is a
check the paired verify agent runs before the candidate implementation lands; each report pins the candidate SHA,
predecessor schema fingerprint, shared-service contract fingerprint, reducer and score-policy versions, fixture digest,
commands, exit codes, event counts, matrix counts, projection hashes, and exact-scope diff. Any side effect,
order-dependent projection, lost raw evidence, silent cell inference, common-service fork, or unexpected tracked mutation
fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Model-benchmark `001-typed-ledger-schema` event envelope, cell identity, ordering, version, and upcaster inputs are frozen for this phase
- [ ] CHK-002 [P0] Deep-improvement-common mode 004 reducer and evaluator/canary/promotion/status contracts are available and their ownership boundary is recorded
- [ ] CHK-003 [P1] Projection field matrix records ownership boundaries for `003-sealed-artifacts`, later certificates, the mode gate, and downstream 010 integration
- [ ] CHK-004 [P1] Golden event histories cover run, matrix manifest, cell, raw trial, score, validity, coverage, evaluator epoch, canary, promotion, rollback, and resume paths
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Reducers are pure and have no model, evaluator, filesystem, network, clock, randomness, mutable configuration, hidden-fixture, sealing, promotion, or rollback dependency
- [ ] CHK-006 [P0] Raw trial, receipt, model, task, recipe, evaluator, validity, usage, and latency references remain append-only while normalized scores and ranking views are versioned separately
- [ ] CHK-007 [P0] Stable matrix-cell keys and canonical ordering make completion order, provider order, batch boundaries, and duplicate delivery irrelevant to valid projection bytes
- [ ] CHK-008 [P1] Scope is limited to model-benchmark reducers, projections, common-service adapters, fixtures, and verification; no sibling concern or adjacent cleanup is included
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Complete-history replay and checkpointed replay produce byte-identical iteration state, matrix entries, artifact index, scoring matrix, per-mode status, and fingerprints
- [ ] CHK-010 [P0] Valid matrix event permutations, duplicate terminal events, late observations, and equivalent batch boundaries produce identical projections
- [ ] CHK-011 [P0] Duplicate IDs, malformed payloads, missing fields, ambiguous ordering, unsupported versions, stale evaluator epochs, and incompatible matrix epochs fail closed or enter explicit safe states
- [ ] CHK-012 [P0] Iteration/convergence fixtures reconstruct run and iteration state, matrix waves, coverage quotas, adaptive selection, budgets, unresolved evidence, stop disposition, and resume frontier from events alone
- [ ] CHK-013 [P0] Artifact-index fixtures retain resolved model/provider/build, task, fixture, recipe, prompt, workload, toolchain, raw outputs, usage, latency, receipts, validity, evaluator epochs, and score-policy references
- [ ] CHK-014 [P0] Scoring fixtures preserve raw observations beside normalized metrics, pairwise estimates, uncertainty, calibration/reliability, contamination, coverage, cost, latency, and ranking-policy records
- [ ] CHK-015 [P0] Missing, underpowered, abstained, inconclusive, contaminated, invalid, stale, and common-vetoed cells cannot silently become ranked or promotion-eligible evidence
- [ ] CHK-016 [P0] Model Benchmark consumes deep-improvement-common evaluator, canary, promotion, receipt, veto, rollback, and per-mode status transitions without redefining or clearing shared states
- [ ] CHK-017 [P1] Mixed-version, supported-upcast, score-policy, model-alias, recipe, and projection-rebuild fixtures converge when compatible and refuse safely when incompatible
- [ ] CHK-018 [P1] Adaptive-selection fixtures retain mandatory coverage, selection policy, propensity metadata, confirmatory anchors, and explicit insufficient-support states
- [ ] CHK-019 [P1] Failure injection proves failed model, evaluator, receipt, checkpoint, scoring, canary, or promotion effects leave recoverable status and preserved raw evidence
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-020 [P1] The event-to-projection manifest enumerates every model-benchmark event family, matrix projection, artifact-index field group, scoring output, and common-service consumer
- [ ] CHK-021 [P1] The model-benchmark extension fields are namespaced and all common fields and stage semantics match the deep-improvement-common contract
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P0] Candidate, model, evaluator, scoring, or ranking paths cannot write hidden fixtures, evaluator assets, receipts, score policy, matrix state, or projection state during reduction
- [ ] CHK-023 [P1] Candidate-facing projections redact protected evaluator internals, hidden benchmark material, raw judge rationales, and terminal promotion evidence as required by the shared service boundary
- [ ] CHK-024 [P1] Contamination, evaluator-integrity, critical-slice, latency/SLO, cost, and common canary vetoes are enforceable projection states rather than advisory prose
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P1] Matrix-cell identity, projection fields, reducer invariants, scoring-policy lineage, common-service ownership, and downstream consumer expectations are reflected in the phase docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the predecessor schema and common-service contract are pinned
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the predecessor and shared-service
fingerprints, complete and checkpointed replay agree across matrix permutations, raw trial evidence and lineage remain
available, scoring uncertainty and invalid states are explicit, and Model Benchmark consumes one shared evaluator,
canary, promotion, veto, rollback, and status contract without semantic drift.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, and the exact-scope diff check
shows no unexpected tracked mutation outside the model-benchmark implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
