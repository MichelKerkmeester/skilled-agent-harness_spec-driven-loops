---
title: "Tasks: Rollback Drills"
description: "Tasks for implementing and verifying hermetic rollback drills, integrity comparisons, receipt closure, and phase-014 cutover evidence."
trigger_phrases:
  - "rollback drills tasks"
  - "deep-loop rollback evidence tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined setup, runner, integrity, and certificate verification tasks"
    next_safe_action: "Implement the drill manifest and isolation preflight first"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Rollback Drills

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

- [ ] T001 Pin the phase-004 policy, phase tree, parity-certificate, classification, projection, fingerprint, receipt, and rollback-asset versions used by each mode drill
- [ ] T002 Define versioned drill-manifest and drill-certificate schemas with complete identity, timeline, epoch, state, effect, integrity, timing, and verdict bindings
- [ ] T003 Inventory every cutover-eligible mode's control/cutover entry points, rollback anchor, declared regression fixtures, and stricter operational deadline if present
- [ ] T004 Build isolated lane roots, test authority storage, synthetic clock, hermetic effect targets, and before/after guards for real authority and live effects
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement fail-closed manifest preflight for current mode, code, policy, parity, classification, rollback, contract, and isolation inputs
- [ ] T006 Implement immutable capsule cloning plus independent legacy-control and simulated-cutover lanes with no shared mutable output
- [ ] T007 Implement the test-lane forward authority transition, bounded spine workload, durable cut-point evidence, and preserved event-range capture
- [ ] T008 Implement fingerprint, projection, stale-epoch, receipt/effect, crash, and timeout fault injectors with exact production-shaped detector matching
- [ ] T009 Implement admission freeze, spine-writer fencing, predecessor-004 disposition reconciliation, new-epoch legacy restoration, and stale-writer denial
- [ ] T010 Implement legacy resume from the rollback anchor and the control comparison over replay components, projections/readers, state/artifact/event counts, and timing
- [ ] T011 Implement phase-007 receipt/effect verification requiring one intent and one confirmed/reconciled terminal outcome with no conflict or unresolved `in_doubt`
- [ ] T012 Implement immutable pass/fail drill-certificate issuance with complete evidence bindings and cleanup attestation
- [ ] T013 Implement the phase-014 freshness verifier that rejects missing, partial, failed, wrong-mode, stale, tampered, or policy-incompatible drill evidence
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify the full forward-detect-rollback-resume sequence for every cutover-eligible mode without changing real authority or live effects
- [ ] T015 Verify rollback completes before the later-of-14-days-and-five-runs window closes and before any stricter declared mode deadline
- [ ] T016 Verify control and resumed legacy lanes match on registered effective-event and canonical-projection fingerprint components
- [ ] T017 Verify byte-exact legacy projections, unchanged-reader results, state/artifact/event counts, preserved shadow evidence, and monotonic epochs
- [ ] T018 Verify every effect intent closes once, no external mutation duplicates, and ambiguous `in_doubt` recovery blocks certificate issuance
- [ ] T019 Verify every injected regression produces the expected typed detector result and every missing/wrong detector result fails the drill
- [ ] T020 Verify drift in each certificate-bound code, BASE, policy, parity, classification, adapter, projection, fingerprint, or rollback identity blocks phase 014
- [ ] T021 Run crash injection at authority and effect cut points, strict packet validation, and the blocking SOL verifier on the exact candidate evidence
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with mode-scoped evidence
- [ ] Every P0 checklist item passes and every cutover-eligible mode has a current drill certificate
- [ ] Phase gate green (validate/build/test/SOL verification as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification contract**: See `checklist.md`
- **Governing rollback policy**: See `../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- **Parity evidence**: See `../003-shadow-parity-harness/spec.md`
- **Receipt evidence**: See `../../007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md`
<!-- /ANCHOR:cross-refs -->
