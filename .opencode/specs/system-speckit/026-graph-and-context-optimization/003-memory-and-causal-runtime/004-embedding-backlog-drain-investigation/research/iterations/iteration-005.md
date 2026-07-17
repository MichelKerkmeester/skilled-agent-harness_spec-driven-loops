# Iteration 5: Reconcile Non-Convergence With Retry and Reindex Paths

## Focus

Reconcile the observed "completed drain, success unchanged" result against the code model, then start the operator runbook for driving the backlog to `0 failed / 0 pending`.

The concrete targets were:

- identify whether the completed monitors observed retry-manager work or embedder reindex work;
- confirm whether the persistent daemon actually runs retry-manager drain logic;
- confirm whether clean `pending` rows with `retry_count = 0` are eligible;
- confirm whether retry env changes require full daemon restart;
- identify the trigger that actually commits `memory_index.embedding_status = 'success'`.

## Actions Taken

1. Re-read iteration 4 and the reducer-owned strategy next-focus block.
2. Traced `retry-manager.js` from daemon startup through `startBackgroundJob()`, `runBackgroundJob()`, `getRetryQueue()`, `claimRetryCandidate()`, and `retryEmbedding()`.
3. Re-traced `embedder_set`, `embedder_status`, and `reindex.js` to compare job completion with metadata status writes.
4. Checked the live `context-index.sqlite` status distribution and recent `embedder_jobs` rows.
5. Checked runtime MCP config env values and launcher/IPC bridge lifecycle evidence.

## Findings

### F1. The "completed monitors, success unchanged" path was an embedder reindex monitor, not a retry-manager success drain.

The observable completed job state belongs to `embedder_jobs`: the live DB has recent completed `emb-swap-*` jobs with `processed == total`, including `26967/26967` for `emb-swap-2026-05-26T20-13-39-920Z-a24aee26`. [SOURCE: sqlite query on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

That matches `embedder_status`, which maps `embedder_jobs` status, total, and processed fields for a requested or active job. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/embedder-status.js:36`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/embedder-status.js:44`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/embedder-status.js:46`]

`embedder_set` only queues `startReindex()`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/embedder-set.js:27`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/embedder-set.js:41`] The reindex worker selects all `memory_index` rows by `id`, writes vector tables and shard `vec_memories`, then marks the embedder job completed and flips the active pointer. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:141`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:172`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:200`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:316`]

The success count stayed unchanged because that completed path does not write `memory_index.embedding_status`. The status-writing retry path was not the path being measured by those monitors.

### F2. The retry-manager drain does run inside the persistent daemon.

`context-server.js` imports `retry-manager.js` at module load. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:68`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:69`]

During startup, `context-server` calls `retryManager.startBackgroundJob({ intervalMs: 5 * 60 * 1000, batchSize: 5 })`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1482`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1485`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1486`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1487`]

`startBackgroundJob()` immediately invokes `runBackgroundJob(config.batchSize)` and registers an interval to run it again. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:702`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:707`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:715`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:719`]

One important caveat: the committed runtime configs set batch 100 and interval 5s, but normal daemon startup currently overrides those two values with hardcoded 5 minutes / 5 rows. The cap and max-age env still matter because retention reads them at module load.

### F3. Clean `pending` rows are retry-manager eligible, but retention runs before they can be claimed.

`getRetryQueue()` runs retention, then selects rows where `embedding_status IN ('pending', 'retry') AND retry_count < MAX_RETRIES`, ordering `pending` rows ahead of retry rows. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:365`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:367`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:369`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:372`]

`isEligibleForRetry()` returns `true` immediately for `embedding_status === 'pending'`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:387`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:389`]

`claimRetryCandidate()` claims a pending row by setting it to `retry` without requiring a prior retry state; it only requires the row still be `pending`, have the observed `retry_count`, and match `last_retry_at`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:155`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:165`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:167`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:172`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:173`]

The trap is ordering: `runBackgroundJob()` calls `enforceRetryRetentionLimits()` before queue stats or `processRetryQueue()`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:742`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:751`] Retention first parks old `pending/retry` rows by max-age, then parks overflow rows past `maxPending`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:319`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:324`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:327`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:331`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:337`]

The live DB now shows both parking modes: `failed=16344`, with `7105` max-age failures and `9239` pending-cap failures; only `pending=972` and `retry=10` remain eligible. [SOURCE: sqlite query on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

### F4. The reliable backlog success writer is `retryEmbedding()` after a row is pending/retry eligible.

`retryEmbedding()` writes `embedding_status = 'success'` only after it has an embedding and inserts the vector row into `vec_memories`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:517`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:519`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:520`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:527`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:533`]

The initial indexing path can also write success for normal indexing: `index_memory()` inserts `success` when sqlite-vec is available, while updates mark `pending`, write the vector row, then update status to `success`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index-mutations.js:165`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index-mutations.js:167`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index-mutations.js:340`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index-mutations.js:367`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index-mutations.js:368`]

For backlog drain specifically, `embedder_set` is the wrong trigger because it writes vectors without metadata status. The retry-manager path is the right success writer, but failed rows must first be reset to a retryable state. The internal `resetForRetry()` only resets `failed -> retry`; it is exported from the module, but this pass did not find a public MCP maintenance tool that exposes it for bulk rows. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:614`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:625`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:627`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:632`]

### F5. Retry retention env is frozen at daemon spawn/module load; `/mcp` reconnect cannot change it.

The retry queue cap and age env are parsed into file-scope constants. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:200`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:201`]

The launcher loads `.env.local` / `.env` before spawning `context-server.js`, then passes `process.env` to the child. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:18`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:49`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:343`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:346`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:348`]

If a lease is already held, the launcher bridges to the existing daemon and returns instead of spawning a new process. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:412`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:415`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:416`] The bridge connects stdio to the existing daemon socket. [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:121`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:127`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:128`]

Inside the daemon, a secondary bridge connection creates a new MCP server object on the existing process, not a new process with fresh env. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/ipc/socket-server.js:96`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/ipc/socket-server.js:98`]

So Q5 is definitive: `/mcp` reconnect cannot update retry retention env. A full daemon restart is required.

### F6. Minimal operator runbook draft.

Use this as the current reproducible procedure; it still needs a follow-up implementation or approved maintenance step for bulk failed-row reset.

1. Set the daemon env before launch:

```bash
EMBEDDINGS_PROVIDER=auto
SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory
SPECKIT_RETRY_QUEUE_MAX_PENDING=300000
SPECKIT_RETRY_QUEUE_MAX_AGE_MS=3153600000000
SPECKIT_RETRY_BATCH_SIZE=100
SPECKIT_RETRY_INTERVAL_MS=5000
```

These values are already present in the committed runtime configs. [SOURCE: `.codex/config.toml:64`] [SOURCE: `.codex/config.toml:67`] [SOURCE: `.codex/config.toml:68`] [SOURCE: `.codex/config.toml:69`] [SOURCE: `.codex/config.toml:70`] [SOURCE: `.vscode/mcp.json:15`] [SOURCE: `.vscode/mcp.json:18`] [SOURCE: `.vscode/mcp.json:19`] [SOURCE: `.vscode/mcp.json:20`] [SOURCE: `.vscode/mcp.json:21`]

2. Fully stop the lease-owning daemon; do not rely on `/mcp` reconnect. The lease file is `.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json`, and in this pass it contained PID `49658` with `startedAt=2026-05-26T21:21:45.936Z`. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:62`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:130`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:189`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json:2`]

3. Restart the runtime so `mk-spec-memory-launcher.cjs` spawns a fresh `context-server.js` with the env above. Confirm the short IPC socket exists at `/tmp/mk-spec-memory/daemon-ipc.sock`. [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:7`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:32`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/ipc/socket-server.js:137`] [SOURCE: `/tmp/mk-spec-memory/daemon-ipc.sock`]

4. Reset retention-parked failed rows to a retryable state before expecting backlog convergence. Without this, `getRetryQueue()` will never select rows already marked `failed`. The internal target state is `embedding_status='retry', retry_count=0, last_retry_at=NULL, failure_reason=NULL`; the existing internal helper does that one row at a time for `failed` rows. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:625`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:627`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:628`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:629`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:632`]

5. Let the retry-manager drain, not `embedder_set`, perform the metadata convergence. The success-writing trigger is `retryEmbedding()` via `processRetryQueue()` / `runBackgroundJob()`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:642`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:687`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:742`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:760`]

## Questions Answered

- Q2 answered definitively: the retry manager does embed clean `pending` rows with `retry_count=0`, but it first claims them as `retry`. It is not limited to rows already in retry status.
- Q4/Q5 reconciled with observed non-convergence: completed embedder jobs can leave success unchanged because they do not write `memory_index.embedding_status`, and `/mcp` reconnect cannot reload retry retention env.
- Q6 partially answered: the runbook requires full daemon restart with raised retention env, a failed-row reset to a retryable state, and retry-manager drain as the status-success trigger.

## Questions Remaining

- Q3 still needs one narrow follow-up: reproduce the exact `reindex --force` `Indexed/Updated: 0` case against file discovery and dedup behavior. The code confirms force is not a global status reset, but the exact zero-count mechanism needs a direct trace.
- Q6 needs an implementation decision: expose a safe bulk `resetForRetry()` maintenance tool, add a status reconciliation path after vector-only reindex, or document an operator-approved SQLite maintenance step.
- The hardcoded daemon startup batch/interval override should be treated as a separate fix candidate: config says batch 100 / 5s, runtime currently starts 5 / 5min.

## Next Focus

Finish Q3 + Q6: reproduce the `reindex --force` zero-count path against `memory_index_scan` and dedup/file-discovery behavior, then choose the safest failed-row reset surface for the operator runbook. The likely implementation candidates are a guarded bulk retry reset tool for retention-failed rows, or a post-reindex reconciliation tool that marks rows success only when a valid active-vector row exists.
