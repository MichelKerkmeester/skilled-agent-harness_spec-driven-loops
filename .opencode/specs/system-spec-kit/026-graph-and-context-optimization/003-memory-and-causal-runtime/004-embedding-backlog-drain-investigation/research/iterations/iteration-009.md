# Iteration 9: Durable Prevention and Reconcile Risk Spec

## Focus

Separate the one-time DB repair from durable prevention. This pass consolidates the prior vector-present and masking evidence into an implementation-ready split: `memory_embedding_reconcile()` repairs the current stale metadata, while reindex, retry retention, and daemon config handling prevent the same backlog from coming back.

## Actions Taken

1. Re-read the reducer-owned iteration 9 focus block and the iteration 8 acceptance spec.
2. Re-checked the reindex completion path in source and compiled output.
3. Re-checked retry retention ordering, queue selection, retry success commits, and daemon startup/bridge behavior.
4. Consolidated risks and crisp Q1-Q6 answers for final synthesis.

## Findings

### F1. The implementation packet should split current-state repair from durable prevention.

The one-time DB repair is `memory_embedding_reconcile()`: it repairs rows whose metadata says `failed`, `pending`, or `retry` even though the active vector shard already has valid vector rows. Iteration 8 already defined the safe apply order: reconcile active-vector-present rows to `success` first, then reset only genuinely missing active-vector retention failures. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-008.md:86`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-008.md:171`]

Durable prevention is a separate code packet with three fixes:

1. Reindex jobs must commit metadata success for rows they successfully wrote into the target active vector store.
2. Retry retention must not park never-attempted clean `pending` rows before they can be claimed.
3. Daemon retry config must not be frozen at module load or hidden behind an IPC reconnect to an old process.

That split matters because the current backlog is not primarily missing embeddings. Iteration 7 measured `17,326` non-success rows with active `vec_768` coverage and zero missing active vectors. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:112`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:150`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:206`]

### F2. Durable code fix #1: yes, reindex completion should mark vector-present rows `success`.

`embedder_set` only validates the requested embedder and queues `startReindex()`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:63`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:71`] The reindex job selects every `memory_index` row, writes embeddings to the main dim table and the target shard, then completes by setting the active embedder and the job status. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:219`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:431`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:432`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:440`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:441`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:442`]

The compiled completion path is exactly the stale-status gap: `setActiveEmbedder(...)` and `setJobStatus(..., 'completed', ...)`, with no `memory_index.embedding_status` update. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:316`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:317`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:318`]

Minimal change: in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`, add a helper such as `markReindexedRowsSuccessful(db, targetProfile)` and call it inside the completion transaction after `setActiveEmbedder(db, initialJob.toName, initialJob.toDim)` and before `setJobStatus(..., 'completed', ...)`. The helper should update only rows whose id exists in the target active shard's `vec_memories` and `vec_<dim>` tables for the target profile, clearing `failure_reason` and setting `embedding_generated_at` if absent. It must not blindly mark all `memory_index` rows successful if vector coverage is partial or the shard metadata does not match the target provider/model/dim.

Acceptance test: a reindex job that writes vectors for rows currently marked `failed`, `pending`, and `retry` must leave the job `completed`, flip the active pointer, and update only vector-present rows to `success`; a simulated partial-write job must not mark missing-vector rows `success`.

### F3. Durable code fix #2: retention must exclude never-attempted clean `pending` rows.

The current retention function first parks old `pending` / `retry` rows by max-age, then parks remaining queue overflow past `maxPending`, and both branches operate only on `embedding_status IN ('pending', 'retry')`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:474`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:484`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:489`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:493`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:495`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:508`]

Running retention after a tiny drain attempt is not enough. With a large clean backlog and a batch size of 5, a post-drain cap check would still park most never-attempted `pending` rows. The safer invariant is: retention may fail rows that have actually entered retry pressure, but it must not fail rows whose `retry_count = 0` and whose status is still clean `pending`.

Minimal change: add a helper predicate for retention candidates, and apply it to both max-age and cap branches:

```sql
embedding_status IN ('pending', 'retry')
AND (
  embedding_status = 'retry'
  OR COALESCE(retry_count, 0) > 0
)
```

Then move the top-level `runBackgroundJob()` retention call to after `processRetryQueue()` or remove that pre-drain call entirely, leaving queue selection to claim clean `pending` rows first. `getRetryQueue()` already treats `pending` as immediately eligible, and `processRetryQueue()` claims a row before embedding. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:536`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:539`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:563`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:870`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:889`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:997`]

Acceptance test: a table with 10,000 clean `pending` rows and default `maxPending=1,000` must not convert rows 1,001+ to `failed`; a table with attempted `retry` rows beyond the cap may still enforce retention.

### F4. Durable code fix #3: make retry config dynamic inside the daemon; bridge reconnect alone is insufficient.

`SPECKIT_RETRY_QUEUE_MAX_PENDING` and `SPECKIT_RETRY_QUEUE_MAX_AGE_MS` are read into module-scope constants. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:343`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:344`] The background job config is also initialized from env once, and `context-server` currently starts the retry job with hardcoded `intervalMs: 5 * 60 * 1000` and `batchSize: 5`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:351`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:352`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:353`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1828`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1829`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1830`]

The launcher reads `.env.local` / `.env` only before spawning the daemon, and if a lease is already held it bridges to the existing daemon instead of spawning a fresh process. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:49`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:346`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:348`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:414`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:416`] The bridge only connects stdio to the existing socket; it does not reload the daemon environment. [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:121`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:127`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:128`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:132`]

Minimal durable change: replace module-load retry constants with a `readRetryRuntimeConfig()` getter used by `enforceRetryRetentionLimits()`, `runBackgroundJob()`, and `startBackgroundJob()`. Also stop passing hardcoded interval/batch values from `context-server`; let `startBackgroundJob()` use current retry config unless explicit test options are supplied.

For `.env.local` edits in a long-lived daemon, re-reading `process.env` per drain is necessary but not sufficient if the daemon never reloads the env file. Either keep the operator requirement of a full lease-owner restart, or add an explicit daemon-side reload of known retry env keys on IPC bridge activity. A bridge-only change without dynamic retry config would still leave module-scope constants stale.

Sidecar respawn follows the same rule: sidecar workers are forked from the daemon and inherit the daemon's env snapshot. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:467`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:575`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:578`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:579`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:583`]

### F5. `memory_embedding_reconcile()` risk contract.

The reconcile tool should fail closed under these edge cases:

- Concurrent drain: acquire a write lock with `BEGIN IMMEDIATE`, recompute active profile and row predicates inside the transaction, and update rows only while they still match the dry-run predicates. Do not trust stale dry-run ids.
- Partial vectors: require both target `vec_memories` rowid coverage and target `vec_<dim>` row coverage before marking `success`. Row existence in only one surface is a diagnostic, not success.
- Zero-dim or mismatched vectors: fail before apply if the active profile dim is missing/zero or if main active metadata and shard metadata disagree. Active shard attach already validates profile metadata and creates dim-specific tables. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:415`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:440`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:483`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:748`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:782`]
- Embedder profile mismatch: compare provider, model, and dim from main active metadata and the attached shard before mutating any rows.
- Masked duplicates: reconcile masked failed rows to `success` if they have active vectors; do not prune them in this tool. Iteration 8 scoped pruning out because deletion is a separate retention/dedup problem. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-008.md:241`]
- Idempotency: a second dry-run after apply must report zero `vector_present_status_stale` rows and must not enqueue or rewrite already-successful rows.

### F6. Final one-line answers for Q1-Q6.

- Q1: Pending embeddings become `failed` through `enforceRetryRetentionLimits()`, which parks old `pending` / `retry` rows by max-age first and then parks queue overflow past `maxPending`.
- Q2: Yes, the retry manager embeds clean `pending` rows: it selects them first, claims them as `retry`, and commits `success` only after the vector write succeeds.
- Q3: `reindex --force` is file/dedup driven, not a DB status reset; it can report zero updates when files are unchanged or failed rows are masked by newer path-anchor rows.
- Q4: `embedder_set(name)` queues reindex; reindex writes vectors and flips the active embedder/job state, but currently does not commit `memory_index.embedding_status='success'`.
- Q5: The launcher owns a lease and bridges reconnects to the existing daemon; env config is read at daemon spawn/module load, so killed sidecar workers respawn with the old daemon env.
- Q6: The safe runbook is full lease-owner restart with correct env, reconcile vector-present stale rows first, reset only genuinely missing retention failures, then drain; defaults should become non-destructive for clean pending rows rather than cap-1000/max-age-24h failure parking.

## Questions Answered

- Q1-Q6 are synthesis-ready, with the durable prevention split explicit.
- The reindex status-commit answer is "yes, but only for target-profile vector-present rows".
- The retention answer is "exclude never-attempted clean pending rows; post-drain ordering alone is insufficient".
- The daemon-config answer is "dynamic retry config plus restart or explicit daemon env reload; bridge-only reconnect is insufficient".

## Questions Remaining

- No new research questions. Implementation follow-up must choose the public MCP registration path for `memory_embedding_reconcile()` and add focused tests.

## Next Focus

Iteration 10 should perform final synthesis only: collapse Q1-Q6, root causes, the operator runbook, and the three durable prevention fixes into `research.md` without opening new investigation threads.
