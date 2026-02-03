// ───────────────────────────────────────────────────────────────
// INTERFACES: EMBEDDING PROVIDER
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IEMBEDDINGPROVIDER INTERFACE
────────────────────────────────────────────────────────────────*/

class IEmbeddingProvider {
  async embed(text) {
    throw new Error('IEmbeddingProvider.embed() must be implemented by subclass');
  }

  async batchEmbed(texts, options = {}) {
    throw new Error('IEmbeddingProvider.batchEmbed() must be implemented by subclass');
  }

  async embedQuery(query) {
    throw new Error('IEmbeddingProvider.embedQuery() must be implemented by subclass');
  }

  async embedDocument(document) {
    throw new Error('IEmbeddingProvider.embedDocument() must be implemented by subclass');
  }

  getDimension() {
    throw new Error('IEmbeddingProvider.getDimension() must be implemented by subclass');
  }

  getModelName() {
    throw new Error('IEmbeddingProvider.getModelName() must be implemented by subclass');
  }

  getProfile() {
    throw new Error('IEmbeddingProvider.getProfile() must be implemented by subclass');
  }

  isReady() {
    throw new Error('IEmbeddingProvider.isReady() must be implemented by subclass');
  }

  async initialize() {
    throw new Error('IEmbeddingProvider.initialize() must be implemented by subclass');
  }

  async validateCredentials() {
    throw new Error('IEmbeddingProvider.validateCredentials() must be implemented by subclass');
  }

  getProviderName() {
    throw new Error('IEmbeddingProvider.getProviderName() must be implemented by subclass');
  }

  async close() {
    // Default no-op
  }
}

/* ─────────────────────────────────────────────────────────────
   2. MOCK EMBEDDING PROVIDER
────────────────────────────────────────────────────────────────*/

class MockEmbeddingProvider extends IEmbeddingProvider {
  constructor(options = {}) {
    super();
    this.dimension = options.dimension || 1024;
    this.modelName = options.modelName || 'mock-embedding-v1';
    this.providerName = options.providerName || 'mock';
    this.latencyMs = options.latencyMs || 0;
    this.failRate = options.failRate || 0;
    this.initialized = options.autoInit !== false;
    this.credentialsValid = options.credentialsValid !== false;
    this.seed = options.seed || 42;
  }

  _generateDeterministicEmbedding(text) {
    const embedding = new Float32Array(this.dimension);

    // Simple hash function for deterministic values
    let hash = this.seed;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }

    // Generate embedding values based on hash
    for (let i = 0; i < this.dimension; i++) {
      // Xorshift32 PRNG for reproducible random-looking values
      hash ^= hash << 13;
      hash ^= hash >>> 17;
      hash ^= hash << 5;
      // Normalize to [-1, 1] range
      embedding[i] = (hash & 0xFFFF) / 32768 - 1;
    }

    // Normalize to unit vector
    let norm = 0;
    for (let i = 0; i < this.dimension; i++) {
      norm += embedding[i] * embedding[i];
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < this.dimension; i++) {
        embedding[i] /= norm;
      }
    }

    return embedding;
  }

  async _simulateLatency() {
    if (this.latencyMs > 0) {
      await new Promise(resolve => setTimeout(resolve, this.latencyMs));
    }
  }

  _shouldFail() {
    return Math.random() < this.failRate;
  }

  async embed(text) {
    if (!this.initialized) {
      throw new Error('MockEmbeddingProvider not initialized. Call initialize() first.');
    }

    await this._simulateLatency();

    if (this._shouldFail()) {
      return null;
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }

    return this._generateDeterministicEmbedding(text.trim());
  }

  async batchEmbed(texts, options = {}) {
    if (!this.initialized) {
      throw new Error('MockEmbeddingProvider not initialized. Call initialize() first.');
    }

    if (!Array.isArray(texts)) {
      throw new TypeError('texts must be an array');
    }

    const results = [];
    for (const text of texts) {
      results.push(await this.embed(text));
    }
    return results;
  }

  async embedQuery(query) {
    // Query embeddings use same logic but could be differentiated
    return this.embed(query);
  }

  async embedDocument(document) {
    // Document embeddings use same logic but could be differentiated
    return this.embed(document);
  }

  getDimension() {
    return this.dimension;
  }

  getModelName() {
    return this.modelName;
  }

  getProfile() {
    return {
      provider: this.providerName,
      model: this.modelName,
      dim: this.dimension,
      get_database_path: (baseDir) => `${baseDir}/mock-${this.dimension}.sqlite`
    };
  }

  isReady() {
    return this.initialized;
  }

  async initialize() {
    await this._simulateLatency();
    this.initialized = true;
  }

  async validateCredentials() {
    if (!this.credentialsValid) {
      throw new Error('Mock API key invalid. This is a test error from MockEmbeddingProvider.');
    }
    return true;
  }

  getProviderName() {
    return this.providerName;
  }

  async close() {
    this.initialized = false;
  }

  // Test helpers
  setFailRate(rate) {
    this.failRate = rate;
  }

  setLatency(ms) {
    this.latencyMs = ms;
  }

  setCredentialsValid(valid) {
    this.credentialsValid = valid;
  }

  reset() {
    this.initialized = true;
    this.failRate = 0;
    this.latencyMs = 0;
    this.credentialsValid = true;
  }
}

module.exports = {
  IEmbeddingProvider,
  MockEmbeddingProvider
};
