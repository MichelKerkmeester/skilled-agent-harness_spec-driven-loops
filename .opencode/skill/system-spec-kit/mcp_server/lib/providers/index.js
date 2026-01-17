// ───────────────────────────────────────────────────────────────
// providers/index.js: External service providers barrel export
// ───────────────────────────────────────────────────────────────
'use strict';

const embeddings = require('./embeddings.js');
const retryManager = require('./retry-manager.js');

module.exports = {
  ...embeddings,
  ...retryManager,
};
