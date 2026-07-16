---
title: "Implementation Plan: Model Benchmark - Sealed Reference Artifacts"
description: "Implementation Plan for the model-benchmark sealed reference-artifacts phase. The plan adapts the common phase-006 sealing primitive to benchmark recipes, multi-model matrices, raw cell observations, scoring evidence, contamination lineage, and workload-aware selection without reimplementing deep-improvement-common services."
trigger_phrases:
  - "model benchmark sealed artifacts implementation plan"
  - "model benchmark scoring matrix plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped model cells, scoring evidence, and workload lineage to common sealing"
    next_safe_action: "Resolve matrix canonicalization and evidence boundaries with common contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Model Benchmark - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / model-benchmark mode |
| **Change class** | Model-run identity, sealed observations, scoring matrix, and operational evidence |
| **Execution** | Additive shadow path after the common reducer and sealing contracts; no authority cutover here |

### Overview

This phase makes the model-benchmark experiment reproducible at its evidence boundaries. It adapts the phase-006 sealing primitive already established by deep-improvement-common into one model-specific contract: a benchmark recipe is sealed before matrix expansion, every resolved model cell binds its exact executor and workload inputs, raw outputs remain immutable, and the scoring matrix derives new references without rewriting observations. Common evaluator, canary, and promotion services remain the single shared implementation; Model Benchmark contributes only matrix execution, model comparison, statistical scoring, contamination/workload evidence, and selection views. The successor `004-certificates-and-receipts` binds eligible sealed evidence into attestations.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `002-reducers-and-projections` publishes artifact-index, evaluator-epoch, scoring-status, canary-status, promotion-status, and projection-fingerprint inputs consumed by this phase
- [ ] `004-deep-improvement-common/003-sealed-artifacts` publishes the canonicalization, digest, dependency, seal-on-write, publication, and verification contract
- [ ] The model-benchmark field matrix names every recipe, run, cell, observation, score, contamination, calibration, workload, and derived-selection dependency
- [ ] Model and execution identity are separated and crossed according to the benchmark claim; provider, build, variant, permissions, and capability fields are resolved before dispatch
- [ ] Common anchors, adaptive diagnostic cases, item-family resampling, judge calibration, contamination state, and workload profile are explicit before scoring is designed
- [ ] Ownership is separated from deep-improvement-common evaluator/canary/promotion services and from `004-certificates-and-receipts`
- [ ] Matrix mutation, partial-cell, hidden-visibility, missing-usage, stale-case, contamination, calibration, workload, and mixed-version fixtures are identified

### Definition of Done

- [ ] Benchmark recipes, runs, cells, raw observations, scoring matrices, and operational evidence are content-addressed, sealed on write, immutable after publication, and verified on read through the common phase-006 primitive
- [ ] Common anchors and adaptive diagnostic evidence are separated, with family coverage and statistical assumptions retained in the sealed matrix
- [ ] Judge, rubric, contamination, workload, quality, cost, and latency evidence remain reproducible after reducer or scoring-policy changes
- [ ] The model-benchmark adapter consumes common evaluator, canary, promotion, veto, and read-failure contracts without semantic forks
- [ ] Strict validation and the phase verifier pass without tracked changes outside the phase implementation scope
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Single sealing adapter**: expose one model-benchmark API over the common phase-006 primitive for canonicalize, digest, seal, publish, inspect, and verify. The adapter owns no alternate hash, signature, chain, storage, or trust-root behavior.
- **Benchmark recipe**: seal profile version, mode, matrix axes and order, model/executor descriptors, framework or prompt references, fixture and task-family manifests, sample and seed policy, scoring recipe, correctness gates, reporting group, visibility policy, and deployment workload profile as one dependency-closed identity.
- **Run manifest**: expand the recipe into stable model-cell identities before dispatch. Record requested and resolved model/provider/build/variant, executor kind, capability and permission fingerprint, framework, fixture, sample, seed, workload, and prerequisite references; retries reuse the same cell identity and distinguish attempt identity.
- **Frozen cell input**: bind the workflow prefix and environment snapshot where the experiment claims model-only intervention, plus prompt/framework digest, fixture/task digest, model configuration, tools, visibility, seed, and sample. A changed treatment or environment creates a new cell input.
- **Raw observation bundle**: preserve response or trajectory bytes, tool and action traces, per-item result, score observations, judge inputs/outputs, errors, retries, tokens, cost, TTFT, inter-token and end-to-end latency, throughput, SLO status, abstention, and integrity state before any reducer.
- **Scoring matrix**: derive immutable matrix revisions from raw rows. Keep model-by-executor crossings, common-anchor rows, adaptive diagnostics, task-family grouping, rubric axes, candidate-specific calibration, paired deltas, uncertainty, multiplicity correction, and explicit winner/tie/inconclusive/block state.
- **Evidence selection**: require common sealed anchors for paired promotion inference; adaptive cases may fill diagnostic gaps under declared information and family-coverage rules but carry their selection policy and confirmatory status so missing or non-comparable rows cannot silently rank a model.
- **Validity and contamination**: seal judge calibration, rubric perturbation results, oracle provenance, source dates, visibility, first exposure, disclosure, retirement, replacement lineage, duplicate or semantic contamination findings, and reference-model difficulty evidence. Hidden case content remains behind the common visibility boundary.
- **Operational profile**: keep quality eligibility separate from deployment utility. Bind context length, concurrency, traffic, output length, prefix reuse, multi-turn behavior, realized cost, error and abstention cost, switching overhead, latency tails, throughput, and SLO violations to the same workload identity.
- **Tamper-evident read path**: verify digest, canonical bytes, schema, dependency closure, lifecycle, matrix completeness, evaluator epoch, visibility, contamination, calibration, workload, and scoring-policy compatibility. Return typed `missing`, `digest_mismatch`, `dependency_mismatch`, `schema_unsupported`, `incomplete_matrix`, `epoch_mismatch`, `stale`, `contaminated`, `calibration_invalid`, `workload_mismatch`, or `quarantined` results rather than fallback content.
- **Shared-service boundary**: call the deep-improvement-common evaluator, canary, and promotion services through their shared adapter. Model Benchmark may add run and scoring payloads but may not redefine evaluator identity, canary lifecycle, promotion admissibility, hard vetoes, or certificate/receipt semantics.
- **Successor handoff**: expose stable sealed references and evidence boundaries to `004-certificates-and-receipts`; certificate and receipt materialization remains outside this phase.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Confirm `002-reducers-and-projections` publishes the artifact index, evaluator epoch, status, and projection fingerprints required for model-benchmark references.
- Read the common phase-006 sealing contract and record its canonicalization, digest coverage, dependency closure, seal-on-write, publication, verification, and failure semantics; reject any model-local replacement.
- Inventory `MODES.md`, `dispatch-model.cjs`, `sweep-benchmark.cjs`, `sweep-reporter.cjs`, profile validation, benchmark fixtures, and output history; classify each input or output as shared service, model adapter, immutable evidence, or derived projection.
- Build the recipe, run, cell, raw-observation, scoring, validity, contamination, and workload field/dependency matrix, including hidden versus candidate-visible fields and common versus model-owned fields.
- Pin representative fixtures for a complete model-vs-model run, crossed model/executor run, partial matrix, common-anchor/adaptive split, judge calibration failure, contaminated case, missing usage, workload mismatch, and eligible or blocked selection.

### Phase 2: Implementation

- Define the single phase-006-backed model-benchmark sealing adapter and typed artifact references, dependency manifests, lifecycle states, verification results, and failure vocabulary.
- Define canonical serialization and digest coverage for benchmark recipes, ordered matrix cells, model/executor descriptors, workload profiles, fixtures, task families, samples, and nested scoring policies.
- Define seal-on-write validation, atomic publication, read-back verification, immutable overwrite refusal, retry identity, and incomplete-cell handling.
- Define the sealed benchmark recipe and run manifest, including profile version, mode, model set, executor set, framework, fixture, sample, seed, visibility, scoring, reporting, and workload dependencies.
- Define resolved model-cell inputs and raw outputs for frozen workflow/environment state, capability and permission fingerprints, prompt/framework and fixture references, responses, traces, usage, cost, latency, errors, retries, and integrity observations.
- Define scoring-matrix revisions that retain raw item and family rows while deriving correctness gates, rubric axes, paired deltas, rank probabilities, intervals, multiplicity treatment, and winner/tie/inconclusive states.
- Define common-anchor and adaptive-diagnostic membership, item-family resampling units, family quotas, information-based selection inputs, sequential or confirmatory boundaries, and exclusion reasons.
- Define candidate/task-cluster judge calibration, rubric-axis perturbation checks, oracle uncertainty, protocol robustness, contamination/exposure lineage, hidden visibility, freshness, retirement, and replacement references.
- Define workload and operational aggregation for quality, latency, throughput, SLO, realized cost, error, abstention, and switching evidence without substituting output-word ratios for measured cost.
- Define tamper-evident reads and typed refusal states for missing, digest, dependency, schema, matrix, epoch, visibility, contamination, calibration, workload, stale, and quarantine failures.
- Define common evaluator, canary, and promotion adapter calls plus redacted candidate-facing views without copying shared service logic or exposing hidden fixtures and terminal evidence.
- Add reference-only integration points for `004-certificates-and-receipts`; keep certificate, receipt, effect recovery, and authority materialization out of this phase.

### Phase 3: Verification

- Verify equivalent canonical recipes, matrix orderings, and dependency closures produce identical references, while any model, executor, fixture, sample, seed, scoring, visibility, workload, or dependency change produces a new identity.
- Inject interruption before publication, duplicate and concurrent writes, partial cells, missing rows, missing usage, and dependency removal; assert no partial or overwritten artifact is accepted.
- Tamper with bytes, manifests, model descriptors, capability fingerprints, hidden commitments, cell membership, scoring revisions, contamination state, and workload fields; assert typed fail-closed reads.
- Replay complete and checkpointed matrices after reducer, judge calibration, normalization, or scoring-policy changes; compare raw references and derived decisions without mutating sealed observations.
- Verify model-only claims use independently crossed model and execution identities, while complete-stack comparisons are explicitly labeled as such.
- Verify common anchors remain paired, adaptive diagnostics respect family quotas and declared inference boundaries, and insufficient coverage cannot produce a winner.
- Verify judge, rubric, oracle, contamination, hidden-visibility, and freshness failures block or qualify selection without revealing protected content.
- Verify workload and operational evidence remains attached to the recipe and that quality floors, latency, cost, error, abstention, and switching evidence cannot be collapsed into a fabricated scalar.
- Verify the model adapter consumes shared evaluator, canary, promotion, veto, and read-failure fixtures with identical semantics to the common contract.
- Run strict spec validation and the phase-specific quality gate on the exact implementation candidate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract tests route every model-benchmark artifact through the phase-006 adapter and reject alternate seal metadata or verification paths |
| REQ-002 | Canonicalization and property tests mutate profile, matrix, model, executor, fixture, scoring, visibility, workload, and each dependency to prove stable identity and change detection |
| REQ-003 | Crash, retry, duplicate, and concurrent-publication fixtures cover validation, seal, write, read-back, immutable overwrite refusal, and partial-cell rejection |
| REQ-004 | Tamper, missing, truncation, unsupported-schema, matrix, epoch, visibility, contamination, calibration, workload, stale, and quarantine fixtures return typed refusal without fallback bytes |
| REQ-005 | Run fixtures verify stable cell IDs, model/executor crossing, resolved capabilities, matrix ordering, profile version, fixtures, seeds, samples, visibility, and workload binding |
| REQ-006 | Cell fixtures reproduce frozen workflow/environment inputs and retain raw responses, traces, usage, cost, latency, errors, retries, and integrity observations |
| REQ-007 | Scoring fixtures compare raw item/family rows with derived rubric, judge, paired, uncertainty, multiplicity, and selection references after policy changes |
| REQ-008 | Anchor/adaptive fixtures enforce common pairing, family quotas, selection provenance, confirmatory status, and explicit missing-coverage refusal |
| REQ-009 | Validity and contamination fixtures cover candidate/task-cluster calibration, rubric perturbations, oracle uncertainty, source exposure, hidden visibility, retirement, replacement, and semantic contamination |
| REQ-010 | Workload fixtures preserve quality, latency tails, throughput, SLO, realized cost, error, abstention, and switching evidence and reject ratio-only selection |
| REQ-011 | Shared-contract fixtures run the same evaluator, canary, promotion, veto, and read-failure cases through common and model adapters and compare decisions |
| REQ-012 | Successor fixtures bind model-benchmark sealed references to certificate/receipt inputs without materializing successor-owned attestations |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The primary inputs are `004-deep-improvement-common/002-reducers-and-projections` for artifact indexes, evaluator epochs, status projections, and score references, and `004-deep-improvement-common/003-sealed-artifacts` for all canonicalization, digest, publication, lifecycle, and verification behavior. The successor `004-certificates-and-receipts` consumes the model-benchmark sealed run, cell, observation, scoring, validity, and workload references. The phase also depends on the phase 012 shared mode contracts, the phase 012 shared-contract freeze and write-set conflict graph before later 010 fan-out, the existing model-benchmark profile validator, dispatcher, sweep, reporter, fixtures, and the spec-kit validator. Deep-improvement-common evaluator, canary, promotion, and veto services are consumers of this adapter boundary, not implementations to duplicate here.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation is additive at the model-benchmark artifact and read boundaries. If sealing, matrix replay, scoring, or shared-service parity fails, stop publishing or consuming the new references, preserve all already sealed bytes and append-only ledger evidence, and restore the prior sweep reader or projection snapshot through the migration bridge. Do not delete, overwrite, re-seal, or reinterpret an old response, trace, score, contamination record, or workload observation to repair a verifier. Mark affected references quarantined or superseded through the existing transition path, rebuild derived matrix views from the last known-good frontier, and use a path-scoped `git revert` to restore prior adapters. Retained raw observations and fixtures make a corrected run reproducible after retry; authority remains on the legacy path until a later mode cutover explicitly accepts the replacement.
<!-- /ANCHOR:rollback -->
