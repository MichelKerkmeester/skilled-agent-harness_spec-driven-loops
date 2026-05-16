---
title: "system-code-graph Architecture"
description: "Architecture reference for the standalone system-code-graph skill: MCP server boundary, 10-tool surface, AST + SQLite + sqlite-vec storage, readiness state machine, integration points with mk-spec-memory and CocoIndex."
trigger_phrases:
  - "system-code-graph architecture"
  - "mk-code-index architecture"
  - "code-graph internals"
  - "code-graph readiness state machine"
importance_tier: "important"
contextType: "architecture"
---

<!-- SPECKIT_TEMPLATE_SOURCE: architecture-core | v2.2 -->
# Architecture: system-code-graph

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Skill name** | `system-code-graph` (filesystem slug) |
| **MCP server name** | `mk-code-index` (runtime identity) |
| **Client namespace** | `mcp__mk_code_index__*` |
| **Runtime package** | `@spec-kit/system-code-graph` |
| **Created** | 2026-05-14 (014 extraction); architecture doc 2026-05-14 (014/014); reconstructed 2026-05-14 (014/019) |
| **Owner** | `.opencode/skills/system-code-graph/` (standalone post-014) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:overview -->
## 2. OVERVIEW

`system-code-graph` is the standalone structural-code-intelligence skill. It scans source files into a SQLite graph, answers structural relationship queries, prepares compact LLM context, and exposes recovery-safe MCP tools through the `mk-code-index` MCP server. It does NOT do semantic search (that's CocoIndex's job) or persistent continuity (that's mk-spec-memory).

The skill was extracted from system-spec-kit's `mcp_server/lib/code-graph/` subtree in packet 014. It owns its own MCP server, its own SQLite databases, its own readiness state machine, and its own dist build pipeline.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:components -->
## 3. COMPONENTS

### MCP server (`mcp_server/index.ts`)
Entry point. Loads the 11 tool schemas from `mcp_server/tool-schemas.ts`, wires handlers from `mcp_server/handlers/`, opens stdio transport, advertises tools to the client. Server name registered as `mk-code-index`; clients see namespace `mcp__mk_code_index__*`.

### Tool surface (11 tools)
| Tool | Purpose |
|------|---------|
| `code_graph_scan` | Walk workspace, parse files via tree-sitter, persist file/symbol/edge rows |
| `code_graph_query` | Structural queries: `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius` (with optional multi-subject union) |
| `code_graph_classify_query_intent` | Classify natural-language queries into structural/semantic/hybrid intent before routing |
| `code_graph_context` | Compact graph neighborhoods for LLM context windows; accepts seeds from CocoIndex, manual input, or graph lookups |
| `code_graph_status` | Health/readiness report: file/node/edge counts, freshness, trust state, parser health |
| `code_graph_verify` | Run gold-query battery against current index; supports category filtering and baseline persistence |
| `code_graph_apply` | Verification-gated recovery operations: rescan, prune-excludes, repair-nodes, recover-sqlite-corruption, rollback-bad-apply |
| `detect_changes` | Map unified-diff input to affected symbols via line-range overlap; refuses when readiness is non-fresh |
| `ccc_status` | CocoIndex bridge: availability + binary path probe |
| `ccc_reindex` | CocoIndex bridge: trigger incremental or full re-index of the workspace |
| `ccc_feedback` | CocoIndex bridge: submit search-quality feedback for future search improvements |

### Parser layer (`mcp_server/lib/parsing/`)
Tree-sitter via `web-tree-sitter` + `tree-sitter-wasms` (multi-language WASM grammars). Extracts files, symbols (functions, classes, methods, exports), edges (calls, imports, references). Maintains a parser-skip list for files that fail parsing.

### Storage layer (`mcp_server/lib/code-graph-db.ts` + `lib/code-graph-context-db.ts`)
- Primary: **SQLite** via `better-sqlite3`. Tables: `code_files`, `code_nodes`, `code_edges`, `meta`, `verification_baselines`, `parser_skip_list`.
- Optional: **sqlite-vec** virtual table for vector-based similarity (when CocoIndex seeds inject embeddings). Loaded via extension; gracefully degrades to no-vec if extension load fails.
- Database file: `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` by default. `SPECKIT_CODE_GRAPH_DB_DIR` env var overrides (must stay inside workspace per standalone-storage guard in `mk-code-index-launcher.cjs`).

### Readiness state machine (`mcp_server/lib/ensure-ready.ts`)
Every read-path tool consults a unified readiness contract before answering:

| State | Meaning | Tool Response |
|-------|---------|---------------|
| `fresh` | Index matches workspace HEAD and recent file mtimes | Tools answer normally |
| `stale` | Workspace has changed since last scan | Tools return `status:"blocked"` with `requiredAction:"code_graph_scan"` (no degraded answers) |
| `empty` | DB exists but no nodes indexed | Tools return blocked; recommend full scan |
| `error` | DB corruption or read failure | Tools return blocked; recommend `code_graph_apply` recovery |
| `absent` | DB file missing | Tools return blocked; auto-create on first scan |

The readiness contract is a hard refuse, not a soft degrade. The intent is to avoid serving incorrect structural answers.

### Apply-mode recovery (`mcp_server/lib/apply-mode/`)
Gated recovery operations protected by gold-query battery (run before AND after each apply). Soft-stale self-healing has bounded scope. Audit log written to JSONL. Rollback-bad-apply restores from the last known-good baseline.
<!-- /ANCHOR:components -->

---

<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

### What this skill owns
- All `code_graph_*` tool implementations and schemas
- The SQLite code-graph database lifecycle (open, scan, persist, close)
- The readiness state machine
- Apply-mode recovery operations
- CocoIndex bridge tools (`ccc_status`, `ccc_reindex`, `ccc_feedback`). Note these are bridges, not CocoIndex itself.

### What this skill does NOT own
- **Persistent memory / continuity**: owned by `mk-spec-memory` MCP (`mcp__mk_spec_memory__*`)
- **Semantic code search**: owned by CocoIndex (`mcp__cocoindex_code__*`). We only bridge it for cross-tool seeding.
- **Skill routing / advisor**: owned by `system-skill-advisor` MCP
- **Spec folder lifecycle**: owned by `system-spec-kit`
- **Deep-loop coverage graph tools**: `deep_loop_graph_*` lives in `mk-spec-memory` (not in `mk-code-index`). See feature_catalog footnote.
<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:data-flow -->
## 5. DATA FLOW

Scan path:
1. Caller invokes `code_graph_scan({rootDir?, includeGlobs?, incremental:true})`
2. Scanner walks workspace via `ignore`-aware globbing
3. For each file: hash content; if changed since last scan, parse via tree-sitter
4. Persist files / symbols / edges into SQLite (single-writer transactional)
5. Update meta (last_scan_at, last_persisted_at, last_git_head)

Query path:
1. Caller invokes a read tool (e.g., `code_graph_query({operation, subject})`)
2. Tool consults `ensure-ready` → returns readiness state
3. If `fresh`: execute query against SQLite; return results
4. Otherwise: return `status:"blocked"` with `readiness` payload (no degraded answers)

Context path:
1. Caller invokes `code_graph_context({seeds, queryMode, budgetTokens})`
2. Seeds can come from: CocoIndex search results (`provider:"cocoindex"`), manual input (`provider:"manual"`), or graph lookups (`provider:"graph"`)
3. Tool expands neighborhoods around seeds within token budget
4. Returns compact LLM-friendly payload

Change-detection path:
1. Caller invokes `detect_changes({diff, rootDir?})`
2. Tool parses unified diff into file/line ranges
3. Maps line ranges against indexed `code_nodes.start_line` / `end_line`
4. Returns `affectedSymbols` + `affectedFiles` (or refuses with `blocked` if not fresh)
<!-- /ANCHOR:data-flow -->

---

<!-- ANCHOR:invariants -->
## 6. INVARIANTS

1. **Single-writer scan loop.** Only `code_graph_scan` writes to the SQLite DB. All other tools are read-only. This eliminates write contention.
2. **Readiness is a hard refuse, not a soft degrade.** Stale / empty / error states block read paths with explicit `status:"blocked"` payloads, never silent empty arrays.
3. **No semantic search inside this skill.** Semantic intent maps to CocoIndex; structural queries map here. The `code_graph_context` tool accepts CocoIndex seeds but does not re-implement search.
4. **Storage stays inside the workspace.** The launcher's standalone-storage guard refuses to point the DB outside the workspace tree.
5. **Apply-mode is gold-query-gated.** Every recovery operation runs the verification battery before AND after. Failures roll back to last known-good baseline.
6. **MCP server name is `mk-code-index`, not `system-code-graph`.** The directory is named after the skill; the MCP server is named after the runtime identity. This separation is intentional.
<!-- /ANCHOR:invariants -->

---

<!-- ANCHOR:extension-points -->
## 7. EXTENSION POINTS

- **New language support**: add a tree-sitter WASM grammar to `tree-sitter-wasms` dependency and register in the parser map.
- **New query operation**: add to `code_graph_query` operation enum + handler dispatch + tool-schema description.
- **New apply operation**: add to `code_graph_apply` operation enum + gated handler + audit-log writer.
- **CocoIndex bridge expansion**: new `ccc_*` tools can be added alongside the existing 3. They remain thin pass-throughs to the CocoIndex binary.
<!-- /ANCHOR:extension-points -->

---

<!-- ANCHOR:integration -->
## 8. INTEGRATION POINTS

| Consumer | Path | Purpose |
|----------|------|---------|
| `system-spec-kit` handlers/hooks | In-process imports from `system-code-graph/mcp_server/lib/*` | Shared readiness, startup briefs, context helpers |
| MCP clients (Claude, Codex, Gemini, OpenCode) | Standalone `mk-code-index` MCP server | All 11 tools via `mcp__mk_code_index__*` namespace |
| Doctor command suite | `_routes.yaml` registers `code-graph` as a route | Diagnostic + apply-mode dispatch |
| Skill advisor | Reads SKILL.md and metadata | Routes "code graph" / "blast radius" / "outline" requests here |

The shared SQLite file is the coordination boundary between in-process imports and MCP tool callers. The single-writer invariant prevents corruption.
<!-- /ANCHOR:integration -->

---

<!-- ANCHOR:open-questions -->
## 9. OPEN QUESTIONS

None. The prior stale tool-count question is resolved: the live surface is 11 tools, enumerated in §3 Components above. Reconstructed in packet 019 after the original was lost to a force-push; tool count reconciled to 11 in packet 028 after `code_graph_classify_query_intent` was added to the schema.
<!-- /ANCHOR:open-questions -->
