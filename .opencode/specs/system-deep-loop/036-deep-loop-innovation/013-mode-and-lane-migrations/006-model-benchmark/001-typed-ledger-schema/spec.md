---
title: "Feature Specification: Model Benchmark typed ledger schema"
description: "Plan the Model Benchmark variant's typed append-only event vocabulary over the shared deep-improvement-common backbone. The phase defines the mode envelope specialization, concrete run and scoring-matrix event types, field-level types, provenance and contamination lineage, normalized usage, versioned envelope policy, and upcaster hooks. It stops before reducer and projection design in 002-reducers-and-projections and does not re-implement shared evaluator, canary, or promotion services."
trigger_phrases:
  - "Model Benchmark typed ledger schema"
  - "model-benchmark event vocabulary"
  - "typed ledger model benchmark migration"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T22:59:00Z"
    last_updated_by: "opencode"
    recent_action: "Framed Model Benchmark's typed ledger vocabulary and reducer boundary"
    next_safe_action: "Freeze event names and field contracts against shared ledger inputs"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Model Benchmark Typed Ledger Schema

> Phase adjacency under `006-model-benchmark` (independent sibling planning contracts, not a runtime dependency): predecessor `none` (first sibling); successor `002-reducers-and-projections`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Model Benchmark mode over the deep-improvement-common backbone) |
| **Origin** | Phase 006 of the 013 mode-and-lane migration parent; the model-benchmark research recommendations in `findings-registry-modes.json` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Model Benchmark lane currently has useful execution and scoring behavior but its evidence is not a durable typed event vocabulary. The research registry records that `dispatch-model.cjs` already exposes normalized latency, token, and cost fields while `sweep-benchmark.cjs` discards usage and `sweep-reporter.cjs` substitutes output word count for efficiency (`findings-registry-modes.json`, model-benchmark contradiction at iter 32). The recommendation set calls for `BenchmarkDesign`, `TrialResult`, a versioned `BenchmarkTrial` ledger, sealed task lineage, candidate-specific judge calibration, validity cards, and a task-conditional selection policy rather than an unqualified global winner.

This phase plans the append-only event schema that makes those behaviors replayable and auditable. It consumes the phase-006 transition-authorized ledger core and the phase-012 shared event contracts, while layering only Model Benchmark-specific run and scoring-matrix facts on the deep-improvement-common services from mode 004. The envelope must retain raw observations, task-family and perturbation lineage, model and execution-path identity, contamination evidence, judge identity, normalized usage, and validity state without allowing a reducer to rewrite evidence.

The purpose is a vocabulary contract, not an implementation or a reducer design. The next sibling, `002-reducers-and-projections`, owns folds, projections, selection-certificate reduction, policy materialization, and derived gauges. Shared evaluator, canary, calibration infrastructure, and promotion authority remain shared-service concerns; this phase only declares the Model Benchmark events that consume or reference them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Model Benchmark event-envelope specialization over the transition-authorized ledger envelope: event namespace, aggregate identity, sequence/hash fields, causal links, replay fingerprint, authorization receipt reference, and payload discriminant.
- Concrete append-only event types for run declaration, benchmark design, sealed capsules and workload snapshots, trial admission and dispatch, trial results and failures, score observations, oracle and contamination evidence, judge calibration, validity, and reducer handoff.
- Field-level types for multi-model runs and scoring matrices: model/build identity, execution path, task and family identity, paired treatment, protocol variant, workload envelope, score vector, hard-floor status, usage and latency, evidence references, exposure lineage, and validity state.
- Versioned payload policy, compatibility classification, canonical serialization, event schema hashes, and upcaster hooks for additive changes and explicit major-version refusal.
- The boundary that lets Model Benchmark reference deep-improvement-common evaluator/canary/promotion services without duplicating them, and the boundary that hands immutable event evidence to `002-reducers-and-projections`.
- Schema-focused examples and verification criteria for deterministic replay, parallel trial ordering, raw-score preservation, and append-only evidence lineage.

### Out of Scope
- Reducer algorithms, projection tables, materialized scorecards, selection-certificate calculation, policy ranking, and derived gauges; those belong to `002-reducers-and-projections`.
- Re-implementing shared evaluator, canary generation, promotion, receipt, budget, lock, adjudication, or effect-recovery services from deep-improvement-common or the shared event contracts.
- Authority cutover, legacy-writer retirement, in-flight state migration, or runtime implementation; those remain in the later mode gate and staged cutover phases.
- Defining a new scoring rubric or changing the evaluator/reviewer contract; the schema carries versioned score observations and references the lane-owned contract.
- Running benchmark executions, selecting models, or generating description and graph metadata for this planning packet.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The mode event envelope extends the shared ledger envelope without weakening its authorization, hash-chain, sequence, or replay rules | A field matrix marks every shared required field, every Model Benchmark specialization, and every forbidden omission; unauthorized or malformed events have no valid typed path |
| REQ-002 | The vocabulary covers the complete Model Benchmark run lifecycle and multi-model scoring matrix | A closed event-union table covers declaration, design, capsule/workload sealing, trial admission, dispatch, completion/failure/unknown, score observation, and reducer handoff |
| REQ-003 | Trial facts retain stable task, family, candidate, model, execution-path, treatment, and perturbation identity | Every trial event has typed `taskInstanceId`, `taskFamilyId`, `candidateId`, `modelFingerprint`, `executionPath`, and lineage references sufficient for paired and clustered inference |
| REQ-004 | Raw observations and operational usage remain immutable and separable from derived scores | Trial payloads retain raw-output and input digests, score vectors, judge observations, token and cost usage, latency percentiles, and receipt references without storing a reducer-owned total as source evidence |
| REQ-005 | Sealed task and canary lineage supports contamination and exposure auditing | Capsule, case, exposure, contamination, disclosure, retirement, and replacement fields identify source cutoff, visibility, first exposure, detector evidence, and lineage transitions |
| REQ-006 | Judge and oracle evidence is typed as measurement evidence, not silently promoted to truth | Judge identity, calibration slice, order/style probes, oracle version, uncertainty, abstention, and validity status are explicit; disagreement can remain `unknown` |
| REQ-007 | Envelope and payload versions have explicit compatibility and upcaster hooks | Exact, compatible, migrate, pin-old-runtime, and blocked outcomes are representable; upcasters preserve original hashes and record the applied transformation |
| REQ-008 | The schema is append-only and safe under parallel trial completion | Event identity, logical trial identity, monotonic per-stream sequence, causation, correlation, and deterministic tie-breaking fields prevent completion timing from changing evidence identity |
| REQ-009 | Shared service boundaries remain single-source | The plan names references to deep-improvement-common evaluator/canary/promotion and phase-012 shared contracts; no Model Benchmark duplicate service or competing authority is introduced |
| REQ-010 | The reducer boundary is explicit and navigable | The final vocabulary exposes immutable evidence and a typed reduction handoff to `002-reducers-and-projections`, while defining no reducer state, projection schema, or selection result event |
<!-- /ANCHOR:requirements -->

### Event vocabulary boundary

The planned namespace is `deep-improvement.model-benchmark.*`, with the shared envelope carrying the event type and a discriminated payload. The initial vocabulary is grouped by append-only fact, not by reducer output:

| Event family | Concrete event types | Purpose |
|--------------|----------------------|---------|
| Run lifecycle | `run_declared`, `benchmark_capsule_sealed`, `workload_snapshot_sealed`, `run_started`, `run_paused`, `run_resumed`, `run_closed` | Bind one run to its recipe, workload, shared service versions, and terminal lifecycle facts |
| Design and admission | `benchmark_design_declared`, `trial_block_declared`, `trial_case_admitted`, `trial_case_rejected` | Record paired anchors, adaptive diagnostic candidates, family quotas, treatment factors, and admission reasons |
| Execution | `trial_dispatched`, `trial_completed`, `trial_failed`, `trial_unknown`, `trial_invalidated` | Record each model/path execution and its explicit operational outcome without conflating failure with a score |
| Observation | `trial_observation_recorded`, `score_vector_observed`, `usage_observed`, `judge_observation_recorded` | Preserve raw output references, evaluator observations, normalized usage, latency, and judge provenance |
| Integrity and validity | `oracle_label_attested`, `contamination_evidence_recorded`, `exposure_recorded`, `case_disclosed`, `case_retired`, `case_replaced`, `judge_calibration_sealed`, `validity_plan_sealed`, `validity_card_derived`, `validity_unknown_recorded` | Maintain gold, contamination, judge, and validity lineage as append-only evidence |
| Reduction handoff | `selection_evidence_sealed`, `selection_reduction_requested` | Delimit the immutable input set and request the next sibling's reducer; no selection result is defined here |

### Field-level type contract

| Type | Required shape | Contract boundary |
|------|----------------|-------------------|
| `ModelBenchmarkEventEnvelope<T>` | Shared envelope fields plus `mode: "model-benchmark"`, `eventType`, `schemaVersion`, `payload: T` | Uses phase-006 authorization and phase-012 causal/replay fields |
| `BenchmarkRunId`, `TrialId`, `TaskInstanceId`, `TaskFamilyId`, `CandidateId` | Branded opaque identifiers with canonical string encoding | Stable across retries and independent of array position or completion order |
| `ModelFingerprint`, `ExecutionPath`, `PromptRecipeFingerprint` | Endpoint/build/provider, route/framework, and resolved prompt/tool recipe digests | Crosses model and path factors without collapsing a complete stack into a model name |
| `TaskLineage` | Source cutoff, visibility, proposer/oracle visibility, first exposure, disclosure, retirement, replacement, and parent lineage refs | Supports private and sealed case lifecycle auditing |
| `TrialTreatment` and `TrialMatrixKey` | Candidate, model/path, task/family, protocol variant, seed, perturbation, workload profile, and paired-block ID | Defines the scoring-matrix cell and the clustering unit for later reducers |
| `ScoreVector` | Named dimension values, hard-floor statuses, missing/abstain states, evaluator contract hash, and raw observation ref | Keeps metric semantics versioned and avoids an implicit weighted total |
| `UsageReceipt` and `LatencyProfile` | Input/output/reasoning tokens, cache and retry counts, realized cost, TTFT, inter-token, end-to-end and tail latency | Carries operational cost and SLO facts into later policy reduction |
| `EvidenceRef`, `OracleAttestation`, `JudgeObservation`, `ValidityState` | Content hash, artifact URI/path reference, producer identity, confidence/uncertainty, calibration slice, and status | References immutable artifacts without copying shared service implementations |

### Version and upcaster hooks

The schema plan must define `decodeEnvelope`, `validateDiscriminant`, `resolveCompatibility`, `upcastPayload`, `canonicalizePayload`, and `recordUpcast` hooks. A compatible upcast may add defaults or rename a field under an explicit mapping; it may not reinterpret a score, alter a task identity, or discard raw evidence. Each upcast records source and target schema versions, source payload hash, target payload hash, upcaster identity, and compatibility decision. Unknown major versions and missing authorization or hash-chain fields are blocked rather than coerced.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A closed Model Benchmark event-union table covers all run, design, trial, scoring, validity, lineage, and reducer-handoff facts named by the phase.
- **SC-002**: Every event type has a field-level contract distinguishing shared envelope fields, mode-specific payload fields, immutable evidence, and references to shared services.
- **SC-003**: Multi-model and scoring-matrix identity remains stable across retries, parallel completion, adaptive selection, protocol perturbations, and workload treatments.
- **SC-004**: Raw outputs, raw score observations, normalized usage, judge evidence, oracle versions, and contamination lineage survive as append-only facts.
- **SC-005**: Version compatibility and upcaster behavior are explicit, hash-preserving, replay-aware, and fail closed for unsupported major changes.
- **SC-006**: The document set names `002-reducers-and-projections` as the next consumer and contains no reducer or projection design.
- **SC-007**: The planned schema composes with deep-improvement-common and the phase-012 shared contracts without duplicating evaluator, canary, or promotion authority.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Schema authority drift** — the Model Benchmark child could silently redefine envelope or transition semantics. Mitigation: phase-006 owns authorization and phase-012 owns shared event contracts; this phase only specializes payloads and references their versions.
- **Reducer leakage** — selection policy or score aggregation could be encoded as an event schema before the next sibling is planned. Mitigation: emit immutable evidence and an explicit reduction request only; derived state remains out of scope.
- **Model/path confounding** — comparing model names without independently identifying route, framework, prompt, tools, and endpoint makes the event ledger unable to support causal interpretation. Mitigation: require `ModelFingerprint`, `ExecutionPath`, and `PromptRecipeFingerprint` in the trial treatment key.
- **Usage loss** — current sweep behavior discards normalized usage and uses output length as an efficiency proxy. Mitigation: make usage and latency first-class trial observations, including failed and retried cells.
- **Contamination and oracle drift** — a disclosed or corrected case can invalidate an otherwise stable result. Mitigation: append exposure, contamination, oracle, disclosure, retirement, replacement, and validity events with content-addressed lineage.
- **Judge bias and false independence** — role prompts do not establish independent judges. Mitigation: preserve judge family/build/context hashes, calibration slice, order/style probes, uncertainty, abstention, and validity status.
- **Parallel ordering instability** — completion timing can alter aggregate rows if identity is positional. Mitigation: stable trial and task-family keys, per-stream sequence, causation links, and canonical event ordering fields.
- **Dependencies**: phase-006 transition-authorized ledger core; phase-012 shared event contracts; mode 004 deep-improvement-common evaluator/canary/promotion services; next sibling `002-reducers-and-projections`; later mode gate and staged authority-cutover phases.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to the owning contract or execution phase:
- **Phase-006 / phase-012** — What exact shared envelope field names, namespace rules, authorization receipt shape, and replay-fingerprint components are frozen for mode specializations?
- **Schema execution** — Which canonical serialization and branded identifier encoding are used by the runtime, and which fields may be absent only for explicitly terminal failure or unknown outcomes?
- **Trial identity** — Is the paired block keyed by task family, task instance, or a separate treatment-lattice ID when one task has multiple protocol siblings and decoding seeds?
- **Usage accounting** — Which cache, retry, routing, grader, and inference costs are authoritative when providers return incomplete usage data?
- **Validity** — Which validity-plan unknowns are hard blockers for the reducer, and which remain diagnostic evidence for later calibration?
- **Shared service ownership** — Which evaluator, sealed-canary, calibration, and promotion references are imported from mode 004 versus phase-012 without creating a second registry?
- **Reducer handoff** — What exact immutable input manifest does `002-reducers-and-projections` require for clustered inference and selection-certificate reduction?
<!-- /ANCHOR:questions -->
