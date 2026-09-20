---
title: system-code-graph
description: Structural code intelligence that indexes your codebase as a graph and answers "what depends on this" behind a false-safe readiness contract.
trigger_phrases:
  - "code graph"
  - "blast radius"
  - "impact analysis"
  - "structural search"
  - "code_graph_query"
---

# system-code-graph

> Get the structural answer to "what does this code touch" and never act on a stale blast radius.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Blast-radius preflight, diff impact, call-graph questions, structural neighborhoods |
| **Invoke with** | "code graph", "blast radius", "impact analysis" or auto-routing on structural keywords |
| **Works on** | Your codebase parsed through tree-sitter into a SQLite graph of files, symbols, calls and imports |
| **Produces** | Ranked caller sets, affected-symbol maps, token-budgeted graph snapshots or a hard refuse when the index is stale |

---

## 2. OVERVIEW

### Why This Skill Exists

Semantic search tells you what code means. It finds vaguely similar functions through embeddings. It cannot tell you what code touches, which is the question that matters before a refactor: which callers break, which imports lift, which symbols a diff actually moves.

Worse, a structural index that has gone stale and answers anyway is dangerous. An agent acts on a blast-radius set that is missing the caller that breaks. This skill builds the structural graph, answers the connected-code questions and gates every read behind a freshness check that returns an explicit blocked signal rather than a silently incomplete answer.

### What It Does

system-code-graph parses your codebase into a SQLite graph through tree-sitter, then exposes eight MCP tools on the `mk-code-index` server. The tools answer relationship questions (callers, imports, outline, blast radius), map a unified diff to the exact affected symbols and assemble compact graph neighborhoods that fit an LLM window. Every read path passes through a readiness contract. A non-fresh graph returns a blocked payload with a required action. No silent empty arrays, no plausible but wrong answers.

It does not do text search or semantic concept search. Use Grep for exact token matching and domain-term iteration. Use memory_search for spec docs. This skill owns structure.

---

## 3. QUICK START

**Step 1: Check graph health.**

```text
mcp__mk_code_index__code_graph_status({})
```

Returns readiness, trustState, lastScanAt, schemaVersion and graph quality metadata. If readiness is anything other than `fresh`, the read tools will block. Run a scan first.

**Step 2: Build or refresh the graph.**

```text
mcp__mk_code_index__code_graph_scan({ "incremental": true })
```

Walks the workspace, parses changed files through tree-sitter and persists file, symbol and edge rows in SQLite. The response reports files parsed, symbols extracted and edges recorded. Use `incremental: false` after changing the scan scope.

**Step 3: Ask a blast-radius question.**

```text
mcp__mk_code_index__code_graph_query({
  "operation": "blast_radius",
  "subject": "mcp_server/lib/readiness-contract.ts"
})
```

Returns the reverse impact set: every file that imports the subject, transitively, with readiness metadata so you know the answer is grounded. The response lists each affected file with its import chain and distance from the subject.

---

## 4. HOW IT WORKS

### The Structural Index

A tree-sitter parser converts source files into an abstract syntax tree, then walks that AST to extract symbols (functions, classes, interfaces, types), call edges, import edges and definition references. These land in a SQLite database as nodes and edges. The index is file-scoped: each file's symbols and relationships update independently during an incremental scan, so refreshing one changed file does not reparse the whole workspace.

### The Readiness and False-Safe Contract

Freshness has four values: `fresh`, `stale`, `empty` and `error`. A separate trust-state projection (`live`, `stale`, `absent`, `unavailable`) and a gold-verification axis track whether the graph passed its query battery recently.

Every read tool (`code_graph_query`, `code_graph_context`, `code_graph_verify`, `detect_changes`) passes through `ensureCodeGraphReady()` before it answers. When the graph is not fresh, the tool returns `status: "blocked"` with a `requiredAction` field. This is a hard refuse, not a soft degrade. A scope fingerprint (a hash of the scan's include and exclude globs and flags) is compared on every read, and a mismatch blocks the read. You never get a silently empty result from a stale index.

### Blast Radius and Change Detection

Blast radius is the reverse impact set of a symbol or file. `code_graph_query` with `operation: "blast_radius"` follows import edges transitively to find every file that depends on the subject. Multi-hop traversal means you see the full chain, not just direct importers.

Change detection maps a unified diff to the exact affected symbols and files by line-range overlap. `detect_changes` takes the diff text and returns the symbols whose ranges intersect the patch hunks. If the graph is not fresh, it blocks.

### Neighborhood Retrieval

`code_graph_context` builds a token-budgeted graph snapshot around one or more seeds. You supply seeds from manual input or from prior graph lookups. The tool expands outward through call and import edges, packing as much structural context as it can into the token budget. The result fits an LLM window without losing the structural edges that matter.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for system-code-graph when you need to know what a change touches before you land it. Use it for refactor preflight, diff review, incident triage and cold-start file orientation. Skip it for exact text search (use Grep), spec-doc retrieval (use memory_search) or semantic concept search (use Grep with domain terms and iterate, since this skill indexes structure, not embeddings).

### Boundaries

| Surface | Owner | When to reach for it |
|---|---|---|
| Structural relationships | system-code-graph | Callers, imports, blast radius, diff impact |
| Exact text or token | Grep | A known string, a filename, a symbol name |
| Semantic concept | Grep plus iteration | "How does auth work?" with domain terms, since this skill has no embeddings |
| Spec docs and memory | memory_search | Decisions, continuity, resume context |

The skill boots independently and has no runtime dependency on mk-spec-memory. The shared SQLite file is the coordination boundary between in-process imports and external MCP callers.

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns spec folders, memory and continuity. system-code-graph provides structural answers that inform spec work. |
| `sk-code` | Owns code standards and tests. system-code-graph tells sk-code what a change touches before the code gets written. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `status: "blocked"` with `requiredAction: "code_graph_scan"` | Graph is stale, missing or scope-mismatched | Run `code_graph_scan` with the intended scope. Use `incremental: false` for scope changes. |
| `parserHealth: "quarantined"` in status output | One or more files failed parsing and landed in the skip-list | Inspect `parserSkipList.sample` from `code_graph_status`, then repair the file or accept the quarantine. |
| Skill files do not appear in scan results | `.opencode/skills/**` is excluded by default | Set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or pass an explicit `sk-*` list. |
| Unknown MCP tool error mentions `mk-code-index` | The tool name is not registered in the dispatch surface | Add the schema, handler export and dispatch case in one change. |

---

## 7. FAQ

**Q: Why does the readiness contract refuse instead of returning empty?**

A: Returning empty arrays from a stale index trains agents to act on false information. The hard refuse is intentional. A blocked payload with a required action is more useful than a plausible but wrong response, especially during refactors.

**Q: Does this replace Grep?**

A: No. Use Grep for exact text matching. Use code graph tools when relationships, symbols, freshness or impact matter. The two answer different questions.

**Q: Why is the skill folder named `system-code-graph` while the MCP server is `mk-code-index`?**

A: The skill package owns documentation and source layout. The MCP server identity stays stable so external callers do not break. Both names are intentional. Filesystem paths use the skill slug, MCP-facing identifiers use the server name.

**Q: Can I run this without mk-spec-memory installed?**

A: Yes. The standalone MCP server boots independently. It has no runtime dependency on spec-kit memory.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| TypeScript compiles clean | `.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json` exits 0 |
| Code-graph tests pass | `.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph` exits 0 |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-code-graph/README.md --type readme` reports zero issues |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime routing, invariants and tool dispatch contract |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Package topology, dependency direction and design decisions |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Native bootstrap, per-runtime config and verification |
| [`references/runtime/tool_surface.md`](./references/runtime/tool_surface.md) | All eight MCP tools mapped to handler, purpose and token budget |
| [`references/readiness/readiness_and_scope_fingerprint.md`](./references/readiness/readiness_and_scope_fingerprint.md) | Readiness state machine, trust state and scope-fingerprint contract |
| [`references/runtime/naming_conventions.md`](./references/runtime/naming_conventions.md) | Name map across skill folder, MCP server, launcher and hook location |
| [`references/runtime/ownership_boundary.md`](./references/runtime/ownership_boundary.md) | Why some graph-related code stayed in system-spec-kit |
| [`references/config/database_path_policy.md`](./references/config/database_path_policy.md) | Canonical database path and override rules |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md) | Current feature inventory |
| [`manual_testing_playbook/manual_testing_playbook.md`](./manual_testing_playbook/manual_testing_playbook.md) | Operator validation scenario index |
