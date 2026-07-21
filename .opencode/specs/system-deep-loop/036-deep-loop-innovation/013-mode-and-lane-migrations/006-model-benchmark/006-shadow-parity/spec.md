---
title: "Feature Specification: Model Benchmark - Shadow Parity"
description: "Plan the Model Benchmark variant's shadow-parity harness over the typed event-ledger substrate: run multi-model benchmark executions and scoring-matrix reductions beside the legacy emitter, compare projections event-for-event, and block authority cutover on any unexplained semantic difference while reusing deep-improvement-common services."
trigger_phrases:
  - "Model Benchmark shadow parity"
  - "model-benchmark ledger migration"
  - "multi-model scoring matrix parity"
  - "model benchmark legacy projection diff"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Model Benchmark parity to event and matrix projection comparison"
    next_safe_action: "Freeze paired run inputs and matrix parity acceptance criteria"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Model Benchmark - Shadow Parity

> Phase adjacency under `006-model-benchmark` (independent planning contracts, not a hard runtime dependency): predecessor `005-resume-adapter`; successor `007-rollback-and-mode-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Model Benchmark mode over the deep-improvement-common backbone) |
| **Origin** | Phase 013 mode-and-lane migrations, mode 006; shadow-parity planning after the Model Benchmark schema, reducer, sealing, and receipt contracts |
| **Child depends_on** | `[]` |
| **Inputs** | Phase-014 health and degeneration shadow framework; phase-012 shared mode contracts and write-set conflict graph; phase-012 contract freeze; Model Benchmark siblings `001-typed-ledger-schema` through `005-resume-adapter`; mode 004 Deep Improvement Common Services; 036/002 findings registries |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Model Benchmark lane evaluates multiple models and execution paths over a scoring matrix of task instances, task families,
recipes, protocol treatments, workload profiles, and evaluator epochs. Its behavior is not a terminal leaderboard row: a run
must preserve the benchmark recipe, model and executor identity, common anchors, adaptive diagnostic allocation, raw trial
observations, score vectors, calibration and judge evidence, contamination lineage, usage, latency, uncertainty, coverage, and
the disposition of every matrix cell. The existing and planned Model Benchmark contracts identify these facts as the mode-owned
run and scoring surface over the shared deep-improvement-common backbone.

The migration adds a typed ledger path beside the legacy benchmark emitter, but a valid typed event stream or a matching final
rank does not prove behavioral equivalence. Completion order can alter a matrix, a changed recipe can make cells incomparable,
missing usage can masquerade as efficiency, adaptive sampling can hide weak families, and judge or contamination drift can
reverse a ranking without changing its shape. The parity harness therefore runs both paths from one frozen run context, pairs
their Model Benchmark events, and compares mode-specific projections after every matched boundary while the legacy path remains
authoritative.

This phase plans that proof. It consumes the phase-014 health and degeneration shadow framework for coherent cursors, telemetry
gaps, recovery observations, and non-authoritative action requests. It reuses the mode 004 Deep Improvement Common Services
evaluator, canary, promotion, receipt, budget, health, and generic parity contracts. It adds only Model Benchmark-specific run
identity, trial and scoring-matrix events, workload and contamination evidence, validity fields, projections, fixtures, and
parity reporting. It does not re-implement shared evaluator, canary, or promotion behavior, and it does not move authority.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A paired shadow runner that feeds the same immutable benchmark recipe, run manifest, model/executor matrix, task and fixture
  set, common-anchor and diagnostic-tail policy, evaluator epoch, judge configuration, workload profile, seed policy, baseline,
  contamination visibility, and budget context to the legacy emitter and typed ledger adapter.
- A Model Benchmark event map covering run declaration and design, capsule and workload sealing, trial admission and dispatch,
  completion, failure and unknown outcomes, raw observations, score vectors, usage and latency, judge calibration, oracle and
  contamination evidence, validity, matrix reduction handoff, and terminal run state.
- Stable event pairing by run, matrix cell, task and family identity, candidate and model/executor fingerprint, treatment and
  perturbation, logical step, causal links, and canonical sequence; completion timing and provider serialization are volatile only
  under an explicit versioned allowlist.
- Model Benchmark projection checkpoints after each matched event boundary for run lifecycle, matrix-cell disposition, raw trial
  evidence, score state, uncertainty, coverage, common-anchor membership, adaptive allocation, judge validity, contamination,
  workload, cost, latency, shared-service references, and terminal outcome.
- A mismatch taxonomy and immutable parity receipt for input inequality, missing, extra, duplicate, reordered, malformed,
  unauthorized, stale, unsupported-version, evaluator-integrity, contamination, validity, workload, projection, telemetry-gap,
  and nondeterministic differences.
- Fixtures for healthy multi-model runs, model-by-task reversals, paired anchors, adaptive diagnostic tails, partial matrices,
  missing usage, judge and rubric perturbations, contamination and disclosure, workload tails, score-policy changes, replay,
  resume, duplicate delivery, late completion, and shared-service veto or promotion-preparation outcomes.
- Integration with the phase-014 shadow framework for health observations, `telemetry_gap`, `not_evaluable`, degeneration,
  recovery, and action-request parity; all requests remain observations until an authorized boundary handles them.
- A cutover-blocking parity report consumed by `007-rollback-and-mode-gate` and the later staged authority phase; the report is
  evidence only and never a cutover certificate.

### Out of Scope
- Re-implementing the typed envelope, transition authorization, append-only ledger, upcasters, reducers, sealed artifact
  primitives, receipt recovery, typed budgets, locks, or generic replay rules owned by shared phases and Model Benchmark siblings.
- Re-implementing the Deep Improvement Common Services evaluator, canary, promotion, health, generic shadow comparator, or
  shared veto semantics. This child calls those contracts and compares their references.
- Defining a new benchmark rubric, changing model selection policy, changing evaluator thresholds, or choosing a production
  model. The harness observes the pinned versioned contracts and proves their migration parity.
- Flipping authority, migrating live in-flight state, retiring legacy writers, issuing a cutover certificate, or implementing the
  successor rollback and mode gate.
- Implementing the six sibling concerns, the other two benchmark variants, or the parent integration gate.
- Implementing the per-mode 013 migrations before phase 012 freezes shared contracts and emits the write-set conflict graph.
- Hand-writing generated `description.json` or `graph-metadata.json` metadata for this folder.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both paths consume one frozen Model Benchmark execution | The parity report binds the same BASE, recipe, run manifest, model/executor matrix, task and fixture digests, anchor policy, diagnostic policy, evaluator epoch, judge configuration, workload, contamination visibility, seed, baseline, and budget context; input divergence blocks the case |
| REQ-002 | The Model Benchmark lifecycle has a complete typed event map | Every run, design, sealing, trial, observation, score, validity, contamination, calibration, reduction-handoff, resume, and terminal boundary has a named mode event or explicit shared-service mapping |
| REQ-003 | Mode events compare event-for-event | Canonical event type, matrix-cell identity, task and family identity, model/executor identity, treatment, causal links, sequence, protected payload, shared references, and receipt identity match; missing, extra, duplicate, reordered, ambiguous, unauthorized, and unsupported events fail parity |
| REQ-004 | Canonicalization cannot hide scoring-matrix drift | Volatile transport fields have a versioned allowlist and reason; model, executor, recipe, task, family, treatment, anchor, adaptive allocation, raw output, score, uncertainty, coverage, judge, contamination, validity, usage, latency, and terminal fields remain protected |
| REQ-005 | Model Benchmark projections match at every boundary | Run state, matrix cells, raw observations, score versions, uncertainty, coverage, anchor and diagnostic status, calibration, contamination, workload, cost, latency, shared vetoes, receipts, and terminal disposition have equal canonical fingerprints |
| REQ-006 | Raw and operational evidence remains addressable | Raw outputs, item and family observations, usage, latency tails, errors, abstentions, retries, judge evidence, evaluator epochs, exposure lineage, and selection-policy inputs survive normalization, reduction, replay, and ranking changes |
| REQ-007 | Paired and adaptive matrix evidence remains distinct | Common anchors, family quotas, adaptive diagnostic selection, selection propensities, confirmatory status, and underpowered or missing cells are compared as separate evidence classes; adaptive omission cannot become superiority evidence |
| REQ-008 | Shared services remain one source of truth | Model Benchmark references mode 004 evaluator, canary, promotion, health, receipt, budget, veto, and mismatch contracts; variant-local fields cannot clear shared vetoes or replace common transitions |
| REQ-009 | Phase-014 shadow integration remains observation-only | Health, degeneration, recovery, `telemetry_gap`, and `not_evaluable` observations use one coherent cursor and watermark; action requests do not stop, dispatch, cancel, spend, mutate a baseline, or change authority |
| REQ-010 | Parity evidence is reproducible and cutover-blocking | Every fixture binds path versions, contract digests, stream and projection fingerprints, mismatch evidence, and exit status; only a complete green report with zero unexplained differences may be consumed by the successor gate, and it cannot authorize cutover |
<!-- /ANCHOR:requirements -->

### Shadow-parity acceptance contract

The mode is parity-green only when each required fixture produces a canonical legacy stream and typed-ledger stream with equal
eligible event coverage, order, event type, logical identity, matrix-cell identity, model and execution-path identity, task and
family identity, treatment, causal links, protected payload, shared-service references, and projection fingerprint. The
comparator may ignore only fields named in the versioned volatility allowlist, such as process-local timing or transport
correlation values. Every allowlisted field must still be present, correctly typed, and proven non-semantic.

Authority cutover remains blocked until all of the following are green:

- **Event completeness**: 100% of eligible Model Benchmark event boundaries have one legacy and one typed match; missing, extra,
  duplicate, reordered, unauthorized, malformed, and unknown-version events are zero.
- **Matrix semantic parity**: 100% of protected run, cell, model, executor, task, family, treatment, anchor, diagnostic,
  score, uncertainty, coverage, validity, contamination, usage, latency, and terminal fields match their canonical values.
- **Evidence integrity**: raw trial observations, judge and evaluator references, workload receipts, exposure lineage, and policy
  identities remain addressable; missing usage, stale inputs, unsupported versions, and insufficient evidence are explicit states.
- **Decision parity**: score-policy, calibration, contamination, hard-floor, veto, incomplete, inconclusive, and shared promotion
  preparation dispositions agree at every boundary; the typed path cannot authorize or mutate a selection.
- **Replay parity**: complete replay, checkpoint replay, matrix-order permutations, resume, late completion, and duplicate delivery
  reproduce event matches, projection fingerprints, mismatch identities, and verdicts deterministically.
- **Health-framework parity**: phase-014 observations use the same evidence boundary; `telemetry_gap`, `not_evaluable`, and
  degeneration signals block a pass where required data is unavailable and never become direct action authority.
- **Operational safety**: shadow execution performs no production model dispatch, hidden-case disclosure, evaluator or canary
  mutation, baseline mutation, promotion, authority write, or legacy-writer bypass.

The final report is `PASS` only when every blocking criterion is green and every tolerated representation difference is listed in
the versioned normalization manifest. `MISMATCH`, `INCONCLUSIVE`, `TELEMETRY_GAP`, `INSUFFICIENT_EVIDENCE`, stale watermark,
unsupported adapter, or empty eligible corpus is a blocking result, not a soft pass. The later mode gate may consume a passing
report, but this child never issues a cutover certificate.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One immutable Model Benchmark run context drives legacy and typed paths, and every eligible event boundary has a deterministic pair identity.
- **SC-002**: The complete multi-model lifecycle matches event-for-event with zero missing, extra, duplicate, reordered, unauthorized, unsupported, or unexplained protected-field differences.
- **SC-003**: Matrix and run projections match after every boundary for cell identity, raw observations, score state, uncertainty, coverage, validity, contamination, workload, operational cost, and terminal state.
- **SC-004**: Common anchors, adaptive diagnostic evidence, task-family clustering, judge calibration, contamination lineage, and missing or insufficient evidence remain visible and comparable.
- **SC-005**: Phase-014 health and degeneration observations are coherent, replayable, fail closed on gaps, and never change legacy stop, dispatch, budget, promotion, or authority behavior.
- **SC-006**: Model Benchmark consumes mode 004 shared services without duplicate evaluator, canary, promotion, or common parity semantics and adds only namespaced run and scoring logic.
- **SC-007**: A reproducible parity receipt with zero unexplained differences is accepted by `007-rollback-and-mode-gate` as evidence; authority remains with the legacy path until later staged cutover.

**Given** a multi-model benchmark run is emitted by both paths, **When** each legacy boundary is paired with its typed event,
**Then** the comparator records a match or a typed blocking mismatch without dropping, inventing, or reordering a semantic event.

**Given** a scoring policy, evaluator epoch, recipe, workload, model build, or task lineage changes, **When** the pair is replayed,
**Then** raw observations remain intact, the changed dependency is visible, and incomparable projections return `INCONCLUSIVE` or
`TELEMETRY_GAP` rather than a score match.

**Given** a partial matrix, missing usage, contamination warning, judge disagreement, hard veto, or insufficient evidence occurs,
**When** parity evaluates the boundary, **Then** both paths expose the same protected disposition and no derived ranking becomes a
selection authority.

**Given** phase-014 reports degeneration or missing telemetry, **When** the shadow harness consumes the observation, **Then** it
records the same cursor and evidence boundary and leaves all action authority with shared control and later cutover contracts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False parity from final leaderboard equality** - A matching rank can conceal changed task coverage, model or executor identity,
  raw evidence, judge validity, contamination, usage, latency, or veto state. Mitigation: compare canonical events and projections
  after every boundary.
- **Input confounding** - A path can appear equivalent while receiving a different recipe, workload, evaluator epoch, task pool,
  model build, or hidden-case visibility. Mitigation: bind one immutable context digest and fail before execution on inequality.
- **Over-broad canonicalization** - Dropping completion order or provider fields can hide a changed treatment or matrix cell.
  Mitigation: protect semantic identity and allow only reviewed transport normalization with retained raw values.
- **Adaptive sampling bias** - A diagnostic tail can omit a weak task family and make a model appear stronger. Mitigation: compare
  common anchors, quotas, selection policy, propensity, confirmatory status, and underpowered dispositions explicitly.
- **Evidence loss through score reduction** - A rank or mean can erase item-level failures, uncertainty, contamination, or cost.
  Mitigation: retain raw observations and versioned score and matrix projections beside every derived result.
- **Judge, rubric, or contamination drift** - Calibration, protocol position, fresh-case exposure, or validity changes can reverse a
  selection while preserving the output shape. Mitigation: bind evaluator and judge digests, perturbation results, exposure lineage,
  and validity states to each pair.
- **Workload and usage mismatch** - Null token or cost data and isolated-call timing can make operational parity appear green.
  Mitigation: compare usage provenance, tail latency, throughput, SLO, error, abstention, and workload-shape references; missing data
  is not zero.
- **Shared-service fork** - A variant-local comparator could weaken evaluator, canary, promotion, health, or veto semantics.
  Mitigation: consume mode 004 contracts through one adapter and reject local common-service transitions.
- **Authority creep and duplicate effects** - Shadow code could dispatch models, disclose hidden cases, mutate a baseline, or promote.
  Mitigation: isolated sinks, non-authoritative flags, receipt assertions, and a zero-authority-write gate.
- **Dependencies**: phase-014 health and degeneration shadow framework; phase-012 shared mode contracts and write-set conflict
  graph; phase-012 shared contract freeze; parent compatibility bridge; mode 004 Deep Improvement Common Services; Model Benchmark
  siblings `001-typed-ledger-schema` through `005-resume-adapter`; existing benchmark scripts and fixtures; the 036/002 registries;
  and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which legacy benchmark emission boundaries are canonical when one sweep expands one model/task cell into multiple output rows,
  and what logical identity preserves the original grouping?
- Which model, executor, prompt, tool, workload, recipe, evaluator, and judge fields are protected semantics versus transport
  volatility, and what digest rule proves the allowlist cannot hide a matrix change?
- Which common cases are confirmatory anchors, which are adaptive diagnostics, and what family-coverage and sequential-inference
  policy governs their parity boundary?
- Which partial matrix states can show a descriptive rank, and which must remain `INCONCLUSIVE`, `INSUFFICIENT_EVIDENCE`, or
  diagnostic-only until the certificate and mode gate contracts consume them?
- How should missing provider usage, unknown external outcomes, late completions, and duplicate cells be represented when the legacy
  emitter already owns an effect and the typed path must remain observational?
- Which phase-014 health observations and action requests are required for Model Benchmark, and which remain generic control-plane
  references without introducing a mode-local health policy?
- What parity receipt fields and failure severities does `007-rollback-and-mode-gate` require before it can accept evidence for
  rollback readiness or later authority review?

These questions are resolved while freezing the comparator, protected-field and normalization manifests, fixture corpus, and parity
receipt schema. Until then, the safe disposition is blocked or indeterminate and the legacy path remains authoritative.
<!-- /ANCHOR:questions -->
