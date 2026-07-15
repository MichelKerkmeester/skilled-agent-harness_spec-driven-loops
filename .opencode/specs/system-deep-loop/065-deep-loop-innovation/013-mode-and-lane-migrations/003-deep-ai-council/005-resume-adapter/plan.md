---
title: "Implementation Plan: Deep AI Council resume adapter (013 phase 005)"
description: "Implementation Plan for the Deep AI Council resume adapter: sealed-ledger reduction, continuity-ladder projection, crash recovery, and idempotent re-entry across deliberation, critique, convergence, artifact, and council-gate stages."
trigger_phrases:
  - "Deep AI Council resume adapter implementation plan"
  - "council reducer replay plan"
  - "ledger-backed council recovery"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped council stages to sealed-ledger reducer state"
    next_safe_action: "Define recovery dispositions for every crash boundary"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep AI Council Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-ai-council |
| **Change class** | Mode migration planning: reducer, recovery policy, and replay fixtures |
| **Execution** | After shared mode contracts and the certificates/receipts boundary are frozen; no authority cutover |

### Overview
The adapter will open a sealed council ledger, verify its run lineage and replay compatibility, fold events in sequence through
pure mode reducers, and return a typed resume decision plus a continuity-ladder projection. The reducer treats deliberation,
critique, convergence, artifact sealing, and the council test gate as explicit stages. Re-entry is keyed by stable logical
identities and the seal frontier, allowing the same request to reuse a prior decision while leaving completed seats, effects, and
artifacts untouched. Detailed event names remain aligned to the shared namespace rather than introducing a mode-local ledger.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The shared event envelope, seal frontier, replay registry, authorization gateway, and effect-recovery capability contract are frozen.
- [ ] The Deep AI Council event inventory identifies logical branches, attempts, claims, messages, rounds, judge observations, artifacts, and gate decisions.
- [ ] The certificates and receipts boundary exposes immutable receipt lookup and unknown-effect dispositions.
- [ ] The continuity-ladder mapping names every derived field and its ledger projection source.
- [ ] Crash fixtures cover interruption before dispatch, after dispatch, after result, during reduction, after artifact sealing, and before gate completion.
- [ ] The idempotency key and resume-request identity are defined independently from attempt IDs and process IDs.

### Definition of Done
- [ ] A sealed-ledger replay reconstructs the council state and deterministic next action for every declared stage.
- [ ] Duplicate resume requests and duplicate event delivery are observationally idempotent.
- [ ] Unknown, incompatible, unsealed, and tampered histories fail closed with a persisted recovery disposition.
- [ ] The mode gate consumes the adapter's derived state without changing authority or invoking a new model call for immutable inputs.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Resume boundary**: accept `runId`, requested resume boundary, sealed frontier, persisted replay fingerprint, and adapter version; reject missing or mutable sources before reduction.
- **Verification layer**: verify the seal digest, previous-event hash chain, event sequence, schema versions, lineage identity, judge/configuration hashes, and artifact references. The adapter uses the last valid sealed frontier, never an unsealed tail.
- **Reducer pipeline**: fold shared envelope events through mode reducers in causal order: run control, logical seat ledger, claims/messages, critique rounds, blinded adjudication, convergence, artifact seals, and council gate.
- **State model**: retain `logicalBranchId` across attempts; retain stable `claimId` and `messageId` for dissent and critique; retain effect receipts and status separately from attempt execution state; retain artifact and gate references by digest.
- **Recovery planner**: classify each pending unit as `REUSE`, `CONTINUE`, `RECONCILE`, `WAIT`, `MIGRATE`, `PIN_OLD_RUNTIME`, or `BLOCK`. A plan is itself an immutable, idempotently keyed decision.
- **Continuity projection**: derive packet pointer, last committed action, next reducer-approved action, blockers, progress, open claim/crux IDs, and answered questions from reduced state. Human-readable continuity is a view, not an input to the reducer.
- **Re-entry contract**: key the request by run lineage, sealed frontier digest, adapter/replay fingerprint, and requested boundary. An existing matching decision is returned; a conflicting request is blocked instead of silently widening the replay scope.
- **Effect safety**: reuse a verified receipt, query a receipt-capable provider, compensate through the declared policy, or block. The adapter never retries an unknown irreversible effect merely because the process restarted.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the shared contract and sibling adjacency; record the exact event namespace, seal API, replay registry outcomes, and receipt capability vocabulary without inventing local alternatives.
- Build a mode event inventory from the existing council lifecycle and map each event to its reducer and stable identity fields.
- Define the stage transition table for deliberation, critique, convergence, artifacts, and the council test gate, including legal wait and block states.

### Phase 2: Implementation
- Implement the sealed-frontier verifier and mode reducer composition; reject an unsealed, malformed, tampered, or incompatible history before producing a runnable state.
- Implement logical seat and attempt folding: completed branch results are reusable, missing branch work is identified by logical identity, and retry attempts cannot create duplicate semantic results.
- Implement claim, message, dissent, critique-round, judge-observation, and convergence reducers while preserving blinded provenance, private estimates, minority claims, and order-swapped outcomes.
- Implement artifact and council-gate folding from immutable outputs, certificates, and receipts; allow deterministic re-evaluation only where the shared contract declares it safe.
- Implement the recovery planner and idempotent resume-request event/receipt contract, including reconciliation and explicit blocks for unknown side effects.
- Implement the continuity-ladder projection and make its next-safe-action field a serialization of reducer state rather than free-form control text.

### Phase 3: Verification
- Replay each fixture from an empty reducer and from a persisted interruption point; compare state fingerprints, pending logical branch IDs, recovery disposition, and continuity projection.
- Submit each resume request twice and deliver duplicate event batches; verify no duplicated claims, messages, seat results, artifacts, receipts, or gate decisions.
- Inject interruption at every declared crash boundary and verify reuse, continue, reconcile, wait, migrate, pin, or block is explicit and deterministic.
- Compare exact replay under the same fingerprint and permitted compatible replay under a changed implementation; incompatible judge, schema, codec, or seal inputs must block or use the declared migration path.
- Verify downstream shadow parity can consume the adapter output without treating the adapter as an authority cutover.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Seal and hash-chain fixtures: valid frontier, truncated tail, tampered event, duplicate sequence, and conflicting seal. |
| REQ-002 | Stage replay fixtures for partial deliberation, partial critique, convergence pending, sealed artifacts, and gate pending. |
| REQ-003 | Retry and duplicate-delivery fixtures prove stable logical branch, claim, message, and effect identities across changed attempts. |
| REQ-004 | Idempotency property test submits the same request repeatedly and compares decision fingerprint plus ledger delta. |
| REQ-005 | Effect fixtures cover verified reuse, receipt lookup, compensation, unknown outcome, and unsupported provider capability. |
| REQ-006 | Continuity projection fixtures compare every ladder field with reducer-derived source IDs and reject projection-only control input. |
| REQ-007 | Compatibility matrix covers exact, compatible, migrate, pin-old-runtime, and blocked replay outcomes for reducer, schema, judge, and codec changes. |
| REQ-008 | Blinding and dissent fixtures ensure identity, private estimates, minority claims, and original message IDs survive reduction. |
| REQ-009 | Gate fixtures prove immutable-input re-evaluation is deterministic and missing or stale receipts produce typed non-success states. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The adapter consumes the shared typed ledger, transition authorization, seal and replay-compatibility registry, receipt/effect
recovery gateway, continuity identity, typed budget, and lock/fencing contracts. It consumes the preceding
`004-certificates-and-receipts` output and hands its stable resume projection to `006-shadow-parity`. It also depends on the
Deep AI Council mode schema and the parent phase's write-set conflict graph, but it does not own either shared artifact.

The phase-tree records `depends_on: []` for this planning child. That declaration is preserved: sibling adjacency is navigation
only, while implementation readiness is governed by the shared-contract and certificate inputs described above.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The adapter remains non-authoritative and is introduced behind the existing mode migration switch. If replay parity or
idempotency fails, disable the adapter's resume path, retain the sealed ledger and its receipts as immutable evidence, and route
the mode back to the legacy resume behavior without rewriting ledger events. Any adapter-created resume decision is ignored by
the legacy authority path unless the mode gate explicitly accepts it. Revert the mode-scoped adapter and fixtures as a path-scoped
change; never delete or mutate the sealed event history. Unknown external effects remain blocked or reconciled by the shared
effect policy during rollback.
<!-- /ANCHOR:rollback -->
