---
title: "Implementation Plan: Agent Improvement certificates and receipts"
description: "Implementation Plan for the Agent Improvement certificates and receipts phase: define typed per-run and per-transition evidence over the event ledger, derive replay fingerprints from a frozen dependency closure, and verify the result offline while reusing deep-improvement-common services."
trigger_phrases:
  - "agent improvement certificates and receipts implementation plan"
  - "agent-improvement offline verifier"
  - "replay fingerprint implementation plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the Agent Improvement evidence contract and offline verification route"
    next_safe_action: "Map mode transitions to receipt obligations and canonical fingerprint inputs"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent Improvement Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop Agent Improvement mode, phase 013 child 004 |
| **Change class** | Typed evidence contract and offline verifier |
| **Execution** | After phase 012 shared contracts; shadow-only before staged authority cutover |

### Overview
The implementation adds a mode-owned certificate projection and receipt payloads on top of the typed event-ledger and phase-007 primitives. It derives one canonical replay fingerprint from the Agent Improvement dependency closure, binds shared evaluator/canary/promotion epochs by reference, and lets an independent verifier recompute the evidence from local immutable fixtures. The design extends deep-improvement-common; it does not copy its evaluator, canary, or promotion logic.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 012 shared mode contracts, event namespace, and write-set ownership are frozen
- [ ] Phase-007 receipt/certificate primitives and `003-sealed-artifacts` references have stable schemas
- [ ] Mode 004 `004-deep-improvement-common` service IDs, epochs, and receipt interfaces are available
- [ ] The Agent Improvement transition matrix names every proposal, execution, scoring, canary, promotion, rollback, and closure event
- [ ] The replay-fingerprint canonicalization and verifier refusal vocabulary are agreed

### Definition of Done
- [ ] One per-run certificate and one receipt contract cover every in-scope Agent Improvement transition
- [ ] Fingerprints recompute from local immutable evidence and detect every declared input change
- [ ] Offline verification accepts valid fixtures and rejects tampered, incomplete, stale, reordered, or unauthorized runs
- [ ] Shared evaluator/canary/promotion services are reused through typed dependencies, not reimplemented
- [ ] The Agent Improvement mode gate records shadow parity without changing authority
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Typed event-ledger extension with append-only evidence, content-addressed dependency closure, and a pure offline verifier.

### Key Components
- **Agent Improvement run certificate**: A terminal attestation over the run identity, candidate lineage, sealed artifacts, common-service epochs, receipt root, final disposition, and verifier result.
- **Transition receipt encoder**: A mode-specific typed payload attached to each proposal, execution, scoring, canary, promotion, rollback, or closure transition; it carries ordered parents, input/output digests, and evidence references.
- **Replay-fingerprint builder**: A canonical encoder over event/schema versions, lineage, AgentIR or target digests, operator and executor configuration, fixture commitments, common-service epochs, budgets, normalization, reducers, and prior state.
- **Offline verifier**: A network-free reader that validates schemas, receipt ordering, authorization references, digest equality, epoch compatibility, and certificate closure, returning typed refusal codes on failure.
- **Common-service boundary**: The evaluator, canary, and promotion services remain owned by mode 004 `004-deep-improvement-common`; Agent Improvement records their stable IDs, epochs, inputs, outputs, and receipts as dependencies.

### Data Flow

The mode emits an authorized event and its typed transition receipt together. The receipt records the canonical input vector and output/evidence digests, while the ledger supplies the ordered event and parent relationships. The certificate builder folds the terminal receipt frontier and sealed-artifact references into one run attestation. The offline verifier loads only the recorded ledger slice plus immutable manifests, recomputes each receipt and the final fingerprint, checks the transition chain and shared-service epochs, then emits a typed verification result. A shadow-parity adapter compares that result with the legacy run without granting authority to the certificate.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin the phase-012 shared contract digest, phase-007 primitives, sealed-artifact schema, and common-service interface versions
- [ ] Inventory Agent Improvement transitions and assign ownership using the phase-012 write-set graph
- [ ] Freeze the certificate field matrix, receipt-per-transition matrix, canonical encoding, and typed verifier refusal codes
- [ ] Confirm all hidden or protected evaluator inputs are represented by commitments and disclosure transitions rather than raw payloads

### Phase 2: Implementation
- [ ] Define the Agent Improvement certificate schema and builder over the phase-007 primitive, with stable run, lineage, artifact, epoch, and receipt-root bindings
- [ ] Define receipt payloads for proposal generation, candidate execution, evaluator observation, reduction, canary, promotion, rollback, and closure transitions
- [ ] Implement the canonical replay-fingerprint vector and make every declared dependency change observable in the resulting digest
- [ ] Bind mode 004 evaluator/canary/promotion receipts and epochs as immutable typed dependencies; do not duplicate their algorithms or thresholds
- [ ] Implement the pure offline verifier with explicit schema, ordering, digest, authorization, epoch, and completeness failures
- [ ] Build local fixtures for valid lineages, operator changes, evaluator-epoch changes, score-policy replay, artifact changes, receipt gaps, and receipt reorderings

### Phase 3: Verification
- [ ] Verify a complete valid run from local immutable inputs and compare the certificate root with a recomputed root
- [ ] Mutate each fingerprint input and confirm the verifier rejects the run with the expected typed refusal
- [ ] Confirm raw observations remain replayable independently from normalization and score reduction policy changes
- [ ] Confirm the verifier cannot reach a live evaluator, canary, promotion service, network, or mutable workspace during validation
- [ ] Run Agent Improvement shadow parity and mode-gate checks without an authority flip
- [ ] Run strict validation for this phase folder and preserve the four authored docs as the complete planning write-set
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Build a complete certificate fixture with run identity, candidate lineage, AgentIR/target digest, sealed artifacts, common-service epochs, terminal transition, receipt root, and final disposition; verify it offline |
| REQ-002 | Execute the transition matrix against valid, missing, duplicate, orphaned, and reordered receipt fixtures; require one typed receipt for each in-scope state-changing transition |
| REQ-003 | Change each canonical fingerprint input independently, then assert a digest change; normalize equivalent ordering and assert stable output |
| REQ-004 | Run the verifier in an isolated fixture directory with network and service access unavailable; assert valid acceptance and typed fail-closed outcomes |
| REQ-005 | Inspect the dependency graph and compare service IDs/epochs against mode 004 contracts; reject any mode-local evaluator, canary, or promotion implementation |
| REQ-006 | Replay phase-007 primitive and sealed-artifact fixtures across compatible and incompatible versions; accept only declared compatibility and reject silent coercion |
| REQ-007 | Run the mode gate with certificate shadow output beside the legacy output; assert legacy authority remains unchanged |
| REQ-008 | Re-run normalization and reduction against retained raw observations; assert no new execution receipt is fabricated by a score-policy-only change |
| REQ-009 | Exercise candidate-visible and protected-evidence views; assert commitments remain visible while protected values appear only after the disclosure event |
| REQ-010 | Enumerate verifier refusal codes and assert each negative fixture maps to one actionable code rather than a generic failure |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 receipt/certificate primitives | Internal contract | Planned prerequisite | Certificate and receipt ownership cannot be pinned; stop before defining incompatible local primitives |
| `003-sealed-artifacts` | Sibling mode phase | Planned predecessor | Artifact references and lifecycle checks remain undefined; do not accept certificate fixtures |
| `004-deep-improvement-common` | Internal shared mode | Planned prerequisite | Evaluator/canary/promotion references cannot be validated; keep this phase at contract planning |
| Phase 012 shared mode contracts and write-set graph | Internal contract | Planned prerequisite | Event names and parallel write ownership can drift; defer implementation until frozen |
| Phases 006-008 ledger, evidence, and compatibility services | Internal substrate | Planned | No stable event/authorization/recovery behavior exists for integration; keep legacy authority and use fixtures only |
| `005-resume-adapter` | Sibling successor | Planned successor | Resume consumption is not available; this phase still freezes the evidence contract without implementing resume |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any certificate or receipt cannot be recomputed, a shared-service epoch is misbound, a verifier accepts tampered evidence, shadow parity diverges, or implementation would require common-service duplication.
- **Procedure**: Keep the legacy path authoritative, disable the Agent Improvement certificate adapter, discard only non-authoritative derived projections from the candidate worktree, and revert the path-scoped phase changes. Preserve emitted evidence as rejected fixtures with the failure code; do not rewrite the append-only ledger or sealed artifacts.
<!-- /ANCHOR:rollback -->
