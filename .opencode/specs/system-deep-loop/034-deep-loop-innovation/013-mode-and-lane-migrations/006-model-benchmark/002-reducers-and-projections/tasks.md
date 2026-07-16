---
title: "Tasks: Model Benchmark — Reducers & Projections"
description: "Tasks for the model-benchmark reducers and projections phase, covering the pure typed-event fold, deterministic matrix-cell state, iteration/convergence projection, raw-trial artifact index, uncertainty-aware scoring matrix, shared service consumption, and replay verification."
trigger_phrases:
  - "model benchmark reducers tasks"
  - "model benchmark projection tasks"
  - "scoring matrix reducer tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed model matrix reduction into fold, index, scoring, and replay tasks"
    next_safe_action: "Pin model matrix golden histories before implementing reducers"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Model Benchmark — Reducers & Projections

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

- [ ] T001 Confirm `001-typed-ledger-schema` publishes the model-benchmark envelope, matrix identity, ordering, version, and upcaster contract
- [ ] T002 Confirm deep-improvement-common mode 004 publishes the shared reducer, evaluator, canary, promotion, veto, rollback, and status contract to consume unchanged
- [ ] T003 Build the projection field matrix, stable matrix-cell key, event-to-reducer map, ownership boundary, and downstream consumer contract
- [ ] T004 Pin golden histories for run/resume, matrix manifest, cell execution, raw observation, normalization, pairwise scoring, coverage, validity, canary, promotion, rollback, and stop
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Define the pure fold shell with canonical event dispatch, duplicate handling, version refusal, deterministic serialization, and projection fingerprints
- [ ] T006 [P] Define stable matrix-cell identity and canonical ordering for model, task or fixture, recipe, evaluator epoch, execution profile, treatment, and seed
- [ ] T007 [P] Define matrix-cell state for pending, observed, failed, skipped, abstained, inconclusive, invalid, and late or duplicate terminal outcomes
- [ ] T008 [P] Define iteration/convergence projection for run lifecycle, matrix waves, coverage quotas, adaptive selection, budgets, unresolved evidence, stop disposition, and resume frontier
- [ ] T009 [P] Define the raw-trial artifact index for model/provider/build, task, fixture, recipe, prompt, workload, toolchain, output, usage, latency, receipts, validity, and score references
- [ ] T010 Define the scoring-matrix projection for raw observations, normalization, metrics, pairwise or multi-model estimates, uncertainty, calibration, contamination, coverage, cost, latency, and ranking policy
- [ ] T011 Define common-service projection adapters that consume evaluator epoch, canary, promotion, veto, receipt, rollback, and per-mode status fields without reimplementing them
- [ ] T012 Define checkpoint, rebuild, batch-frontier, reducer/schema/score-policy fingerprint, matrix-epoch compatibility, and supported-upcast rules
- [ ] T013 Add redacted projection views and effect-boundary assertions preventing model calls, evaluator calls, filesystem, network, clock, randomness, hidden fixtures, sealing, promotion, rollback, or external writes
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify complete-history and checkpointed replay produce byte-identical iteration state, matrix entries, artifact index, scoring matrix, per-mode status, and fingerprints
- [ ] T015 Verify valid matrix event permutations, duplicate terminal events, batch boundaries, and late observations produce deterministic results
- [ ] T016 Verify malformed, missing, ambiguous, out-of-order, unsupported-version, stale-epoch, and incompatible matrix-epoch cases fail closed or enter explicit safe states
- [ ] T017 Verify raw model outputs, task/recipe provenance, evaluator references, receipts, usage, latency, validity, and score-policy lineage survive ranking and normalization changes
- [ ] T018 Verify underpowered, missing, abstained, inconclusive, contaminated, invalid, and vetoed cells cannot silently become ranked or promotion-eligible evidence
- [ ] T019 Verify common evaluator, canary, promotion, veto, rollback, and status transitions match deep-improvement-common fixtures without model-specific semantic forks
- [ ] T020 Verify adaptive selection retains coverage quotas, selection policy, propensity metadata, confirmatory anchors, and explicit out-of-support or insufficient-evidence states
- [ ] T021 Run the phase validator, replay/property suite, matrix-permutation suite, failure-injection suite, effect guards, and exact-scope diff check
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/property/matrix-permutation/failure-injection as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
