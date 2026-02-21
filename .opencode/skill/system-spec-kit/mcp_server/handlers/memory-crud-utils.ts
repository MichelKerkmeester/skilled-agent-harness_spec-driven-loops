// ---------------------------------------------------------------
// MODULE: Memory CRUD Utilities
// ---------------------------------------------------------------

import * as mutationLedger from '../lib/storage/mutation-ledger';
import { toErrorMessage } from '../utils';

import type { Database } from './types';
import type { MemoryHashSnapshot, MutationLedgerInput } from './memory-crud-types';

function getMemoryHashSnapshot(database: Database | null, memoryId: number): MemoryHashSnapshot | null {
  if (!database || typeof (database as unknown as Record<string, unknown>).prepare !== 'function') {
    return null;
  }

  try {
    const row = (database as unknown as {
      prepare: (sql: string) => { get: (id: number) => MemoryHashSnapshot | undefined };
    }).prepare(`
      SELECT id, content_hash, spec_folder, file_path
      FROM memory_index
      WHERE id = ?
    `).get(memoryId);

    return row ?? null;
  } catch {
    return null;
  }
}

function appendMutationLedgerSafe(database: Database | null, input: MutationLedgerInput): void {
  if (!database) {
    return;
  }

  try {
    mutationLedger.initLedger(database as unknown as Parameters<typeof mutationLedger.initLedger>[0]);
    mutationLedger.appendEntry(database as unknown as Parameters<typeof mutationLedger.appendEntry>[0], {
      mutation_type: input.mutationType,
      reason: input.reason,
      prior_hash: input.priorHash,
      new_hash: input.newHash,
      linked_memory_ids: input.linkedMemoryIds,
      decision_meta: input.decisionMeta,
      actor: input.actor,
      session_id: input.sessionId ?? null,
    });
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn(`[memory-crud] mutation ledger append failed: ${message}`);
  }
}

function safeJsonParse(str: string | null | undefined, fallback: unknown[] = []): unknown[] {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export {
  getMemoryHashSnapshot,
  appendMutationLedgerSafe,
  safeJsonParse,
};
