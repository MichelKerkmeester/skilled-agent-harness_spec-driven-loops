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
    last_updated_at: "2026-07-21T09:03:07Z"
    last_updated_by: "codex"
    recent_action: "Verified canonical rejection ordering and reordered retry idempotency"
    next_safe_action: "Retain the verifier receipts with the scoped implementation"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/next-focus/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/next-focus.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Next-Focus Semantics

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 010 child 004. Every item is a check the paired
verify agent runs BEFORE the scoped candidate delta lands; each SOL report pins the content fingerprint, BASE SHA, scoring-policy
version, and source-snapshot fingerprint, records commands + exit codes + fixture counts, and fails on zero discovered
candidates unless the fixture explicitly proves the typed no-eligible outcome.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] BASE is pinned and target paths were clean against the captured baseline; unrelated dirty paths were inventoried and preserved
  - [EVIDENCE: BASE `012652b479`; initial path-filtered status contained no next-focus target]
- [x] CHK-007 [P2] The verifier report records BASE SHA, scoped content fingerprint, scoring-policy version, and source fixture fingerprint
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] Changes are scoped to next-focus semantics; adjacent community, contradiction, continuity, projection, and convergence ownership remains intact
  - [EVIDENCE: final frozen-path `git diff --name-only` output is empty]
- [x] CHK-009 [P1] Candidate, signal, score, outcome, and ledger-event unions are exhaustive; no untyped prompt fallback or floating-point score accumulation remains
  - [EVIDENCE: runtime `tsc --noEmit` exit 0 and integer signal fixtures pass]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] Validate all three focus-candidate kinds and reject missing identity, region, directive, evidence, boundary, fingerprint, provenance, watermark, or signal fields
  - [EVIDENCE: leaf Vitest 18/18 includes per-kind and required-field-family fixtures]
- [x] CHK-002 [P0] Reject out-of-range basis points, mixed/stale watermarks, unsupported projection versions, and absent required evidence before scoring
  - [EVIDENCE: leaf Vitest 18/18 covers range, non-finite, mixed-snapshot, and required evidence]
- [x] CHK-003 [P0] Golden vectors prove `coverageGapBps + contradictionUrgencyBps + (10000 - noveltyDecayBps)` and candidate-set fingerprints are byte-stable
- [x] CHK-004 [P0] Permutation fixtures cover total score, contradiction urgency, coverage gap, novelty decay, and stable-ID tie-break tiers with input-order invariance
  - [EVIDENCE: leaf Vitest 18/18 covers five comparator branches and three enumerations]
- [x] CHK-013 [P0] Exact fingerprints, duplicate IDs, and materially similar directions preserve the shipped pivot rejection semantics and record explicit rejection reasons
  - [EVIDENCE: leaf parity matrix plus frozen pivot suite 4/4]
- [x] CHK-014 [P0] Selected-focus events contain decision identity, policy version, source watermark/fingerprint, previous focus, complete ranked frontier, winner, comparator trace, and evidence references
  - [EVIDENCE: leaf Vitest 18/18 includes the typed selected-event payload test]
- [x] CHK-015 [P0] Empty accepted frontiers record a typed no-eligible event and never synthesize a prompt focus
  - [EVIDENCE: leaf Vitest 18/18 includes unavailable selection and ledger replay tests]
- [x] CHK-016 [P0] Replay restores selected and no-eligible outcomes from ledger events without reading current projections or re-running prompt judgment
  - [EVIDENCE: leaf Vitest 18/18 proves stored focus wins over a changed live ranking]
- [x] CHK-017 [P0] Duplicate same-identity/same-payload appends are idempotent; same-identity/different-payload appends fail as conflicting replay
  - [EVIDENCE: two independently recomputed decisions with reversed invalid-candidate input order emit byte-identical payloads and one ledger frame; changed semantics raise `CONFLICTING_REPLAY`]
- [x] CHK-018 [P0] Candidate-set fingerprint or scoring-policy drift is detected during replay and cannot silently change historical focus
  - [EVIDENCE: fingerprint-drift fixture raises `REPLAY_INTEGRITY`]
- [x] CHK-019 [P0] Existing `pivot-candidates` and `divergent-pivot` suites pass unchanged, including Council quorum, high-blocker veto, recursion, budget, resume, and artifact behavior
- [x] CHK-020 [P0] Shadow comparison emits append-only parity evidence while authoritative current focus remains on the legacy/pivot path
  - [EVIDENCE: `legacy focus` remains unchanged; divergent-pivot suite 14/14]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 [P1] Candidate derivation, scoring, selection, ledger recording, replay, typed no-eligible handling, and compatibility are all implemented and traced to REQ-001 through REQ-008
  - [EVIDENCE: 18/18 leaf fixtures and implementation-summary.md trace all eight requirements]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-010 [P0] Every next-focus event passes transition authorization; out-of-boundary candidates and unauthorized focus writes fail closed
  - [EVIDENCE: leaf Vitest 18/18 authorizes selected and unavailable events before append]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-011 [P2] Runtime schemas document region kinds, basis-point meanings, policy versioning, tie-break order, ledger payload, replay behavior, and the dark-authority boundary
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-012 [P1] Implementation is a dependency-closed, path-scoped delta without modifying adjacent phase packets or research inputs
  - [EVIDENCE: `git status --short` path filter contains only approved target paths]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

| Check | Result | Evidence |
|-------|--------|----------|
| Decision recorded | PASS | ADR-001 is Accepted in `decision-record.md` |
| Frozen dependency direction | PASS | Frozen modules have no diff and do not import next-focus |
| Replay boundary | PASS | Stored event is validated without calling selection |
| Authority boundary | PASS | Public comparison accepts values, not a state writer |
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

The selector performs bounded in-memory validation, deduplication, scoring, and sorting over a caller-supplied frontier. This
leaf defines no latency target; determinism and bounded candidate input are the load-bearing non-functional requirements.
The leaf suite completes in under three seconds in the verifier environment.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

| Check | Result | Evidence |
|-------|--------|----------|
| Rollback | PASS | Remove new imports and files; no historical or authoritative state changes |
| Schema readability | PASS | Both event types are registered at version 1 |
| Cutover guard | PASS | No authority integration exists in this leaf |
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

| Check | Result | Evidence |
|-------|--------|----------|
| Scope lock | PASS | Frozen and sibling paths remain unchanged |
| Authorization | PASS | Domain append requires a durable gateway allow proof |
| Comment hygiene | PASS | New TypeScript files report zero hygiene violations |
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

Spec, plan, tasks, checklist, decision record, implementation summary, description, and graph metadata agree on Level 3,
Complete status, the scoring policy, the additive-dark boundary, and the verified file set.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:summary -->
## Verification Summary

| Evidence | Value |
|----------|-------|
| BASE SHA | `012652b479dee08455de574574c5e7a8971a8b0b` |
| Scoped code/test fingerprint | `f9863c122073ac9b78a52c2532191ab7b1435246b1919d13869da88dee74af77` |
| Scoring policy | `next-focus-equal-components-bps-v1` |
| Source fixture fingerprint | `14f717be7155fb2454cc8a7f50851747d055d59ed9423112f99b2b66fa83bf70` |
| Leaf suite | 18 deterministic candidate, selection, event, and replay fixtures |
| Compatibility suites | 4 pivot-candidate fixtures and 14 divergent-pivot fixtures |

The global worktree already contained unrelated tracked and untracked changes. Scope verification therefore uses the captured
baseline plus path-filtered status; the frozen pivot, divergent-pivot, event-envelope, authorized-ledger, and replay-fingerprint
paths have no leaf-authored diff.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

The verifier confirms every P0 item, all 36 compatibility and leaf fixtures, compiler exit 0, strict validation exit 0,
and no unexpected mutation in the approved target paths.
<!-- /ANCHOR:sign-off -->
