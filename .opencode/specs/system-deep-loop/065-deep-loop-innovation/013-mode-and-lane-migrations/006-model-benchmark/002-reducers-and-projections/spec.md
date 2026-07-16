---
title: "Feature Specification: Model Benchmark — Reducers & Projections"
description: "Plan the deterministic reducers and live projections for the model-benchmark variant: multi-model runs, benchmark matrix cells, raw trial evidence, and uncertainty-aware scoring. The reducers replay the typed event ledger into iteration/convergence state, a content-addressed artifact index, a scoring matrix, and per-mode status without side effects, while consuming the shared deep-improvement evaluator, canary, and promotion services."
trigger_phrases:
  - "model benchmark reducers and projections"
  - "model benchmark scoring matrix migration"
  - "deterministic model benchmark replay"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped matrix reducers to model-run and scoring projections"
    next_safe_action: "Freeze matrix fold inputs against 001-typed-ledger-schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Model Benchmark — Reducers & Projections

> Phase adjacency under the 006 parent (grouping order, not a runtime dependency): predecessor `001-typed-ledger-schema`; successor `003-sealed-artifacts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (model-benchmark variant) |
| **Origin** | Phase 005 of the model-benchmark migration under phase 013 |
| **Depends on** | None as a sibling planning contract; consumes the preceding typed schema and shared deep-improvement services |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Model Benchmark runs several model, task, fixture, evaluator, and execution cells as one scoring matrix. The current
runtime has no model-benchmark-specific deterministic projection contract that can reconstruct matrix progress, preserve
raw trial evidence, or explain how a ranking was produced after a restart. A terminal leaderboard is not sufficient: the
run must retain which model was evaluated on which task profile, which recipe and evaluator epoch were used, whether a
cell was skipped or inconclusive, and which score policy produced each reduced value.

The previous sibling freezes the typed model-benchmark event log. This phase defines the pure fold over that log and the
projection families that make it useful: iteration/convergence state, a content-addressed artifact index, a scoring
matrix, and shared per-mode status. The fold must not call models, evaluators, judges, filesystem discovery, clocks,
randomness, or promotion services. The same canonical event sequence must always yield identical projection bytes and a
projection fingerprint.

### Purpose

Define the model-benchmark reducers and projections on top of the deep-improvement-common services from mode 004.
Model-specific logic is limited to multi-model run identity, matrix-cell progress, benchmark recipe and workload
provenance, scoring-matrix reduction, uncertainty and coverage views, and model-benchmark status. The shared evaluator,
canary, promotion, rollback, and veto semantics remain owned by deep-improvement-common and are consumed through their
versioned events and projections. This is planning only. The per-mode 010 migrations land after phase 012 freezes the
shared contracts and emits the write-set conflict graph.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A canonical pure fold over the typed Model Benchmark event envelope from `001-typed-ledger-schema`, using the shared
  reducer, ordering, duplicate, schema-version, serialization, and fingerprint rules from deep-improvement-common.
- Stable matrix-cell identity and deterministic traversal for model reference, task or fixture set, benchmark recipe,
  evaluator epoch, execution profile, seed, and treatment. The projection distinguishes observed, pending, skipped,
  failed, abstained, inconclusive, and invalid cells without inferring missing results.
- An iteration/convergence projection for run and iteration lifecycle, matrix waves, coverage quotas, adaptive item
  selection, cell progress, budget observations, unresolved evidence, stop signals, and resumable frontiers.
- A content-addressed artifact index for run manifests, resolved model descriptors, task and fixture digests, benchmark
  recipe signatures, prompt and toolchain references, raw outputs, usage and latency receipts, score events, pairwise
  comparisons, and reduction-policy versions. Raw trial references remain available after ranking changes.
- A deterministic scoring-matrix projection that separates raw observations, normalized scores, pairwise or multi-model
  comparisons, uncertainty intervals, reliability and calibration facts, contamination or validity dispositions, cost and
  latency slices, coverage, and derived rankings. Aggregate rank cannot erase a veto, abstention, missing evidence, or
  invalid evaluator state.
- Consumption of the shared deep-improvement evaluator, canary, promotion, receipt, veto, and rollback projections,
  including evaluator-epoch matching and explicit shadow/canary/ship/paused/aborted/rolled-back/inconclusive states.
- Model-benchmark replay fixtures, complete-versus-checkpointed rebuild rules, projection hashes, matrix-order
  permutation tests, duplicate and late-event handling, and compatibility tests against the preceding typed schema.

### Out of Scope

- Defining or changing the Model Benchmark typed event envelope, event namespace, authorization references, or ledger
  append implementation owned by `001-typed-ledger-schema`.
- Defining the canonical sealed artifact format owned by `003-sealed-artifacts`; this phase stores immutable references
  and lifecycle facts needed by the projections.
- Defining selection certificates, transfer certificates, rollback certificates, or the independent mode gate owned by
  later model-benchmark siblings.
- Reimplementing deep-improvement-common evaluator, canary, promotion, rollback, receipt, veto, or shared per-mode
  status logic. Model Benchmark consumes those contracts and adds only its matrix and scoring extensions.
- The six sibling concerns and the mode gate, authority cutover, legacy-writer retirement, runtime fan-out/fan-in
  redesign, or the per-mode 010 migration write-set execution.
- Calling model providers, running evaluators, reading mutable benchmark directories, changing score policy, writing
  artifacts, or mutating persisted state during replay.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reducer is a pure deterministic fold over canonical typed events | The same ordered event bytes, schema version, and reducer version produce byte-identical iteration state, artifact index, scoring matrix, per-mode status, and fingerprint without I/O, clock, randomness, network, model, evaluator, or mutable configuration access |
| REQ-002 | Matrix identity and event semantics are explicit | A stable cell key covers model, task or fixture profile, recipe, evaluator epoch, execution profile, treatment, and seed; duplicate IDs are idempotent, unsupported versions fail closed or use a named upcaster, and ambiguous ordering cannot advance a cell silently |
| REQ-003 | Multi-model iteration and convergence state is replayable and resumable | Fixtures reconstruct run and iteration state, matrix waves, required coverage, cell dispositions, budget observations, unresolved evidence, stop signals, and resume frontier from events alone |
| REQ-004 | The artifact index preserves complete model-trial lineage | Index entries retain run, model, alias, provider, task, fixture, recipe, prompt, toolchain, evaluator, epoch, seed, raw output, receipt, cost, latency, validity, and reduction-policy references without replacing raw observations with ranks |
| REQ-005 | Scoring remains policy-versioned and uncertainty-aware | Raw observations, normalized scores, pairwise results, aggregate estimates, uncertainty intervals, calibration or reliability facts, contamination status, coverage, and ranking policy are separate addressable records; unsupported or underpowered comparisons remain abstained or inconclusive |
| REQ-006 | Shared evaluator, canary, and promotion services remain one source of truth | Model Benchmark references common evaluator capsules, canary outcomes, promotion states, receipts, and hard vetoes; no model-specific reducer can redefine shared stage transitions or clear a common veto |
| REQ-007 | Per-mode status is shared plus model-specific | The common status fields and transition vocabulary are preserved while the model-benchmark extension exposes active matrix profile, incumbent or baseline, matrix coverage, ranking state, and blocking cells without forking common status semantics |
| REQ-008 | Full replay and incremental checkpointing are equivalent | Replaying the complete event history and applying validated batches from a checkpoint yield identical projection bytes, matrix entries, index contents, state hash, and per-mode status |
| REQ-009 | Effects stay outside the fold | Reducers return state or typed rejection only; model execution, evaluation, artifact sealing, certificate issuance, promotion, rollback, and external writes occur in event-producing services with receipts |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Golden multi-model histories prove complete and checkpointed replay produce byte-identical projection families and fingerprints.
- **SC-002**: Matrix-cell permutations, duplicate terminal events, late observations, and supported upcasts produce deterministic results or explicit safe rejection; insertion order never changes a valid projection.
- **SC-003**: Iteration/convergence state reconstructs matrix progress, coverage, unresolved evidence, budget observations, and stop disposition without reading model or evaluator files.
- **SC-004**: The artifact index preserves raw model outputs, task and recipe provenance, evaluator epochs, receipts, usage, latency, validity, and score-policy lineage after rankings are recomputed.
- **SC-005**: The scoring matrix exposes policy-versioned estimates and uncertainty while retaining abstentions, invalid cells, contamination findings, underpowered comparisons, and common vetoes.
- **SC-006**: Model Benchmark consumes deep-improvement-common evaluator, canary, promotion, and status contracts unchanged except for namespaced matrix and scoring extensions; no shared service is reimplemented.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Order-dependent rankings** - completion order, provider response order, or concurrent insertion could change matrix
  aggregates. Mitigation: derive stable cell keys, canonical sort keys, and deterministic tie or missing-data rules before
  reduction; test all event permutations.
- **Evidence loss through leaderboard reduction** - retaining only a mean or rank would prevent recalibration, pairwise
  inference, contamination analysis, and model-versus-task diagnosis. Mitigation: keep raw observations and immutable
  references beside every versioned normalized and aggregate result.
- **Model identity drift** - aliases, provider versions, prompt changes, recipe changes, or workload changes can make two
  cells appear comparable when they are not. Mitigation: require digest-bound resolved model, recipe, evaluator, fixture,
  execution-profile, and workload references in the cell key and artifact index.
- **Adaptive sampling bias** - information-guided cell selection can hide weak models or under-cover task strata.
  Mitigation: project mandatory coverage quotas, selection policy and propensity metadata, confirmatory anchors, and
  underpowered or out-of-support dispositions rather than treating selected cells as an unbiased sample.
- **Proxy or judge capture** - a high score can coexist with evaluator bias, contamination, latency failure, or weak-slice
  regression. Mitigation: preserve judge/calibration/contamination/validity projections and consume common canary and veto
  states before any ranking or promotion view is considered eligible.
- **Shared-contract divergence** - Model Benchmark could fork evaluator or promotion semantics from the other three
  deep-improvement workstreams. Mitigation: use common event and status fixtures, keep variant fields namespaced, and make
  the phase-012 write-set conflict graph a downstream integration gate.
- **Dependencies**: model-benchmark `001-typed-ledger-schema`; deep-improvement-common mode 004 reducers and shared
  evaluator/canary/promotion contracts; `003-sealed-artifacts` for immutable references; phase 012 shared mode contracts
  and write-set conflict graph; the 065/002 findings registries; and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen predecessor schema and common-service contract:
- Which event fields form the canonical matrix-cell key, and which experiment metadata remains an opaque artifact reference?
- Is the scoring matrix one composite projection or separate model, task, metric, pairwise, and workload projections sharing one event frontier?
- Which partial matrix states are eligible for a descriptive rank, a selection certificate, a promotion view, or only diagnostic display?
- How are adaptive-selection propensities, mandatory coverage quotas, and confirmatory anchors represented without allowing a reducer to infer missing trials?
- Which model alias, recipe, evaluator, fixture, workload, or score-policy changes require a new matrix epoch rather than an upcast or compatible continuation?
<!-- /ANCHOR:questions -->
