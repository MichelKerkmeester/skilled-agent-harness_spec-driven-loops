---
title: "Tasks: command-benchmark contract"
description: "Task breakdown for freezing the command-surface benchmark contract."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the contract child from the reconciled three-model benchmark design"
    next_safe_action: "Freeze the census and topology taxonomy against the live command tree"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command-benchmark contract

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Regenerate the canonical census and record exact source and mirror counts. Evidence: sync-prompts check exit 0 plus a frozen census snapshot.
- [ ] T002 — Assign every command to one of the four topologies. Evidence: taxonomy table covering the full census with zero unclassified.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Author the topology taxonomy reference with a fail-closed rule for unclassified shapes. Evidence: taxonomy doc plus rule statement.
- [ ] T004 — Document the two non-averaged verdict axes and the ownership boundary. Evidence: verdict-axis and ownership reference.
- [ ] T005 — Define per-phase handoff gates with evidence and exit codes. Evidence: handoff-gate table referenced by downstream phase specs.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Confirm the census reproduces and the taxonomy assigns every command exactly once. Evidence: sync-prompts check exit 0 and taxonomy count equals census count.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All tasks checked with evidence, the contract references cross-linked from downstream phase specs, and the census snapshot reproduces at exit 0.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: parent packet root. Successor: 001-deterministic-fixtures-oracle.
<!-- /ANCHOR:cross-refs -->
