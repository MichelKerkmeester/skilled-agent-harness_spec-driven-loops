---
title: "Implementation Plan: Model Benchmark - certificates and receipts (013 phase 006)"
description: "Implementation Plan for the model-benchmark certificates and receipts phase: freeze model-matrix attestations, replay fingerprints, offline verification, and variant-specific scoring evidence over the shared deep-improvement-common services."
trigger_phrases:
  - "model benchmark certificates and receipts implementation plan"
  - "model benchmark scoring matrix plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Sequenced matrix evidence and offline verification over common services"
    next_safe_action: "Define sealed matrix axes and canonical fingerprint serialization"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Model Benchmark - Certificates and Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / model-benchmark mode migration |
| **Change class** | Variant certificate, receipt, matrix-scoring, and offline-verification contract design |
| **Execution** | Additive dark path over deep-improvement-common; no authority cutover in this phase |

### Overview
The phase establishes the model-benchmark attestation layer over the shared deep-improvement-common evaluator, canary,
and promotion services. One run-level `CERTIFICATE` binds a multi-model scoring matrix to sealed benchmark recipe, task
family, workload, model/executor, calibration, contamination, cost, latency, uncertainty, and selection evidence. Each
selection-relevant transition emits a shared-contract `RECEIPT`; both certificate and receipt bind to a canonical replay
fingerprint. The offline verifier recomputes the matrix and policy evidence from sealed inputs without live model or network
calls. The variant contributes only model-benchmark recipe, matrix, allocation, and scoring adapters; it does not copy
shared evaluator, canary, promotion, or certificate semantics.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The `003-sealed-artifacts` primitives expose stable digest, dependency, visibility, and tamper-evident reference semantics
- [ ] Deep-improvement-common evaluator, canary, promotion, certificate, and receipt service ports are frozen enough for a thin model-benchmark adapter
- [ ] Typed ledger, reducer, and receipt boundaries identify model-cell, scoring, and selection event ownership
- [ ] The model-benchmark matrix axes, common-anchor pool, adaptive diagnostic tail, task-family unit, and workload profile are explicitly defined
- [ ] Fingerprint semantic inputs, canonical ordering, excluded values, unknown-field policy, and mismatch diagnostics are enumerated
- [ ] Calibration, contamination, protocol robustness, operational utility, hard veto, `INSUFFICIENT_EVIDENCE`, and uncertain-effect outcomes are explicit
- [ ] The later 009 contract-freeze and write-set-conflict-graph handoff is recorded before the 010 mode fan-out consumes this contract

### Definition of Done
- [ ] `CERTIFICATE` and `RECEIPT` schemas attest the required model-benchmark run and transition evidence
- [ ] The offline verifier can recompute fingerprints, matrix reductions, uncertainty, calibration, contamination, workload, and hard gates
- [ ] Model-benchmark has one shared-service adapter and no local evaluator, canary, promotion, or common-receipt fork
- [ ] Dark-path parity, tamper, missing-input, unknown-version, confounded-path, contamination, crash-window, and rollback evidence are specified
- [ ] The successor `005-resume-adapter` has an explicit receipt replay, salvage, uncertain-effect, and block contract
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Sealed-artifact boundary**: consume immutable benchmark recipe, task-pool, model/executor, workload, evaluator,
  calibration, contamination, and policy references from `003-sealed-artifacts`; do not define a second sealing scheme.
- **Shared certificate layer**: use the common run-level attestation fields for lineage, digests, evidence manifests,
  budget, fingerprint, and outcome; add a typed model-benchmark selection payload rather than changing shared semantics.
- **Shared receipt layer**: use the common idempotent transition receipt and effect-recovery contract for benchmark start,
  model-cell execution, scoring, calibration, contamination, adaptive allocation, selection, abort, and restore.
- **Matrix layer**: represent model, executor path, task family, item, protocol, seed, and workload axes with stable logical
  cell identities; retain common anchors, adaptive diagnostic cells, excluded cells, and nested family structure.
- **Scoring layer**: preserve raw observations, metric outputs, calibrated judge values, pairwise or task-family estimates,
  uncertainty, quality floors, realized cost/latency, and operational utility as separate evidence before selection policy.
- **Validity layer**: bind candidate-specific calibration, model-build provenance, contamination lineage, protocol strata,
  and workload profile to the relevant cells; hard vetoes are evaluated before soft selection evidence.
- **Offline verifier**: validate sealed references, canonical serialization, matrix completeness, deterministic reductions,
  statistical and operational evidence, receipt chain, and shared hard gates without executing a model or network call.
- **Variant adapter**: model-benchmark supplies recipe, matrix, allocation, and scoring strategies to deep-improvement-common;
  it cannot fork evaluator, canary, promotion, receipt vocabulary, fingerprint envelope, or authority behavior.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the sibling `003-sealed-artifacts` contract and typed ledger/reducer interfaces without changing them.
- Inventory model-benchmark dispatch, sweep, reporter, scoring, router, workload, and legacy projection paths and classify
  each as variant adapter, shared service call, persisted evidence, or compatibility observation.
- Pin the planning inputs from the parent, manifest, and model-benchmark research registry; record the dark boundary,
  phase-009 freeze handoff, and `005-resume-adapter` consumer boundary.

### Phase 2: Matrix and Evidence Contract
- Define stable identities and schema for benchmark recipe, run lineage, model/executor cell, task family, item, protocol,
  seed, workload treatment, common anchor, adaptive diagnostic cell, and excluded or uncertain evidence.
- Define the run-level `CERTIFICATE`, shared outcome vocabulary, model-specific selection payload, required manifests,
  digest references, evidence sufficiency, supersession, and idempotency relations.
- Define the transition `RECEIPT` vocabulary, predecessor links, effect identity, authorization result, attempt handling,
  uncertain effects, duplicate delivery, and crash-before-receipt behavior.

### Phase 3: Fingerprint and Scoring Design
- Define canonical fingerprint serialization for matrix axes, sealed recipe and lineage, model/executor/workload descriptors,
  metric/rubric/calibration, raw observations, contamination, seeds, budget/admission/retry decisions, and reducers.
- Define paired common-anchor inference, family-clustered uncertainty, adaptive diagnostic allocation, coverage quotas,
  multiplicity handling, and the boundary between confirmatory evidence and exploration.
- Define operational selection evidence for quality floors, latency, cost, abstention, switching overhead, Pareto sets,
  conditional routes, and `INSUFFICIENT_EVIDENCE`; do not reduce all dimensions into an unqualified scalar.

### Phase 4: Shared Service and Verifier Integration
- Specify calls into the common evaluator, canary, and promotion services, including candidate-specific calibration,
  hidden-case visibility, model-build provenance, contamination vetoes, protocol checks, and hard-veto ordering.
- Define the offline verification sequence: resolve sealed digests, validate schema and coverage, recompute fingerprint,
  replay deterministic scoring and statistical reductions, check calibration/contamination/workload/policy, validate the
  receipt chain, and emit a verifier receipt.
- Define ledger and projection bindings without duplicating sibling event or reducer ownership, including dark writes,
  missing evidence, tampering, unsupported versions, duplicate/out-of-order receipts, and external-effect uncertainty.

### Phase 5: Variant Handoff
- Publish the thin adapter contract and reuse matrix showing what model-benchmark owns versus what deep-improvement-common
  owns; reject local copies of evaluator, canary, promotion, common receipt, or fingerprint semantics.
- Hand receipt replay, salvage, uncertain model-cell effects, changed-matrix, and unsupported-version cases to
  `005-resume-adapter`.
- Block the later 010 migration fan-out until the shared contracts are frozen and the executable dependency/write-set
  conflict graph is emitted.

### Phase 6: Verification
- Run deterministic schema, canonicalization, matrix, scoring, calibration, contamination, workload, receipt-chain,
  tamper, crash-window, confounded-path, and offline-replay fixtures against the pinned contracts.
- Verify identical semantic inputs reproduce identical fingerprints and every semantic mutation produces a mismatch, while
  excluded storage values do not.
- Verify all three benchmark variants consume the same common service semantics, and model-benchmark remains dark and
  non-authoritative beside the legacy path.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Construct complete, incomplete, contradictory, superseded, and tampered multi-model run fixtures; require a certificate only when required matrix and evidence manifests are present |
| REQ-002 | Replay benchmark-start, cell, scoring, calibration, contamination, allocation, selection, abort, restore, duplicate, out-of-order, and crash-before-receipt cases; assert idempotency and explicit uncertainty |
| REQ-003 | Recompute fingerprints across processes and serialization orders; mutate each recipe, matrix, artifact, model build, workload, metric, calibration, contamination, seed, budget, retry, reducer, and predecessor class; assert mismatch while excluded storage changes remain stable |
| REQ-004 | Run the verifier with no live model, judge, router, or network access; compare recomputed hashes, matrix reductions, uncertainty, validity checks, hard gates, and verifier receipt against the source certificate |
| REQ-005 | Remove an anchor, duplicate a family, flatten nested seeds, violate coverage quotas, or alter adaptive selection; require an explicit incomplete or invalid result rather than a substituted aggregate |
| REQ-006 | Exercise pairwise rank, quality-floor failure, Pareto tie, cost/latency tradeoff, abstention, switching overhead, and weight-sensitivity fixtures; reject unresolved evidence as an unjustified winner |
| REQ-007 | Exercise candidate-specific judge calibration, shared-family provenance, rubric-axis perturbations, contamination exposure/retirement lineage, fresh-suite comparison, and protocol-by-model/task variation; require typed veto or uncertainty where validity fails |
| REQ-008 | Run common evaluator, canary, promotion, certificate, receipt, fingerprint, and hard-veto fixtures through all three benchmark adapters; compare shared semantics and reject variant-local forks |
| REQ-009 | Emit certificates and receipts beside the legacy path; assert no dark verdict changes authority, router state, or legacy projection and that rollback retains readable evidence |
| REQ-010 | Verify the successor receives exact replay, salvage, uncertain-effect, unsupported-version, changed-matrix, and block cases and that 010 acceptance requires the phase-009 freeze and conflict graph |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes the `003-sealed-artifacts` primitives, typed ledger interfaces from `001-typed-ledger-schema`, and
reducer/projection interfaces from `002-reducers-and-projections`. It reuses deep-improvement-common evaluator, canary,
promotion, certificate, and receipt services rather than implementing them. It also depends on the phase-012 shared mode
contracts and write-set conflict graph before the later 010 fan-out, while this child keeps `depends_on: []` as an
independent planning contract. The successor `005-resume-adapter` consumes the receipt-chain, fingerprint, changed-matrix,
and uncertain-effect rules defined here. The spec-kit validator and the frozen parent success criteria remain documentation
gates.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All future implementation changes remain additive and versioned. Revert the path-scoped model-benchmark certificate,
receipt, or verifier commit to disable the dark writer while retaining legacy authority and archival evidence. Do not delete
ledger events, mutate sealed artifacts, or rewrite prior matrix observations; represent invalidation or supersession through
a new typed event and let the verifier report it. If a scoring, calibration, contamination, workload, or fingerprint
version fails parity, disable that version, restore the prior adapter/service version, and retain its failed receipts for
audit. An uncertain model or measurement effect is never replayed blindly: the shared effect-recovery policy resolves it
before retry, selection, or restore is accepted.
<!-- /ANCHOR:rollback -->
