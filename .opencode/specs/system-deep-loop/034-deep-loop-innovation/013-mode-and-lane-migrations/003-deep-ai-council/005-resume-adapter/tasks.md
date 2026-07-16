---
title: "Tasks: Deep AI Council resume adapter"
description: "Tasks for the Deep AI Council resume adapter: sealed-ledger reduction, continuity-ladder projection, crash recovery, and idempotent re-entry."
trigger_phrases:
  - "Deep AI Council resume adapter tasks"
  - "council reducer replay tasks"
  - "idempotent council recovery tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Outlined council replay, recovery, and continuity projection tasks"
    next_safe_action: "Turn crash boundaries into deterministic resume fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep AI Council Resume Adapter

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

- [ ] T001 Confirm the shared ledger, seal, replay-compatibility, effect-recovery, and certificate contracts are frozen for this mode adapter.
- [ ] T002 Record the Deep AI Council event inventory and map deliberation, critique, convergence, artifact, and gate events to reducer ownership.
- [ ] T003 Define stable identity fields for run, logical branch, attempt, claim, message, effect, artifact, gate decision, and resume request.
- [ ] T004 Define the stage transition and recovery-disposition table, including `REUSE`, `CONTINUE`, `RECONCILE`, `WAIT`, `MIGRATE`, `PIN_OLD_RUNTIME`, and `BLOCK`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement the sealed-frontier verification contract and fail closed on an unsealed, truncated, tampered, or incompatible ledger.
- [ ] T006 Implement the run-control and logical-seat reducers; preserve completed branch results and identify only missing logical work after interruption.
- [ ] T007 Implement claim, message, dissent, critique-round, and private-estimate reducers with stable IDs and preserved information boundaries.
- [ ] T008 Implement blinded judge-observation and convergence reducers with frozen judge/configuration fingerprints and explicit unresolved minority state.
- [ ] T009 Implement artifact-seal and council-test-gate reducers from immutable artifacts, certificates, and receipts without creating new live evidence.
- [ ] T010 Implement effect-aware recovery planning for verified reuse, receipt lookup, compensation, unknown outcomes, and unsupported provider capabilities.
- [ ] T011 Implement the idempotent resume-request contract keyed by run lineage, sealed frontier, adapter fingerprint, and requested boundary.
- [ ] T012 Implement the continuity-ladder projection with reducer-derived packet pointer, recent action, next safe action, blockers, progress, open questions, and answered questions.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify: Resume truth comes only from a sealed ledger frontier — valid histories replay to a state fingerprint, while an unsealed or tampered tail blocks.
- [ ] T014 Verify: The mode reducer reconstructs every council stage — partial seats, critique rounds, convergence, artifacts, and gate state produce the correct pending work.
- [ ] T015 Verify: Logical identity survives attempts and process restarts — duplicate delivery and retry fixtures preserve branch, claim, message, and effect identity.
- [ ] T016 Verify: Re-entry is idempotent — repeated matching resume requests return one decision and produce no duplicate semantic ledger event or side effect.
- [ ] T017 Verify: Recovery distinguishes safe reuse from unsafe repetition — completed receipts reuse, unknown irreversible effects reconcile or block, and no blind retry occurs.
- [ ] T018 Verify: Continuity-ladder fields are derived projections — every field points to reducer state and cannot override the sealed ledger.
- [ ] T019 Verify: Replay compatibility is explicit and version-bound — exact, compatible, migrate, pin-old-runtime, and blocked outcomes are deterministic.
- [ ] T020 Verify: Resume preserves council information boundaries — blinding, dissent, minority claims, private estimates, and order-swapped observations survive reduction.
- [ ] T021 Verify: The council gate is deterministic after interruption — immutable inputs produce the same gate decision and missing receipts produce typed non-success states.
- [ ] T022 Verify: The adapter remains non-authoritative — shadow-parity integration can consume its output without an authority cutover or legacy-writer retirement.
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
<!-- /ANCHOR:cross-refs -->
