---
title: "Tasks: Deep Review - Certificates & Receipts"
description: "Tasks for the Deep Review per-run certificate, per-transition receipt, replay-fingerprint, and independent offline-verifier contract."
trigger_phrases:
  - "deep review certificates and receipts tasks"
  - "deep-review transition receipt tasks"
  - "offline certificate verifier tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the Deep Review attestation boundary and verifier inputs"
    next_safe_action: "Finalize receipt and certificate fields against phases 003 and 009"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact phase-006 certificate primitive signs or seals the run certificate?"
    answered_questions:
      - "The certificate attests recorded process integrity, not semantic truth"
---
# Tasks: Deep Review - Certificates & Receipts

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
- [ ] T002 Inventory every Deep Review typed event and its scope, evidence, adjudication, convergence, synthesis, report, and continuity references
- [ ] T003 Build the receipt coverage matrix for run, scope, pass, evidence, adjudication, lineage, convergence, recovery, synthesis, report, and completion transitions
- [ ] T004 [P] Record the Deep Review and deep-alignment shared-backbone boundary and reject mode-local copies of shared transitions
- [ ] T005 [P] Freeze the offline verifier trust bundle and its allowed certificate, ledger, contract, and sealed-artifact inputs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Define the versioned transition receipt type with shared identity, causal, authorization, event-tail, attempt, effect, input, output, and review evidence references
- [ ] T007 Define the per-run certificate subject, attested claims, receipt-set root, finalized event range, report handoff, unresolved state, and verifier result
- [ ] T008 Define the receipt matrix for scope resolution, ordered dimensions, candidate/evidence events, adjudication, finding lineage, convergence, blocked stop, synthesis, report publication, and completion
- [ ] T009 Define stable and behavior input classes for the canonical replay fingerprint, including target, scope, dimensions, protocol, executor, tool, analyzer, evaluator, schema, policy, artifact, reducer, and report inputs
- [ ] T010 Define exact, compatible, migrate, pin-old-runtime, blocked, invalid, incomplete, and unknown-effect outcomes without collapsing them into terminal success
- [ ] T011 Define append-only supersession and late-evidence links; preserve raw observations and require adjudication receipts before P0/P1/P2 activation
- [ ] T012 Define the independent offline verifier pipeline and fixtures for normal, incomplete, blocked, contested, retried, late, tampered, unknown-version, and missing-reference runs
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify the receipt and certificate types reuse phase `003-sealed-artifacts` and phase 012 primitives without duplicate shared identity, lineage, authorization, or replay fields
- [ ] T014 Verify every in-scope transition has immutable receipt coverage and every receipt resolves to causal, authorization, event-tail, input, output, and effect references
- [ ] T015 Verify certificate claims resolve to the pinned event range, receipt-set root, scope and dimension coverage, convergence outcome, report revision, and unresolved or blocked IDs
- [ ] T016 Verify unchanged replay produces stable receipt and run fingerprints, while changed target, policy, schema, tool, evaluator, artifact, reducer, or report inputs produce typed mismatch decisions
- [ ] T017 Verify candidate, evidence, adjudication, P0/P1/P2, convergence, and report stages remain separate and raw observations are never replaced by derived claims
- [ ] T018 Verify the offline verifier runs without model, network, external tool, or mutable workspace access and fails closed on tampering, missing inputs, unknown versions, and contradictory chains
- [ ] T019 Verify unknown external effects remain unknown or recovery-required and cannot be certified as successful completion
- [ ] T020 Verify the phase scope excludes reducers, report rendering, resume policy, rollback switching, authority cutover, and mode-gate implementation
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
