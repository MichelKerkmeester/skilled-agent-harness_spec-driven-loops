// ───────────────────────────────────────────────────────────────
// MODULE: STORAGE INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const accessTracker = require('./access-tracker.js');
const checkpoints = require('./checkpoints.js');
const history = require('./history.js');
const indexRefresh = require('./index-refresh.js');
const transactionManager = require('./transaction-manager.js');
const incrementalIndex = require('./incremental-index.js');
const causalEdges = require('./causal-edges.js');

module.exports = {
  ...accessTracker,
  ...checkpoints,
  ...history,
  ...indexRefresh,
  ...transactionManager,
  ...incrementalIndex,
  ...causalEdges,

  // Named exports for direct access
  transactionManager,
  incrementalIndex,
  causalEdges
};
