---
title: "Checklist: Deep Review - Reducers & Projections"
description: "Checklist for the Deep Review reducers and projections phase: deterministic typed-event replay, coverage-aware convergence, immutable artifact indexing, status projection, shared review-loop parity, and dark shadow verification."
trigger_phrases:
  - "Deep Review reducers and projections checklist"
  - "deep-review deterministic projection gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking replay and shadow-parity checklist"
    next_safe_action: "Verify every projection invariant against typed replay fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Review - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 005. The verifier replays the exact typed event sequence from a pinned fixture, records the schema and projection versions, compares canonical projection fingerprints, and reports field-level parity against the legacy Deep Review path. It must fail on hidden side effects, invalid transitions, missing required coverage, zero or skipped fixtures, unexpected authority changes, or unscoped tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The predecessor event schema and version policy are pinned as read-only inputs; this phase does not redefine the event envelope
- [ ] CHK-002 [P0] The phase-012 shared review-loop contract and the Deep Alignment reuse boundary are identified; no local loop fork is introduced
- [ ] CHK-003 [P1] The 013 write-set conflict graph and projection ownership boundary are recorded before any projection persistence is planned
- [ ] CHK-004 [P1] The legacy Deep Review replay corpus and protected-vs-known-defect baseline are available for shadow comparison
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The reducer is a pure fold with no clock, randomness, filesystem, network, logging side effect, mutable singleton, or hidden external lookup
- [ ] CHK-006 [P0] Canonical map ordering, stable list ordering, numeric handling, serialization, and projection fingerprint rules are explicit and deterministic
- [ ] CHK-007 [P1] Source evidence, derived P0/P1/P2 presentation, compatibility metadata, and projection-health state are kept separate
- [ ] CHK-008 [P1] The artifact index appends lineage and availability changes without mutating immutable event evidence or prior artifact content
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Replaying one ordered typed event sequence twice yields identical iteration/convergence state, artifact index, per-mode status, canonical serialization, and projection fingerprint
- [ ] CHK-010 [P0] Empty, partial, completed, duplicate, late-evidence, and supersession fixtures produce deterministic results without silently dropping evidence
- [ ] CHK-011 [P0] Required dimension coverage, unresolved obligations, hard vetoes, contested findings, and missing proof artifacts block convergence when the shared contract requires them
- [ ] CHK-012 [P0] Unknown event versions, sequence gaps, invalid fingerprints, impossible transitions, duplicate terminal decisions, and projection-version mismatch fail closed with an explicit blocked/error result
- [ ] CHK-013 [P0] Artifact index entries retain stable logical identity, producer event, reviewed revision identity, content digest, artifact kind, availability, and supersession lineage
- [ ] CHK-014 [P0] Per-mode status is derived only from valid typed transitions and exposes replay position, contract versions, projection health, blocking reason, shadow state, and terminal status
- [ ] CHK-015 [P0] P0/P1/P2 is a derived presentation projection; confidence, reachability, exploitability, evidence kind, evidence strength, and lifecycle remain independently replayable
- [ ] CHK-016 [P0] Deterministic hard schema, build, security, or regression failures cannot be rescued by weighted soft scores or repeated judge agreement
- [ ] CHK-017 [P0] Deep Review and Deep Alignment pass the shared review-loop fixtures with mode-specific configuration only and no duplicated backbone semantics
- [ ] CHK-018 [P0] Shadow replay compares field-level state, coverage, terminal outcome, artifact references, and status transitions against legacy Deep Review without changing authority
- [ ] CHK-019 [P1] Fixture coverage includes reordered or missing input handling at the ledger boundary and proves the reducer never claims a valid partial replay
- [ ] CHK-020 [P1] Projection rebuild after a fingerprint or version mismatch is explicit and replay-based; no in-place repair mutates the event history
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-021 [P1] The event-to-projection matrix covers every Deep Review event consumed by the typed ledger and names an owner for every derived field
- [ ] CHK-022 [P1] The plan preserves the boundary with `003-sealed-artifacts`; indexing a reference is not treated as sealing or certifying the artifact
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-023 [P1] Proof and challenge inputs are treated as immutable evidence; generated reproducers cannot confirm their own finding without an independent verification receipt
- [ ] CHK-024 [P2] Projection failure and blocked replay do not silently downgrade a finding, bypass a hard veto, expose mutable evaluator state, or promote a non-authoritative result
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P2] The phase outcome, shared-contract reuse, projection ownership, and unresolved contract questions are reflected consistently in the packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Runtime implementation and fixture changes, when authorized later, remain path-scoped to the reducer/projection concern and do not modify sibling phase contracts
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the pure-fold replay fingerprint is stable, the three live projections and derived finding presentation have field-level evidence, shared review-loop parity with Deep Alignment is green, shadow parity is recorded, and the typed ledger remains non-authoritative.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms deterministic replay, fail-closed invalid input handling, immutable artifact indexing, coverage-aware convergence, shared-contract reuse, and no authority change outside the staged cutover phase.
<!-- /ANCHOR:sign-off -->
