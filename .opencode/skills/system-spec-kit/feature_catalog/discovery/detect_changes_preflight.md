---
title: "detect_changes preflight (Code Graph)"
description: "Read-only Code Graph handler that maps a unified-diff input to the structural symbols it touches via line-range overlap, refusing to answer when the graph is stale so callers never see a false-safe \"no impact\" result."
trigger_phrases:
  - "detect changes preflight"
  - "detect_changes"
  - "map diff to affected symbols"
  - "code graph change-safety check"
  - "unified-diff impact analysis"
version: 3.6.0.7
---

# detect_changes preflight (Code Graph)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Read-only Code Graph handler that maps a unified-diff input to the structural symbols it touches via line-range overlap, refusing to answer when the graph is stale so callers never see a false-safe "no impact" result.

`detect_changes` is the first Code Graph "change-safety" surface in Public. A reviewer pastes a `git diff`, the handler walks each hunk against the persisted `code_nodes` table, and the response lists every symbol whose source range intersects an added or removed line — with hard refuse semantics on any non-fresh readiness state.

---

## 2. HOW IT WORKS

### Entry Point & Routing

The handler lives at `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts` and is exported from `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts` alongside the other Code Graph handlers. It is registered as a code-graph MCP tool through `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts` and declared in `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`. It accepts `{ diff: string, rootDir?: string }` and returns `{ status, affectedSymbols[], affectedFiles[], blockedReason?, timestamp, readiness }`.

### Pipeline Architecture

Order of operations is fixed by the P1 safety invariant (pt-02 §12 RISK-03):

1. Canonicalize `rootDir` via `realpathSync` and verify it stays within the workspace (parity with `handlers/scan.ts`).
2. Call `ensureCodeGraphReady(rootDir, { allowInlineIndex: false, allowInlineFullScan: false })`. The read path NEVER triggers a silent reindex; operators choose when scans run.
3. If readiness freshness is anything other than `'fresh'`, return `status: 'blocked'` with a `blockedReason` describing the readiness state — empty `affectedSymbols[]` is forbidden on stale/empty/error.
4. Only after readiness clears does the handler parse the diff (`lib/diff-parser.ts`) and walk hunks against `queryOutline(filePath)` rows.

Symbol attribution uses pure line-range overlap: a hunk `(newStart, newLines)` or `(oldStart, oldLines)` that intersects a node's `[startLine, endLine]` range marks the node affected. Synthetic per-file `module` nodes are excluded so they don't drown per-symbol signal. Diff paths are resolved with `graphDb.resolveSubjectFilePath` so they map to the same canonical paths the indexer persists.

### Edge Cases & Caveats

The diff parser is a clean-room minimal unified-diff implementation in `.opencode/skills/system-code-graph/mcp_server/lib/diff-parser.ts`. It handles `diff --git`, `--- a/<path>`, `+++ b/<path>`, and `@@ -oldStart[,oldLines] +newStart[,newLines] @@` headers, returning `parse_error` on malformed input. No new npm dependency was added — the parser handles the subset `git diff` emits and clean-room rule ADR-012-001 forbids dragging in upstream `diff` package source forms.

The output preserves the readiness envelope (`canonicalReadiness`, `trustState`) the rest of the code-graph handler family already returns, so consumers can treat detect_changes responses with the same readiness vocabulary as `code_graph_query` and `code_graph_status`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts` | Handler | Read-only preflight; orchestrates readiness probe, diff parse, and overlap attribution |
| `.opencode/skills/system-code-graph/mcp_server/lib/diff-parser.ts` | Lib | Custom unified-diff parser (`parseUnifiedDiff`) plus `rangesOverlap` helper |
| `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts` | Handler | Exports `handleDetectChanges` alongside the other Code Graph handlers |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts` | Dispatcher | `'detect_changes'` in `TOOL_NAMES`; switch case dispatches to `handleDetectChanges` after validating `diff` is a non-empty string (010/007 T-A) |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | JSON schema | `detect_changes` ToolDefinition with `{ diff: string, rootDir?: string }` declared inputSchema |
| `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts` | Lib (existing) | Source of `ensureCodeGraphReady` readiness probe (consumed read-only) |
| `.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts` | Lib (existing) | Source of `buildReadinessBlock` envelope shape mirrored in the response |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Lib (existing) | Source of `queryOutline` and `resolveSubjectFilePath` (consumed read-only) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/tests/detect-changes.test.ts` | Automated test | Blocked-on-stale safety invariant, parse_error contract, symbol attribution by line-range overlap, output-shape contract, diff-parser unit cases |

---

## 4. SOURCE METADATA
- Group: Discovery
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `discovery/detect_changes_preflight.md`

- Phase / sub-phase: `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes`
- Research basis: pt-02 §4 (Code Graph findings, `detect_changes` row), §11 Packet 1, §12 RISK-03 (false-safe changed-symbol impact)
- Decision record: 012/decision-record.md ADR-012-001 (clean-room), ADR-012-002 (sub-phase split)
Related references:
- [health-diagnostics-memoryhealth.md](health_diagnostics_memoryhealth.md) — Health diagnostics (memory_health)
- [session-bootstrap-reader-ready-context.md](session_bootstrap_reader_ready_context.md) — Session bootstrap reader-ready context
