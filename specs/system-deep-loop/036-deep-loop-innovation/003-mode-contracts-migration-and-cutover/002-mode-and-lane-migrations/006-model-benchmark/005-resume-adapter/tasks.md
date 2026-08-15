---
title: "Tasks: Model Benchmark - Resume Adapter"
description: "Tasks for the Model Benchmark resume adapter: pin sealed-ledger and reducer contracts, map continuity-ladder state, define stable matrix-cell re-entry, preserve scoring evidence, consume shared recovery services, and verify idempotent replay."
trigger_phrases:
  - "Model Benchmark resume adapter tasks"
  - "sealed ledger resume tasks"
  - "model benchmark re-entry task set"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/005-resume-adapter"
    last_updated_at: "2026-08-15T15:07:50Z"
    last_updated_by: "codex"
    recent_action: "Reverified resume-adapter closeout with focused suite 22 of 22 at exit 0"
    next_safe_action: "Treat this leaf as complete while preserving additive-dark authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-resume-adapter/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-resume-adapter.vitest.ts"
    completion_pct: 100
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

- [x] T001 Confirm the implementation is additive-dark, the target scope is locked, and adjacency names predecessor `004-certificates-and-receipts` and successor `006-shadow-parity` [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T002 [P] Pin the phase-006 sealed-ledger, phase-012 shared-event, Model Benchmark schema, and reducer contracts with version and fingerprint fields [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T003 [P] Record deep-improvement-common mode-004 ownership for evaluator, canary, promotion, receipt, budget, lock, effect-recovery, and status services [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T004 [P] Extract resume obligations from the research registries: replay fingerprints, logical versus attempt identity, branch-local success, unknown effects, task-conditioned scoring, workload, calibration, and contamination [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T005 Inventory run, iteration, matrix, cell, attempt, score, usage, latency, validity, receipt, and shared-status fields required for reconstruction [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T006 Define the continuity-ladder layers, sealed source frontier, projection fingerprints, and resume-plan key inputs [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T007 Define the matrix-cell action table for reuse, reconcile, re-execute, compensate, unknown, and block outcomes [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Define seal validation and compatibility outcomes for ledger, schema, reducer, model, recipe, tool, workload, evaluator, and scoring-policy fingerprints [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T009 Define reducer-only reconstruction from the sealed finalized frontier with no mutable-file, provider, network, clock, randomness, or hidden-write dependency [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T010 Define the continuity-ladder projection from run identity through the resumable frontier [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T011 Define stable run, matrix-cell, logical-operation, event, receipt, and attempt identity rules for parallel completion and restart [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T012 Define idempotent event and resume-plan application: same identity and content hash is a no-op; conflicting identity or frontier fails closed [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T013 Define per-cell re-entry planning for compatible terminal reuse, safe re-execution, shared receipt reconciliation, compensation, unknown effect, and block [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T014 Define preservation of branch-local successes, late evidence, invalidation, abstention, underpowered, contaminated, and stale cells [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T015 Define Model Benchmark scoring restoration for paired treatment, task-conditioned scores, adaptive coverage, workload profiles, evaluator epochs, calibration, usage, latency, and uncertainty [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T016 Define the shared resume receipt or reference payload with plan key, source seal, projection hash, selected cells, excluded reasons, decisions, and service receipt refs [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Verify: Fresh and checkpointed folds over the same sealed ledger produce byte-identical run, matrix, evidence, status, frontier, and projection fingerprints [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T018 Verify: Event completion-order permutations, duplicate terminal events, batch boundaries, branch completion, and late evidence produce identical plans or explicit safe rejection [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T019 Verify: Crashes before dispatch, after provider acceptance, after receipt, after ledger append, after fold, and before resume receipt produce no double-apply and preserve unknown states [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T020 Verify: Model, alias, prompt, tool, recipe, workload, evaluator, scoring-policy, schema, reducer, and frontier changes select migrate, pin, or block rather than silent reuse [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T021 Verify: Logical cell and operation identities persist across retries while attempt identities change only after authorized re-entry [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T022 Verify: Branch-local successes remain reusable and unknown effects do not become automatic duplicate executions [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T023 Verify: Raw scores, usage, latency, workload lineage, calibration, contamination, validity, abstention, and uncertainty survive resume planning [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T024 Verify: Model Benchmark consumes common evaluator, canary, promotion, receipt, budget, lock, effect-recovery, veto, rollback, and status contracts without a semantic fork [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] T025 Verify: The `006-shadow-parity` handoff contains deterministic source and output fingerprints and the scoped runtime, test, and leaf-doc status check passes [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] All requirements in spec.md met with evidence [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
- [x] Phase gate green (validate/replay/property/crash-injection as applicable) [Evidence: model-benchmark-resume-adapter.vitest.ts 22/22 in 67.70s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor adjacency**: See `004-certificates-and-receipts`
- **Successor adjacency**: See `006-shadow-parity`
<!-- /ANCHOR:cross-refs -->
