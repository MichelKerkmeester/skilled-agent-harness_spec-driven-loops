// ────────────────────────────────────────────────────────────────
// MODULE: Memory Embedding Reconcile Handler
// ────────────────────────────────────────────────────────────────
import { checkDatabaseUpdated } from '../core/index.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import { runMemoryEmbeddingReconcile, ActiveShardGuardError } from '../lib/embedders/embedding-reconcile.js';
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';
import { recordMaintenanceRun } from '../lib/observability/retrieval-observability.js';

import type { MCPResponse } from './types.js';
import type { EmbeddingReconcileArgs } from '../lib/embedders/embedding-reconcile.js';

/** Handle the memory_embedding_reconcile MCP tool request. */
async function handleMemoryEmbeddingReconcile(args: EmbeddingReconcileArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_embedding_reconcile');
  await checkDatabaseUpdated();

  const mode = args?.mode === 'apply' ? 'apply' : 'dry-run';

  const database = vectorIndex.getDb();
  if (!database) {
    recordMaintenanceRun('memory_embedding_reconcile', { status: 'error' });
    return createMCPErrorResponse({
      tool: 'memory_embedding_reconcile',
      error: 'Embedding reconcile aborted: database unavailable',
      code: 'E_DB_UNAVAILABLE',
      details: { mode },
      recovery: {
        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
        severity: 'error',
      },
    });
  }

  // Best-effort: guarantee the active shard is attached as active_vec. The
  // reconcile verifies it and fails closed if it is still unavailable.
  // Attach (or re-point) the canonical active shard as active_vec. This is the
  // path authority: it detaches any wrong/stale shard and attaches the shard
  // resolved from the active embedder profile. For apply, a failed attach is
  // FATAL — proceeding could mutate rows against a stale same-profile shard
  // (the metadata-only guard can't tell two same-profile shard files apart).
  try {
    vectorIndex.attachActiveVectorShardForActiveProfile(database);
  } catch (attachErr: unknown) {
    if (mode === 'apply') {
      recordMaintenanceRun('memory_embedding_reconcile', { status: 'error' });
      return createMCPErrorResponse({
        tool: 'memory_embedding_reconcile',
        error: `Embedding reconcile aborted: could not attach the active vector shard (${toErrorMessage(attachErr)})`,
        code: 'E_ACTIVE_SHARD_UNVERIFIED',
        details: { mode },
        recovery: {
          hint: 'Ensure the active embedder shard exists and the daemon is healthy, then retry; restart the MCP server if it persists.',
          actions: ['Run embedder_status()', 'Run memory_health()'],
          severity: 'error',
        },
      });
    }
    // dry-run: non-fatal; verifyActiveShard reports activeShardVerified=false.
  }

  try {
    const result = runMemoryEmbeddingReconcile(database, args ?? {});
    const stale = result.buckets.vector_present_status_stale.count;
    const missing = result.buckets.missing_active_vector_retry_eligible.count;

    const coverageReset = result.applied?.successCoverageReset ?? 0;
    const summary = result.mode === 'apply'
      ? `Reconciled ${result.applied?.reconciledToSuccess ?? 0} vector-present row(s) to success; reset ${result.applied?.resetToRetry ?? 0} missing-vector row(s) to retry${coverageReset ? `; repaired ${coverageReset} success-coverage row(s) to retry` : ''}`
      : `Dry-run: ${stale} vector-present stale row(s), ${missing} missing-vector retry-eligible; no rows mutated`;

    const hints: string[] = [];
    if (!result.safety.activeShardVerified) {
      hints.push(`Active shard not verified (${result.safety.reason ?? 'unknown'}); no rows were counted or mutated.`);
    } else if (result.mode === 'dry-run' && stale > 0) {
      hints.push('Run memory_embedding_reconcile({ mode: "apply" }) to converge embedding_status to success.');
    }
    recordMaintenanceRun('memory_embedding_reconcile', {
      status: 'success',
      counts: {
        vectorPresentStatusStale: stale,
        missingActiveVectorRetryEligible: missing,
        reconciledToSuccess: result.applied?.reconciledToSuccess ?? 0,
        resetToRetry: result.applied?.resetToRetry ?? 0,
        successCoverageReset: coverageReset,
      },
      staleCandidates: stale + missing,
    });

    return createMCPSuccessResponse({
      tool: 'memory_embedding_reconcile',
      summary,
      data: result,
      hints,
    });
  } catch (error: unknown) {
    // Health reads last-run state; a failed run must be visible there, not
    // only in the error response of the call that happened to observe it.
    recordMaintenanceRun('memory_embedding_reconcile', { status: 'error' });
    if (error instanceof ActiveShardGuardError) {
      return createMCPErrorResponse({
        tool: 'memory_embedding_reconcile',
        error: error.message,
        code: error.code,
        details: { mode },
        recovery: {
          hint: 'Ensure the active embedder shard is attached and matches the active pointer; restart the MCP server if needed.',
          actions: ['Run embedder_status()', 'Run memory_health()'],
          severity: 'error',
        },
      });
    }
    return createMCPErrorResponse({
      tool: 'memory_embedding_reconcile',
      error: `Embedding reconcile failed: ${toErrorMessage(error)}`,
      code: 'E_EMBEDDING_RECONCILE_FAILED',
      details: { mode },
      recovery: {
        hint: 'Inspect memory_index and the active vector shard state, then retry in dry-run.',
        actions: ['Run memory_health()', 'Retry memory_embedding_reconcile({ mode: "dry-run" })'],
        severity: 'error',
      },
    });
  }
}

export { handleMemoryEmbeddingReconcile };
