---
title: "Tasks: Deep Alignment - Certificates & Receipts"
description: "Tasks for the Deep Alignment per-run certificate, per-transition receipt, authority-epoch replay-fingerprint, and independent offline-verifier contract."
trigger_phrases:
  - "deep alignment certificates and receipts tasks"
  - "deep-alignment authority receipt tasks"
  - "offline alignment verifier tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Split authority, certificate, receipt, and verifier tasks"
    next_safe_action: "Map alignment transitions to receipt and fingerprint obligations"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which phase-006 primitive seals the run certificate?"
    answered_questions:
      - "The certificate attests process integrity, not semantic truth"
---
# Tasks: Deep Alignment - Certificates & Receipts

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

- [ ] T001 Confirm phase `003-sealed-artifacts`, phase 012 shared review-loop contracts, and `001-typed-ledger-schema` are frozen before naming certificate or receipt fields
- [ ] T002 Inventory every Deep Alignment authority, lane, subject, applicability, observation, evidence, candidate, verification, proof, adjudication, deviation, witness replay, convergence, and terminal transition
- [ ] T003 Build the receipt coverage matrix for authority validity, scope, applicability, evidence, proof, verification, adjudication, deviations, coverage, convergence, recovery, continuity, and completion
- [ ] T004 [P] Record the Deep Alignment and Deep Review shared-backbone boundary and reject mode-local copies of shared transitions
- [ ] T005 [P] Freeze the offline verifier trust bundle and its allowed certificate, ledger, authority, contract, witness, and sealed-artifact inputs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Define the versioned transition receipt type with shared identity, causal, authorization, event-tail, authority, subject, applicability, attempt, effect, input, output, and evidence references
- [ ] T007 Define the per-run certificate subject, attested claims, authority validity, epoch compatibility, lane and applicability coverage, receipt-set root, proof/adjudication state, deviation state, and verifier result
- [ ] T008 Define the receipt matrix for authority binding and validation, lane and subject setup, applicability, observation/evidence, candidate, verification, proof, adjudication, deviation, witness replay, convergence, blocked stop, handoff, and completion
- [ ] T009 Define stable and behavior input classes for the canonical replay fingerprint, including authority, epoch, rule IR, profile, applicability, lanes, subjects, verifier, analyzer, tool, schema, policy, witness, deviation, artifact, reducer, and handoff inputs
- [ ] T010 Define exact, compatible, migrate, degraded, pin-old-runtime, blocked, invalid, incomplete, not-applicable, unresolved, and unknown-effect outcomes without collapsing them into terminal success
- [ ] T011 Define append-only supersession, late-evidence, deviation, and authority-witness replay links; preserve raw observations and require proof plus adjudication receipts before blocking conformance
- [ ] T012 Define the independent offline verifier pipeline and fixtures for valid and invalid authority, applicability outcomes, proof-carrying findings, deviations, epoch drift, normal, incomplete, blocked, retried, tampered, unknown-version, and missing-reference runs
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify the receipt and certificate types reuse phase `003-sealed-artifacts` and phase 012 primitives without duplicate shared identity, lineage, authorization, or replay fields
- [ ] T014 Verify every in-scope transition has immutable receipt coverage and every receipt resolves to causal, authorization, authority, subject, event-tail, input, output, and effect references
- [ ] T015 Verify certificate claims resolve to the pinned event range, receipt-set root, authority validity, lane and applicability coverage, proof/adjudication state, convergence outcome, handoff, and unresolved or blocked IDs
- [ ] T016 Verify unchanged replay produces stable receipt and run fingerprints, while changed authority, epoch, subject, profile, verifier, tool, witness, policy, schema, artifact, reducer, or handoff inputs produce typed mismatch decisions
- [ ] T017 Verify applicability, observation, candidate, proof, verification, adjudication, deviation, conformance, convergence, and handoff stages remain separate and raw observations are never replaced by derived claims
- [ ] T018 Verify the offline verifier runs without model, network, external tool, or mutable workspace access and fails closed on authority invalidity, tampering, missing inputs, unknown versions, mutable references, and contradictory chains
- [ ] T019 Verify unknown external effects, unresolved applicability, incomplete proof, and blocked authority states remain explicit and cannot become successful conformance through retry or certificate generation
- [ ] T020 Verify the phase scope excludes reducers, projections, sealed-artifact implementation, resume policy, shadow parity, rollback switching, authority cutover, and mode-gate implementation
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `003-sealed-artifacts/`
- **Successor**: See `005-resume-adapter/`
<!-- /ANCHOR:cross-refs -->
