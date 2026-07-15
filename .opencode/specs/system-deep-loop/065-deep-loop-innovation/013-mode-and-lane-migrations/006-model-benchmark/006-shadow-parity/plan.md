---
title: "Implementation Plan: Model Benchmark - Shadow Parity"
description: "Implementation Plan for the Model Benchmark shadow-parity phase: pair multi-model benchmark and scoring-matrix behavior from the legacy emitter with the typed ledger path, reuse Deep Improvement Common Services, compare event-aligned projections, and emit a blocking parity receipt without changing authority."
trigger_phrases:
  - "Model Benchmark shadow parity implementation plan"
  - "model benchmark scoring matrix parity plan"
  - "typed ledger legacy benchmark comparison"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Bounded parity around Model Benchmark runs and scoring projections"
    next_safe_action: "Define paired adapters, protected matrix fields, and parity fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Model Benchmark - Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Model Benchmark mode (013 mode 006, phase 006) |
| **Change class** | Shadow verification harness and model-benchmark parity contract |
| **Execution** | Planning-only child; legacy emitter remains authoritative and shared services are reused |

### Overview
The phase defines the Model Benchmark shadow path over the typed event ledger. A mode adapter observes the legacy multi-model
run and scoring-matrix lifecycle, the ledger adapter emits the corresponding typed events, and a comparator evaluates both
streams from one frozen benchmark recipe, matrix manifest, task corpus, evaluator epoch, and workload context. The comparator
checks event-for-event parity and projection equality for cells, raw trials, scores, uncertainty, coverage, validity,
contamination, and operational evidence. Mode 004 Deep Improvement Common Services supplies evaluator, canary, promotion,
health, receipts, budgets, and generic parity behavior; this phase adds only Model Benchmark run and scoring logic. A parity
receipt is the handoff artifact, not a cutover certificate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-009 shared contracts and phase-012 mode interfaces, fixture rules, and write-set conflict graph are pinned inputs
- [ ] Phase-011 health and degeneration shadow inputs, cursors, policy digests, telemetry-gap states, and non-authoritative action semantics are available
- [ ] Mode 004 exposes evaluator, canary, promotion, receipt, budget, health, and generic parity ports without a variant-local reimplementation
- [ ] Model Benchmark legacy boundaries are inventoried for run, trial, scoring, calibration, contamination, workload, resume, and terminal behavior
- [ ] The canonical event tuple, protected matrix fields, normalization manifest, mismatch taxonomy, and parity receipt schema are frozen
- [ ] The fixture corpus freezes model/executor cells, task families, common anchors, diagnostic tails, recipes, evaluator epoch, workload, and expected dispositions
- [ ] The legacy emitter and typed ledger path can receive one coherent run context with isolated output sinks

### Definition of Done
- [ ] Every required Model Benchmark fixture has a legacy stream, typed stream, canonical diff, projection comparison, and reproducible receipt
- [ ] Event-for-event parity has zero unexplained semantic differences across run, cell, score, validity, contamination, workload, and terminal behavior
- [ ] Matrix permutations, complete replay, checkpoint replay, resume, late completion, and duplicate delivery are deterministic
- [ ] Common anchors, adaptive diagnostic evidence, family coverage, missing evidence, and operational usage remain explicit
- [ ] Phase-011 health observations remain shadow-only and fail closed on telemetry gaps or stale watermarks
- [ ] Mode 004 common services are consumed through shared contracts without duplicate evaluator, canary, or promotion semantics
- [ ] A green parity report blocks later cutover but cannot authorize cutover, dispatch, promotion, or legacy-writer retirement
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Frozen run input**: bind BASE, benchmark recipe and signature, run manifest, model/build/executor matrix, task and fixture
  digests, task-family and treatment keys, common-anchor and adaptive-tail policy, evaluator and judge epochs, workload profile,
  contamination visibility, seeds, baseline, environment, and typed budget before either path starts.
- **Legacy observer**: observe run declaration, design, cell admission, model execution, raw trial output, score reduction,
  calibration, validity, contamination, workload accounting, resume, and terminal behavior without rewriting legacy state.
- **Ledger shadow adapter**: emit typed Model Benchmark events through shared envelope, authorization, receipt, and replay seams in
  dark mode; preserve stable run, cell, model, executor, task, family, treatment, trial, and policy identities.
- **Common-service boundary**: call mode 004 evaluator, canary, promotion, health, budget, receipt, veto, and generic comparator
  facilities; add only Model Benchmark event names, matrix fields, scoring evidence, and fixture inputs.
- **Canonical comparator**: compare `(eventType, runId, matrixCellId, taskInstanceId, taskFamilyId, modelFingerprint,
  executionPath, treatment, stepKey, producerSeq, causalLinks, stablePayloadDigest, sharedServiceRefs, projectionFingerprint)`
  in canonical order; classify missing, extra, duplicate, reorder, identity, score, validity, workload, and projection differences.
- **Projection oracle**: fold both streams into run state, matrix cells, raw observations, score vectors, uncertainty, coverage,
  anchor and diagnostic status, judge/calibration, contamination, workload, cost/latency, shared-service, resume, and terminal views.
- **Health shadow adapter**: consume phase-011 observations at one ledger cursor and projection watermark; record health,
  degeneration, `telemetry_gap`, `not_evaluable`, recovery, and action-request parity without invoking any requested action.
- **Fixture and receipt store**: retain frozen inputs, both streams, canonical streams, matrix snapshots, projection fingerprints,
  mismatch records, shared-service references, and parity receipts in isolated non-authoritative output.
- **Authority guard**: shadow execution cannot dispatch production models, reveal hidden cases, mutate evaluators or canaries, write
  a baseline, promote a selection, allocate new authority, or issue a cutover certificate.

### Protected parity dimensions

| Dimension | Required comparison | Allowed treatment |
|-----------|---------------------|-------------------|
| Run identity | BASE, recipe, run, matrix, evaluator, workload, environment, budget | No tolerance for changed semantic dependencies |
| Cell identity | Model/build, execution path, task, family, treatment, seed, anchor/diagnostic role | Array position may vary only after canonical logical sorting |
| Trial evidence | Raw output, item/family result, score vector, judge evidence, usage, latency, error, retry | Preserve raw values; normalize only declared serialization |
| Matrix state | Admission, pending, complete, failed, unknown, invalid, abstained, inconclusive, excluded | No missing cell may become zero or success |
| Score state | Metric/rubric, normalization, uncertainty, calibration, multiplicity, selection policy | Policy changes create an epoch or explicit inconclusive result |
| Validity lineage | Oracle, contamination, exposure, disclosure, retirement, replacement, protocol perturbation | Hidden contents remain digest-bound and unavailable |
| Workload state | Context, concurrency, traffic, output, throughput, TTFT, tail latency, SLO, cost, switching | Missing usage remains missing, never inferred from output length |
| Shared control | Evaluator, canary, promotion, veto, receipt, health, rollback target | Shadow output cannot authorize a transition |
| Projection state | Run, matrix, coverage, raw evidence, ranking, terminal disposition, fingerprint | Compare after every event boundary |
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase-009 shared contracts, phase-012 mode interfaces and write-set boundary, phase-011 shadow framework, parent
  compatibility bridge, mode 004 common-service ports, and Model Benchmark sibling ownership boundaries.
- Inventory actual legacy Model Benchmark boundaries for benchmark recipe and run setup, model/executor expansion, cell admission,
  trial dispatch and result capture, score and matrix reduction, calibration, contamination, workload measurement, resume, and
  terminal reporting.
- Freeze the fixture manifest, model/executor treatments, task families, anchor and diagnostic policy, evaluator and judge
  identities, workload profiles, protected fields, normalization rules, mismatch classes, and parity receipt schema.

### Phase 2: Implementation
- Define the Model Benchmark event namespace and legacy-to-ledger mapping for run, design, sealing, admission, dispatch,
  completion/failure/unknown, observation, usage, score, calibration, validity, contamination, workload, reduction handoff, and
  terminal events.
- Define the paired-run record and legacy observer with stable run, matrix-cell, model, executor, task, family, treatment, trial,
  receipt, evaluator, judge, workload, and policy identities.
- Reuse the mode 004 comparator and common services; add namespaced Model Benchmark rules for matrix-cell identity, anchor and
  diagnostic status, family coverage, score vectors, uncertainty, validity, contamination, and operational evidence.
- Define projection folds and deterministic replay oracles for run lifecycle, matrix progress, raw trials, score state,
  calibration, coverage, adaptive selection, contamination, workload, cost/latency, resume, and terminal status.
- Define the phase-011 health adapter, coherent watermark checks, `telemetry_gap` and `not_evaluable` handling, recovery
  comparison, and observation-only action requests.
- Build the fixture matrix for healthy runs, partial cells, task-family reversals, adaptive tails, missing usage, judge/rubric
  perturbations, contamination, workload profiles, score-policy changes, replay, resume, duplicate delivery, late completion,
  veto, and promotion-preparation outcomes.
- Emit a BASE-bound parity receipt and a blocking disposition for any input mismatch, semantic difference, evidence gap,
  evaluator-integrity failure, unsupported version, nondeterministic replay, or shadow authority write.

### Phase 3: Verification
- Run every fixture through legacy and typed paths from the same frozen context and compare input digests before accepting output.
- Verify canonical event count, order, types, matrix identities, task/family keys, model/executor treatment, causal links,
  payload digests, shared references, and projection fingerprints.
- Verify matrix projections preserve complete, partial, failed, unknown, invalid, abstained, inconclusive, anchor, diagnostic,
  and underpowered states without inferring absent trials.
- Verify raw observations, score versions, uncertainty, calibration, contamination lineage, usage, latency, workload, and
  selection-policy evidence remain addressable across replay and reduction-policy changes.
- Verify phase-011 healthy, degeneration, recovery, stale, missing, and unsupported observations remain non-authoritative.
- Verify complete replay, checkpoint replay, matrix-order permutations, resume, late completion, and duplicate delivery produce
  stable matches, fingerprints, mismatch classes, and verdicts.
- Run common fixtures through mode 004 service contracts and reject any variant-local evaluator, canary, promotion, veto, or health
  semantics.
- Pass only a complete `PASS` receipt with zero unexplained protected differences to `007-rollback-and-mode-gate`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Paired-context fixtures prove identical BASE, recipe, run, matrix, model/executor, task/family, anchor, evaluator, judge, workload, contamination, seed, baseline, and budget digests |
| REQ-002 | Review the event map against every run, design, sealing, trial, observation, score, validity, contamination, calibration, workload, resume, and terminal boundary; fail on unmapped transitions |
| REQ-003 | Compare canonical streams position-by-position and fail on missing, extra, duplicate, reordered, identity, treatment, causal, payload, receipt, shared-reference, or projection differences |
| REQ-004 | Unknown-field, changed recipe, model/build, evaluator epoch, task lineage, score policy, workload, and non-allowlisted volatility fixtures prove semantic changes cannot be normalized away |
| REQ-005 | Fold both streams and compare run, matrix cells, raw trials, score vectors, uncertainty, coverage, anchor and diagnostic status, calibration, validity, contamination, workload, and terminal projections |
| REQ-006 | Replay score-policy, calibration, contamination, workload, and ranking changes while retaining raw item/family observations, judge evidence, usage, latency, and exposure references |
| REQ-007 | Common-anchor, adaptive-tail, family-quota, propensity, partial-matrix, and underpowered fixtures prove omitted diagnostics cannot become superiority evidence |
| REQ-008 | Invoke mode 004 evaluator, canary, promotion, health, receipt, budget, veto, and mismatch contracts; reject any variant-local common-service fork |
| REQ-009 | Phase-011 healthy, degeneration, recovery, stale, missing, and unsupported fixtures preserve one cursor and watermark; action requests never stop, dispatch, cancel, spend, or mutate authority |
| REQ-010 | Validate every parity receipt against BASE, mode, common-service, schema, reducer, comparator, fixture, stream, projection, and diff metadata; reject all non-green outcomes as cutover evidence |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The direct inputs are the phase-011 health and degeneration shadow framework, phase-012 shared mode contracts and write-set
conflict graph, phase-009 shared contract freeze, the parent compatibility bridge, and the Model Benchmark siblings
`001-typed-ledger-schema` through `005-resume-adapter`. Mode 004 Deep Improvement Common Services supplies evaluator, canary,
promotion, health, budget, receipt, veto, and generic parity contracts. `007-rollback-and-mode-gate` consumes the passing report
without inheriting authority from this child.

The 065/002 findings require task-conditioned rather than global model strength, explicit difficulty and coverage, frozen and
testable judge/rubric configuration, sealed counterfactual task lineage, private and fresh evaluation data, workload-shaped
operational metrics, paired and clustered inference, contamination evidence, adaptive allocation with retained coverage, and
versioned benchmark signatures. Those findings shape parity fields and fixtures; they do not authorize a new scoring policy or
production cutover. The per-mode 010 migrations remain downstream of phase 009 contract freeze and the emitted write-set conflict
graph.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This child changes planning artifacts only and performs no runtime write or data migration. If the contract fails review, revert
the four phase documents and reopen the parity boundary without touching the legacy benchmark emitter, typed ledger, common
evaluator/canary/promotion services, sealed task pools, or downstream variants.

During later implementation, disable the shadow consumer at its explicit feature boundary while retaining immutable event pairs,
matrix snapshots, and mismatch receipts for diagnosis. The legacy emitter remains authoritative throughout. A failed or
inconclusive parity report is a block; it cannot be converted into a pass by dropping matrix cells, widening normalization,
turning missing usage into zero, ignoring contamination or judge uncertainty, forking common-service semantics, or bypassing the
authorization gateway. Production rollback and authority restoration belong to `007-rollback-and-mode-gate` and the later staged
cutover phase.
<!-- /ANCHOR:rollback -->
