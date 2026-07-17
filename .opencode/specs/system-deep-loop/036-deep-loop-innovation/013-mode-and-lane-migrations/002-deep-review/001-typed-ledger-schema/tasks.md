---
title: "Tasks: Deep Review - Typed Ledger Schema"
description: "Tasks for the Deep Review typed event vocabulary and compatibility-hook plan over the shared deep-loop ledger."
trigger_phrases:
  - "deep review typed ledger schema tasks"
  - "deep-review event vocabulary tasks"
  - "deep review migration schema tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T19:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Review event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-012 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope fields and transition tokens does phase 012 freeze?"
    answered_questions:
      - "Reducers and projections are owned by the next sibling"
---
# Tasks: Deep Review - Typed Ledger Schema

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

- [ ] T001 Confirm phase 006 transition authorization and phase 012 shared review-loop/event contracts are frozen before naming mode fields
- [ ] T002 Inventory current Deep Review config, JSONL, iteration, finding, graph, convergence, adjudication, synthesis, resume, and continuity records
- [ ] T003 Build the event ownership matrix separating shared review-loop events, Deep Review events, and the next sibling's reducer/projection outputs
- [ ] T004 [P] Record the deep-alignment shared-backbone boundary and reject a mode-local fork of shared review-loop events
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the `deep-review` envelope specialization, typed identifiers, scope object, inherited shared fields, lineage, and authorization/replay references
- [ ] T006 Define the discriminated event union for run lifecycle, scope, dimension passes, candidate/evidence, adjudication, lineage, depth search, convergence, recovery, synthesis, report, continuity save, and completion
- [ ] T007 Define field-level payload types, requiredness, digest rules, file-and-line selectors, evidence classes, semantic fingerprints, gate results, and cross-event references
- [ ] T008 Define version boundaries and pure compatibility/upcaster hooks for legacy Deep Review JSONL records
- [ ] T009 Specify schema fixtures for normal passes, resume/restart, candidate promotion, finding movement, blocked stop, pause/recovery, graph convergence, incomplete termination, contested report, and continuity-save failure
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify every event payload conforms to the phase-012 envelope and every append request carries phase-006 authorization metadata
- [ ] T011 Verify the event union covers `scope -> per-dimension passes -> convergence -> synthesis -> review-report` without assigning reducer ownership
- [ ] T012 Verify deterministic IDs, causal links, previous-tail hashes, payload digests, immutable evidence references, semantic fingerprints, and supersession-only revisions
- [ ] T013 Verify raw observations remain separate from candidate confidence, impact, P0/P1/P2 severity, adjudication, convergence, and verdict outcomes
- [ ] T014 Verify exact, compatible, migrate, pin-old-runtime, and blocked compatibility outcomes; unknown event types and versions fail closed
- [ ] T015 Verify candidate findings require typed evidence and claim adjudication before P0/P1/P2 activation, with impact and confidence remaining orthogonal
- [ ] T016 Verify the phase scope excludes reducers, findings projections, dashboards, strategy updates, report generation, sealed artifacts, certificates, rollback switches, authority cutover, and mode-gate implementation
- [ ] T017 Verify the handoff matrix gives `002-reducers-and-projections` stable event names, entity references, and raw-versus-derived boundaries without prescribing its fold algorithm
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
