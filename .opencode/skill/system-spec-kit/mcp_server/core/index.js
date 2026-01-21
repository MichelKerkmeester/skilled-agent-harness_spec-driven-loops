// ───────────────────────────────────────────────────────────────
// MODULE: CORE INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const config = require('./config');
const dbState = require('./db-state');

/* ─────────────────────────────────────────────────────────────
   1. RE-EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Config module - all constants
  ...config,

  // DB State module - state management functions
  ...dbState,

  // Named module references for explicit imports
  config,
  dbState
};
