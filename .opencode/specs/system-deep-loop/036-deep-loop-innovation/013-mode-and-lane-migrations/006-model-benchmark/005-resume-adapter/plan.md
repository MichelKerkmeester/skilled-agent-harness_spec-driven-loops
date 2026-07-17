---
title: "Implementation Plan: Model Benchmark - Resume Adapter"
description: "Implementation Plan for the Model Benchmark resume adapter: reconstruct sealed-ledger run and scoring-matrix state through reducers, map continuity-ladder layers, and produce idempotent re-entry decisions without duplicating deep-improvement-common evaluator, canary, or promotion services."
trigger_phrases:
  - "Model Benchmark resume adapter implementation plan"
  - "sealed ledger model benchmark resume plan"
  - "model benchmark idempotent re-entry plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/005-resume-adapter"
    last_updated_at: "2026-07-15T23:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped sealed-ledger layers to resume decisions"
    next_safe_action: "Resolve frontier and matrix-cell identity rules with shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Model Benchmark - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement / model-benchmark child phase |
| **Change class** | Planning contract: sealed-ledger reconstruction and idempotent re-entry |
| **Execution** | Plan against the frozen ledger, reducer, shared-service, and phase-015 contracts; no authority cutover or runtime implementation in this phase |

### Overview

This plan defines a Model Benchmark-specific resume adapter for multi-model runs and scoring matrices. The adapter validates
the sealed ledger frontier, folds it through the existing typed reducers, maps the continuity ladder, and derives a stable
resume plan for every logical matrix cell. It separates reusable terminal evidence from pending, failed, invalid, and
unknown work, while retaining task, workload, evaluator, score, and receipt provenance. It builds on deep-improvement-common
services from mode 004 and adds only model-benchmark run and scoring logic; shared evaluator, canary, promotion, receipt,
budget, effect-recovery, and authority semantics are referenced, not reimplemented.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The sealed-ledger contract identifies the finalized frontier, tail hash, stream high-watermarks, and authorized resume receipt boundary
- [ ] `001-typed-ledger-schema` and `002-reducers-and-projections` expose stable event, reducer, projection, identity, and fingerprint inputs
- [ ] Deep-improvement-common mode 004 ownership is recorded for evaluator, canary, promotion, receipt, budget, lock, and effect-recovery services
- [ ] The continuity-ladder mapping names every source layer and the state each layer contributes to re-entry
- [ ] The matrix-cell action table distinguishes reuse, reconcile, re-execute, compensate, unknown, and block without relying on labels or file presence
- [ ] The phase remains planning-only and scoped to this target folder; phase 013 migration work and the six sibling concerns remain excluded

### Definition of Done

- [ ] A sealed-ledger fold and compatibility gate are specified for complete and checkpointed resume
- [ ] Stable logical cell, operation, event, receipt, and attempt identities are documented
- [ ] Duplicate and conflicting re-entry behavior is explicit and idempotent
- [ ] Unknown effects and lost or late evidence have a safe recovery path through shared services
- [ ] Model-specific scoring and workload semantics are retained without duplicating common evaluator or promotion authority
- [ ] The resume contract supplies deterministic fingerprints and receipts for `006-shadow-parity` and the later mode gate
- [ ] The phase checklist and strict spec validation are green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Sealed source boundary**: accept only a validated ledger seal and finalized frontier. Re-entry never discovers state from
  mutable benchmark files, current provider configuration, or an incomplete ledger tail.
- **Reducer reconstruction**: use the shared canonical event ordering, schema compatibility, duplicate handling, and
  projection fingerprint rules. Complete replay and checkpoint continuation must converge to identical run, matrix, evidence,
  status, and fingerprint outputs.
- **Continuity ladder**: restore run identity, benchmark/workload capsule, contract fingerprints, ledger frontier, run and
  scoring projections, evidence and receipts, common status, and the next resumable frontier in that order. A missing or
  incompatible higher layer blocks lower-layer action rather than guessing it.
- **Cell action planner**: derive one decision per stable logical matrix cell. Terminal compatible evidence is reusable; pending
  or failed cells are considered for re-entry; unknown effects are reconciled or blocked; changed comparability epochs migrate,
  pin, or reject according to the shared replay contract.
- **Identity separation**: preserve `runId`, `matrixCellId`, `logicalOperationId`, `eventId`, and `receiptId`; allocate a new
  `attemptId` only for an authorized new attempt. Completion order, worker ordinal, and array position are never identities.
- **Evidence preservation**: retain raw outputs, score vectors, usage, latency, paired treatment, workload, calibration,
  contamination, validity, abstention, and underpowered states beside derived ranking or selection inputs.
- **Shared-service boundary**: consume mode-004 evaluator, canary, promotion, receipt, budget, lock, effect-recovery, and
  common-status contracts. Model Benchmark may add namespaced matrix and scoring fields but cannot clear a shared veto or
  replace a common transition.
- **Downstream bridge**: bind the resume plan to a source frontier, replay fingerprint, projection hash, selected cell IDs,
  excluded-cell reasons, and shared receipt references so `006-shadow-parity` can compare behavior without making this adapter
  authoritative.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Reconcile the parent program sequencing invariants, the phase-tree outcome, and the required adjacency to
  `004-certificates-and-receipts` and `006-shadow-parity`.
- Pin the phase-006 ledger seal and replay rules, phase-012 shared event contracts, Model Benchmark schema and reducer
  inputs, and mode-004 common-service ownership. Record them as versioned contract inputs rather than new authorities.
- Inventory the projection fields needed to resume a model run: run and iteration lifecycle, matrix waves, task and family
  coverage, adaptive selections, logical cells, attempts, raw evidence, score observations, usage, latency, validity,
  contamination, calibration, and common status.
- Produce the continuity-ladder table and a matrix-cell action matrix for terminal, pending, failed, invalid, abstained,
  underpowered, contaminated, late, and unknown evidence states.
- Define the resume-plan key, source-frontier identity, projection fingerprints, and conflict rules for duplicate or stale
  events before specifying any re-entry action.

### Phase 2: Implementation

- Define seal validation and compatibility resolution for schema, reducer, evaluator, model, prompt, tool, recipe, workload,
  and scoring-policy fingerprints, including exact, compatible, migrate, pin-old-runtime, and blocked outcomes.
- Define the reducer invocation boundary that rebuilds from the sealed finalized frontier and returns projection state without
  external reads, model calls, evaluator calls, clocks, randomness, or hidden writes.
- Define the continuity-ladder projection and the minimum complete state required before the adapter may plan matrix re-entry.
- Define stable matrix-cell and logical-operation keys across model/build, execution path, task/family, paired treatment,
  workload, evaluator epoch, recipe signature, and adaptive-selection metadata.
- Define the idempotent cell planner: reuse complete compatible evidence, reconcile shared receipts, re-execute only safe
  incomplete work, compensate where the shared policy requires it, retain unknown effects, and block conflicts.
- Define duplicate and late-event handling: same event identity and content hash is a no-op; conflicting identity, sequence,
  frontier, or payload is quarantined or rejected; late evidence remains append-only and cannot rewrite a sealed projection.
- Define model-benchmark scoring restoration for paired and nested comparisons, task-conditioned scores, coverage quotas,
  private or rotating workload windows, judge calibration, contamination, usage, latency, uncertainty, and invalid states.
- Define the shared resume receipt or reference payload containing plan key, source seal, projection hash, selected logical
  cells, excluded cells and reasons, action decisions, and shared effect or budget receipt references.

### Phase 3: Verification

- Replay golden multi-model histories from a fresh reducer and from valid checkpoints; compare every projection family,
  scoring-matrix cell, status field, resume frontier, and fingerprint.
- Permute valid event completion order, duplicate terminal events, batch boundaries, branch completion, and late evidence;
  assert identical plans or explicit safe rejection.
- Inject crashes before dispatch, after provider acceptance, after result receipt, after ledger append, after projection fold,
  and before resume-plan receipt; assert no double apply and an explicit unknown or recoverable state where required.
- Change model alias, prompt/tool recipe, workload, evaluator epoch, score policy, schema, reducer, and ledger frontier;
  verify migrate, pin, or block decisions rather than silent reuse.
- Verify branch-local successes remain reusable while only eligible logical cells enter a new attempt, and unknown effects never
  become automatic duplicate calls.
- Compare the shared evaluator, canary, promotion, receipt, budget, lock, effect-recovery, and status fields with mode-004
  fixtures; prove the Model Benchmark extension cannot clear common blockers.
- Verify the shadow-parity handoff contains deterministic source and output fingerprints, then run strict validation and an
  exact-scope diff check for the four authored files.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Seal-only fixtures rebuild all run and matrix state with filesystem, network, provider, mutable-config, and clock access denied |
| REQ-002 | A continuity-ladder manifest maps sealed run, contract, frontier, projection, matrix, evidence, shared status, and resumable-frontier fields |
| REQ-003 | Fingerprint fixtures cover exact, compatible, migrate, pin-old-runtime, and blocked outcomes for model, recipe, evaluator, workload, reducer, and score-policy changes |
| REQ-004 | Fresh and checkpointed reducer replays produce equal bytes, matrix cells, status, resume frontier, and projection fingerprints |
| REQ-005 | Retry and restart fixtures preserve logical cell and operation IDs while changing attempt IDs only after an authorized re-entry decision |
| REQ-006 | Duplicate resume-plan keys and same-hash event identities are no-ops; conflicting payload, hash, sequence, or frontier identities fail closed |
| REQ-007 | Crash and partial-frontier fixtures preserve branch-local successes, retain unknown effects, and produce no duplicate logical commit or unsafe re-execution |
| REQ-008 | Scoring fixtures preserve paired identity, task-conditioned evidence, workload and recipe signatures, raw scores, usage, latency, calibration, contamination, validity, abstention, and uncertainty |
| REQ-009 | Contract fixtures prove common evaluator, canary, promotion, receipt, budget, lock, effect-recovery, veto, rollback, and status semantics are consumed unchanged |
| REQ-010 | The shadow-parity handoff fixture validates plan key, source seal, selected cells, excluded reasons, shared receipt refs, and projection hash |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The direct contract inputs are Model Benchmark `001-typed-ledger-schema` and `002-reducers-and-projections`, the shared
phase-006 ledger and phase-012 event contracts, and the deep-improvement-common mode-004 services. The predecessor
`004-certificates-and-receipts` and successor `006-shadow-parity` provide adjacent planning boundaries, not a hard runtime
dependency for this child. Phase 015 supplies the shared mode contracts and write-set conflict graph before implementation
integration; phase 013 migrations consume the frozen shared contracts afterward.

The research evidence is `002-deep-loop-effectiveness-and-fanout/research/findings-registry.json` for replay fingerprints,
logical versus attempt identity, branch-local success, and effect uncertainty, plus
`findings-registry-modes.json` for task-conditioned model scoring, adaptive coverage, private and rotating cases, workload
metrics, paired inference, contamination provenance, typed recipes, and canonical benchmark signatures. The spec-kit
validator is the documentation gate.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase creates planning documents only and performs no runtime replay, ledger append, projection mutation, provider call,
or authority change. If later implementation fails parity or discovers a compatibility defect, disable the new resume adapter,
retain the sealed ledger and prior reducer projection, and keep the legacy Model Benchmark path authoritative. Rebuild from the
last known-good sealed frontier after correcting the reducer or compatibility contract; never delete, rewrite, or reclassify
raw trial evidence to make a resume plan pass. A path-scoped git revert restores the prior adapter and shared-service
references while preserving replay fixtures and receipts.
<!-- /ANCHOR:rollback -->
