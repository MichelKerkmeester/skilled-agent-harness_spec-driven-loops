---
title: "Tasks: baseline, taxonomy, and state census"
description: "Tasks for phase 003 of the 006 recommendations-implementation program: immutable BASE, normalized taxonomy, runtime/state census, behavior baseline, replay fixtures, and rollback anchors."
trigger_phrases:
  - "baseline taxonomy and state census tasks"
  - "deep-loop recommendations phase 003 tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
    last_updated_at: "2026-07-20T20:33:41Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed all census and recovery tasks"
    next_safe_action: "Consume the hashed architecture handoff"
    blockers: []
    key_files:
      - "base-manifest.json"
      - "behavior-baseline.json"
      - "phase-004-handoff-manifest.json"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Baseline, taxonomy, and state census

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

- [x] T001 Confirm phase 003 has no predecessor, select a clean execution checkout, and resolve one full immutable BASE SHA — Evidence: `base-manifest.json`
- [x] T002 Record BASE ref provenance, repository status, tool versions, submodule state, and source-tree digests in the BASE manifest — Evidence: `base-manifest.json`
- [x] T003 Define schemas and packet-local locations for taxonomy, subsystem, event, state/backend, behavior, fixture, rollback, and handoff artifacts — Evidence: `base-manifest.json`
- [x] T004 Snapshot the live hub/mode declarations and current behavior-benchmark inventory at BASE, including all five package roots and 53 scenario IDs — Evidence: `behavior-baseline.json` and `base-manifest.json`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Normalize the five workflow families and their owning packets/backends — Evidence: `taxonomy-census.json`
- [x] T006 Normalize the seven registered `workflowMode` keys directly from `mode-registry.json` — Evidence: `taxonomy-census.json`
- [x] T007 Normalize the eight research workstreams; encode `deep-improvement` as common parent of its three variants and exclude `ai-system-improvement` — Evidence: `taxonomy-census.json`
- [x] T008 [P] Census convergence and state-JSONL/checkpointing subsystems with owners, entry points, callers, state, tests, invariants, and defect candidates — Evidence: `subsystem-census.json`
- [x] T009 [P] Census fan-out/fan-in and dedup/novelty subsystems with the same evidence fields — Evidence: `subsystem-census.json`
- [x] T010 [P] Census gauges/observability and budget/cost subsystems with the same evidence fields — Evidence: `subsystem-census.json`
- [x] T011 [P] Census locks/recovery and continuity/threading subsystems with the same evidence fields — Evidence: `subsystem-census.json`
- [x] T012 Trace every JSONL event path and discriminator from writer through readers, reducers, validators, repair logic, and archival consumers — Evidence: `event-schema-census.json`
- [x] T013 Trace every persisted JSON/JSONL/SQLite/lock/pause/directory/output state shape through literal and resolved backend paths — Evidence: `state-backend-census.json`
- [x] T014 Link every event and state row to at least one executable test, benchmark scenario, replay fixture, or explicit evidence gap — Evidence: `event-schema-census.json` and `state-backend-census.json`
- [x] T015 Classify every observed behavior as `protected_contract` or `known_defect`; assign defects to later owning phases and eliminate unknown rows — Evidence: `contract-defect-ledger.json`
- [x] T016 Bind all 53 current scenarios to stable IDs, semantic oracles, and real BASE result references; execute and capture the 3 additive scenarios — Evidence: `behavior-baseline.json` and `fixtures/behavior-results/`
- [x] T017 Extend the benchmark mapping and scenarios until all eight workstreams have independent routing, halt/fail-fast, evidence, mutation, and terminal-semantic coverage — Evidence: `behavior-baseline.json`
- [x] T018 Capture sanitized happy-path, corrupt-tail, crash-boundary, and mixed-reader fixtures for every applicable event/state family — Evidence: `replay-rollback-manifest.json` and `fixtures/`
- [x] T019 Record expected reducer, projection, graph, exit, and integrity results for each replay fixture — Evidence: `replay-rollback-manifest.json` and `fixtures/`
- [x] T020 Define snapshot/restore, projection-rebuild, stale-lock recovery, and BASE-revert anchors for every mutable backend — Evidence: `replay-rollback-manifest.json` and `fixtures/`
- [x] T021 Freeze artifact digests and produce the phase-004 handoff manifest with zero unresolved taxonomy, schema, state, behavior, or fixture rows — Evidence: `phase-004-handoff-manifest.json`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Verify: One immutable BASE is pinned — every artifact carries the same full SHA and reproduces its declared source digests — Evidence: `base-manifest.json` and `validate-evidence.cjs`
- [x] T023 Verify: Taxonomy is normalized — counts are 5 families, 7 registered workflow modes, and 8 research workstreams with the improvement mapping explicit — Evidence: `taxonomy-census.json`
- [x] T024 Verify: Runtime subsystem census is closed — exactly eight complete subsystem rows exist with live path evidence — Evidence: `subsystem-census.json`
- [x] T025 Verify: JSONL traceability is closed — BASE source discovery found 25 producer and 27 consumer files with zero source-discovery differences; the one actual producer-only surface has an explicit BASE justification, so unjustified producer-only rows are zero — Evidence: `validate-evidence.cjs --static` and `event-schema-census.json`
- [x] T026 Verify: Persisted-state census is closed — 54 discovered persistence source files map to 46 owned backends with zero source-discovery differences, including four loop-guard rows, divergent pivots, and compiled contracts; all 46 rows have valid mutability — Evidence: `validate-evidence.cjs --static` and `state-backend-census.json`
- [x] T027 Verify: Contract/defect split is complete — recomputed row counts are 9 protected contracts and 9 known defects; no unknown row remains — Evidence: `contract-defect-ledger.json` and `validate-evidence.cjs --static`
- [x] T028 Verify: Behavior baseline is stable — all 53 existing IDs remain semantically unchanged and all eight workstreams have independent BASE evidence — Evidence: `behavior-baseline.json`
- [x] T029 Verify: Replay is deterministic — 22 real-shape fixtures produce the declared shipped/source-backed projections, and two explicit temp-backed executions agree — Evidence: `validate-evidence.cjs` and `replay-rollback-manifest.json`
- [x] T030 Verify: Rollback is executable — each recipe restores or rebuilds a copied backend and leaves live tracked state unchanged — Evidence: `validate-evidence.cjs` and `replay-rollback-manifest.json`
- [x] T031 Verify: Phase-004 handoff is frozen — required artifacts are enumerated, hashed, and BASE-keyed; unresolved and unjustified closure counters are zero while the one justified producer-only surface remains recorded — Evidence: `phase-004-handoff-manifest.json`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete — Evidence: `tasks.md` contains no unchecked task rows
- [x] All requirements in spec.md met with evidence — Evidence: `implementation-summary.md` verification table
- [x] Phase gate green (strict validation, census closure, semantic benchmark, replay, and rollback checks) — Evidence: `validate-evidence.cjs` exit 0 and strict `validate.sh` exit 0
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
