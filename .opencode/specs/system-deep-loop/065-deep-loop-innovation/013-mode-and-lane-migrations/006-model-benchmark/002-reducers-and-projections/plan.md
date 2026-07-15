---
title: "Implementation Plan: Model Benchmark — Reducers & Projections"
description: "Implementation Plan for the model-benchmark reducers and projections phase: a pure fold over the typed multi-model event ledger, deterministic matrix-cell state, raw-trial artifact indexing, uncertainty-aware scoring projections, and shared deep-improvement service status without reimplementing common evaluator, canary, or promotion logic."
trigger_phrases:
  - "model benchmark reducers implementation plan"
  - "model benchmark projection plan"
  - "scoring matrix replay plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped matrix-cell, trial-index, score, and status fold boundaries"
    next_safe_action: "Resolve cell ordering and checkpoint semantics with the predecessor schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Model Benchmark — Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / model-benchmark variant |
| **Change class** | Model-specific pure reducers, projections, replay fixtures, and common-service adapters |
| **Execution** | Planning-only child after the model-benchmark typed schema; downstream migration waits for shared contract freeze |

### Overview

This phase turns the model-benchmark typed event sequence into deterministic live state for a multi-model scoring run.
Event-producing services record authorized run, matrix-cell, trial, scoring, validity, and shared evaluator outcomes;
reducers consume those canonical events and return state without side effects. The projection families expose iteration
and convergence state, a lineage-preserving artifact index, a scoring matrix with uncertainty and coverage, and one
per-mode status contract that extends rather than forks deep-improvement-common.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Model-benchmark `001-typed-ledger-schema` publishes the event envelope, cell identity inputs, version policy, and canonical ordering fields
- [ ] Deep-improvement-common service projections and stage semantics are available for consumption, not reimplementation
- [ ] The projection field matrix names every matrix, trial, score, status, and common-service field, owner, stability rule, and consumer
- [ ] Pure-fold constraints prohibit model calls, evaluator calls, I/O, time, randomness, network access, mutable configuration, and hidden writes
- [ ] Matrix-cell identity, duplicate policy, incomplete-cell behavior, score-policy versioning, uncertainty, validity, and coverage semantics are explicit
- [ ] Replay, checkpoint, matrix-permutation, mixed-version, malformed-event, epoch-mismatch, contamination, and underpowered-comparison fixtures are identified

### Definition of Done

- [ ] Complete and checkpointed replay produce byte-identical projections and fingerprints across matrix event permutations
- [ ] Raw trial evidence, model and recipe lineage, receipts, validity, and score-policy history remain available after reduction changes
- [ ] Model Benchmark consumes common evaluator, canary, promotion, veto, rollback, and status contracts without semantic forks
- [ ] Strict validation and the phase verifier pass without tracked changes outside the model-benchmark implementation scope
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Canonical fold boundary**: accept only the typed, authorized, canonical model-benchmark event form from
  `001-typed-ledger-schema`; apply a pure `reduce(state, event)` and derive canonical serialized projection families
  plus a reducer and projection fingerprint.
- **Event semantics**: use the shared event identity, sequence, causal, schema-version, upcaster, and duplicate rules.
  The reducer uses event-supplied timestamps and references, never invents IDs, never repairs malformed model evidence,
  and never reorders ambiguous events.
- **Matrix-cell identity**: derive a stable key from model/provider identity, resolved model build, task or fixture
  profile, benchmark recipe signature, evaluator epoch, execution/workload profile, treatment, and seed. Maintain a
  canonical cell order independent of provider completion or ledger append concurrency.
- **Iteration/convergence projection**: maintain run and iteration lifecycle, matrix waves, required model/task coverage,
  cell dispositions, adaptive-selection state, budget observations, progress, unresolved evidence, stop signals, and
  resume frontier. It records event decisions; it does not decide that an unobserved cell is equivalent to a skipped one.
- **Artifact index**: index run manifests, model descriptors, aliases, task and fixture digests, recipe and prompt
  signatures, execution profiles, raw outputs, usage, latency, receipts, evaluator epochs, validity findings, score
  observations, pairwise comparisons, and reduction versions. Large payloads remain immutable digest references.
- **Scoring-matrix projection**: keep raw observations separate from normalized values, metric-specific results, pairwise
  or multi-model estimates, confidence or credible intervals, calibration/reliability facts, contamination status,
  coverage, cost, latency, and ranking policy. A ranking is a derived view with a fingerprint, not a replacement for data.
- **Common-service boundary**: consume evaluator capsule identity, canary outcomes, promotion lifecycle, hard vetoes,
  receipts, rollback targets, and inconclusive states from deep-improvement-common. Model-specific projections may expose
  their references and matrix impact but cannot redefine common transitions or clear a common veto.
- **Per-mode status**: publish the common deep-improvement status shape with a model-benchmark extension for active matrix
  profile, baseline/incumbent, matrix coverage, rank-policy version, underpowered cells, and blocking validity states.
- **Checkpoint and rebuild**: checkpoint projection families at an event frontier with schema, reducer, score-policy, and
  projection fingerprints. Full replay and checkpoint continuation must converge to equal bytes and matrix/index/status
  values.

### Model-benchmark projection field groups

| Projection | Required fields | Deterministic rule |
|------------|-----------------|--------------------|
| Iteration/convergence | Run, iteration, wave, cell counts, coverage quotas, budget observations, unresolved evidence, stop and resume state | Stable cell keys and explicit dispositions; no inferred completion from absent events |
| Artifact index | Model, provider, build, task, fixture, recipe, prompt, toolchain, workload, raw output, receipt, cost, latency, validity, score refs | Content-addressed references and append-only raw-trial links; aliases never replace resolved identity |
| Scoring matrix | Raw observations, metric results, normalization, pairwise results, estimates, uncertainty, calibration, contamination, coverage, ranking policy | Policy and epoch fingerprints separate comparable from incomparable values; ties and missing data are explicit |
| Per-mode status | Common service stage, evaluator epoch, active profile, incumbent/baseline, matrix coverage, rank policy, vetoes, rollback target | Common fields use shared transitions; model extension is namespaced and cannot clear common vetoes |
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Confirm the model-benchmark typed schema, identity aliases, event ordering, compatibility policy, and upcaster inputs;
  record the exact event families consumed by each projection.
- Confirm the deep-improvement-common reducer and service contracts, documenting the fields consumed unchanged and the
  narrow model-benchmark extension boundary.
- Build the projection field matrix, stable matrix-cell key, event-to-reducer map, ownership matrix, and consumer
  contract for later model-benchmark migration work.
- Pin representative histories for run start/resume, matrix manifest, cell dispatch/completion, raw observation, score
  normalization, pairwise comparison, coverage, validity, evaluator epoch, canary, promotion, pause, rollback, and stop.

### Phase 2: Implementation

- Define the pure fold shell with shared canonical dispatch, identity/deduplication, version refusal, deterministic
  serialization, event-frontier validation, and projection fingerprints.
- Define matrix-cell reduction for model, task, recipe, evaluator epoch, execution profile, treatment, seed, coverage
  quota, pending/observed/failed/abstained/inconclusive/invalid disposition, and late or duplicate events.
- Define iteration/convergence reduction for matrix waves, adaptive selection decisions, required coverage, budgets,
  unresolved evidence, stop signals, and resumable state without creating missing trial facts.
- Define the artifact index for model and recipe lineage, task and fixture provenance, raw outputs, usage and latency,
  receipts, validity, evaluator references, score events, pairwise observations, and reduction-policy versions.
- Define the scoring-matrix projection for raw and normalized values, metric signatures, pairwise or multi-model
  estimates, uncertainty, calibration/reliability, contamination, cost/latency slices, coverage, and deterministic ranks.
- Attach common evaluator/canary/promotion status and hard veto references through the deep-improvement-common contract;
  do not add model-specific replacements for common stage or rollback semantics.
- Define checkpoint/rebuild, score-policy migration, matrix epoch compatibility, mixed-version fixtures, and redacted
  projection views for downstream consumers.

### Phase 3: Verification

- Replay identical canonical event bytes through fresh and checkpointed reducers and compare projection bytes,
  fingerprints, matrix entries, artifact indexes, and per-mode status.
- Permute valid cell completion order, duplicate terminal events, batch boundaries, and equivalent insertion order; assert
  equal results. Exercise late, missing, malformed, ambiguous, unsupported-version, and stale-epoch events; reject or enter
  explicit safe states.
- Verify raw observations and lineage survive normalization, ranking, metric, calibration, contamination, and score-policy
  changes; underpowered, invalid, abstained, and missing cells cannot silently become ranked evidence.
- Verify common evaluator, canary, promotion, receipt, veto, rollback, and status fields match the shared service fixtures;
  model-specific reducers cannot clear common blockers or emit promotion authority.
- Verify checkpoint rebuild and mixed-version compatibility, effect guards, exact scope, strict spec validation, and the
  phase-specific quality gate on the exact implementation candidate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Property tests run identical canonical event sequences through fresh reducers and assert byte-identical projection families and fingerprints with effect guards enabled |
| REQ-002 | Table-driven fixtures cover stable cell keys, duplicate IDs, completion-order permutations, late events, malformed payloads, ambiguous ordering, unsupported versions, and named upcaster paths |
| REQ-003 | Golden histories cover run/iteration lifecycle, matrix waves, coverage quotas, adaptive selection, budgets, unresolved evidence, stop disposition, and resume frontier |
| REQ-004 | Artifact-index fixtures inspect resolved model, provider/build, task, fixture, recipe, prompt, workload, raw output, usage, latency, receipt, validity, and score-policy references after rebuild |
| REQ-005 | Scoring fixtures preserve raw trials beside normalization, metric, pairwise, uncertainty, calibration, contamination, coverage, cost, latency, and ranking-policy records; underpowered comparisons remain explicit |
| REQ-006 | Contract tests compare Model Benchmark's common evaluator/canary/promotion/status fields and transitions with deep-improvement-common fixtures; common vetoes and rollback targets cannot be overridden |
| REQ-007 | Status fixtures compare common fields across all deep-improvement workstreams and assert model-only matrix extensions are namespaced and non-authoritative over shared fields |
| REQ-008 | Checkpoint and full-history replay produce equal projection hashes, matrix snapshots, artifact indexes, and status snapshots across batch boundaries and supported upcasts |
| REQ-009 | Reducer tests prove no filesystem, network, clock, randomness, model, evaluator, artifact sealing, certificate, promotion, rollback, or external write is reachable |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The direct input is model-benchmark `001-typed-ledger-schema`, which supplies the typed event envelope, matrix identity
fields, ordering, version, and replay inputs. The shared service dependency is deep-improvement-common mode 004, whose
reducers and evaluator/canary/promotion contracts are consumed without copying. The successor `003-sealed-artifacts`
owns the immutable artifact format referenced by this phase; later siblings own certificates and the model-benchmark mode
gate.

The planning evidence is `002-deep-loop-effectiveness-and-fanout/research/findings-registry.json` and
`findings-registry-modes.json`, especially the findings on task-conditioned model strengths, difficulty-aware adaptive
evaluation, frozen benchmark recipes, raw outputs, paired inference, judge calibration, contamination provenance,
workload profiles, latency/cost slices, and uncertainty-aware selection. Phase 012 supplies the shared mode contracts and
write-set conflict graph before downstream integration. The spec-kit validator remains the documentation gate.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation is additive at the projection boundary. If a reducer or scoring projection fails parity, stop consuming
the new model-benchmark projection, preserve the append-only event ledger, raw trials, receipts, and prior projection
snapshot, and restore the prior reader or checkpointed projection frontier. Rebuild from the last known-good event
frontier after correcting the reducer or score-policy version; never mutate or delete ledger events or raw observations
to repair a ranking. A `git revert` of path-scoped phase commits restores the prior projection readers and shared-service
adapters, while retained matrix fixtures make the projection reproducible after retry. No authority cutover or legacy
writer retirement is performed here.
<!-- /ANCHOR:rollback -->
