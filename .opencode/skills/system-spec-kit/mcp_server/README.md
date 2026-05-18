---
title: "MCP Server: Spec Kit Memory Runtime"
description: "Model Context Protocol server package for memory retrieval, hooks, persistence, and diagnostics."
trigger_phrases:
  - "MCP server"
  - "spec kit memory"
  - "memory_context"
  - "memory_save"
  - "memory_search"
importance_tier: "important"
---

# MCP Server: Spec Kit Memory Runtime

> The local MCP runtime behind Spec Kit's memory. Every save, every search, every session-resume payload flows through this package.

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

### What This Runtime Does

Spec Kit's memory is not a feature flag. It is a running MCP server that you can stop, restart, swap out, or roll back without touching the rest of the framework. That server lives here.

Every `/memory:save` you trigger flows through `context-server.ts`, gets schema-validated, lands in a handler, fans out across 5 retrieval channels (vector, FTS5, BM25, causal graph, degree), and writes into a local SQLite store next to the rest of your repo. Every `/spec_kit:resume` reads from the same store and rebuilds your last session's context. Every prompt-submit hook in Claude, Codex, Gemini, OpenCode, and Copilot calls into this package for its startup brief.

The package is local-first by design. No cloud round-trip. No vendor lock-in. The database, the indexes, the migration state, and the hook payloads all live inside the repository so they travel with the code.

### How You Use It

You rarely touch this server directly. Six surfaces drive it for you:

- **Slash commands.** `/memory:save`, `/memory:search`, `/memory:learn`, `/memory:manage`, `/spec_kit:resume` are the everyday entrypoints.
- **Runtime hooks.** Each supported CLI ships a hook that injects the session brief at startup or prompt-submit time, populated by handlers in `hooks/`.
- **The `mcp_*` tool surface.** Direct MCP callers (other agents, scripts, tests) reach the tools through `mcp__mk_spec_memory__*` after the server registers them.
- **The plugin bridge.** OpenCode routes through a plugin entrypoint that calls into the same handlers.
- **CLI scripts.** Maintenance, evaluation, and migration scripts live under `scripts/`.
- **The compiled artifact.** `dist/context-server.js` is the entry your MCP client config points at after `npm run build`.

### Embedding Provider Cascade

The runtime resolves an embedding provider on every cold start. The default `auto` cascade tries Voyage first when `VOYAGE_API_KEY` is set, then OpenAI when `OPENAI_API_KEY` is set, then a local `llama-cpp` runtime running an `EmbeddingGemma` GGUF, then `hf-local` ONNX as the final fallback. Pin one explicitly with `EMBEDDINGS_PROVIDER` if you want deterministic behavior.

The `llama-cpp` path keeps a separate vector index profile (`llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8`) so its embeddings never mix with `hf-local` results. Install it with:

```bash
bash .opencode/skills/system-spec-kit/scripts/install-llama-cpp.sh
```

### Auto-Migration From `hf-local`

Old `hf-local` installations migrate themselves on first daemon startup. The server detects the largest `context-index__hf-local__*.sqlite`, re-embeds every row into the `llama-cpp` store, validates row counts plus a sample-vector check, deletes the source sqlite (and any `-shm` / `-wal` companions), then drops `.auto-migration-complete.json` into `database/` so the migration never runs twice.

Opt out by setting `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` and running the migration script manually:

```bash
MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false
npx tsx .opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts
```

Use `EMBEDDINGS_PROVIDER=hf-local` directly when a host cannot load the GGUF runtime, or when you want the canonical fallback for a specific run.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    MCP SERVER PACKAGE                            │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ MCP clients  │ ───▶ │ context-server.ts│ ───▶ │ tool dispatcher │
│ hooks / CLI  │      │ transport layer  │      │ schemas + tools │
└──────┬───────┘      └────────┬─────────┘      └────────┬────────┘
       │                       │                         │
       │                       ▼                         ▼
       │              ┌──────────────────┐      ┌─────────────────┐
       └───────────▶  │ hooks + startup  │      │ handlers/       │
                      │ brief builders   │      │ tool execution  │
                      └────────┬─────────┘      └────────┬────────┘
                               │                         │
                               ▼                         ▼
                      ┌──────────────────┐      ┌─────────────────┐
                      │ lib/             │ ───▶ │ database/       │
                      │ search + memory  │      │ SQLite stores   │
                      └────────┬─────────┘      └─────────────────┘

Dependency direction:
transport ───▶ schemas/tools ───▶ handlers ───▶ lib/shared
handlers ───▶ database and filesystem adapters
hooks ───▶ shared payload builders and read-only status helpers
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
mcp_server/
+-- context-server.ts        # MCP transport entrypoint
+-- tool-schemas.ts          # Public tool schema registry
+-- handlers/                # Top-level MCP tool handlers
+-- tools/                   # Tool definition groups and dispatcher helpers
+-- schemas/                 # Zod input schemas
+-- lib/                     # Memory, search, scoring, context, and utility code
+-- hooks/                   # Runtime hook payload builders
+-- formatters/              # Response shaping for MCP payloads
+-- shared/                  # Shared algorithms and cross-package helpers
+-- configs/                 # Runtime tuning data
+-- scripts/                 # Maintenance and evaluation scripts
+-- database/                # Local SQLite databases
+-- tests/                   # Vitest and integration coverage
`-- README.md
```

**Default scope is end-user repo only.** `.opencode/skills/**`, `.opencode/agents/**`, `.opencode/commands/**`, `<active-spec-folder>/**`, and `.opencode/plugins/**` are excluded by default.

Allowed dependency direction:

```text
context-server.ts → tool-schemas.ts / tools/ → handlers/
handlers/ → lib/ / formatters/ / database adapters
lib/ → shared/ / configs/ / database adapters
hooks/ → lib/ read surfaces
tests/ → public handlers, public helpers, and package-local fixtures
```

Disallowed dependency direction:

```text
lib/ → handlers/
shared/ → handlers/ or context-server.ts
database/ → runtime modules
dist/ → source imports
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
mcp_server/
+-- api/                     # API-oriented helpers and route surfaces
+-- configs/                 # Search and cognitive configuration files
+-- core/                    # Core package support modules
+-- database/                # SQLite database files and local state
+-- formatters/              # Tool response formatters
+-- handlers/                # MCP handler modules
+-- hooks/                   # Runtime hook integration code
+-- lib/                     # Search, memory, context, scoring, and utility modules
+-- plugin_bridges/          # Runtime bridge packages
+-- schemas/                 # Runtime input validation schemas
+-- scripts/                 # Package maintenance scripts
+-- shared/                  # Shared code used across server zones
+-- stress_test/             # Stress test support
+-- tests/                   # Package tests
+-- tools/                   # Tool definition and dispatcher modules
+-- utils/                   # General server utilities
+-- context-server.ts        # MCP server entrypoint
+-- startup-checks.ts        # Startup diagnostics
+-- tool-schemas.ts          # MCP tool schema definitions
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `context-server.ts` | Starts the MCP server and wires transport to the dispatcher. |
| `tool-schemas.ts` | Defines the public MCP tool registry and schema metadata. |
| `schemas/tool-input-schemas.ts` | Validates incoming tool arguments with strict schemas. |
| `handlers/index.ts` | Collects handler modules for dispatcher use. |
| `tools/` | Groups tool definitions by domain. |
| `lib/search/` | Owns memory retrieval, vector index access, lexical search, fusion, and reranking. |
| `hooks/` | Builds runtime startup and prompt payloads. |
| `formatters/` | Shapes search and response-profile output for clients. |
| `ENV_REFERENCE.md` | Documents runtime environment variables. |
| `INSTALL_GUIDE.md` | Documents package setup and MCP client registration. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public API | MCP tools are exposed through `tool-schemas.ts`, `tools/`, and `context-server.ts`. |
| Handler logic | Handler modules may call `lib/`, `formatters/`, and database adapters. |
| Domain logic | `lib/` should not import top-level handlers. |
| Storage | SQLite access stays behind package modules that own schema and migration rules. |
| Build output | `dist/` is generated output and should not be a source dependency. |
| Docs | This README documents current code layout only, not release packet history. |

Main tool flow:

```text
╭──────────────────────────────────────────╮
│ MCP client or runtime hook               │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ context-server.ts                         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ schema validation                         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ domain handler                            │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ lib, database                             │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ typed MCP response                        │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `context-server.ts` | Module | Starts the MCP server from source or compiled output. |
| `dist/context-server.js` | Runtime artifact | Compiled MCP server used by client configuration. |
| `tool-schemas.ts` | Module | Source of MCP tool schema definitions. |
| `handlers/*` | Modules | Execute memory, graph, advisor, evaluation, and maintenance tools. |
| `hooks/*` | Modules | Produce startup, prompt, and compact-context payloads for runtime integrations. |
| `npm run build` | Command | Builds TypeScript into `dist/`. |
| `npm test` | Command | Runs package tests through the configured test runner. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from `mcp_server/` unless noted.

```bash
npm run build
npm test
```

Focused documentation checks from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp_server/README.md
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/mcp_server/README.md
```

Expected result: build and tests exit 0, README validation reports no blocking issues, and structure extraction returns a README document profile.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md)
- [`ENV_REFERENCE.md`](./ENV_REFERENCE.md)
- [`configs/README.md`](./configs/README.md)
- [`hooks/README.md`](./hooks/README.md)
- [`lib/search/README.md`](./lib/search/README.md)

<!-- /ANCHOR:related -->
