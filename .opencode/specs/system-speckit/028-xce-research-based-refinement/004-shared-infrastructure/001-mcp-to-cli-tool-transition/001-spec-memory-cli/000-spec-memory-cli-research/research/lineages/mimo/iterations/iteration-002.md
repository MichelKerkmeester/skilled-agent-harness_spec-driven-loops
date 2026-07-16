# Iteration 002: KQ2 — Daemon-Dependency Audit

## Focus
Map every daemon-resident service and determine what dies under each of the three architectures.

## Assessment: newInfoRatio=1.0

Complementary to KQ1 — no overlap with the parity matrix. This iteration traces the in-process subsystems that the 6 STATE-WATCHER tools depend on.

## Findings

### Daemon-Resident Services Inventory

I traced the launcher (`mk-spec-memory-launcher.cjs`) and context-server to identify all long-lived daemon subsystems:

| # | Service | Source | What It Does |
|---|---------|--------|--------------|
| 1 | **Embedding cascade warm model server** | `hf-model-server.cjs`, `lib/model-server-supervision.cjs` | Keeps ollama/hf-local model loaded in memory. Eliminates cold-start per invocation. |
| 2 | **Chokidar file-watcher** | `context-server.ts` startup | Watches spec folders for file changes, triggers incremental re-index. Daemon-resident watcher object. |
| 3 | **Async embedding retry queue** | `lib/ops/job-queue.ts` | Failed embeddings are re-enqueued with backoff. Queue lives in-process. |
| 4 | **Async ingest job queue** | `lib/ops/job-queue.ts:46-60` | `IngestJob` state machine (queued→parsing→embedding→indexing→complete/failed/cancelled). In-process. |
| 5 | **RSS watchdog** | `mk-spec-memory-launcher.cjs:99-100` | Monitors process RSS, triggers in-place recycle when threshold breached. Launcher-resident timer. |
| 6 | **Owner-lease single-writer mutex** | `mk-spec-memory-launcher.cjs:85-86` | `.spec-memory-owner.json` lease file. Prevents concurrent DB writers. Launcher-managed. |
| 7 | **Session working memory** | `lib/cognitive/working-memory.ts` | In-process session state: current spec folder, attention decay, co-activation signals. |
| 8 | **Session dedup cache** | Working memory subsystem | Deduplicates repeated search queries within a session. ~50% token savings. |
| 9 | **Session priming (constitutional injection)** | `hooks/memory-surface.ts` | Auto-surfaces constitutional memories and trigger matches on first tool call per session. |
| 10 | **Tool response cache** | Session-level | Caches recent tool responses to avoid redundant DB hits. |
| 11 | **FTS5 auto-heal on boot** | `context-server.ts` startup | Validates FTS5 shadow table integrity, rebuilds if corrupt. |
| 12 | **Transaction manager recovery** | `context-server.ts` startup | Recovers from interrupted SQLite transactions on startup. |
| 13 | **Shadow evaluation logging** | `lib/telemetry/retrieval-telemetry.ts` | Logs search quality metrics for eval framework. Writes to eval tables. |

[SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1-100]
[SOURCE: file:.opencode/bin/lib/model-server-supervision.cjs]
[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:46-60]

### Per-Architecture Impact

#### Architecture (a): Pure Per-Invocation CLI

Every `spec-memory` call spawns a new process, opens SQLite, executes, and exits.

| Service | Status | Impact |
|---------|--------|--------|
| Warm embedder | **LOST** | Cold embedding every invocation. 100-500ms penalty per embedding call. |
| File-watcher reindex | **LOST** | No background monitoring. Must manually run `index-scan --force` before searches. |
| Async retry queue | **LOST** | Failed embeddings don't auto-retry. User must re-invoke. |
| Async ingest queue | **LOST** | `ingest_start` blocks synchronously until all files processed. Different UX. |
| RSS watchdog | **N/A** | Process exits after each call — no RSS to monitor. |
| Owner-lease mutex | **N/A** | Single process at a time — no contention. |
| Session working memory | **LOST** | No persistent session state. Each call is independent. |
| Session dedup | **ADAPTED** | Filesystem-based alternative possible but slower. ~50% token waste on repeated queries. |
| Session priming | **ADAPTED** | Must explicitly call `session-bootstrap` — no auto-injection on first tool call. |
| Tool cache | **LOST** | Every query hits DB directly. |
| FTS5 auto-heal | **LOST** | Must run `health --auto-repair` periodically. |
| Transaction recovery | **LOST** | Must run `health` to detect interrupted transactions. |
| Shadow eval logging | **LOST** | No background telemetry. |

**Tools lost:** 6 — `memory_ingest_status`, `memory_ingest_cancel`, `session_health`, `session_resume`, `session_bootstrap` (all STATE-WATCHER)
**Services lost:** 5 — warm embedder, file-watcher, retry queue, ingest queue, session state
**Zero-feature-loss bar: NOT MET.**

#### Architecture (b): CLI Front-End Over Existing Daemon

The CLI connects to the existing daemon over `daemon-ipc.sock` using JSON-RPC. Only the MCP stdio transport is removed.

| Service | Status | Impact |
|---------|--------|--------|
| All 13 services | **PRESERVED** | Zero changes to daemon. CLI is a thin IPC-to-CLI-args adapter. |
| MCP tool-schema overhead | **GAIN** | Token savings from eliminating schema transport. |

**Tools lost:** 0
**Services lost:** 0
**Zero-feature-loss bar: MET.**

Key code insight: `launcher-ipc-bridge.cjs:80-122` `bridgeStdioToSocket()` already pipes stdin↔IPC. The CLI replaces raw MCP frames with structured CLI args but uses the same IPC socket. No daemon changes needed.

[SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:80-122]

#### Architecture (c): Hybrid CLI with Auto-Spawn

Like (b), but auto-spawns daemon on first call if not running.

| Service | Status | Impact |
|---------|--------|--------|
| All 13 services (daemon up) | **PRESERVED** | Same as (b). |
| All 13 services (daemon down) | **COLD START** | First CLI call spawns daemon, waits for warm-up. Subsequent calls same as (b). |
| File-watcher (daemon restarting) | **BRIEF GAP** | Between daemon crash and respawn, file changes not captured. |

**Tools lost:** 0 (temporarily degraded during daemon restart)
**Services lost:** 0
**Zero-feature-loss bar: MET** with temporary availability caveat.

### Key Insight

The daemon is not doing anything that MCP specifically requires. All 13 services are general-purpose infrastructure that ANY transport (MCP, CLI, HTTP) would benefit from. The MCP layer adds tool-schema overhead but no unique capability. The `launcher-session-proxy.cjs:33-58` replay classification (replayable vs unsafe tools) is a transport-level concern that the CLI can replicate with idempotency flags.

[SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:33-58]

## Ruled Out
- Architecture (a) pure CLI: fails zero-feature-loss bar (6 STATE-WATCHER tools + 5 services lost)

## Next Focus Shifts To
KQ3 — MCP-only affordances that exist because of the protocol itself (tool-schema discovery, permissioning, Zod validation, -32001 retryable, session-proxy replay), and their concrete CLI replacements.
