---
title: "Checklist: Deep Alignment - Reducers & Projections"
description: "Checklist for the Deep Alignment reducers and projections phase: deterministic typed-event replay, lane-aware convergence, immutable authority and evidence indexing, verify-first verdicts, shared review-loop parity, and dark shadow verification."
trigger_phrases:
  - "Deep Alignment reducers and projections checklist"
  - "deep-alignment deterministic projection gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
    last_updated_at: "2026-07-15T21:26:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking Deep Alignment replay and shadow-parity checklist"
    next_safe_action: "Verify every lane projection invariant against typed replay fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Alignment - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 005. The verifier replays the exact typed event sequence from a pinned multi-lane fixture, records the schema, contract, authority, and projection versions, compares canonical projection fingerprints, and reports field-level parity against the legacy Deep Alignment path. It must fail on hidden side effects, invalid authority material, incomplete applicability denominators, invalid transitions, missing verify-first evidence, erased raw findings, zero or skipped fixtures, unexpected authority changes, or unscoped tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The predecessor event schema and version policy are pinned as read-only inputs; this phase does not redefine the event envelope
- [ ] CHK-002 [P0] The phase-012 shared review-loop contract and the Deep Review reuse boundary are identified; no local loop fork is introduced
- [ ] CHK-003 [P1] The 013 write-set conflict graph and projection ownership boundary are recorded before any projection persistence is planned
- [ ] CHK-004 [P1] The legacy Deep Alignment replay corpus, lane fixtures, authority epochs, known-deviation cases, and protected-vs-known-defect baseline are available for shadow comparison
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The reducer is a pure fold with no clock, randomness, filesystem, network, adapter lookup, logging side effect, mutable singleton, or hidden external lookup
- [ ] CHK-006 [P0] Canonical map ordering, stable lane and artifact ordering, outcome ordering, numeric handling, serialization, and projection fingerprint rules are explicit and deterministic
- [ ] CHK-007 [P1] Raw authority observations, derived verdicts, applicability, known-deviation overlays, compatibility metadata, and projection-health state are kept separate
- [ ] CHK-008 [P1] The artifact and evidence index appends lineage, freshness, and availability changes without mutating immutable event evidence or prior observation content
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Replaying one ordered typed event sequence twice yields identical lane iteration/convergence state, artifact and evidence index, per-mode status, verdicts, canonical serialization, and projection fingerprint
- [ ] CHK-010 [P0] Empty, partial, completed, duplicate, late-reprobe, supersession, authority-expiry, mixed-epoch, not-applicable, unresolved, and deviation fixtures produce deterministic results without silently dropping evidence
- [ ] CHK-011 [P0] Declared applicability, authority validity, required rule/artifact coverage, unresolved obligations, hard blockers, contested findings, and missing re-probe evidence block convergence when the shared contract requires them
- [ ] CHK-012 [P0] Unknown event or authority versions, expired or mixed authority material, sequence gaps, invalid fingerprints, impossible transitions, duplicate terminal decisions, stale re-probes, and projection-version mismatch fail closed with an explicit blocked/error result
- [ ] CHK-013 [P0] Artifact and evidence index entries retain stable logical identity, producer event, authority and verifier revision, content digest, artifact kind, applicability, freshness, availability, and supersession lineage
- [ ] CHK-014 [P0] Per-mode status is derived only from valid typed transitions and exposes lane summaries, replay position, contract and authority versions, projection health, blocking reason, shadow state, and terminal status
- [ ] CHK-015 [P0] Per-lane and overall verdicts remain derived presentation state; raw observations, applicability, `not_applicable`, `unresolved`, `SKIP`, and `EXEMPT` outcomes remain independently replayable
- [ ] CHK-016 [P0] A detector candidate cannot become a blocking finding without an authority-bound observation, applicable rule, live re-probe receipt, and valid adjudication
- [ ] CHK-017 [P0] Known deviations remain visible as scoped, authority- and verifier-bound overlays; they do not delete the reproduced finding or bypass re-verification
- [ ] CHK-018 [P0] Deep Alignment and Deep Review pass the shared review-loop fixtures with mode-specific configuration only and no duplicated backbone semantics
- [ ] CHK-019 [P0] Shadow replay compares field-level lane state, declared coverage, applicability, verdict, artifact references, and status transitions against legacy Deep Alignment without changing authority
- [ ] CHK-020 [P1] Fixture coverage includes reordered or missing input handling at the ledger boundary and proves the reducer never claims a valid partial replay
- [ ] CHK-021 [P1] Projection rebuild after a fingerprint, authority, or version mismatch is explicit and replay-based; no in-place repair mutates the event history
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P1] The event-to-projection matrix covers every Deep Alignment event consumed by the typed ledger and names an owner for every derived lane, evidence, verdict, and status field
- [ ] CHK-023 [P1] The plan preserves the boundary with `003-sealed-artifacts`; indexing a reference is not treated as sealing, signing, or certifying the artifact
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P1] Authority, verifier, detector, re-probe, and artifact inputs are treated as untrusted evidence; no instruction-bearing body is trusted through a ledger row
- [ ] CHK-025 [P1] Authority, source, adapter, verifier, and artifact digests do not expose credentials or place secret-bearing content in the ledger envelope
- [ ] CHK-026 [P1] Authorization, authority epoch, deviation issuer, lineage, and replay references cannot be supplied by an untrusted payload in place of the shared gateway result
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P1] The phase outcome, shared-contract reuse, projection ownership, verify-first boundary, and unresolved contract questions are reflected consistently in the packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Runtime implementation and fixture changes, when authorized later, remain path-scoped to the reducer/projection concern and do not modify sibling phase contracts
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the pure-fold replay fingerprint is stable, the lane projections, artifact and evidence index, per-mode status, and derived verdicts have field-level evidence, shared review-loop parity with Deep Review is green, shadow parity is recorded, and the typed ledger remains non-authoritative.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms deterministic replay, fail-closed invalid input handling, immutable authority and evidence indexing, applicability-aware convergence, verify-first adjudication, shared-contract reuse, and no authority change outside the staged cutover phase.
<!-- /ANCHOR:sign-off -->
