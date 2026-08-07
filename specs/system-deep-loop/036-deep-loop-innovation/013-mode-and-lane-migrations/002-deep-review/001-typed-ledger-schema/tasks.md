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
    last_updated_at: "2026-07-23T10:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed schema implementation and verification"
    next_safe_action: "Fold the exported union in 002-reducers-and-projections"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Reducers and projections are owned by the next sibling"
      - "The real gateway and ledger own authorization proof persistence"
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

- [x] T001 Confirm phase 006 transition authorization and phase 012 shared review-loop/event contracts are frozen before naming mode fields [Evidence: shared envelope specialization and registry preparation at `deep-review-ledger-schema.ts:913`; real gateway append test at `deep-review-ledger-schema.vitest.ts:582`]
- [x] T002 Inventory current Deep Review config, JSONL, iteration, finding, graph, convergence, adjudication, synthesis, resume, and continuity records [Evidence: 26-stem map at `deep-review-ledger-types.ts:449` and closed legacy decision table at `legacy-compatibility.ts:150`]
- [x] T003 Build the event ownership matrix separating shared review-loop events, Deep Review events, and the next sibling's reducer/projection outputs [Evidence: `implementation-summary.md` records shared frame ownership, mode payload ownership, and next-sibling reducer ownership]
- [x] T004 [P] Record the deep-alignment shared-backbone boundary and reject a mode-local fork of shared review-loop events [Evidence: `DeepReviewEventEnvelope` specializes the real shared envelope at `deep-review-ledger-types.ts:582`; no shared substrate file changed]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the `deep-review` envelope specialization, typed identifiers, scope object, inherited shared fields, lineage, and authorization/replay references [Evidence: typed scopes and envelope at `deep-review-ledger-types.ts:541`; shared field inventory at `deep-review-ledger-schema.ts:50`]
- [x] T006 Define the discriminated event union for run lifecycle, scope, dimension passes, candidate/evidence, adjudication, lineage, depth search, convergence, recovery, synthesis, report, continuity save, and completion [Evidence: all 26 stems and wire mappings at `deep-review-ledger-types.ts:449`]
- [x] T007 Define field-level payload types, requiredness, digest rules, file-and-line selectors, evidence classes, semantic fingerprints, gate results, and cross-event references [Evidence: `DATA_FIELD_RULES` at `deep-review-ledger-schema.ts:122` and exact scope table at `deep-review-ledger-schema.ts:410`]
- [x] T008 Define version boundaries and pure compatibility/upcaster hooks for legacy Deep Review JSONL records [Evidence: `decideDeepReviewCompatibility` and `upcastLegacyDeepReviewRecord` at `legacy-compatibility.ts:150` and `legacy-compatibility.ts:184`]
- [x] T009 Specify schema fixtures for normal passes, resume/restart, candidate promotion, finding movement, blocked stop, pause/recovery, graph convergence, incomplete termination, contested report, and continuity-save failure [Evidence: complete fixture map and 14-test suite in `deep-review-ledger-schema.vitest.ts`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify every event payload conforms to the phase-012 envelope and every append request carries phase-006 authorization metadata [Evidence: 26/26 authorized append/readback matrix at `deep-review-ledger-schema.vitest.ts:582`; denied request commits zero events at line 749]
- [x] T011 Verify the event union covers `scope -> per-dimension passes -> convergence -> synthesis -> review-report` without assigning reducer ownership [Evidence: 26-stem union at `deep-review-ledger-types.ts:449`; scope audit in `implementation-summary.md`]
- [x] T012 Verify deterministic IDs, causal links, previous-tail hashes, payload digests, immutable evidence references, semantic fingerprints, and supersession-only revisions [Evidence: determinism, missing-hash, smuggling, and in-place revision tests at `deep-review-ledger-schema.vitest.ts:610-713`]
- [x] T013 Verify raw observations remain separate from candidate confidence, impact, P0/P1/P2 severity, adjudication, convergence, and verdict outcomes [Evidence: raw-versus-derived test at `deep-review-ledger-schema.vitest.ts:826`]
- [x] T014 Verify exact, compatible, migrate, pin-old-runtime, and blocked compatibility outcomes; unknown event types and versions fail closed [Evidence: compatibility and version tests at `deep-review-ledger-schema.vitest.ts:916` and `deep-review-ledger-schema.vitest.ts:1015`]
- [x] T015 Verify candidate findings require typed evidence and claim adjudication before P0/P1/P2 activation, with impact and confidence remaining orthogonal [Evidence: adjudication boundary test at `deep-review-ledger-schema.vitest.ts:771`; deliberate guard removal produced the expected red assertion]
- [x] T016 Verify the phase scope excludes reducers, findings projections, dashboards, strategy updates, report generation, sealed artifacts, certificates, rollback switches, authority cutover, and mode-gate implementation [Evidence: scoped status audit and module export surface recorded in `implementation-summary.md`]
- [x] T017 Verify the handoff matrix gives `002-reducers-and-projections` stable event names, entity references, and raw-versus-derived boundaries without prescribing its fold algorithm [Evidence: exported maps and union at `deep-review-ledger-types.ts:512-592`; sibling contract summary in `implementation-summary.md`]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T017 checked above]
- [x] All requirements in spec.md met with evidence [Evidence: targeted Vitest 14/14 and runtime TypeScript exit 0]
- [x] Phase gate green (validate/build/test as applicable) [Evidence: targeted Vitest 14/14, runtime TypeScript exit 0, and strict validation exit 0 recorded in `implementation-summary.md`]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Successor**: See `002-reducers-and-projections/`
<!-- /ANCHOR:cross-refs -->
