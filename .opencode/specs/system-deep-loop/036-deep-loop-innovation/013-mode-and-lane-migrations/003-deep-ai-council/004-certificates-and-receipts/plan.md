---
title: "Implementation Plan: Deep AI Council - Certificates & Receipts"
description: "Implementation plan for binding the Deep AI Council lifecycle to shared run certificates, transition receipts, replay fingerprints, sealed references, and an independent offline verifier while remaining additive-dark."
trigger_phrases:
  - "deep ai council certificates and receipts implementation plan"
  - "deep-ai-council transition receipt plan"
  - "deep-ai-council offline verifier plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped council lifecycle boundaries to receipt and certificate evidence"
    next_safe_action: "Freeze the council transition matrix and fingerprint input projection"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep AI Council - Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop Deep AI Council mode migration |
| **Change class** | Mode-specific receipt/certificate binding and offline verification |
| **Execution** | Shared phase-007 primitives over sealed references; additive-dark and non-authoritative |

### Overview
Plan one Deep AI Council certificate adapter over the shared phase-007 receipt and certificate primitives. The adapter
defines one per-run certificate and a typed receipt profile for every logical transition from initialization through seat
deliberation, critique, blinded adjudication, synthesis, convergence, artifact commit, council test gate, and recovery.
Each receipt binds the authorized transition, logical operation, attempt history, ordered verified inputs, output digests,
resulting ledger head, replay-fingerprint contribution, and explicit outcome. The run certificate binds the complete chain,
final projections and artifacts, test-gate evidence, unresolved obligations, and recomputed run fingerprint. An offline
verifier consumes only trusted registries and a local sealed bundle; it never reruns seats, judges, search, or memory. This
plan consumes predecessor sealing and sibling projection contracts without implementing shared primitives, artifact sealing,
resume behavior, rollback switching, or authority cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-007 receipt, certificate, and certification-provider interfaces and phase-006 event, ledger, authorization, and replay interfaces are frozen for consumption
- [ ] The `003-sealed-artifacts` reference matrix and verified-read outcomes are available to the receipt binder
- [ ] The Deep AI Council transition matrix names logical operation identity, attempt identity, input/output references, and result dispositions
- [ ] The replay-fingerprint projection and explicit exclusions are contract-tested against event, seat, judgment, reducer, projection, policy, artifact, and gate versions
- [ ] The offline verifier bundle contains trusted registries, receipt/certificate bytes, sealed references, projection outputs, and provider evidence needed for declared checks
- [ ] Minority, contradiction, independence, order-swapped bias, control-arm, failed-gate, and unknown-effect cases have typed dispositions
- [ ] Dark integration can emit and verify receipts without changing legacy writers, council artifacts, output, or authority

### Definition of Done
- [ ] One Deep AI Council run certificate binds a complete, independently verifiable lifecycle receipt chain
- [ ] Every registered logical transition emits an idempotent, conflict-detecting receipt over exact verified inputs and outputs
- [ ] Replay fingerprints are stable for identical semantic inputs and change for every registered replay-affecting input
- [ ] Offline verification detects tampering, omission, drift, unsupported versions, failed gates, and unresolved outcomes without mutation
- [ ] The Deep AI Council mode gate proves receipt/certificate parity while legacy authority remains unchanged
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared primitive adapter**: accepts a council receipt or certificate body, delegates canonicalization, durable append,
  certification, verification, and conflict handling to phase 007, and exposes no alternate hash, signature, key, or trust root.
- **Logical transition registry**: registers initialization, seat selection/dispatch/return, critique, candidate blinding,
  pairwise judgment, bias audit, synthesis, convergence, artifact commit, council test gate, recovery, rollback observation,
  and completion. A logical transition ID is stable across retries; each attempt ID remains separate forensic data.
- **Receipt builder**: binds transition and operation kind, run/lineage/generation, prior and resulting ledger heads, event
  and sealed references, proposal/judgment/artifact outputs, policy and executor fingerprints, idempotency key, recovery
  status, independence evidence, and shared certification metadata after the authorized result is durable.
- **Run certificate builder**: folds the verified receipt set and final event range into a canonical body with terminal
  status, receipt-chain digest, ordered sealed-reference digest, replay fingerprint, projection/synthesis/artifact/gate
  references, unresolved obligations, control-arm evidence, and explicit parity state.
- **Replay-fingerprint binder**: projects only registered semantic inputs: contract versions, event chain, run lineage, seat
  and branch identities, proposal and critique digests, blinded order controls, independence/calibration evidence, policies,
  reducer/projection versions, artifact and gate inputs, logical transitions, and verified effect outcomes.
- **Offline verifier**: validates certification policy, canonical body digests, chain links, authorization references,
  sealed artifacts, disclosure boundaries, independence and minority evidence, replay equality, projections, artifacts, and
  test-gate results from a local bundle. It returns `valid`, `invalid`, `incomplete`, `unverifiable`, or `blocked` without repair.
- **Drift and recovery path**: appends a new receipt for late results, artifact supersession, policy changes, failed bias
  checks, or reconciliation; it preserves prior evidence and blocks automatic replay for `in_doubt` or conflicting outcomes.
- **Additive-dark integration**: certificate or receipt failure blocks dark promotion and trusted mode-gate evidence only; the
  legacy council path remains authoritative until staged cutover.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the candidate SHA and the phase-007 receipt/certificate and certification digests and the phase-006 ledger, authorization, and replay-contract digests.
- Inventory Deep AI Council event stems, reducer/projection outputs, sealed artifact kinds, and gate outputs from the `001` through `003` sibling contracts.
- Freeze the transition registry, receipt body fields, result dispositions, logical-operation and idempotency-key grammar, and receipt-chain ordering.
- Freeze the run-certificate body, ordered artifact/reference-set rules, replay-fingerprint input projection, exclusions, and certificate status semantics.
- Define the offline verifier bundle, trusted registry inputs, typed verdicts, disclosure boundary, and no-repair/no-rebaseline behavior.
- Build local fixtures for duplicate seats, stale heads, missing links, order swaps, judge bias, correlated seats, minority loss, failed gates, missing artifacts, and unknown effects.

### Phase 2: Implementation
- Register Deep AI Council transition kinds through the shared phase-007 receipt/certificate registry; reject unregistered or ambiguous transitions before emission.
- Add initialization receipts binding target, strategy, protocol, seat bounds, capability commitments, configuration, and initial head.
- Add seat selection, dispatch, return, and proposal receipts binding logical branch identity, independence group, output and evidence digests, cost, lease, and attempt/recovery evidence.
- Add critique receipts binding visible-information policy, source proposal IDs, cited claims, challenge disposition, and critique output digest without exposing hidden peer state.
- Add candidate-blinding, pairwise-judgment, and bias-audit receipts binding aliases, deterministic order controls, raw and calibrated outcomes, abstention, and inconsistency evidence.
- Add synthesis and convergence receipts binding verified event ranges, minority and contradiction references, effective-seat evidence, protocol route, raw signals, blockers, and typed decisions.
- Add artifact-commit and council-test-gate receipts binding sealed references, content digests, required-section results, fixture manifests, baseline/candidate fingerprints, control-arm deltas, and gate outcomes.
- Add resume/recovery and rollback-observation receipt handling for reuse, re-execution, reconciliation, compensation, `in_doubt`, and conflict decisions; never replay an uncertain effect automatically.
- Implement the per-run certificate builder over the complete verified receipt chain, final ledger heads, projections, artifacts, gate evidence, unresolved obligations, and shared certification metadata.
- Implement replay-fingerprint calculation from the registered semantic projection and append the selected fingerprint in receipts and the run certificate without process-local values.
- Implement the offline verifier and typed failure evidence; it reads local sealed objects and cassettes only and never repairs missing links or creates a new baseline.
- Bind the dark path to existing event, reducer, projection, compatibility, shadow-parity, and rollback seams without moving authority.

### Phase 3: Verification
- Prove each receipt is emitted only after its authorized transition result and resulting ledger head are durable.
- Prove identical canonical inputs produce identical receipt body digests, replay fingerprints, and run-certificate body across process and completion-order variation.
- Prove process IDs, timestamps, completion order, random request IDs, paths, aliases, and attempt IDs do not perturb semantic fingerprints when they are not registered decision inputs.
- Prove the offline verifier detects mutation, truncation, substitution, missing receipt, stale head, duplicate logical identity, wrong kind, unsupported version, mixed reference set, failed bias evidence, and certification-provider failure.
- Prove correlated nominal seats, lost minority evidence, order-swapped disagreement, failed metamorphic checks, and incomplete gate fixtures remain blocked or unresolved rather than becoming valid completion.
- Prove late seat results, artifact supersession, policy drift, and recovery preserve historical receipts and issue affected revisions without silent rebaselining.
- Prove `not_applied`, `applied`, `in_doubt`, and `conflict` recovery decisions are explicit and only conclusive `not_applied` can retry with the same idempotency key.
- Prove artifact, projection, synthesis, independence, minority, and council-test-gate output digests match receipt inputs and failed evidence cannot receive trusted completion status.
- Prove the mode gate compares legacy and dark behavior only over equivalent verified reference sets and leaves legacy state, artifacts, writers, output, and authority unchanged.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract fixture proves every mode receipt and the run certificate delegate to phase-007 primitives and no local verifier, digest, signature, or trust root exists |
| REQ-002 | Positive run fixture verifies identity, heads, receipt-chain digest, sealed-reference digest, replay fingerprint, projections, artifacts, test-gate evidence, obligations, status, and certification metadata |
| REQ-003 | Transition matrix exercises initialization, seat selection/dispatch/return, critique, blinding, judgment, bias audit, synthesis, convergence, artifact commit, test gate, recovery, and completion with stable logical IDs and separate attempts |
| REQ-004 / REQ-005 | Fingerprint fixture changes one semantic input at a time and varies excluded process/timing values; only registered semantic changes alter the fingerprint |
| REQ-006 | Retry fixture returns the original receipt for identical facts and a typed conflict for changed head, proposal, order, result, input digest, epoch, or certification facts |
| REQ-007 | Failure matrix preserves `blocked`, `invalid`, `incomplete`, `quarantined`, `failed`, `in_doubt`, `abstained`, and `unresolved`; none is coerced to valid completion |
| REQ-008 | Independence, minority, bias, control-arm, and counterfactual fixtures preserve raw evidence, references, and typed deltas without collapsing them into nominal agreement |
| REQ-009 | Offline bundle fixture verifies without network, model, search, or memory calls and reports exact missing or invalid evidence rather than repairing it |
| REQ-010 | Recovery fixture distinguishes `not_applied`, `applied`, `in_doubt`, and `conflict`; only conclusive `not_applied` retries with the original key |
| REQ-011 | Dark-mode fixture shows receipt/certificate failure blocks dark promotion only and leaves legacy state, artifacts, output, writer behavior, and authority unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares `depends_on: []` because the eight mode-lane planning contracts are independent and compose at the
mode gate. Implementation still consumes the phase-007 receipt/certificate and certification-provider interfaces and the
phase-006 event-envelope, typed-ledger, authorization, and replay-fingerprint interfaces. The predecessor `003-sealed-artifacts` owns council artifact
registration, canonicalization, sealed publication, and verified reads. `001-typed-ledger-schema` owns event identity and
lifecycle references; `002-reducers-and-projections` owns pure folds, projection fingerprints, and legacy-shaped shadow
views. Phase 012 freezes shared mode interfaces and the write-set conflict graph. Successor `005-resume-adapter` consumes
this certificate and receipt profile, while staged cutover alone changes authority. The research inputs are the parent
program spec, phase tree, and the two findings registries under `002-deep-loop-effectiveness-and-fanout`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before authority cutover, disable the dark Deep AI Council receipt and certificate binding and stop new trusted mode-gate
promotion while leaving the legacy council state, artifacts, output, writers, and authority unchanged. Retain already
emitted receipts, certificates, sealed references, and verifier failures as immutable audit evidence; do not delete, rewrite,
re-sign, or silently rebaseline them. Revert only the mode-binding commits if a contract or verifier defect appears, then
reopen the phase against the preserved shared-contract digests.

An unresolved external outcome remains `in_doubt` for operator resolution and is never replayed by rollback. A late result,
artifact drift, order mismatch, or evidence change creates a new superseding receipt and invalidates affected derived
evidence; rollback does not restore an old output by mutation. Authority rollback is outside this phase because no Deep AI
Council authority cutover is authorized before the staged cutover phase.
<!-- /ANCHOR:rollback -->
