---
title: "Implementation Plan: Agent Improvement - Resume Adapter"
description: "Implementation Plan for the Agent Improvement Resume Adapter: compose the common sealed-ledger resume services with AgentIR-specific reducer state, continuity-ladder mappings, and idempotent re-entry decisions for interrupted proposal and scoring runs."
trigger_phrases:
  - "agent improvement resume adapter implementation plan"
  - "agent improvement ledger resume plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped AgentIR recovery state to the shared deep-improvement resume boundary"
    next_safe_action: "Freeze resume request identity and variant re-entry decision fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent Improvement - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Agent Improvement variant |
| **Change class** | Ledger-only recovery adapter and replay fixtures |
| **Execution** | Staged after phase 012 freezes shared contracts; typed path remains dark and legacy-authoritative |

### Overview
The adapter composes the deep-improvement-common sealed-ledger reader, continuity ladder, replay fingerprint, receipts, and
effect-recovery policy with the Agent Improvement reducer outputs. It reconstructs AgentIR lineage, candidate proposals,
failure-localization evidence, behavior-family coverage, evaluator observations, score revisions, canary state, and promotion
status from immutable events. Re-entry uses stable resume-request, candidate, branch, and effect identities; only attempt IDs
change across retries. Variant code adds no evaluator, canary, certificate, promotion, or sealing implementation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The common receipts, replay-fingerprint, reducer, and effect-recovery contracts are frozen and available to the adapter
- [ ] Agent Improvement event, projection, and sealed-reference contracts identify all resume inputs and variant-owned fields
- [ ] The continuity ladder names every supported proposal, behavior experiment, evaluation, scoring, canary, and promotion state
- [ ] Resume-request, logical-operation, idempotency, and attempt identity rules are explicit
- [ ] Changed-manifest and incompatible-checkpoint outcomes are classified before any re-entry is attempted
- [ ] A crash and duplicate fixture matrix covers branch-local success and incomplete external effects

### Definition of Done
- [ ] Ledger-only rebuild is byte-equivalent to a clean full fold
- [ ] Exact duplicate requests produce no second apply or side effect
- [ ] AgentIR-specific re-entry decisions reuse the common decision algebra without a local semantic fork
- [ ] Unknown, stale, leaked, or insufficient evidence remains blocking and non-authoritative
- [ ] The dark resume path passes the Agent Improvement gate inputs consumed by `006-shadow-parity`
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Read a sealed ledger range through the common adapter; validate schema versions, upcasters, seal closure, reducer identity,
  and replay fingerprint before invoking any variant reducer.
- Fold common deep-improvement service events first, then fold Agent Improvement events from `001-typed-ledger-schema` into
  the reducer projections from `002-reducers-and-projections`; never reconstruct from a mutable AgentIR package or checkpoint.
- Map the resulting state to one continuity-ladder level with sealed evidence, projection status, and a typed re-entry action.
- Use `reuse`, `reexecute`, `compensate`, and `reject` as the shared action algebra; represent `fork`, `quarantine`, and
  `UNKNOWN` as explicit guarded outcomes where manifest or effect compatibility is unresolved.
- Key duplicate protection by resume request plus payload/fingerprint, logical candidate or effect identity, and event identity;
  retain changing attempt IDs for forensic history without changing logical identity.
- Preserve completed logical branches and raw trial observations, then schedule only missing compatible work. A changed
  evaluator, fixture, executor, tool schema, topology, or AgentIR closure starts a new revision or lineage.
- Expose only common redacted candidate views. Exact hidden fixtures, terminal evidence, mutable evaluator state, and current
  process memory are not resume inputs or projection outputs.
- Emit or consume no live authority transition. Resume receipts and decisions remain evidence for the later shadow and cutover
  contracts, with legacy state unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the common `004-certificates-and-receipts` and `005-resume-adapter` contracts, Agent Improvement siblings,
  phase-012 event contracts, and phase-012 write-set boundaries are available and version-pinned.
- Build the resume state matrix from the Agent Improvement event catalog: inputs, reducer projection, sealed references,
  compatibility checks, action, and failure reason for every ladder level.
- Define fixture identities and expected fingerprints for clean replay, checkpointed replay, duplicate requests, crashes,
  partial branches, changed manifests, and unknown effects.

### Phase 2: Implementation
- Add the Agent Improvement resume adapter binding over the common ledger read and reducer invocation interface.
- Fold AgentIR base/candidate closure, change-contract, parent lineage, mutation operator, failure-gradient, first-divergent
  trace, behavior-family, profile, evaluator, score, canary, and promotion references into the continuity projection.
- Implement the ladder resolver and compatibility classifier for exact reuse, missing-work re-execution, new score revision,
  new lineage, compensation, quarantine, and rejection.
- Add resume-request idempotency and event-application guards; return the existing receipt for an exact duplicate and reject
  key reuse with altered payload or fingerprint.
- Preserve branch-local successes and route started-without-receipt effects through the common recovery policy as `UNKNOWN`.
- Enforce candidate-facing redaction and dark-mode assertions; do not copy common evaluator, canary, promotion, receipt,
  certificate, sealing, or effect-recovery logic.

### Phase 3: Verification
- Replay a sealed corpus in clean and checkpointed forms and compare all variant and common projection bytes and fingerprints.
- Inject duplicate, reordered, missing, late, unsupported, stale, and malformed events and confirm typed fail-closed outcomes.
- Crash at proposal, trial, scoring, canary, promotion, receipt, and logical-commit boundaries; verify no double apply and no
  implicit retry of an unknown effect.
- Change AgentIR closure, evaluator epoch, fixture, executor, tool schema, reducer, and manifest inputs and verify the declared
  reuse, revision, fork, quarantine, or reject result.
- Verify redaction, zero authority writes, common-service reuse, branch preservation, and the handoff evidence consumed by
  `006-shadow-parity`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Fold an identical sealed Agent Improvement event range in independent processes and compare canonical projection bytes, state hashes, and resume fingerprints |
| REQ-002 | Execute the ladder matrix for run, AgentIR, candidate, behavior experiment, evaluation, scoring, canary, promotion, and terminal states; every row resolves or fails closed |
| REQ-003 | Rebuild candidate and AgentIR lineage after interruption and assert parent, component, clause, operator, profile, first-divergent, and raw-trial references remain unchanged |
| REQ-004 | Replay the same request key twice, then replay it with one payload or fingerprint change; the first returns the existing receipt and the second fails closed |
| REQ-005 | Crash after effect start and before receipt, after receipt and before commit, and after sibling completion; assert `UNKNOWN`, no duplicate logical commit, and branch-local reuse |
| REQ-006 | Mutate manifest, AgentIR closure, evaluator capsule, fixture epoch, executor, tool schema, topology, reducer, and upcaster; assert the planned compatibility outcome and no silent success reuse |
| REQ-007 | Run shared evaluator/canary/promotion receipt fixtures through the variant adapter and compare service identities and fields against common contracts; reject local semantic overrides |
| REQ-008 | Inject critical family regression, canary veto, hidden-evidence leak, stale artifact, and insufficient evidence; assert resume remains blocked and legacy authority is unchanged |
| REQ-009 | Compare full replay with checkpoint plus tail replay across valid and incompatible checkpoints; require identical projections for valid inputs and typed refusal for invalid inputs |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The adapter depends on the typed ledger and event envelope, deterministic Agent Improvement reducers and projections, shared
sealed artifact references, common certificate and receipt fingerprints, and common evaluator/canary/promotion/effect
recovery services. It also consumes phase-015 mode interfaces and the phase-012 write-set and replay contracts. The 065/002
findings supply the mode-specific invariants: typed AgentIR and causal slicing, blocker-aware successive halving, frozen
improver/evaluator material, behavior-family retention, cross-executor transfer, and exposure-aware canaries. `006-shadow-parity`
consumes the adapter's replay and mismatch evidence; no dependency is added to the manifest's `depends_on: []` planning field.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Disable the dark Agent Improvement resume adapter at its read/decision boundary and preserve the sealed ledger, receipts,
projection snapshots, and legacy state unchanged. Revert only the adapter and fixture changes in a path-scoped commit; do not
delete evidence or rewrite prior events. If a resumed effect is ambiguous, stop re-entry and leave it `UNKNOWN` for the common
effect-recovery policy. The rollback target is the legacy process-local/JSONL resume path until the adapter is repaired and
replayed against the same frozen corpus; no authority cutover is part of this phase.
<!-- /ANCHOR:rollback -->
