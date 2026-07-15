---
title: "Tasks: Model Benchmark typed ledger schema (013 mode migration, 006 child)"
description: "Tasks for the Model Benchmark typed ledger schema phase: map shared ledger contracts, define the mode event union and field types, specify lineage and validity evidence, define upcaster hooks, and verify the reducer handoff boundary."
trigger_phrases:
  - "Model Benchmark typed ledger schema tasks"
  - "model-benchmark event vocabulary tasks"
  - "typed ledger model benchmark task set"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T22:59:00Z"
    last_updated_by: "opencode"
    recent_action: "Separated immutable Model Benchmark evidence from reducer-owned state"
    next_safe_action: "Enumerate shared and mode-specific envelope fields"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Model Benchmark Typed Ledger Schema

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

- [ ] T001 Confirm the phase is planning-only, the target folder is scope-locked, and the predecessor adjacency is `none` with successor `002-reducers-and-projections`
- [ ] T002 [P] Read the phase-003 transition-authorized ledger contract and phase-009 shared event contracts; record required envelope, authorization, hash, sequence, and replay fields
- [ ] T003 [P] Map the mode-004 deep-improvement-common evaluator, canary, calibration, receipt, and promotion ownership boundaries
- [ ] T004 [P] Extract Model Benchmark-specific evidence obligations from the research registries: paired trials, private workload, canary lineage, judge calibration, validity, usage, and policy inputs
- [ ] T005 Inventory current dispatch and sweep facts, including normalized usage fields, failed cells, execution paths, and existing scoring-matrix dimensions
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Define `ModelBenchmarkEventEnvelope<T>` and the `deep-improvement.model-benchmark.*` event namespace over the shared envelope
- [ ] T007 Define run lifecycle, capsule/workload sealing, benchmark design, trial-block, admission, dispatch, completion, failure, unknown, and invalidation event types
- [ ] T008 Define observation events for raw outputs, score vectors, normalized usage, latency, judge observations, oracle attestations, and reducer input sealing
- [ ] T009 Define task, family, candidate, model/build, execution-path, prompt/tool recipe, paired-block, protocol, seed, perturbation, and workload-envelope field types
- [ ] T010 Define task-lineage events and fields for visibility, source cutoff, first exposure, contamination evidence, disclosure, retirement, replacement, and oracle correction
- [ ] T011 Define judge calibration, validity-plan, validity-card, abstention, disagreement, and unknown-state payloads without promoting them to reducer truth
- [ ] T012 Define append-only identity, causal links, per-stream sequence, retry/attempt identity, deterministic ordering, and raw-payload hash rules
- [ ] T013 Define schema-version, payload-hash, canonicalization, compatibility classification, upcaster, and upcast-receipt hooks
- [ ] T014 Define `selection_evidence_sealed` and `selection_reduction_requested` as the terminal handoff to `002-reducers-and-projections`; exclude reducer state and policy outputs
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify: The mode envelope preserves shared authorization, hash-chain, sequence, causal, and replay fields — every event type passes the shared required-field matrix
- [ ] T016 Verify: The event union covers the complete run and scoring-matrix behavior — lifecycle, design, trial, observation, lineage, validity, and reduction handoff are all represented
- [ ] T017 Verify: Matrix identity survives parallel completion and retries — model/path, task/family, treatment, protocol, seed, perturbation, and workload keys remain stable
- [ ] T018 Verify: Raw evidence survives derived scoring — raw output, raw score, usage, latency, judge, oracle, contamination, and validity references remain append-only
- [ ] T019 Verify: Version changes are replay-safe — exact, compatible, migrate, pin-old-runtime, and blocked paths preserve source hashes and upcast provenance
- [ ] T020 Verify: Shared services are referenced rather than duplicated — evaluator, canary, calibration, promotion, receipt, budget, and authority ownership remains outside this child
- [ ] T021 Verify: Reducer scope is preserved — no fold, projection, selection certificate, materialized policy, or gauge schema appears before `002-reducers-and-projections`
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
- **Next sibling**: See `002-reducers-and-projections` for reducer and projection ownership
<!-- /ANCHOR:cross-refs -->
