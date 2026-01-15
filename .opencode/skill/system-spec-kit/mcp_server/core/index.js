/**
 * @fileoverview Core module exports for the MCP context server.
 * Re-exports all core modules for convenient single-import access.
 * @module mcp_server/core
 */
'use strict';

const config = require('./config');
const dbState = require('./db-state');

/* ───────────────────────────────────────────────────────────────
   RE-EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Config module - all constants
  ...config,

  // DB State module - state management functions
  ...dbState,

  // Named module references for explicit imports
  config,
  dbState
};
