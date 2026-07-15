---
title: "Checklist: Skill Benchmark reducers and projections"
description: "Checklist for the Skill Benchmark reducers and projections child, including deterministic replay, evidence preservation, shared-service ownership, and successor projection contracts."
trigger_phrases:
  - "skill benchmark reducers checklist"
  - "skill-benchmark projection verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Read the leaf mold, parent sequencing, and skill-benchmark research inputs"
    next_safe_action: "Define pure skill-event folds and projection invariants from the typed ledger schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Skill Benchmark reducers and projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Skill Benchmark reducers and projections child. The verifier
must pin the candidate and predecessor contract versions, record replay fixtures, commands, exit codes, projection hashes,
and event counts, and fail on nondeterministic output, lost raw evidence, silent unsupported events, zero-fixture coverage,
or unexpected mutation outside the scoped implementation surface.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The `001-typed-ledger-schema` event contract, version policy, identity rules, and canonical ordering are frozen and recorded
- [ ] CHK-002 [P0] Phase 012 shared mode interfaces and deep-improvement-common ownership boundaries are available to the lane
- [ ] CHK-003 [P1] Skill scenario cells, treatment arms, gold states, raw observations, score inputs, and downstream artifact consumers are inventoried
- [ ] CHK-004 [P2] The candidate reducer and projection versions are bound to the predecessor schema and scoring-policy fingerprints
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Reducers are pure: no filesystem, network, clock, random source, executor call, or mutable shared state affects a fold result
- [ ] CHK-006 [P1] Shared dispatch, evaluator, budget, receipt, lock, continuity, compatibility, and fan-in services are reused rather than reimplemented
- [ ] CHK-007 [P1] Scope remains limited to skill-benchmark scenario/scoring interpretation and the three named projections; adjacent mode concerns remain deferred
- [ ] CHK-008 [P2] Raw observations and derived scores use separate typed records and no reducer step overwrites immutable evidence
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Repeated replay of identical typed event sequences produces byte-equivalent iteration/convergence, artifact-index, and per-mode-status projections
- [ ] CHK-010 [P0] Projection fingerprints are stable across supported snapshot-prefix and full-ledger replay paths
- [ ] CHK-011 [P0] Availability, invocation, trajectory compliance, constraint coverage, outcome, and scoring readiness remain distinct states
- [ ] CHK-012 [P0] Empty, pending, and structural-only gold rows cannot produce a positive scored result; incomplete required gold produces an explicit blocked state
- [ ] CHK-013 [P0] Duplicate identities are idempotent or explicitly rejected, late events follow the declared policy, and unsupported event/schema versions produce typed blocked output
- [ ] CHK-014 [P0] The artifact index contains stable references and digests for every raw observation, scenario cell, bundle/environment, executor, gold, score, and certificate-input record
- [ ] CHK-015 [P1] Paired treatment contrasts preserve task and executor blocking and expose lift, selection tax, content effect, confidence, cost, and negative-transfer evidence
- [ ] CHK-016 [P1] Dependency and compatibility mismatches are explicit in per-mode status and cannot inherit a prior successful projection
- [ ] CHK-017 [P1] Prefix replay and snapshot restore produce the same status transitions as clean full replay
- [ ] CHK-018 [P2] Mutating score normalization or aggregation policy changes derived records while leaving raw observations and their digests unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-019 [P1] Every requirement in spec.md has a named reducer, projection, fixture, or downstream-contract check
- [ ] CHK-020 [P1] The successor `003-sealed-artifacts` and independent mode gate have reviewed the projection field and provenance contract
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-021 [P1] Gold provenance, tool/permission/dependency digests, canary evidence, and negative-transfer signals cannot be omitted from a supposedly ready projection
- [ ] CHK-022 [P2] Reducer and projection paths do not broaden executor permissions, bypass transition authorization, or turn diagnostic status into authority
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-023 [P1] The reducer ownership matrix, event-to-projection map, replay policy, and downstream field contract are reflected in the phase docs
- [ ] CHK-024 [P2] Open questions are assigned to the owning predecessor, successor, shared-service, or mode-gate phase before implementation starts
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-025 [P1] Any later implementation lands in dependency-closed, path-scoped commits after the predecessor and shared contracts are pinned
- [ ] CHK-026 [P2] Snapshot fixtures and projection artifacts remain disposable/regenerable from the append-only ledger and are not treated as new authorities
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, all P1 checks are complete or explicitly deferred by the owning
phase, repeated replay is deterministic, incomplete evidence is visible as a blocker, raw observations remain recoverable,
and the successor-facing projection contract is accepted without duplicated deep-improvement-common behavior.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, projection hashes are reproducible, and the scoped implementation
surface contains no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
