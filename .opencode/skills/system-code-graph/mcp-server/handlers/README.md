---
title: "Code Graph Handlers: MCP Request Adapters"
description: "MCP handler entrypoints for structural code-graph tools, recovery operations and change detection."
trigger_phrases:
  - "code graph handlers"
  - "code_graph handlers"
  - "mk-code-index handlers"
  - "detect_changes handler"
---

# Code Graph Handlers: MCP Request Adapters

> Request adaptation layer between the `mk-code-index` tool dispatcher and the core graph library.

---

## 1. OVERVIEW

`handlers/` owns the MCP request adapters for the standalone code graph package. Each handler accepts parsed tool arguments, calls lower-level behavior in `../lib/` and returns a typed payload with readiness, trust and recovery metadata.

Current state:

- Structural handlers cover scan, query, status, context, verify and apply-mode recovery.
- `detect_changes` maps unified diffs to affected indexed symbols and refuses stale graph reads.
- `status.ts` / `scan.ts` / `verify.ts` back the `code_graph_status` / `code_graph_scan` / `code_graph_verify` availability, reindex and feedback tools directly against the tree-sitter graph.
- Read handlers use shared readiness contracts instead of returning silent empty answers.
- Parser quarantine state surfaces through `parserHealth` and `parserSkipList` fields.

---

## 2. ARCHITECTURE

```text
mk-code-index MCP client
  -> ../tools/code-graph-tools.ts
  -> handlers/index.ts
  -> handler file for the requested tool
  -> ../lib graph, readiness or recovery module
  -> typed MCP payload
```

Dependency direction:

```text
tools registry -> handlers -> ../lib
handlers -> shared schemas and response types
handlers do not import sibling handler internals
```

---

## 3. PACKAGE TOPOLOGY

```text
handlers/
+-- index.ts             # Barrel exports for the tool registry
+-- scan.ts              # Workspace indexing entrypoint
+-- query.ts             # Structural relationship reads
+-- status.ts            # Graph health and readiness probe
+-- context.ts           # Token-bounded graph neighborhoods
+-- verify.ts            # Gold-query verification battery
+-- apply.ts             # Verification-gated recovery operations
+-- detect-changes.ts    # Unified-diff affected-symbol preflight
+-- classify-query-intent.ts  # Query-intent classification helper
`-- README.md
```

Allowed dependency direction:

```text
../tools/code-graph-tools.ts -> handlers/index.ts -> handler files -> ../lib
handler files -> ../lib/readiness-contract.ts
handler files -> ../lib/query-result-adapter.ts
```

Disallowed dependency direction:

```text
../lib -> handlers
handler file -> another handler file for shared logic
handler file -> graph or index internals without a library adapter
```

---

## 4. DIRECTORY TREE

```text
handlers/
+-- apply.ts
+-- classify-query-intent.ts
+-- context.ts
+-- detect-changes.ts
+-- index.ts
+-- query.ts
+-- scan.ts
+-- status.ts
+-- verify.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `scan.ts` | Handles `code_graph_scan`, resolves scan scope and updates the SQLite graph through the indexer. |
| `query.ts` | Handles `code_graph_query` structural reads such as outline, calls, imports and blast radius. |
| `status.ts` | Handles `code_graph_status` health probes with freshness, readiness, parse health and graph-quality fields. |
| `context.ts` | Handles `code_graph_context` neighborhoods from manual or graph seeds. |
| `verify.ts` | Handles `code_graph_verify` checks against the current index. |
| `apply.ts` | Handles `code_graph_apply` verification-gated recovery operations and audit output. |
| `detect-changes.ts` | Handles `detect_changes` by mapping unified diffs to indexed symbols only when graph readiness is fresh. |
| `classify-query-intent.ts` | Classifies a query into a structural intent to shape downstream graph reads. |
| `index.ts` | Re-exports handler modules for the tool registry. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Handler files import shared behavior from `../lib/` and schema types from the MCP server. |
| Exports | `index.ts` is the folder entrypoint consumed by the code graph tool registry. |
| Ownership | Handler files own request adaptation, response shaping and recovery metadata. Core graph behavior belongs in `../lib/`. |
| Namespace | Handlers are reached through the standalone `mcp__mk_code_index__*` client namespace. |

Main flow:

```text
MCP client calls code_graph_* or detect_changes
  -> tools/code-graph-tools.ts validates required arguments
  -> handler adapts args and readiness checks
  -> ../lib executes graph, recovery or DB work
  -> handler returns typed MCP payload
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `index.ts` | Module | Re-exports all handler functions for registration. |
| `code_graph_scan` | MCP tool | Builds or refreshes the structural graph. |
| `code_graph_query` | MCP tool | Reads graph relationships and symbol outlines. |
| `code_graph_status` | MCP tool | Reports graph health and trust metadata. |
| `code_graph_context` | MCP tool | Builds compact graph context from seeds. |
| `code_graph_verify` | MCP tool | Runs graph verification checks. |
| `code_graph_apply` | MCP tool | Runs guarded graph recovery operations. |
| `code_graph_classify_query_intent` | MCP tool | Classifies a query as structural, semantic or hybrid. |
| `detect_changes` | MCP tool | Maps a unified diff to affected graph symbols. |

---

## 8. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph-query-handler code-graph-context-handler code-graph-scan detect-changes code-graph-apply
```

Expected result: handler, readiness and apply-mode suites pass.

---

## 9. RELATED

| Document | Purpose |
|---|---|
| [../../README.md](../../README.md) | Skill-level overview and operator guide. |
| [../lib/README.md](../lib/README.md) | Core graph library README. |
| [../tools/README.md](../tools/README.md) | MCP dispatch README. |
| [../tests/README.md](../tests/README.md) | Automated test map for handler behavior. |
