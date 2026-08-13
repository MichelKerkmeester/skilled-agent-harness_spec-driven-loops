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
    last_updated_at: "2026-07-21T11:37:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the five-clock runtime, adversarial fixtures, and strict quality gate"
    next_safe_action: "Keep the module shadow-only until the separate program cutover gates pass"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Pin the baseline and freeze clock kinds, termination classes, event namespace, source-interface versions, evaluation boundaries, and the supported-mode inventory [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; `stopping-clock-profiles.ts` and `stopping-clock-types.ts` export exact closed contracts.]
- [x] T002 Define canonical `StoppingClockObservation`, `StoppingClockProfile`, immutable arbitration-snapshot, and `LoopTerminationDeclared` schemas with replay identities [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; `stopping-clock-types.ts` defines every contract and hash input.]
- [x] T003 Build deterministic source fixtures for typed budgets, semantic novelty, coverage certificates, monotonic wall time, and cycle health events [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; the focused Vitest suite constructs owner-shaped positive and adversarial inputs.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement profile validation and canonical serialization; reject missing clocks, unknown versions, mixed watermarks, invalid parameters, and non-monotonic elapsed time [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; exact registry validation and fail-closed arbitration fixtures pass.]
- [x] T005 Implement the budget clock adapter with exact governing scope, typed dimension, balances, denial/exhaustion event, and reconciliation state [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; four units across four governing scopes fire independently; unreconciled and unknown-version inputs are not evaluable.]
- [x] T006 Implement the fixed-point novelty-decay tail over concept novelty and independent-evidence yield with versioned per-mode warm-up, decay, floors, window, and patience [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; complete/incomplete window, churn, duplicate-source, stale-watermark, resume, and replay fixtures pass.]
- [x] T007 Implement the coverage clock adapter; accept only a fresh sibling `STOP_ALLOWED` certificate with no mandatory gaps, critical contradictions, or STOP blockers [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; complete, partial, blocked, stale-universe, limit, and score-only fixtures pass.]
- [x] T008 Implement the independent monotonic wall-time clock and preserve separate deadline and budgeted-wall-time causes [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; simultaneous deadline and budget-wall-time exhaustion remain distinct co-causes.]
- [x] T009 Implement the cycle clock adapter; accept only a fresh confirmed sibling event meeting mode severity and persistence policy [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; confirmed, suspected, cleared, progress-broken, stale, and forged-event fixtures pass.]
- [x] T010 Implement deterministic earliest-fire arbitration by elapsed time, ledger cursor, and same-batch rank; retain all co-firing causes and comparator evidence [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; all single clocks, ordered pairs, pair ties, and all-clock ties pass in every mode.]
- [x] T011 Implement idempotent terminal-event writing through transition authorization and reject conflicting replay payloads [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; authorized append, empty pre-write state, exact retry, and conflict fixtures pass.]
- [x] T012 Gate new dispatch after firing and link already-authorized work to receipt settlement, salvage, cancellation, and final-run evidence [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; terminal payloads reject admission and retain all three disposition classes plus final gaps, blockers, and last work.]
- [x] T013 Add shadow output beside the current council convergence bridge without changing legacy decision authority [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; `stopping-clock-shadow.ts` returns the legacy object by identity under `legacy-convergence` authority.]
- [x] T014 Define complete versioned profiles for every supported deep-loop mode, including thresholds, windows, deadlines, cycle action, evaluation points, and shadow/authority state [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; seven exact profiles pass the complete matrix and altered profiles reject.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify each clock fires alone from the exact typed condition and remains armed or not-evaluable for stale, incomplete, cleared, or non-qualifying inputs [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; owner-shaped adapter fixtures and the seven-profile single-clock matrix pass.]
- [x] T016 Verify every ordering and same-boundary combination chooses the deterministic primary cause and preserves all co-causes [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; 70 ordered-pair and 70 pair-tie cases plus seven all-clock ties pass.]
- [x] T017 Verify resume, full replay, duplicate delivery, crash boundaries, policy-version changes, and conflicts reproduce the event hash or fail closed [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; replay/resume hashes match; empty pre-write, append/retry, version rejection, and payload conflict cases pass.]
- [x] T018 Verify mode profiles are complete and deterministic; missing adapters, implicit unlimited budgets/time, and unknown versions reject evaluation [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; seven profiles name all clocks and deadlines; missing-clock and unknown/altered-version cases fail closed.]
- [x] T019 Verify only coverage emits `converged`; budget/wall-time, novelty, and cycle preserve their incomplete or non-convergence classes [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; exact class assertions pass for every clock in every mode.]
- [x] T020 Verify a fired clock denies new dispatch while in-flight receipts, results, cancellations, and coverage gaps remain durable [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; settle, salvage, cancel, gap, blocker, and last-authorized-work fields survive terminal declaration.]
- [x] T021 Verify current `convergence.cjs` decisions, traces, blockers, scores, and bridge payloads remain unchanged in shadow mode [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; the legacy result object containing every named field is preserved by identity; the frozen module has no delta.]
- [x] T022 Run strict spec validation plus the targeted unit, replay, ledger, mode-matrix, and shadow-parity suites; record non-zero discovery counts [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; Vitest passes 32 tests, TypeScript and alignment exit 0, and strict packet validation exits 0 with zero errors and warnings.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; T001 through T022 are checked with executable or structural evidence.]
- [x] All requirements in spec.md met with evidence [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; `implementation-summary.md` maps runtime behavior and the 32-test suite to the fourteen frozen requirements.]
- [x] Phase gate green (validate/build/test as applicable) [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; test, typecheck, alignment, hygiene, and strict validation are green with zero errors.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
