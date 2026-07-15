---
title: "Implementation Plan: Deep Research - Certificates & Receipts (010 phase 001 child 004)"
description: "Implementation plan for binding the Deep Research lifecycle to shared run certificates, transition receipts, replay fingerprints, and an independent offline verifier while remaining additive-dark."
trigger_phrases:
  - "deep research certificates and receipts implementation plan"
  - "deep-research transition receipt plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped Deep Research lifecycle boundaries to receipt and certificate evidence"
    next_safe_action: "Freeze the receipt matrix and replay-fingerprint input projection"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Research - Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop Deep Research mode migration (phase 010 child 001/004) |
| **Change class** | Mode-specific receipt/certificate binding and offline verification |
| **Execution** | Shared phase-003 primitives over sealed references; additive-dark and non-authoritative |

### Overview
Plan one Deep Research certificate adapter over the shared phase-003 receipt and certificate primitives. The adapter
defines a single per-run certificate and a typed receipt profile for every logical transition from initialization through
gather, analyze, convergence, synthesis, memory-save, and resume reconciliation. Each receipt binds the authorized
transition, logical operation, attempt history, ordered verified inputs, output digests, resulting ledger head, replay
fingerprint contribution, and explicit outcome. The run certificate binds the complete chain, final projections and
handoff, unresolved obligations, and the recomputed run fingerprint. An offline verifier consumes only the contract
registry and a local sealed bundle; it never reruns live research or invents missing evidence. This plan consumes the
predecessor sealed-reference binding and does not implement shared primitives, reducers, the resume adapter, or authority
cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-003 receipt, certificate, event, ledger, authorization, and replay interfaces are frozen for consumption
- [ ] The `003-sealed-artifacts` reference matrix and verified-read outcomes are available to the receipt binder
- [ ] The Deep Research transition matrix names logical operation identity, attempt identity, input/output references, and result dispositions
- [ ] The replay-fingerprint input projection and explicit exclusions are contract-tested against schema, reducer, projection, and policy versions
- [ ] The offline verifier bundle format contains contract registries, receipt/certificate bytes, sealed references, and provider evidence needed for declared checks
- [ ] Source refresh, claim supersession, memory handoff, and unresolved effect recovery cases have typed dispositions
- [ ] Dark integration can emit and verify receipts without changing legacy writers, outputs, memory behavior, or authority

### Definition of Done
- [ ] One Deep Research run certificate binds a complete, independently verifiable lifecycle receipt chain
- [ ] Every registered logical transition emits an idempotent, conflict-detecting receipt over exact verified inputs and outputs
- [ ] Replay fingerprints are stable for identical semantic inputs and change for any registered replay-affecting input
- [ ] Offline verification detects tampering, omission, drift, unsupported versions, and unresolved outcomes without mutation
- [ ] The Deep Research mode gate proves receipt/certificate parity while legacy authority remains unchanged
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared primitive adapter**: accepts a mode receipt or certificate body, delegates canonicalization, certification,
  durable append, verification, and conflict handling to phase 003, and exposes no alternate hash or trust root.
- **Logical transition registry**: registers `init`, branch `gather`, branch `analyze`, convergence, synthesis,
  memory-save, and resume/recovery operations. A transition ID is stable across retries; each attempt ID remains a
  separate forensic value and is not a replay identity.
- **Receipt builder**: binds transition ID and kind, run/lineage/generation, prior and resulting ledger heads, ordered
  sealed references, event and output digests, policy and executor fingerprints, idempotency key, recovery status, and
  shared certification metadata after the authorized result is durable.
- **Run certificate builder**: folds the verified receipt set and final event range into a canonical certificate body with
  final status, receipt-chain digest, ordered artifact-set digest, replay fingerprint, projection/synthesis/handoff
  references, open obligations, and explicit parity evidence.
- **Replay-fingerprint binder**: projects only registered semantic inputs: contract versions, event chain, lineage,
  sealed references, source/result digests, executor commitments, policy/reducer/projection versions, logical
  transitions, and verified effect outcomes. It excludes process-local and timing-only values.
- **Offline verifier**: validates certification policy, canonical body digests, chain links, authorization references,
  artifact seals, source/result references, fingerprint equality, projection and output digests, and result-state
  consistency from a local bundle. It returns `valid`, `invalid`, `incomplete`, or `unverifiable` without repair.
- **Drift and recovery path**: appends a new receipt for source updates, claim supersession, retry, reconciliation, or
  changed policy; it preserves prior receipts and blocks automatic replay for `in_doubt` or conflicting outcomes.
- **Additive-dark integration**: certificate or receipt failure blocks dark promotion and trusted handoff evidence only;
  the legacy loop remains the authority until the staged cutover phase.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the candidate SHA and the phase-003 receipt/certificate, ledger, authorization, and replay-contract digests.
- Inventory Deep Research event stems and lifecycle outputs from `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts`.
- Freeze the transition registry, receipt body fields, result dispositions, logical-operation and idempotency-key grammar, and receipt-chain ordering.
- Freeze the run-certificate body, ordered artifact/reference-set rules, replay-fingerprint input projection, exclusions, and certificate status semantics.
- Define the offline verifier bundle, certification trust policy, typed verification verdicts, and no-repair/no-rebaseline behavior.
- Build local fixtures for source mutation, claim supersession, stale heads, missing links, unknown effects, and memory-save response loss.

### Phase 2: Implementation
- Register Deep Research transition kinds through the shared phase-003 receipt/certificate registry; reject unregistered or ambiguous transitions before emission.
- Add the `init` receipt binding the frozen objective, plan/frontier, recipes, capabilities, configuration, and initial head.
- Add per-logical-branch `gather` and `analyze` receipts binding source/evidence/claim references, admission outcomes,
  cross-validation, contradictions, abstentions, branch identity, and attempt/recovery evidence.
- Add convergence receipts binding one verified frontier snapshot, raw and trusted signals, policy/evaluator versions,
  blockers, budget/lease state, and the typed decision without redefining convergence policy.
- Add synthesis and memory-save receipts binding materialized-view inputs, reducer/projection/synthesis versions, output
  digests, unresolved claims, handoff route, persistence result, and retryability.
- Add resume/recovery receipt handling for reuse, re-execute, reconcile, compensate, `in_doubt`, and conflict decisions;
  never replay an uncertain effect without conclusive target evidence.
- Implement the per-run certificate builder over the complete verified receipt chain and final ledger/event heads.
- Implement replay-fingerprint calculation from the registered semantic projection and append the selected fingerprint in
  receipts and the run certificate without including signature bytes or process-local values.
- Implement the offline verifier and typed failure evidence; it reads local sealed objects and cassettes only and never
  repairs missing links or creates a new baseline.
- Bind the dark path to the existing event, reducer, projection, compatibility, shadow-parity, and rollback seams.

### Phase 3: Verification
- Prove each receipt is emitted only after its authorized transition result and resulting ledger head are durable.
- Prove identical canonical inputs produce identical receipt body digests, replay fingerprints, and run-certificate body;
  changing any registered replay input changes the expected fingerprint.
- Prove process IDs, timestamps, completion order, random request IDs, paths, aliases, and attempt IDs do not perturb
  semantic fingerprints when they are not registered decision inputs.
- Prove the offline verifier detects mutation, truncation, substitution, missing receipt, stale head, duplicate logical
  identity, wrong kind, unsupported version, mixed reference set, and certification-provider failure.
- Prove source refresh and claim supersession preserve historical receipts and certificates while issuing affected
  revisions and invalidating only dependent synthesis/convergence evidence.
- Prove `not_applied`, `applied`, `in_doubt`, and `conflict` recovery decisions are explicit and that only conclusive
  `not_applied` can retry with the same idempotency key.
- Prove synthesis and memory-save output digests match the receipt inputs and that a failed handoff cannot receive trusted
  completion status.
- Prove the mode gate compares legacy and dark behavior only over equivalent verified reference sets and leaves legacy
  state, output, writers, and authority unchanged.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract fixture proves every mode receipt and the run certificate delegate to the shared phase-003 primitive and no local verifier or digest exists |
| REQ-002 | Positive run fixture verifies identity, heads, receipt-chain digest, artifact-set digest, replay fingerprint, output references, obligations, status, and certification metadata |
| REQ-003 | Transition matrix exercises `init`, `gather`, `analyze`, convergence, synthesis, memory-save, and resume/recovery with stable logical IDs and separate attempts |
| REQ-004 / REQ-005 | Fingerprint fixture changes one semantic input at a time and varies excluded process/timing values; only registered semantic changes alter the fingerprint |
| REQ-006 | Retry fixture returns the original receipt for identical facts and a typed conflict for changed head, result, input digest, epoch, or certification facts |
| REQ-007 | Failure matrix preserves `blocked`, `invalid`, `quarantined`, `incomplete`, `failed`, and `in_doubt`; none is coerced to valid completion |
| REQ-008 | Resume/source-refresh fixture diffs result IDs and content digests, appends dependent revisions, and preserves prior receipt and certificate references |
| REQ-009 | Offline bundle fixture verifies without network, model, search, or memory calls and reports exact missing or invalid evidence rather than repairing it |
| REQ-010 | Handoff fixture binds target, continuity, source/output, content, route, and persistence digests and refuses trusted status after failed or unknown persistence |
| REQ-011 | Dark-mode fixture shows receipt/certificate failure blocks dark promotion only and leaves legacy state, output, writer behavior, and authority unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares `depends_on: []` because the eight mode-lane planning contracts are independent and compose at the
mode gate. Implementation still consumes the phase-003 receipt/certificate, event-envelope, typed-ledger,
authorization, and replay-fingerprint interfaces, plus the shared certification-provider policy. The predecessor
`003-sealed-artifacts` owns mode artifact registration, canonicalization, sealed publication, and verified reads.
`001-typed-ledger-schema` owns event identity and lifecycle references; `002-reducers-and-projections` owns pure folds,
projection fingerprints, and legacy-shaped shadow views. Phase 009 freezes shared mode interfaces and the write-set
conflict graph. Successor `005-resume-adapter` consumes this certificate and receipt profile, while phase 011 alone
changes authority. The research inputs are the parent program spec, phase tree, and the two findings registries under
`005-deep-loop-effectiveness-and-fanout`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before authority cutover, disable the dark Deep Research receipt and certificate binding and stop new trusted handoff or
parity promotion while leaving the legacy loop, state, output, writers, and authority unchanged. Retain already emitted
receipts, certificates, sealed references, and verifier failures as immutable audit evidence; do not delete, rewrite,
re-sign, or silently rebaseline them. Revert only the mode-binding commits if a contract or verifier defect appears, then
reopen the phase against the preserved shared-contract digests.

An unresolved external outcome remains `in_doubt` for operator resolution and is never replayed by rollback. A source or
claim drift mismatch creates a new superseding receipt and invalidates affected derived evidence; rollback does not restore
the old output by mutation. Authority rollback is outside this phase because no Deep Research authority cutover is
authorized before phase 011.
<!-- /ANCHOR:rollback -->
