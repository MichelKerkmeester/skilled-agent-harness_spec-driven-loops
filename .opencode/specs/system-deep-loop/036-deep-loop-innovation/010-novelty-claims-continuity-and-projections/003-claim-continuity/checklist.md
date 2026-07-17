---
title: "Checklist: claim continuity"
description: "Blocking verification checklist for stable claim identity, lifecycle status folding, replay parity, and resume continuity in phase 010 child 003."
trigger_phrases:
  - "claim continuity checklist"
  - "stable claim lifecycle checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity"
    last_updated_at: "2026-07-15T15:08:14Z"
    last_updated_by: "codex"
    recent_action: "Defined blocking checks for claim identity, lifecycle, replay, and resume continuity"
    next_safe_action: "Run the claim continuity fixtures and record exact-SHA evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Claim Continuity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 010 child 003. Every item remains pending while the phase is Planned.
At implementation time, the verifier pins the candidate SHA, substrate contract versions, match/reducer policy versions, fixture
corpus hash, replay fingerprint, commands, exit codes, case counts, and projection hashes. Zero discovered fixtures, silent
ambiguity resolution, unexpected tracked mutation, or any legacy-authority change fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-006 ledger/replay and phase-007 continuity identity contracts are pinned to exact versions
- [ ] CHK-002 [P0] Sibling-001 semantic candidate and sibling-002 contradiction/supersession fixture interfaces are recorded without creating a sibling hard dependency
- [ ] CHK-003 [P1] Claim namespaces, aliases, fingerprints, match policy, lifecycle/status tables, resume schema, fixture corpus, and legacy baseline are frozen
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes stay inside the claim-continuity contract; no adjacent semantic-community, event-vocabulary, projection-plumbing, convergence, or authority work is absorbed
- [ ] CHK-005 [P1] Claim ID, community ID, event ID, evidence ID, attempt ID, and legacy aliases remain distinct typed values with fail-closed validation
- [ ] CHK-006 [P1] Reducers are deterministic and side-effect free; derived status is never accepted from an unverified mutable field
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Retry, crash-after-append, and concurrent equivalent-mint fixtures produce one accepted phase-007 `claim` ID or an explicit conflict
- [ ] CHK-008 [P0] Reorder, iteration, path, wording, timestamp, content-hash, representative, and mode-boundary changes do not alter an existing claim ID
- [ ] CHK-009 [P0] Exact aliases and normalized fingerprints reuse the expected claim and record the namespaced match provenance
- [ ] CHK-010 [P0] Paraphrase candidates reuse one claim while semantically adjacent distinct claims remain separate at the frozen policy version
- [ ] CHK-011 [P0] Multiple candidates, weak similarity, cross-namespace collision, and community disagreement create unresolved matches with no guessed attachment or duplicate mint
- [ ] CHK-012 [P0] Multi-source support, qualifications, and duplicate-source observations attach to one ID while retaining provenance and independence metadata
- [ ] CHK-013 [P0] Contradiction preserves both claim histories, and supersession preserves the predecessor while linking a correctly identified successor
- [ ] CHK-014 [P0] Every allowed and forbidden lifecycle transition across `proposed`, `active`, `superseded`, and `retracted` matches the frozen table
- [ ] CHK-015 [P0] `unassessed`, `supported`, `contested`, and `refuted` recompute from the authorized event prefix under the frozen precedence policy
- [ ] CHK-016 [P0] Corrections and reversals append compensating events; no historical support, contradiction, adjudication, or status input is overwritten or deleted
- [ ] CHK-017 [P0] Incremental application and full replay yield identical claim records, lifecycle, status, provenance, relationships, cursors, and projection hashes
- [ ] CHK-018 [P0] Resume and handover at every fixture cursor restore the same claim IDs, unresolved work, reducer version, fingerprint, and projection hash
- [ ] CHK-019 [P0] Missing, stale, ambiguous, cross-namespace, and wrong-kind frontier references fail before new claim events are accepted
- [ ] CHK-020 [P0] Shadow comparison reports divergence while legacy readers, writers, claim/finding outputs, convergence decisions, and authority remain unchanged
- [ ] CHK-021 [P1] Replay and resume fixtures cover mixed reducer/event versions through the declared adapter boundary without silently rewriting old events
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P1] Every REQ-001 through REQ-011 row maps to at least one discovered fixture and a recorded verifier result
- [ ] CHK-023 [P1] The reviewed claim-event manifest includes every mint, match, observation, evidence, relationship, correction, lifecycle, and resume input consumed by the fold
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P1] Namespaces and typed references prevent cross-packet or cross-mode alias capture, and malformed or unauthorized claim events fail closed
- [ ] CHK-025 [P2] Raw claim/evidence provenance follows existing retention and redaction boundaries; projection telemetry adds no new sensitive payload copies
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-026 [P2] The implemented match policy, lifecycle table, status precedence, resume frontier, and observed limitations are reflected in the phase docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-027 [P1] Runtime, fixtures, and generated evidence land in dependency-closed, path-scoped commits; verifier runs leave no unexpected tracked mutation
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, each REQ-001 through REQ-011 row has exact-SHA evidence, identity minting and
matching never fragment or collapse claims silently, incremental/replay/resume hashes agree, and the additive dark path produces
observable shadow results without moving legacy authority or convergence behavior.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier confirms the pinned contract and fixture versions, all P0 outcomes, replay/resume parity,
legacy-authority invariance, strict spec validation, and a clean tracked state after verification.
<!-- /ANCHOR:sign-off -->
