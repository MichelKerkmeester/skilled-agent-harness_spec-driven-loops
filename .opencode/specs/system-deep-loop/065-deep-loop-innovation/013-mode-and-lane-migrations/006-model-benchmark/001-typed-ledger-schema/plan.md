---
title: "Implementation Plan: Model Benchmark typed ledger schema (013 mode migration, 006 child)"
description: "Implementation Plan for the Model Benchmark typed ledger schema phase: freeze the mode envelope specialization and append-only event vocabulary over the shared deep-improvement-common and transition-authorized ledger contracts, with field-level types, lineage, validity, and upcaster hooks."
trigger_phrases:
  - "Model Benchmark typed ledger schema implementation plan"
  - "model-benchmark event schema plan"
  - "typed ledger phase 006 model benchmark"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T22:59:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped event families to Model Benchmark run and scoring evidence"
    next_safe_action: "Resolve shared envelope fields before freezing the mode payload union"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Model Benchmark Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement / model-benchmark child phase |
| **Change class** | Planning contract: typed append-only event vocabulary |
| **Execution** | Plan against phase-003 and phase-009 frozen contracts; no runtime authority or reducer implementation in this phase |

### Overview
The plan turns the Model Benchmark research findings into a closed event vocabulary over the shared ledger. It starts from the transition-authorized envelope, adds a mode-specific payload union for multi-model runs and scoring matrices, and preserves task lineage, contamination evidence, judge calibration, validity, usage, latency, and raw observations as immutable facts. The plan explicitly builds on deep-improvement-common services from mode 004 and hands its evidence to `002-reducers-and-projections`; it does not duplicate evaluator, canary, promotion, or reducer behavior.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-003 transition-authorization and phase-009 shared event contracts are available with stable field names and version references
- [ ] The mode-004 deep-improvement-common ownership boundary is listed for evaluator, canary, calibration, and promotion services
- [ ] Current Model Benchmark evidence paths and research findings are mapped to event families without treating research prose as an implementation contract
- [ ] The next sibling `002-reducers-and-projections` input boundary is agreed before any derived selection state is named
- [ ] The phase remains scoped to the target folder and its four authored documents

### Definition of Done
- [ ] The Model Benchmark envelope specialization and closed payload union are documented
- [ ] Every event type has field-level types, identity rules, append-only semantics, and compatibility treatment
- [ ] Versioned-envelope and upcaster hooks are specified with fail-closed major-version behavior
- [ ] Scoring-matrix, usage, lineage, validity, and judge evidence are retained for later reducers
- [ ] The phase's checklist and strict spec validation are green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared envelope first**: inherit event identity, stream sequence, authorization receipt, causation/correlation, hash chain, schema version, and replay fingerprint from phase-003 and phase-009. Model Benchmark cannot omit or reinterpret these fields.
- **Mode specialization**: use a `deep-improvement.model-benchmark.*` discriminant and a `ModelBenchmarkEventEnvelope<T>` payload union. The mode layer owns run, design, trial, scoring evidence, validity, and reduction-handoff facts.
- **Stable matrix identity**: represent candidate, model/build, execution path, task instance/family, paired block, protocol variant, seed, perturbation, workload profile, and recipe fingerprints as typed dimensions rather than array positions.
- **Evidence preservation**: keep raw output digests, raw score vectors, judge observations, oracle attestations, contamination/exposure lineage, normalized usage, and latency as append-only observations. Derived totals and selection decisions are not source events in this phase.
- **Shared service references**: reference deep-improvement-common evaluator/canary/promotion contracts and shared receipts or budgets by versioned IDs and artifact hashes. Do not create a Model Benchmark copy of those services.
- **Version bridge**: define decoder, discriminant validator, compatibility resolver, payload upcaster, canonicalizer, and upcast receipt hooks. Preserve source payload hashes and reject unsupported major versions.
- **Reducer boundary**: emit a sealed evidence manifest and a typed reduction request for `002-reducers-and-projections`; leave folds, clustered inference, policy selection, certificates, and gauges to that sibling.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Reconcile the parent program invariants, the phase-tree outcome for the Model Benchmark child, and the research model-benchmark findings.
- Pin the source contract references for the phase-003 transition-authorized ledger core, phase-009 shared event contracts, and mode-004 common services.
- Inventory current run and sweep facts named by the research evidence, including dispatch usage, trial identity, failure states, and existing scoring-matrix dimensions.
- Write the explicit non-goal and ownership table for reducers, projections, evaluator/canary/promotion services, authority cutover, and legacy writers.

### Phase 2: Implementation
- Define the `ModelBenchmarkEventEnvelope<T>` specialization and required versus optional field matrix.
- Define the closed event union for run lifecycle, benchmark design, trial dispatch/results, observations, validity/lineage, and reducer handoff.
- Define branded identifiers and field-level types for task families, model and execution-path fingerprints, treatment cells, score vectors, usage, latency, evidence references, oracle state, judge state, and contamination lineage.
- Define append-only identity and ordering rules for parallel trials, retries, unknown effects, invalidation, and late evidence.
- Define the versioned envelope, payload schema hashes, canonical serialization, compatibility outcomes, and upcaster receipts.
- Define the immutable reduction-input manifest consumed by `002-reducers-and-projections` without defining its fold or selection policy.

### Phase 3: Verification
- Check every concrete event against the shared envelope and authorization requirements.
- Check every scoring-matrix field for stable identity, paired comparison, task-family clustering, and independent execution-path representation.
- Check raw usage, latency, judge, oracle, contamination, exposure, and validity evidence for failed and successful trials.
- Check upcaster examples for hash preservation, deterministic replay, explicit transformation identity, and blocked unsupported majors.
- Check the shared-service ownership matrix for duplicate evaluator, canary, calibration, promotion, or authority logic.
- Check the handoff stops before reducer state and names the exact next sibling.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Field matrix compares the Model Benchmark envelope with the phase-003 and phase-009 shared required fields; missing authorization, hash, sequence, or replay fields are rejected |
| REQ-002 | Event-union review exercises run declaration, capsule/workload sealing, design, trial lifecycle, observations, validity, and reduction handoff |
| REQ-003 | Matrix fixtures vary model, endpoint/build, route, task family, task instance, paired block, protocol, seed, and workload without changing identity semantics |
| REQ-004 | Trial examples retain raw output digest, raw score vector, usage receipt, latency profile, judge reference, and failed/unknown outcome without a reducer-owned aggregate |
| REQ-005 | Lineage examples cover sealed case creation, first exposure, disclosure, contamination evidence, retirement, replacement, and oracle correction |
| REQ-006 | Judge and oracle examples preserve calibration slice, candidate-specific identity, uncertainty, abstention, validity, and disagreement as typed states |
| REQ-007 | Version fixtures cover exact, compatible, migrate, pin-old-runtime, and blocked paths; upcast receipts preserve source and target hashes |
| REQ-008 | Parallel completion and retry fixtures use stable trial IDs and stream sequence rather than completion order or array index |
| REQ-009 | Ownership review confirms shared evaluator/canary/promotion services are referenced by contract and not re-specified as mode services |
| REQ-010 | Handoff review confirms `selection_evidence_sealed` and `selection_reduction_requested` are the terminal schema boundary before `002-reducers-and-projections` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan depends on the phase-003 transition-authorized ledger core for authorization, stream identity, hash chaining, and compatibility decisions, and on phase-009 shared event contracts for common causal, receipt, budget, and orchestration references. It consumes the mode-004 deep-improvement-common evaluator/canary/promotion interfaces and must align its event references with the next sibling `002-reducers-and-projections`. Later authority cutover and legacy retirement phases consume the completed mode gate; they do not participate in this schema planning boundary.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase creates planning documents only and performs no runtime write, schema migration, ledger mutation, or authority change. If a later implementation discovers a contract defect, the safe rollback is to reject the new mode schema version, retain the previous compatible decoder/upcaster, and keep the legacy Model Benchmark path authoritative until the corrected additive version passes shadow parity. Never delete or rewrite already-emitted evidence; supersede an incorrect event interpretation with an append-only compatibility or invalidation decision.
<!-- /ANCHOR:rollback -->
