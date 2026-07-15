---
title: "Tasks: Deep Improvement Common Services - Reducers & Projections"
description: "Tasks for the reducers and projections phase of the deep-improvement common-services migration, covering the pure typed-event fold, iteration state, artifact index, shared evaluator/canary/promotion services, and per-mode status contract."
trigger_phrases:
  - "deep improvement reducers tasks"
  - "deep improvement projection tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed common reducer work into fold, projection, service, checkpoint, and contract tasks"
    next_safe_action: "Pin golden event histories before implementing projection reducers"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Common Services - Reducers & Projections

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

- [ ] T001 Confirm `001-typed-ledger-schema` publishes the event envelope, identity, ordering, version, and upcaster contract
- [ ] T002 Build the projection field matrix and event-to-reducer ownership map for iteration/convergence, artifact index, service status, and per-mode status
- [ ] T003 Record the boundary with `003-sealed-artifacts` and the three downstream variants; exclude sealed format and lane-specific behavior
- [ ] T004 Pin golden event histories for evaluator initialization, candidate generation, scoring, canary, promotion, pause, rollback, and resume
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Define the pure fold shell with canonical event dispatch, duplicate handling, version refusal, deterministic serialization, and projection fingerprints
- [ ] T006 [P] Define the iteration/convergence projection for evaluator epochs, candidate progress, budgets, unresolved evidence, stop disposition, and resume frontier
- [ ] T007 [P] Define the candidate/artifact index for lineage, mutation operator, profile scope, raw trials, digests, reduction versions, cost, latency, and receipts
- [ ] T008 Define the evaluator service contract and status projection for capsule identity, calibration, hidden-anchor commitment, query budget, and epoch matching
- [ ] T009 Define canary lifecycle and promotion status transitions for offline, shadow, canary, ship eligibility, shipped, paused, aborted, rolled back, and inconclusive states
- [ ] T010 Define non-overridable veto representation for evaluator integrity, critical-dimension regression, canary failure, stale evidence, cost ceiling, and rollback triggers
- [ ] T011 Define the shared per-mode status contract for common, agent, model, and skill workstreams with profile-scoped incumbent and fallback state
- [ ] T012 [P] Define checkpoint, rebuild, batch-frontier, state-hash, and mixed-version projection compatibility rules
- [ ] T013 Add effect-boundary assertions proving reducers cannot access filesystem, network, clock, randomness, evaluator execution, promotion writes, or hidden fixtures
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify complete-history and checkpointed replay produce byte-identical projection families, fingerprints, index entries, and per-mode status
- [ ] T015 Verify duplicate, malformed, missing, out-of-order, unsupported-version, and stale-event cases fail closed or enter explicit safe states
- [ ] T016 Verify raw trial evidence and lineage remain available after normalization, reduction-policy, and evaluator-epoch changes
- [ ] T017 Verify evaluator capsule mismatch, hidden-anchor mismatch, missing receipt, canary staleness, hard veto, and rollback cases cannot reach ship eligibility
- [ ] T018 Verify candidate generators receive only the permitted redacted projection view and cannot read evaluator internals or mutate evaluator assets
- [ ] T019 Verify the three downstream variants consume common fields and stage semantics without forked evaluator, canary, promotion, or rollback rules
- [ ] T020 Run the phase validator, replay/property suite, failure-injection suite, and exact-scope diff check
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/property/failure-injection as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
