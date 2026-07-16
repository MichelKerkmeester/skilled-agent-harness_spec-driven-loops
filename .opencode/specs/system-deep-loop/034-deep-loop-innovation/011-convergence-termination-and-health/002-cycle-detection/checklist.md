---
title: "Checklist: cycle detection"
description: "Blocking verification contract for deterministic cycle detection, material-progress gating, replay-safe health events, and non-authoritative stopping-clock contribution."
trigger_phrases:
  - "cycle detection checklist"
  - "deep-loop cycle verifier contract"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
    last_updated_at: "2026-07-15T15:19:57Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking verifier contract for cycle detection and clock handoff"
    next_safe_action: "Run pinned cycle, progress, replay, and authority-isolation fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Cycle Detection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 011 child 002. Every item remains pending while the phase is
Planned. Execution evidence must pin the candidate and baseline SHAs, detector/reducer/policy versions, ledger fixture
fingerprints, commands with exit codes, observation counts, cycle traces, and legacy-authority comparison; zero discovered
fixtures, incomplete periods, or unexpected tracked mutation fail the report.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The authorized ledger boundary and phase-009 completed-iteration identity are pinned with monotonic cursor semantics
- [ ] CHK-002 [P0] Claim-continuity and next-focus projection contracts are pinned to versions that expose stable typed identities and one source watermark
- [ ] CHK-003 [P1] The detector policy records history window 12, max period 4, minimum traversals 3, repetition window 8, occurrence threshold 3, and a versioned progress floor
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Canonical serialization excludes presentation text, timestamps, and collection order while including schema, reducer, and detector-policy versions
- [ ] CHK-005 [P0] Unknown versions, mixed watermarks, non-monotonic cursors, and conflicting stored fingerprints fail closed before cycle comparison
- [ ] CHK-006 [P1] History remains bounded and rebuildable; no detector path mutates claims, focus decisions, progress evidence, or prior ledger events
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Period-one fixed-point fixtures do not confirm before the third identical observation and confirm at the third with exact cursor evidence
- [ ] CHK-008 [P0] Period-two, period-three, and period-four fixtures do not confirm before three complete traversals and report the same period under replay
- [ ] CHK-009 [P0] The same focus or claim-frontier fingerprint appearing three times within eight observations emits suspicion only when no qualifying progress occurred
- [ ] CHK-010 [P0] Independent evidence, material claim mint/transition, contradiction or blocker resolution, and sufficient coverage gain each break or clear a candidate cycle
- [ ] CHK-011 [P0] Repeated prompt wording with different typed focus/claim state does not create a false cycle; paraphrased wording with the same stable identities cannot hide one
- [ ] CHK-012 [P0] Incremental folding, crash/retry, resume, and full replay produce identical observations, evictions, history hash, health events, and cycle trace
- [ ] CHK-013 [P0] Insufficient history, missing progress data, history gaps, stale watermarks, incomplete periods, and reducer drift return typed unknown/errors rather than `no_cycle`
- [ ] CHK-014 [P0] Suspected, confirmed, and cleared events pass transition authorization, are idempotent for identical payloads, and reject conflicting identity reuse
- [ ] CHK-015 [P0] A confirmed cycle reaches the sibling stopping-clock projection, while direct `STOP_ALLOWED` authority from the detector is rejected
- [ ] CHK-016 [P0] Shadow execution records cycle output without changing the shipped council convergence decision, snapshot, bridge payload, or current authority path
- [ ] CHK-017 [P1] Input reordering and supported-platform execution preserve canonical fingerprints and detector decisions byte-for-byte
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-018 [P1] Every spec requirement maps to at least one named fixture and every detector branch has success, boundary, and fail-closed coverage
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-019 [P1] Cycle events use the transition-authorization gateway, reject cross-run/cross-namespace references, and expose no new authority or side-effect path
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-020 [P1] Implementation evidence cites phase-010 claim continuity and next-focus specs, `convergence.cjs`, and `manifest/phase-tree.json`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-021 [P1] Detector, projection, policy, fixtures, and stopping-clock adapter follow the phase-approved write set with no adjacent cleanup
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, P1 items pass or carry an approved deferral, period-one-to-four and
productive-revisitation fixtures are green, replay is deterministic, malformed history fails closed, and confirmed cycle
health reaches the clock boundary without changing legacy stop authority. The report must bind all evidence to exact SHAs,
policy versions, ledger fingerprints, fixture counts, commands, and exit codes.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier confirms the P0 contract, strict spec validation is green, all discovered cycle fixtures
executed, the legacy-authority comparison is unchanged, and verification leaves no unexpected tracked mutation.
<!-- /ANCHOR:sign-off -->
