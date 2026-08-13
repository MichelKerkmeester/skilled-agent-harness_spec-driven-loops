---
title: "Checklist: path-covering termination"
description: "Blocking verification checklist for mode-profiled path coverage, fail-closed termination, partial-coverage reporting, replay determinism, and shadow safety."
trigger_phrases:
  - "path-covering termination checklist"
  - "coverage certificate checklist"
  - "deep-loop phase 011 child 001 checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
    last_updated_at: "2026-07-21T12:31:00Z"
    last_updated_by: "codex"
    recent_action: "Verified projection-content trust boundaries"
    next_safe_action: "Retain additive-dark authority until the staged cutover"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Path-Covering Termination

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 011 child 001. The verifier binds every result to the candidate SHA,
mode-profile version, input fingerprint, phase-010 projection versions, ledger position, and replay fingerprint. It records commands,
exit codes, fixture counts, decision traces, and certificate hashes; zero discovered modes/fixtures or unexpected tracked mutation fails.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Seven supported modes, phase-010 projection inputs, and the legacy shadow bridge are frozen in code and fixtures [EVIDENCE: `profiles.ts`, `universe.ts`, and the shadow fixture bind these surfaces.]
- [x] CHK-002 [P1] Complete, partial, blocked, excluded, late-expanding, paraphrase-heavy, contradiction-heavy, empty, replay, and limit-exhausted fixtures are versioned [EVIDENCE: `path-coverage-termination.vitest.ts` covers the full named matrix.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] The evaluator is a pure function over explicit versioned inputs; reducers retain evidence and transition provenance [EVIDENCE: `evaluator.ts` accepts only explicit inputs and `reducer.ts` records every state transition with ledger provenance.]
- [x] CHK-004 [P1] Changes stay additive and scoped to path-covering termination; no sibling stopping-clock, cycle, allocation, or health logic is absorbed [EVIDENCE: path-filtered diff review contains only this module, test, and packet docs.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] Every supported mode compiles a deterministic universe; unknown, incomplete, or invalid profiles fail closed [EVIDENCE: Vitest passes all seven profile fixtures plus registry and empty-universe rejection fixtures.]
- [x] CHK-006 [P0] Full mandatory coverage with fresh projections, resolved critical contradictions, and zero blockers is the only state that yields `STOP_ALLOWED` [EVIDENCE: the complete row for each profile is the only per-mode fixture that permits stop.]
- [x] CHK-007 [P0] Every mandatory gap, stale/ambiguous projection, unsupported path-projection schema, invalid locator, forged exclusion, critical contradiction, or STOP blocker prevents `STOP_ALLOWED` [EVIDENCE: dedicated adversarial fixtures recompute hashes after stale-flag, ledger-locator, semantic-version, coverage-graph-version, exclusion, and denominator tampering; every evaluator case returns `STOP_BLOCKED`.]
- [x] CHK-008 [P0] Iteration, time, and budget exhaustion below complete coverage yields `INCOMPLETE_LIMIT`, never convergence [EVIDENCE: 21 per-mode limit rows assert `INCOMPLETE_LIMIT` with one uncovered path, and the full-coverage limit fixture remains `STOP_ALLOWED`.]
- [x] CHK-009 [P0] Ordered event reduction and full replay produce identical path IDs, denominators, states, decisions, and certificate hashes [EVIDENCE: Vitest proves forward and reversed event inputs produce identical projection and certificate hashes for each mode.]
- [x] CHK-010 [P0] Paraphrases within one committed semantic community close one concept path; distinct communities remain distinct and evidence-only growth remains visible [EVIDENCE: the Vitest paraphrase-heavy fixture asserts one community path and a separate semantic-evidence-growth record.]
- [x] CHK-011 [P0] Late major-region discovery and community/projection version drift supersede stale universes and stop certificates [EVIDENCE: `path-coverage-termination.vitest.ts:576` and the symmetric stale-flag mismatch fixtures invalidate or block stale evaluation.]
- [x] CHK-012 [P0] Complete and partial certificates expose ratios, the full denominator, open/blocked path IDs, required evidence, contradiction IDs, exclusions, versions, limit identity, and replay fingerprint [EVIDENCE: Vitest certificate and partial-report assertions cover these fields across per-mode rows.]
- [x] CHK-013 [P1] Ranked uncovered paths are deterministic and weighting never overrides an uncovered mandatory path [EVIDENCE: `path-coverage-termination.vitest.ts:909` asserts blocked-first then weight-descending order and ranks 1 through 3; the high-coverage mandatory gap remains open.]
- [x] CHK-014 [P1] Shadow comparisons preserve legacy authority, existing bridge fields, and a classified record for every old/new decision disagreement [EVIDENCE: the shadow fixture preserves the legacy object and decision while setting `path_coverage_disagrees`.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-015 [P1] `implementation-summary.md` maps runtime surfaces and verification evidence to the complete profile and fixture matrix [EVIDENCE: its files and verification sections enumerate all runtime files and fixture classes.]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-016 [P0] Coverage exclusions require exact verified authorization-audit provenance; path closure requires locators grounded to the frozen ledger or an exact universe-bound projection/schema version, and denominator or STOP-blocker state is independently re-derived [EVIDENCE: `reducer.ts` and `evaluator.ts` reject forged coverage-graph versions, exclusion references are matched to verified audit entries, and `universe.ts` reconstructs the cartesian path set.]
- [x] CHK-019 [P0] No verdict-impacting field copied from `PathCoverageProjection` is accepted solely because `projectionHash` is self-consistent; `eventId` and `rowId` content dereferencing remains outside the evaluator's head-and-version input boundary [EVIDENCE: the trusted-field audit and recomputed-hash fixtures cover locator bindings, exclusion authority, stale-universe state, and denominator completeness, including a forged coverage-graph binding and a one-locator swap.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-017 [P2] Mode-profile fields, path states, outcome precedence, certificate schema, and partial-report semantics are documented with versioning rules [EVIDENCE: `types.ts`, `profiles.ts`, and `implementation-summary.md` record the versioned behavior.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-018 [P1] The path-filtered delta contains only the new runtime module, its unit suite, and this leaf's documentation [EVIDENCE: the final path-filtered `git status --short` audit enumerates only those allowed paths.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0/P1 check passes, every supported mode and mandatory-region fixture is discovered, replay and
incremental certificate hashes match, resource exhaustion remains visibly incomplete, shadow authority remains legacy, and all
validate/build/typecheck/test gates are green on the candidate SHA.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the full path-coverage truth table, replay-stable certificates, partial-report completeness,
and additive shadow posture, with no zero-fixture success and no unexpected tracked mutation.
<!-- /ANCHOR:sign-off -->
