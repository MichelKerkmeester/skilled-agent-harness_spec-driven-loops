---
title: "Tasks: Value-of-Computation Allocation"
description: "Tasks for VOC estimation, adaptive allocation, bounded fairness, typed-budget admission, fan-in integration, and replay verification."
trigger_phrases:
  - "value of computation allocation tasks"
  - "adaptive deep-loop allocation tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
    last_updated_at: "2026-07-21T12:46:24Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and adversarial verification for the VOC allocator"
    next_safe_action: "Retain uniform/static authority pending a later cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/voc-allocation/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/voc-allocation.vitest.ts"
    completion_pct: 100
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

- [x] T001 Pin baseline SHA and path-scoped candidate files, inventory frozen budget/fan-in/evidence interfaces, and capture uniform/static allocation fixtures. [evidence: `implementation-summary.md:31` records baseline `012652b4` and the additive-dark boundary; focused Vitest reports 14 passed.]
- [x] T002 Freeze VOC assessment, allocation decision, estimator, policy, calibration, pricing, and replay-fingerprint versions. [evidence: `runtime/lib/voc-allocation/types.ts:1` and the lossless event round-trip fixture cover the versioned contracts; focused Vitest reports 14 passed.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement versioned `VocAssessment` values, a lossless ledgered `AllocationDecision`, supersession links, and event-cut fingerprints. [evidence: `runtime/lib/voc-allocation/events.ts:1` round-trips two complete assessments and appends idempotently; focused Vitest reports 14 passed.]
- [x] T004 Implement expected coverage, contradiction-resolution, blocker-reduction, uncertainty-reduction, and diminishing-return benefit components. [evidence: `runtime/lib/voc-allocation/assessment.ts:1` feeds equal-pressure and diminishing-return fixtures; focused Vitest reports 14 passed.]
- [x] T005 Implement typed marginal-cost envelopes and same-dimension pressure ratios without cross-unit conversion or implicit unlimited values. [evidence: the pressure fixture records 1000/5000/2000/2000 basis points with cost governing; focused Vitest reports 14 passed.]
- [x] T006 Implement uncertainty bands, cold-start priors, calibration provenance, staleness, and observed-versus-predicted feedback. [evidence: cold-start, stale, and observed-value ledger fixtures pass in `runtime/tests/unit/voc-allocation.vitest.ts:1`; focused Vitest reports 14 passed.]
- [x] T007 Implement deterministic greedy selection with stable tie-breaking, integer quanta, ceilings, and diminishing returns. [evidence: greedy replay and second-quantum redirection fixtures pass; focused Vitest reports 14 passed.]
- [x] T008 Implement deterministic proportional selection with largest-remainder rounding, exact remainder handling, and share ceilings. [evidence: proportional replay and shared-mode redistribution fixtures pass; focused Vitest reports 14 passed.]
- [x] T009 Implement bounded exploration reserve, minimum service, capped aging, maximum consecutive skips, and per-mode/region fairness limits. [evidence: cold-start receives one of four quanta while capped aging cannot rescue excluded work; focused Vitest reports 14 passed.]
- [x] T010 Gate each selected proposal through one atomic phase-007 reservation across every required dimension and ancestor. [evidence: real `HierarchicalBudgetAuthority.admit` grant, denial, and final-remainder race fixtures pass; focused Vitest reports 14 passed.]
- [x] T011 Populate conditional fan-in's versioned usefulness slot without changing eligibility, stop taxonomy, finalized decisions, or reducer-input digests. [evidence: rank-only policy validation and frozen-decision equality pass; focused Vitest reports 14 passed.]
- [x] T012 Emit shadow allocation and calibration evidence comparing adaptive decisions with the authoritative uniform/static path. [evidence: decoded ledger evidence retains the uniform/static baseline and observed-versus-predicted fields; focused Vitest reports 14 passed.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify assessment completeness and replay stability across identical event, policy, estimator, calibration, pricing, and budget inputs. [evidence: reversed inputs reproduce identical assessments, ordering, quanta, and decision digest; focused Vitest reports 14 passed.]
- [x] T014 Verify greedy/proportional ordering, tie-breaking, integer rounding, ceilings, and diminishing returns. [evidence: deterministic policy and live shared-cap fixtures pass; focused Vitest reports 14 passed.]
- [x] T015 Verify cold-start, sparse-data, stale-estimate, starvation, exploration, aging, skip-limit, floor, and share-cap behavior. [evidence: fairness and exclusion fixtures pass in `runtime/tests/unit/voc-allocation.vitest.ts:1`; focused Vitest reports 14 passed.]
- [x] T016 Verify complete typed denial produces no partial reservation, dispatch, fairness bypass, or convergence label. [evidence: the denied decision leaves the reservation projection unchanged and fixes `converged: false`; focused Vitest reports 14 passed.]
- [x] T017 Verify concurrent allocators cannot consume the same remaining capacity and every losing decision retains a typed denial. [evidence: the final-remainder race creates one reservation and one budget-exhausted decision; focused Vitest reports 14 passed.]
- [x] T018 Verify late or high-VOC evidence cannot mutate a finalized fan-in decision or frozen reducer-input digest. [evidence: canonical finalized decision, reducer input digest, and decision digest remain identical; focused Vitest reports 14 passed.]
- [x] T019 Verify shadow reports compare expected value, typed spend, starvation, and allocation differences without moving authority. [evidence: ledger round-trip fixes `authoritativeDispatchMoved: false` and `authoritativeAllocationPath: uniform-static`; focused Vitest reports 14 passed.]
- [x] T020 Run alignment verification, strict packet validation, targeted tests, replay fixtures, and path-scoped mutation checks. [evidence: `implementation-summary.md:137` records focused test, typecheck, alignment, validator, and frozen-path receipts.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. [evidence: T001-T020 are checked above with executable receipts; focused Vitest reports 14 passed.]
- [x] All requirements in spec.md met with evidence. [evidence: `implementation-summary.md:81` maps all eight load-bearing invariant groups to executed fixtures.]
- [x] Phase gate green (validate/build/test as applicable). [evidence: `implementation-summary.md:137` records zero-exit focused Vitest, TypeScript, alignment, strict validation, and scope gates.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
