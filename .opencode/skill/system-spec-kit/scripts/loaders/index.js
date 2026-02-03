// ───────────────────────────────────────────────────────────────
// LOADERS: INDEX
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
────────────────────────────────────────────────────────────────*/

'use strict';

const { load_collected_data } = require('./data-loader');

/* ─────────────────────────────────────────────────────────────
   2. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Primary exports (snake_case)
  load_collected_data,
  // Backwards compatibility aliases (camelCase)
  loadCollectedData: load_collected_data
};
