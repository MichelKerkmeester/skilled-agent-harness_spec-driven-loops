// ───────────────────────────────────────────────────────────────
// LIB: EMBEDDINGS INDEX
// ───────────────────────────────────────────────────────────────
// Re-exports embedding-related modules for easy access.
'use strict';

const providerChain = require('./provider-chain.js');

module.exports = {
  // Provider Chain (REQ-030, T091-T095)
  ...providerChain,
};
