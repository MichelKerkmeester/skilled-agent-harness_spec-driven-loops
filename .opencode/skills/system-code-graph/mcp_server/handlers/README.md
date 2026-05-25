---
title: "Code Graph Handlers: MCP Request Adapters"
description: "MCP handler entrypoints for structural code-graph tools, recovery operations, change detection and structural search bridge tools."
trigger_phrases:
  - "code graph handlers"
  - "code_graph handlers"
  - "mk-code-index handlers"
  - "ccc handlers"
  - "detect_changes handler"
---

# Code Graph Handlers: MCP Request Adapters

> Request adaptation layer between the `mk-code-index` tool dispatcher and the core graph library.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`handlers/` owns the MCP request adapters for the standalone code graph package. Each handler accepts parsed tool arguments, calls lower-level behavior in `../lib/` and returns a typed payload with readiness, trust, recovery or bridge metadata.

Current state:

- Structural handlers cover scan, query, status, context, verify and apply-mode recovery.
- `detect_changes` maps unified diffs to affected indexed symbols and refuses stale graph reads.
- structural search bridge handlers cover status, reindex and feedback for the `code_graph_* and detect_changes` tools.
- Read handlers use shared readiness contracts instead of returning silent empty answers.
- Parser quarantine state surfaces through `parserHealth` and `parserSkipList` fields.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
mk-code-index MCP client
  -> ../tools/code-graph-tools.ts
  -> handlers/index.ts
  -> handler file for the requested tool
  -> ../lib graph, readiness, recovery or bridge module
  -> typed MCP payload
```

Dependency direction:

```text
tools registry -> handlers -> ../lib
handlers -> shared schemas and response types
handlers do not import sibling handler internals
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
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
+-- ccc-status.ts        # structural search bridge status
+-- ccc-reindex.ts       # structural search bridge reindex trigger
+-- ccc-feedback.ts      # structural search bridge feedback sink
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
ccc bridge handler -> structural index internals without a library adapter
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
handlers/
+-- apply.ts
+-- ccc-feedback.ts
+-- ccc-reindex.ts
+-- ccc-status.ts
+-- context.ts
+-- detect-changes.ts
+-- index.ts
+-- query.ts
+-- scan.ts
+-- status.ts
+-- verify.ts
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `scan.ts` | Handles `code_graph_scan`, resolves scan scope and updates the SQLite graph through the indexer. |
| `query.ts` | Handles `code_graph_query` structural reads such as outline, calls, imports and blast radius. |
| `status.ts` | Handles `code_graph_status` health probes with freshness, readiness, parse health and graph-quality fields. |
| `context.ts` | Handles `code_graph_context` neighborhoods from manual, graph or structural search seeds. |
| `verify.ts` | Handles `code_graph_verify` checks against the current index. |
| `apply.ts` | Handles `code_graph_apply` verification-gated recovery operations and audit output. |
| `detect-changes.ts` | Handles `detect_changes` by mapping unified diffs to indexed symbols only when graph readiness is fresh. |
| `ccc-status.ts` | Handles `code_graph_status` availability and index-state checks for structural search Code. |
| `ccc-reindex.ts` | Handles `code_graph_scan` incremental or full structural search reindex requests. |
| `ccc-feedback.ts` | Handles `code_graph_verify` quality feedback for structural search search results. |
| `index.ts` | Re-exports handler modules for the tool registry. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Handler files import shared behavior from `../lib/` and schema types from the MCP server. |
| Exports | `index.ts` is the folder entrypoint consumed by the code graph tool registry. |
| Ownership | Handler files own request adaptation, response shaping and recovery metadata. Core graph behavior belongs in `../lib/`. |
| Namespace | Handlers are reached through the standalone `mcp__mk_code_index__*` client namespace. |

Main flow:

```text
MCP client calls code_graph_*, detect_changes or code_graph_* and detect_changes
  -> tools/code-graph-tools.ts validates required arguments
  -> handler adapts args and readiness checks
  -> ../lib executes graph, recovery, bridge or DB work
  -> handler returns typed MCP payload
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
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
| `detect_changes` | MCP tool | Maps a unified diff to affected graph symbols. |
| `code_graph_status`, `code_graph_scan`, `code_graph_verify` | MCP tools | Bridge to structural search Code status, indexing and feedback. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph-query-handler code-graph-context-handler code-graph-scan detect-changes code-graph-apply
```

Expected result: handler, readiness and apply-mode suites pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

| Document | Purpose |
|---|---|
| [../../README.md](../../README.md) | Skill-level overview and operator guide. |
| [../lib/README.md](../lib/README.md) | Core graph library README. |
| [../tools/README.md](../tools/README.md) | MCP dispatch README. |
| [../tests/README.md](../tests/README.md) | Automated test map for handler behavior. |

<!-- /ANCHOR:related -->
