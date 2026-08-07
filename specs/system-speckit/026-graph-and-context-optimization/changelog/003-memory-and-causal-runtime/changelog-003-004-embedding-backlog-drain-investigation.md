---
title: "Memory Runtime 004: Embedding Backlog Drain and Daemon-Config Investigation"
description: "10-iteration deep-research loop identified a compound root cause blocking the mk-spec-memory embedding pipeline from draining to 0 failed/0 pending. Four runtime fixes shipped: daemon call-site env override removed, active-embedder provider pointer persisted, provider-singleton invalidation added. Ollama reachability probe added before the hf-local fallback. E_LINEAGE stale-key re-save bug also fixed. Retry queue drained to 0, 28843 success rows confirmed."
trigger_phrases:
  - "embedding backlog drain investigation"
  - "mk-spec-memory retry queue non-convergence"
  - "daemon env override fix"
  - "provider singleton invalidation"
  - "E_LINEAGE stale key fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

The mk-spec-memory embedding pipeline had accumulated a backlog of approximately 17,000 rows that would not drain to 0 failed/0 pending. A 10-iteration deep-research loop (cli-codex gpt-5.5 xhigh) determined the root cause was compound: the embedder_set and reindex completion path never committed `memory_index.embedding_status` after writing vectors. `enforceRetentionLimits()` parked clean pending rows as failed before the drain could reach them. The persistent daemon's retry-interval and batch-size env values were overridden at the call site on every start, making tuned env vars ineffective.

Four runtime fixes landed in two commits on 2026-05-28. Fix A removed the hardcoded `startBackgroundJob` options that clobbered the tuned env config. Fix B persisted the active-embedder provider identifier on reindex completion. Fix C added `invalidateProviderSingleton()` to force re-resolution after the active pointer flip. Fix D added an `isOllamaReachable()` HTTP probe before the hf-local fallback to stop the provider-flap silent demotion. A fifth fix (Fix E) resolved an opaque E081 error traced to E_LINEAGE thrown when a spec-folder move left predecessor `logical_key` values stale: the lineage-state handler now re-roots the chain under the current identity rather than rejecting the save.

After the fixes, a fresh daemon drained the retry queue at batch 100 per 5 seconds. A `memory_embedding_reconcile(apply)` run reset 579 retention false-failures and 1322 success-coverage rows. Final store: 28843 success, 0 retry, 0 pending, 22 genuine failures (11 null-content, 11 provider-error) left untouched.

### Added

- `invalidateProviderSingleton()` export in `shared/embeddings.ts`, called after the active-pointer flip in `reindex.ts`
- `isOllamaReachable()` HTTP probe in `shared/embeddings/factory.ts` with re-resolution when cached provider is unhealthy and ollama is reachable
- Two vitest cases in `embeddings.vitest.ts` locking both directions of the provider-flap fix
- Regression test `T070-4` in `create-record-lineage-regressions.vitest.ts` covering the stale-key re-root path
- 10-iteration research artifact set under `research/iterations/` with final synthesis in `research/research.md`

### Changed

- `mcp_server/context-server.ts`: `startBackgroundJob()` call no longer spreads hardcoded `{intervalMs, batchSize}` options after the env-derived config. Actual config is now logged at startup.
- `mcp_server/lib/embedders/reindex.ts`: reindex completion now derives the provider from `manifest.backend` and calls `setActiveEmbedder(db, name, dim, provider)` with a resolved provider string. Also calls `invalidateProviderSingleton()` after the pointer flip.
- `mcp_server/lib/storage/lineage-state.ts`: `recordLineageTransition` re-checks the predecessor's current row identity when `predecessor.logical_key` does not match the new row key. Stale-key mismatch is re-rooted rather than rejected. Cross-identity mismatch is still rejected (T070-3 preserved).

### Fixed

- Daemon ignored tuned `SPECKIT_RETRY_INTERVAL_MS` and `SPECKIT_RETRY_QUEUE_BATCH_SIZE` env vars. The call-site override in `context-server.ts` clobbered them on every daemon start. Removing the override restored the tuned 100/5s drain rate.
- Active-embedder provider field was left empty after reindex completion because `setActiveEmbedder` was called without the provider argument. Provider is now derived from `manifest.backend` and persisted.
- Provider singleton cached indefinitely. After an embedder swap, `getProvider()` continued using the old provider until restart. `invalidateProviderSingleton()` forces re-resolution after the active-pointer flip.
- Post-crash daemon silently demoted to unhealthy hf-local fallback even when ollama was up. The one-shot DB read in `resolveProvider()` had no server probe, so a WAL contention miss caused a permanent cache of the wrong provider. The `isOllamaReachable()` probe overrides the fallback when ollama is reachable.
- `recordLineageTransition` threw E_LINEAGE (surfaced as opaque E081) after spec-folder moves left the predecessor `logical_key` stale. Re-root logic corrects the chain without breaking the cross-identity rejection for genuinely different files.

### Verification

| Test | Status | Notes |
|------|--------|-------|
| Delta JSONL parse | Pass | `jq -c . research/deltas/iter-010.jsonl` exits 0 |
| State-log canonical record | Pass | Last line is `type:"iteration"`, `iteration:10`, `status:"complete"` |
| Spec validation | Pass | `validate.sh --strict` passed with 0 errors and 0 warnings |
| Build (mcp-server + shared) | Pass | `tsc --build` green both workspaces after all fixes |
| Unit tests (changed areas) | Pass | 71 pass across embedder-reindex, embedder-set, retry-manager, default-model areas |
| Live drain (T021) | Pass | Retry queue drained to 0 at batch 100/5s. Reconcile re-embed produced 28843 success, 0 retry, 0 pending, coverage 0. 22 genuine failures remain. |
| E_LINEAGE regression (T070-4) | Pass | Isolated `handleMemorySave({force})` against production-DB copy now returns success where it previously threw |
| Research convergence | Pass | 10-iteration loop converged. Synthesis in `research/research.md`. |

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/context-server.ts` | Removed hardcoded `startBackgroundJob` options that overrode tuned env config (Fix A) |
| `mcp_server/lib/embedders/reindex.ts` | Provider derived from `manifest.backend` and passed to `setActiveEmbedder`. Calls `invalidateProviderSingleton()` after pointer flip (Fixes B and C). |
| `mcp_server/lib/providers/embeddings.ts` | Active-provider persistence contract updated to accept provider string |
| `shared/embeddings.ts` | `invalidateProviderSingleton()` export added. `getProvider()` re-resolves when cached provider is unhealthy and ollama is reachable (Fixes C and D). |
| `shared/embeddings/factory.ts` | `isOllamaReachable()` HTTP probe added. `createEmbeddingsProvider` overrides hf-local fallback to ollama when reachable (Fix D). |
| `mcp_server/lib/storage/lineage-state.ts` | Re-root logic for stale predecessor `logical_key` (Fix E) |
| `mcp_server/tests/embedder-reindex.vitest.ts` | New cases covering active-provider persistence and singleton invalidation |
| `mcp_server/tests/embeddings.vitest.ts` | Two new cases locking both directions of the provider-flap fix |
| `mcp_server/tests/create-record-lineage-regressions.vitest.ts` | T070-4 added for stale-key re-root path |
| `research/iterations/iteration-010.md` (NEW) | Final evidence-cited consolidation for Q1-Q6. Runbook, durable fixes, residual risks. |
| `research/research.md` | 10-iteration final synthesis with root-cause evidence and drain procedure |

### Follow-Ups

- `memory_embedding_reconcile()` remains a proposed maintenance tool and is not yet an available MCP handler. A follow-on packet should implement it as a guarded dry-run/apply tool.
- 22 genuine embedding failures remain in the store: 11 null-content rows and 11 provider-error rows from the flap era. These are not retention-scoped and were not addressed in this packet.
- Live DB counts drifted across snapshots during the investigation. The operator runbook requires live preflight counts before any apply-mode reconcile run.
