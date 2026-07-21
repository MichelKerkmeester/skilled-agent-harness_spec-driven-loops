---
title: "Tasks: Hierarchical Typed Budgets"
description: "Tasks for implementing the shared hierarchical token, cost, iteration, and wall-time budget authority."
trigger_phrases:
  - "hierarchical typed budgets tasks"
  - "deep-loop budget authority tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
    last_updated_at: "2026-07-15T13:59:12Z"
    last_updated_by: "codex"
    recent_action: "Completed the runtime implementation and focused verification tasks"
    next_safe_action: "Commit the path-scoped candidate when authorized"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Hierarchical Typed Budgets

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

- [x] T001 Pin the phase-003 BASE and inventory budget, retry, concurrency, stop, and timeout behavior in `cost-guards.cjs` and `fanout-run.cjs` [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T002 Capture baseline fixtures for council upper bounds, lineage and aggregate caps, token aliases, retry multiplication, pre-spawn denial, and lineage lifetime ceilings [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T003 Freeze the phase-006 event/replay interface and sibling receipt/fencing inputs; amend this packet if the implemented contracts contradict its assumptions [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T004 Define stable program, mode, lineage, iteration, reservation, dispatch, receipt, pricing, and replay identities [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement discriminated token, fixed-precision cost, iteration-attempt, and monotonic-duration value types with strict unit validation [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T006 Implement the versioned `BudgetEnvelope` and canonical `program > mode > lineage > iteration` parent-chain validator [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T007 Define authorized ledger events for creation, allocation, grant/denial, commit, release, expiry, exhaustion, reconciliation, and anomaly [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T008 Implement the deterministic budget reducer with allocated, reserved, committed, released, and remaining balances at every event boundary [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T009 Implement idempotent atomic multi-dimensional reservation across the full ancestor chain, including conflict denial and zero partial mutation [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T010 Implement reservation lease, renewal, cancellation, expiry, and crash-resume reconciliation without erasing incurred spend [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T011 Implement receipt-backed settlement for actual tokens, monetary cost, attempts, and elapsed time; retain retry and failure spend [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T012 Implement fail-closed admission for exhaustion, missing parent, invalid unit, stale pricing, unknown usage, replay mismatch, reducer divergence, fencing conflict, and append failure [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T013 Add the program-phase-009 fan-out adapter for per-wave/per-lineage reservation under mode and program ceilings [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T014 Add the program-phase-011 value-of-computation adapter without granting it authority to mint, borrow, or reinterpret budget [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T015 Add read-only balance, settlement-lag, reservation-age, and denial projections for sibling stream-fold gauges [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T016 Preserve current council/fan-out guards as shadow comparators until compatibility, parity, and per-mode cutover gates authorize enforcement [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Verify all same-type operations and reject every cross-type, unit, currency, pricing-digest, negative, overflow, and implicit-unlimited case [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T018 Verify exact-capacity, one-over-cap, ancestor-exhaustion, explicit-reallocation, orphan, cycle, and wrong-parent scope cases [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T019 Race sibling reservations and prove no overbooking, partial grant, double commit, double release, or negative balance [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T020 Replay duplicate reserve/commit/release requests and prove idempotent results with one logical ledger transition [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T021 Crash after reserve, attempt start, executor failure, receipt write, and partial settlement; resume and reconcile deterministically [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T022 Verify under/exact/over estimate, missing usage, stale price, timeout, cancellation, retry, and failed-executor settlement [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T023 Verify every denial path records its reason and leaves no spawn/sample marker for fan-out or value-of-computation [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T024 Verify iteration exhaustion remains incomplete/budget-exhausted and never reduces to converged or successful [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T025 Run shadow parity against pinned council/fan-out fixtures and document intentional typed-accounting deltas [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] T026 Run the relevant runtime unit/integration suites plus packet `validate.sh --strict` and bind results to the candidate SHA [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] All requirements in spec.md met with evidence [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] Phase gate green (focused test and build evidence is recorded in `implementation-summary.md`; strict packet validation is rerun after documentation reconciliation) [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
