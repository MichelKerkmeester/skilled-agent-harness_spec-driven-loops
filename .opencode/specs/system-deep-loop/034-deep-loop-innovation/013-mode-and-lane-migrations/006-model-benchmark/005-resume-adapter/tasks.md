---
title: "Tasks: Model Benchmark - Resume Adapter"
description: "Tasks for the Model Benchmark resume adapter: pin sealed-ledger and reducer contracts, map continuity-ladder state, define stable matrix-cell re-entry, preserve scoring evidence, consume shared recovery services, and verify idempotent replay."
trigger_phrases:
  - "Model Benchmark resume adapter tasks"
  - "sealed ledger resume tasks"
  - "model benchmark re-entry task set"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/005-resume-adapter"
    last_updated_at: "2026-07-15T23:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Separated logical cell identity from retry attempts"
    next_safe_action: "Define resume-plan key and sealed-frontier conflict rules"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Model Benchmark - Resume Adapter

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

- [ ] T001 Confirm the phase is planning-only, the target folder is scope-locked, and adjacency names predecessor `004-certificates-and-receipts` and successor `006-shadow-parity`
- [ ] T002 [P] Pin the phase-006 sealed-ledger, phase-012 shared-event, Model Benchmark schema, and reducer contracts with version and fingerprint fields
- [ ] T003 [P] Record deep-improvement-common mode-004 ownership for evaluator, canary, promotion, receipt, budget, lock, effect-recovery, and status services
- [ ] T004 [P] Extract resume obligations from the research registries: replay fingerprints, logical versus attempt identity, branch-local success, unknown effects, task-conditioned scoring, workload, calibration, and contamination
- [ ] T005 Inventory run, iteration, matrix, cell, attempt, score, usage, latency, validity, receipt, and shared-status fields required for reconstruction
- [ ] T006 Define the continuity-ladder layers, sealed source frontier, projection fingerprints, and resume-plan key inputs
- [ ] T007 Define the matrix-cell action table for reuse, reconcile, re-execute, compensate, unknown, and block outcomes
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Define seal validation and compatibility outcomes for ledger, schema, reducer, model, recipe, tool, workload, evaluator, and scoring-policy fingerprints
- [ ] T009 Define reducer-only reconstruction from the sealed finalized frontier with no mutable-file, provider, network, clock, randomness, or hidden-write dependency
- [ ] T010 Define the continuity-ladder projection from run identity through the resumable frontier
- [ ] T011 Define stable run, matrix-cell, logical-operation, event, receipt, and attempt identity rules for parallel completion and restart
- [ ] T012 Define idempotent event and resume-plan application: same identity and content hash is a no-op; conflicting identity or frontier fails closed
- [ ] T013 Define per-cell re-entry planning for compatible terminal reuse, safe re-execution, shared receipt reconciliation, compensation, unknown effect, and block
- [ ] T014 Define preservation of branch-local successes, late evidence, invalidation, abstention, underpowered, contaminated, and stale cells
- [ ] T015 Define Model Benchmark scoring restoration for paired treatment, task-conditioned scores, adaptive coverage, workload profiles, evaluator epochs, calibration, usage, latency, and uncertainty
- [ ] T016 Define the shared resume receipt or reference payload with plan key, source seal, projection hash, selected cells, excluded reasons, decisions, and service receipt refs
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Verify: Fresh and checkpointed folds over the same sealed ledger produce byte-identical run, matrix, evidence, status, frontier, and projection fingerprints
- [ ] T018 Verify: Event completion-order permutations, duplicate terminal events, batch boundaries, branch completion, and late evidence produce identical plans or explicit safe rejection
- [ ] T019 Verify: Crashes before dispatch, after provider acceptance, after receipt, after ledger append, after fold, and before resume receipt produce no double-apply and preserve unknown states
- [ ] T020 Verify: Model, alias, prompt, tool, recipe, workload, evaluator, scoring-policy, schema, reducer, and frontier changes select migrate, pin, or block rather than silent reuse
- [ ] T021 Verify: Logical cell and operation identities persist across retries while attempt identities change only after authorized re-entry
- [ ] T022 Verify: Branch-local successes remain reusable and unknown effects do not become automatic duplicate executions
- [ ] T023 Verify: Raw scores, usage, latency, workload lineage, calibration, contamination, validity, abstention, and uncertainty survive resume planning
- [ ] T024 Verify: Model Benchmark consumes common evaluator, canary, promotion, receipt, budget, lock, effect-recovery, veto, rollback, and status contracts without a semantic fork
- [ ] T025 Verify: The `006-shadow-parity` handoff contains deterministic source and output fingerprints and the exact four-file scope check passes
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/property/crash-injection as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor adjacency**: See `004-certificates-and-receipts`
- **Successor adjacency**: See `006-shadow-parity`
<!-- /ANCHOR:cross-refs -->
