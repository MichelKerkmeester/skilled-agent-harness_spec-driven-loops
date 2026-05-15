---
title: "MCP Server: Code Graph Runtime"
description: "Model Context Protocol server for the mk-code-index system. Initializes the server, registers tool schemas and dispatches tool calls to code graph handlers."
trigger_phrases:
  - "code graph MCP server"
  - "mk-code-index server"
  - "CODE_GRAPH_TOOL_SCHEMAS"
  - "code graph tool dispatch"
---

# MCP Server: Code Graph Runtime

> MCP server entrypoint for structural code graph indexing, query, context, status and maintenance tools.

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

`mcp_server/` owns the MCP server runtime for the mk-code-index system. It is the main barrel that initializes the Model Context Protocol server, registers tool schemas and dispatches tool calls to the handler subdirectory.

Current state:

- `index.ts` bootstraps the MCP server with stdio transport and writes a readiness marker before serving requests.
- `tool-schemas.ts` defines all code graph tool schemas and re-exports validation utilities from system-spec-kit.
- Tool calls dispatch to handler modules in `tools/` after the code graph database is confirmed ready.
- Compiled output lives in `dist/` and is used by MCP client configurations.

This package communicates via stdio transport. MCP clients register the compiled server executable and call code graph tools through the standard MCP lifecycle.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    MCP SERVER PACKAGE                             │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ MCP clients  │ ───▶ │ index.ts         │ ───▶ │ tool-schemas.ts │
│ stdio / CLI  │      │ server bootstrap │      │ schema registry │
└──────────────┘      └────────┬─────────┘      └────────┬────────┘
                               │                         │
                               ▼                         ▼
                      ┌──────────────────┐      ┌─────────────────┐
                      │ lib/             │      │ tools/          │
                      │ readiness marker │      │ handler dispatch│
                      └────────┬─────────┘      └────────┬────────┘
                               │                         │
                               ▼                         ▼
                      ┌──────────────────┐      ┌─────────────────┐
                      │ database/        │      │ handlers/       │
                      │ code graph DB    │      │ tool execution  │
                      └──────────────────┘      └─────────────────┘

Dependency direction:
index.ts ───▶ tool-schemas.ts ───▶ tools/ ───▶ handlers/
index.ts ───▶ lib/ (readiness marker)
tools/ ───▶ database/ (code graph state)
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
mcp_server/
+-- index.ts              # MCP server entrypoint
+-- tool-schemas.ts       # Tool schema registry and re-exports
+-- core/                 # Configuration constants (DATABASE_DIR)
+-- database/             # SQLite database files
+-- dist/                 # Compiled runtime output
+-- handlers/             # MCP tool handler modules
+-- lib/                  # Search, vector index, session and utility code
+-- plugin_bridges/       # CLI bridges for spec-kit integration
+-- stress_test/          # Stress test support
+-- tests/                # Package tests
+-- tools/                # Tool definition and dispatcher modules
`-- README.md
```

Allowed dependency direction:

```text
index.ts → tool-schemas.ts → tools/ → handlers/
tools/ → handlers/ → lib/ → database/
lib/ → core/
plugin_bridges/ → dist/ (compiled runtime)
```

Disallowed dependency direction:

```text
handlers/ → tools/ (circular)
lib/ → handlers/
database/ → runtime modules
dist/ → source imports
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
mcp_server/
+-- core/                 # Database directory configuration
+-- database/             # SQLite state for code graph index
+-- dist/                 # Compiled JavaScript output
+-- handlers/             # Tool handler modules for scan, query, context and status
+-- lib/                  # Search, vector index, session manager and utilities
+-- plugin_bridges/       # CLI integration bridges
+-- stress_test/          # Load and stress test fixtures
+-- tests/                # Vitest test coverage
+-- tools/                # Tool schema definitions and dispatcher logic
+-- index.ts              # Server bootstrap and MCP initialization
+-- tool-schemas.ts       # Public tool schema registry
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Bootstraps the MCP server with stdio transport, writes a readiness marker and dispatches tool calls. |
| `tool-schemas.ts` | Defines all code graph tool schemas and re-exports validation utilities from system-spec-kit. |
| `index.js` | Compiled server entrypoint used by MCP client configurations. |
| `index.d.ts` | TypeScript declarations for the index module. |
| `tool-schemas.js` | Compiled tool schema definitions for runtime execution. |
| `tool-schemas.d.ts` | TypeScript declarations for the tool schemas module. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public API | `CODE_GRAPH_TOOL_SCHEMAS` and `TOOL_DEFINITIONS` from `tool-schemas.ts` are the public schema surface. |
| Server entrypoint | `index.ts` initializes the MCP server, registers schemas and dispatches to `tools/`. |
| Handler logic | Tool handlers live in `handlers/` and are reachable only through the dispatch path. |
| Storage | Code graph database files live in `database/` and are accessed through handler modules. |
| Build output | `dist/` contains compiled output. Source code does not import from `dist/`. |
| External SDK | Only `@modelcontextprotocol/sdk` imports are allowed at the transport boundary. |

Main tool flow:

```text
╭──────────────────────────────────────────╮
│ MCP client (stdio transport)             │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ index.ts (server bootstrap)              │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ tool-schemas.ts (schema registration)    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ tools/ (dispatcher selects handler)      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ handlers/ (tool execution + database)    │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ typed MCP tool response                  │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `CODE_GRAPH_TOOL_SCHEMAS` | const | Array of tool schema definitions for all code graph MCP tools. |
| `TOOL_DEFINITIONS` | const | Compatibility alias for `CODE_GRAPH_TOOL_SCHEMAS`. |
| `getSchema` | function | Schema retrieval utility re-exported from system-spec-kit. |
| `getToolSchema` | function | Tool-specific schema retrieval utility re-exported from system-spec-kit. |
| `validateToolArgs` | function | Argument validation utility re-exported from system-spec-kit. |
| `mk-code-index` MCP server | CLI | MCP server executable that exposes code graph tools via stdio transport. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root unless noted.

```bash
cd .opencode/skills/system-code-graph && npm test
```

Focused documentation checks:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-code-graph/mcp_server/README.md
```

Expected result: tests exit 0 and README validation reports no blocking issues.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [Skill README](../README.md)
- [Handlers](handlers/README.md)
- [Library](lib/README.md)
- [Tools](tools/README.md)
- [Tests](tests/README.md)

<!-- /ANCHOR:related -->
