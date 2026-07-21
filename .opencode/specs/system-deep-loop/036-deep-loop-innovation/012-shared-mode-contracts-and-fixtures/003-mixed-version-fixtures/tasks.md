---
title: "Tasks: Mixed-Version Fixtures"
description: "Tasks for the sealed old/new event and state fixture corpus, scenario matrix, deterministic replay checks, and shadow-parity handoff."
trigger_phrases:
  - "mixed-version fixtures tasks"
  - "deep-loop version drift fixture tasks"
  - "interrupted migration fixture tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
    last_updated_at: "2026-07-21T15:50:00Z"
    last_updated_by: "codex"
    recent_action: "Closed the fixture implementation and verification task set"
    next_safe_action: "Consume the sealed corpus in phase-013 mode migrations"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Mixed-Version Fixtures

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

- [x] T001 Read the parent spec, `manifest/phase-tree.json`, phase-007 sealed-reference-artifact spec, phase-008 upcaster spec, and phase-008 shadow-parity spec; record fixture obligations and authority constraints Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T002 [P] Derive the eight phase-013 workstream rows and deep-improvement-common ordering directly from `mode_workstreams_phase_013` Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T003 [P] Inventory supported event and state versions, adjacent upcaster edges, causal-boundary fields, and comparable event/state pairs from the phase-008 contracts Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T004 Define `MixedVersionCase`, record envelopes, sealed case capsules, expected outcome records, failure classes, and the stable fixture namespace Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T005 Define the boundary with `002-cross-mode-closures` and `004-write-set-conflict-graph`; this phase supplies cases and evidence inputs without hoisting shared implementations Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Define pure-old control fixtures with old event/state records, legacy expectations, source identities, and sealed replay inputs Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T007 Define pure-new control fixtures with current event/state records, zero-unnecessary-hop expectations, and current replay inputs Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T008 Define mid-upgrade fixtures with old records before a current-version boundary write, new records after the boundary, and independent event/state version declarations Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T009 Define interrupted-migration fixtures with a sealed stop point, pending effects, receipt set, lease/fencing state, continuity identity, and declared resume classification Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T010 [P] Define supported old-event/new-state and new-event/old-state combinations plus typed rejection cases for unsupported pairs Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T011 Implement phase-007 sealing and verified-read setup for prompts, state, events, configuration, evaluator material, prior outputs, version policy, and restart metadata Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T012 Implement phase-008 upcaster and dual-read invocation with stored/effective versions, adjacent hop traces, immutable source references, and typed fail-closed results Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T013 Implement authored reducer and resume outcome assertions for accepted events, state transitions, terminal outcomes, pending effects, receipts, and artifacts Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T014 Implement phase-008 shadow-parity handoff from one verified capsule to isolated legacy and dark roots without authority mutation Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T015 [P] Add negative fixtures for future versions, missing edges, lossy transforms, malformed state, seal mismatch, causal mismatch, missing observations, duplicate effects, and nondeterministic reruns Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T016 Publish the manifest-derived fixture matrix and handoff identities for phase 013 and the phase-008 parity certificate precondition Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Verify: The fixture envelope is stable and every required workstream/scenario row has one case identity and one expected outcome Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T018 Verify: Pure-old controls preserve old source evidence, apply only registered compatibility behavior, and match their pinned expectations Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T019 Verify: Pure-new controls validate current records without unnecessary upcasts and reproduce current replay outputs Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T020 Verify: Mid-upgrade cases preserve the causal boundary, apply exact adjacent hops, reduce mixed state deterministically, and compare parity components Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T021 Verify: Interrupted-migration cases restore or classify from sealed stop inputs without duplicating pending effects or discarding receipts Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T022 Verify: Independent event/state version pairs accept only contract-declared combinations and fail closed for unsupported pairs Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T023 Verify: Every replay-affecting input is verified by phase 007 and seal mutation, alias use, missing bytes, or wrong order blocks execution Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T024 Verify: Legacy and dark runs consume one capsule, remain isolated, preserve legacy authority, and emit no live external effect Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T025 Verify: Replay, reducer, projection, parity, classification, and evidence outputs are stable across deterministic reruns Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T026 Verify: Each negative fixture blocks trusted parity and certificate evidence with bounded immutable diagnostics Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] T027 Run strict spec validation and the phase gate; record commands, exit codes, manifest row counts, seal identity, and candidate identity Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] All requirements in spec.md met with evidence Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] Four scenario families and all required workstream rows are sealed and reproducible Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] Shadow-parity handoff is complete without authority or live-state mutation Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
- [x] Phase gate green without rebaselining or mutation of prior fixture evidence Evidence: mixed-version-fixtures.vitest.ts, the scoped runtime API, and implementation-summary.md.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent outcome**: See `../spec.md` and `../../manifest/phase-tree.json`
- **Shared mode interface**: See `../001-shared-mode-interfaces/spec.md`
- **Sealed artifacts**: See `../../007-shared-evidence-and-control-services/002-sealed-reference-artifacts/spec.md`
- **Upcasters and dual-read adapters**: See `../../008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters/spec.md`
- **Shadow-parity harness**: See `../../008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md`
<!-- /ANCHOR:cross-refs -->
