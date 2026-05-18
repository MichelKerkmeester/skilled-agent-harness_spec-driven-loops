---
name: system-code-graph
description: "Structural code indexing and mk-code-index MCP workflows for graph readiness, impact queries, context retrieval and CCC checks."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.3.2
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

### Primary Detection Signal

This skill is **tool-keyed**, not folder-keyed. The router picks a tool, not a `references/<key>/` subfolder. Two signals drive the choice:

1. **Operator-named tool** wins. If the prompt names a `code_graph_*`, `detect_changes`, or `ccc_*` tool, route there directly.
2. **Classifier-derived intent** otherwise. Call `code_graph_classify_query_intent` to map natural language to one of `{structural, semantic, hybrid}`. Structural → this skill. Semantic → `mcp-coco-index`. Hybrid → use both: CocoIndex seeds → `code_graph_context`.

### Phase Detection

```text
QUERY ARRIVES
   |
   +- STEP 0: Operator named a tool? -- YES --> Route to that tool
   |                                |
   |                                NO
   |                                v
   +- STEP 1: Classify intent (code_graph_classify_query_intent)
   |          structural / semantic / hybrid
   |
   +- STEP 2: Check readiness (code_graph_status)
   |          fresh? -- NO --> code_graph_scan, then retry
   |          fresh? -- YES --> proceed
   |
   +- STEP 3: Pick tool from Resource Domains table below
   +- STEP 4: Verify before completion (code_graph_verify on critical paths)
```

### Resource Domains

The router selects from these tool intents. The table is the authoritative map; `mcp_server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` is the source of truth for the schemas themselves.

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
| Bridge CocoIndex status, reindexing and feedback | `mcp__mk_code_index__ccc_status`, `mcp__mk_code_index__ccc_reindex`, `mcp__mk_code_index__ccc_feedback` | `references/ccc-bridge-integration.md` |
| Review doctor code-graph apply policy | `/doctor code-graph` | `feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` |

The standalone MCP server name is `mk-code-index`. Tool IDs stay stable as `code_graph_*`, `detect_changes`, and `ccc_*`.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation (after status check) | `references/code-graph-readiness-check.md`, `references/tool-surface.md` |
| CONDITIONAL | On scope-change, scan-related, or readiness-blocked queries | `references/readiness-and-scope-fingerprint.md`, `references/database-path-policy.md` |
| ON_DEMAND | Cross-skill questions, naming questions, ownership questions | `references/naming-conventions.md`, `references/ownership-boundary.md`, `references/ccc-bridge-integration.md` |

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

> **Router authority:** tool selection is driven by `mcp_server/tool-schemas.ts` (`CODE_GRAPH_TOOL_SCHEMAS`) and `mcp_server/lib/query-intent-classifier.ts`. The table above is documentation; the schema array is canonical.

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

### ALWAYS

1. **ALWAYS register MCP tools under the standalone `mk-code-index` server.** Tool IDs (`code_graph_*`, `detect_changes`, `ccc_*`) are the stable surface contract.
2. **ALWAYS use the `mcp__mk_code_index__*` namespace** for MCP-side tool calls. Direct library consumers in `system-spec-kit` handlers and hooks use in-process imports through `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`.
3. **ALWAYS check readiness before answering structural questions.** `code_graph_status` first; if `readiness !== "fresh"`, return the `blocked` payload from the tool rather than a stale result.
4. **ALWAYS treat `mcp_server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` as the authoritative tool list.** Docs are documentation; the schema array is canonical.

### NEVER

1. **NEVER move shared lifecycle, memory, or hook surfaces into `system-code-graph`.** Those belong in `system-spec-kit`. Only code-graph-owned docs and source live here.
2. **NEVER return a stale, empty, or scope-mismatched graph answer as if it were authoritative.** Read-path tools (`code_graph_query`, `code_graph_context`, `detect_changes`) refuse with `status: "blocked"` instead of false-safe empty results — preserve that contract end-to-end.
3. **NEVER fall back to text search when MCP is unavailable.** Structural queries must report the unavailable state and stop. Ambiguous text-search results mislead more than they help.
4. **NEVER hardcode tool lists or namespace prefixes in router or caller code.** Consult `tool-schemas.ts` at runtime; rely on the `mcp__mk_code_index__` prefix from MCP discovery.

### ESCALATE IF

1. **ESCALATE IF the scope fingerprint differs from the stored baseline** and the requested scan would replace an established graph without operator opt-in. Surface the fingerprint delta and ask for confirmation (`forceScopeChange: true`).
2. **ESCALATE IF readiness is `blocked` and the required action is destructive** (zero-node reset, full re-scan on a populated graph). Ask before issuing the destructive flag.
3. **ESCALATE IF the classifier returns low-confidence intent** on a high-stakes query (refactor preflight, blast-radius audit). Request one concrete file path, symbol, or error message before guessing.
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

Cross-subsystem consumers use two intentional paths:

| Consumer Type | Integration |
|---------------|-------------|
| `system-spec-kit` handlers / hooks / session surfaces | Direct in-process imports from `system-code-graph/mcp_server/lib/*` for shared readiness, startup, and context helpers via `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`. |
| MCP callers (agents, commands, runtimes) | Standalone `mk-code-index` MCP namespace: `mcp__mk_code_index__code_graph_*`, `mcp__mk_code_index__ccc_*`, and `mcp__mk_code_index__detect_changes`. |

The shared SQLite file at `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` remains the coordination boundary. The scan loop is the single writer.

**Naming asymmetries.** Five identifiers refer to this skill across runtime layers — skill folder slug (`system-code-graph`), MCP server name (`mk-code-index`), MCP config key (`mk_code_index`), launcher / plugin file names, and the shared data directory. Each is correct in its own scope. See [`references/naming-conventions.md`](references/naming-conventions.md) for the full map plus the rationale for the hook-location asymmetry (hooks remain under `system-spec-kit/mcp_server/hooks/`).
<!-- /ANCHOR:integration-points -->

---

<!-- ANCHOR:related-resources -->
## 8. REFERENCES AND RELATED RESOURCES

### Core references (this skill)

- [`references/tool-surface.md`](references/tool-surface.md) — 11 MCP tools mapped to handler files, primary purpose, and preconditions.
- [`references/readiness-and-scope-fingerprint.md`](references/readiness-and-scope-fingerprint.md) — readiness state machine (`fresh`/`stale`/`blocked`/`empty`/`absent`) and the scan-scope fingerprint contract.
- [`references/code-graph-readiness-check.md`](references/code-graph-readiness-check.md) — `ensureCodeGraphReady()` gates, preconditions, recovery procedures.
- [`references/ccc-bridge-integration.md`](references/ccc-bridge-integration.md) — when to use `ccc_status` / `ccc_reindex` / `ccc_feedback` and how they coordinate with CocoIndex.
- [`references/database-path-policy.md`](references/database-path-policy.md) — canonical database path policy and override rules.
- [`references/naming-conventions.md`](references/naming-conventions.md) — name map across skill folder, MCP server, launcher, plugin bridge, and hook location.
- [`references/ownership-boundary.md`](references/ownership-boundary.md) — what stays in `system-spec-kit` vs `system-code-graph` after extraction.

### Cross-skill references

- Shared lifecycle and context docs that stayed in `system-spec-kit`: `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/`
- Extraction history: internal migration notes
- Latest uplift context: internal implementation notes
<!-- /ANCHOR:related-resources -->
