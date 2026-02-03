// ───────────────────────────────────────────────────────────────
// INTERFACES: INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const { IVectorStore, MockVectorStore } = require('./vector-store');
const { IEmbeddingProvider, MockEmbeddingProvider } = require('./embedding-provider');

module.exports = {
  // Interface definitions
  IVectorStore,
  IEmbeddingProvider,

  // Mock implementations for testing
  MockVectorStore,
  MockEmbeddingProvider
};
