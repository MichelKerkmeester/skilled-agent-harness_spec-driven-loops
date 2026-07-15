---
title: "Tasks: Deep Research - Rollback and Mode Gate (010 phase 007)"
description: "Tasks for planning and verifying the Deep Research fail-closed rollback switch, bounded rollback window, independent migration gate, and phase-011 certificate handoff."
trigger_phrases:
  - "Deep Research rollback and mode gate tasks"
  - "deep-research rollback switch tasks"
  - "deep-research migration gate tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Research rollback switch and independent mode-gate contract"
    next_safe_action: "Freeze rollback triggers and gate evidence against phase-009 contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research - Rollback and Mode Gate

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

- [ ] T001 Pin BASE and read the phase-009 shared contracts, write-set conflict graph, shared rollback policy, and phase-011 cutover handoff
- [ ] T002 [P] Inventory Deep Research sibling outputs `001` through `006` and bind their event, reducer, seal, certificate, receipt, resume, and parity digests
- [ ] T003 [P] Mark the authority boundary and record that phase 006 is non-authoritative, this phase gates readiness, and phase 011 owns cutover
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Freeze the mode-scoped rollback switch states, request fields, deny-by-default guards, epoch rules, and stale-writer rejection
- [ ] T005 Define the external authorization boundary and prohibit Deep Research from self-authorizing rollback, unquarantine, verifier replacement, or authority restoration
- [ ] T006 Define rollback triggers for parity, seal, certificate, replay, receipt, state, health, budget, resume, source-drift, duplicate-request, and split-brain failures
- [ ] T007 Define the non-destructive rollback runbook: freeze admission, fence the writer, classify in-flight work, reconcile safe effects, restore legacy at a new epoch, preserve evidence, and emit a certificate
- [ ] T008 Define the 14-calendar-day and five-successful-authoritative-execution window, extension conditions, successful-run semantics, retained assets, and closure evidence
- [ ] T009 Define the independent gate matrix for parity, sealed artifacts, certificates, receipts, replay, resume, lifecycle fixtures, failure dispositions, and rollback rehearsal
- [ ] T010 Define the exact-SHA-bound mode-migration certificate and phase-011 handoff fields, explicitly excluding authority-cutover claims
- [ ] T011 [P] Define blocked, not-ready, rollback-required, and ready result semantics for missing, stale, contradictory, malformed, or nondeterministic evidence
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify the switch denies unknown, stale, incomplete, and gateway-failed requests without authority change, projection change, or semantic append
- [ ] T013 Verify the gate cannot pass without phase-006 green shadow parity across lifecycle, failure, resume, synthesis, and memory-save fixtures
- [ ] T014 Verify all required Deep Research seals, certificates, receipts, fingerprints, and artifact references are present, current, and internally consistent
- [ ] T015 Verify deterministic replay, resume identity, source-refresh invalidation, evidence quarantine, contradiction, and incomplete-run behavior remain fail-closed
- [ ] T016 Verify rollback rehearsal freezes admission, fences stale writers, changes the epoch, preserves events and artifacts, restores legacy, and emits a rollback certificate
- [ ] T017 Verify the rollback window remains open until both 14 calendar days and five successful authoritative executions are satisfied and extends on low traffic or unresolved obligations
- [ ] T018 Verify fault fixtures for unknown effects, missing receipts, malformed seals, stale contracts, health alarms, budget exhaustion, duplicate requests, and split-brain attempts
- [ ] T019 Verify the migration certificate binds exact SHA, BASE, contract digests, versions, fixtures, stream/artifact digests, verifier identity, and dispositions
- [ ] T020 Verify phase 011 accepts readiness evidence without treating this mode certificate as an authority-cutover certificate
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Independent mode gate green and phase-011 handoff certificate emitted
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `../006-shadow-parity/spec.md`
- **Shared rollback policy**: See `../../../../../001-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- **Authority cutover consumer**: See the phase-011 staged state migration and authority cutover contract
<!-- /ANCHOR:cross-refs -->
