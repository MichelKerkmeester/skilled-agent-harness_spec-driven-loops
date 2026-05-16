---
name: system-code-graph
description: "Structural code indexing and mk-code-index MCP workflows for graph readiness, impact queries, context retrieval and CCC checks."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.3.1
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-system-code-graph-uplift/001-skill-md-and-references-polish"
    last_updated_at: "2026-05-16T10:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Added why-structural-matters primer, glossary, situational triggers; fixed weak boundary explanation, weak reference notation, HVR violations"
    next_safe_action: "Proceed to Batch 2 INSTALL_GUIDE drift fixes"
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

## Why structural matters

Semantic search answers "what does this code mean." Structural indexing answers "what does this code touch." When you change a function signature, semantic search finds vaguely similar functions across the codebase. Structural indexing tells you exactly which callers break, which imports lift, and which symbols a diff actually moves. Both surfaces matter at different moments, semantic for discovery and structural for blast radius.

This skill ships the structural half: a tree-sitter parser, a SQLite graph, a readiness contract that refuses stale answers, and an MCP surface that other agents can call. Use it whenever the question turns from "what is similar" to "what is connected."

## Glossary

- **Structural indexing.** AST-derived graph of files, symbols, calls, imports, and definitions. Distinct from text matching and from embedding-based semantic search.
- **Semantic search.** Vector-embedding lookup over code (CocoIndex). Surfaces conceptually related code without requiring known names.
- **Blast radius.** Reverse impact set of a symbol or file. Answers "what depends on this if I change it."
- **Readiness.** Whether the graph reflects current workspace state. States are `fresh`, `stale`, `empty`, `error`, `absent`. Read paths refuse to answer on non-fresh states.
- **Trust state.** Companion signal to readiness. Marks whether the graph passed its gold-query battery recently.
- **Scope fingerprint.** Hash of the scan inputs (include globs, env flags). When the requested scope diverges from the stored fingerprint, status returns `blocked` and recommends a full rescan.
- **False-safe.** A guarantee that the read path returns an explicit `blocked` payload rather than a silently-empty answer when the graph is not trustworthy. Prevents agents from acting on partial structural state.

## Situational triggers

Reach for this skill in these scenarios:

1. **Before a refactor that touches a critical utility.** Run `code_graph_query` with `operation:"blast_radius"` against the symbol. Surfaces every caller before edits land.
2. **After receiving a code-review patch from a non-local agent.** Run `detect_changes` with the unified diff. Returns the precise set of affected symbols and files so impact analysis stays grounded.
3. **When investigating an incident that touches multiple files.** Pull a compact graph neighborhood with `code_graph_context` around the seed file. Returns a token-budgeted snapshot that fits an LLM window without losing structural edges.

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
| Classify natural-language queries into structural/semantic/hybrid intent | `mcp__mk_code_index__code_graph_classify_query_intent` | `mcp_server/lib/query-intent-classifier.ts` |
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

Read paths call `ensureCodeGraphReady()` before answering any structural query. The check enforces the false-safe contract: stale, empty, or scope-mismatched graphs return `blocked` with an explicit `requiredAction` rather than empty results. Manual maintenance tools run explicit scans, verification, status checks, and CCC bridge operations against the same readiness gate.

The deep-loop coverage graph tools remain in `system-spec-kit` because the research and review loop owns its state machine and the lifecycle of iteration packets. Code-graph stays focused on the structural index for everything else.
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

**Naming convention.** The skill directory and SKILL.md `name` field use `system-code-graph` (filesystem slug). The MCP server name and client namespace use `mk-code-index` (runtime identity, namespaced as `mcp__mk_code_index__*` because MCP converts hyphens to underscores in tool namespace prefixes). Both names are intentional and correct in their respective scopes. Directory paths under `.opencode/skills/system-code-graph/` always use the skill slug. MCP-facing identifiers always use `mk-code-index` or `mk_code_index`.

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

SessionStart hooks (`session-prime.ts`, `session-start.ts`) live under `.opencode/skills/system-spec-kit/mcp_server/hooks/`, NOT under `system-code-graph/hooks/`. This is an intentional asymmetry vs the advisor pattern where hooks are skill-owned (ADR-001). The code-graph hook path is referenced by 110+ files, `.claude/settings.local.json` paths, and build config dependencies. Migrating would be a high-risk breaking change. Hooks reach code-graph data through the stable boundary at `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`. Migration is deferred to a future packet with build/config redesign scope.
<!-- /ANCHOR:naming-note -->

---

<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

- Shared lifecycle and context docs that stayed in `system-spec-kit`: `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/`
- Extraction history: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/013-system-code-graph-extraction/`
- MCP rename packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/024-mcp-tool-rename-mk-code-index/`
<!-- /ANCHOR:related-resources -->
