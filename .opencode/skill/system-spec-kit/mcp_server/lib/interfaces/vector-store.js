// ───────────────────────────────────────────────────────────────
// INTERFACES: VECTOR STORE
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IVECTORSTORE INTERFACE
────────────────────────────────────────────────────────────────*/

class IVectorStore {
  async search(embedding, topK, options = {}) {
    throw new Error('IVectorStore.search() must be implemented by subclass');
  }

  async upsert(id, embedding, metadata) {
    throw new Error('IVectorStore.upsert() must be implemented by subclass');
  }

  async delete(id) {
    throw new Error('IVectorStore.delete() must be implemented by subclass');
  }

  async get(id) {
    throw new Error('IVectorStore.get() must be implemented by subclass');
  }

  async getStats() {
    throw new Error('IVectorStore.getStats() must be implemented by subclass');
  }

  async isAvailable() {
    throw new Error('IVectorStore.isAvailable() must be implemented by subclass');
  }

  getEmbeddingDimension() {
    throw new Error('IVectorStore.getEmbeddingDimension() must be implemented by subclass');
  }

  async close() {
    throw new Error('IVectorStore.close() must be implemented by subclass');
  }
}

/* ─────────────────────────────────────────────────────────────
   2. MOCK VECTOR STORE
────────────────────────────────────────────────────────────────*/

class MockVectorStore extends IVectorStore {
  constructor(options = {}) {
    super();
    this.records = new Map();
    this.nextId = 1;
    this.embeddingDim = options.embeddingDim || 1024;
    this.available = options.available !== false;
  }

  _cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (normA * normB);
  }

  async search(embedding, topK, options = {}) {
    if (!this.available) return [];

    const { specFolder, minSimilarity = 0 } = options;

    const results = [];

    for (const [id, record] of this.records) {
      // Apply filters
      if (specFolder && record.metadata.spec_folder !== specFolder) continue;

      // Calculate similarity
      const similarity = (this._cosineSimilarity(embedding, record.embedding) + 1) * 50; // Scale to 0-100

      if (similarity >= minSimilarity) {
        results.push({
          id,
          similarity: Math.round(similarity * 100) / 100,
          ...record.metadata
        });
      }
    }

    // Sort by similarity descending and limit
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  async upsert(id, embedding, metadata) {
    if (!this.available) {
      throw new Error('MockVectorStore is not available');
    }

    if (embedding.length !== this.embeddingDim) {
      throw new Error(`Embedding dimension mismatch: expected ${this.embeddingDim}, got ${embedding.length}`);
    }

    // Check for existing record by specFolder + filePath + anchorId
    const existingId = this._findExisting(metadata);

    if (existingId !== null) {
      this.records.set(existingId, { embedding, metadata: { ...metadata, id: existingId } });
      return existingId;
    }

    const newId = this.nextId++;
    this.records.set(newId, { embedding, metadata: { ...metadata, id: newId } });
    return newId;
  }

  _findExisting(metadata) {
    for (const [id, record] of this.records) {
      if (
        record.metadata.spec_folder === metadata.spec_folder &&
        record.metadata.file_path === metadata.file_path &&
        record.metadata.anchor_id === metadata.anchor_id
      ) {
        return id;
      }
    }
    return null;
  }

  async delete(id) {
    if (!this.available) return false;
    return this.records.delete(id);
  }

  async get(id) {
    if (!this.available) return null;
    const record = this.records.get(id);
    return record ? { id, ...record.metadata } : null;
  }

  async getStats() {
    return {
      total: this.records.size,
      pending: 0,
      success: this.records.size,
      failed: 0
    };
  }

  async isAvailable() {
    return this.available;
  }

  getEmbeddingDimension() {
    return this.embeddingDim;
  }

  async close() {
    this.records.clear();
  }

  // Test helpers
  setAvailable(available) {
    this.available = available;
  }

  clear() {
    this.records.clear();
    this.nextId = 1;
  }

  get size() {
    return this.records.size;
  }
}

module.exports = {
  IVectorStore,
  MockVectorStore
};
