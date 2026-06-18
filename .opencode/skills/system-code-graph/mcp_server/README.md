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

---

## 1. OVERVIEW

`mcp_server/` owns the MCP server runtime for the mk-code-index system. It is the main barrel that initializes the Model Context Protocol server, registers tool schemas, and dispatches tool calls via `tools/` to handler modules.

Current state:

- `index.ts` bootstraps the MCP server with stdio transport and writes a readiness marker before serving requests.
- `index.ts` registers two handlers: a `ListTools` handler backed by `tool-schemas.ts`, and a `CallTool` handler backed by `tools/index.js` (the dispatcher).
- `tool-schemas.ts` defines all code graph tool schemas and re-exports validation utilities from system-spec-kit.
- Tool calls go through `tools/index.js` (the dispatcher) which validates arguments against the published input schemas and routes to handler modules in `handlers/`. Graph readiness is enforced per-handler via `ensureCodeGraphReady` (read-path handlers return `blocked` on a non-fresh graph), not at the dispatch boundary.
- `code-index-cli.ts` (with `code-index-cli-manifest.ts`) is the daemon-backed CLI over the same 8 tools, fronted by the `.opencode/bin/code-index.cjs` shim. It coerces flag values against each tool's input schema, preserves blocked-read rendering (a `status:"blocked"` refusal exits `0` as an actionable answer; `detect_changes` `parse_error` exits `64`) and maps errors to the shared `0`/`1`/`64`/`69`/`75` exit taxonomy. `--warm-only` probes the daemon and exits `75` instead of cold-spawning; otherwise a cold daemon is auto-spawned through `mk-code-index-launcher.cjs`.
- Compiled output lives in `dist/` and is used by MCP client configurations and the CLI shim.

This package communicates via stdio transport for MCP clients and via the daemon IPC socket for the CLI. MCP clients register the compiled server executable and call code graph tools through the standard MCP lifecycle; the MCP registration is unchanged by the CLI (dual-stack, additive).

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    MCP SERVER PACKAGE                             │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐         ┌──────────────────┐
│ MCP clients  │ ──────▶ │ index.ts         │
│ stdio / CLI  │         │ server bootstrap │
└──────────────┘         └────────┬─────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  │ (ListTools)         (CallTool)│
                  ▼                               ▼
       ┌──────────────────┐            ┌─────────────────┐
       │ tool-schemas.ts  │            │ tools/          │
       │ schema registry  │            │ dispatcher      │
       └──────────────────┘            └────────┬────────┘
                                                │
                  ┌─────────────────────────────┼─────────────┐
                  ▼                             ▼             ▼
        ┌──────────────────┐          ┌─────────────────┐    ┌────────────────────┐
        │ lib/             │          │ handlers/       │    │ skill-local DB dir │
        │ readiness marker │          │ tool execution  │    │ mcp_server/database│
        └──────────────────┘          └─────────────────┘    └────────────────────┘

Dependency direction:
index.ts ───▶ tool-schemas.ts (ListTools response)
index.ts ───▶ tools/ ───▶ handlers/ ───▶ lib/ ───▶ core/ ───▶ skill-local DB dir (mcp_server/database)
index.ts ───▶ lib/ (readiness marker before serving)
```

---

## 3. PACKAGE TOPOLOGY

```text
mcp_server/
+-- index.ts                  # MCP server entrypoint
+-- code-index-cli.ts         # Daemon-backed CLI entrypoint (dual-stack front door)
+-- code-index-cli-manifest.ts # CLI tool manifest derived from the schema registry
+-- tool-schemas.ts           # Tool schema registry and re-exports
+-- core/                     # Configuration constants (DATABASE_DIR)
+-- dist/                     # Compiled runtime output
+-- handlers/                 # MCP tool handler modules
+-- lib/                      # Code-graph indexer, DB, lease, seed/context, parser, readiness and startup helpers
+-- plugin_bridges/           # OpenCode plugin bridge (routes through the CLI shim)
+-- stress_test/              # Stress test support
+-- tests/                    # Package tests
+-- tools/                    # Tool definition and dispatcher modules
`-- README.md
```

Allowed dependency direction:

```text
index.ts → tool-schemas.ts → tools/ → handlers/
tools/ → handlers/ → lib/ → core/
lib/ → core/
plugin_bridges/ → .opencode/bin/code-index.cjs → launcher IPC bridge
```

Disallowed dependency direction:

```text
handlers/ → tools/ (circular)
lib/ → handlers/
core/ → handlers/
dist/ → source imports
```

---

## 4. DIRECTORY TREE

```text
mcp_server/
+-- core/                 # Database directory configuration
+-- dist/                 # Compiled JavaScript output
+-- handlers/             # Tool handler modules for scan, query, context and status
+-- lib/                  # Code-graph indexer, DB, lease, seed/context, parser, readiness and startup helpers
+-- plugin_bridges/       # OpenCode plugin bridge (CLI route)
+-- stress_test/          # Load and stress test fixtures
+-- tests/                # Vitest test coverage
+-- tools/                # Tool schema definitions and dispatcher logic
+-- index.ts              # Server bootstrap and MCP initialization
+-- code-index-cli.ts     # Daemon-backed CLI entrypoint
+-- code-index-cli-manifest.ts # CLI tool manifest
+-- tool-schemas.ts       # Public tool schema registry
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Bootstraps the MCP server with stdio transport, writes a readiness marker, registers ListTools (backed by `tool-schemas.ts`) and CallTool (backed by `tools/index.js`). |
| `code-index-cli.ts` | Daemon-backed CLI over the same 8 tools (built to `dist/code-index-cli.js`, fronted by `.opencode/bin/code-index.cjs`). Schema-driven flag coercion, blocked-read rendering preserved (`blocked` exits `0`; `parse_error` exits `64`), warm-only probe support and launcher auto-spawn for cold daemons. |
| `code-index-cli-manifest.ts` | CLI tool manifest asserted at CLI startup so the command list cannot drift from the schema registry. |
| `tool-schemas.ts` | Defines all code graph tool schemas and re-exports validation utilities from system-spec-kit. |
| `plugin_bridges/mk-code-graph-bridge.mjs` | OpenCode plugin bridge for `.opencode/plugins/mk-code-graph.js`. Routes calls through the `code-index.cjs` CLI shim with `SPECKIT_CODE_INDEX_CLI_PROMPT_TIME=1` rather than holding a second MCP connection. |

Build outputs (`index.js`, `index.d.ts`, `tool-schemas.js`, `tool-schemas.d.ts`) are not key files. They are tsc artifacts regenerated by `npm run build` and consumed by MCP client configurations through the compiled entrypoint.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public API | `CODE_GRAPH_TOOL_SCHEMAS` and `TOOL_DEFINITIONS` from `tool-schemas.ts` are the public schema surface. |
| Server entrypoint | `index.ts` initializes the MCP server, registers schemas and dispatches to `tools/`. |
| Handler logic | Tool handlers live in `handlers/` and are reachable only through the dispatch path. |
| Storage | Code graph database files live in `.opencode/skills/system-code-graph/mcp_server/database/` and are accessed through library modules. |
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

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `CODE_GRAPH_TOOL_SCHEMAS` | const | Array of tool schema definitions for all code graph MCP tools. |
| `TOOL_DEFINITIONS` | const | Compatibility alias for `CODE_GRAPH_TOOL_SCHEMAS`. |
| `getSchema` | function | Schema retrieval utility re-exported from system-spec-kit. |
| `getToolSchema` | function | Tool-specific schema retrieval utility re-exported from system-spec-kit. |
| `validateToolArgs` | function | Argument validation utility re-exported from system-spec-kit. |
| `mk-code-index` | MCP server identifier | Server name registered in `index.ts` (`{ name: 'mk-code-index', version: '1.0.0' }`). MCP clients launch the compiled `index.js` and reach the server under this name. |
| `node .opencode/bin/code-index.cjs <tool>` | CLI | Daemon-backed front door for all 8 tools over the same daemon (shim guards dist freshness, exit `69`; `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1` dev override; `list-tools` answers offline). |

---

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

---

## 9. RELATED

- [Skill README](../README.md)
- [Handlers](handlers/README.md)
- [Library](lib/README.md)
- [Tools](tools/README.md)
- [Tests](tests/README.md)
