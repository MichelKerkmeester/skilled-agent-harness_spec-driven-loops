---
title: "Checklist: Agent Improvement - Reducers & Projections"
description: "Blocking verification checklist for the deterministic Agent Improvement reducers, AgentIR projections, shared-service consumption, and dark shadow-parity boundary."
trigger_phrases:
  - "agent improvement reducers checklist"
  - "agent improvement projection verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Agent Improvement replay, lineage, coverage, redaction, and common-service gate checks"
    next_safe_action: "Run the Agent Improvement verifier after the schema and common-service contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Agent Improvement - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Agent Improvement reducers and projections phase. Every item is
a check the paired verify agent runs before the candidate implementation lands; each report pins the candidate SHA,
predecessor schema fingerprint, common-service contract fingerprints, variant reducer version, event-fixture digest,
commands, exit codes, replay counts, projection hashes, redaction results, and shadow-parity outcome. Any unexpected
side effect, lost lineage, non-deterministic projection, common-service fork, or legacy-authority change fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `001-typed-ledger-schema` Agent Improvement event envelope, ordering, identity, version, and upcaster inputs are frozen for this phase
- [ ] CHK-002 [P0] Deep-improvement-common evaluator, canary, promotion, veto, rollback, receipt, and shared-status contracts are frozen and addressable
- [ ] CHK-003 [P1] Projection field matrix records AgentIR ownership, redaction rules, `003-sealed-artifacts` boundary, and common-service references
- [ ] CHK-004 [P1] Golden event histories cover proposal, component mutation, evaluation, convergence, coverage, canary, promotion, rollback, and resume paths
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Reducers are pure and have no filesystem, network, clock, randomness, mutable evaluator, hidden-fixture, promotion-write, or candidate-execution dependency
- [ ] CHK-006 [P0] Raw trials, component lineage, coverage evidence, and receipt references remain append-only while normalized scores and projection views are versioned separately
- [ ] CHK-007 [P0] Agent Improvement consumes common evaluator, canary, promotion, veto, rollback, receipt, and status semantics without reimplementing or shadowing them
- [ ] CHK-008 [P1] Scope is limited to Agent Improvement reducers, projections, common-service consumption, fixtures, and verification; no adjacent phase cleanup is included
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Complete-history replay and checkpointed replay produce byte-identical iteration/convergence, artifact-index, per-mode status, redaction, and state-fingerprint outputs
- [ ] CHK-010 [P0] Duplicate IDs, malformed AgentIR identity, missing fields, ambiguous ordering, unsupported versions, and stale events fail closed or enter an explicit safe state
- [ ] CHK-011 [P0] Iteration/convergence fixtures reconstruct AgentIR proposal frontier, evaluator epoch, first divergent trace, failure gradients, behavior coverage, budgets, unresolved evidence, stop, and resume from events alone
- [ ] CHK-012 [P0] AgentIR artifact-index fixtures retain component lineage, mutable/immutable locus, operator, profile, evaluator/fixture digests, raw trials, score versions, Pareto descriptors, cost, latency, canaries, and receipts
- [ ] CHK-013 [P0] Coverage fixtures exercise AgentIR clauses, authority-conflict pairs, state transitions, environmental perturbations, executor cells, and behavior families independently of task count
- [ ] CHK-014 [P0] Evaluator capsule and epoch checks reject cross-epoch comparisons, changed fixture commitments, missing hidden anchors, invalid calibration evidence, and mismatched common-service references
- [ ] CHK-015 [P0] Canary and promotion state tests consume common offline, shadow, canary, ship eligibility, shipped, paused, aborted, rolled back, and inconclusive semantics
- [ ] CHK-016 [P0] Critical-dimension regression, evaluator-integrity failure, stale canary, missing receipt, cost ceiling, coverage gap, and rollback vetoes cannot be cleared by aggregate score
- [ ] CHK-017 [P0] Shared per-mode status fixtures preserve common fields and transitions while validating only namespaced Agent Improvement frontier, profile champion, operator, coverage, and failure-class fields
- [ ] CHK-018 [P0] Candidate-facing projection views redact hidden fixtures, exact evaluator internals, raw rationales, terminal evidence, and unapproved score detail
- [ ] CHK-019 [P1] Mixed-version and projection-rebuild fixtures prove compatible histories converge to the same state and incompatible histories refuse safely
- [ ] CHK-020 [P1] Failure injection proves failed evaluator, canary, receipt, checkpoint, or promotion effects leave explicit recoverable status and preserved AgentIR evidence
- [ ] CHK-021 [P0] Dark reducer or common-service reference failure leaves legacy Agent Improvement outputs, state, schemas, and operational authority unchanged
- [ ] CHK-022 [P0] Shadow-parity fixtures compare the Agent Improvement dark projections with the legacy behavior by scenario identity and semantics, not aggregate count alone
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] The event-to-projection manifest enumerates every Agent Improvement event, common-service reference, projection field, redaction rule, and required consumer
- [ ] CHK-024 [P1] The Agent Improvement mode adapter passes common-contract fixtures without redefining evaluator, canary, promotion, rollback, receipt, veto, or status semantics
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-025 [P0] Candidate mutation paths cannot write evaluator assets, hidden fixtures, promotion thresholds, receipts, projection state, or sealed artifacts during reduction
- [ ] CHK-026 [P1] Candidate-facing information limits, evaluator query budgets, hidden-anchor commitments, semantic-leak vetoes, and canary isolation are represented as enforceable status or references
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P1] AgentIR projection fields, reducer invariants, common-service ownership, redaction boundaries, replay rules, and Agent Improvement consumer expectations are reflected in the phase docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the predecessor schema and common-service contracts are pinned
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the predecessor and common-service
fingerprints, complete and checkpointed replay agree, raw AgentIR evidence and lineage are retained, all shared service
states and Agent Improvement extensions are covered, candidate-facing redaction is enforced, shadow parity is green, and
legacy authority remains unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, and the exact-scope diff check
shows no unexpected tracked mutation outside the implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
