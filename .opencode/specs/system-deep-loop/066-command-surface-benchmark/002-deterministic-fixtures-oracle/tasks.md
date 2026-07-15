---
title: "Tasks: deterministic fixtures and reference oracle"
description: "Task breakdown for the independent fixture corpus and reference oracle."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/002-deterministic-fixtures-oracle"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the fixtures and oracle child ahead of adapter implementation"
    next_safe_action: "Author the mutation manifest and reference oracle before any adapter code"
    blockers: []
    key_files:
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: deterministic fixtures and reference oracle

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Author the mutation manifest describing each defect fixture as a transformation. Evidence: manifest file enumerating all twelve fixtures plus the clean control.
- [ ] T002 — Implement the independent reference oracle and verify it against the clean control. Evidence: oracle verifier exit 0 with zero findings on the clean control.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Materialize the eight public calibration fixtures. Evidence: eight fixtures each matching a distinct core defect class.
- [ ] T004 — Materialize the four held-out fixtures. Evidence: four held-out fixtures with frozen expected defect sets.
- [ ] T005 — Freeze expected defect codes and locations from the oracle. Evidence: expectation files generated from the verified oracle.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Confirm every fixture matches its independent expected defect set. Evidence: oracle verifier exit 0 across all fixtures.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The oracle verifier passes on every fixture, the clean control is empty, and held-out fixtures are reserved from adapter-facing use.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 001-create-benchmark-conformance-family. Successor: 003-command-contract-adapter.
<!-- /ANCHOR:cross-refs -->
