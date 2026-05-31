# Iteration 010 - Deep Granularity Correctness/Security Re-Examination

## Dimension

deep-granularity correctness/security re-examination: line-level review of embed-path error/ordering edges, daemon shutdown + WAL ordering, and P2-to-P1 escalation candidates.

## Files Reviewed

- `.opencode/bin/hf-model-server.cjs:459` - array-input capability latch rejects retryable transport failures as capability evidence.
- `.opencode/bin/hf-model-server.cjs:499` - batched output slicing rejects malformed output before returning rows.
- `.opencode/bin/hf-model-server.cjs:532` - batch inference tracks in-flight native runs and records timing only after success.
- `.opencode/bin/hf-model-server.cjs:657` - `/api/embed` uses batch path, falls back only on unambiguous array-input unsupported errors, and returns whole-request 500 on mismatch.
- `.opencode/bin/hf-model-server.cjs:790` - close destroys active sockets before optional model disposal.
- `.opencode/bin/hf-model-server.cjs:826` - dispose waits on tracked in-flight native runs, then validates single native session before dispose.
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:812` - client embed retry loop invalidates readiness latch on retryable mid-request failures.
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:844` - client rejects row-count mismatch before mapping results.
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:852` - client adopts/validates dimension, then validates every returned row before returning normalized vectors.
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:925` - batch mapping preserves null slots by prepared index.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1473` - fatal shutdown is single-entry guarded.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1501` - file watcher drains before vector index close.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1507` - vector index close runs before transport, IPC, shutdown hooks, and timer cleanup.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2044` - periodic WAL checkpoint interval uses `checkpointAllWal`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1325` - close path checkpoints tracked non-active connections before detach/close.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1367` - interval checkpoint is no-op when the active DB has already been closed.
- `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/timer-registry.ts:60` - registered timers are cleared during shutdown.
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:377` - reindex shard writer now checkpoints its WAL before close.
- `.opencode/bin/lib/model-server-supervision.cjs:1025` - idle monitor disarms safely.
- `.opencode/bin/lib/model-server-supervision.cjs:1031` - idle eviction skips live in-flight inference and never reaps a server that has not embedded.
- `.opencode/bin/lib/model-server-supervision.cjs:1225` - supervised EADDRINUSE reclaim refuses to unlink a live resident socket.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:415` - documented embedding env surface was checked against the open P2.
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening/spec.md:115` - stale file matrix pointer was re-examined for escalation.

## Findings by Severity

### P0

None.

### P1

None new.

No missed P0/data-loss path was found in the reviewed line-level surfaces. Batched server output rejects malformed dimensions/lengths before a response is returned; the client rejects row-count and per-row dimension mismatches before mapping results; retryable mid-request drops clear the readiness latch and retry once; disposal waits on tracked in-flight native inference before native-session disposal. Daemon shutdown drains file-watcher work before vector-index close, and periodic checkpoint intervals become harmless after close because `checkpointAllWal()` returns when `db` is null.

The prior WAL writer issue is fixed in the current code: `writeVectorsToShard()` checkpoints `wal_checkpoint(TRUNCATE)` in its `finally` block before closing the direct shard connection.

### P2

None new.

The three open P2s do not escalate to P1 in this pass:

- Direct `hf-model-server.cjs` startup can still unlink a stale-looking Unix socket without the supervised live-resident guard, but the production launcher path uses `model-server-supervision.cjs` and refuses live-resident reclaim. This remains an operational footgun, not a required correctness/security fix.
- The phase 005 spec file matrix still points idle eviction at `hf-model-server.cjs`, but `tasks.md` and `implementation-summary.md` document the design correction to `model-server-supervision.cjs`; traceability is noisy, not blocking.
- Missing ENV rows for `HF_EMBEDDINGS_PREFIX_DOC`, `HF_EMBEDDINGS_PREFIX_QUERY`, `EMBEDDER_REINDEX_BATCH_SIZE`, and `HF_LOCAL_MODEL` remain documentation debt. The runtime paths are code/test-visible, but the omission does not create a direct mis-execution or data-loss path.

## Traceability Checks

- `spec_code`: partial. The line-level code review confirms the current code has the reindex shard WAL checkpoint and daemon shutdown ordering expected after WAL-1/WAL-2 remediation.
- `checklist_evidence`: partial. Existing tests cover batch shape rejection, transient batch error non-latching, dispose-drain bounds, daemon drain-before-close ordering, close-time WAL checkpoints, and periodic `checkpointAllWal`.
- `skill_agent`: not applicable for this line-level pass.
- `agent_cross_runtime`: not applicable for this line-level pass.
- `feature_catalog_code`: partial. ENV docs remain advisory-incomplete for the open P2 env knobs.
- `playbook_capability`: not applicable for this line-level pass.

## Verdict

CONDITIONAL, `hasAdvisories=true`.

No new findings. Existing non-WAL P1 findings remain release-required, and P2 advisories remain open. WAL-1/WAL-2 were not re-reported because the current code includes the remediation.

## Next Dimension

Continue full 20-iteration review with adversarial line-level rechecks of the next highest-risk open P1 clusters: provider override/reindex cancellation, TCP perimeter, workflow lock fail-open, and launcher lease/listener lifecycle.

