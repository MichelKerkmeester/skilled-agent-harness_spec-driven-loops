// ---------------------------------------------------------------
// MODULE: Memory CRUD Delete Handler
// ---------------------------------------------------------------

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';

import type { MCPResponse } from './types';
import type { DeleteArgs, MemoryHashSnapshot } from './memory-crud-types';

async function handleMemoryDelete(args: DeleteArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();

  const { id, specFolder, confirm } = args;
  if (!id && !specFolder) throw new Error('Either id or specFolder is required');
  if (specFolder !== undefined && typeof specFolder !== 'string') throw new Error('specFolder must be a string');
  if (specFolder && !id && !confirm) throw new Error('Bulk delete requires confirm: true');

  let numericId: number | null = null;
  if (id !== undefined && id !== null) {
    numericId = typeof id === 'string' ? parseInt(id, 10) : id as number;
    if (isNaN(numericId)) {
      throw new Error('Invalid memory ID: must be a number');
    }
  }

  let deletedCount = 0;
  let checkpointName: string | null = null;
  const database = vectorIndex.getDb();

  if (numericId !== null) {
    const singleSnapshot = getMemoryHashSnapshot(database, numericId);
    deletedCount = vectorIndex.deleteMemory(numericId) ? 1 : 0;

    if (deletedCount > 0) {
      try {
        if (database) {
          causalEdges.init(database);
          causalEdges.deleteEdgesForMemory(String(numericId));
        }
      } catch (edgeErr: unknown) {
        const msg = toErrorMessage(edgeErr);
        console.warn(`[memory-delete] Failed to clean up causal edges for memory ${numericId}: ${msg}`);
      }

      appendMutationLedgerSafe(database, {
        mutationType: 'delete',
        reason: 'memory_delete: single memory delete',
        priorHash: singleSnapshot?.content_hash ?? null,
        newHash: mutationLedger.computeHash(`delete:${numericId}:${Date.now()}`),
        linkedMemoryIds: [numericId],
        decisionMeta: {
          tool: 'memory_delete',
          bulk: false,
          memoryId: numericId,
          specFolder: singleSnapshot?.spec_folder ?? null,
          filePath: singleSnapshot?.file_path ?? null,
        },
        actor: 'mcp:memory_delete',
      });
    }
  } else {
    const memories: { id: number }[] = vectorIndex.getMemoriesByFolder(specFolder as string);
    const deletedIds: number[] = [];
    const hashById = new Map<number, MemoryHashSnapshot>();

    if (database && typeof (database as unknown as Record<string, unknown>).prepare === 'function') {
      try {
        const rows = (database as unknown as {
          prepare: (sql: string) => { all: (folder: string) => MemoryHashSnapshot[] };
        }).prepare(`
          SELECT id, content_hash, spec_folder, file_path
          FROM memory_index
          WHERE spec_folder = ?
        `).all(specFolder as string);

        for (const row of rows) {
          hashById.set(row.id, row);
        }
      } catch {
        // Non-fatal: bulk delete still proceeds without per-memory hash snapshots
      }
    }

    if (memories.length > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      checkpointName = `pre-cleanup-${timestamp}`;
      try {
        checkpoints.createCheckpoint({
          name: checkpointName,
          specFolder,
          metadata: {
            reason: 'auto-checkpoint before bulk delete',
            memoryCount: memories.length,
          },
        });
        console.error(`[memory-delete] Created checkpoint: ${checkpointName}`);
      } catch (cpErr: unknown) {
        const message = toErrorMessage(cpErr);
        console.error(`[memory-delete] Failed to create checkpoint: ${message}`);
        if (!confirm) {
          return createMCPErrorResponse({
            tool: 'memory_delete',
            error: 'Failed to create backup checkpoint before bulk delete. Set confirm=true to proceed without backup.',
            startTime,
          });
        }
        console.warn('[memory-delete] Proceeding without backup (user confirmed)');
        checkpointName = null;
      }
    }

    if (database) {
      causalEdges.init(database);
      const bulkDeleteTx = database.transaction(() => {
        for (const memory of memories) {
          if (vectorIndex.deleteMemory(memory.id)) {
            deletedCount++;
            deletedIds.push(memory.id);
            try {
              causalEdges.deleteEdgesForMemory(String(memory.id));
            } catch (edgeErr: unknown) {
              const msg = toErrorMessage(edgeErr);
              console.warn(`[memory-delete] Failed to clean up causal edges for memory ${memory.id}: ${msg}`);
            }
          }
        }
      });
      bulkDeleteTx();
    } else {
      for (const memory of memories) {
        if (vectorIndex.deleteMemory(memory.id)) {
          deletedCount++;
          deletedIds.push(memory.id);
        }
      }
    }

    for (const deletedId of deletedIds) {
      const snapshot = hashById.get(deletedId) ?? null;
      appendMutationLedgerSafe(database, {
        mutationType: 'delete',
        reason: 'memory_delete: bulk delete by spec folder',
        priorHash: snapshot?.content_hash ?? null,
        newHash: mutationLedger.computeHash(`bulk-delete:${deletedId}:${Date.now()}`),
        linkedMemoryIds: [deletedId],
        decisionMeta: {
          tool: 'memory_delete',
          bulk: true,
          specFolder,
          checkpoint: checkpointName,
          memoryId: deletedId,
          filePath: snapshot?.file_path ?? null,
        },
        actor: 'mcp:memory_delete',
      });
    }
  }

  if (deletedCount > 0) {
    triggerMatcher.clearCache();
    toolCache.invalidateOnWrite('delete', { specFolder });
  }

  const summary = deletedCount > 0
    ? `Deleted ${deletedCount} memory(s)`
    : 'No memories found to delete';

  const hints: string[] = [];
  if (checkpointName) {
    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
  }
  if (deletedCount === 0) {
    hints.push('Use memory_list() to find existing memories');
  }

  const data: Record<string, unknown> = { deleted: deletedCount };
  if (checkpointName) {
    data.checkpoint = checkpointName;
    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
  }

  return createMCPSuccessResponse({
    tool: 'memory_delete',
    summary,
    data,
    hints,
  });
}

export { handleMemoryDelete };
