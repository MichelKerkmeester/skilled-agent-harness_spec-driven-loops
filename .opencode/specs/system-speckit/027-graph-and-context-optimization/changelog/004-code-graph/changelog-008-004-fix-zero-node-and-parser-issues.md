---
title: "Code Graph Phase 008/004: Zero-Node Scan Guard and Parser-Error Graph Preservation"
description: "Two P0 data-loss bugs in the code-graph scan promotion path are fixed. A zero-node full scan over a populated graph is now blocked by default. Per-file parser runtime errors no longer overwrite the last successful structural graph. Five P1 hardening items also shipped: scan metadata promotion gating, nonfatal-error manifest recording, durable parse diagnostics in scan and status summaries plus orphan-edge filtering."
trigger_phrases:
  - "zero_node_scan_rejected fix"
  - "parser error graph preservation"
  - "forceZeroNodeReset"
  - "parse diagnostics code graph"
  - "code graph scan promotion guard"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `027-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/004-fix-zero-node-and-parser-issues` (Level 2)
> Parent packet: `027-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

Real-world usefulness testing surfaced two P0 data-loss paths in the code-graph persistence layer. A full scan that returned zero nodes could prune and replace a populated graph, leaving operators with an empty index. A runtime parse error during file indexing could overwrite the file's last good structural data with empty error state, making previously queryable nodes and edges disappear silently.

Both P0 paths are now closed. A zero-node full scan over a graph with existing nodes returns `zero_node_scan_rejected` and blocks promotion unless `forceZeroNodeReset: true` is explicitly passed. A file that produces a runtime parse error now preserves its prior `code_files`, `code_nodes` and `code_edges` rows, with the error recorded separately in a new `parse_diagnostics` store.

Five P1 hardening items shipped alongside the P0 fixes: scan metadata (git head, scope, provenance) no longer promotes after unusable or heavily-errored scans. `replaceEdges()` filters orphan edges before insert and runs one-shot orphan cleanup. Nonfatal per-file parse errors no longer block candidate-manifest recording. Durable parse diagnostics surface affected file counts and recent error samples in both scan and status responses.

### Added

- Zero-node scan guard in `handlers/scan.ts`: blocks full-scan promotion when candidate persistable nodes is 0 and the existing graph has nodes, returning `reason: "zero_node_scan_rejected"` without touching the live graph.
- `forceZeroNodeReset: true` argument exposed in `tool-schemas.ts` and validated in `schemas/tool-input-schemas.ts` for callers that need a legitimate destructive reset.
- `parse_diagnostics` table and API in `code-graph-db.ts` with fields `file_path`, `error_message`, `error_count` and `last_seen_at`. Additive schema migration preserves existing readers.
- Parse diagnostics summary fields (`affectedFiles`, `recentErrors`) in scan responses and status responses.
- Regression test covering zero-node preservation in `code-graph-scan.vitest.ts`.
- Regression test covering per-file parse-error preservation in `code-graph-atomic-persistence.vitest.ts`.
- Regression test covering orphan-edge filtering in `code-graph-indexer.vitest.ts`.

### Changed

- `ensure-ready.ts`: files with `parseHealth === "error"` are diverted to `parse_diagnostics` instead of replacing prior graph rows. Prior nodes and edges remain queryable after a runtime parse failure.
- `handlers/scan.ts`: live scan metadata (git head, scope, provenance, edge baseline, enrichment) now promotes only when scan health is promotable. Zero-node blocked scans and scans over the fatal parse-error ratio write a failed-scan record instead.
- `code-graph-db.ts`: `replaceEdges()` filters edges whose source node no longer exists after node replacement and runs one-shot orphan cleanup. Full scans record the candidate manifest when the per-file parse error count is at or below 50 percent of total files.

### Fixed

- Zero-node full scans could prune and promote over a populated graph, clearing all indexed nodes and edges. The guard blocks promotion before any pruning occurs.
- Parser runtime errors overwrote the last successful per-file graph with empty state. Preservation now keeps prior rows queryable and records the error separately.
- Orphan edges (edges whose source node no longer exists) could accumulate across scans. The `replaceEdges()` filter and post-prune cleanup query eliminate the "0 nodes, 764 edges" failure mode.
- Nonfatal per-file parse errors suppressed candidate-manifest recording even when the error rate was low. Manifest recording now decouples from nonfatal errors.

### Verification

| Check | Result |
|-------|--------|
| Focused regression subset | PASS. 4 passed, 103 passed. |
| Code graph vitest suite | PASS. 20 passed, 262 passed. |
| Tool input schema suite | PASS. 1 passed, 86 passed. |
| TypeScript build | PASS. `npm run build` exit 0. |
| OpenCode alignment drift | PASS with 6 warnings in unrelated pre-existing files. No errors. |
| Child strict validation | PASS. `004-fix-zero-node-and-parser-issues --strict` exited 0. |
| Parent strict validation | PASS. `011-real-world-usefulness-test-planning --strict` exited 0. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Zero-node guard added before pruning. Promotion gate added for scan metadata. Manifest recording decoupled from nonfatal parse errors. Parse diagnostics summary added to response. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Files with `parseHealth === "error"` now divert to `parse_diagnostics` and skip graph row replacement. Prior nodes and edges remain. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` | New `parse_diagnostics` table and additive migration. Orphan-edge filter in `replaceEdges()`. Failed-scan metadata record. Stale-but-valid file count added to status queries. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Parse diagnostics and stale-but-valid file count surfaced in status response. |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | `forceZeroNodeReset` boolean added to `code_graph_scan` tool schema. |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | `forceZeroNodeReset` validated in internal scan input schema. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` (NEW regression) | Zero-node guard and manifest recording regressions added. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-atomic-persistence.vitest.ts` (NEW regression) | Per-file parse-error preservation regression added. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` (NEW regression) | Orphan-edge filtering regression added. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-candidate-manifest.vitest.ts` | Broad-scan and read-path manifest comparison regression added for F-006. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts` | Mock additions for new scan schema. |

Shipped in commit `f7a3fbdf` (feat(012/004): code-graph P0+P1 remediation) and `98caf31c` (live MCP post-fix verification).

### Follow-Ups

- Address six alignment warnings in pre-existing `mcp_server/lib/*` files that `verify_alignment_drift.py` flagged as missing module headers. These files were not modified in this packet and the warnings are outside the fix scope.
- Replace last-record failed-scan persistence with a bounded history table if operators need to review a sequence of consecutive scan failures rather than only the latest.
