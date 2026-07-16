---
title: "Tasks: Deep AI Council - Rollback & Mode Gate"
description: "Tasks for planning the Deep AI Council fail-closed rollback switch, bounded rollback window, independent shadow-parity gate, and mode-specific certificate handoff."
trigger_phrases:
  - "Deep AI Council rollback and mode gate tasks"
  - "deep-ai-council cutover gate tasks"
  - "council shadow parity rollback tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Listed switch, window, gate, certificate, and rollback planning tasks"
    next_safe_action: "Resolve shared contract inputs before drafting gate implementation fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep AI Council - Rollback & Mode Gate

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

- [ ] T001 Confirm the phase remains planning-only and authority stays with the legacy Deep AI Council path
- [ ] T002 [P] Record the exact shared contract fingerprints for ledger, reducers, seals, receipts, certificates, replay, resume, and shadow parity
- [ ] T003 Identify the legacy authority anchor and typed shadow frontier for every mode-gate lifecycle boundary
- [ ] T004 Build the Deep AI Council gate input manifest from the typed schema, reducer, artifact, certificate, resume, and parity contracts
- [ ] T005 [P] Map the research findings for effective independence, dissent preservation, blinded adjudication, order swaps, counterfactuals, and protocol routing to gate evidence
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Define the default-deny rollback-switch states and authorized transition table
- [ ] T007 Define the fail-closed refusal taxonomy for absent, malformed, stale, unauthorized, mixed-version, expired, and wrong-mode evidence
- [ ] T008 Define the bounded rollback-window record with window ID, legacy anchor, typed frontier, expiry, trigger policy, and fencing token
- [ ] T009 Define rollback trigger precedence for parity regression, certificate invalidity, stale seal, unknown effect, replay mismatch, gate failure, and health degeneration
- [ ] T010 Define restoration and close receipts without rewriting legacy rows or deleting typed evidence
- [ ] T011 Define the full Deep AI Council shadow-parity fixture matrix across seats, critique, adjudication, convergence, artifacts, test gate, resume, and rollback
- [ ] T012 Define required effective-independence, minority, contradiction, calibration, bias, order-swap, and control-arm evidence
- [ ] T013 Define the mode-gate predicates and explicit `passed`, `blocked`, `incomplete`, and `rollback_required` dispositions
- [ ] T014 Define the Deep AI Council certificate body, mode binding, exact fingerprints, sealed manifest, receipt chain, and unresolved-obligation fields
- [ ] T015 Define the phase-017 handoff contract and prohibit authority permission without a later cutover receipt
- [ ] T016 Define offline verifier inputs and deterministic re-evaluation rules for the same sealed frontier
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Verify malformed and wrong-mode switch inputs fail closed to legacy authority with typed refusal evidence
- [ ] T018 Verify rollback windows expire, close, and re-arm only under new identities and explicit policy
- [ ] T019 Verify typed and legacy lifecycle outcomes match for normal, partial, timeout, late-result, and terminal fixtures
- [ ] T020 Verify correlated seats, minority suppression, stance flips, judge bias, order inconsistency, and counterfactual changes block or escalate as declared
- [ ] T021 Verify all required artifact references, seals, receipts, replay inputs, and certificate fields before gate pass
- [ ] T022 Verify missing receipts, unknown effects, incompatible history, failed bias checks, and non-convergence never become green
- [ ] T023 Verify the same frontier produces the same mode-gate disposition and certificate body digest on repeated evaluation
- [ ] T024 Run rollback drills at each declared trigger and prove legacy restoration, effect reconciliation, and evidence retention
- [ ] T025 Verify no test or gate operation changes authority, rewrites legacy state, deletes typed evidence, or crosses mode boundaries
- [ ] T026 Verify the final handoff contains a Deep AI Council certificate and all phase-017 prerequisites without claiming cutover
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
- **Predecessor parity contract**: `006-shadow-parity`
- **Cutover consumer**: `014-staged-state-migration-and-authority-cutover`
<!-- /ANCHOR:cross-refs -->
