// ───────────────────────────────────────────────────────────────
// HANDLER: CHECKPOINTS
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. LIB MODULE IMPORTS
────────────────────────────────────────────────────────────────*/

const LIB_DIR = path.join(__dirname, '..', 'lib');
const checkpoints = require(path.join(LIB_DIR, 'storage', 'checkpoints.js'));
const vectorIndex = require(path.join(LIB_DIR, 'search', 'vector-index.js'));
const confidenceTracker = require(path.join(LIB_DIR, 'scoring', 'confidence-tracker.js'));

// REQ-019: Standardized Response Structure
const { createMCPSuccessResponse } = require(path.join(LIB_DIR, 'response', 'envelope.js'));

/* ─────────────────────────────────────────────────────────────
   2. CHECKPOINT CREATE HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle checkpoint_create tool - create a new checkpoint
 * @param {Object} args - Tool arguments
 * @param {string} args.name - Checkpoint name (required)
 * @param {string} [args.specFolder] - Optional spec folder to associate
 * @param {Object} [args.metadata] - Optional metadata to store
 * @returns {Promise<Object>} MCP response with checkpoint details
 */
async function handle_checkpoint_create(args) {
  const { name, specFolder: spec_folder, metadata } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  // Validate specFolder parameter
  if (spec_folder !== undefined && typeof spec_folder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const result = checkpoints.createCheckpoint(name, { specFolder: spec_folder, metadata });

  // REQ-019: Use standardized response envelope
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
    ]
  });
}

/* ─────────────────────────────────────────────────────────────
   3. CHECKPOINT LIST HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle checkpoint_list tool - list all checkpoints
 * @param {Object} args - Tool arguments
 * @param {string} [args.specFolder] - Optional filter by spec folder
 * @param {number} [args.limit=50] - Maximum checkpoints to return
 * @returns {Promise<Object>} MCP response with checkpoint list
 */
async function handle_checkpoint_list(args) {
  const { specFolder: spec_folder, limit: raw_limit = 50 } = args;

  // Validate specFolder parameter
  if (spec_folder !== undefined && typeof spec_folder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  // T120: Validate numeric limit parameter
  const limit = (typeof raw_limit === 'number' && Number.isFinite(raw_limit) && raw_limit > 0)
    ? Math.min(Math.floor(raw_limit), 100)
    : 50;

  const results = checkpoints.listCheckpoints({ specFolder: spec_folder, limit });

  // REQ-019: Use standardized response envelope
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
      : []
  });
}

/* ─────────────────────────────────────────────────────────────
   4. CHECKPOINT RESTORE HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle checkpoint_restore tool - restore from a checkpoint
 * @param {Object} args - Tool arguments
 * @param {string} args.name - Checkpoint name to restore (required)
 * @param {boolean} [args.clearExisting=false] - Clear existing data before restore
 * @returns {Promise<Object>} MCP response with restore result
 */
async function handle_checkpoint_restore(args) {
  const { name, clearExisting: clear_existing = false } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  const result = checkpoints.restoreCheckpoint(name, { clearExisting: clear_existing });

  // REQ-019: Use standardized response envelope
  return createMCPSuccessResponse({
    tool: 'checkpoint_restore',
    summary: `Checkpoint "${name}" restored successfully`,
    data: {
      success: true,
      restored: result
    },
    hints: clear_existing
      ? ['Previous data was cleared before restore']
      : ['Restore merged with existing data - duplicates may exist']
  });
}

/* ─────────────────────────────────────────────────────────────
   5. CHECKPOINT DELETE HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle checkpoint_delete tool - delete a checkpoint
 * @param {Object} args - Tool arguments
 * @param {string} args.name - Checkpoint name to delete (required)
 * @returns {Promise<Object>} MCP response with deletion status
 */
async function handle_checkpoint_delete(args) {
  const { name } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  const success = checkpoints.deleteCheckpoint(name);

  // REQ-019: Use standardized response envelope
  const summary = success
    ? `Checkpoint "${name}" deleted successfully`
    : `Checkpoint "${name}" not found`;

  return createMCPSuccessResponse({
    tool: 'checkpoint_delete',
    summary,
    data: { success },
    hints: success
      ? []
      : ['Use checkpoint_list() to see available checkpoints']
  });
}

/* ─────────────────────────────────────────────────────────────
   6. MEMORY VALIDATE HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle memory_validate tool - record validation feedback for a memory
 * @param {Object} args - Tool arguments
 * @param {number|string} args.id - Memory ID to validate (required)
 * @param {boolean} args.wasUseful - Whether the memory was useful (required)
 * @returns {Promise<Object>} MCP response with validation result
 */
async function handle_memory_validate(args) {
  const { id, wasUseful: was_useful } = args;

  if (id === undefined || id === null) {
    throw new Error('id is required');
  }

  if (typeof was_useful !== 'boolean') {
    throw new Error('wasUseful is required and must be a boolean');
  }

  const database = vectorIndex.getDb();
  const result = confidenceTracker.recordValidation(database, id, was_useful);

  // REQ-019: Use standardized response envelope
  const summary = was_useful
    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;

  const hints = [];
  if (result.promotionEligible) {
    hints.push('Memory eligible for promotion to critical tier');
  }
  if (!was_useful && result.validationCount > 3) {
    hints.push('Consider updating or deleting this memory if consistently unhelpful');
  }

  return createMCPSuccessResponse({
    tool: 'memory_validate',
    summary,
    data: {
      memoryId: id,
      wasUseful: was_useful,
      confidence: result.confidence,
      validationCount: result.validationCount,
      promotionEligible: result.promotionEligible
    },
    hints
  });
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // snake_case exports
  handle_checkpoint_create,
  handle_checkpoint_list,
  handle_checkpoint_restore,
  handle_checkpoint_delete,
  handle_memory_validate,

  // Backward compatibility aliases
  handleCheckpointCreate: handle_checkpoint_create,
  handleCheckpointList: handle_checkpoint_list,
  handleCheckpointRestore: handle_checkpoint_restore,
  handleCheckpointDelete: handle_checkpoint_delete,
  handleMemoryValidate: handle_memory_validate
};
