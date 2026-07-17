---
title: "Checklist: Health & Degeneration Harness"
description: "Checklist for phase 008 of the convergence-termination-and-health program: blocking verification of generic health signals, degeneration detection, bounded action requests, and additive-dark behavior."
trigger_phrases:
  - "health and degeneration harness checklist"
  - "deep-loop health signal checklist"
  - "mode collapse detector verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
    last_updated_at: "2026-07-15T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Created the blocking verification contract for cross-mode health safety"
    next_safe_action: "Run the fixture matrix after implementation and record replay evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Health & Degeneration Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 008. The verifier runs every item against a pinned candidate and
BASE, records commands, exit codes, fixture IDs, policy/adapter digests, ledger/projection watermarks, replay hashes, signal
counts, action-request counts, and legacy-parity results. It fails on a positive health verdict from missing data, duplicate
signal identity, unauthorized action, zero fixtures, or unexpected tracked mutation. Shadow output is evidence only until a
later authority-cutover phase explicitly changes that posture.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] The pinned BASE, clean worktree, and path-scoped implementation surface are recorded in the candidate report
- [ ] CHK-007 [P2] The source-schema and policy digests for the authorized ledger, phase-010 gauges, sibling 002 events, and mode adapters are recorded
- [ ] CHK-008 [P0] Every registered mode has an adapter row naming required novelty, evidence, coverage, quality, frontier, and typed cost/yield inputs
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-009 [P1] Changes are scoped to the health harness and its declared shadow integration; no adjacent convergence, gauge, budget, fan-in, or mode cleanup is included
- [ ] CHK-010 [P1] No detector duplicates sibling 002 cycle detection or redefines phase-010 gauge arithmetic, projection ownership, or event identity
- [ ] CHK-011 [P2] Policy, adapter, reducer, and evaluator provenance is explicit; no hidden wall-clock, output-count, text-only, or provider-count health input is used
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Genesis and watermark replay produce identical `HealthObservation` hashes, source cursors, projection watermarks, signal IDs, and aggregate state
- [ ] CHK-002 [P0] Healthy progress and productive revisitation fixtures remain healthy and do not confirm collapse, starvation, or repetition
- [ ] CHK-003 [P0] Mode-collapse fixtures meet concentration plus progress-floor evidence; text similarity without typed progress evidence does not confirm collapse
- [ ] CHK-004 [P0] Sibling 002 fixed-point and period-two-to-four fixtures preserve `cycle_suspected`, `cycle_confirmed`, `cycle_cleared`, fingerprints, periods, progress, and policy provenance without duplicate detection
- [ ] CHK-005 [P0] Novelty-starvation fixtures distinguish low yield with eligible work from exhausted, empty, and unknown frontiers
- [ ] CHK-012 [P0] Quality-decay fixtures cross the versioned lower-confidence threshold only with comparable normalized values and matching evaluator/rubric/verifier provenance
- [ ] CHK-013 [P0] Budget-thrash fixtures detect typed retry/cancel/reallocation pressure plus low realized yield without classifying budget exhaustion as convergence
- [ ] CHK-014 [P0] Threshold-boundary fixtures verify the eight-observation window, minimum sample count, concentration floor, quality delta, thrash ratio, and policy digest
- [ ] CHK-015 [P0] Missing gauges, stale watermarks, sequence gaps, conflicting hashes, unknown versions, mixed baselines, and non-monotonic cursors emit `telemetry_gap`/`not_evaluable` or typed errors, never `healthy`
- [ ] CHK-016 [P0] Simultaneous signals preserve individual evidence and produce deterministic aggregate severity under reordered input
- [ ] CHK-017 [P0] Two healthy windows clear active state; clear events are append-only and prior signal/observation history remains unchanged
- [ ] CHK-018 [P0] Duplicate boundary delivery creates one observation, one signal identity, one aggregate transition, and one action request at most
- [ ] CHK-019 [P0] Pause, re-seed, quarantine, repair, and stop requests remain non-authoritative until accepted by the transition gateway, typed budget, safe-point, or stopping-clock contract
- [ ] CHK-020 [P1] Re-seed requests identify a durable uncovered path, unresolved claim/contradiction, or authorized region and never erase lineage or synthesize a text-only focus
- [ ] CHK-021 [P1] Bounded history, active-state, trace, cooldown, and deduplication projections remain within declared retention/size limits
- [ ] CHK-022 [P0] Shadow parity proves legacy stop, fan-in, allocation, budget, and dispatch outputs are unchanged for healthy and degenerate fixtures
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] The implementation and verifier manifest covers every signal, adapter input, action request, and source contract in spec.md
- [ ] CHK-024 [P1] Every mode adapter reports an explicit unavailable/optional/required status and no unsupported adapter silently returns healthy
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-025 [P1] Unauthorized health requests cannot dispatch, cancel, stop, bypass budget admission, mutate claims, or rewrite ledger/projection history
- [ ] CHK-026 [P2] Signal and action evidence excludes secrets and preserves only declared provenance, hashes, cursors, and bounded trace data
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P1] The phase outcome and shadow-only authority posture are reflected in spec.md, plan.md, tasks.md, and the verifier report
- [ ] CHK-028 [P2] Source traceability cites `002-cycle-detection/spec.md`, `005-transactional-projections-and-gauges/spec.md`, `research-modes.md`, and `manifest/phase-tree.json`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-029 [P1] Changes land in path-scoped commits on the pinned worktree branch and no generated metadata or unrelated repo file is hand-edited
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, every signal and action request has replayable evidence, missing data fails
closed, the legacy shadow-parity gate is green, bounded retention is proven, and the final candidate report cites the source
contracts plus the exact policy and adapter digests. A health signal is not a stop result; the verifier must show the
authorization and stopping-clock boundary remains intact.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the shadow integration reports no unauthorized behavior change, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
