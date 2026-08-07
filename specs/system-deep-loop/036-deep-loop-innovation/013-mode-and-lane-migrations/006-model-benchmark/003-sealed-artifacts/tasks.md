---
title: "Tasks: Model Benchmark - Sealed Reference Artifacts"
description: "Tasks for the model-benchmark sealed reference-artifacts phase, covering the common sealing adapter, benchmark recipe and matrix identity, model-cell evidence, scoring matrix, anchor and adaptive evidence, validity, contamination, workload, tamper-evident reads, and shared-service handoff."
trigger_phrases:
  - "model benchmark sealed artifacts tasks"
  - "model benchmark matrix sealing tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed model benchmark sealing into recipe, cell, score, and validity tasks"
    next_safe_action: "Pin model matrix and raw evidence fixtures against the common seal contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Model Benchmark - Sealed Reference Artifacts

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

- [ ] T001 Confirm `002-reducers-and-projections` publishes the artifact-index, evaluator-epoch, scoring-status, canary-status, promotion-status, and projection-fingerprint inputs
- [ ] T002 Read `004-deep-improvement-common/003-sealed-artifacts` and record canonicalization, digest, dependency, seal-on-write, publication, verification, and failure semantics
- [ ] T003 Inventory `MODES.md`, `dispatch-model.cjs`, `sweep-benchmark.cjs`, `sweep-reporter.cjs`, profile validation, fixtures, and output history as shared service, adapter, immutable evidence, or projection
- [ ] T004 Build the field and dependency matrix for recipes, runs, cells, raw observations, scoring revisions, anchors, diagnostics, calibration, contamination, workload, and redacted views
- [ ] T005 Define ownership boundaries with deep-improvement-common evaluator/canary/promotion services and `004-certificates-and-receipts`
- [ ] T006 Pin complete, partial, mutated, missing-usage, stale-case, contaminated, calibration-failure, hidden-visibility, workload, and mixed-version fixtures
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 [P] Define the single phase-007-backed sealing adapter and typed artifact reference, dependency manifest, lifecycle, verification result, and failure vocabulary
- [ ] T008 [P] Define canonical serialization and digest coverage for recipes, matrix ordering, model/executor descriptors, fixtures, samples, scoring, visibility, and workload dependencies
- [ ] T009 Define seal-on-write validation, atomic publication, read-back verification, immutable overwrite refusal, retry identity, and incomplete-cell handling
- [ ] T010 Define the sealed benchmark recipe and run manifest for mode, model set, executor set, framework, fixture, sample, seed, scoring, visibility, reporting, and workload
- [ ] T011 Define resolved model-cell inputs and raw output references for frozen workflow/environment state, capabilities, permissions, responses, traces, usage, cost, latency, errors, retries, and integrity
- [ ] T012 Define scoring-matrix revisions retaining raw item/family rows, rubric axes, correctness gates, paired deltas, rank probabilities, uncertainty, multiplicity, and winner/tie/inconclusive states
- [ ] T013 Define common-anchor and adaptive-diagnostic membership, family quotas, information-based selection, confirmatory boundaries, and exclusion reasons
- [ ] T014 Define candidate/task-cluster judge calibration, rubric perturbation, oracle uncertainty, protocol robustness, contamination/exposure lineage, hidden visibility, freshness, retirement, and replacement references
- [ ] T015 Define workload and operational evidence for quality, latency, throughput, SLO, realized cost, error, abstention, and switching overhead without fabricated usage values
- [ ] T016 Define tamper-evident reads and typed refusal states for missing, digest, dependency, schema, matrix, epoch, visibility, contamination, calibration, workload, stale, and quarantine failures
- [ ] T017 Define shared evaluator, canary, and promotion adapter calls plus redacted candidate-facing views without private common-service semantics
- [ ] T018 [P] Add reference-only integration points for `004-certificates-and-receipts`; keep certificate, receipt, effect recovery, and authority materialization out of this phase
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Verify equivalent canonical recipes, matrix orderings, and dependency closures produce identical references and every semantic model, executor, fixture, sample, seed, scoring, visibility, workload, or dependency mutation produces a new identity
- [ ] T020 Verify interrupted, retried, duplicate, and concurrent writes never publish partial content or overwrite an existing sealed artifact
- [ ] T021 Verify tampered bytes, manifests, model descriptors, capability fingerprints, hidden commitments, cell membership, scoring revisions, contamination state, and workload fields fail closed
- [ ] T022 Verify complete and checkpointed matrices remain reproducible after reducer, calibration, normalization, and scoring-policy changes without mutating raw evidence
- [ ] T023 Verify model-only claims cross model and execution identity independently and complete-stack comparisons remain explicitly labeled
- [ ] T024 Verify common anchors remain paired, adaptive diagnostics honor family quotas and inference boundaries, and insufficient coverage cannot produce a winner
- [ ] T025 Verify judge, rubric, oracle, contamination, visibility, freshness, and hidden-evidence failures block or qualify selection without exposing protected content
- [ ] T026 Verify quality, latency, throughput, SLO, cost, error, abstention, and switching evidence remains bound to the workload identity and cannot be replaced by a ratio
- [ ] T027 Verify common and model adapters consume identical evaluator, canary, promotion, veto, and read-failure semantics
- [ ] T028 Verify model-benchmark sealed references satisfy the successor certificate/receipt input contract without creating successor-owned attestations
- [ ] T029 Run the phase validator, replay/property suite, crash and mutation suite, matrix-integrity suite, access-boundary suite, and exact-scope diff check
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
