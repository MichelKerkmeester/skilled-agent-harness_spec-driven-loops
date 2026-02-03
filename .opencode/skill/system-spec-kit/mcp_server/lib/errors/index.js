// ───────────────────────────────────────────────────────────────
// LIB: ERRORS INDEX
// Unified export of all error-related functionality
// ───────────────────────────────────────────────────────────────
'use strict';

const core = require('./core.js');
const recoveryHints = require('./recovery-hints.js');

module.exports = {
  ...core,
  ...recoveryHints,
};
