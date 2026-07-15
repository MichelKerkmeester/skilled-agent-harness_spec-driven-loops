---
title: "Tasks: Value-of-Computation Allocation (008 phase 004)"
description: "Tasks for VOC estimation, adaptive allocation, bounded fairness, typed-budget admission, fan-in integration, and replay verification."
trigger_phrases:
  - "value of computation allocation tasks"
  - "adaptive deep-loop allocation tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
    last_updated_at: "2026-07-15T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined implementation and verification tasks for the VOC allocator"
    next_safe_action: "Implement schemas and replay fixtures after upstream contracts freeze"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Value-of-Computation Allocation

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

- [ ] T001 Pin baseline/candidate SHAs, inventory frozen budget/fan-in/evidence/stop interfaces, and capture uniform/static allocation fixtures
- [ ] T002 Freeze VOC assessment, allocation decision, estimator, policy, calibration, pricing, and replay-fingerprint versions
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement `VocAssessment` and `AllocationDecision` event schemas, append-only reducers, supersession links, and event-cut fingerprints
- [ ] T004 Implement expected coverage, contradiction-resolution, blocker-reduction, uncertainty-reduction, and diminishing-return benefit components
- [ ] T005 Implement typed marginal-cost envelopes and same-dimension pressure ratios without cross-unit conversion or implicit unlimited values
- [ ] T006 Implement uncertainty bands, cold-start priors, calibration provenance, staleness, and observed-versus-predicted feedback
- [ ] T007 Implement deterministic greedy selection with stable tie-breaking, integer quanta, ceilings, and hysteresis
- [ ] T008 Implement deterministic proportional selection with largest-remainder rounding, exact remainder handling, and share ceilings
- [ ] T009 Implement bounded exploration reserve, minimum service, capped aging, maximum consecutive skips, and per-mode/region fairness limits
- [ ] T010 Gate each dispatchable selection through one atomic phase-004 reservation across every required dimension and ancestor
- [ ] T011 Populate conditional fan-in's versioned usefulness slot without changing eligibility, stop taxonomy, finalized decisions, or reducer-input digests
- [ ] T012 Emit shadow allocation and calibration projections comparing adaptive decisions with the authoritative uniform/static path
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify assessment completeness and replay stability across identical event, policy, estimator, calibration, pricing, and budget inputs
- [ ] T014 Verify greedy/proportional ordering, tie-breaking, integer rounding, ceilings, diminishing returns, and hysteresis
- [ ] T015 Verify cold-start, sparse-data, stale-estimate, starvation, exploration, aging, skip-limit, floor, and share-cap behavior
- [ ] T016 Verify denial of each budget dimension and ancestor produces no partial reservation, dispatch, fairness bypass, or convergence label
- [ ] T017 Verify concurrent allocators cannot consume the same remaining capacity and every losing decision retains a typed denial
- [ ] T018 Verify late or high-VOC evidence cannot mutate a finalized fan-in decision or frozen reducer-input digest
- [ ] T019 Verify shadow reports compare realized weighted coverage, resolved contradictions, blocker reduction, typed spend, and starvation without moving authority
- [ ] T020 Run the phase verifier, strict packet validation, targeted tests, replay fixtures, and tracked-mutation check on the exact candidate SHA
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
