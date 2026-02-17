// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. LIB MODULE IMPORTS
--------------------------------------------------------------- */

import * as checkpoints from '../lib/storage/checkpoints';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as confidenceTracker from '../lib/scoring/confidence-tracker';
import { checkDatabaseUpdated } from '../core';
import { requireDb, toErrorMessage } from '../utils';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse } from '../lib/response/envelope';

// Shared handler types
import type { Database, MCPResponse } from './types';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

interface CheckpointCreateArgs {
  name: string;
  specFolder?: string;
  metadata?: Record<string, unknown>;
}

interface CheckpointListArgs {
  specFolder?: string;
  limit?: number;
}

interface CheckpointRestoreArgs {
  name: string;
  clearExisting?: boolean;
}

interface CheckpointDeleteArgs {
  name: string;
}

interface MemoryValidateArgs {
  id: number | string;
  wasUseful: boolean;
}

interface ValidationResult {
  confidence: number;
  validationCount: number;
  promotionEligible: boolean;
}

/* ---------------------------------------------------------------
   3. CHECKPOINT CREATE HANDLER
--------------------------------------------------------------- */

/** Handle checkpoint_create tool - snapshots the current memory state for rollback */
async function handleCheckpointCreate(args: CheckpointCreateArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { name, specFolder: spec_folder, metadata } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  if (spec_folder !== undefined && typeof spec_folder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const result = checkpoints.createCheckpoint({ name, specFolder: spec_folder, metadata });

  return createMCPSuccessResponse({
    tool: 'checkpoint_create',
    summary: `Checkpoint "${name}" created successfully`,
    data: {
      success: true,
      checkpoint: result
    },
    hints: [
      `Restore with: checkpoint_restore({ name: "${name}" })`,
      `Delete with: checkpoint_delete({ name: "${name}" })`
    ],
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   4. CHECKPOINT LIST HANDLER
--------------------------------------------------------------- */

/** Handle checkpoint_list tool - returns available checkpoints filtered by spec folder */
async function handleCheckpointList(args: CheckpointListArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { specFolder: spec_folder, limit: raw_limit = 50 } = args;

  if (spec_folder !== undefined && typeof spec_folder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const limit = (typeof raw_limit === 'number' && Number.isFinite(raw_limit) && raw_limit > 0)
    ? Math.min(Math.floor(raw_limit), 100)
    : 50;

  const results = checkpoints.listCheckpoints(spec_folder ?? null, limit);

  const summary = results.length > 0
    ? `Found ${results.length} checkpoint(s)`
    : 'No checkpoints found';

  return createMCPSuccessResponse({
    tool: 'checkpoint_list',
    summary,
    data: {
      count: results.length,
      checkpoints: results
    },
    hints: results.length === 0
      ? ['Create a checkpoint with checkpoint_create({ name: "my-checkpoint" })']
      : [],
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   5. CHECKPOINT RESTORE HANDLER
--------------------------------------------------------------- */

/** Handle checkpoint_restore tool - restores memory state from a named checkpoint */
async function handleCheckpointRestore(args: CheckpointRestoreArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { name, clearExisting: clear_existing = false } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  const result = checkpoints.restoreCheckpoint(name, clear_existing);

  // T102 FIX: Rebuild search indexes after checkpoint restore
  // Without this, restored memories are invisible to search until server restart.
  // Matches the startup rebuild sequence in context-server.ts (lines 776-791).
  try {
    vectorIndex.clearConstitutionalCache(null);
    vectorIndex.clearSearchCache(null);

    const database = vectorIndex.getDb();
    if (database && bm25Index.isBm25Enabled()) {
      bm25Index.getIndex().rebuildFromDatabase(database);
    }

    triggerMatcher.refreshTriggerCache();
  } catch (rebuildErr: unknown) {
    // Index rebuild failure is non-fatal — indexes will self-heal on next query or restart
    console.error('[T102] Index rebuild after checkpoint restore failed:', toErrorMessage(rebuildErr));
  }

  return createMCPSuccessResponse({
    tool: 'checkpoint_restore',
    summary: `Checkpoint "${name}" restored successfully`,
    data: {
      success: true,
      restored: result
    },
    hints: clear_existing
      ? ['Previous data was cleared before restore', 'Search indexes rebuilt']
      : ['Restore merged with existing data - duplicates may exist', 'Search indexes rebuilt'],
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   6. CHECKPOINT DELETE HANDLER
--------------------------------------------------------------- */

/** Handle checkpoint_delete tool - permanently removes a named checkpoint */
async function handleCheckpointDelete(args: CheckpointDeleteArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { name } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  const success: boolean = checkpoints.deleteCheckpoint(name);

  const summary = success
    ? `Checkpoint "${name}" deleted successfully`
    : `Checkpoint "${name}" not found`;

  return createMCPSuccessResponse({
    tool: 'checkpoint_delete',
    summary,
    data: { success },
    hints: success
      ? []
      : ['Use checkpoint_list() to see available checkpoints'],
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   7. MEMORY VALIDATE HANDLER
--------------------------------------------------------------- */

/** Handle memory_validate tool - records user validation feedback to adjust confidence */
async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { id, wasUseful } = args;

  if (id === undefined || id === null) {
    throw new Error('id is required');
  }

  if (typeof wasUseful !== 'boolean') {
    throw new Error('wasUseful is required and must be a boolean');
  }

  vectorIndex.initializeDb();
  const database = requireDb();
  const result: ValidationResult = confidenceTracker.recordValidation(database, Number(id), wasUseful);

  const summary = wasUseful
    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;

  const hints: string[] = [];
  if (result.promotionEligible) {
    hints.push('Memory eligible for promotion to critical tier');
  }
  if (!wasUseful && result.validationCount > 3) {
    hints.push('Consider updating or deleting this memory if consistently unhelpful');
  }

  return createMCPSuccessResponse({
    tool: 'memory_validate',
    summary,
    data: {
      memoryId: id,
      wasUseful: wasUseful,
      confidence: result.confidence,
      validationCount: result.validationCount,
      promotionEligible: result.promotionEligible
    },
    hints,
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   8. EXPORTS
--------------------------------------------------------------- */

export {
  handleCheckpointCreate,
  handleCheckpointList,
  handleCheckpointRestore,
  handleCheckpointDelete,
  handleMemoryValidate,
};

// Backward-compatible aliases (snake_case)
const handle_checkpoint_create = handleCheckpointCreate;
const handle_checkpoint_list = handleCheckpointList;
const handle_checkpoint_restore = handleCheckpointRestore;
const handle_checkpoint_delete = handleCheckpointDelete;
const handle_memory_validate = handleMemoryValidate;

export {
  handle_checkpoint_create,
  handle_checkpoint_list,
  handle_checkpoint_restore,
  handle_checkpoint_delete,
  handle_memory_validate,
};
