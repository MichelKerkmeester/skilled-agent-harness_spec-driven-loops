// ───────────────────────────────────────────────────────────────
// MODULE: STORAGE INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const accessTracker = require('./access-tracker.js');
const checkpoints = require('./checkpoints.js');
const history = require('./history.js');
const indexRefresh = require('./index-refresh.js');

module.exports = {
  ...accessTracker,
  ...checkpoints,
  ...history,
  ...indexRefresh,
};
