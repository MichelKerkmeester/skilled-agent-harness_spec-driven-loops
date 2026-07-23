---
title: "Tasks: Model Benchmark typed ledger schema"
description: "Completed tasks for the additive-dark Model Benchmark typed ledger schema over the closed deep-improvement-common contract."
trigger_phrases:
  - "Model Benchmark typed ledger schema tasks"
  - "model-benchmark event vocabulary tasks"
  - "typed ledger model benchmark task set"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T22:59:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented and verified the 67-stem combined registry"
    next_safe_action: "Consume the immutable event union in 002-reducers-and-projections"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm the schema-only scope, target-folder lock, predecessor adjacency `none`, and successor `002-reducers-and-projections` [Evidence: scope and adjacency are recorded in `implementation-summary.md`]
- [x] T002 [P] Read the phase-006 transition-authorized ledger contract and phase-012 shared event contracts; record required envelope, authorization, hash, sequence, and replay fields [Evidence: substrate use is recorded in `implementation-summary.md`]
- [x] T003 [P] Map the mode-004 deep-improvement-common evaluator, canary, calibration, receipt, and promotion ownership boundaries [Evidence: the imported common surface is recorded in `implementation-summary.md`]
- [x] T004 [P] Extract Model Benchmark-specific evidence obligations from the research registries: paired trials, private workload, canary lineage, judge calibration, validity, usage, and policy inputs [Evidence: the 32-stem vocabulary is recorded in `implementation-summary.md`]
- [x] T005 Inventory current dispatch and sweep facts, including normalized usage fields, failed cells, execution paths, and existing scoring-matrix dimensions [Evidence: field coverage is recorded in `implementation-summary.md`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Define `ModelBenchmarkEventEnvelope<T>` and the `deep-improvement.model-benchmark.*` event namespace over the shared envelope [Evidence: exports are recorded in `implementation-summary.md`]
- [x] T007 Define run lifecycle, capsule/workload sealing, benchmark design, trial-block, admission, dispatch, completion, failure, unknown, and invalidation event types [Evidence: the event union is recorded in `implementation-summary.md`]
- [x] T008 Define observation events for raw outputs, score vectors, normalized usage, latency, judge observations, oracle attestations, and reducer input sealing [Evidence: observation families are recorded in `implementation-summary.md`]
- [x] T009 Define task, family, candidate, model/build, execution-path, prompt/tool recipe, paired-block, protocol, seed, perturbation, and workload-envelope field types [Evidence: matrix-key validation is recorded in `implementation-summary.md`]
- [x] T010 Define task-lineage events and fields for visibility, source cutoff, first exposure, contamination evidence, disclosure, retirement, replacement, and oracle correction [Evidence: lineage coverage is recorded in `implementation-summary.md`]
- [x] T011 Define judge calibration, validity-plan, validity-card, abstention, disagreement, and unknown-state payloads without promoting them to reducer truth [Evidence: validity and judge boundaries are recorded in `implementation-summary.md`]
- [x] T012 Define append-only identity, causal links, per-stream sequence, retry/attempt identity, deterministic ordering, and raw-payload hash rules [Evidence: deterministic append coverage is recorded in `implementation-summary.md`]
- [x] T013 Define schema-version, payload-hash, canonicalization, compatibility classification, upcaster, and upcast-receipt hooks [Evidence: compatibility verification is recorded in `implementation-summary.md`]
- [x] T014 Define `selection_evidence_sealed` and `selection_reduction_requested` as the terminal handoff to `002-reducers-and-projections`; exclude reducer state and policy outputs [Evidence: the terminal boundary is recorded in `implementation-summary.md`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify: The mode envelope preserves shared authorization, hash-chain, sequence, causal, and replay fields — every event type passes the shared required-field matrix [Evidence: targeted Vitest passed 14/14]
- [x] T016 Verify: The event union covers the complete run and scoring-matrix behavior — lifecycle, design, trial, observation, lineage, validity, and reduction handoff are all represented [Evidence: all 67/67 stems passed the append/read matrix]
- [x] T017 Verify: Matrix identity survives parallel completion and retries — model/path, task/family, treatment, protocol, seed, perturbation, and workload keys remain stable [Evidence: adversarial matrix-drift test passed in `model-benchmark-ledger-schema.vitest.ts`]
- [x] T018 Verify: Raw evidence survives derived scoring — raw output, raw score, usage, latency, judge, oracle, contamination, and validity references remain append-only [Evidence: raw/derived separation tests passed in `model-benchmark-ledger-schema.vitest.ts`]
- [x] T019 Verify: Version changes are replay-safe — exact, compatible, migrate, pin-old-runtime, and blocked paths preserve source hashes and upcast provenance [Evidence: compatibility and upcast tests passed in `model-benchmark-ledger-schema.vitest.ts`]
- [x] T020 Verify: Shared services are referenced rather than duplicated — evaluator, canary, calibration, promotion, receipt, budget, and authority ownership remains outside this child [Evidence: imported ownership is recorded in `implementation-summary.md`]
- [x] T021 Verify: Reducer scope is preserved — no fold, projection, selection certificate, materialized policy, or gauge schema appears before `002-reducers-and-projections` [Evidence: the scope audit is recorded in `implementation-summary.md`]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (targeted Vitest and strict spec validation)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next sibling**: See `002-reducers-and-projections` for reducer and projection ownership
<!-- /ANCHOR:cross-refs -->
