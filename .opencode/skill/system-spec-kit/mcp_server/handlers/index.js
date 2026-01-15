/**
 * @fileoverview Re-exports for handlers modules
 * @module mcp_server/handlers
 */
'use strict';

const memorySearch = require('./memory-search');
const memoryTriggers = require('./memory-triggers');
const memorySave = require('./memory-save');
const memoryCrud = require('./memory-crud');
const memoryIndex = require('./memory-index');
const checkpoints = require('./checkpoints');

// All handler modules now extracted
module.exports = {
  // Memory search handlers
  ...memorySearch,

  // Memory triggers handlers
  ...memoryTriggers,

  // Memory save handlers
  ...memorySave,

  // Memory CRUD handlers
  ...memoryCrud,

  // Memory index handlers
  ...memoryIndex,

  // Checkpoint handlers
  ...checkpoints,

  // Sub-module references for direct access
  memorySearch,
  memoryTriggers,
  memorySave,
  memoryCrud,
  memoryIndex,
  checkpoints
};
