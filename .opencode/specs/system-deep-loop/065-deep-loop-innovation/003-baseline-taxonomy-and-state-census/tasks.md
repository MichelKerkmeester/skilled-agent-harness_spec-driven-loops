---
title: "Tasks: baseline, taxonomy, and state census"
description: "Tasks for phase 003 of the 006 recommendations-implementation program: immutable BASE, normalized taxonomy, runtime/state census, behavior baseline, replay fixtures, and rollback anchors."
trigger_phrases:
  - "baseline taxonomy and state census tasks"
  - "deep-loop recommendations phase 003 tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Authored the phase-003 task breakdown"
    next_safe_action: "Pin BASE before collecting census or benchmark evidence"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] T001 Confirm phase 003 has no predecessor, select a clean execution checkout, and resolve one full immutable BASE SHA
- [ ] T002 Record BASE ref provenance, repository status, tool versions, submodule state, and source-tree digests in the BASE manifest
- [ ] T003 Define schemas and packet-local locations for taxonomy, subsystem, event, state/backend, behavior, fixture, rollback, and handoff artifacts
- [ ] T004 Snapshot the live hub/mode declarations and current behavior-benchmark inventory at BASE, including all five package roots and 53 scenario IDs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Normalize the five workflow families and their owning packets/backends
- [ ] T006 Normalize the seven registered `workflowMode` keys directly from `mode-registry.json`
- [ ] T007 Normalize the eight research workstreams; encode `deep-improvement` as common parent of its three variants and exclude `ai-system-improvement`
- [ ] T008 [P] Census convergence and state-JSONL/checkpointing subsystems with owners, entry points, callers, state, tests, invariants, and defect candidates
- [ ] T009 [P] Census fan-out/fan-in and dedup/novelty subsystems with the same evidence fields
- [ ] T010 [P] Census gauges/observability and budget/cost subsystems with the same evidence fields
- [ ] T011 [P] Census locks/recovery and continuity/threading subsystems with the same evidence fields
- [ ] T012 Trace every JSONL event path and discriminator from writer through readers, reducers, validators, repair logic, and archival consumers
- [ ] T013 Trace every persisted JSON/JSONL/SQLite/lock/pause/directory/output state shape through literal and resolved backend paths
- [ ] T014 Link every event and state row to at least one executable test, benchmark scenario, replay fixture, or explicit evidence gap
- [ ] T015 Classify every observed behavior as `protected_contract` or `known_defect`; assign defects to later owning phases and eliminate unknown rows
- [ ] T016 Run and freeze the current behavior benchmark at BASE by stable scenario ID, semantic oracle, result, and evidence digest
- [ ] T017 Extend the benchmark mapping and scenarios until all eight workstreams have independent routing, halt/fail-fast, evidence, mutation, and terminal-semantic coverage
- [ ] T018 Capture sanitized happy-path, corrupt-tail, crash-boundary, and mixed-reader fixtures for every applicable event/state family
- [ ] T019 Record expected reducer, projection, graph, exit, and integrity results for each replay fixture
- [ ] T020 Define snapshot/restore, projection-rebuild, stale-lock recovery, and BASE-revert anchors for every mutable backend
- [ ] T021 Freeze artifact digests and produce the phase-004 handoff manifest with zero unresolved taxonomy, schema, state, behavior, or fixture rows
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T022 Verify: One immutable BASE is pinned — every artifact carries the same full SHA and reproduces its declared source digests
- [ ] T023 Verify: Taxonomy is normalized — counts are 5 families, 7 registered workflow modes, and 8 research workstreams with the improvement mapping explicit
- [ ] T024 Verify: Runtime subsystem census is closed — exactly eight complete subsystem rows exist with live path evidence
- [ ] T025 Verify: JSONL traceability is closed — automated discovery finds zero unmatched writers, readers, reducers, validators, or schema discriminators
- [ ] T026 Verify: Persisted-state census is closed — all backend paths have owners, lifecycle, authority, recovery, and archival-read status
- [ ] T027 Verify: Contract/defect split is complete — every behavior has one classification, evidence, and owner; no unknown row remains
- [ ] T028 Verify: Behavior baseline is stable — all 53 existing IDs remain semantically unchanged and all eight workstreams have independent BASE evidence
- [ ] T029 Verify: Replay is deterministic — every fixture produces identical normalized results across two clean temporary runs
- [ ] T030 Verify: Rollback is executable — each recipe restores or rebuilds a copied backend and leaves live tracked state unchanged
- [ ] T031 Verify: Phase-004 handoff is frozen — required artifacts are enumerated, hashed, BASE-keyed, and closure counters are zero
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (strict validation, census closure, semantic benchmark, replay, and rollback checks)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
