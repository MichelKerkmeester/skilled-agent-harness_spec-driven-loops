---
title: "Feature Specification: Agent Improvement certificates and receipts"
description: "Plan the Agent Improvement per-run certificate and per-transition receipt contract over the typed event-ledger substrate. The phase binds proposal generation and scoring evidence to replay fingerprints and offline verification while reusing deep-improvement-common evaluator, canary, and promotion services."
trigger_phrases:
  - "agent improvement certificates and receipts"
  - "agent-improvement replay fingerprint"
  - "typed event ledger receipts"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Agent Improvement certificates and transition receipts over common services"
    next_safe_action: "Freeze certificate fields and verifier vectors against phase-006 primitives"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Agent Improvement Certificates & Receipts

> Phase adjacency under the Agent Improvement lane (grouping order, not a runtime dependency): predecessor `003-sealed-artifacts`; successor `005-resume-adapter`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Formal depends_on** | [] |
| **Origin** | Phase 013 Agent Improvement migration: certificates and receipts over the typed event-ledger substrate |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Agent Improvement generates and scores mutable agent proposals across a lineage of target definitions, operator choices, evaluator observations, and promotion decisions. A terminal score or status does not prove which proposal, evaluator epoch, canary set, executor, budget, or prior transition produced it, and it cannot be independently replayed after the live services change. The typed ledger therefore needs a mode-specific per-run certificate and receipts for every proposal/scoring/promotion transition.

The certificate must attest to the completed Agent Improvement run without making the certificate itself the evaluator. Each receipt must bind one authorized transition to its ordered inputs, outputs, predecessor receipts, and evidence digests. Replay fingerprints must make the relevant dependency closure explicit, while an offline verifier must recompute the fingerprints and reject missing, reordered, mutated, stale, or unauthorized evidence.

### Purpose

Plan a typed `CERTIFICATE` plus transition `RECEIPTS` contract for Agent Improvement that consumes the phase-006 primitives, references deep-improvement-common evaluator/canary/promotion services, and can be re-verified offline before the mode gate accepts shadow parity.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Agent Improvement per-run `CERTIFICATE`: run identity, candidate and parent lineage, AgentIR or equivalent target digest, transition frontier, sealed-artifact references, evaluator/canary/promotion epochs, final disposition, and receipt-root binding.
- Typed per-transition `RECEIPTS` for proposal creation or mutation, candidate execution, evaluator observation, score reduction, canary analysis, promotion decision, rollback decision, and terminal run closure where those transitions are emitted by this mode.
- A canonical replay-fingerprint input vector covering event and schema versions, ordered parent receipt IDs, candidate and target digests, mutation/operator lineage, common-service dependency digests, fixture commitments, executor/model/tool configuration, budgets, normalization and reducer versions, and prior state/checkpoint identity.
- An independent offline verifier that consumes only the certificate, receipts, sealed-artifact references, event-ledger records, and declared immutable dependency manifests; it recomputes hashes and transition relations without network or mutable evaluator access.
- Agent Improvement fixtures for valid runs, lineage forks, evaluator-epoch changes, missing or duplicate receipts, reordered transitions, altered raw evidence, and verifier refusal outcomes.
- Integration rules that reuse deep-improvement-common evaluator, canary, and promotion services and preserve their receipt identities instead of re-implementing their behavior in this mode.

### Out of Scope
- Implementing or changing the shared evaluator, canary, promotion, budget, or effect-recovery services owned by mode 004 `004-deep-improvement-common`.
- Defining the sealed-artifact primitive or its storage lifecycle owned by predecessor `003-sealed-artifacts`; this phase only binds its immutable references into Agent Improvement evidence.
- Implementing the generic typed ledger, transition-authorization gateway, receipt persistence, upcasters, or legacy projections owned by phases 006-008.
- Building the resume adapter owned by successor `005-resume-adapter`; resume will consume these contracts after they are frozen.
- Moving authority from the legacy path, deleting legacy writers, or selecting a global agent champion outside the staged cutover and shared promotion contracts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Agent Improvement migration surfaces selected by the phase-012 write-set graph | Modify | Add the mode-specific certificate, receipt, fingerprint, and offline-verifier bindings without duplicating common services |
| Agent Improvement mode fixtures and verifier tests | Create | Cover valid evidence, replay determinism, tamper rejection, and common-service epoch boundaries |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` in this folder | Create | Record the planning contract and its blocking verification matrix |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The per-run `CERTIFICATE` attests to one Agent Improvement run and its terminal evidence boundary. | A schema fixture binds the run ID, mode/variant, target and candidate lineage, AgentIR/target digest, sealed-artifact references, common-service epochs, terminal transition, receipt root, final disposition, and verifier result without relying on mutable live state. |
| REQ-002 | Every Agent Improvement transition that can affect candidate lineage, score, canary state, promotion, rollback, or terminal status emits one typed `RECEIPT`. | A transition matrix maps each allowed event to exactly one receipt shape, event ID, actor/authority context, ordered parents, input/output digests, and evidence references; missing, duplicate, or orphan receipts fail validation. |
| REQ-003 | Replay fingerprints include the complete Agent Improvement dependency closure. | Recomputing a fingerprint from the canonical vector changes when any event/schema version, ordered parent, candidate or target digest, operator lineage, evaluator/canary/promotion epoch, fixture commitment, executor/model/tool setting, budget, normalization, reducer, or prior-state input changes. |
| REQ-004 | An independent verifier can validate the certificate and receipts offline. | A clean verifier fixture accepts a valid run using local immutable inputs only and fails closed on digest mismatch, receipt reorder, missing dependency, schema incompatibility, unauthorized transition, stale epoch, or incomplete evidence. |
| REQ-005 | Agent Improvement reuses deep-improvement-common evaluator, canary, and promotion services. | The integration inventory identifies the shared service IDs and receipt contracts consumed by this mode; no mode-local evaluator, canary, promotion, or threshold implementation is introduced. |
| REQ-006 | The contract consumes phase-006 receipt/certificate primitives and the `003-sealed-artifacts` artifact references without redefining their ownership. | Cross-phase fixtures show primitive IDs, artifact digests, and lifecycle state are referenced and verified consistently; an incompatible primitive version is refused rather than silently coerced. |
| REQ-007 | The certificate and receipt contract remains non-authoritative until the Agent Improvement mode gate proves shadow parity. | The mode gate records certificate/verifier parity evidence while authority remains on the legacy path; no certificate is treated as a cutover authorization. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Raw evaluator observations remain distinct from normalized scores and later score-policy reductions. | A receipt preserves raw observation references and normalization/reducer versions so an evaluator policy replay does not masquerade as a new candidate execution. |
| REQ-009 | Candidate-blind and hidden-evidence boundaries are represented in the evidence contract. | Receipt payloads expose digests and typed verdicts to the proposer while withholding protected fixture identity or exact hidden scores until the declared disclosure transition. |
| REQ-010 | Verifier failures are typed and actionable. | The fixture matrix distinguishes `MISSING_EVIDENCE`, `FINGERPRINT_MISMATCH`, `TRANSITION_UNAUTHORIZED`, `EPOCH_MISMATCH`, `SCHEMA_INCOMPATIBLE`, and `INCOMPLETE_RUN` rather than collapsing them into a generic failed status. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A complete Agent Improvement run has one certificate and a receipt for every mode-specific state-changing transition, with a recomputable receipt root.
- **SC-002**: Offline verification accepts valid fixtures and rejects altered inputs, reordered receipts, missing dependencies, stale common-service epochs, and unauthorized transitions without network access.
- **SC-003**: The replay fingerprint changes for every load-bearing dependency in the declared vector and remains stable for semantically identical canonical inputs.
- **SC-004**: Common evaluator, canary, and promotion services are referenced through their frozen contracts; no duplicate mode-local implementation is needed for the mode gate.
- **SC-005**: The Agent Improvement mode gate can report certificate and receipt shadow parity while the legacy path remains authoritative.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 receipt/certificate primitives and sibling `003-sealed-artifacts` contract | Primitive identity or artifact lifecycle drift can invalidate every Agent Improvement certificate | Pin primitive and artifact schema digests in the fingerprint vector; reject incompatible versions explicitly |
| Dependency | Mode 004 `004-deep-improvement-common` evaluator, canary, and promotion services | Re-implementing shared logic would create divergent thresholds and unverifiable evidence | Consume shared service IDs, epochs, and receipts as typed dependencies; keep mode-specific code at the binding boundary |
| Dependency | Phase 012 shared mode contracts and write-set conflict graph | A receipt schema that overlaps another lane can make parallel migration unsafe | Use the emitted write-set ownership and freeze the Agent Improvement event namespace before execution |
| Dependency | Phases 006-008 typed ledger, control services, and compatibility bridge | Offline verification cannot be authoritative without stable event IDs, transition rules, and immutable inputs | Keep this phase planned against those interfaces and retain legacy authority until the mode gate passes |
| Risk | Candidate lineage or operator metadata is omitted from the fingerprint | Replays can validate a different proposal as if it were the recorded run | Require candidate, parent, operator, and target digests in every proposal and scoring receipt |
| Risk | Evaluator changes are mistaken for candidate improvement | Score deltas become incomparable across epochs | Bind evaluator, fixture, normalization, and reducer epochs to the certificate and force re-baselining on change |
| Risk | A successful nominal score hides authority, side-effect, or evaluator-integrity regressions | Promotion can reward a candidate that changed evidence or violated agent constraints | Keep integrity and behavior receipts separate; require canary, invariant, and hidden-evidence outcomes in the mode gate |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which canonical certificate and receipt-root algorithm is fixed by the phase-006 primitives, and which fields remain mode-owned extensions?
- Does the Agent Improvement receipt reference common-service receipts by stable ID only, or also carry a typed projection needed by the offline verifier?
- Which event namespace and transition vocabulary does phase 015 freeze for proposal, evaluation, canary, promotion, rollback, and closure transitions?
- What disclosure transition releases exact evaluator scores or protected fixture identities after candidate optimization ends?
- Which verifier failure codes are shared across modes and which Agent Improvement codes belong in the mode-specific contract?
<!-- /ANCHOR:questions -->
