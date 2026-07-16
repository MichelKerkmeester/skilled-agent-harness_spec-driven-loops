# Iteration 002: KQ2 — Daemon-Dependency Audit

## Focus
Map every daemon-resident service and classify what dies under architectures (a), (b), and (c).

## Assessment: newInfoRatio=1.0

Second iteration is entirely complementary to KQ1 — no overlap in findings. KQ1 classified tools; KQ2 traces the services those tools depend on.

## Findings

### Daemon Architecture from Source Evidence

The launcher at `.opencode/bin/mk-spec-memory-launcher.cjs` [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1-15] spawns `mcp_server/dist/context-server.js` as a child process and supervises it with a multi-layered ownership model:

1. **Owner lease** (line 84-85): `OWNER_LEASE_FILE_NAME = '.spec-memory-owner.json'` — filesystem-based single-writer mutex with heartbeat (TTL 60s, heartbeat every 30s). Acquired with exclusive `wx` open (line 298-312).
2. **PID lease** (line 84): `.mk-spec-memory-launcher.json` — records launcher PID + child server PID + IPC socket path.
3. **IPC socket** (line 8 in bridge): `daemon-ipc.sock` — Unix domain socket for JSON-RPC communication.
4. **Crash-loop guard** (line 1205): `createCrashLoopGuard` — detects N deaths in window, gives up and exits.
5. **RSS watchdog** (line 1104): `startRssWatchdog` with in-place daemon recycle on sustained RSS breach.

The session proxy at `.opencode/bin/lib/launcher-session-proxy.cjs` [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:1-58] adds:
6. **Reconnecting MCP proxy**: Transparent reconnection with replay classification. `REPLAYABLE_TOOL_NAMES` (line 33-47): search, context, triggers, save, bootstrap, health, resume, stats, status, checkpoint_list, embedder_health — replayed on reconnect. `UNSAFE_TOOL_NAMES` (line 48-58): delete, update, restore, set, sweep, ingest_start, ingest_cancel — receive -32001 retryable error on reconnect.
7. **Keepalive**: `sendKeepalive()` (line 536) sends JSON-RPC ping every 10s, expects reply within 5s.
8. **Protocol version check**: On internal re-handshake, compares negotiated version — fails closed on mismatch with `-32002` (line 643-656).

### Daemon-Resident Services Inventory

From the context-server imports and startup at `mcp_server/context-server.ts` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1-152]:

| Service | Code Location | Warm/Cold | What it Does |
|---------|--------------|-----------|-------------|
| **Warm embedder** | embedding-pipeline.ts, embedder-status.ts, embedder-set.ts | WARM | Local-first cascade (ollama → hf-local → OpenAI → Voyage) with warm model server. The hf-model-server keeps models in GPU/RAM across requests. |
| **Chokidar file-watcher** | lib/ops/file-watcher.js, line 148 in context-server.ts | WARM | `startFileWatcher()` — monitors workspace for file changes, auto-reindexes changed spec docs. |
| **Async embedding retry queue** | lib/providers/retry-manager.js, line 129 in context-server.ts | WARM | `retryManager` — background job that retries failed embeddings on backoff schedule. |
| **Async ingest job queue** | lib/ops/job-queue.js, memory-ingest.ts | WARM | `initIngestJobQueue()` — processes `memory_ingest_start` jobs asynchronously with status tracking. |
| **RSS watchdog** | launcher.cjs:1104, model-server-supervision.cjs | WARM | Monitors process tree RSS, recycles daemon in-place on sustained breach with crash-loop protection. |
| **Owner-lease single-writer** | launcher.cjs:240-400 | WARM | Filesystem mutex preventing dual daemon instances. Heartbeat-based with stale-lease reclamation (stale-pid, ppid-1-orphan, stale-heartbeat-reclaim classifications). |
| **Session context** | lib/session/session-manager.ts, lib/cognitive/working-memory.ts | WARM | `session_bootstrap`/`session_resume`/`session_health` depend on in-process working memory, attention decay, co-activation state. |
| **Session deduplication** | lib/session/session-manager.ts, memory-search.ts | WARM | Tracks already-sent records per session to eliminate duplicate results (~50% token savings). Loses state on process restart. |
| **Session priming** | hooks/memory-surface.ts, context-server.ts:63 | WARM | `primeSessionIfNeeded()` — one-time per-session constitutional memory loading + code-graph readiness check. |
| **Tool cache** | lib/cache/tool-cache.js, context-server.ts:142 | WARM | Caches tool call results. Invalidated on DB reinit. |
| **Transaction manager** | lib/storage/transaction-manager.js | WARM | Pending file recovery on startup after unclean shutdown. |
| **Shadow evaluation** | lib/feedback/shadow-evaluation-runtime.js | WARM | Implicit feedback logging (search_shown, result_cited) for ranking optimization. |
| **FTS5 auto-heal** | context-server.ts:367-412 | WARM | On boot, checks unclean-shutdown marker, runs FTS5 integrity check, auto-rebuilds corrupt shadow. |

### Per-Architecture Loss Table

| Service | Arch (a) Pure CLI | Arch (b) CLI-over-Daemon | Arch (c) Hybrid CLI |
|---------|------------------|------------------------|---------------------|
| **Warm embedder** | LOST — cold embedding every invocation. 100-500ms penalty per file but correct output. | PRESERVED — daemon keeps models warm. | PRESERVED when daemon is up. Cold penalty when daemon needs spawn. |
| **File-watcher reindex** | LOST — no background monitoring. Must run `index-scan --force` periodically. | PRESERVED — chokidar fires re-index on change. | PRESERVED when daemon is up. Stale indices between manual scans when daemon is down. |
| **Async retry queue** | LOST — failed embeddings don't auto-retry. Must run `embedding-reconcile` manually. | PRESERVED — retry-manager runs in daemon. | PRESERVED when daemon is up. Retry backlog accumulates when daemon is down. |
| **Async ingest queue** | LOST — `ingest_start` would block until complete (or the CLI would need to implement process-level async). | PRESERVED — job-queue in daemon. | PRESERVED when daemon is up. |
| **RSS watchdog** | N/A — short-lived process, RSS not a concern. | PRESERVED — launcher monitors child RSS. | PRESERVED when daemon is up. |
| **Owner-lease** | N/A — no concurrent writers in single-CLI model. CLI can use SQLite WAL for concurrency. | PRESERVED — launcher manages lease. | PRESERVED — launcher manages lease. Auto-acquired on first CLI call if daemon not running. |
| **Session context** | LOST — no in-process session state. Session deduplication and continuity would need filesystem-based alternative. | PRESERVED — daemon holds session state. | PRESERVED when daemon is up. Lost when daemon is down (cold session). |
| **Session dedup** | ADAPTED — could use filesystem-based dedup (write seen-result hashes to tmp file). Slower but correct. | PRESERVED — in-memory dedup set. | ADAPTED when daemon is down. |
| **Session priming** | ADAPTED — one-time bootstrap scan can be done per-CLI-invocation. Duplicates work. | PRESERVED — daemon holds primed state. | PRESERVED when daemon is up. |
| **Tool cache** | LOST — no in-process cache. Every query hits DB. Latency impact ~5-50ms per cached tool. | PRESERVED — daemon holds cache. | PRESERVED when daemon is up. |

### Critical Losses Under Architecture (a)

**5 tools become non-functional** (the STATE-WATCHER group from KQ1):
- `memory_ingest_status` — needs async job queue
- `memory_ingest_cancel` — same
- `session_health` — needs session state
- `session_resume` — needs session state
- `session_bootstrap` — needs session state + code-graph readiness

**3 services with correctness implications under architecture (a)**:
- **File-watcher reindex**: Without chokidar, the CLI cannot know when files change. Agents would need to manually run `index-scan` before searches, or tolerate stale results.
- **Session deduplication**: Without in-memory dedup, search results would contain duplicates across sequential CLI calls. ~50% token waste.
- **Session bootstrap**: Without warm session state, every CLI call would cold-start, losing the "one-time prime" optimization.

### Architecture (b) Assessment

Architecture (b) keeps the existing daemon intact and only strips the MCP stdio transport. The CLI becomes an IPC client.

**Loss: NONE detected.** All 37 tools, all daemon services, all session state — fully preserved. The existing `launcher-ipc-bridge.cjs:80-122` `bridgeStdioToSocket()` already pipes stdio to the IPC socket. The CLI would do the same with a structured CLI interface instead of raw MCP frames.

The only thing removed is the MCP tool-schema protocol, which is the subject of KQ3.

### Architecture (c) Assessment

Architecture (c) auto-spawns the daemon on first CLI call, then reuses it.

**Loss: The same STATE-WATCHER features as (a) when daemon is absent.** However, the daemon is auto-spawned, so the "absent" state is rare (only when the daemon crashes and the user hasn't made another CLI call yet). The hybrid model breathes through:
1. First CLI call: spawn daemon, bridge through IPC, return result.
2. Subsequent calls: reuse existing daemon, low latency.
3. Daemon crash: next CLI call auto-restarts it (launcher crash-loop guard prevents thrash).

**Net loss vs (b):** Startup latency on first call (cold embedder load), and session state loss when daemon recycled. This is a performance degradation, not a feature loss.

## Ruled Out
- (none)

## Next Focus Shifts To
KQ3 — map each MCP affordance to a CLI replacement. The tool schema, Zod validation, -32001 retryable errors, and session-proxy replay classification are the key candidates.
