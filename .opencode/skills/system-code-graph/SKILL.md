---
name: system-code-graph
description: "Code-graph subsystem skill: structural AST indexing + SQLite-backed graph storage + 12 MCP tools (code_graph_*, ccc_*, detect_changes) for impact analysis, neighborhood retrieval, and readiness reporting."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.0.0
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/005-doc-and-runtime-migration"
    last_updated_at: "2026-05-14T09:17:09Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 007 standalone MCP topology pivot"
    next_safe_action: "Restart MCP children to pick up mk-code-index"
    blockers: []
    key_files:
      - "SKILL.md"
      - "README.md"
      - "feature_catalog/22--context-preservation-and-code-graph/"
      - "manual_testing_playbook/22--context-preservation-and-code-graph/"
---

<!-- PHASE 007 STANDALONE MCP COMPLETE — code, database, docs co-located; MCP tools registered under `mcp__mk_code_index__*` namespace via standalone server. -->

<!-- Keywords: code-graph, code graph, structural code indexing, blast radius, impact analysis, code_graph_scan, code_graph_query, code_graph_context, code_graph_status, ccc_status, detect_changes -->

# System Code Graph

Structural AST indexing, SQLite-backed graph storage, and MCP-facing code intelligence for impact analysis, neighborhood retrieval, graph readiness, and change detection.

## 1. WHEN TO USE

Use this skill for:

- Structural code search where call paths, imports, containment, or symbols matter.
- Blast-radius and impact preflight before risky code changes.
- Code-graph health, readiness, freshness, and doctor checks.
- Gold-query verification and graph quality validation.
- MCP tool workflows using `code_graph_*`, `ccc_*`, or `detect_changes`.

### When NOT to use

- Text-only exact searches: use Grep.
- Filename or path globbing: use Glob.
- Semantic concept search without known structure: use `mcp-coco-index`.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The code-graph subsystem exposes 12 tools, owns 7 graph tables, and currently indexes a 55 MB live graph. It is consumed by 5 cross-subsystem handlers, 6 startup hooks, and the OpenCode plugin bridge.

The code-graph subsystem now lives in `.opencode/skills/system-code-graph/`. Stable MCP tool IDs are registered through the standalone `mk-code-index` MCP server, exposed to clients as `mcp__mk_code_index__*`.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

Use this routing before choosing a tool or reference:

| Intent | Primary Surface | Reference |
|--------|-----------------|-----------|
| Index or refresh structural graph state | `code_graph_scan` | `feature_catalog/22--context-preservation-and-code-graph/07-structural-code-indexer.md` |
| Query callers, imports, dependencies, symbols, or blast radius | `code_graph_query` | `feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md` |
| Build compact neighborhood context around seeds | `code_graph_context` | `feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md` |
| Check readiness, freshness, graph quality, or blocked-read state | `code_graph_status` | `feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` |
| Validate graph quality with gold queries | `code_graph_verify` | `mcp_server/feature_catalog/02--manual-scan-verify-status/02-code-graph-verify.md` |
| Apply graph-informed patch operations | `code_graph_apply` | `mcp_server/feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` |
| Inspect changed symbols from a diff | `detect_changes` | `mcp_server/feature_catalog/03--detect-changes/01-detect-changes-preflight.md` |
| Bridge semantic search and structural graph context | `ccc_status`, `ccc_reindex`, `ccc_feedback` | `mcp_server/feature_catalog/07--ccc-integration/` |

Shared hook/runtime/budget/context docs remain in `system-spec-kit`; only code-graph-owned internals and operator scenarios live here.

<!-- /ANCHOR:smart-routing -->

---

<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

See [README.md](./README.md) for the overview and tool list. Runtime source lives under the flattened `mcp_server/{lib,handlers,tools,tests}/` layout; package docs live under `feature_catalog/` and `manual_testing_playbook/`.
<!-- /ANCHOR:how-it-works -->

---

<!-- ANCHOR:rules -->
## 4. RULES

- MCP tools are registered under standalone `mk-code-index` per ADR-002.
- MCP callers use `mcp__mk_code_index__code_graph_*`, `mcp__mk_code_index__ccc_*`, and `mcp__mk_code_index__detect_changes`.
- Direct library consumers in system-spec-kit handlers/hooks continue to use in-process imports.
- Keep shared lifecycle and memory surfaces in `system-spec-kit`; move only code-graph-owned docs/source here.
<!-- /ANCHOR:rules -->

---

<!-- ANCHOR:references -->
## 5. REFERENCES

Moved category-22 feature catalog docs:

- `feature_catalog/22--context-preservation-and-code-graph/07-structural-code-indexer.md`
- `feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md`
- `feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`
- `feature_catalog/22--context-preservation-and-code-graph/13-tree-sitter-wasm-parser.md`
- `feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md`
- `feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`

Moved category-22 manual testing playbook docs:

- `manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md`
- `manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
- `manual_testing_playbook/22--context-preservation-and-code-graph/259-tree-sitter-parser.md`
- `manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md`
- `manual_testing_playbook/22--context-preservation-and-code-graph/275-code-graph-readiness-contract.md`
- `manual_testing_playbook/22--context-preservation-and-code-graph/277-code-graph-fast-fail.md`
- `manual_testing_playbook/22--context-preservation-and-code-graph/281-code-graph-read-path-selective-self-heal.md`
- `manual_testing_playbook/22--context-preservation-and-code-graph/282-code-graph-cell-coverage-evidence.md`
<!-- /ANCHOR:references -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- `code_graph_scan` can reach `fresh` or `stale` readiness after source migration.
- Gold queries pass after Phase 003/004 verification.
- Doctor target for code graph reports green after Phase 006.
- Startup surfaces continue to report graph readiness without tool-id churn.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

Cross-subsystem consumers use two intentional paths:

| Consumer Type | Integration |
|---------------|-------------|
| system-spec-kit handlers/hooks/session surfaces | Direct in-process imports from `system-code-graph/mcp_server/lib/*` for shared readiness, startup, and context helpers. |
| MCP callers, agents, and commands | Standalone `mk-code-index` MCP namespace: `mcp__mk_code_index__code_graph_*`, `mcp__mk_code_index__ccc_*`, and `mcp__mk_code_index__detect_changes`. |

The shared SQLite file remains the coordination boundary; the scan loop is the single writer.
<!-- /ANCHOR:integration-points -->

---

<!-- ANCHOR:related-resources -->
## 8. REFERENCES AND RELATED RESOURCES

For shared lifecycle/context docs that intentionally stayed in `system-spec-kit`, see `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/`. For extraction history, see `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/`.
<!-- /ANCHOR:related-resources -->
