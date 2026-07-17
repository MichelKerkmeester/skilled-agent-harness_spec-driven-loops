---
title: "Checklist: next-focus semantics (recommendations implementation phase 010 child 004)"
description: "Blocking verifier checklist for typed candidate semantics, deterministic selection, durable replay, compatibility, and additive-dark authority."
trigger_phrases:
  - "next-focus semantics checklist"
  - "deep-loop focus selection checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
    last_updated_at: "2026-07-15T15:30:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking verifier contract for deterministic next-focus replay"
    next_safe_action: "Run the candidate, tie-break, ledger, and replay fixtures at execution"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Next-Focus Semantics

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 007. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, scoring-policy
version, and source-snapshot fingerprint, records commands + exit codes + fixture counts, and fails on zero discovered
candidates unless the fixture explicitly proves the typed no-eligible outcome.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] BASE is pinned and the worktree is clean; ledger, transition-gateway, replay, projection-watermark, and current-focus seams are inventoried
- [ ] CHK-007 [P2] The candidate report records BASE SHA, candidate SHA, scoring-policy version, and source fixture fingerprint
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are scoped to next-focus semantics; adjacent community, contradiction, continuity, projection, and convergence ownership remains intact
- [ ] CHK-009 [P1] Candidate, signal, score, outcome, and ledger-event unions are exhaustive; no untyped prompt fallback or floating-point score accumulation remains
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Validate all three focus-candidate kinds and reject missing identity, region, directive, evidence, boundary, fingerprint, provenance, watermark, or signal fields
- [ ] CHK-002 [P0] Reject out-of-range basis points, mixed/stale watermarks, unsupported projection versions, and absent required evidence before scoring
- [ ] CHK-003 [P0] Golden vectors prove `coverageGapBps + contradictionUrgencyBps + (10000 - noveltyDecayBps)` and candidate-set fingerprints are byte-stable
- [ ] CHK-004 [P0] Permutation fixtures cover total score, contradiction urgency, coverage gap, novelty decay, and stable-ID tie-break tiers with input-order invariance
- [ ] CHK-013 [P0] Exact fingerprints, duplicate IDs, and materially similar directions preserve the shipped pivot rejection semantics and record explicit rejection reasons
- [ ] CHK-014 [P0] Selected-focus events contain decision identity, policy version, source watermark/fingerprint, previous focus, complete ranked frontier, winner, comparator trace, and evidence references
- [ ] CHK-015 [P0] Empty accepted frontiers record a typed no-eligible event and never synthesize a prompt focus
- [ ] CHK-016 [P0] Replay restores selected and no-eligible outcomes from ledger events without reading current projections or re-running prompt judgment
- [ ] CHK-017 [P0] Duplicate same-identity/same-payload appends are idempotent; same-identity/different-payload appends fail as conflicting replay
- [ ] CHK-018 [P0] Candidate-set fingerprint or scoring-policy drift is detected during replay and cannot silently change historical focus
- [ ] CHK-019 [P0] Existing `pivot-candidates` and `divergent-pivot` suites pass unchanged, including Council quorum, high-blocker veto, recursion, budget, resume, and artifact behavior
- [ ] CHK-020 [P0] Shadow comparison emits append-only parity evidence while authoritative current focus remains on the legacy/pivot path
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P1] Candidate derivation, scoring, selection, ledger recording, replay, typed no-eligible handling, and compatibility are all implemented and traced to REQ-001 through REQ-008
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P0] Every next-focus event passes transition authorization; out-of-boundary candidates and unauthorized focus writes fail closed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Runtime schemas document region kinds, basis-point meanings, policy versioning, tie-break order, ledger payload, replay behavior, and the dark-authority boundary
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Implementation lands in dependency-closed, path-scoped commits without modifying adjacent phase packets or research inputs
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the SHAs + policy/snapshot
fingerprints, deterministic selection and ledger replay are proven across the fixture matrix, existing divergent-pivot
behavior remains green, and the additive-dark gate confirms that authoritative focus did not move.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
