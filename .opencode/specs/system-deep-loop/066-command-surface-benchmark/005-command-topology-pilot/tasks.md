---
title: "Tasks: command topology pilot"
description: "Task breakdown for the four-topology pilot."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/005-command-topology-pilot"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the pilot child that calibrates the evaluator across topologies"
    next_safe_action: "Author one pilot scenario per topology and capture a Claude baseline"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command topology pilot

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Author the workflow-router and subaction-router pilot scenarios. Evidence: two scenarios on schema v2 with pinned markers.
- [ ] T002 — Author the direct-tool or plugin and monolithic pilot scenarios. Evidence: two scenarios on schema v2 with pinned markers.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Capture a pinned Claude baseline for each pilot scenario. Evidence: four baseline results with provenance.
- [ ] T004 — Capture one GPT driver run per pilot scenario. Evidence: four GPT driver results with provenance.
- [ ] T005 — Reconcile Claude and GPT evidence for calibration. Evidence: evidence sets agree on target and boundary classification.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Confirm no retryable environment failure remains unresolved. Evidence: all pilot cells produce quotable results.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Four pilot scenarios each produce complete evidence, a pinned Claude baseline and one GPT run per pilot are captured, and calibration reconciles cleanly.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 004-command-behavior-evaluator. Successor: 006-command-scenario-rollout.
<!-- /ANCHOR:cross-refs -->
