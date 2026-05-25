---
title: "Code Graph Tools: MCP Dispatch"
description: "Dispatch table and exports for mk-code-index MCP tool handlers."
trigger_phrases:
  - "code graph tools"
  - "mk-code-index dispatch"
  - "code graph MCP dispatch"
---

# Code Graph Tools: MCP Dispatch

> Small public dispatch surface for the standalone `mk-code-index` MCP server.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/tools/` owns the MCP tool dispatch surface for code graph operations. It maps incoming tool names to handler functions, performs shallow required-argument checks and keeps the server export small.

Current state:

- Dispatches `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_verify`, `code_graph_apply`, `code_graph_classify_query_intent` and `detect_changes` tools.
- Validates required string arguments before calling handlers that need them.
- Converts handler text payloads into the shared `MCPResponse` shape.
- Returns an `Unknown mk-code-index tool` error for unregistered names.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
tools/
+-- code-graph-tools.ts  # Tool-name set, argument checks and handler dispatch
+-- index.ts             # Public exports and unknown-tool fallback
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `code-graph-tools.ts` | Defines handled tool names, argument checks, handler dispatch and MCP response conversion. |
| `index.ts` | Re-exports the tool dispatch module and provides `dispatch()` for `mcp_server/index.ts`. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | This folder imports handler exports from `../handlers/index.ts` and shared MCP response helpers. |
| Exports | `index.ts` is the public module consumed by `mcp_server/index.ts`. |
| Ownership | Keep handler implementation in `../handlers/`; keep only dispatch and shallow validation here. |
| Namespace | Tool IDs stay stable even though clients reach them through `mcp__mk_code_index__*`. |

Main flow:

```text
mcp_server/index.ts
  -> tools.dispatch(name, args)
  -> code-graph-tools.handleTool(name, args)
  -> ../handlers handler function
  -> MCPResponse payload
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `dispatch(name, args)` | Function | Public dispatcher called by the MCP server. |
| `handleTool(name, args)` | Function | Internal dispatcher that returns `null` for unknown tool names. |
| `TOOL_NAMES` | Set | Active tool-name registry for the dispatch switch. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph-context-handler code-graph-query-handler detect-changes
```

Expected result: TypeScript exits `0`, and dispatch-adjacent handler tests pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 7. RELATED

| Document | Purpose |
|---|---|
| [../../README.md](../../README.md) | Skill-level overview and operator guide. |
| [../handlers/README.md](../handlers/README.md) | Handler implementations reached by dispatch. |
| [../tool-schemas.ts](../tool-schemas.ts) | Tool schema definitions exported to MCP clients. |

<!-- /ANCHOR:related -->
