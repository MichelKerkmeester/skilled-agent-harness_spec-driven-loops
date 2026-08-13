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
    last_updated_at: "2026-07-23T12:14:56Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark Skill Benchmark reducer extension"
    next_safe_action: "Consume the frozen projection contract from the sealed-artifact sibling"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Benchmark reducers and projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Confirm `001-typed-ledger-schema`, phase 015 shared contracts, and deep-improvement-common interfaces are frozen inputs [EVIDENCE: implementation-summary.md:53]
- [x] T002 Inventory skill-benchmark event types, scenario-cell identities, treatment arms, gold states, raw observations, and downstream artifact references [EVIDENCE: implementation-summary.md:53]
- [x] T003 Record the ownership matrix separating deep-improvement-common services from skill-specific reducer and projection logic [EVIDENCE: implementation-summary.md:84]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define immutable reducer state, canonical event ordering, identity keys, duplicate policy, unsupported-version policy, and fingerprint inputs [EVIDENCE: skill-benchmark-reducer.ts:1]
- [x] T005 Implement the pure fold for scenario treatment, exposure/invocation, trajectory and constraint coverage, raw evaluator observations, and gold-integrity outcomes [EVIDENCE: skill-benchmark-reducer.ts:1]
- [x] T006 Implement typed normalized ranking, negative transfer, compatibility, and score-policy attribution without discarding raw evidence [EVIDENCE: skill-benchmark-reducer.ts:1]
- [x] T007 Project deterministic iteration/convergence state with collection, coverage, terminal, blocked, and certificate-readiness distinctions [EVIDENCE: skill-benchmark-projection-types.ts:1]
- [x] T008 Project the content-addressed artifact index for bundles, tasks/environments, executors, registries, tools, permissions, dependencies, gold, observations, scores, and certificate inputs [EVIDENCE: skill-benchmark-projection-types.ts:1]
- [x] T009 Project per-mode lifecycle, scenario-arm, scoring, compatibility, withheld, expired, and projection-diagnostic statuses [EVIDENCE: skill-benchmark-projection-types.ts:1]
- [x] T010 Add canonical checkpoints and replay contracts for resume and shadow parity through deep-improvement-common interfaces [EVIDENCE: skill-benchmark-reducer.ts:1]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify repeated replay produces byte-equivalent canonical projections and stable reducer fingerprints with external services unavailable [EVIDENCE: skill-benchmark-reducers.vitest.ts:1]
- [x] T012 Verify complete, partial, blocked, and terminal evidence states never convert missing required evidence into success [EVIDENCE: skill-benchmark-reducers.vitest.ts:1]
- [x] T013 Verify duplicate, late, reordered, and unsupported events follow the declared idempotent, rejected, or blocked behavior [EVIDENCE: skill-benchmark-reducers.vitest.ts:1]
- [x] T014 Verify raw observations and milestone evidence remain indexed while normalized rankings stay separate [EVIDENCE: skill-benchmark-reducers.vitest.ts:1]
- [x] T015 Verify artifact, status, and stream-frontier projections rebuild identically from canonical ledger input [EVIDENCE: skill-benchmark-reducers.vitest.ts:1]
- [x] T016 Export stable successor-facing fields without reducer-internal or shared-service coupling [EVIDENCE: index.ts:1]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test/replay as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
