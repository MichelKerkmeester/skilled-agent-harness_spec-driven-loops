---
title: "Tasks: command scenario rollout"
description: "Task breakdown for the full behavioral scenario suite."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the rollout child for the full command behavioral suite"
    next_safe_action: "Author DAB-012 through DAB-027 extending the existing package"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command scenario rollout

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Author DAB-012 to 017 covering create, design, speckit, and a deep command. Evidence: six scenarios on schema v2 with pinned contracts.
- [ ] T002 — Author DAB-018 to 020 covering the doctor subaction router. Evidence: three scenarios including a fail-closed conflicting subaction.
- [ ] T003 — Author DAB-021 to 027 covering memory, goal, prompt-improve, and the agent router. Evidence: seven scenarios across direct and monolithic topologies.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 — Capture a complete pinned Claude baseline. Evidence: sixteen baseline cells, all quotable.
- [ ] T005 — Reconcile ids, index, hashes, and baseline rows. Evidence: index equals the scenario set with matching hashes.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Confirm DAB-001 to 011 remain unchanged. Evidence: regression fixtures reproduce prior scores.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Sixteen scenarios exist and reconcile, the Claude baseline is complete and quotable, and existing DAB scenarios stay unchanged.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 006-command-topology-pilot. Successor: 008-bounded-command-matrix.
<!-- /ANCHOR:cross-refs -->
