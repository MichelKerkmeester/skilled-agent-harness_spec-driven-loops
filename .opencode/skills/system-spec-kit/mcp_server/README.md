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

Every `/memory:save` you trigger flows through `context-server.ts`, gets schema-validated, lands in a handler, fans out across 5 retrieval channels (vector, FTS5, BM25, causal graph, degree), and writes into a local SQLite store next to the rest of your repo. Every `/speckit:resume` reads from the same store and rebuilds your last session's context. Claude and OpenCode prompt-submit shims delegate advisor delivery to `system-skill-advisor`, startup context is handled by session-start/session-prime paths, and OpenCode uses plugin bridges rather than an `mcp_server` prompt-submit hook.

The package is local-first by design. No cloud round-trip. No vendor lock-in. The database, the indexes, the migration state, and the hook payloads all live inside the repository so they travel with the code.

### How You Use It

You rarely touch this server directly. Seven surfaces drive it for you:

- **Slash commands.** `/memory:save`, `/memory:search`, `/memory:learn`, `/memory:manage`, `/speckit:resume` are the everyday entrypoints.
- **Runtime hooks.** Each supported CLI ships a hook that injects the session brief at startup or prompt-submit time, populated by handlers in `hooks/`. The Claude and OpenCode adapters carry a warm-only CLI fallback (`hooks/spec-memory-cli-fallback.ts`, `hooks/code-index-cli-fallback.ts`) that recovers a dropped MCP transport through the daemon CLI without ever cold-spawning at prompt time.
- **The `mcp_*` tool surface.** Direct MCP callers (other agents, scripts, tests) reach the tools through `mcp__mk_spec_memory__*` after the server registers them.
- **The daemon-backed CLI.** `node .opencode/bin/spec-memory.cjs <tool>` fronts all 41 tools over the daemon's IPC socket — the dual-stack surface for hooks, cron, CI and transport-down recovery. Exit taxonomy `0`/`1`/`64`/`69`/`75`; `--warm-only` probes instead of spawning; `list-tools` answers offline. Source: `spec-memory-cli.ts`.
- **The plugin bridge.** The OpenCode plugin (`.opencode/plugins/mk-spec-memory.js`) routes through `plugin_bridges/mk-spec-memory-bridge.mjs` using CLI transport only — it shells the same `spec-memory.cjs` front door rather than holding a second MCP connection.
- **CLI scripts.** Maintenance, evaluation, and migration scripts live under `scripts/`.
- **The compiled backend artifact.** `dist/context-server.js` is built by `npm run build` and spawned by the launcher. MCP client configs point at `.opencode/bin/mk-spec-memory-launcher.cjs`, which supervises the backend and owns the client-facing transport. The MCP registrations themselves are unchanged by the CLI: dual-stack means the CLI is additive.

### Embedding Provider Cascade

The runtime resolves an embedding provider on every cold start. The default `auto` cascade is **local-first** (ADR-014, 2026-05-19):

1. **Ollama** — probes `/api/tags`; selects `nomic-embed-text-v1.5`, the only Ollama MANIFESTS entry.
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
+-- spec-memory-cli.ts       # Daemon-backed CLI entrypoint (dual-stack front door)
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

**Default scan scope includes Spec Kit docs.** `memory_index_scan` defaults `includeConstitutional=true` for `.opencode/skills/*/constitutional/` and `includeSpecDocs=true` for `.opencode/specs/` documents, with `background:true` jobs polled by `memory_index_scan_status` and stopped by `memory_index_scan_cancel`.

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
+-- spec-memory-cli.ts       # Daemon-backed CLI entrypoint
+-- startup-checks.ts        # Startup diagnostics
+-- tool-schemas.ts          # MCP tool schema definitions
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `context-server.ts` | Starts the MCP server, wires transport to the dispatcher, and enforces response token budgets. If first-call `meta.sessionPriming` pushes an envelope over budget, the server slims that metadata before dropping result rows. |
| `spec-memory-cli.ts` | Daemon-backed CLI over the same 41 tools (built to `dist/spec-memory-cli.js`, fronted by `.opencode/bin/spec-memory.cjs`). Parses per-tool flags against `tool-schemas.ts`, probes the daemon (warm-only honors exit `75`), auto-spawns the launcher otherwise, and maps errors to the `0`/`1`/`64`/`69`/`75` exit taxonomy. |
| `hooks/spec-memory-cli-fallback.ts` | Shared hook helper for bounded warm-only CLI recovery: probes the IPC socket first and calls the CLI only when the daemon is already warm, failing open otherwise. |
| `hooks/code-index-cli-fallback.ts` | Same warm-only fallback contract for the mk-code-index CLI, used by the Claude/OpenCode hook adapters. |
| `tool-schemas.ts` | Defines the public MCP tool registry and schema metadata. |
| `schemas/tool-input-schemas.ts` | Validates incoming tool arguments with strict schemas. |
| `handlers/index.ts` | Collects handler modules for dispatcher use. |
| `handlers/memory-index.ts` | Implements `memory_index_scan`. Overlapping scan calls return a `coalesced:true` success envelope rather than an error. Rows are committed BM25/FTS5-searchable as pending while vectors drain async. Status is `complete_with_pending_vectors` with a `pendingVectors` count when deferred work remains. |
| `handlers/memory-embedding-reconcile.ts` | Implements `memory_embedding_reconcile`. Dry-run-default maintenance tool that converges `embedding_status` for vector-present stale rows and resets retry counters for genuinely missing-vector rows inside one guarded `BEGIN IMMEDIATE` transaction. |
| `lib/search/vector-index-schema.ts` | Owns `SCHEMA_VERSION` (currently `37`) and the ordered migration map. Recent additive migrations cover active-row uniqueness, checkpoint-v2 metadata, enrichment markers, retention and deletion metadata, and retrieval/continuity support tables and indexes. |
| `lib/storage/checkpoints.ts` | Checkpoint create/restore. `createCheckpoint()` routes to `createCheckpointV2()`, which writes file snapshots via `VACUUM main INTO` / `VACUUM active_vec INTO`; `restoreCheckpoint()` routes to `restoreCheckpointV2()` for v2 records. On a file-swap restore it drops a `.needs-rebuild` sentinel (`NEEDS_REBUILD_SENTINEL_NAME`) that `repairNeedsRebuildSentinel()` consumes on the next boot to rebuild derived indexes before serving. |
| `handlers/memory-crud-health.ts` | Builds the `memory_health` `index` block: `summary`, `indexedRows`, `pendingVectors`, `retryVectors`, `failedVectors`, `orphanFiles`, `lastScanAgeMs`, `activeScanJob`, `activeEmbedderJob`. |
| `tools/` | Groups tool definitions by domain. |
| `lib/search/` | Owns memory retrieval, vector index access, lexical search, fusion, and reranking. |
| `hooks/` | Builds runtime startup and prompt payloads. |
| `formatters/` | Shapes search and response-profile output for clients. |
| `ENV_REFERENCE.md` | Documents runtime environment variables. |
| `INSTALL-GUIDE.md` | Documents package setup and MCP client registration. |

Canonical spec-document discovery includes `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `research/research.md`, `resource-map.md`, `handover.md`, root-level `review-report.md`, `<packet>/review/review-report.md`, and `description.json`. `graph-metadata.json` is discovered through the graph-metadata path gate, including metadata backfilled under `<packet>/iterations/`; `research/iterations/` and `review/iterations/` markdown remain working artifacts rather than canonical spec docs.

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

`session_resume` has a transport-bound session model. When a caller supplies `args.sessionId` and the transport has a caller-bound session ID, strict mode rejects mismatches; permissive mode logs and continues for rollout. Stdio callers may have no caller-bound session ID, so the handler accepts an explicit session ID in that transport shape instead of routing through the general trusted-session resolver. Use `MCP_SESSION_RESUME_AUTH_MODE` only to control strict-vs-permissive mismatch handling.

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
| `dist/context-server.js` | Runtime artifact | Compiled backend server spawned and supervised by the launcher. Client configuration points at `.opencode/bin/mk-spec-memory-launcher.cjs`. |
| `node .opencode/bin/spec-memory.cjs <tool>` | CLI | Daemon-backed front door for all 41 tools (shim guards dist freshness, exit `69`; runs `dist/spec-memory-cli.js`). |
| `tool-schemas.ts` | Module | Source of MCP tool schema definitions. |
| `handlers/*` | Modules | Execute memory, graph, advisor, evaluation, and maintenance tools. |
| `hooks/*` | Modules | Produce startup, prompt, and compact-context payloads for runtime integrations. |
| `handlers/memory-embedding-reconcile.ts` | Module | Net-new public `memory_embedding_reconcile` tool: dry-run-default embedding convergence and retry-counter reset under a guarded transaction. |
| `npm run build` | Command | Builds TypeScript into `dist/`. |
| `npm test` | Command | Runs package tests through the configured runner, including `test:spec-validation` on the tracked validation suites. |

---

## 8. RUNTIME LIFECYCLE GUARDRAILS

The Spec Kit Memory MCP process participates in the shared native MCP lifecycle guardrails introduced by the orphan MCP leak prevention packet.

| Guardrail | Current behavior |
|---|---|
| Server idle self-exit | `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` defaults to `30`, accepts fractional values for tests, and `0` disables the monitor. Primary stdio input and secondary IPC connect/data/write events refresh activity. |
| Orphan process sweeper | `.opencode/scripts/orphan-mcp-sweeper.sh` scans stale MCP helper classes and stale `/tmp` artifacts. Run `--dry-run --verbose` before any real sweep. |
| Claude Stop cleanup | `.opencode/scripts/claude-session-cleanup.sh` kills only MCP helper descendants of the current Claude Code session — it requires explicit session identity and re-proves each candidate's ancestry at kill time — and is chained through the repo-local Claude Stop hook. |
| LaunchAgent rollout | `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` is a versioned template only. It is not installed or loaded by default. |
| WAL durability | On close the server runs `PRAGMA wal_checkpoint(TRUNCATE)` on the main DB and the active vector shard. `wal_autocheckpoint=256` is set on both at open. A five-minute periodic checkpoint fires while the server is running. |
| Boot FTS5 integrity check | On startup the server checks the FTS5 shadow index integrity when the `.unclean-shutdown` crash marker is present. By default it attempts a non-destructive FTS shadow rebuild and re-verifies before serving. Set `SPECKIT_BOOT_FTS_AUTOHEAL=0` for detect-only mode. |
| Post-crash whole-DB integrity gate | When the `.unclean-shutdown` marker is present at open, the store also runs `PRAGMA quick_check` against the main database. On failure it writes the checkpoint `.needs-rebuild` sentinel and refuses to serve rather than expose a corrupted index; clean shutdowns skip the probe entirely. |
| RSS-ceiling watchdog | Opt-in (`SPECKIT_LAUNCHER_RSS_SELF_EXIT=1`): on a sustained RSS breach the launcher SIGTERMs the child and exits cleanly so the host can relaunch. Unexpected child exits route through a crash-loop-guarded supervisor with exponential backoff. |
| MCP front-proxy recycle | The launcher fronts the backend with a session proxy (`bridgeStdioThroughSessionProxy` in `.opencode/bin/mk-spec-memory-launcher.cjs`; `.opencode/bin/lib/launcher-session-proxy.cjs`). It keeps one stable client session while the backend recycles in place (RSS restart, rebuild) and transparently replays read and idempotent-write tools across the recycle (`memory_save` is replayable because it relies on primary-row dedup). Known gap: a replay after the primary insert but before secondary-index writes can append duplicate secondary-index rows because that path is not yet keyed by an idempotency token. `SPECKIT_BACKEND_ONLY=1` makes a process run purely as that recyclable backend. |
| Recycle/reconnect error codes | `-32001` `RETRYABLE_RECYCLE_ERROR` (`backend recycled; retry`, `data.retryable: true`) is the **live** recycle signal the proxy emits while the backend restarts — clients retry; it is **not removed** (only the index vector-drain outage path stopped surfacing its own `-32001`). `-32002` `PROTOCOL_MISMATCH_ERROR` (`data.retryable: false`) is the fail-closed protocol break that moves the proxy to terminal CLOSED and forces a fresh client reconnect. |
| Rebuild + recycle helper | `bash .opencode/skills/system-spec-kit/scripts/deploy-mcp.sh` is the canonical helper to rebuild every MCP server `dist/` (mk-spec-memory + `@spec-kit/shared`, code-graph, advisor) after a source change. `dist/` is gitignored, so rebuild after pulling source changes. Passing `--recycle` drives the *MCP front-proxy recycle* row above for mk-spec-memory (transparent); code-graph and advisor are not SIGTERM-recycled (their launchers exit, so fresh dist loads on next start). Launcher `.cjs` changes need a FRESH session and cannot be picked up by a recycle. |
| Persistent launcher log (018) | `log()` also appends a timestamped, pid-stamped line to a bounded, best-effort durable file so daemon flaps and owner-disposal races are attributable from disk, not just from stderr the host may drop. `SPECKIT_LAUNCHER_LOG` (default on; `_PATH` / `_MAX_BYTES` override) gates it; the file rotates to one previous generation at the cap. |
| Lease-probe reap hardening (019) | A sibling reaps the lease owner and respawns only after N CONSECUTIVE deep liveness-probe failures (`SPECKIT_LEASE_PROBE_RETRIES`, default 1), so a busy-but-alive owner (mid-FTS-merge) is not false-reaped into a duplicate daemon. Any 'alive' probe short-circuits to a bridge; the default budget stays under the 6999 ms probe ceiling. |
| mk-code-index reconnecting proxy (020) | mk-code-index now bridges secondary clients through the SAME session proxy as mk-spec-memory (`bridgeStdioThroughSessionProxy` in `.opencode/bin/mk-code-index-launcher.cjs`), so a code-index owner change reattaches and replays in-flight read queries instead of a hard `Connection closed`. This is the *client-survival* path and is distinct from the deploy `--recycle` row above (which still exits the code-graph launcher for a fresh dist). Mutating tools (`code_graph_scan`/`apply`/`verify`) are never replayed. |
| Orphan-sweep Stop-hook (021) | `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` (off [default] / dry-run / live): when set, the Stop hook's no-session-pid branch delegates to the orphan-only sweeper instead of a no-op, reaping ownerless daemons without ever guessing the session pid (so it cannot kill a live session). |
| Daemon re-election (default-on) | `SPECKIT_DAEMON_REELECTION` (on by default in the launcher code; set `0` or `off` to revert) spawns the daemon detached and releases (not kills) it on owner shutdown, so a live secondary keeps MCP transport. A fresh session that finds the released daemon under a stale lease adopts it through the bridge when the recorded child is alive and bridgeable; reap + respawn runs only when that daemon is dead or unbridgeable, preserving the single-writer WAL invariant. Covered by `stress_test/durability/daemon-reelection-release-integration.vitest.ts` (decision) and `daemon-reelection-adoption-live.vitest.ts` (live two-session). |

Canonical operator references:

- [Repo scripts runbook](../../../scripts/README.md)
- [Environment reference](./ENV_REFERENCE.md)
- [Orphan MCP leak prevention implementation summary](../../../specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md)

---

## 9. VALIDATION

Run from `mcp_server/` unless noted.

```bash
npm run build
npm test
npm run test:spec-validation
```

Focused documentation checks from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp_server/README.md
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/mcp_server/README.md
```

Expected result: build and tests exit 0, README validation reports no blocking issues, and structure extraction returns a README document profile.

---

## 10. RELATED

- [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md)
- [`ENV_REFERENCE.md`](./ENV_REFERENCE.md)
- [`../../../scripts/README.md`](../../../scripts/README.md)
- [`configs/README.md`](./configs/README.md)
- [`hooks/README.md`](./hooks/README.md)
- [`lib/search/README.md`](./lib/search/README.md)
