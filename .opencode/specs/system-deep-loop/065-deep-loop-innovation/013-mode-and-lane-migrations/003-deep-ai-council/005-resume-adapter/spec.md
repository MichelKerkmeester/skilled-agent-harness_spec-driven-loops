---
title: "Feature Specification: Deep AI Council resume adapter (013 phase 005)"
description: "Plan the Deep AI Council resume adapter for the typed event-ledger migration. The adapter reconstructs interrupted multi-seat deliberations from the sealed ledger through deterministic reducers, maps the continuity ladder to derived runtime state, and makes re-entry idempotent without double-applying, losing, or replaying events."
trigger_phrases:
  - "Deep AI Council resume adapter"
  - "council ledger resume"
  - "idempotent council re-entry"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined ledger-only resume boundaries for the Deep AI Council phase"
    next_safe_action: "Specify reducer replay order and idempotent re-entry fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep AI Council Resume Adapter

> Phase adjacency under the `003-deep-ai-council` parent (grouping order, not a runtime dependency): predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-ai-council |
| **Origin** | Phase 013 Deep AI Council migration: resume adapter for the typed event-ledger substrate |
| **Depends on** | None in `phase-tree.json`; consumes the shared contracts supplied by the mode-migration parent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Deep AI Council holds live multi-seat state across independent deliberation seats, critique rounds, convergence, sealed
`ai-council` artifacts, and the council test gate. A process interruption can currently leave the control plane between an
external seat effect and its persisted state, or can make a re-entry path reconstruct only the last coarse checkpoint. That
creates two opposite failures: a completed seat or artifact is applied twice, or an accepted event and its dependent council
state disappear from the next run.

This phase plans a mode-owned resume adapter that treats the sealed typed ledger as the only execution truth. It replays the
ledger through deterministic Deep AI Council reducers, maps the resulting state onto the continuity ladder, and emits an
idempotent re-entry decision. The adapter must distinguish completed work, pending work, unknown effects, incompatible
history, and blocked recovery without consulting mutable prose, current model output, or an unsealed tail. It plans the
resume boundary only; it does not move authority, redesign council scoring, or implement the shared ledger substrate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Deep AI Council resume state machine for `deliberation -> critique -> convergence -> ai-council artifacts -> council test gate`.
- A sealed-ledger replay entrypoint that verifies the run lineage, seal frontier, event-chain integrity, schema compatibility, and replay fingerprint before reduction.
- Mode reducers for logical seats and attempts, stable claim/message IDs, dissent and critique rounds, blinded adjudication observations, convergence decisions, artifact seals, and gate outcomes.
- A continuity-ladder mapping from the reduced council state to `packet_pointer`, last committed action, next admissible action, blockers, progress, open claims, and answered questions without treating prose continuity as authority.
- An idempotent re-entry contract using stable run, branch, event, effect, and resume-request identities; duplicate requests reuse the existing decision and never append duplicate semantic work.
- Crash-boundary handling for dispatch-without-result, result-without-fold, seal-without-gate, unknown side effects, truncated ledgers, and replay-version incompatibility.
- Fixtures and verification criteria for deterministic replay, no lost events, no double-apply, no accidental re-execution, and safe blocking.

### Out of Scope
- The shared typed event envelope, append-only ledger, transition-authorization gateway, replay registry, or effect-recovery service owned by earlier shared phases.
- The Deep AI Council schema beyond the fields required to reconstruct resume state; new deliberation, critique, scoring, or aggregation behavior.
- Certificate and receipt primitives owned by the predecessor `004-certificates-and-receipts`; this phase consumes their immutable references and recovery status.
- Shadow-parity implementation owned by the successor `006-shadow-parity`; this phase defines the resume outputs that parity must compare.
- Authority cutover, legacy-writer retirement, or migration of arbitrary in-flight packets outside the Deep AI Council mode.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resume truth comes only from a sealed ledger frontier | A valid run is reduced from an immutable event sequence with a verified seal digest; unsealed, truncated, or tampered tails produce an explicit blocked outcome. |
| REQ-002 | The mode reducer reconstructs every council stage | The reduced state identifies completed and pending logical seats, critique rounds, convergence decisions, artifact seals, and council-gate status without reading mutable transcripts as control state. |
| REQ-003 | Logical identity survives attempts and process restarts | Retries preserve `logicalBranchId`, `claimId`, `messageId`, and `effectId`; `attemptId` may change, but a new attempt cannot create a second semantic seat result. |
| REQ-004 | Re-entry is idempotent | Repeating the same resume request under the same run, seal frontier, adapter fingerprint, and boundary returns the same decision and produces no duplicate semantic event or side effect. |
| REQ-005 | Recovery distinguishes safe reuse from unsafe repetition | Completed receipts are reused; missing results are planned from persisted event state; unknown irreversible effects reconcile or block; no adapter blindly retries an unknown effect. |
| REQ-006 | Continuity-ladder fields are derived projections | The adapter maps the reduced state to a packet pointer, recent action, next safe action, blockers, progress, open questions, and answered questions; these fields cannot override ledger state. |
| REQ-007 | Replay compatibility is explicit and version-bound | The adapter compares the persisted replay fingerprint, reducer version, event schema, judge configuration, and artifact codecs, returning exact, compatible, migrate, pin-old-runtime, or blocked outcomes through the shared registry. |
| REQ-008 | Resume preserves council information boundaries | Blinded provenance, private pre-discussion estimates, dissenting messages, minority claims, judge observations, and order-swapped outcomes remain associated with stable IDs during reduction. |
| REQ-009 | The council gate is deterministic after interruption | When all required immutable inputs and receipts exist, the gate reducer can be rerun without new model calls; incomplete or stale inputs produce a typed wait, widen, reconcile, or block decision. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A resumed council reaches the same reduced state and resume decision as a clean replay from the same sealed ledger, including logical seat, claim, minority, artifact, and gate identities.
- **SC-002**: Re-entering an interrupted run twice does not append duplicate semantic events, repeat a completed side effect, or create a second result for one logical branch.
- **SC-003**: A crash at every declared boundary yields one of reuse, continue, reconcile, wait, migrate, pin-old-runtime, or block with a persisted reason and no silent loss.
- **SC-004**: Continuity-ladder output points to the next reducer-approved action and exposes unresolved claims or blockers without becoming a second source of runtime truth.
- **SC-005**: The adapter refuses an unsealed, tampered, incompatible, or ambiguously recovered ledger and leaves the legacy authority boundary unchanged.

**Given** a sealed ledger ending after three of five logical seat results, **When** the adapter resumes the council, **Then** it reuses the three recorded results and schedules only the two missing logical branches.

**Given** a resume request was already accepted for a seal frontier, **When** the same request is submitted again, **Then** the adapter returns the original decision without a second semantic event or side effect.

**Given** an effect is recorded as dispatched without a verified provider receipt, **When** the adapter rebuilds state, **Then** it selects reconciliation or an explicit block according to adapter capability and never performs an automatic blind retry.

**Given** an unsealed tail follows the last valid council event, **When** the adapter is asked to resume from that tail, **Then** it refuses the tail and reports the last sealed frontier as the only safe recovery boundary.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is treating a convenience checkpoint or continuity note as authoritative after an interruption. The adapter
must instead replay the sealed event frontier and use continuity fields only as a derived handoff view. A second risk is
confusing attempt identity with logical seat identity; the reducer must preserve branch and claim identity across retries.
Unknown external effects are inherently non-atomic with local append, so recovery must use the shared receipt and effect policy
and must block when the provider cannot prove idempotent reuse. Judge configuration drift, changed reducer code, altered
artifact codecs, or changed blinding rules can make a current replay appear valid while changing the verdict; persisted
fingerprints and explicit compatibility outcomes prevent silent acceptance.

Dependencies are the shared ledger and authorization contract, the certificates and receipts work in predecessor
`004-certificates-and-receipts`, the mode-level event schema and reducer interfaces, the continuity identity contract, and the
successor `006-shadow-parity` fixtures. The phase-tree declares no direct runtime dependency for this planning child; the
ordering references above are sibling navigation contracts.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None block this planning contract. The implementation must resolve these against the frozen shared contracts before code lands:

- Which canonical seal event and frontier digest does the shared ledger expose to the mode adapter?
- Which event types are sufficient to distinguish a seat result committed before a crash from an effect whose provider outcome is unknown?
- Which continuity-ladder fields are persisted as operator handoff metadata, and which are emitted only as a derived resume projection?
- What compatibility disposition is permitted when a historical judge fingerprint is readable but its current evaluator cannot reproduce the original codec?
- Which council gate inputs may be recomputed from immutable artifacts, and which missing receipt must force `BLOCK` rather than `WAIT`?
<!-- /ANCHOR:questions -->
