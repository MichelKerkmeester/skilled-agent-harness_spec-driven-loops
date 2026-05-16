---
name: system-code-graph
description: "Structural code indexing and mk-code-index MCP workflows for graph readiness, impact queries, context retrieval and CCC checks."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.3.1
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-system-code-graph-doc-alignment"
    last_updated_at: "2026-05-16T09:01:20Z"
    last_updated_by: "main_agent"
    recent_action: "Reconciled tool count (10/12 → 11), graph-metadata topology (co-resident → standalone), and version (1.0.0.0 → 1.0.3.1) across SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, feature_catalog.md, and graph-metadata.json"
    next_safe_action: "Run strict-validate on packet 028, then commit on main"
    blockers: []
    key_files:
      - "SKILL.md"
      - "README.md"
      - "ARCHITECTURE.md"
      - "INSTALL_GUIDE.md"
      - "feature_catalog/feature_catalog.md"
      - "graph-metadata.json"
---

<!-- Keywords: code-graph, code graph, structural code indexing, mk-code-index, impact analysis, code_graph_scan, code_graph_query, code_graph_context, code_graph_status, ccc_status, detect_changes -->

# System Code Graph - Structural Code Indexing and MCP Workflows

Structural AST indexing, SQLite-backed graph storage and MCP-facing code intelligence for impact analysis, neighborhood retrieval, graph readiness and change detection.

## 1. WHEN TO USE

Use this skill for:

- Structural code search where call paths, imports, containment or symbols matter.
- Blast-radius and impact preflight before risky code changes.
- Code-graph health, readiness, freshness and doctor checks.
- Gold-query verification and graph quality validation.
- MCP tool workflows using `code_graph_*`, `ccc_*` or `detect_changes`.

### When NOT to use

- Text-only exact searches: use Grep.
- Filename or path globbing: use Glob.
- Semantic concept search without known structure: use `mcp-coco-index`.

---

<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

Use this routing before choosing a tool or reference:

| Intent | Primary Surface | Reference |
|--------|-----------------|-----------|
| Index or refresh structural graph state | `mcp__mk_code_index__code_graph_scan` | `feature_catalog/02--manual-scan-verify-status/01-code-graph-scan.md` |
| Query callers, imports, dependencies, symbols or blast radius | `mcp__mk_code_index__code_graph_query` | `feature_catalog/01--read-path-freshness/02-query-self-heal.md` |
| Classify natural-language queries into structural/semantic/hybrid intent | `mcp__mk_code_index__code_graph_classify_query_intent` | n/a (no dedicated reference) |
| Build compact neighborhood context around seeds | `mcp__mk_code_index__code_graph_context` | `feature_catalog/04--context-retrieval/01-code-graph-context.md` |
| Check readiness, freshness, graph quality or blocked-read state | `mcp__mk_code_index__code_graph_status` | `feature_catalog/02--manual-scan-verify-status/03-code-graph-status.md` |
| Validate graph quality with gold queries | `mcp__mk_code_index__code_graph_verify` | `feature_catalog/02--manual-scan-verify-status/02-code-graph-verify.md` |
| Inspect changed symbols from a diff | `mcp__mk_code_index__detect_changes` | `feature_catalog/03--detect-changes/01-detect-changes-preflight.md` |
| Execute verification-gated apply-mode recovery operations | `mcp__mk_code_index__code_graph_apply` | `feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` |
| Bridge CocoIndex status, reindexing and feedback | `mcp__mk_code_index__ccc_status`, `mcp__mk_code_index__ccc_reindex`, `mcp__mk_code_index__ccc_feedback` | `feature_catalog/07--ccc-integration/` |
| Review doctor code-graph apply policy | `/doctor code-graph` | `feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` |

The standalone MCP server name is `mk-code-index`. Tool IDs stay stable as `code_graph_*`, `detect_changes` and `ccc_*`.

### Routing key

The routing key is the natural-language intent class returned by `code_graph_classify_query_intent` (structural / semantic / hybrid). Operators may override by naming a tool directly in the prompt.

### Fallback contract

- **Unclassifiable intent:** call `code_graph_classify_query_intent` first. If the classifier returns low confidence, ask for one concrete file path, symbol or error message before proceeding.
- **`mk_code_index` MCP unavailable:** report the state and stop. Structural queries do not fall back to text search because ambiguous text-search results mislead more than they help.
- **Graph not ready (`status` returns `blocked`, `empty` or `absent`):** call `code_graph_scan` first, then retry. Never return a stale or empty graph result as if it were authoritative.

### Anti-patterns

- Hardcoded tool lists in router code. Consult `mcp_server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` as the source of truth.
- Using `code_graph_query` for unclassified queries. Classify intent first so the right tool runs.
- Treating `detect_changes` as a general query tool. It is diff-driven impact analysis with a fixed schema, not a query surface.

<!-- /ANCHOR:smart-routing -->

---

<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

Runtime source lives under `mcp_server/{lib,handlers,tools,tests}/`. The package docs live under `feature_catalog/` and `manual_testing_playbook/`.

Read paths use `ensureCodeGraphReady()` before answering structural queries. Manual maintenance tools run explicit scans, verification, status checks and CCC bridge operations. Deep-loop coverage graph tools still live in `system-spec-kit` because those workflows own the research and review loop state.
<!-- /ANCHOR:how-it-works -->

---

<!-- ANCHOR:rules -->
## 4. RULES

- MCP tools are registered under the standalone `mk-code-index` server.
- MCP callers use `mcp__mk_code_index__code_graph_*`, `mcp__mk_code_index__ccc_*` and `mcp__mk_code_index__detect_changes`.
- Direct library consumers in system-spec-kit handlers/hooks continue to use in-process imports.
- Keep shared lifecycle and memory surfaces in `system-spec-kit`. Move only code-graph-owned docs/source here.
<!-- /ANCHOR:rules -->

---

<!-- ANCHOR:references -->
## 5. REFERENCES

- `feature_catalog/feature_catalog.md` is the current runtime feature inventory.
- `manual_testing_playbook/manual_testing_playbook.md` is the operator validation package.
- `mcp_server/tool-schemas.ts` defines the `mk-code-index` code graph, detect-changes and CCC schemas.
- `mcp_server/tools/code-graph-tools.ts` registers and dispatches the standalone tool IDs.
<!-- /ANCHOR:references -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- `code_graph_scan` can refresh the graph and report readiness metadata.
- `code_graph_query`, `code_graph_context` and `detect_changes` refuse unsafe stale states instead of returning false-safe answers.
- `code_graph_verify` runs only against fresh graph state.
- Docs reference `mk-code-index` for live MCP namespace examples.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

**Naming convention.** The skill directory and SKILL.md `name` field use `system-code-graph` (filesystem slug). The MCP server name and client namespace use `mk-code-index` (runtime identity, namespaced as `mcp__mk_code_index__*` because MCP converts hyphens to underscores in tool namespace prefixes). Both names are intentional and correct in their respective scopes — directory paths under `.opencode/skills/system-code-graph/` always use the skill slug; MCP-facing identifiers always use `mk-code-index` / `mk_code_index`.

Cross-subsystem consumers use two intentional paths:

| Consumer Type | Integration |
|---------------|-------------|
| system-spec-kit handlers/hooks/session surfaces | Direct in-process imports from `system-code-graph/mcp_server/lib/*` for shared readiness, startup and context helpers. |
| MCP callers, agents and commands | Standalone `mk-code-index` MCP namespace: `mcp__mk_code_index__code_graph_*`, `mcp__mk_code_index__ccc_*` and `mcp__mk_code_index__detect_changes`. |

The shared SQLite file remains the coordination boundary. The scan loop is the single writer.
<!-- /ANCHOR:integration-points -->

---

<!-- ANCHOR:naming-note -->
## 8. NAMING NOTE

### MCP Server Name vs Plugin/Bridge Name

The MCP server name is `mk-code-index` (tool prefix `mcp__mk_code_index__*`). The OpenCode plugin and CLI bridge use `mk-code-graph` / `mk-code-graph-bridge.mjs`. This asymmetry is intentional (ADR-002): the MCP server name is a stable tool contract that would break consumers if renamed, while the plugin and bridge names match the `system-code-graph` skill folder for discoverability and symmetry with the advisor pattern.

### Hook Source Location

SessionStart hooks (`session-prime.ts`, `session-start.ts`) live under `.opencode/skills/system-spec-kit/mcp_server/hooks/` — NOT under `system-code-graph/hooks/`. This is an intentional asymmetry vs the advisor pattern where hooks are skill-owned (ADR-001). The code-graph hook path is referenced by 110+ files, `.claude/settings.local.json` paths, and build config dependencies; migrating would be a high-risk breaking change. Hooks reach code-graph data through the stable boundary at `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`. Migration is deferred to a future packet with build/config redesign scope.
<!-- /ANCHOR:naming-note -->

---

<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

- Shared lifecycle and context docs that stayed in `system-spec-kit`: `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/`
- Extraction history: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/013-system-code-graph-extraction/`
- MCP rename packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/024-mcp-tool-rename-mk-code-index/`
<!-- /ANCHOR:related-resources -->
