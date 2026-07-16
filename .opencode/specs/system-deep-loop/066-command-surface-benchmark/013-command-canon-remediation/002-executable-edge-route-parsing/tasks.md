---
title: "Tasks: executable-edge route parsing"
description: "Task breakdown for the structural route-parsing change: comment-aware typed-edge extractor, re-classification of the three reported P0 cycles (3 to 0), and a parser-contract regression guard. All five tasks complete."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/002-executable-edge-route-parsing"
    last_updated_at: "2026-07-16T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped structural edge parser; real-corpus route cycles 3 to 0, genuine cycle retained"
    next_safe_action: "013 remediation tranche 000-002 complete; phases 003-006 remain planned"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs"
      - ".opencode/commands/create/assets/create_readme_auto.yaml"
      - ".opencode/commands/doctor/_routes.yaml"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: executable-edge route parsing

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task carries its verification evidence. All five tasks are complete: the structural edge extractor is in place, the three reported cycles re-classified from three to zero, edges carry a kind and a location, and a genuine executable cycle stays covered.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Located the raw-text back-edge scan in `checkRouteGraph` and enumerated the structural dispatch positions to follow: mapping value, sequence item, and the `-> ` route arrow. Evidence: the three reported edges are all `#` comment lines — `create_readme_auto.yaml:37`, `create_readme_confirm.yaml:9`, and `doctor/_routes.yaml:5` — while the only genuine edge in the fixtures is a `back_edge:` mapping value at `doctor_mcp_install.yaml:10`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 — Replaced the raw-text `extractCommandTargets` back-edge scan with `executableCommandEdges`, which skips whole-line and inline `#` comments and matches only structural value positions. Evidence: the real-corpus `CMD-S3-ROUTE-CYCLE` count dropped from three to zero, and the adapter differential test's new `executable-edges` guard asserts a comment reference yields zero edges.
- [x] T003 — Each edge is recorded as `{target, line, kind}` with a kind in `direct` / `subaction` / `workflow`. Evidence: the `testExecutableEdges` unit asserts the mapping, sequence, arrow, and `.yaml` cases resolve to `direct`, `direct`, `subaction`, and `workflow` respectively, each with its source line.
- [x] T004 — Re-classified the three reported P0 cycles against the executable-only edge set. Evidence: real-corpus `CMD-S3-ROUTE-CYCLE` re-classified from three to zero (all comment-derived); the route-fixture suite reflects the corrected edges — `public-route-cycle` (structural `back_edge:`) still fires and the new `executable-edges` contract locks comment-equals-zero.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 — Confirmed a genuine cycle still fails with its path in executable fields, retained as the fixture regression guard. Evidence: the `public-route-cycle` fixture (structural `back_edge:` to `doctor/mcp.md`) still emits `CMD-S3-ROUTE-CYCLE` at `doctor_mcp_install.yaml:10`, and the adapter differential test reports `fixtures=13` all passing with the independent oracle at `all=13`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Met. Route inference now follows only structural dispatch positions; each edge carries a kind and source location; the three reported P0 cycles re-classified from three to zero as comment-derived; a genuine executable cycle still fails; and the route-fixture suite reflects the corrected edge set through the retained genuine-cycle fixture and the new parser-contract guard.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation`. Predecessor: 001-versioned-command-contract. Successor: none (final materialized phase; phases 003-006 are planned in the parent map).
<!-- /ANCHOR:cross-refs -->
