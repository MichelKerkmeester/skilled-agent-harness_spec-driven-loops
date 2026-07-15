---
title: "Tasks: scorecard and closeout"
description: "Task breakdown for the scorecard and packet closeout."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/008-scorecard-and-closeout"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the closeout child that publishes the two-axis scorecard"
    next_safe_action: "Compile the deterministic and behavioral axes into the scorecard"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: scorecard and closeout

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Compile the deterministic verdict and behavioral buckets into a non-averaged scorecard. Evidence: scorecard shows both axes separately with the matrix summary.
- [ ] T002 — Publish the remediation backlog for failing commands. Evidence: backlog lists findings as downstream planning input.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Reconcile packet status metadata across spec, graph, and description surfaces. Evidence: metadata surfaces agree on status.
- [ ] T004 — Confirm existing reference and sync gates remain green. Evidence: reference-checks and sync-prompts checks exit 0.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 — Run recursive strict validation over the whole packet. Evidence: validate recursive strict exit 0.
- [ ] T006 — Confirm map, graph, checklist, summaries, and scorecard agree. Evidence: cross-surface reconciliation shows no conflict.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The two-axis scorecard and remediation backlog are published, packet metadata reconciles, existing gates stay green, and recursive strict validation exits 0.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 007-bounded-command-matrix. Successor: packet closeout.
<!-- /ANCHOR:cross-refs -->
