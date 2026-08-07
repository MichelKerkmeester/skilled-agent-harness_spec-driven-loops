# Iteration 4: Embedder Reindex Status Commit and Daemon Config Lifecycle

## Focus

This iteration shifted away from the already-mapped retry-retention parking path and targeted Q4 + Q5:

- whether `embedder_set` / `startReindex` ever writes `memory_index.embedding_status = 'success'`;
- whether retry queue env config is re-read on `/mcp` reconnect, daemon bridge attach, or worker respawn.

## Actions Taken

1. Read the deep-research state and strategy to confirm the reducer-owned next focus.
2. Traced `embedder_set` through `startReindex`, the background reindex job, vector shard writes, completion transaction, and active embedder pointer update.
3. Searched the runtime reindex implementation for `embedding_status`, `UPDATE`, `vec_memories`, `setActiveEmbedder`, and job-status writes.
4. Traced daemon startup from `mk-spec-memory-launcher.cjs` through the IPC bridge and `context-server` startup.
5. Traced retry queue env reads in the runtime `dist` files and checked sidecar worker respawn env inheritance.

## Findings

### F1. `embedder_set` queues reindex only; it does not write memory status.

The handler validates the manifest, ensures the target vector table, calls `startReindex({ toName: manifest.name }, { db })`, then returns a queued/running job response. There is no `memory_index.embedding_status` update in the handler. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/embedder-set.js:27`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/embedder-set.js:41`]

### F2. Reindex reads every `memory_index` row and writes vectors, not `embedding_status`.

The reindex worker selects rows from `memory_index` by `id` with `LIMIT/OFFSET`, with no `embedding_status` predicate. It writes `vec_<dim>` via `INSERT OR REPLACE`, and when sqlite-vec is available it deletes/inserts into shard-local `vec_memories`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:141`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:172`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:200`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:257`]

The completion transaction only flips the active embedder pointer and marks the `embedder_jobs` row `completed`. It does not reconcile `memory_index.embedding_status` to `success`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:316`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:317`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:318`]

This answers the crux: a completed embedder drain can truthfully populate vectors and complete the job while leaving `pending`, `retry`, or `failed` metadata rows untouched.

### F3. The active pointer write is separate metadata, not per-row memory status.

`setActiveEmbedder()` writes `vec_metadata` keys for active name, dim, and provider. It does not touch `memory_index`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:176`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:192`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:214`]

### F4. Retry cap and max-age env are read at daemon module load and then frozen for that process.

The launcher executes `dist/context-server.js`, which imports `retry-manager.js` at module load. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:69`]

In runtime `retry-manager.js`, `SPECKIT_RETRY_QUEUE_MAX_PENDING` and `SPECKIT_RETRY_QUEUE_MAX_AGE_MS` are read into file-scope constants. `SPECKIT_RETRY_INTERVAL_MS` and `SPECKIT_RETRY_BATCH_SIZE` are also read into file-scope `BACKGROUND_JOB_CONFIG`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:200`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:201`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:207`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:208`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:209`]

`runBackgroundJob()` calls `enforceRetryRetentionLimits()` without passing fresh env values, so the default file-scope constants govern retention. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:742`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:751`]

### F5. Batch and interval env are currently overridden by `context-server` startup.

`startBackgroundJob()` merges `BACKGROUND_JOB_CONFIG` with caller options and captures the resulting `config` in the interval closure. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:702`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:707`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:715`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:719`]

But `context-server` calls `startBackgroundJob({ intervalMs: 5 * 60 * 1000, batchSize: 5 })`, so `SPECKIT_RETRY_INTERVAL_MS` and `SPECKIT_RETRY_BATCH_SIZE` do not affect the normal daemon background retry loop today. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1485`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1486`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1487`]

### F6. `/mcp` reconnect bridges to the existing daemon; it does not restart or reload retry env.

The launcher loads `.env.local` / `.env` before spawning a new context-server child and passes `process.env` into that child. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:18`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:49`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:343`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:346`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:348`]

However, if a lease is already held, the launcher calls `bridgeOrReportLeaseHeld()` and returns. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:412`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:415`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:416`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:417`]

The bridge computes a socket path and pipes the new launcher's stdio to the existing daemon socket. It does not spawn a new `context-server` or update the daemon process environment. [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:121`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:127`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:128`]

Inside the daemon, each secondary connection creates a new MCP `Server` object but remains in the same process with the same already-imported modules. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/ipc/socket-server.js:96`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/ipc/socket-server.js:98`]

### F7. Sidecar worker respawn inherits the old daemon's env, not the reconnecting client's env.

For embedder sidecars, the `SidecarClient` constructor reads sidecar timeout env and stores `this.env = process.env` from the daemon process. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:457`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:467`]

When a worker is missing or unhealthy, the client restarts it and forks a child using `buildSidecarEnv(this.env, ...)` plus internal sidecar variables. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:551`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:561`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:575`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:579`]

This explains the stale-worker symptom for sidecar workers: killing a sidecar worker can cause a respawn under the old daemon, and that respawn uses the daemon's existing environment snapshot.

## Questions Answered

- Q4 answered: `embedder_set` / `startReindex` can complete by writing vector rows and flipping the active embedder pointer, but it does not commit `memory_index.embedding_status = 'success'`.
- Q5 substantially answered: retry retention cap/max-age are daemon-process file-scope constants; `/mcp` reconnects bridge into the existing daemon and do not reload config. Batch/interval env are also file-scope, but the normal daemon startup currently overrides them with hardcoded `5min / 5`.

## Questions Remaining

- Q2 remains open: initial `pending -> success` ownership still needs one clean trace through save/indexing paths, separate from embedder reindex.
- Q3 remains open: `reindex --force` CLI behavior still needs a focused trace against file/content decision logic.
- Q6 remains open: the operator drain procedure now has two likely requirements, but still needs validation: full daemon restart after env changes, plus a status reconciliation/reset path separate from embedder reindex.

## Next Focus

Trace Q2 + Q3 together: follow initial save/index paths that actually write `memory_index.embedding_status = 'success'`, then compare them to `spec-kit-cli reindex --force` selection logic. The goal is to identify the minimal metadata-status reset or reconciliation step needed after vector-only embedder reindex completes.
