---
title: "Tasks: Model Benchmark - certificates and receipts"
description: "Tasks for planning and implementing model-benchmark run certificates, transition receipts, scoring-matrix replay fingerprints, offline verification, and the thin adapter over deep-improvement-common services."
trigger_phrases:
  - "model benchmark certificates and receipts tasks"
  - "model benchmark scoring matrix tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Sequenced model matrix, receipt, fingerprint, and verifier tasks"
    next_safe_action: "Inspect sealed artifacts and common service ports before field design"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Model Benchmark - Certificates and Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the `003-sealed-artifacts` primitives, typed ledger interfaces, reducer boundaries, and common service ports before defining variant fields
- [ ] T002 [P] Inventory model-benchmark dispatch, sweep, reporter, router, workload, scoring, and legacy projection paths and classify their ownership
- [ ] T003 [P] Extract model-benchmark validity inputs from `findings-registry-modes.json`: adaptive coverage, calibration, contamination, protocol strata, operational cost, and clustered uncertainty
- [ ] T004 Record the additive-dark boundary, `depends_on: []` planning posture, phase-012 freeze handoff, later 010 consumer, and `005-resume-adapter` boundary
- [ ] T005 Define the shared-versus-variant ownership matrix for certificate, receipt, fingerprint, evaluator, canary, promotion, matrix, and scoring behavior
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Define stable identities and schemas for the benchmark recipe, run lineage, model/executor cell, task family, item, protocol, seed, workload, anchor, diagnostic tail, and uncertain evidence
- [ ] T007 Define the run-level `CERTIFICATE` schema, required digests/manifests, shared outcome vocabulary, model-specific selection payload, evidence sufficiency, and supersession rules
- [ ] T008 Define the transition `RECEIPT` schema, benchmark transition vocabulary, predecessor links, effect identity, idempotency, authorization, uncertainty, and recovery outcomes
- [ ] T009 Define canonical replay-fingerprint serialization, matrix ordering, semantic input classes, excluded storage values, unknown-field policy, and mismatch diagnostics
- [ ] T010 Define common-anchor pairing, task-family clustering, adaptive diagnostic allocation, coverage quotas, nested seeds/perturbations, and confirmatory versus exploratory evidence
- [ ] T011 Define scoring outputs for pairwise rank, task-family deltas, quality floors, cost, latency, abstention, switching overhead, Pareto sets, conditional routes, and `INSUFFICIENT_EVIDENCE`
- [ ] T012 Define candidate-specific judge calibration, model-build provenance, rubric-axis tests, contamination lineage, fresh-suite comparison, and protocol-by-model/task evidence
- [ ] T013 Define the offline verifier sequence and its verifier receipt bound to certificate fingerprint, ruleset, verifier version, sealed inputs, matrix evidence, and shared hard gates
- [ ] T014 Define ledger event/projection bindings, dark writes, duplicate/out-of-order handling, missing evidence, unsupported versions, and crash-window recovery without duplicating sibling ownership
- [ ] T015 Define the thin adapter contract that prevents model-benchmark from forking deep-improvement-common evaluator, canary, promotion, certificate, receipt, or fingerprint semantics
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Verify complete, incomplete, contradictory, superseded, and tampered multi-model run fixtures emit or reject `CERTIFICATE` according to required evidence and explicit verdict rules
- [ ] T017 Verify benchmark-start, model-cell, scoring, calibration, contamination, adaptive-allocation, selection, abort, restore, duplicate, out-of-order, and uncertain transition fixtures preserve receipt-chain integrity and idempotency
- [ ] T018 Verify identical semantic matrix inputs reproduce the same fingerprint across processes and every semantic mutation causes a mismatch
- [ ] T019 Verify the offline verifier runs without live model, judge, router, or network access and independently recomputes sealed digests, matrix reductions, uncertainty, validity, and hard gates
- [ ] T020 Verify common anchors and family coverage preserve paired inference, adaptive tails remain diagnostic, and nested task-family uncertainty is not flattened into independent rows
- [ ] T021 Verify pairwise rank, quality-floor, Pareto, operational-utility, cost/latency, abstention, switching, and weight-sensitivity cases cannot produce an unjustified winner
- [ ] T022 Verify calibration, model-build independence, rubric-axis isolation, contamination lineage, fresh-suite inflation, and protocol-strata fixtures return the required validity result
- [ ] T023 Verify all three benchmark variants consume identical common evaluator, canary, promotion, certificate, receipt, fingerprint, and hard-veto fixtures through adapters
- [ ] T024 Verify dark-path emissions do not change authority and rollback leaves legacy projections and archival evidence readable
- [ ] T025 Verify `005-resume-adapter` receives replay, salvage, uncertain-effect, changed-matrix, unsupported-version, and block cases and that later 010 acceptance is gated on the phase-012 freeze and write-set graph
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Model-benchmark matrix, certificate, receipt, fingerprint, offline-verifier, shared-service, dark-path, and resume handoff gates are green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor contract**: See `../003-sealed-artifacts/`
- **Successor consumer**: See `../005-resume-adapter/`
- **Shared service owner**: See `../../004-deep-improvement-common/004-certificates-and-receipts/`
<!-- /ANCHOR:cross-refs -->
