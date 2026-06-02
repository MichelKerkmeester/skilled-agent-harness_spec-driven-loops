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

---

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

The runtime resolves an embedding provider on every cold start. The default `auto` cascade is **local-first** (ADR-014, 2026-05-19):

1. **Ollama** — probes `/api/tags`; selects the first pulled model in ADR-013 priority order (`nomic-embed-text-v1.5`, `jina-embeddings-v3`, `bge-m3`, `mxbai-embed-large-v1`).
2. **hf-local** — pure-Node `@huggingface/transformers` HTTP model server reachable; defaults to `nomic-ai/nomic-embed-text-v1.5` (same family as the Ollama default, ADR-014).
3. **OpenAI** — `OPENAI_API_KEY` set and `text-embedding-3-small` reachable.
4. **Voyage** — `VOYAGE_API_KEY` set and `voyage-code-3` reachable.

Pin one tier explicitly with `EMBEDDINGS_PROVIDER=ollama|hf-local|openai|voyage` if you want deterministic behavior. Each tier persists its own vector index profile (e.g. `ollama__nomic-embed-text-v1.5__768`) so embeddings from different providers never mix.

**Recommended new-user setup:** install [Ollama](https://ollama.com) and run `ollama pull nomic-embed-text:v1.5`. The cascade auto-detects and persists it as the active embedder — no API keys required.

---

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

---

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

---

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

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `context-server.ts` | Starts the MCP server and wires transport to the dispatcher. |
| `tool-schemas.ts` | Defines the public MCP tool registry and schema metadata. |
| `schemas/tool-input-schemas.ts` | Validates incoming tool arguments with strict schemas. |
| `handlers/index.ts` | Collects handler modules for dispatcher use. |
| `handlers/memory-index.ts` | Implements `memory_index_scan`. Overlapping scan calls return a `coalesced:true` success envelope rather than an error. Rows are committed BM25/FTS5-searchable as pending while vectors drain async. Status is `complete_with_pending_vectors` with a `pendingVectors` count when deferred work remains. |
| `handlers/memory-embedding-reconcile.ts` | Implements `memory_embedding_reconcile`. Dry-run-default maintenance tool that converges `embedding_status` for vector-present stale rows and resets retry counters for genuinely missing-vector rows inside one guarded `BEGIN IMMEDIATE` transaction. |
| `lib/search/vector-index-schema.ts` | Owns `SCHEMA_VERSION` (currently `30`) and the ordered migration map. Migrations 28-30 are additive: v28 active-row partial unique index `idx_memory_logical_key_active_unique` (one non-deprecated row per logical key); v29 checkpoint-v2 metadata columns `snapshot_format`/`snapshot_path`; v30 enrichment marker columns `post_insert_enrichment_*` plus `idx_post_insert_enrichment_incomplete`. |
| `lib/storage/checkpoints.ts` | Checkpoint create/restore. `createCheckpoint()` routes to `createCheckpointV2()`, which writes file snapshots via `VACUUM main INTO` / `VACUUM active_vec INTO`; `restoreCheckpoint()` routes to `restoreCheckpointV2()` for v2 records. On a file-swap restore it drops a `.needs-rebuild` sentinel (`NEEDS_REBUILD_SENTINEL_NAME`) that `repairNeedsRebuildSentinel()` consumes on the next boot to rebuild derived indexes before serving. |
| `handlers/memory-crud-health.ts` | Builds the `memory_health` `index` block: `summary`, `indexedRows`, `pendingVectors`, `retryVectors`, `failedVectors`, `orphanFiles`, `lastScanAgeMs`, `activeScanJob`, `activeEmbedderJob`. |
| `tools/` | Groups tool definitions by domain. |
| `lib/search/` | Owns memory retrieval, vector index access, lexical search, fusion, and reranking. |
| `hooks/` | Builds runtime startup and prompt payloads. |
| `formatters/` | Shapes search and response-profile output for clients. |
| `ENV_REFERENCE.md` | Documents runtime environment variables. |
| `INSTALL_GUIDE.md` | Documents package setup and MCP client registration. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public API | MCP tools are exposed through `tool-schemas.ts`, `tools/`, and `context-server.ts`. |
| Handler logic | Handler modules may call `lib/`, `formatters/`, and database adapters. |
| Domain logic | `lib/` should not import top-level handlers. |
| Storage | SQLite access stays behind package modules that own schema and migration rules. |
| Build output | `dist/` is generated output and should not be a source dependency. |
| Docs | This README documents current code layout and links to packet history when operators need rollout context. |

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

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `context-server.ts` | Module | Starts the MCP server from source or compiled output. |
| `dist/context-server.js` | Runtime artifact | Compiled MCP server used by client configuration. |
| `tool-schemas.ts` | Module | Source of MCP tool schema definitions. |
| `handlers/*` | Modules | Execute memory, graph, advisor, evaluation, and maintenance tools. |
| `hooks/*` | Modules | Produce startup, prompt, and compact-context payloads for runtime integrations. |
| `handlers/memory-embedding-reconcile.ts` | Module | Net-new public `memory_embedding_reconcile` tool: dry-run-default embedding convergence and retry-counter reset under a guarded transaction. |
| `npm run build` | Command | Builds TypeScript into `dist/`. |
| `npm test` | Command | Runs package tests through the configured test runner. |

---

## 8. RUNTIME LIFECYCLE GUARDRAILS

The Spec Kit Memory MCP process participates in the shared native MCP lifecycle guardrails introduced by the orphan MCP leak prevention packet.

| Guardrail | Current behavior |
|---|---|
| Server idle self-exit | `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` defaults to `30`, accepts fractional values for tests, and `0` disables the monitor. Primary stdio input and secondary IPC connect/data/write events refresh activity. |
| Orphan process sweeper | `.opencode/scripts/orphan-mcp-sweeper.sh` scans stale MCP helper classes and stale `/tmp` artifacts. Run `--dry-run --verbose` before any real sweep. |
| Claude Stop cleanup | `.opencode/scripts/claude-session-cleanup.sh` kills only MCP helper descendants of the current Claude Code session and is chained through the repo-local Claude Stop hook. |
| LaunchAgent rollout | `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` is a versioned template only. It is not installed or loaded by default. |
| WAL durability | On close the server runs `PRAGMA wal_checkpoint(TRUNCATE)` on the main DB and the active vector shard. `wal_autocheckpoint=256` is set on both at open. A five-minute periodic checkpoint fires while the server is running. |
| Boot FTS5 integrity check | On startup the server checks the FTS5 shadow index integrity when the `.unclean-shutdown` crash marker is present. A failed check is logged as corrupt. Detection only with no auto-rebuild at this level. |
| RSS-ceiling watchdog | Opt-in (`SPECKIT_LAUNCHER_RSS_SELF_EXIT=1`): on a sustained RSS breach the launcher SIGTERMs the child and exits cleanly so the host can relaunch. Unexpected child exits route through a crash-loop-guarded supervisor with exponential backoff. |
| MCP front-proxy recycle | The launcher fronts the backend with a session proxy (`bridgeStdioThroughSessionProxy` in `.opencode/bin/mk-spec-memory-launcher.cjs`; `.opencode/bin/lib/launcher-session-proxy.cjs`). It keeps one stable client session while the backend recycles in place (RSS restart, rebuild) and transparently replays read and idempotent-write tools across the recycle (`memory_save` is replayable because it relies on primary-row dedup). `SPECKIT_BACKEND_ONLY=1` makes a process run purely as that recyclable backend. |
| Recycle/reconnect error codes | `-32001` `RETRYABLE_RECYCLE_ERROR` (`backend recycled; retry`, `data.retryable: true`) is the **live** recycle signal the proxy emits while the backend restarts — clients retry; it is **not removed** (only the index vector-drain outage path stopped surfacing its own `-32001`). `-32002` `PROTOCOL_MISMATCH_ERROR` (`data.retryable: false`) is the fail-closed protocol break that moves the proxy to terminal CLOSED and forces a fresh client reconnect. |

Canonical operator references:

- [Repo scripts runbook](../../../scripts/README.md)
- [Environment reference](./ENV_REFERENCE.md)
- [Orphan MCP leak prevention implementation summary](../../../specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md)

---

## 9. VALIDATION

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

---

## 10. RELATED

- [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md)
- [`ENV_REFERENCE.md`](./ENV_REFERENCE.md)
- [`../../../scripts/README.md`](../../../scripts/README.md)
- [`configs/README.md`](./configs/README.md)
- [`hooks/README.md`](./hooks/README.md)
- [`lib/search/README.md`](./lib/search/README.md)
