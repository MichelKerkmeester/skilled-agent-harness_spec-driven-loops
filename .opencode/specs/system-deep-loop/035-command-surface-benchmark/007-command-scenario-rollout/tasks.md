---
title: "Tasks: command scenario rollout"
description: "Task breakdown for the full behavioral scenario suite."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/007-command-scenario-rollout"
    last_updated_at: "2026-07-15T10:49:30Z"
    last_updated_by: "codex"
    recent_action: "Completed every authoring and hermetic verification task"
    next_safe_action: "Capture the sixteen live Claude baseline cells after operator green-light"
    blockers:
      - "Live Claude baseline capture is deferred pending operator green-light"
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command scenario rollout

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each completed task carries concrete verification evidence. Only live baseline capture remains open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Complete the workflow-router portion of DAB-012 to 017. [evidence: prior DAB-012 to 015 retained; DAB-016 `create/benchmark` and DAB-017 `design/audit` parse as schema v2 with pinned source hashes]
- [x] T002 — Author DAB-018 to 020 covering the doctor subaction router. [evidence: `command-scenario-rollout.test.cjs` asserts `binds_setup: true` for DAB-018, DAB-019, and DAB-020; node test exit 0 for 3/3 contracts]
- [x] T003 — Author DAB-021 to 027 covering memory, goal, and the agent router. [evidence: DAB-021 to 026 use `direct_dispatch`; DAB-027 is monolithic with a command-owned question halt]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 — DEFERRED — live Claude baseline capture pending operator green-light.
- [x] T005 — Reconcile ids, index, hashes, and baseline rows. [evidence: `command-scenario-rollout.test.cjs` proves the exact DAB-012 to 027 set, 16/16 index rows, 16/16 pending baseline rows, and current marker-source hashes]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Confirm DAB-001 to 011 remain unchanged. [evidence: `node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/command-scenario-rollout.test.cjs` exit 0; the frozen v1 golden assertion passes, and the shared `behavior-bench-run.test.cjs` exits 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Sixteen scenarios exist and reconcile, and existing DAB scenarios retain their golden scoring. The phase remains in progress until the sixteen Claude baseline rows are captured and quotable.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/035-command-surface-benchmark`. Predecessor: 006-command-topology-pilot. Successor: 008-bounded-command-matrix.
<!-- /ANCHOR:cross-refs -->
