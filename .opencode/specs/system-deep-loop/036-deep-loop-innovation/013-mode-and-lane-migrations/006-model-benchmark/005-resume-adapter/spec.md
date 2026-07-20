---
title: "Feature Specification: Model Benchmark - Resume Adapter"
description: "Plan the Model Benchmark resume adapter over the sealed typed event ledger. The adapter rebuilds multi-model run state and scoring-matrix state through reducers, maps the continuity ladder, and defines idempotent re-entry without double-apply, lost events, or unsafe replay. It consumes deep-improvement-common services and does not re-implement shared evaluator, canary, or promotion behavior."
trigger_phrases:
  - "Model Benchmark resume adapter"
  - "model-benchmark sealed-ledger resume"
  - "idempotent model benchmark re-entry"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/005-resume-adapter"
    last_updated_at: "2026-07-15T23:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the ledger-first Model Benchmark resume boundary"
    next_safe_action: "Freeze the continuity-ladder and idempotent re-entry contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Model Benchmark - Resume Adapter

> Phase adjacency under `006-model-benchmark` (independent sibling planning contracts, not a runtime dependency): predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/005-resume-adapter |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Model Benchmark mode over the deep-improvement-common backbone) |
| **Origin** | Phase 005 of the Model Benchmark migration under phase 013; the resume, replay, and model-benchmark findings in the 036/002 registries |
| **Depends on** | `[]` as a sibling planning contract; consumes frozen shared and preceding mode contracts when implementation begins |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Model Benchmark runs several models, execution paths, task families, workload profiles, and scoring treatments as one
matrix. A process interruption can currently leave a caller with an incomplete projection, an ambiguous provider outcome,
or a stale label that does not identify the exact benchmark recipe and evaluator epoch. Re-entry must not infer progress from
filesystem presence, terminal status, array position, or the currently installed model configuration. It must reconstruct
the live run and scoring state from a sealed ledger and the deterministic reducers that own those projections.

The shared research recommends a resume planner that folds receipts into `reuse`, `reconcile`, `re-execute`, `compensate`, or
`block` decisions using a versioned replay fingerprint, while preserving stable logical identity across attempts
(`findings-registry.json:2640-2645`; `findings-registry.json:1400-1408`). It also separates effect completion from workflow
completion and retains `unknown` when a provider result may have been accepted before its receipt was committed
(`findings-registry.json:1389-1397`). For this mode, that contract must operate at scoring-matrix-cell granularity: a
completed model-task cell may be reused, an incomplete cell may be re-entered, and an uncertain external effect must not be
silently replayed.

The Model Benchmark findings further require task-conditioned strengths, difficulty-aware adaptive evaluation, private and
rotating workload lineage, paired or nested inference, contamination evidence, workload-shaped latency, and canonical
recipe signatures (`findings-registry-modes.json:1839-1859`, `1915-1957`, `1989-2044`, `2135-2195`). The adapter therefore
restores both operational run state and the evidence context that makes a score comparable. It does not create a second
evaluator, canary, promotion, certificate, or authority implementation: those remain shared deep-improvement-common or
other sibling concerns.

### Purpose

Plan the Model Benchmark resume adapter for the typed event-ledger substrate. The adapter maps sealed run identity,
replay compatibility, reducer projections, matrix-cell evidence, and shared-service status into one deterministic
continuity ladder. It defines an idempotent re-entry contract in which the same sealed frontier yields the same resume plan,
duplicate application is a no-op, conflicting duplicates fail closed, and no event or effect is lost or replayed by a crash.
This phase is planning only. The per-mode 013 migrations land after phase 012 freezes the shared contracts and emits the
write-set conflict graph; the six sibling concerns and the mode gate integrate the rest of Model Benchmark.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The Model Benchmark resume-adapter contract over the sealed typed ledger, including seal validation, finalized frontier,
  event-tail hash, schema versions, reducer version, scoring-policy fingerprint, and replay-compatibility decision.
- A continuity-ladder mapping from run identity and sealed benchmark/workload artifacts through reducer projections,
  scoring-matrix cells, receipts, validity, and the next resumable frontier.
- Reducer-only reconstruction of multi-model run lifecycle, matrix waves, required coverage, adaptive selection state,
  pending and terminal cell dispositions, raw evidence references, score observations, and unresolved evidence.
- An idempotent re-entry plan keyed by stable run, ledger, matrix-cell, logical operation, and replay identities, with
  changing attempt identities and explicit `reuse`, `reconcile`, `re-execute`, `compensate`, `unknown`, and `block` outcomes.
- Model Benchmark-specific re-entry logic for task-conditional scoring, paired treatment cells, workload profiles,
  evaluator epochs, contamination and exposure status, judge calibration state, usage, latency, and uncertainty.
- Consumption of deep-improvement-common evaluator, canary, promotion, receipt, budget, lock, effect-recovery, and status
  contracts through versioned references; no duplicate shared implementation.
- Crash, duplicate, late-event, partial-ledger, stale-fingerprint, unknown-effect, changed-manifest, and matrix-permutation
  fixtures that verify the resume plan and reducer projection are deterministic and scope-safe.

### Out of Scope

- Defining the typed event envelope or append-only ledger owned by `001-typed-ledger-schema`, or redefining reducer and
  projection semantics owned by `002-reducers-and-projections`.
- Re-implementing deep-improvement-common evaluator, canary, calibration, promotion, receipt, budget, lock, adjudication,
  effect-recovery, or shared status services; this phase only consumes their contracts.
- Creating sealed artifact formats, certificates, shadow-parity instrumentation, or the independent mode gate; those belong
  to the adjacent Model Benchmark concerns, including predecessor `004-certificates-and-receipts` and successor
  `006-shadow-parity`.
- Authority cutover, legacy-writer retirement, in-flight state migration, or the phase-013 write-set execution.
- Calling model providers, rerunning scoring, reading mutable benchmark directories, selecting a new model, or treating a
  current provider response as evidence during ledger reconstruction.
- Authoring `description.json` or `graph-metadata.json`; deterministic tooling generates those files after this document set.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The sealed ledger is the sole source of resumable Model Benchmark state | A resume fixture rebuilds run, iteration, matrix, evidence, and status state from a sealed ledger and reducer versions without filesystem discovery, live provider inspection, or mutable checkpoint authority |
| REQ-002 | The continuity ladder maps every required state layer | A mapping covers run identity, sealed design/workload, replay compatibility, ledger frontier, reducer projections, matrix cells, evidence/receipts, shared status, and the next resumable frontier |
| REQ-003 | Resume compatibility is explicit and fingerprint-bound | Exact, compatible, migrate, pin-old-runtime, and blocked outcomes are distinguishable; model, prompt, tool, recipe, evaluator, workload, schema, reducer, and scoring-policy drift cannot silently reuse evidence |
| REQ-004 | Reducer reconstruction is deterministic | Complete replay and validated checkpoint replay produce identical projection bytes, scoring-matrix entries, status, and projection fingerprint for the same sealed frontier |
| REQ-005 | Logical identity is stable across re-entry and attempts | A matrix cell and logical operation retain their IDs across retries and process restarts; attempt IDs change only for an authorized new attempt and never replace logical identity |
| REQ-006 | Re-entry is idempotent and conflict-safe | Reapplying the same resume-plan key or event identity is a no-op with the same result; the same identity with a different payload, hash, or frontier is rejected or quarantined |
| REQ-007 | No event or effect is lost, duplicated, or silently replayed | The adapter consumes only the sealed finalized frontier, preserves branch-local successes, keeps late evidence append-only, and routes uncertain effects through shared recovery policy instead of automatic duplicate execution |
| REQ-008 | Scoring-matrix state is restored without score laundering | Re-entry preserves task/model/path/treatment identity, paired blocks, workload profile, evaluator epoch, raw scores, usage, latency, calibration, contamination, validity, abstention, and underpowered states |
| REQ-009 | Shared service authority remains single-source | The adapter references common evaluator, canary, promotion, receipt, budget, lock, effect-recovery, and status decisions and cannot clear a shared veto or emit shared promotion authority |
| REQ-010 | The handoff supports later shadow parity and mode integration | The resume plan exposes deterministic inputs, fingerprints, action decisions, and receipts required by `006-shadow-parity`, phase 015 contracts, and the later mode gate without implementing those concerns here |
<!-- /ANCHOR:requirements -->

### Continuity-ladder mapping

| Ladder layer | Sealed-ledger inputs | Resume output |
|---------------|---------------------|---------------|
| Run identity | `runId`, manifest revision, benchmark design digest, workload snapshot digest | Stable resume scope and immutable run key |
| Contract identity | Event schema, reducer, scoring policy, evaluator epoch, recipe, model, tool, and workload fingerprints | Exact, compatible, migrate, pin, or blocked compatibility result |
| Ledger frontier | Sealed ledger hash, finalized sequence, previous-tail hash, event IDs, per-stream high-watermarks | The only event boundary eligible for reconstruction |
| Run projection | Run and iteration lifecycle, waves, coverage quotas, stop disposition, unresolved evidence, budget observations | Current mode state and resumable frontier |
| Matrix projection | Stable cell key, logical operation ID, attempts, cell disposition, paired treatment, raw observation refs | Per-cell reuse, reconcile, re-execute, compensate, unknown, or block decision |
| Evidence and receipts | Output and input digests, score observations, usage, latency, calibration, contamination, validity, effect receipts | Evidence-preserving action constraints and receipt references |
| Shared status | Common evaluator/canary/promotion stage, veto, rollback target, receipt and recovery status | Namespaced Model Benchmark status without changing common authority |

### Idempotent re-entry contract

1. Validate the ledger seal, finalized frontier, event-tail hash, schema versions, reducer version, and scoring-policy
   fingerprint before any projection or action decision is produced.
2. Fold the sealed event set with the shared duplicate and canonical-order rules. The adapter records no new evidence while
   rebuilding and treats an already-seen event ID with the same content hash as an idempotent no-op.
3. Derive a `ResumePlanKey` from the stable run identity, sealed-ledger hash, finalized frontier, replay fingerprint,
   reducer version, and scoring-policy fingerprint. The same key must produce byte-identical decisions and no new attempt.
4. For each matrix cell, distinguish logical cell identity from attempt identity. A terminal cell with complete compatible
   evidence is reusable; a pending or failed cell is eligible for a new attempt only under the recorded recovery policy.
5. A dispatch with no committed result remains `unknown` until the shared effect-recovery contract reconciles it. The adapter
   never assumes that a missing receipt means the provider did not execute.
6. A conflicting duplicate event, changed manifest revision, changed model or recipe fingerprint, stale evaluator epoch, or
   unsealed tail is blocked or migrated through an explicit versioned contract; it is never silently applied to the old cell.
7. A successful re-entry emits or references the shared authorized resume receipt only after the plan is derived. The receipt
   binds the plan key, selected logical cells, excluded cells and reasons, source frontier, and resulting projection hash.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A sealed-ledger fixture reconstructs the complete Model Benchmark run and scoring matrix without mutable-file or live-provider reads.
- **SC-002**: The continuity ladder maps sealed identity, compatibility, reducer state, matrix cells, evidence, shared status, and the resumable frontier with no missing layer.
- **SC-003**: Complete replay and checkpoint re-entry yield identical projection bytes, matrix state, status, and fingerprints.
- **SC-004**: Re-entry is idempotent for duplicate events and resume-plan keys, while conflicting duplicates and stale fingerprints fail closed.
- **SC-005**: Logical matrix-cell and effect identities survive process restarts, retries, late evidence, and parallel completion without double-apply or unsafe replay.
- **SC-006**: Raw scores, usage, latency, task and workload lineage, calibration, contamination, validity, abstention, and unknown states remain available after resume.
- **SC-007**: Model Benchmark adds only its run and scoring-matrix resume logic over deep-improvement-common and supplies the deterministic inputs required by shadow parity and the mode gate.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Unsealed or partial frontier** - Reading a live tail can apply a torn event or omit a completed branch. Mitigation: bind
  every rebuild to the sealed finalized frontier, tail hash, per-stream high-watermarks, and shared ledger validation.
- **Double application** - Re-entry can replay a terminal matrix cell or receipt when event identity is confused with attempt
  identity. Mitigation: stable logical cell and operation IDs, changing attempt IDs, content-hash deduplication, and a plan-key
  idempotency contract.
- **Lost branch-local success** - Rebuilding only the failed wave can discard completed model-task cells. Mitigation: fold all
  sealed branch receipts and preserve successful cells before selecting re-entry work.
- **Unknown external effect** - A provider may have executed after dispatch and before receipt commit. Mitigation: retain
  `unknown`, query or reconcile through the shared effect-recovery policy, and block unsafe automatic retries.
- **Evidence comparability drift** - Model aliases, recipes, workload shapes, evaluator epochs, or score policies can change
  while labels remain the same. Mitigation: fingerprint every comparability boundary and choose migrate, pin, or block explicitly.
- **Scoring-policy laundering** - Recomputing a rank from incomplete or contaminated cells can erase uncertainty. Mitigation:
  preserve raw observations and explicit abstained, invalid, underpowered, contaminated, and unknown states.
- **Shared-service fork** - A mode adapter could recreate common recovery or promotion semantics. Mitigation: ownership matrix,
  contract fixtures, and a hard boundary around deep-improvement-common services.
- **Dependencies**: the phase-006 transition-authorized ledger, phase-012 shared event contracts, Model Benchmark
  `001-typed-ledger-schema`, `002-reducers-and-projections`, `004-certificates-and-receipts`, deep-improvement-common mode
  004 services, phase 012 shared mode contracts and write-set conflict graph, and the spec-kit validator. These are contract
  inputs for this planning child, not a hard runtime dependency implied by the sibling adjacency.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to the owning contract or implementation phase:
- **Ledger seal** - Which phase-006 or phase-012 fields are the canonical finalized frontier, tail hash, and per-stream high-watermarks?
- **Projection checkpoint** - Is a checkpointed projection accepted only when its reducer, schema, score-policy, and source-frontier fingerprints all match the sealed ledger?
- **Unknown effect** - Which Model Benchmark execution paths support receipt lookup or idempotency keys, and which must remain blocked until external reconciliation?
- **Matrix epoch** - Which changes to model alias, prompt/tool recipe, workload, evaluator, judge, or score policy require a new epoch instead of migration?
- **Resume receipt** - Does the shared receipt service own the resume-plan receipt shape, or does Model Benchmark add only a namespaced reference and cell-selection payload?
- **Adaptive coverage** - How are mandatory task-family anchors and selection propensities restored when the interrupted run had selected diagnostic cells adaptively?
- **Shadow parity** - Which resume-plan fingerprint and projection hash are consumed by `006-shadow-parity` without making the adapter authoritative?
<!-- /ANCHOR:questions -->
