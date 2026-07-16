---
title: "Tasks: executable-edge route parsing"
description: "Task breakdown for the schema-aware route-parsing change: structural parse with typed edges, re-classification of the reported P0 cycles, and updated benchmark route fixtures. All tasks open; scaffolded, not yet implemented."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/002-executable-edge-route-parsing"
    last_updated_at: "2026-07-16T08:08:17Z"
    last_updated_by: "claude"
    recent_action: "Authored Level-1 doc set for route-parsing phase"
    next_safe_action: "Read sk-doc-command.cjs route inference and flagged YAML fixtures"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/create/assets/create_readme_auto.yaml"
      - ".opencode/commands/doctor/_routes.yaml"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: executable-edge route parsing

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists the verification that will confirm it when the work is done. All tasks are open: this phase is scaffolded and not yet implemented, so no task carries completion evidence.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Read the route-inference path in sk-doc-command.cjs and the flagged fixtures (create_readme_auto.yaml, doctor/_routes.yaml); document the schema-declared dispatch fields to traverse. Verification when done: the set of declared dispatch fields is enumerated and the raw-text extraction points are located.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 — Replace raw-text extraction with a structural YAML parse that traverses only declared dispatch fields. Verification when done: comment-only and prose-only references produce zero edges.
- [ ] T003 — Record each edge with its kind (direct, subaction, workflow) and source location. Verification when done: every emitted edge carries a kind and a location.
- [ ] T004 — Re-classify the three currently-reported P0 cycles against the executable-only edge set and update the benchmark route fixtures. Verification when done: comment-derived cycles yield zero edges and the fixtures reflect the corrected edge set.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 — Confirm a genuine direct/subaction/workflow cycle still fails, with a path expressed in executable fields, and retain it as a fixture regression guard. Verification when done: the real cycle fails and its path is expressed in executable fields.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Route inference parses YAML structurally and follows only declared dispatch fields; each edge carries a kind and source location; the three reported P0 cycles re-classify with comment-derived references yielding zero edges; a genuine cycle still fails; and the benchmark route fixtures reflect the corrected edge set.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation`. Predecessor: 001-versioned-command-contract. Successor: none (final materialized phase; phases 003-006 are planned in the parent map).
<!-- /ANCHOR:cross-refs -->
