---
title: "Feature Specification: Model Benchmark - certificates and receipts"
description: "Plan the model-benchmark variant certificate and receipt contract over the typed event-ledger substrate: per-run multi-model benchmark attestations, per-transition receipts, scoring-matrix replay fingerprints, and independent offline verification while reusing deep-improvement-common evaluator, canary, and promotion services."
trigger_phrases:
  - "model benchmark certificates and receipts"
  - "model benchmark scoring matrix"
  - "offline verification of model benchmark receipts"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped model benchmark attestations to matrix evidence and shared services"
    next_safe_action: "Freeze matrix fingerprint inputs after sealed artifacts land"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Model Benchmark - Certificates and Receipts

> Phase adjacency under the model-benchmark parent (grouping order, not a runtime dependency): predecessor `003-sealed-artifacts`; successor `005-resume-adapter`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (model-benchmark variant over the deep-improvement-common backbone) |
| **Origin** | Phase 007 of the model-benchmark mode migration: per-run certificates, per-transition receipts, replay fingerprints, and offline verification |
| **Manifest dependency** | `depends_on: []`; sibling adjacency is navigation and ordering, not a hard runtime dependency |
| **Shared inputs** | `003-sealed-artifacts`, deep-improvement-common evaluator/canary/promotion services, typed ledger and reducer contracts |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The model-benchmark lane compares multiple complete model or executor policies over a scoring matrix. Its decision is not
one scalar leaderboard row: the matrix must preserve task-family coverage, paired item evidence, judge calibration,
contamination lineage, protocol conditions, workload behavior, realized cost, latency, and uncertainty. The findings registry
identifies model-by-task reversals, candidate-specific judge calibration, contamination as an item-lineage state machine,
adaptive evaluation after minimum coverage, and the distinction between pairwise rank and operational value as load-bearing
model-benchmark concerns (`findings-registry-modes.json`, model-benchmark insights from iterations 31-35).

The shared ledger and sealed-artifact primitives are established by earlier phases, and deep-improvement-common owns the
evaluator, canary, and guarded-promotion services. This phase plans only the model-benchmark attestation layer over those
contracts. A per-run `CERTIFICATE` must state which model/executor cells were evaluated, which sealed benchmark recipe and
workload profile governed them, how the scoring matrix was reduced, and what selection claim the evidence supports. A
per-transition `RECEIPT` must record each benchmark state change or selection-relevant transition without copying the full
run evidence. Both must bind to a canonical replay fingerprint that an independent verifier can recompute without calling
any live model, judge, router, or network service.

The phase is planning only. It does not re-implement the shared evaluator, canary, or promotion services, does not make a
model selection authoritative, and does not move the ledger out of additive-dark operation. The later resume adapter
consumes the receipt and fingerprint boundary; the later mode gate consumes parity and offline-verification evidence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Per-run `CERTIFICATE`**: a typed attestation for one complete model-benchmark run, including run lineage, benchmark
  recipe, sealed anchors and diagnostic-tail policy, model/executor matrix, workload profile, evaluator capsule reference,
  raw-observation manifest, scoring matrix, calibration profile, contamination evidence, cost and latency observations,
  uncertainty, policy result, replay fingerprint, and declared selection outcome.
- **Per-transition `RECEIPT`**: a typed attestation for benchmark opening, model-cell execution, scoring, judge calibration,
  contamination assessment, adaptive allocation, matrix reduction, selection proposal, block, abort, or restore transitions,
  using the shared receipt vocabulary, predecessor links, effect identity, idempotency, and uncertain-effect recovery.
- **Model-benchmark replay fingerprint**: canonical ordered inputs for the shared contract versions, benchmark recipe,
  sealed task pools, model/executor descriptors, workload treatment, scoring matrix, calibration, contamination lineage,
  seeds, budgets, admission decisions, retries, and reduction rules; storage-local and wall-clock values are excluded unless
  explicitly declared semantic.
- **Independent offline verifier**: a verifier that resolves content-addressed artifacts, validates sealed references,
  recomputes matrix dimensions and ordering, replays deterministic scoring and statistical reductions, checks calibration,
  contamination, workload, hard vetoes, receipt continuity, and emits its own verifier receipt without live model or network
  calls.
- **Variant-owned scoring logic**: model-by-task and model-by-executor crossing, common sealed anchors plus adaptive
  diagnostic-tail allocation, pairwise and task-family inference, cost/latency utility, protocol robustness, and selection
  result representation. These are adapter inputs to shared services, not replacements for them.
- **Research-derived validity evidence**: candidate-specific judge calibration, model-build provenance for reviewer
  independence, task-family clustered uncertainty, private or fresh-case lineage, protocol-by-model/task crossing, and
  workload-shaped operational metrics identified in `findings-registry-modes.json`.

### Out of Scope
- Implementing the sealed-artifact primitives owned by `003-sealed-artifacts`; this phase consumes their immutable
  references, digest closure, visibility rules, and tamper-evident reads.
- Implementing the shared deep-improvement evaluator, canary, or promotion services; model-benchmark supplies typed recipe,
  matrix, and policy adapters and reuses the common service contract.
- Implementing the typed ledger schema or reducers owned by the sibling `001-typed-ledger-schema` and
  `002-reducers-and-projections` phases.
- Implementing the `005-resume-adapter`; this phase publishes receipt-chain, fingerprint, and uncertain-effect rules for it.
- Authority cutover, legacy-writer retirement, router deployment, or treating a public leaderboard as a deployment decision.
- Re-running the research registries or adding model-selection capabilities outside the model-benchmark migration boundary.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A complete model-benchmark run emits one typed `CERTIFICATE` | The certificate identifies run lineage, benchmark recipe, sealed task pools, model/executor matrix, workload profile, evaluator/canary/promotion references, raw evidence, scoring matrix, calibration, contamination state, realized cost/latency, replay fingerprint, and explicit outcome; missing required evidence blocks certification |
| REQ-002 | Every benchmark state-changing or selection-relevant transition emits a `RECEIPT` | Each receipt records transition kind, predecessor receipt(s), service/version, effect identity, input/output digests, attempt, fingerprint, authorization result, and `completed`, `vetoed`, `uncertain`, or `recovered` outcome; duplicate delivery is idempotent |
| REQ-003 | Certificate and receipt fingerprints include all semantic model-benchmark inputs | Changing the recipe, task family, sealed item pool, model build, executor path, workload, metric, rubric, calibration, contamination evidence, seed, budget, retry, reducer, or predecessor receipt changes the fingerprint; storage offsets and wall-clock values do not |
| REQ-004 | An independent verifier can validate the run offline | The verifier resolves sealed digests, recomputes canonical serialization, matrix and score reductions, statistical uncertainty, calibration, contamination and workload checks, receipt continuity, and hard gates without live model, judge, router, or network calls |
| REQ-005 | Matrix evidence preserves the correct experimental unit | Common sealed anchors support paired candidate comparison, adaptive diagnostic cells follow family-coverage quotas, seeds and perturbations remain nested under task families, and the certificate records the matrix rather than flattening correlated rows |
| REQ-006 | Scoring distinguishes rank from operational selection value | Pairwise or preference estimates, task-family deltas, quality floors, latency, cost, abstention, switching overhead, and uncertainty remain separately addressable; a small or weight-sensitive gap yields `INSUFFICIENT_EVIDENCE`, a Pareto set, or a conditional route rather than an unjustified winner |
| REQ-007 | Judge, rubric, contamination, and protocol validity are explicit | Candidate-specific calibration and model-build provenance are bound to the evidence; rubric axes are tested for isolation; contamination includes exposure lineage; protocol variations are crossed with model and task rather than averaged away |
| REQ-008 | The variant reuses deep-improvement-common services | Model-benchmark calls one shared evaluator, canary, promotion, certificate, receipt, fingerprint, and hard-veto contract; variant adapters cannot fork common evidence fields, outcome semantics, or promotion ordering |
| REQ-009 | The contract remains additive and dark | Certificates, receipts, and offline verdicts are emitted beside the legacy benchmark path, cannot change live router or authority state, and retain legacy projections and evidence during rollback |
| REQ-010 | The successor and later fan-out receive stable handoffs | `005-resume-adapter` receives explicit replay, salvage, uncertain-effect, unsupported-version, and block cases; the later 010 migration consumes this contract only after the shared contracts and write-set conflict graph are frozen |

### Model-benchmark certificate and receipt evidence boundary

The `CERTIFICATE` is the run-level statement. It attests that a named benchmark recipe and workload profile evaluated a
named set of model/executor cells under a named evaluator epoch, that the required sealed anchors, diagnostic allocations,
raw observations, scoring matrix, calibration, contamination, and operational measurements are present, and that the
declared selection result follows the versioned policy. It is not a claim that one model is globally best. The certificate
must include content digests for the benchmark recipe, task corpus or private-case lineage, sealed artifact bundle, model
and executor descriptors, workload profile, evaluator capsule, metric/rubric, calibration profile, normalizer/reducer,
contamination evidence, and all referenced receipts. It must retain raw cell observations and derived matrix manifests,
including excluded or uncertain cells, the budget ledger, stable run and model identities, the canonical fingerprint, and an
explicit shared outcome such as `PASS`, `FAIL`, `ABORT`, or `INSUFFICIENT_EVIDENCE`. A model-specific selection payload may
then report a Pareto set, conditional route, or unresolved comparison without changing the shared outcome vocabulary.

The `RECEIPT` is the transition-level statement. The model-benchmark vocabulary covers `benchmark_started`,
`model_cell_started`, `model_cell_completed`, `score_matrix_reduced`, `judge_calibrated`, `contamination_checked`,
`diagnostic_tail_allocated`, `selection_proposed`, `selection_blocked`, `aborted`, and `restored`. A receipt records the
transition authorization result, effect idempotency key, predecessor receipt ids, input and output digests, attempt number,
service version, replay fingerprint, and an explicit `completed`, `vetoed`, `uncertain`, or `recovered` outcome. An external
model, judge, or measurement effect that may have run before its receipt became durable remains `uncertain` until the shared
effect-recovery policy resolves it; process exit alone never implies success.

### Replay-fingerprint input contract

The canonical fingerprint input is an ordered, length-delimited serialization of: shared contract and schema versions;
stable run, lineage, benchmark, task-family, model, executor, and workload identities; benchmark recipe, task-pool,
sealed-anchor, diagnostic-selection, and source-lineage digests; evaluator capsule, canary epoch, metric, rubric,
normalizer, reducer, calibration, contamination detector, and promotion-policy versions; model build, provider, prompt,
tool, permission, sampling, and execution descriptors; matrix axes and logical cell order; raw-observation manifest;
protocol perturbations; random seeds; budget, deadline, admission, retry, timeout, and adaptive-allocation decisions;
realized cost and latency accounting; predecessor receipts and sealed-artifact references; and the exact verifier ruleset.
The serializer normalizes maps by key, arrays by declared logical order, numeric values by the contract representation, and
absent values by explicit tags. It excludes wall-clock time, local paths, database row offsets, process ids, network
addresses, and signature-envelope bytes unless a service explicitly declares one semantic. A verifier reports the first
mismatching input class and refuses substituted, partial, or current-checkout-derived inputs.

### Offline verification contract

An independent verifier first checks schema support and content-addressed retrieval, then validates sealed-artifact digests
and dependency closure, recomputes the certificate fingerprint, receipt-chain links, matrix axes and coverage quotas, raw
observation manifests, metric and normalization results, candidate-specific calibration, clustered uncertainty, contamination
lineage, protocol robustness, cost/latency accounting, and hard policy gates. It must distinguish `PASS`, `FAIL`, `VETOED`,
`INCOMPLETE`, and `UNSUPPORTED_VERSION`; it may not convert an absent cell to a zero score, ignore an unknown field, treat a
public ranking as proof of deployment fitness, or call a model to fill missing evidence. The verifier emits its own
verification receipt bound to the certificate fingerprint, verifier version, ruleset digest, and evidence digests so later
audits can identify verifier drift.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A complete model-benchmark run emits one content-addressed `CERTIFICATE` and an idempotent receipt chain with a frozen shared schema and explicit outcome vocabulary.
- **SC-002**: An independent offline verifier reproduces the replay fingerprint, scoring matrix, calibration, uncertainty, contamination, workload, hard gates, and receipt-chain continuity from sealed inputs only.
- **SC-003**: The certificate preserves common anchors, adaptive diagnostic cells, task-family clustering, raw cell observations, and model-specific scoring evidence without replacing them with one aggregate rank.
- **SC-004**: Model selection separates pairwise preference, quality floors, cost, latency, abstention, switching overhead, uncertainty, and Pareto or conditional outcomes; unresolved evidence cannot become a pass.
- **SC-005**: Model-benchmark reuses deep-improvement-common evaluator, canary, and promotion services, consumes `003-sealed-artifacts`, remains additive-dark, and hands a stable receipt/fingerprint boundary to `005-resume-adapter`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Certificate becomes a leaderboard row** - A scalar rank can hide task-family regressions, correlated samples, operational cost, or uncertainty. Mitigation: retain the full scoring matrix, raw cell manifest, clustered inference, quality floors, and selection sensitivity in the certificate.
- **Model and execution path are confounded** - Comparing router A with live B can measure complete stack differences rather than model differences. Mitigation: cross model identity and execution path where the claim requires it, and bind both dimensions to every cell and receipt.
- **Adaptive sampling breaks paired inference** - Candidate-specific item paths can destroy comparability or omit rare failure families. Mitigation: use common sealed anchors, explicit family quotas, a diagnostic tail, and confirmatory separation or sequentially valid inference.
- **Judge calibration or independence is overstated** - Role prompts do not establish independent reviewers, and one shared calibration can reverse a sign. Mitigation: bind model-build provenance, candidate-specific oracle calibration, uncertainty, and judge reliability to the matrix evidence.
- **Contamination or protocol drift invalidates selection** - A recent or named fixture is not proof of non-exposure, and formatting or system-prompt variants can reorder models. Mitigation: retain item lineage, visibility, rotation and retirement state, fresh-case comparisons, and model-by-task protocol strata.
- **Cost-aware scoring favors the wrong model** - Quality-per-dollar hides hard quality floors, tail latency, abstention, and switching loss. Mitigation: keep operational terms separate, require quality constraints, and expose Pareto or utility sensitivity instead of an unqualified ratio.
- **Shared-service fork** - Variant code may copy evaluator, canary, promotion, or receipt logic. Mitigation: one adapter boundary, shared fixtures, common hard-veto ordering, and a negative test against variant-local semantics.
- **Unknown external outcome** - A model or measurement effect can complete before its receipt is durable. Mitigation: consume phase-006 effect/receipt recovery, preserve `uncertain`, and require explicit resolution before retry or selection.
- **Dependencies**: `003-sealed-artifacts` primitives; typed ledger and reducer siblings; deep-improvement-common evaluator/canary/promotion services; phase 012 shared mode contracts and write-set conflict graph; model-benchmark runtime paths and research registries; the successor `005-resume-adapter`; and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen common-service and sealing contracts:
- Which exact model-benchmark matrix axes are mandatory for every run, and which are optional declared treatments without weakening paired comparability?
- Which cells belong to the common confirmatory anchor pool versus the adaptive diagnostic tail, and what family-coverage and exposure caps are required before allocation can widen?
- Which scoring estimands and uncertainty corrections are selected for pairwise preference, task-family deltas, and operational utility, and how are multiplicity and sensitivity reported?
- Which model-build, provider, prompt, and executor descriptors are sufficient to claim reviewer independence or execution-path crossing without exposing secrets?
- Which contamination lineage states and fresh-suite thresholds veto a selection, and which uncertain items remain diagnostic but are excluded from promotion evidence?
- Which receipt recovery states must `005-resume-adapter` reuse, reexecute, compensate, or block for model-cell and scoring effects?
<!-- /ANCHOR:questions -->
