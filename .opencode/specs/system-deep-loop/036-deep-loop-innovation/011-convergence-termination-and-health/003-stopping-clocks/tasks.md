---
title: "Tasks: stopping clocks"
description: "Tasks for the planned independent stopping clocks, deterministic earliest-fire arbiter, per-mode profiles, and typed termination-cause event."
trigger_phrases:
  - "stopping clocks tasks"
  - "earliest-fire termination tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
    last_updated_at: "2026-07-15T15:24:30Z"
    last_updated_by: "codex"
    recent_action: "Defined implementation and verification tasks for all five clocks"
    next_safe_action: "Freeze source interfaces and implement the clock observation schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Stopping Clocks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin the baseline and freeze clock kinds, termination classes, event namespace, source-interface versions, evaluation boundaries, and the supported-mode inventory
- [ ] T002 Define the canonical `StoppingClockObservation`, `StoppingClockProfile`, clock-projection, and `LoopTerminationDeclared` schemas with replay identities
- [ ] T003 Build deterministic source fixtures for phase-007 budgets, phase-010 novelty, sibling-001 coverage, monotonic wall time, and sibling-002 cycles
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement profile validation and canonical serialization; reject missing clocks, unknown versions, mixed watermarks, invalid parameters, and non-monotonic elapsed time
- [ ] T005 Implement the budget clock adapter with exact governing scope, typed dimension, balances, reservation request, denial/exhaustion event, and reconciliation state
- [ ] T006 Implement the fixed-point novelty-decay tail over concept novelty and independent-evidence yield with versioned per-mode warm-up, decay, floors, window, and patience
- [ ] T007 Implement the coverage clock adapter; accept only a fresh sibling-001 `STOP_ALLOWED` certificate with no mandatory gaps, critical contradictions, or STOP blockers
- [ ] T008 Implement the independent monotonic wall-time clock and preserve separate deadline and budgeted-wall-time causes
- [ ] T009 Implement the cycle clock adapter; accept only a fresh confirmed sibling-002 event meeting mode severity and persistence policy
- [ ] T010 Implement deterministic earliest-fire arbitration by elapsed time, ledger cursor, and same-batch rank; retain all co-firing causes and comparator evidence
- [ ] T011 Implement idempotent terminal-event writing through transition authorization and reject conflicting replay payloads
- [ ] T012 Gate new dispatch after firing and link already-authorized work to receipt settlement, salvage, cancellation, and final-run evidence
- [ ] T013 Add shadow output beside the current council convergence bridge without changing legacy decision authority
- [ ] T014 Define complete versioned profiles for every supported deep-loop mode, including thresholds, windows, deadlines, cycle action, evaluation points, and shadow/authority state
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify each clock fires alone from the exact typed condition and remains armed or not-evaluable for stale, incomplete, cleared, or non-qualifying inputs
- [ ] T016 Verify every ordering and same-boundary combination chooses the deterministic primary cause and preserves all co-causes
- [ ] T017 Verify resume, full replay, duplicate delivery, crash boundaries, policy-version changes, and conflicts reproduce the event hash or fail closed
- [ ] T018 Verify mode profiles are complete and deterministic; missing adapters, implicit unlimited budgets/time, and unknown versions reject evaluation
- [ ] T019 Verify only coverage emits `converged`; budget/wall-time, novelty, and cycle preserve their incomplete or non-convergence classes
- [ ] T020 Verify a fired clock denies new dispatch while in-flight receipts, spend, results, cancellations, and coverage gaps remain durable
- [ ] T021 Verify current `convergence.cjs` decisions, traces, blockers, scores, and bridge payloads remain unchanged in shadow mode
- [ ] T022 Run strict spec validation plus the targeted unit, replay, integration, mode-matrix, and shadow-parity suites; record non-zero discovery counts
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
