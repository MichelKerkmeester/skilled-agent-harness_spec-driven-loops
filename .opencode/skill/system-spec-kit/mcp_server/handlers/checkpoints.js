/**
 * @fileoverview Checkpoint and validation handler functions for the MCP context server.
 * Handles checkpoint create/list/restore/delete and memory validation operations.
 *
 * Extracted from context-server.js for modularity and maintainability.
 *
 * @module mcp_server/handlers/checkpoints
 */
'use strict';

const path = require('path');

/* ───────────────────────────────────────────────────────────────
   LIB MODULE IMPORTS
   ─────────────────────────────────────────────────────────────── */

const LIB_DIR = path.join(__dirname, '..', 'lib');
const checkpoints = require(path.join(LIB_DIR, 'checkpoints.js'));
const vectorIndex = require(path.join(LIB_DIR, 'vector-index.js'));
const confidenceTracker = require(path.join(LIB_DIR, 'confidence-tracker.js'));

/* ───────────────────────────────────────────────────────────────
   CHECKPOINT CREATE HANDLER
   ─────────────────────────────────────────────────────────────── */

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

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        checkpoint: result,
        message: `Checkpoint "${name}" created successfully`
      }, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   CHECKPOINT LIST HANDLER
   ─────────────────────────────────────────────────────────────── */

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

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        count: results.length,
        checkpoints: results
      }, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   CHECKPOINT RESTORE HANDLER
   ─────────────────────────────────────────────────────────────── */

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

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        restored: result,
        message: `Checkpoint "${name}" restored successfully`
      }, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   CHECKPOINT DELETE HANDLER
   ─────────────────────────────────────────────────────────────── */

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

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success,
        message: success
          ? `Checkpoint "${name}" deleted successfully`
          : `Checkpoint "${name}" not found`
      }, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   MEMORY VALIDATE HANDLER
   ─────────────────────────────────────────────────────────────── */

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

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        memoryId: id,
        wasUseful: was_useful,
        confidence: result.confidence,
        validationCount: result.validationCount,
        promotionEligible: result.promotionEligible,
        message: was_useful
          ? `Positive validation recorded. Confidence: ${result.confidence.toFixed(2)}`
          : `Negative validation recorded. Confidence: ${result.confidence.toFixed(2)}`
      }, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
   ─────────────────────────────────────────────────────────────── */

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
