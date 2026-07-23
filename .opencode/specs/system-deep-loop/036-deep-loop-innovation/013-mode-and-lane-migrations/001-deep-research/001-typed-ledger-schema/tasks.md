---
title: "Tasks: Deep Research - Typed Ledger Schema"
description: "Tasks for the Deep Research typed event vocabulary and compatibility-hook plan over the shared deep-loop ledger."
trigger_phrases:
  - "deep research typed ledger schema tasks"
  - "deep-research event vocabulary tasks"
  - "deep research migration schema tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T17:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Research event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-012 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope field names and transition tokens does phase 012 freeze?"
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

- [x] T001 Confirm phase 006 transition authorization and phase 012 shared event contracts are frozen before naming mode fields [Evidence: `deep-research-ledger-schema.ts:39` reuses the shared envelope field inventory]
- [x] T002 Inventory current Deep Research JSONL records, iteration outputs, lifecycle modes, reducer-owned files, and memory-save handoff points [Evidence: `legacy-compatibility.ts:142` implements the closed legacy decision table]
- [x] T003 Build the event ownership matrix separating shared ledger events, Deep Research events, and the next sibling's reducer/projection outputs [Evidence: `deep-research-ledger-types.ts:427` specializes the envelope without reducer APIs]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define the `deep-research` envelope specialization, typed identifier aliases, scope object, inherited shared fields, and authorization/replay references [Evidence: `deep-research-ledger-types.ts:427` exports `DeepResearchEventEnvelope`]
- [x] T005 Define the discriminated event union for run lifecycle, question and branch planning, iteration, source/evidence admission, claim lineage, gaps/focus, convergence, synthesis, memory save, and completion [Evidence: `deep-research-ledger-types.ts:306` lists all 23 stems]
- [x] T006 Define field-level payload types, requiredness, digest rules, source selectors, independence groups, raw observation fields, and cross-event references [Evidence: `DATA_FIELD_RULES` assigns every field one semantic validator; the shared locator predicate rejects whitespace-only source and passage selectors]
- [x] T007 Define envelope and payload version boundaries plus pure compatibility and upcaster hooks for legacy Deep Research JSONL records [Evidence: `legacy-compatibility.ts:142` and `legacy-compatibility.ts:175`]
- [x] T008 Specify schema fixtures for normal runs, resume/restart, retries, source mutation, contradiction, quarantine, blocked/incomplete convergence, contested synthesis, and memory-save failure [Evidence: `deep-research-ledger-schema.vitest.ts:166` supplies the complete event fixture map]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify every event payload conforms to the phase-012 envelope and every append request carries phase-006 authorization metadata [Evidence: targeted Vitest 16/16 passed; authorized-ledger substrate Vitest 20/20 passed]
- [x] T010 Verify the event union covers `init -> iterate: gather/analyze -> convergence -> synthesize -> memory-save` without assigning reducer ownership [Evidence: `deep-research-ledger-types.ts:306` and tsc exit 0]
- [x] T011 Verify deterministic IDs, causal links, previous-tail hashes, payload digests, immutable evidence references, semantic field-kind completeness, and supersession-only revisions [Evidence: targeted Vitest 16/16 passed, including whitespace-only locator, quoted-passage, policy-version, cross-kind, and full-pipeline positive-control tests]
- [x] T012 Verify raw observations remain separate from trusted or derived decisions, including `newInfoRatio`, evidence yield, admission, claim status, and convergence outcome [Evidence: fixture contracts at `deep-research-ledger-schema.vitest.ts:229`]
- [x] T013 Verify exact, compatible, migrate, pin-old-runtime, and blocked compatibility outcomes; unknown event types and versions fail closed [Evidence: `deep-research-ledger-schema.vitest.ts:607`]
- [x] T014 Verify the phase scope excludes reducers, projections, gauges, sealed artifacts, certificates, rollback switches, authority cutover, and mode-gate implementation [Evidence: exported boundary at `deep-research-ledger-types.ts:435` contains no reducer or projection API]
- [x] T015 Verify the handoff matrix gives `002-reducers-and-projections` stable event names and entity references without prescribing its fold algorithm [Evidence: `deep-research-ledger-types.ts:306` and `deep-research-ledger-types.ts:435`]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T015 checked above]
- [x] All requirements in spec.md met with evidence [Evidence: targeted Vitest 16/16 passed and tsc exit 0]
- [x] Phase gate green (validate/build/test as applicable) [Evidence: targeted Vitest 16/16 passed; authorized-ledger Vitest 20/20 passed; tsc exit 0; strict validation recorded in `implementation-summary.md`]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Successor**: See `002-reducers-and-projections/`
<!-- /ANCHOR:cross-refs -->
