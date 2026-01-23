// ───────────────────────────────────────────────────────────────
// MODULE: HANDLERS INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const memorySearch = require('./memory-search');
const memoryTriggers = require('./memory-triggers');
const memorySave = require('./memory-save');
const memoryCrud = require('./memory-crud');
const memoryIndex = require('./memory-index');
const checkpoints = require('./checkpoints');
const sessionLearning = require('./session-learning');

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

  // Session learning handlers
  ...sessionLearning,

  // Sub-module references for direct access
  memorySearch,
  memoryTriggers,
  memorySave,
  memoryCrud,
  memoryIndex,
  checkpoints,
  sessionLearning
};
