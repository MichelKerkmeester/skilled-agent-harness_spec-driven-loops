/**
 * Embedding Profile - Define the active embedding profile
 * 
 * A profile includes: provider, model, dimension.
 * Each unique profile generates its own vector database.
 * 
 * @module embeddings/profile
 * @version 1.0.0
 */

'use strict';

/**
 * Create a safe slug for filenames from the profile
 * Example: openai__text-embedding-3-small__1536
 * 
 * @param {string} provider - Provider name (openai, hf-local, ollama)
 * @param {string} model - Model name
 * @param {number} dim - Vector dimension
 * @returns {string} Safe slug for use in filenames
 */
function createProfileSlug(provider, model, dim) {
  // Normalize model name (replace unsafe characters)
  const safeModel = model
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
  
  return `${provider}__${safeModel}__${dim}`;
}

/**
 * Parse a profile slug back to its components
 * 
 * @param {string} slug - Profile slug
 * @returns {{provider: string, model: string, dim: number} | null}
 */
function parseProfileSlug(slug) {
  const parts = slug.split('__');
  if (parts.length !== 3) return null;
  
  const dim = parseInt(parts[2], 10);
  if (isNaN(dim)) return null;
  
  return {
    provider: parts[0],
    model: parts[1],
    dim
  };
}

/**
 * Class representing an embedding profile
 */
class EmbeddingProfile {
  constructor({ provider, model, dim, baseUrl = null }) {
    this.provider = provider;
    this.model = model;
    this.dim = dim;
    this.baseUrl = baseUrl; // For Ollama or other local services
    this.slug = createProfileSlug(provider, model, dim);
  }

  /**
   * Get the database path for this profile
   * 
   * @param {string} baseDir - Base directory
   * @returns {string} Full path to SQLite file
   */
  getDatabasePath(baseDir) {
    // The legacy profile (hf-local + nomic + 768) uses the traditional name
    if (this.provider === 'hf-local' && 
        this.model.includes('nomic-embed-text') && 
        this.dim === 768) {
      return `${baseDir}/context-index.sqlite`;
    }
    
    // New profiles use the slug
    return `${baseDir}/context-index__${this.slug}.sqlite`;
  }

  /**
   * String representation of the profile
   */
  toString() {
    return `${this.provider}:${this.model}:${this.dim}`;
  }

  /**
   * Convert the profile to a plain object
   */
  toJSON() {
    return {
      provider: this.provider,
      model: this.model,
      dim: this.dim,
      baseUrl: this.baseUrl,
      slug: this.slug
    };
  }
}

module.exports = {
  EmbeddingProfile,
  createProfileSlug,
  parseProfileSlug
};
