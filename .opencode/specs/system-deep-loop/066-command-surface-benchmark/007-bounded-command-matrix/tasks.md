---
title: "Tasks: bounded command matrix"
description: "Task breakdown for the bounded model matrix."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/007-bounded-command-matrix"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the matrix child measuring executor variance across scenarios"
    next_safe_action: "Build or verify alignment fan-out wiring before running matrix cells"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: bounded command matrix

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Build or verify the alignment fan-out wiring required for matrix cells. Evidence: fan-out runs an alignment cell or a verified wiring gap is recorded.
- [ ] T002 — Author the matrix manifest with required cells and predeclared skips. Evidence: manifest enumerates every driver and leaf cell.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Run the two GPT drivers across the scenario suite. Evidence: driver cells recorded with provenance.
- [ ] T004 — Run the leaf sentinels over the workflow scenarios. Evidence: leaf cells recorded with provenance.
- [ ] T005 — Rerun contested cells with the three-sample policy. Evidence: contested cells carry three samples.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Confirm every required cell is a result or a predeclared skip. Evidence: manifest reconciles with recorded results.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Fan-out wiring is built or verified, the manifest accounts for every cell, contested cells are resampled, and fixture hashes match before every cell.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 006-command-scenario-rollout. Successor: 008-scorecard-and-closeout.
<!-- /ANCHOR:cross-refs -->
