// ───────────────────────────────────────────────────────────────
// CORE: MODULE INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

/* ───────────────────────────────────────────────────────────────
   1. EXPORTS
   ─────────────────────────────────────────────────────────────── */

// workflow.js not exported here to avoid circular dependencies
// Import directly: const { runWorkflow } = require('./core/workflow');

module.exports = {
  ...require('./config')
};
