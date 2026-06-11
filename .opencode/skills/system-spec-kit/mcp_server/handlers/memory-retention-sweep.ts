// ────────────────────────────────────────────────────────────────
// MODULE: Memory Retention Sweep Handler
// ────────────────────────────────────────────────────────────────
import { checkDatabaseUpdated } from '../core/index.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import { runMemoryRetentionSweep } from '../lib/governance/memory-retention-sweep.js';
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';
import { recordMaintenanceRun } from '../lib/observability/retrieval-observability.js';

import type { MCPResponse } from './types.js';
import type { MemoryRetentionSweepArgs } from '../lib/governance/memory-retention-sweep.js';

/** Handle the memory_retention_sweep MCP tool request. */
async function handleMemoryRetentionSweep(args: MemoryRetentionSweepArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_retention_sweep');
  await checkDatabaseUpdated();

  const database = vectorIndex.getDb();
  if (!database) {
    recordMaintenanceRun('memory_retention_sweep', { status: 'error' });
    return createMCPErrorResponse({
      tool: 'memory_retention_sweep',
      error: 'Retention sweep aborted: database unavailable',
      code: 'E_DB_UNAVAILABLE',
      details: {
        dryRun: args?.dryRun === true,
      },
      recovery: {
        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
        severity: 'error',
      },
    });
  }

  try {
    const result = runMemoryRetentionSweep(database, { dryRun: args?.dryRun === true });
    const protectedSuffix = result.protectedCount > 0
      ? `; protected ${result.protectedCount} high-tier/pinned row(s)`
      : '';
    const summary = result.dryRun
      ? `Dry-run found ${result.candidates.length} expired memory row(s); no rows deleted${protectedSuffix}`
      : `Swept ${result.swept} expired memory row(s); retained ${result.retained}${protectedSuffix}`;

    const hints: string[] = [];
    if (result.ledgerRecorded === false) {
      hints.push('Mutation ledger append failed; governance audit/history rows were still recorded.');
    }
    if (result.dryRun && result.candidates.length > 0) {
      hints.push('Run memory_retention_sweep({ dryRun: false }) to delete expired rows.');
    }
    recordMaintenanceRun('memory_retention_sweep', {
      status: 'success',
      counts: {
        swept: result.swept,
        retained: result.retained,
        candidates: result.candidates.length,
        protectedCount: result.protectedCount,
      },
      staleCandidates: result.candidates.length,
    });

    return createMCPSuccessResponse({
      tool: 'memory_retention_sweep',
      summary,
      data: {
        swept: result.swept,
        retained: result.retained,
        dryRun: result.dryRun,
        durationMs: result.durationMs,
        candidates: result.dryRun ? result.candidates : result.candidates.map((candidate) => ({
          id: candidate.id,
          deleteAfter: candidate.deleteAfter,
          specFolder: candidate.specFolder,
          filePath: candidate.filePath,
        })),
        deletedIds: result.deletedIds,
        protectedCount: result.protectedCount,
        protectedIds: result.protectedIds,
        ledgerRecorded: result.ledgerRecorded,
      },
      hints,
    });
  } catch (error: unknown) {
    recordMaintenanceRun('memory_retention_sweep', { status: 'error' });
    return createMCPErrorResponse({
      tool: 'memory_retention_sweep',
      error: `Retention sweep failed: ${toErrorMessage(error)}`,
      code: 'E_RETENTION_SWEEP_FAILED',
      details: {
        dryRun: args?.dryRun === true,
      },
      recovery: {
        hint: 'Inspect memory_index and governance_audit schema state, then retry the sweep.',
        actions: ['Run memory_health()', 'Retry memory_retention_sweep({ dryRun: true })'],
        severity: 'error',
      },
    });
  }
}

export { handleMemoryRetentionSweep };
