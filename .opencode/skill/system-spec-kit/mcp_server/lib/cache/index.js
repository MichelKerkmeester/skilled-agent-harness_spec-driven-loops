// ───────────────────────────────────────────────────────────────
// MODULE: CACHE INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const toolCache = require('./tool-cache.js');

module.exports = {
  ...toolCache,

  // Direct module access
  toolCache,
};
