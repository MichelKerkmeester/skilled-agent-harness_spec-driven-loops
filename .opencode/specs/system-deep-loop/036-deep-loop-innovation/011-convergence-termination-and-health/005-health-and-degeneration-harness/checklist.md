---
title: "Checklist: Health & Degeneration Harness"
description: "Checklist for phase 011 child 005 of the convergence-termination-and-health program: blocking verification of generic health signals, degeneration detection, bounded action requests, and additive-dark behavior."
trigger_phrases:
  - "health and degeneration harness checklist"
  - "deep-loop health signal checklist"
  - "mode collapse detector verification"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
    last_updated_at: "2026-07-21T12:01:05Z"
    last_updated_by: "codex"
    recent_action: "Verified scoped recovery and optional-field fail-closed behavior"
    next_safe_action: "Keep health requests dark until a shared gateway grants authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/health-degeneration-harness/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/health-degeneration-harness.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Health & Degeneration Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 011 child 005. The verifier runs every item against a pinned candidate and
BASE, records commands, exit codes, fixture IDs, policy/adapter digests, ledger/projection watermarks, replay hashes, signal
counts, action-request counts, and legacy-parity results. It fails on a positive health verdict from missing data, duplicate
signal identity, unauthorized action, zero fixtures, or unexpected tracked mutation. Shadow output is evidence only until a
later authority-cutover phase explicitly changes that posture.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] The pinned BASE, pre-existing worktree state, and path-scoped implementation surface are recorded in the candidate report [evidence: `implementation-summary.md`]
- [x] CHK-007 [P2] The source-schema and policy digests for the authorized ledger, phase-010 gauges, sibling 002 events, and mode adapters are recorded per observation and in the candidate report [evidence: `implementation-summary.md`]
- [x] CHK-008 [P0] Every registered mode has an adapter row naming required novelty, evidence, coverage, quality, frontier, and typed cost/yield inputs [evidence: health-degeneration-harness.vitest.ts]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-009 [P1] Changes are scoped to the health harness and its declared shadow integration; no adjacent convergence, gauge, budget, fan-in, or mode cleanup is included [evidence: `implementation-summary.md`]
- [x] CHK-010 [P1] No detector duplicates sibling 002 cycle detection or redefines phase-010 gauge arithmetic, projection ownership, or event identity [evidence: `implementation-summary.md`]
- [x] CHK-011 [P2] Policy, adapter, reducer, and evaluator provenance is explicit; no hidden wall-clock, output-count, text-only, or provider-count health input is used [evidence: health-degeneration-harness.vitest.ts]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] Genesis and watermark replay produce identical `HealthObservation` hashes, source cursors, projection watermarks, signal IDs, and aggregate state [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-002 [P0] Healthy progress and productive revisitation fixtures remain healthy and do not confirm collapse, starvation, or repetition [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-003 [P0] Mode-collapse fixtures meet concentration plus progress-floor evidence; text similarity without typed progress evidence does not confirm collapse [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-004 [P0] Sibling 002 fixed-point and period-two-to-four fixtures preserve `cycle_suspected`, `cycle_confirmed`, `cycle_cleared`, fingerprints, periods, progress, and policy provenance without duplicate detection [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-005 [P0] Novelty-starvation fixtures distinguish low yield with eligible work from exhausted, empty, and unknown frontiers [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-012 [P0] Quality-decay fixtures cross the versioned lower-confidence threshold only with comparable normalized values and matching evaluator/rubric/verifier provenance [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-013 [P0] Budget-thrash fixtures detect typed retry/cancel/reallocation pressure plus low realized yield without classifying budget exhaustion as convergence [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-014 [P0] Threshold-boundary fixtures verify the eight-observation window, minimum sample count, concentration floor, quality delta, thrash ratio, and policy digest [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-015 [P0] Missing gauges, absent optional telemetry for an active signal, stale watermarks, sequence gaps, conflicting hashes, unknown versions, mixed baselines, and non-monotonic cursors emit `telemetry_gap`/`not_evaluable` or typed errors, never `healthy` or recovery evidence [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-016 [P0] Simultaneous signals preserve individual evidence, while detector windows and aggregates remain isolated by the exact run/mode/lineage/region tuple under reordered or interleaved input [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-017 [P0] Per-scope recovery streaks advance only on present improvement evidence for each active signal dimension; two verified windows clear only that scope, and prior signal/observation history remains unchanged [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-018 [P0] Duplicate boundary delivery creates one observation, one signal identity, one aggregate transition, and one action request at most [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-019 [P0] Pause, re-seed, quarantine, repair, and stop requests remain non-authoritative until accepted by the transition gateway, typed budget, safe-point, or stopping-clock contract [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-020 [P1] Re-seed requests identify a durable uncovered path, unresolved claim/contradiction, or authorized region and never erase lineage or synthesize a text-only focus [evidence: `health-observation-projector.ts`]
- [x] CHK-021 [P1] Bounded history, active-state, trace, cooldown, and deduplication projections remain within declared retention/size limits [evidence: `health-policy.ts` and `health-observation-projector.ts`]
- [x] CHK-022 [P0] Shadow parity proves legacy stop, fan-in, allocation, budget, and dispatch outputs are unchanged for healthy and degenerate fixtures [evidence: health-degeneration-harness.vitest.ts]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-023 [P1] The implementation and verifier manifest covers every signal, adapter input, action request, and source contract in spec.md [evidence: `implementation-summary.md`]
- [x] CHK-024 [P1] Every mode adapter reports an explicit unavailable/optional/required status and no unsupported adapter silently returns healthy [evidence: health-degeneration-harness.vitest.ts]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-025 [P1] Unauthorized health requests cannot dispatch, cancel, stop, bypass budget admission, mutate claims, or rewrite ledger/projection history [evidence: health-degeneration-harness.vitest.ts]
- [x] CHK-026 [P2] Signal and action evidence excludes secrets and preserves only declared provenance, hashes, cursors, and bounded trace data [evidence: `health-harness-types.ts`]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-027 [P1] The phase outcome and shadow-only authority posture are reflected in spec.md, plan.md, tasks.md, and the verifier report [evidence: `implementation-summary.md`]
- [x] CHK-028 [P2] Source traceability cites `002-cycle-detection/spec.md`, `005-transactional-projections-and-gauges/spec.md`, `research-modes.md`, and `manifest/phase-tree.json` [evidence: `implementation-summary.md`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-029 [P1] Changes remain in the path-scoped leaf write set on the pinned worktree branch and no unrelated repo file is hand-edited [evidence: `implementation-summary.md`]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

All P0, P1, and P2 checks map to the 14-test leaf suite, compiler result, path-scope audit, and evidence table in
`implementation-summary.md`. Missing optional data cannot clear an active signal, interleaved lineages cannot share detector
windows or recovery state, replay and duplicate delivery are stable, healthy and degenerate shadow calls retain the legacy
result by identity, and every health response remains a request rather than a stop result.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off against repository baseline `012652b479dee08455de574574c5e7a8971a8b0b` when strict packet validation reports
zero errors and the path-scoped status contains only the harness module, its unit test, and this leaf's documents. The shared
worktree's unrelated pre-existing changes are excluded from this leaf's scope claim.
<!-- /ANCHOR:sign-off -->
