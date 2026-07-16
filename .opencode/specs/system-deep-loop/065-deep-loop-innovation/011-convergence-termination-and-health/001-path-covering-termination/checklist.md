---
title: "Checklist: path-covering termination"
description: "Blocking verification checklist for mode-profiled path coverage, fail-closed termination, partial-coverage reporting, replay determinism, and shadow safety."
trigger_phrases:
  - "path-covering termination checklist"
  - "coverage certificate checklist"
  - "deep-loop phase 011 child 001 checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
    last_updated_at: "2026-07-15T15:19:24Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking verifier contract for path-covering termination"
    next_safe_action: "Run mode fixtures against complete, partial, blocked, and exhausted paths"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-001 [P0] The supported mode inventory, profile owners, phase-010 projection inputs, and legacy shadow baselines are frozen
- [ ] CHK-002 [P1] Complete, partial, blocked, excluded, late-expanding, paraphrase-heavy, contradiction-heavy, empty, replay, and limit-exhausted fixtures are versioned
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The evaluator is a pure function over explicit versioned inputs; reducers retain evidence and transition provenance
- [ ] CHK-004 [P1] Changes stay additive and scoped to path-covering termination; no sibling stopping-clock, cycle, allocation, or health logic is absorbed
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every supported mode compiles a deterministic universe; unknown, incomplete, or invalid profiles fail closed
- [ ] CHK-006 [P0] Full mandatory coverage with fresh projections, resolved critical contradictions, and zero blockers is the only state that yields `STOP_ALLOWED`
- [ ] CHK-007 [P0] Every mandatory gap, stale/ambiguous projection, critical contradiction, unauthorized exclusion, or STOP blocker prevents `STOP_ALLOWED`
- [ ] CHK-008 [P0] Iteration, time, and budget exhaustion below complete coverage yields `INCOMPLETE_LIMIT`, never convergence
- [ ] CHK-009 [P0] Incremental reduction and full replay produce identical path IDs, denominators, states, decisions, and certificate hashes
- [ ] CHK-010 [P0] Paraphrases within one committed semantic community close one concept path; distinct communities remain distinct and evidence-only growth remains visible
- [ ] CHK-011 [P0] Late major-region discovery and community/projection version drift supersede stale universes and stop certificates
- [ ] CHK-012 [P0] Complete and partial certificates expose ratios, the full denominator, open/blocked path IDs, required evidence, contradiction IDs, exclusions, versions, and replay fingerprint
- [ ] CHK-013 [P1] Ranked uncovered paths are deterministic and weighting never overrides an uncovered mandatory path
- [ ] CHK-014 [P1] Shadow comparisons preserve legacy authority, existing bridge fields, and a classified record for every old/new decision disagreement
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-015 [P1] The implementation manifest maps every requirement and supported mode profile to code, fixtures, and verification evidence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-016 [P1] Coverage exclusions require explicit authorized provenance; untrusted input cannot shrink the denominator or suppress a STOP blocker
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-017 [P2] Mode-profile fields, path states, outcome precedence, certificate schema, and partial-report semantics are documented with versioning rules
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-018 [P1] Runtime, fixture, and packet changes remain path-scoped; verification leaves no unexpected tracked mutation
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
