---
title: "Tasks: command behavior evaluator"
description: "Task breakdown for the behavior evaluator schema v2 upgrade."
status: planned
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

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Add the direct-dispatch evidence kind with expected and forbidden targets. Evidence: evidence kind parses and asserts target-event counts.
- [ ] T002 — Add allowlisted postcondition probes and setup-misbind evidence. Evidence: probes evaluate against fixture post-state.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Add structured fixture-boundary evidence and the boundary-violation bucket. Evidence: boundary fixture classifies as boundary violation.
- [ ] T004 — Publish schema v2 with backward-compatible v1 parsing. Evidence: v1 scenarios parse unchanged under v2.
- [ ] T005 — Prove DAB-001 to 011 scores are unchanged. Evidence: regression fixtures reproduce prior scores.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Run the framework test suite and produce one hermetic v2 scored result. Evidence: framework test suite exit 0 with a v2 scored result.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The framework test suite passes, new evidence and boundary handling work, v1 parsing preserves DAB scores, and one hermetic v2 result is produced.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 004-command-lane-integration. Successor: 006-command-topology-pilot.
<!-- /ANCHOR:cross-refs -->
