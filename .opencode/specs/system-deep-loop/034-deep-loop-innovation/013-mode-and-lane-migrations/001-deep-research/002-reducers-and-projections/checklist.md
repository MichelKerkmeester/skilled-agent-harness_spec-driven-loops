---
title: "Checklist: Deep Research - Reducers & Projections"
description: "Blocking verification checklist for deterministic deep-research reducers, iteration/convergence state, artifact indexing, and per-mode status projections."
trigger_phrases:
  - "deep research reducers checklist"
  - "deep research projection verification"
  - "deep research replay determinism checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
    last_updated_at: "2026-07-15T17:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Specified blocking replay, projection, artifact, and status checks"
    next_safe_action: "Verify each checklist row against deterministic replay fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Research - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the deep-research reducer/projection phase. The verifier binds
each report to the candidate and base identities, typed event-schema digest, reducer version, fixture-set digest, and
projection fingerprint. It records commands, exit codes, fixture counts, rejected-event counts, full-versus-incremental
parity, and any `rebuild_required` or `blocked` result. Planned rows remain unchecked until implementation evidence exists.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The typed event schema, reducer input envelope, canonical ordering fields, and compatibility policy are frozen by `001-typed-ledger-schema`
- [ ] CHK-002 [P0] The reducer ownership matrix covers every projected field and event family with no duplicate owner
- [ ] CHK-003 [P1] Phase-012 mode-interface and phase-013 write-set evidence identify the reducer/projection resource boundary
- [ ] CHK-004 [P2] Legacy reducer and heartbeat outputs are captured as comparison fixtures without treating them as the new authority
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The fold is pure and has no filesystem, network, clock, randomness, model, seal, or ledger-append side effect
- [ ] CHK-006 [P0] Canonical ordering and tie-breakers use persisted logical identity and sequence fields only
- [ ] CHK-007 [P1] Raw observations, judgments, supersessions, retractions, contradiction obligations, and invalid states are never overwritten
- [ ] CHK-008 [P1] Projection fingerprint inputs include schema, reducer, codec, ordering, and normalized projection versions
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Identical event sequences produce byte-equivalent iteration/convergence state, artifact index, per-mode status, and projection fingerprint
- [ ] CHK-010 [P0] Independent event permutations and late arrivals do not alter finalized state or trusted evidence without a declared frontier event
- [ ] CHK-011 [P0] Duplicate event IDs, duplicate terminal events, malformed events, unknown required types, and impossible transitions fail closed
- [ ] CHK-012 [P0] Raw novelty is excluded from trusted convergence yield until evidence admission and independence rules mark the claim delta trusted
- [ ] CHK-013 [P0] Contradictions, falsification gaps, citation drift, query redundancy, health alarms, and lease exhaustion remain distinct convergence blockers
- [ ] CHK-014 [P0] Artifact digest mismatch, missing receipt, invalid reference, unavailable artifact, and supersession preserve explicit non-success states
- [ ] CHK-015 [P0] Incremental cursor folding equals clean full replay after checkpoint restart, rotation, duplicate events, late judgments, and supersession forks
- [ ] CHK-016 [P0] Schema, reducer, codec, ordering, cursor-gap, truncation, or projection-fingerprint drift returns `rebuild_required` or `blocked`
- [ ] CHK-017 [P1] The compatibility projection marks lossy mappings and cannot append a transition or authorize a cutover
- [ ] CHK-018 [P1] Fixture reports include event-schema digest, reducer version, fixture digest, projection fingerprint, counts, and exit codes
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-019 [P0] Every requirement in spec.md has a named fixture or verification command and no projection field is untested
- [ ] CHK-020 [P1] The reducer/projection output is consumable by `003-sealed-artifacts` without moving seal ownership into this phase
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-021 [P0] Retrieved instructions, poisoned evidence, unverified claims, and unknown effects cannot become trusted state through projection fallback
- [ ] CHK-022 [P1] No reducer output bypasses the transition-authorization boundary or exposes compatibility output as authority
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-023 [P1] Reducer ownership, projection fields, invalid-state semantics, replay fingerprint inputs, and rebuild rules are documented in the phase artifacts
- [ ] CHK-024 [P2] Research registry findings and local reducer baseline sources are cited in the implementation evidence
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-025 [P1] Changes remain inside the declared deep-research reducer/projection write set and do not modify schema, seal, gate, or authority owners
- [ ] CHK-026 [P1] Projection checkpoints and fixtures are versioned, reproducible, and excluded from canonical evidence mutation
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, the pure fold matches full replay under the fixture matrix, raw evidence
and versioned judgments remain reversible, artifact and status projections fail closed on missing or incompatible input,
and the exact projection fingerprint is recorded for the downstream sealed-artifact and mode-gate contracts. No check in
this phase authorizes production cutover; authority remains with the legacy path until phase 014.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms deterministic replay, incremental/full parity, explicit non-success states, and
the phase-scoped write set, with `validate.sh` and the reducer fixture gate green on the candidate identity.
<!-- /ANCHOR:sign-off -->
