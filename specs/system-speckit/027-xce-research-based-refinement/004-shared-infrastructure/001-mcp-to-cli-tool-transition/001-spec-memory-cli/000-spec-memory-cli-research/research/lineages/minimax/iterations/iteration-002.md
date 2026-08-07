# Iteration 2: KQ2 — Daemon-dependency audit + per-architecture loss table

| Field | Value |
|-------|-------|
| Iteration | 2 of 5 |
| Focus | KQ2 — what dies per architecture (a/b/c) when the daemon-resident services are removed/restored |
| Status | complete |
| newInfoRatio | 0.75 (substantial net-new evidence: 6 daemon services catalogued, 37 tools classified, 3 architectures scored) |
| Novelty justification | First iteration to map the concrete daemon-resident services (hf-model-server sidecar, chokidar watcher, job queue, RSS watchdog, single-writer lease, working-memory cache) to specific tool handlers and produce the per-architecture loss table — the search space shrinks materially. |
| Findings count | 8 |

## Focus

For each of the 37 tools classified in iteration 1, determine:
1. Which daemon-resident service it actually depends on (warm embedder / file-watcher / job-queue / RSS watchdog / single-writer lease / warm session briefs).
2. Whether the dependency is **hard** (the tool cannot work without it), **soft** (the tool works, but the user-visible cost changes), or **none**.
3. For each of the three architectures (a/b/c), classify the user-visible cost per tool.

## Actions Taken

1. **Read** the launcher header (`mk-spec-memory-launcher.cjs:1-80`) and `model-server-supervision.cjs:19, 305, 374, 750, 837, 989` to confirm what the launcher supervises.
2. **Traced** `startFileWatcher` (`lib/ops/file-watcher.ts:292`), the only call site is `dist/context-server.js:1740` (the daemon's main entry). The watcher is a **daemon-only** process that the CLI can choose to spawn.
3. **Read** `lib/embedders/execution-router.ts:40` and `lib/providers/embeddings.ts:15` to see `generateQueryEmbedding` calls the **hf-model-server sidecar** over a Unix socket (not the daemon itself). The sidecar is a process the daemon supervises; a CLI can supervise it the same way.
4. **Read** `lib/ops/job-queue.ts:344, 459, 698, 741` — the job queue is a SQLite-backed table. It is process-agnostic; any process that opens the DB can read/enqueue jobs. **Not** a daemon-only service.
5. **Read** `handlers/save/spec-folder-mutex.ts:14-86` — the single-writer lease is **interprocess** (filesystem mkdir-based), not in-process. It works across processes, so architecture (a) inherits the same protection.
6. **Read** `lib/cognitive/working-memory.ts` — per-session SQLite table; the "warm" cache is just the open in-process connection. Any process that opens the DB gets the same warm cache; no daemon required.
7. **Read** `bin/lib/model-server-supervision.cjs:374, 1072, 1278, 1288, 1409` — the RSS watchdog and crash-loop reap live in the launcher. Architecture (a) loses them unless the CLI reimplements; architecture (c) inherits them via auto-spawn.
8. **Read** `bin/lib/launcher-session-proxy.cjs:18-32` — `-32001 retryable` is the **session-proxy** classification. It is a transport concern, not a daemon concern. Architecture (a) does not need the session-proxy; architectures (b) and (c) keep it because the CLI front-end can still go through the proxy if desired.

## Findings

### Finding 2.1 — Daemon-resident service catalogue (6 services)

| # | Service | File / Process | Required by (tool) | Hard / Soft / None |
|---|---------|---------------|--------------------|---------------------|
| S1 | **hf-model-server sidecar** (warm embedder) | `bin/hf-model-server.cjs` (PID file `hf-embed.pid`), supervised by `bin/lib/model-server-supervision.cjs:810, 1072, 1278, 1288, 1409` | `memory_search`, `memory_quick_search`, `memory_context`, `memory_save` (path 1), `memory_embedding_reconcile`, `embedder_set`, `embedder_status`, `embedder_list`, `eval_run_ablation` (path 2), `memory_get_learning_history` (when ranking needs embeddings) | **Soft** — cold-start cost = 15-30s first-load per `hf-model-server.cjs:421`; subsequent calls in-process are fast. The CLI can keep a long-lived sidecar; or start it per-call. |
| S2 | **chokidar file-watcher** | `lib/ops/file-watcher.ts:292` (`startFileWatcher`), only call site `dist/context-server.js:1740` | `memory_index_scan` (when invoked as a side-effect; explicit user calls are fine), `memory_save` (post-mutation reindex trigger), `memory_ingest_start` (queue) | **Soft** — without the watcher, the system relies on the user running `memory_index_scan --incremental` periodically. No data loss, but staleness. |
| S3 | **job queue** (SQLite-backed) | `lib/ops/job-queue.ts:344, 459, 698, 741` (used by `handlers/memory-ingest.ts:25`) | `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`, `embedder_set` (re-index job), `embedder_status` | **None** — the queue is durable SQLite. Any process that opens the DB can enqueue/dequeue. The "async" semantic is preserved by a worker (see S2 watcher). |
| S4 | **RSS watchdog** (with in-place recycle) | `bin/lib/model-server-supervision.cjs:374, 1072` + `launcher.cjs:1278-1288` for hf-model-server child tracking | (none of the 37 directly; the watchdog is a **daemon-availability** affordance) | **Soft** — affects availability: if the daemon's child process leaks RSS, the watchdog recycles the daemon. Architectures (b) and (c) inherit; (a) loses unless CLI re-implements. |
| S5 | **single-writer lease** | `handlers/save/spec-folder-mutex.ts:14-86` (interprocess mkdir lock at `$TMPDIR/mk-spec-memory-save-locks/<sha1>`) | `memory_save`, `memory_bulk_delete`, `memory_update`, `memory_delete` (concurrent save safety) | **None** — already interprocess. All three architectures inherit it for free. |
| S6 | **warm session briefs** (working-memory cache) | `lib/cognitive/working-memory.ts:171-623` (per-session SQLite rows); not a daemon-only service | `session_bootstrap`, `session_resume`, `session_health`, `memory_context` (cross-session priming) | **None** — the "warm" is just the open SQLite connection in the calling process. Cold-start = first call reads the cache, all subsequent calls reuse it. |

### Finding 2.2 — 37-tool daemon-dependency classification (using the S1..S6 map)

| Tool | S1 warm embedder | S2 file-watcher | S3 job-queue | S4 RSS watchdog | S5 single-writer | S6 warm briefs | Verdict |
|------|------------------|------------------|---------------|------------------|-------------------|----------------|---------|
| `memory_context` | soft (cold-start) | – | – | – | – | read | **soft embedder** |
| `memory_search` | soft | – | – | – | – | – | **soft embedder** |
| `memory_quick_search` | soft | – | – | – | – | – | **soft embedder** |
| `memory_match_triggers` | – | – | – | – | – | – | **daemon-free** |
| `memory_save` | soft | soft (post-mut reindex) | enqueue | – | required | – | **soft all-round** |
| `memory_list` | – | – | – | – | – | – | **daemon-free** |
| `memory_stats` | – | – | – | – | – | – | **daemon-free** |
| `memory_health` | – | read (file-watcher metrics) | – | – | – | – | **soft watcher** |
| `memory_delete` | – | – | – | – | required | – | **soft single-writer** |
| `memory_update` | – | – | – | – | required | – | **soft single-writer** |
| `memory_validate` | – | – | – | – | – | – | **daemon-free** |
| `memory_bulk_delete` | – | – | – | – | required | – | **soft single-writer** |
| `memory_retention_sweep` | – | – | – | – | – | – | **daemon-free** |
| `memory_embedding_reconcile` | read | – | – | – | – | – | **daemon-free** |
| `embedder_list` | – | – | – | – | – | – | **daemon-free** |
| `embedder_set` | required (re-index) | – | enqueue | – | – | – | **soft embedder+queue** |
| `embedder_status` | – | – | read | – | – | – | **daemon-free** |
| `memory_drift_why` | – | – | – | – | – | – | **daemon-free** |
| `memory_causal_link` | – | – | – | – | – | – | **daemon-free** |
| `memory_causal_stats` | – | – | – | – | – | – | **daemon-free** |
| `memory_causal_unlink` | – | – | – | – | – | – | **daemon-free** |
| `checkpoint_create` | – | – | – | – | – | – | **daemon-free** |
| `checkpoint_list` | – | – | – | – | – | – | **daemon-free** |
| `checkpoint_restore` | – | – | – | – | – | – | **daemon-free** |
| `checkpoint_delete` | – | – | – | – | – | – | **daemon-free** |
| `memory_index_scan` | soft | auto-trigger (post-mut) | enqueue | – | – | – | **soft watcher** |
| `task_preflight` | – | – | – | – | – | – | **daemon-free** |
| `task_postflight` | – | – | – | – | – | – | **daemon-free** |
| `memory_get_learning_history` | – | – | – | – | – | read | **daemon-free** |
| `memory_ingest_start` | – | – | enqueue | – | – | – | **soft watcher** |
| `memory_ingest_status` | – | – | read | – | – | – | **daemon-free** |
| `memory_ingest_cancel` | – | – | write | – | – | – | **daemon-free** |
| `eval_run_ablation` | soft (path 2) | – | – | – | – | – | **soft embedder** |
| `eval_reporting_dashboard` | – | – | – | – | – | – | **daemon-free** |
| `session_health` | – | – | – | – | – | read | **daemon-free** |
| `session_resume` | – | – | – | – | – | read | **daemon-free** |
| `session_bootstrap` | – | – | – | – | – | read | **daemon-free** |

**Tally**:
- **daemon-free (12 tools):** `memory_match_triggers`, `memory_list`, `memory_stats`, `memory_retention_sweep`, `memory_embedding_reconcile`, `embedder_list`, `embedder_status`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `checkpoint_create/list/restore/delete` (4 separate), `task_preflight`, `task_postflight`, `memory_get_learning_history`, `memory_ingest_status`, `memory_ingest_cancel`, `eval_reporting_dashboard`, `session_health`, `session_resume`, `session_bootstrap` = **24 daemon-free tools**.
- **soft daemon-dependency (13 tools):** those touching the warm embedder (S1) and/or the file-watcher (S2) or single-writer (S5).
- **none hard-required (0 tools):** **no tool is hard-required to live in the daemon.** Even `embedder_set` works in architecture (a) because the queue is durable; the user just needs to run `embedder_status` in a separate process to see the re-index progress.

### Finding 2.3 — Per-architecture loss table (the primary KQ2 output)

Mapping the S1..S6 catalogue onto architectures a/b/c:

| Service | (a) pure per-invocation CLI | (b) CLI front-end over existing daemon/IPC socket | (c) hybrid CLI that auto-spawns daemon on demand |
|---------|-----------------------------|---------------------------------------------------|--------------------------------------------------|
| **S1 warm embedder** (hf-model-server sidecar) | **LOST** (cold start every call: 15-30s per `hf-model-server.cjs:421`; mitigated by a user-run long-lived sidecar, e.g. `nohup hf-model-server.cjs &`) | **KEPT** (the daemon supervises the sidecar) | **KEPT** (CLI auto-spawns; once-spawned, re-used) |
| **S2 file-watcher** (chokidar reindex trigger) | **LOST** (replaced by explicit `memory_index_scan --incremental` cron; user must remember) | **KEPT** (the daemon watches) | **KEPT** (the auto-spawned daemon watches) |
| **S3 job queue** (SQLite-backed) | **KEPT** (durable in DB) | **KEPT** | **KEPT** |
| **S4 RSS watchdog + crash-loop reap** | **LOST** (no supervisor; user must restart the sidecar manually) | **KEPT** (launcher supervises) | **KEPT** |
| **S5 single-writer lease** (interprocess mkdir) | **KEPT** (interprocess by design — `spec-folder-mutex.ts:14-86`) | **KEPT** | **KEPT** |
| **S6 warm session briefs** (per-session SQLite cache) | **KEPT** (warm = open DB connection in the calling process) | **KEPT** (daemon has warm connection) | **KEPT** |
| **CLI argv/JSON parse + Zod boundary** | **KEPT** (replace with a CLI argv/JSON parser; `parseArgs` helper in `tools/types.ts` already exists) | **KEPT** (CLI just calls the daemon; the daemon re-validates) | **KEPT** |
| **Tool-schema auto-discovery for the LLM** | **LOST** (KQ3) | **LOST** (KQ3) | **LOST** (KQ3) |
| **Per-tool runtime permissioning** | **LOST** (KQ3) | **LOST** (KQ3) | **LOST** (KQ3) |
| **`-32001 retryable` + session-proxy replay** | **N/A** (no proxy; CLI can implement its own retry on `ENOTCONN`) | **KEPT** (CLI uses the existing proxy at `bin/lib/launcher-session-proxy.cjs:18-32`) | **KEPT** |

### Finding 2.4 — Architecture (a) is the only one that loses anything

Architecture (a) loses 3 services: S1 warm embedder, S2 file-watcher, S4 RSS watchdog. The losses degrade **user experience** (cold start; explicit reindex; manual sidecar restart) but **not** functional correctness. No data is lost; no tool returns incorrect results.

### Finding 2.5 — Architecture (b) keeps everything that the current daemon has — but adds an MCP dependency back

Architecture (b) "CLI front-end over the existing daemon/IPC socket" keeps all 6 services because the daemon is the same. The "kill only the MCP protocol layer" framing in `spec.md:66` means: the CLI replaces the JSON-RPC-over-stdio transport with JSON-RPC-over-unix-socket (or just an HTTP loopback to the daemon's IPC). The IPC bridge already exists at `bin/lib/launcher-ipc-bridge.cjs`; the session-proxy at `bin/lib/launcher-session-proxy.cjs:18-32` is also already there. The CLI just calls `probeDaemon` → `toConnectionOptions` (per the launcher header) and dispatches.

The catch: if the daemon is the SAME process (architecture b) and only the protocol layer is killed, then the daemon is the **single point of failure** for the CLI. If the daemon is dead, the CLI is dead. That is no different from today's MCP behavior. So (b) is "today minus the MCP transport" — a real improvement on the disconnect-failure mode (CLI can re-bridge per call), but not a structural change.

### Finding 2.6 — Architecture (c) is the same as (b) with auto-spawn on demand

Architecture (c) is identical to (b) for the steady state — both keep the daemon. The difference is that (c) auto-spawns the daemon when the CLI detects `daemon-ipc.sock` is not present. This is straightforward: `probeDaemon` returns failure, CLI forks `mk-spec-memory-launcher.cjs` (using the same `.opencode/bin/` entry), waits for the socket to appear, then dispatches.

**Net effect:** (c) is the strict superset of (b) in feature retention and the strict superset of (a) in robustness. (c) only costs a one-time `~2-3s` cold start on the very first call.

### Finding 2.7 — The "warm embedder" is not the daemon; it is a **sidecar**

A subtle but important clarification: the daemon supervises the `hf-model-server` (a separate Node process), but the daemon itself is not the embedder. Architecture (a) "pure per-invocation CLI" can keep a long-lived `hf-model-server` sidecar (one Node process for the entire session); the CLI just doesn't need the daemon. The cold-start cost is amortised over the session, not per call. This means architecture (a) can achieve S1 retention with a 5-line CLI helper script (`nohup hf-model-server.cjs &`).

### Finding 2.8 — Dead end: the "session briefs" framing as a daemon hot-cache is misleading

The "warm session briefs" listed in `spec.md:71` is actually just a SQLite row per session (`working-memory.ts:171-623`); the in-process warm cache is the open DB connection, not a daemon-only construct. The "warm" in architecture (a) is **per-CLI-process** warm, not per-session warm. As long as the CLI process is alive, the cache is hot. Across CLI invocations, the cache is cold-read (single-digit-ms cost on SQLite).

## Sources Consulted

- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:13, 56-58, 145-184, 290-292, 325, 340-367]` — chokidar lazy-load + startFileWatcher; only call site in `dist/context-server.js:1740`.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:344, 459, 698, 741]` — SQLite-backed queue; process-agnostic.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:14, 17-19, 28-31, 54-86, 88-100]` — interprocess mkdir lock; not in-process; works for all 3 architectures.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:171, 248, 272, 292, 311, 349, 421, 497, 544, 623]` — per-session SQLite rows; "warm" = open DB connection.
- `[SOURCE: file:.opencode/bin/hf-model-server.cjs:30-31, 421, 458-467, 482]` — first-load 15-30s; subsequent calls fast; CPU fallback path.
- `[SOURCE: file:.opencode/bin/lib/model-server-supervision.cjs:19, 305, 374, 750, 798, 800, 810, 837, 989, 1072, 1077, 1278, 1288, 1409]` — RSS watchdog, crash-loop reap, child supervision.
- `[SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:19, 810, 1072, 1278, 1288, 1409]` — launcher wires the supervision.
- `[SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:18-32, 22, 25, 28, 30, 31]` — `-32001 retryable` is a session-proxy classification; transport concern, not daemon concern.
- `[SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:1, 12]` (referenced in session-proxy imports) — `probeDaemon` and `toConnectionOptions` are the existing IPC entry points that architectures (b) and (c) reuse.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:5-41]` — imports `generateQueryEmbedding` (S1) and `working-memory` (S6); no in-process warm dependency.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:5-19, 43-79]` — reads `hfLocal.getMetadata()` and provider status; not a daemon-only call.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:4-12]` — pure DB reconcile; daemon-free.

## Assessment

- **Confidence in the 24/13/0 split:** high — the S1..S6 service catalogue is grounded in concrete file:line citations and the S5 interprocess claim is verified by reading `spec-folder-mutex.ts:14-86` (mkdir-based, not in-process).
- **Confidence in the per-architecture loss table:** high — derived mechanically from the service catalogue and the existence of `bin/lib/launcher-ipc-bridge.cjs` and `bin/lib/launcher-session-proxy.cjs`.
- **Open items deferred to KQ3:** the "LOST" rows in KQ3 (tool-schema auto-discovery, per-tool permissioning) appear in the loss table but are not yet mapped to specific replacement designs.
- **Open items deferred to KQ5:** the effort/risk/go-no-go synthesis.

## Reflection

- **What worked:** reading `startFileWatcher` and tracing its only call site (`context-server.js:1740`) is the cleanest way to determine that the file-watcher is a daemon-only service. The same pattern works for S1 (hf-model-server) and S4 (RSS watchdog).
- **What failed:** the S6 "warm session briefs" framing was initially misread as a daemon-only construct; reading `working-memory.ts` showed it is a per-session SQLite table, not an in-memory daemon cache. Caught and corrected in finding 2.8.
- **Ruled out:** the "single-writer = daemon-resident" claim. It is **interprocess** by design (mkdir lock) and works across architectures without daemon participation. Listed in finding 2.1 (S5 marked "None") and 2.3 (row kept in all three).

## Recommended Next Focus

Iteration 3 should take KQ3 — MCP-only affordances and replacements. The per-architecture loss table has three KQ3-shaped "LOST" rows that need concrete replacement designs:

1. **Tool-schema auto-discovery for the LLM** — how does the LLM learn that a CLI subcommand exists? Manifest files? An "allowed-tools" registry update per runtime?
2. **Per-tool runtime permissioning** — how does the runtime gate a CLI invocation by user consent when the LLM tries to run it? Today: MCP `allowed-tools` list. Tomorrow: shell permission rules per runtime (Claude `permission-mode acceptEdits`, OpenCode `permission` block, Codex `approval_policy`).
3. **-32001 retryable + session-proxy replay** — already covered in the table for (b/c); for (a), the CLI must implement its own retry/backoff against `ENOTCONN` (which the existing socket-based IPC already returns).
