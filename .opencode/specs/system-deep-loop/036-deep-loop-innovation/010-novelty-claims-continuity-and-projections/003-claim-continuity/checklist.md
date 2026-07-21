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
    last_updated_at: "2026-07-21T09:10:00Z"
    last_updated_by: "codex"
    recent_action: "Passed the blocking claim identity, lifecycle, replay, resume, and dark-boundary checks"
    next_safe_action: "Retain the evidence in implementation-summary.md for independent verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/claim-continuity.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Claim Continuity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 010 child 003. The 2026-07-21 verifier run discovered and passed 18
fixtures, pinned the runtime and fixture SHA-256 values, and recorded command exits in `implementation-summary.md`. Zero
discovered fixtures, silent ambiguity resolution, unexpected leaf mutation, or any legacy-authority change still fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The phase-006 ledger/replay and phase-007 continuity identity contracts are pinned to exact versions [evidence: `implementation-summary.md` exact SHA-256 table]
- [x] CHK-002 [P0] Sibling-001 semantic candidate and sibling-002 contradiction/supersession fixture interfaces are recorded without creating a sibling hard dependency [evidence: `implementation-summary.md` sibling read-contract decision]
- [x] CHK-003 [P1] Claim namespaces, aliases, fingerprints, match policy, lifecycle/status tables, resume schema, fixture corpus, and legacy baseline are frozen [evidence: `spec.md` frozen implementation values]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Changes stay inside the claim-continuity contract; no adjacent semantic-community, event-vocabulary, projection-plumbing, convergence, or authority work is absorbed [evidence: `implementation-summary.md` files changed]
- [x] CHK-005 [P1] Claim ID, community ID, event ID, evidence ID, attempt ID, and legacy aliases remain distinct typed values with fail-closed validation [evidence: `implementation-summary.md` REQ-001 evidence]
- [x] CHK-006 [P1] Reducers are deterministic and side-effect free; derived status is never accepted from an unverified mutable field [evidence: `implementation-summary.md` REQ-006/010 evidence]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Retry, crash-after-append, and concurrent equivalent-mint fixtures produce one accepted phase-007 `claim` ID or an explicit conflict [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] CHK-008 [P0] Reorder, iteration, path, wording, timestamp, content-hash, representative, and mode-boundary changes do not alter an existing claim ID [evidence: `implementation-summary.md` REQ-001/003 evidence]
- [x] CHK-009 [P0] Exact aliases and normalized fingerprints reuse the expected claim and record the namespaced match provenance; the no-semantic-candidate exact-fingerprint branch keeps identity count at one [evidence: `implementation-summary.md` REQ-003 evidence]
- [x] CHK-010 [P0] Paraphrase candidates reuse one claim while semantically adjacent distinct claims remain separate at the frozen policy version [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] CHK-011 [P0] Multiple candidates, weak similarity, cross-namespace collision, and community disagreement create unresolved matches with no guessed attachment or duplicate mint [evidence: `implementation-summary.md` REQ-004 evidence]
- [x] CHK-012 [P0] Multi-source support, qualifications, and duplicate-source observations attach to one ID while retaining provenance and independence metadata [evidence: `implementation-summary.md` REQ-007 evidence]
- [x] CHK-013 [P0] Contradiction preserves both claim histories, and supersession preserves the predecessor while linking a correctly identified successor [evidence: `implementation-summary.md` REQ-008 evidence]
- [x] CHK-014 [P0] Every allowed and forbidden lifecycle transition across `proposed`, `active`, `superseded`, and `retracted` matches the frozen table [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] CHK-015 [P0] `unassessed`, `supported`, `contested`, and `refuted` recompute from the authorized event prefix under the frozen precedence policy [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] CHK-016 [P0] Corrections and reversals append compensating events; a second correction to one target is rejected before append, does not advance the head, and leaves replay plus later unrelated writes healthy [evidence: `implementation-summary.md` REQ-006 evidence]
- [x] CHK-017 [P0] Incremental application and full replay yield identical claim records, lifecycle, status, provenance, relationships, cursors, and projection hashes [evidence: `implementation-summary.md` REQ-010 evidence]
- [x] CHK-018 [P0] Resume and handover at every fixture cursor restore the same claim IDs, unresolved work, reducer version, fingerprint, and projection hash [evidence: `implementation-summary.md` REQ-009 evidence]
- [x] CHK-019 [P0] Missing, stale, ambiguous, cross-namespace, and wrong-kind frontier references fail before new claim events are accepted [evidence: `implementation-summary.md` REQ-009 evidence]
- [x] CHK-020 [P0] Shadow comparison reports divergence while legacy readers, writers, claim/finding outputs, convergence decisions, and authority remain unchanged [evidence: `implementation-summary.md` REQ-011 evidence]
- [x] CHK-021 [P1] Replay and resume pin the initial v1 reducer/event adapter boundary and reject unregistered versions without rewriting stored events; no historical claim-continuity event version exists yet [evidence: `implementation-summary.md` known limitation 1]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-022 [P1] Every REQ-001 through REQ-011 row maps to at least one discovered fixture and a recorded verifier result [evidence: `implementation-summary.md` requirement evidence]
- [x] CHK-023 [P1] Every prepared mint, match, observation, evidence, lifecycle, adjudication, and correction event is folded through the domain reducer before authorization and append [evidence: `implementation-summary.md` pre-append domain gate decision]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P1] Namespaces and typed references prevent cross-packet or cross-mode alias capture, and malformed or unauthorized claim events fail closed [evidence: `implementation-summary.md` REQ-001/004 evidence]
- [x] CHK-025 [P2] Raw claim/evidence provenance follows existing retention and redaction boundaries; projection telemetry adds no new sensitive payload copies
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-026 [P2] The implemented match policy, lifecycle table, status precedence, resume frontier, and observed limitations are reflected in the phase docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P1] Runtime, fixtures, and generated evidence are dependency-closed and path-scoped; verifier runs leave no unexpected mutation in this leaf's allowed paths [evidence: `implementation-summary.md` files changed]
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
legacy-authority invariance, strict spec validation, and no unexpected mutation in the leaf's allowed paths after verification.
<!-- /ANCHOR:sign-off -->
