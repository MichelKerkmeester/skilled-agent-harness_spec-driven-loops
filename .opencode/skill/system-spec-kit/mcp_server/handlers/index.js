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
const causalGraph = require('./causal-graph');
// T061: L1 Orchestration - unified entry point
const memoryContext = require('./memory-context');

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

  // Causal graph handlers (T043-T047)
  ...causalGraph,

  // T061: L1 Orchestration handler
  ...memoryContext,

  // Sub-module references for direct access
  memorySearch,
  memoryTriggers,
  memorySave,
  memoryCrud,
  memoryIndex,
  checkpoints,
  sessionLearning,
  causalGraph,
  memoryContext
};
