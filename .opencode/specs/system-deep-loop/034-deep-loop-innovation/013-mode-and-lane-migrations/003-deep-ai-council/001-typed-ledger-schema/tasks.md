---
title: "Tasks: Deep AI Council - Typed Ledger Schema"
description: "Tasks for the Deep AI Council typed event vocabulary and compatibility-hook plan over the shared deep-loop ledger."
trigger_phrases:
  - "deep ai council typed ledger schema tasks"
  - "deep-ai-council event vocabulary tasks"
  - "deep ai council migration schema tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Deep AI Council event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-012 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope fields and transition tokens does phase-012 freeze?"
    answered_questions:
      - "Reducers and projections are owned by the next sibling"
---
# Tasks: Deep AI Council - Typed Ledger Schema

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

- [ ] T001 Confirm phase 006 transition authorization and phase 012 shared event contracts are frozen before naming council fields
- [ ] T002 Inventory current Deep AI Council JSONL rows, optional metadata, artifact audit rows, report-required sections, seat rules, convergence signals, rollback records, resume paths, and council test-gate inputs
- [ ] T003 Build the event ownership matrix separating shared ledger events, Deep AI Council events, packet-local artifact references, and the next sibling's reducer/projection outputs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define the `deep-ai-council` envelope specialization, typed identifiers, scope object, inherited shared fields, authorization references, replay references, and one-CLI-per-round boundary
- [ ] T005 Define the discriminated event union for run lifecycle, rounds, seat selection/dispatch/return, proposals, critique, candidate blinding, pairwise judging, bias audits, adjudication, stance changes, convergence, artifacts, test gate, rollback, and completion
- [ ] T006 Define field-level payload types, requiredness, digest rules, information-surface rules, usage/cost receipts, calibration references, independence evidence, minority/contradiction references, and cross-event links
- [ ] T007 Define envelope and payload version boundaries plus pure compatibility and upcaster hooks for legacy `ai-council-state.jsonl` and artifact-audit rows
- [ ] T008 Specify schema fixtures for normal multi-seat deliberation, two-seat runs, resume/restart, timeout, cross-critique, order-swapped judgment, bias flag, low independence, debate escalation, blocked convergence, artifact rollback, and test-gate failure
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify every event payload conforms to the phase-012 envelope and every append request carries phase-006 authorization metadata
- [ ] T010 Verify the event union covers `run setup -> independent seats -> critique rounds -> blinded adjudication -> convergence -> ai-council artifacts -> council test gate -> completion` without assigning reducer ownership
- [ ] T011 Verify deterministic IDs, causal links, previous-tail hashes, payload digests, visible-information declarations, artifact references, and supersession-only revisions
- [ ] T012 Verify raw seat returns, proposal scores, critique findings, pairwise outcomes, bias flags, independence inputs, stance changes, convergence signals, and gate results remain separate from selected plans or terminal outcomes
- [ ] T013 Verify candidate blinding, deterministic shuffle, order-swapped judging, abstention, inconsistency, role separation, one-CLI-per-round, and effective-independence references are represented without a reducer
- [ ] T014 Verify exact, compatible, migrate, pin-old-runtime, and blocked compatibility outcomes; unknown event types and versions fail closed
- [ ] T015 Verify high nominal agreement cannot hide low effective independence, critical dissent, missing witnesses, minority loss, or test-gate failure in convergence evidence
- [ ] T016 Verify the phase scope excludes reducers, projections, dashboards, graph rebuilds, artifact generation, certificates, rollback switches, authority cutover, and mode-gate implementation
- [ ] T017 Verify the handoff matrix gives `002-reducers-and-projections` stable event names and entity references without prescribing its fold algorithm
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
- **Successor**: See `002-reducers-and-projections/`
<!-- /ANCHOR:cross-refs -->
