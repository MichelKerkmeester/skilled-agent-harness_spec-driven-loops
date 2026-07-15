---
title: "Checklist: Deep Improvement Common Services - Reducers & Projections"
description: "Blocking verification checklist for the deterministic reducers, projections, and shared evaluator/canary/promotion services in the deep-improvement common-services migration."
trigger_phrases:
  - "deep improvement reducers checklist"
  - "deep improvement projection verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined checks for replay, evidence, service states, and shared consumers"
    next_safe_action: "Run the reducer verifier after the predecessor event contract is frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Improvement Common Services - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the reducers and projections phase. Every item is a check the paired
verify agent runs before the candidate implementation lands; each report pins the candidate SHA, predecessor schema
fingerprint, reducer version, event-fixture digest, commands, exit codes, replay counts, and projection hashes. Any
unexpected side effect, missing raw evidence, non-deterministic projection, or downstream contract fork fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `001-typed-ledger-schema` event envelope, ordering, identity, version, and upcaster inputs are frozen for this phase
- [ ] CHK-002 [P1] Projection field matrix records ownership boundaries for `003-sealed-artifacts` and the three downstream variants
- [ ] CHK-003 [P1] Golden event histories cover evaluator epoch, candidate, trial, canary, promotion, rollback, and resume paths
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Reducers are pure and have no filesystem, network, clock, randomness, mutable evaluator, hidden-fixture, or promotion-write dependency
- [ ] CHK-005 [P0] Raw trial and receipt references remain append-only while normalized scores and projection views are versioned separately
- [ ] CHK-006 [P1] Scope is limited to common reducer, projection, service-contract, fixture, and verification changes; no adjacent phase cleanup is included
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Complete-history replay and checkpointed replay produce byte-identical projection bytes and state fingerprints
- [ ] CHK-008 [P0] Duplicate IDs, malformed payloads, missing fields, ambiguous ordering, unsupported versions, and stale events fail closed or enter an explicit safe state
- [ ] CHK-009 [P0] Iteration/convergence fixtures reconstruct evaluator epoch, candidate progress, budgets, unresolved evidence, stop disposition, and resume frontier from events alone
- [ ] CHK-010 [P0] Candidate/artifact index fixtures retain lineage, operator, profile, evaluator/fixture digests, raw trials, reduction versions, cost, latency, canaries, and receipts
- [ ] CHK-011 [P0] Evaluator capsule and epoch checks reject cross-epoch comparisons, mutable profile changes, missing commitments, and invalid calibration evidence
- [ ] CHK-012 [P0] Canary and promotion state tests cover offline, shadow, canary, ship eligibility, shipped, paused, aborted, rolled back, and inconclusive outcomes
- [ ] CHK-013 [P0] Critical-dimension regression, evaluator-integrity failure, stale canary, missing receipt, cost ceiling, and rollback vetoes cannot be cleared by aggregate score
- [ ] CHK-014 [P0] Per-mode status fixtures produce the same shared fields and transition semantics for common, agent, model, and skill workstreams
- [ ] CHK-015 [P0] Candidate-facing projection views redact hidden fixtures, exact evaluator internals, raw rationales, and terminal evidence as required by the service boundary
- [ ] CHK-016 [P1] Mixed-version and projection-rebuild fixtures prove compatible histories converge to the same state and incompatible histories refuse safely
- [ ] CHK-017 [P1] Failure injection proves a failed evaluator, canary, receipt, checkpoint, or promotion effect leaves an explicit recoverable status and preserved evidence
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-018 [P1] The event-to-projection manifest enumerates every common service event and each required projection consumer
- [ ] CHK-019 [P1] The three downstream variants pass common-contract fixtures without redefining evaluator, canary, promotion, rollback, or veto semantics
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-020 [P0] Candidate mutation paths cannot write evaluator assets, hidden fixtures, promotion thresholds, receipts, or projection state during reduction
- [ ] CHK-021 [P1] Evaluator query budgets, candidate-blind evidence, semantic leak vetoes, and canary isolation are represented as enforceable status, not advisory prose
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-022 [P1] Shared projection fields, reducer invariants, service states, ownership boundaries, and downstream consumer expectations are reflected in the phase docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-023 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the predecessor schema is pinned
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the predecessor schema and fixture hashes,
complete and checkpointed replay agree, raw evidence is retained, all common service states are covered, and the three
downstream variants consume one shared projection contract without semantic drift.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, and the exact-scope diff check
shows no unexpected tracked mutation outside the implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
