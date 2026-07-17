---
title: "Feature Specification: Model Benchmark - Sealed Reference Artifacts"
description: "Plan the sealed reference artifacts for the model-benchmark variant: multi-model run manifests, resolved model cells, raw observations, workload context, and a reproducible scoring matrix over the shared deep-improvement-common services. The phase consumes the common phase-006 sealing primitives and adds only model-benchmark-specific run and scoring logic."
trigger_phrases:
  - "model benchmark sealed reference artifacts"
  - "model benchmark scoring matrix sealing"
  - "multi-model run artifact sealing"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Bounded model-run sealing to the common artifact and scoring contracts"
    next_safe_action: "Freeze matrix identity and score evidence against common seal primitives"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Model Benchmark - Sealed Reference Artifacts

> Phase adjacency under `006-model-benchmark` (grouping order, not a runtime dependency): predecessor `002-reducers-and-projections`; successor `004-certificates-and-receipts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (model-benchmark mode) |
| **Origin** | Phase 006 of the model-benchmark migration under phase 013 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The model-benchmark variant compares multiple models, executors, frameworks, variants, fixtures, samples, and workload profiles through one scoring matrix. The shipped rig expands that matrix and records per-cell rows, but the current path does not yet make the full experiment identity immutable: `dispatch-model.cjs` can normalize executor output, while `sweep-benchmark.cjs` still emits null token and cost fields and `sweep-reporter.cjs` uses output-word efficiency for ranking. A report or leaderboard can therefore be repeatable as text while its model identity, evaluator inputs, workload, cost evidence, or scoring assumptions remain mutable or incomplete.

The research inputs require a stronger evidence boundary. Model and execution path must be crossed independently when the claim is about models rather than complete stacks; common sealed anchors are needed for paired inference while adaptive diagnostic cases preserve family coverage; task or item-family clustering must remain visible in uncertainty estimates; candidate-specific judge calibration must not be replaced by one global correction; contamination requires exposure and replacement lineage, not only timestamps or duplicate checks; and operational selection must retain quality, latency, cost, error, abstention, and switching evidence. These findings are grounded in `findings-registry-modes.json` model-benchmark entries and the current model-benchmark scripts named above.

### Purpose

Define how Model Benchmark seals its reference artifacts over the typed event-ledger substrate. The phase consumes the phase-006 sealing primitives published by `004-deep-improvement-common/003-sealed-artifacts`; it does not invent a second digest, signature, manifest, storage, or verification scheme. It plans content-addressed, seal-on-write, tamper-evident references for the resolved benchmark recipe, multi-model run matrix, per-cell inputs and outputs, scoring observations, paired statistical evidence, contamination/workload lineage, and derived selection views. The model-benchmark variant adds only its run and scoring logic on top of the deep-improvement-common evaluator, canary, and promotion services. The per-mode 010 migrations land after phase 012 freezes the shared contracts and emits the write-set conflict graph.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A model-benchmark adapter over the common phase-006 sealing primitives, including canonical serialization, content-addressed digest calculation, dependency closure, seal-on-write, immutable references, and tamper-evident reads.
- A sealed benchmark recipe and run manifest containing profile identity and version, mode, model descriptors, executor and provider identities, framework or prompt references, fixture and task-family manifests, sample and seed policy, matrix ordering, scoring configuration, correctness gates, reporting group, and deployment workload profile.
- Sealed model-cell inputs containing the frozen workflow prefix and environment snapshot when applicable, resolved model/build/variant, executor capabilities and permissions, framework/template digest, fixture or task digest, seed, sample identity, prompt visibility policy, and all prerequisite artifact references.
- Sealed raw cell outputs and observations retaining response or trajectory digests, tool and action traces, per-item outcomes, score vectors, judge observations, usage, cost, latency, tail-latency and SLO values, errors, abstentions, retries, and integrity status before reduction.
- A sealed scoring matrix preserving item-level and family-level rows, model-by-executor crossings, common-anchor versus adaptive-diagnostic membership, rubric-axis observations, candidate-specific judge calibration, paired deltas, nested uncertainty, multiplicity treatment, and explicit `WINNER`, `TIE`, `INCONCLUSIVE`, or blocked states.
- Reference artifacts for anchor and diagnostic selection: common paired anchors remain fixed across compared cells; adaptive cases are selected only under declared family-coverage quotas and are marked non-confirmatory or otherwise governed by the declared sequential-inference policy.
- Model-benchmark provenance for contamination, freshness, visibility, source date, first exposure, disclosure, retirement, replacement lineage, private or generated case status, and reference-model difficulty evidence, without exposing hidden cases to the candidate or scorer beyond the common visibility contract.
- Workload and operational evidence bound to the recipe, including context length, concurrency, traffic shape, output length, prefix reuse, multi-turn behavior, TTFT, inter-token latency, end-to-end latency, throughput, SLO violations, realized cost, error cost, abstention cost, and switching overhead.
- A tamper-evident read path that verifies artifact digest, schema, dependency closure, seal state, matrix membership, evaluator epoch, visibility, freshness, contamination status, scoring-policy compatibility, and workload compatibility before a reducer, report, verifier, or common promotion service consumes an artifact.
- Shared-service consumer contracts for `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`, with model-benchmark-specific fields confined to adapter-owned run and scoring artifacts and common evaluator, canary, promotion, and veto semantics reused unchanged.
- Replay, matrix mutation, partial-cell, missing-usage, stale-case, contamination, calibration, hidden-visibility, workload, and mixed-version fixtures that prove model comparisons remain reproducible and fail closed when evidence is incomplete.

### Out of Scope

- Defining a new hash, signature, chain, manifest, storage, or verification algorithm outside the phase-006 sealing primitives.
- Defining the typed event envelope, transition authorization, append-only ledger, reducer fold, common projection schema, or replay fingerprint policy owned by the shared ledger and reducer phases.
- Re-implementing deep-improvement-common evaluator, canary, scoring, calibration, promotion, effect recovery, or veto services. This phase supplies model-benchmark inputs and scoring artifacts through their shared interfaces.
- Implementing final certificates, transition receipts, or receipt-chain materialization owned by `004-certificates-and-receipts`; this phase provides the sealed references they bind.
- Replacing the existing model-benchmark matrix rig, inventing a private mode enum, or making provider selection policy part of the seal contract. The phase records the declared model/executor set and resolved capabilities; it does not choose an executor on behalf of the operator.
- Authority cutover, legacy-writer retirement, live promotion, or the later 010 per-mode fan-out. The model-benchmark path remains additive and shadow-only until its mode gate and the staged cutover phase authorize a change.
- Re-running the 065 research or changing the parent program's 178-row disposition ledger.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Model Benchmark uses one shared sealing scheme | Every model-benchmark reference routes through the phase-006 sealing adapter; no local digest, signature, manifest, storage, or read-verification path exists |
| REQ-002 | Benchmark identity is content-addressed and dependency-closed | The sealed recipe digest covers canonical profile, matrix axes and order, model/executor descriptors, fixtures, scoring, visibility, sampling, workload, and ordered dependency digests; changing any dependency produces a new identity |
| REQ-003 | Run and cell writes are atomic and immutable | A writer validates, canonicalizes, seals, publishes, reads back, and authorizes the run or cell reference only after verification; interrupted writes are unusable and published bytes cannot be overwritten |
| REQ-004 | Reads are tamper-evident and fail closed | Byte, digest, schema, dependency, lifecycle, matrix-membership, epoch, visibility, freshness, contamination, and workload mismatches return typed refusal rather than stale or guessed evidence |
| REQ-005 | Multi-model runs reproduce the declared experiment | A run reference identifies every model, executor, provider, build, variant, framework, fixture, sample, seed, mode, matrix ordering, and resolved capability; model identity is crossed with execution identity when the claim requires it |
| REQ-006 | Each model cell is independently replayable | Cell inputs bind frozen workflow/environment state, model and executor configuration, framework and fixture digests, sample and seed, visibility policy, and prerequisites; raw outputs bind response, trace, usage, cost, latency, errors, retries, and integrity observations |
| REQ-007 | The scoring matrix preserves raw evidence and derived inference | Raw per-item and per-family observations remain addressable beside rubric-axis scores, judge observations, normalized scores, paired deltas, confidence intervals, rank probabilities, and selection states; reduction changes create new derived references |
| REQ-008 | Anchor and adaptive evidence remain distinguishable | Common sealed anchors support paired comparisons; adaptive diagnostic cases record selection policy, information inputs, family quotas, and confirmatory status; adaptive omission cannot silently become evidence of superiority |
| REQ-009 | Validity and contamination evidence are first-class | Judge calibration, rubric-axis validity, oracle uncertainty, protocol perturbations, source dates, visibility, first exposure, contamination checks, retirement, and replacement lineage are sealed and can veto or qualify a score |
| REQ-010 | Operational selection retains complete realized cost and workload evidence | Quality gates, latency tails, throughput, SLO violations, token and dollar cost, error and abstention cost, and switching overhead remain available for Pareto and utility analysis; a quality-per-dollar ratio is not the sole selection basis |
| REQ-011 | Model Benchmark consumes common services without semantic forks | Common evaluator, canary, promotion, read-failure, veto, and artifact lifecycle contracts are reused unchanged; model-specific run/scoring adapters add fields only under the shared extension boundary |
| REQ-012 | Sealed artifacts hand off cleanly to certificates and receipts | Success, veto, incomplete, stale, contaminated, and uncertain references expose stable digests and evidence boundaries for the successor certificate/receipt contract without materializing certificates here |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One phase-006-backed adapter produces deterministic content-addressed identities for benchmark recipes, runs, cells, observations, scoring matrices, and operational evidence.
- **SC-002**: Replaying a sealed multi-model matrix with the same model/executor, fixture, seed, workload, and scoring dependencies reproduces the same raw references and derived scoring inputs.
- **SC-003**: Common paired anchors, adaptive diagnostic tails, nested item-family uncertainty, and matrix crossings remain explicit and cannot be conflated by a leaderboard reducer.
- **SC-004**: Tampered bytes, missing dependencies, hidden-visibility violations, stale or contaminated cases, unsupported schemas, calibration gaps, incomplete usage, and workload mismatches fail closed.
- **SC-005**: Model-benchmark selection can distinguish quality eligibility, statistical uncertainty, judge or rubric validity, contamination risk, and operational cost/latency without relying on one aggregate or ratio.
- **SC-006**: The model-benchmark adapter consumes deep-improvement-common evaluator, canary, and promotion services and emits stable sealed references for the successor certificate/receipt phase without duplicating shared semantics.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Second sealing scheme** - A model-local hash or report manifest could make the same evaluator or trial incomparable with the deep-improvement-common variants. Mitigation: one phase-006 adapter, one canonicalization path, and a contract test that rejects alternate seal metadata.
- **Incomplete matrix identity** - Omitting executor build, prompt framework, workload, fixture version, seed, or visibility can make a model comparison appear reproducible while measuring a different treatment. Mitigation: require a dependency-closed run recipe and resolved cell manifest before dispatch.
- **Paired-design breakage** - Adaptive case selection can remove common anchors or flatten related item families, overstating certainty. Mitigation: seal anchor membership, adaptive selection policy, family quotas, resampling unit, and confirmatory status in the matrix.
- **Judge and rubric drift** - One global calibration or a collapsed multi-axis rubric can reverse a model ranking with false confidence. Mitigation: retain candidate/task-cluster calibration, axis perturbation evidence, oracle uncertainty, and invalid-score vetoes as sealed inputs.
- **Contamination and hidden-case leakage** - A recent or private case can still have exposure lineage, and candidate-visible hidden material can be optimized against. Mitigation: seal source and visibility state, rotate or retire cases through lineage, withhold hidden content, and block on leakage or uncertain contamination.
- **Operational evidence loss** - Current sweep rows can leave token and cost fields null while the reporter ranks efficiency by word count. Mitigation: preserve nullable provenance honestly, require provider parsers or explicit missing evidence, and prevent cost-aware selection from treating fabricated values as measured cost.
- **Shared-service drift** - Model Benchmark may fork evaluator, canary, promotion, or veto behavior while keeping similar field names. Mitigation: run common fixtures through the model adapter and compare shared fields, failure states, and service decisions before the later fan-out.
- **Large or partial matrices** - Multi-model runs can fail or finish unevenly, making a partial leaderboard look complete. Mitigation: seal cell admission and exclusion reasons, require an explicit completeness state, and refuse winner claims when required anchors or coverage quotas are absent.
- **Dependencies**: `004-deep-improvement-common/002-reducers-and-projections` for artifact indexes and service status; `004-deep-improvement-common/003-sealed-artifacts` for all sealing behavior; `004-deep-improvement-common/004-certificates-and-receipts` for successor binding; phase 012 shared mode contracts and write-set conflict graph; phase 012 contract freeze before later 010 migrations; existing model-benchmark scripts and fixtures; and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen common contracts:
- What exact canonical ordering and length-delimited serialization does the phase-006 adapter require for models, matrix cells, task families, samples, and nested workload profiles?
- Which executor build, provider capability, permission, network, and runtime fields are semantic inputs to model identity, and which remain external audit fields?
- Which benchmark cases are common confirmatory anchors, which are adaptive diagnostics, and what family-coverage and sequential-inference policy governs their boundary?
- Which judge calibration and oracle slices are available per candidate, task cluster, rubric axis, and protocol, and which uncertainty state blocks a ranking?
- Which contamination and exposure states are sufficient for inclusion, quarantine, retirement, or replacement without revealing hidden case content?
- How are missing provider usage fields represented in a sealed operational record, and what evidence is required before cost or latency can participate in selection?
- Which workload profile fields and tail metrics must match for a comparison to claim deployment relevance rather than isolated model quality?
- What retention policy preserves raw responses, traces, hidden commitments, burned cases, calibration slices, and superseded scoring matrices for replay and audit?
<!-- /ANCHOR:questions -->
