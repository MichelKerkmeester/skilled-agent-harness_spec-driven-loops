---
title: "Tasks: command behavior evaluator"
description: "Task breakdown for the behavior evaluator schema v2 upgrade."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/005-command-behavior-evaluator"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the evaluator child that upgrades the shared framework to schema v2"
    next_safe_action: "Add direct-dispatch and outcome-probe evidence kinds with v1 compatibility"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command behavior evaluator

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Complete; all tasks are verified.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Add the direct-dispatch evidence kind with expected and forbidden targets. Evidence: `behavior-bench-run.cjs:377` counts target events and `scoreDirectDispatch` enforces expected/forbidden hits.
- [x] T002 — Add allowlisted postcondition probes and setup-misbind evidence. Evidence: `behavior-bench-run.cjs:197` evaluates all 4/4 probe kinds and failing `binds_setup` coverage passes.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Add structured fixture-boundary evidence and the boundary-violation bucket. Evidence: `behavior-bench-run.cjs:620` emits `boundary_violation` and inside/outside boundary tests pass.
- [x] T004 — Publish schema v2 with backward-compatible v1 parsing. Evidence: `framework.md:53` publishes versioning and v1 smoke output keeps `schemaVersion: 1` with 0/3 v2 keys.
- [x] T005 — Prove DAB-001 to 011 scores are unchanged. Evidence: `dab-v1-golden.json` reproduces 11/11 entries with SHA-256 `3f75a0fd864cf9d97b102ba6f2183dbd1dbce6b941f86f414528f8e6688370cf`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Run the framework test suite and produce one hermetic v2 scored result. Evidence: test suite exit 0 with `SMOKE-V2` and `SMOKE-SAMPLES-V2` scored at `schemaVersion: 2`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The framework test suite passes, new evidence and boundary handling work, v1 parsing preserves DAB scores, and one hermetic v2 result is produced.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 004-command-lane-integration. Successor: 006-command-topology-pilot.
<!-- /ANCHOR:cross-refs -->
