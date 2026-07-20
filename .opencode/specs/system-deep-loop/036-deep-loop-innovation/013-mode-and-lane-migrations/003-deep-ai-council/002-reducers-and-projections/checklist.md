---
title: "Checklist: Deep AI Council - Reducers & Projections"
description: "Checklist for the Deep AI Council reducers and projections phase: deterministic deliberation replay, evidence-conditioned independence and stance state, plural outcomes, immutable artifact indexing, status projection, and dark shadow verification."
trigger_phrases:
  - "Deep AI Council reducers and projections checklist"
  - "deep-ai-council deterministic projection gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
    last_updated_at: "2026-07-15T22:15:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking council replay and shadow-parity checklist"
    next_safe_action: "Verify every council projection invariant against typed fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep AI Council - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 013's `003-deep-ai-council/002-reducers-and-projections` child. The verifier replays the exact typed council event
sequence from a pinned fixture, records the schema and projection versions, compares canonical projection fingerprints,
checks independence and stance lineage, and reports field-level parity against the legacy Deep AI Council path. It must
fail on hidden side effects, invalid transitions, unsupported calibration, erased minority evidence, unstable
counterfactual outcomes, missing required coverage, zero or skipped fixtures, unexpected authority changes, or unscoped
tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The predecessor event schema and version policy are pinned as read-only inputs; this phase does not redefine the event envelope
- [ ] CHK-002 [P0] Shared mode, fan-in, adjudication, budget, convergence, and health contracts are identified; no local shared-backbone fork is introduced
- [ ] CHK-003 [P1] The 013 write-set conflict graph and council projection ownership boundary are recorded before projection persistence is planned
- [ ] CHK-004 [P1] Legacy Deep AI Council replay fixtures, control-arm outputs, and protected-vs-known-defect baseline are available for shadow comparison
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The reducer is a pure fold with no clock, randomness, filesystem, network, model call, logging side effect, mutable singleton, or hidden external lookup
- [ ] CHK-006 [P0] Canonical map ordering, stable list ordering, numeric handling, serialization, event ordering, and projection fingerprint rules are explicit and deterministic
- [ ] CHK-007 [P1] Source observations, derived plural outcomes, calibration metadata, compatibility metadata, and projection-health state are kept separate
- [ ] CHK-008 [P1] The artifact index appends lineage and availability changes without mutating immutable event evidence or prior artifact content
- [ ] CHK-009 [P1] Effective seat count, reliability, correlation, influence, and stance-change fields are derived from retained evidence and never guessed from nominal seat count
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Replaying one ordered typed event sequence twice yields identical deliberation/convergence state, independence and stance state, artifact index, per-mode status, plural outcome, canonical serialization, and projection fingerprint
- [ ] CHK-011 [P0] Empty, isolated-only, critique-complete, duplicate, late-evidence, supersession, and mixed-round fixtures produce deterministic results without silently dropping evidence
- [ ] CHK-012 [P0] Council-worthiness admission, required seat/evidence coverage, hard vetoes, unresolved dissent, control-arm obligations, calibration support, and counterfactual requirements block convergence when the shared contract requires them
- [ ] CHK-013 [P0] Unknown event versions, sequence gaps, invalid fingerprints, impossible transitions, duplicate terminal decisions, unsupported calibration, missing artifact references, counterfactual instability, and projection-version mismatch fail closed with an explicit blocked/error result
- [ ] CHK-014 [P0] Independence fixtures retain raw error vectors, calibration fingerprints, residual-correlation inputs, effective seats, and marginal gain evidence; correlated nominal replicas cannot satisfy an independent-council requirement
- [ ] CHK-015 [P0] Stance fixtures retain immutable claim IDs, evidence IDs, revision causes, flip-to-evidence and flip-to-majority measures, minority lineage, and unsupported-majority-flip evidence
- [ ] CHK-016 [P0] Artifact index entries retain stable logical identity, producer event, target/round identity, content digest, artifact kind, availability, and supersession lineage
- [ ] CHK-017 [P0] Per-mode status is derived only from valid typed transitions and exposes replay position, contract versions, admission reason, projection health, blocking reason, shadow state, mode-gate state, and terminal status
- [ ] CHK-018 [P0] Plural outcome projection preserves factual posterior, blinded plan posterior, debate escalation, or value disagreement with ties, vetoes, minority evidence, unresolved values, control-arm deltas, and reopen conditions
- [ ] CHK-019 [P0] Two-of-three agreement, rising agreement, or a weighted scalar cannot rescue deterministic hard failures, erase minority evidence, or authorize a terminal outcome without required witnesses
- [ ] CHK-020 [P0] Shadow replay compares field-level state, independence, stance lineage, coverage, plural outcome, terminal decision, artifact references, and status transitions against legacy Deep AI Council without changing authority
- [ ] CHK-021 [P1] Fixture coverage includes reordered or missing input handling at the ledger boundary and proves the reducer never claims a valid partial replay
- [ ] CHK-022 [P1] Projection rebuild after a fingerprint or version mismatch is explicit and replay-based; no in-place repair mutates the event history
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] The event-to-projection matrix covers every Deep AI Council event consumed by the typed ledger and names an owner for every derived field
- [ ] CHK-024 [P1] The plan preserves the boundary with `003-sealed-artifacts`; indexing a reference is not treated as creating, sealing, or certifying the artifact
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-025 [P1] Private seat evidence, identity masks, calibration inputs, and counterfactual aliases remain scoped to their declared projection and cannot be exposed as scorer authority
- [ ] CHK-026 [P1] Generated candidates, critiques, or bias probes cannot confirm their own outcome without an independent typed verification or adjudication receipt
- [ ] CHK-027 [P2] Projection failure and blocked replay do not silently downgrade a council, bypass a hard veto, expose mutable judge state, or promote a non-authoritative result
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-028 [P2] The phase outcome, projection ownership, plural-outcome semantics, shared-contract reuse, and unresolved contract questions are reflected consistently in the packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-029 [P1] Runtime implementation and fixture changes, when authorized later, remain path-scoped to the reducer/projection concern and do not modify sibling phase contracts
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the pure-fold replay fingerprint is stable, deliberation,
independence, stance, artifact, status, and plural-outcome projections have field-level evidence, shadow parity is
green, minority lineage is preserved, counterfactual instability fails closed, and the typed ledger remains
non-authoritative.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms deterministic replay, fail-closed invalid input handling, evidence-conditioned
independence, immutable artifact indexing, plural outcome preservation, shared-contract reuse, and no authority change
outside the staged cutover phase.
<!-- /ANCHOR:sign-off -->
