---
title: "Checklist: cycle detection"
description: "Blocking verification contract for deterministic cycle detection, material-progress gating, replay-safe health events, and non-authoritative stopping-clock contribution."
trigger_phrases:
  - "cycle detection checklist"
  - "deep-loop cycle verifier contract"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
    last_updated_at: "2026-07-21T11:31:40Z"
    last_updated_by: "codex"
    recent_action: "Verified starvation and watermark regressions"
    next_safe_action: "Keep cycle evidence dark until stopping-clock arbitration"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Cycle Detection

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] The authorized ledger boundary and completed-iteration identity are pinned with monotonic cursor semantics [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-002 [P0] Claim-continuity and next-focus projection contracts are pinned to versions that expose stable typed identities and one source watermark [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-003 [P1] The detector policy records history window 12, max period 4, minimum traversals 3, repetition window 8, occurrence threshold 3, and a versioned progress floor [evidence: validate.sh strict plus vitest 28 tests passed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Canonical serialization excludes presentation text, timestamps, and collection order while including schema, reducer, and detector-policy versions [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-005 [P0] Unknown versions, a null or mismatched required claim watermark, non-monotonic cursors, and conflicting stored fingerprints fail closed before cycle comparison [evidence: null returns `INVALID_INPUT`, mismatch returns `MIXED_WATERMARK`, and vitest 28 tests passed]
- [x] CHK-006 [P1] History remains bounded and rebuildable; no detector path mutates claims, focus decisions, progress evidence, or prior ledger events [evidence: validate.sh strict plus vitest 28 tests passed]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Period-one fixed-point fixtures do not confirm before the third identical observation and confirm at the third with exact cursor evidence [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-008 [P0] Period-two, period-three, and period-four fixtures do not confirm before three complete traversals and report the same period under replay [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-009 [P0] Every independently qualifying focus and claim-frontier repetition reports in deterministic order; the co-occurrence fixture proves neither kind is starved before its earliest match leaves the next window [evidence: both kinds reported and vitest 28 tests passed]
- [x] CHK-010 [P0] Independent evidence, material claim mint/transition, contradiction or blocker resolution, and sufficient net end-versus-start coverage gain each break or clear a candidate cycle; a transient peak does not [evidence: vitest 28 tests passed]
- [x] CHK-011 [P0] Repeated prompt wording with different typed focus/claim state does not create a false cycle; paraphrased wording with the same stable identities cannot hide one [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-012 [P0] Incremental folding, crash/retry, resume, and full replay produce identical observations, evictions, history hash, health events, and cycle trace [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-013 [P0] Insufficient history, missing progress data, history gaps, stale watermarks, incomplete periods, and reducer drift return typed unknown/errors rather than `no_cycle` [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-014 [P0] Suspected, confirmed, and cleared events pass transition authorization, are idempotent for identical payloads, and reject conflicting identity reuse [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-015 [P0] A confirmed cycle reaches the sibling stopping-clock projection, while direct `STOP_ALLOWED` authority from the detector is rejected [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-016 [P0] Shadow execution records cycle output without changing the opaque authoritative result, current authority path, or frozen convergence module [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] CHK-017 [P1] Input reordering and supported-platform execution preserve canonical fingerprints and detector decisions byte-for-byte [evidence: validate.sh strict plus vitest 28 tests passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-018 [P1] Every spec requirement maps to at least one named fixture and every detector branch has success, boundary, and fail-closed coverage [evidence: validate.sh strict plus vitest 28 tests passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-019 [P1] Cycle events use the transition-authorization gateway, reject cross-run/cross-namespace references, and expose no new authority or side-effect path [evidence: validate.sh strict plus vitest 28 tests passed]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-020 [P1] Implementation evidence cites claim continuity and next-focus specs, `convergence.cjs`, and `manifest/phase-tree.json` [evidence: validate.sh strict plus vitest 28 tests passed]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-021 [P1] Detector, projection, policy, fixtures, and stopping-clock adapter follow the approved write set with no adjacent cleanup [evidence: validate.sh strict plus vitest 28 tests passed]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

All P0 and P1 checks map to the 28-test leaf suite and the evidence table in `implementation-summary.md`. The implementation
is based on repository SHA `012652b479dee08455de574574c5e7a8971a8b0b`, detector policy
`cycle-detector-policy-v1`, and history reducer `cycle-history-reducer-v1`. Runtime and documentation changes remain
uncommitted in the scoped leaf write set.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

The dependency direction is one-way from frozen typed sources into the additive cycle module. No source module imports the
detector, and the shadow result retains the authoritative value by identity.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

All comparison work is bounded by 12 observations, four candidate periods, and an eight-observation repetition window.
No unbounded scan or model call exists in the replay path.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

The module is additive-dark and has no production activation or stop-authority path. Rollback is omission of the shadow call;
stored health evidence remains append-only.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

Canonical hashes exclude prompt/display text, health writes require transition authorization, and cross-run evidence is rejected.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

Spec, plan, tasks, checklist, decision record, implementation summary, description metadata, and graph metadata are included in
the strict leaf validation.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

Signed off when the blocking verifier confirms the P0 contract, strict spec validation is green, all discovered cycle fixtures
executed, the legacy-authority comparison is unchanged, and verification leaves no unexpected tracked mutation.
<!-- /ANCHOR:sign-off -->
