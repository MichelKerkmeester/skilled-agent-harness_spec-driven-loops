---
title: "Tasks: Skill Benchmark reducers and projections"
description: "Tasks for planning and implementing the Skill Benchmark pure reducers and deterministic projections over the typed event ledger."
trigger_phrases:
  - "skill benchmark reducers tasks"
  - "skill-benchmark projection tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Read the leaf mold, parent sequencing, and skill-benchmark research inputs"
    next_safe_action: "Define pure skill-event folds and projection invariants from the typed ledger schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Benchmark reducers and projections

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

- [ ] T001 Confirm `001-typed-ledger-schema`, phase 015 shared contracts, and deep-improvement-common interfaces are frozen inputs
- [ ] T002 Inventory skill-benchmark event types, scenario-cell identities, treatment arms, gold states, raw observations, and downstream artifact references
- [ ] T003 Record the ownership matrix separating deep-improvement-common services from skill-specific reducer and projection logic
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define immutable reducer state, canonical event ordering, identity keys, duplicate policy, unsupported-version policy, and fingerprint inputs
- [ ] T005 Implement the pure fold for scenario treatment, exposure/invocation, trajectory and constraint coverage, raw evaluator observations, and gold-integrity outcomes
- [ ] T006 Implement paired lift, selection tax, content effect, executor interactions, negative transfer, compatibility, and versioned score normalization without discarding raw evidence
- [ ] T007 Project deterministic iteration/convergence state with collection, coverage, terminal, blocked, and certificate-readiness distinctions
- [ ] T008 Project the content-addressed artifact index for bundles, tasks/environments, executors, registries, tools, permissions, dependencies, gold, observations, scores, and certificate inputs
- [ ] T009 Project per-mode lifecycle, scenario-arm, scoring, compatibility, withheld, expired, and projection-diagnostic statuses
- [ ] T010 Add canonical snapshots and prefix-replay contracts for resume and shadow parity through deep-improvement-common interfaces
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify repeated replay produces byte-equivalent canonical projections and stable reducer fingerprints with external services unavailable
- [ ] T012 Verify complete, partial, pending-gold, structural-only, blocked, and terminal fixtures never convert missing required evidence into success
- [ ] T013 Verify duplicate, late, reordered, and unsupported events follow the declared idempotent, rejected, or blocked behavior
- [ ] T014 Verify raw observations and canary/milestone evidence remain indexed when score normalization or aggregation policy changes
- [ ] T015 Verify the artifact index and status projections rebuild identically from snapshot prefixes and full event ledgers
- [ ] T016 Verify successor `003-sealed-artifacts` and the independent mode gate consume stable projection fields without reducer-internal or shared-service coupling
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/replay as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
