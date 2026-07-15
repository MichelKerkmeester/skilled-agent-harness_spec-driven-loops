---
title: "Tasks: Hierarchical Typed Budgets"
description: "Tasks for implementing the shared hierarchical token, cost, iteration, and wall-time budget authority."
trigger_phrases:
  - "hierarchical typed budgets tasks"
  - "deep-loop budget authority tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
    last_updated_at: "2026-07-15T13:59:12Z"
    last_updated_by: "codex"
    recent_action: "Decomposed typed budget implementation and verification into executable tasks"
    next_safe_action: "Capture the shipped guard baseline and freeze normalized receipt inputs"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] T001 Pin the phase-000 BASE and inventory budget, retry, concurrency, stop, and timeout behavior in `cost-guards.cjs` and `fanout-run.cjs`
- [ ] T002 Capture baseline fixtures for council upper bounds, lineage and aggregate caps, token aliases, retry multiplication, pre-spawn denial, and lineage lifetime ceilings
- [ ] T003 Freeze the phase-003 event/replay interface and sibling receipt/fencing inputs; amend this packet if the implemented contracts contradict its assumptions
- [ ] T004 Define stable program, mode, lineage, iteration, reservation, dispatch, receipt, pricing, and replay identities
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement discriminated token, fixed-precision cost, iteration-attempt, and monotonic-duration value types with strict unit validation
- [ ] T006 Implement the versioned `BudgetEnvelope` and canonical `program > mode > lineage > iteration` parent-chain validator
- [ ] T007 Define authorized ledger events for creation, allocation, grant/denial, commit, release, expiry, exhaustion, reconciliation, and anomaly
- [ ] T008 Implement the deterministic budget reducer with allocated, reserved, committed, released, and remaining balances at every event boundary
- [ ] T009 Implement idempotent atomic multi-dimensional reservation across the full ancestor chain, including conflict denial and zero partial mutation
- [ ] T010 Implement reservation lease, renewal, cancellation, expiry, and crash-resume reconciliation without erasing incurred spend
- [ ] T011 Implement receipt-backed settlement for actual tokens, monetary cost, attempts, and elapsed time; retain retry and failure spend
- [ ] T012 Implement fail-closed admission for exhaustion, missing parent, invalid unit, stale pricing, unknown usage, replay mismatch, reducer divergence, fencing conflict, and append failure
- [ ] T013 Add the program-phase-006 fan-out adapter for per-wave/per-lineage reservation under mode and program ceilings
- [ ] T014 Add the program-phase-008 value-of-computation adapter without granting it authority to mint, borrow, or reinterpret budget
- [ ] T015 Add read-only balance, settlement-lag, reservation-age, and denial projections for sibling stream-fold gauges
- [ ] T016 Preserve current council/fan-out guards as shadow comparators until compatibility, parity, and per-mode cutover gates authorize enforcement
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Verify all same-type operations and reject every cross-type, unit, currency, pricing-digest, negative, overflow, and implicit-unlimited case
- [ ] T018 Verify exact-capacity, one-over-cap, ancestor-exhaustion, explicit-reallocation, orphan, cycle, and wrong-parent scope cases
- [ ] T019 Race sibling reservations and prove no overbooking, partial grant, double commit, double release, or negative balance
- [ ] T020 Replay duplicate reserve/commit/release requests and prove idempotent results with one logical ledger transition
- [ ] T021 Crash after reserve, attempt start, executor failure, receipt write, and partial settlement; resume and reconcile deterministically
- [ ] T022 Verify under/exact/over estimate, missing usage, stale price, timeout, cancellation, retry, and failed-executor settlement
- [ ] T023 Verify every denial path records its reason and leaves no spawn/sample marker for fan-out or value-of-computation
- [ ] T024 Verify iteration exhaustion remains incomplete/budget-exhausted and never reduces to converged or successful
- [ ] T025 Run shadow parity against pinned council/fan-out fixtures and document intentional typed-accounting deltas
- [ ] T026 Run the relevant runtime unit/integration suites plus packet `validate.sh --strict` and bind results to the candidate SHA
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
