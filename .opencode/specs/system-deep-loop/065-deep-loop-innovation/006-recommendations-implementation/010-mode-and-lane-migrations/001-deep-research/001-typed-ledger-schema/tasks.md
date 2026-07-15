---
title: "Tasks: Deep Research - Typed Ledger Schema"
description: "Tasks for the Deep Research typed event vocabulary and compatibility-hook plan over the shared deep-loop ledger."
trigger_phrases:
  - "deep research typed ledger schema tasks"
  - "deep-research event vocabulary tasks"
  - "deep research migration schema tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T17:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Research event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-009 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope field names and transition tokens does phase 009 freeze?"
    answered_questions:
      - "Reducers and projections are owned by the next sibling"
---
# Tasks: Deep Research - Typed Ledger Schema

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

- [ ] T001 Confirm phase 003 transition authorization and phase 009 shared event contracts are frozen before naming mode fields
- [ ] T002 Inventory current Deep Research JSONL records, iteration outputs, lifecycle modes, reducer-owned files, and memory-save handoff points
- [ ] T003 Build the event ownership matrix separating shared ledger events, Deep Research events, and the next sibling's reducer/projection outputs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define the `deep-research` envelope specialization, typed identifier aliases, scope object, inherited shared fields, and authorization/replay references
- [ ] T005 Define the discriminated event union for run lifecycle, question and branch planning, iteration, source/evidence admission, claim lineage, gaps/focus, convergence, synthesis, memory save, and completion
- [ ] T006 Define field-level payload types, requiredness, digest rules, source selectors, independence groups, raw observation fields, and cross-event references
- [ ] T007 Define envelope and payload version boundaries plus pure compatibility and upcaster hooks for legacy Deep Research JSONL records
- [ ] T008 Specify schema fixtures for normal runs, resume/restart, retries, source mutation, contradiction, quarantine, blocked/incomplete convergence, contested synthesis, and memory-save failure
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify every event payload conforms to the phase-009 envelope and every append request carries phase-003 authorization metadata
- [ ] T010 Verify the event union covers `init -> iterate: gather/analyze -> convergence -> synthesize -> memory-save` without assigning reducer ownership
- [ ] T011 Verify deterministic IDs, causal links, previous-tail hashes, payload digests, immutable evidence references, and supersession-only revisions
- [ ] T012 Verify raw observations remain separate from trusted or derived decisions, including `newInfoRatio`, evidence yield, admission, claim status, and convergence outcome
- [ ] T013 Verify exact, compatible, migrate, pin-old-runtime, and blocked compatibility outcomes; unknown event types and versions fail closed
- [ ] T014 Verify the phase scope excludes reducers, projections, gauges, sealed artifacts, certificates, rollback switches, authority cutover, and mode-gate implementation
- [ ] T015 Verify the handoff matrix gives `002-reducers-and-projections` stable event names and entity references without prescribing its fold algorithm
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
