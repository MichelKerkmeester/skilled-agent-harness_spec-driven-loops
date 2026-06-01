---
title: "MCP Daemon Reliability Phase 002: Code Graph Initial Scan"
description: "Phase 2 of the mcp-daemon-reliability track. The code graph was empty (0 nodes, freshness=empty) because mk_code_index had never been scanned in this environment. Phase 2 documents the operational procedure and gates it behind the Phase 1 socket-dir fix, which must be live before the scan can run."
trigger_phrases:
  - "code graph initial scan"
  - "code_graph_scan populate empty graph"
  - "mk_code_index reconnect scan"
  - "empty code graph readiness"
  - "007 phase 002 changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/002-code-graph-initial-scan` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The code graph reported `totalNodes: 0` with `freshness: "empty"` and `action: "full_scan"`. Structural queries (callers, imports, impact analysis) returned nothing because the graph had never been built in this environment. The root cause was that `mk_code_index` could not start due to the socket-dir issue fixed in Phase 1.

Phase 2 was set up to run one full `code_graph_scan` after the user reconnects `mk_code_index` via `/mcp`. The reconnect step also serves as the live confirmation that the Phase 1 socket-dir fix is working. No source files change in this phase. The scan writes the derived code-graph SQLite DB, which is not tracked in git. The Phase 1 prerequisite was confirmed complete as part of authoring this phase.

### Added

- None.

### Changed

- None.

### Fixed

- Confirmed Phase 1 socket-dir fix is shipped and `dist/` is rebuilt (prerequisite for Phase 2 scan).

### Verification

| Check | Result |
|-------|--------|
| `code_graph_scan` (full) | PENDING (runs after `mk_code_index` reconnect) |
| `code_graph_status` nodes > 0 | PENDING |
| Phase 1 live confirmation (reconnect succeeds, no pre-created socket dir) | PENDING (folds into the reconnect step) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| Packet docs (spec.md, plan.md, tasks.md, implementation-summary.md) | Created | Phase 2 spec folder authored as part of the 026/007 consolidation on 2026-05-28 |

### Follow-Ups

- Reconnect `mk_code_index` via `/mcp` to validate the Phase 1 fix live.
- Run `code_graph_scan` (full) to populate the empty graph after reconnect.
- Verify `code_graph_status` reports nodes > 0 and non-empty freshness.
- Update implementation-summary with final node and edge counts once the scan completes.
