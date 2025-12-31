/**
 * Embeddings Provider - Voyage AI
 * 
 * Uses Voyage AI API to generate embeddings.
 * Optimized for retrieval with input_type support (document/query).
 * 
 * @module embeddings/providers/voyage
 */

'use strict';

const { EmbeddingProfile } = require('../profile');

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const DEFAULT_MODEL = 'voyage-3.5';
const DEFAULT_DIM = 1024;
const DEFAULT_BASE_URL = 'https://api.voyageai.com/v1';
const REQUEST_TIMEOUT = 30000; // 30 second timeout

// Dimensions by model
const MODEL_DIMENSIONS = {
  'voyage-3.5': 1024,
  'voyage-3.5-lite': 1024,
  'voyage-3-large': 1024,
  'voyage-code-3': 1024,
  'voyage-code-2': 1536,
  'voyage-3': 1024,
  'voyage-finance-2': 1024,
  'voyage-law-2': 1024
};

// ───────────────────────────────────────────────────────────────
// PROVIDER CLASS
// ───────────────────────────────────────────────────────────────

class VoyageProvider {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.VOYAGE_API_KEY;
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.modelName = options.model || process.env.VOYAGE_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    this.dim = options.dim || MODEL_DIMENSIONS[this.modelName] || DEFAULT_DIM;
    this.timeout = options.timeout || REQUEST_TIMEOUT;
    this.isHealthy = true;
    this.requestCount = 0;
    this.totalTokens = 0;

    if (!this.apiKey) {
      throw new Error('Voyage API key is required. Set VOYAGE_API_KEY.');
    }
  }

  /**
   * Make request to Voyage API
   *
   * @param {string|string[]} input - Text or array of texts
   * @param {string} inputType - 'document' or 'query' for retrieval optimization
   * @returns {Promise<Object>} API response
   */
  async makeRequest(input, inputType = null) {
    const url = `${this.baseUrl}/embeddings`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const body = {
      input: Array.isArray(input) ? input : [input],
      model: this.modelName
    };

    // Add input_type for retrieval optimization (Voyage-specific)
    if (inputType) {
      body.input_type = inputType;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(`Voyage API error: ${error.detail || error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Update statistics
      this.requestCount++;
      if (data.usage) {
        this.totalTokens += data.usage.total_tokens;
      }

      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Voyage request timeout');
      }
      
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Generate embedding for text
   *
   * @param {string} text - Text to embed
   * @param {string} inputType - 'document' or 'query'
   * @returns {Promise<Float32Array>} Embedding vector
   */
  async generateEmbedding(text, inputType = null) {
    if (!text || typeof text !== 'string') {
      console.warn('[voyage] Empty or invalid text provided');
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn('[voyage] Empty text after trim');
      return null;
    }

    const start = Date.now();

    try {
      const response = await this.makeRequest(trimmedText, inputType);
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Voyage did not return embeddings');
      }

      // Extract embedding from first element
      const embedding = new Float32Array(response.data[0].embedding);

      // Check dimension
      if (embedding.length !== this.dim) {
        console.warn(`[voyage] Unexpected dimension: ${embedding.length}, expected: ${this.dim}`);
      }

      const inferenceTime = Date.now() - start;
      
      if (inferenceTime > 2000) {
        console.warn(`[voyage] Slow request: ${inferenceTime}ms`);
      }

      return embedding;

    } catch (error) {
      console.warn(`[voyage] Generation failed: ${error.message}`);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Embed a document (for indexing)
   * Uses input_type: 'document' for optimized retrieval
   */
  async embedDocument(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(text, 'document');
  }

  /**
   * Embed a search query
   * Uses input_type: 'query' for optimized retrieval
   */
  async embedQuery(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(text, 'query');
  }

  /**
   * Pre-warm provider (verify connectivity)
   */
  async warmup() {
    try {
      console.log('[voyage] Checking connectivity with Voyage API...');
      const result = await this.embedQuery('test warmup query');
      this.isHealthy = result !== null;
      console.log('[voyage] Connectivity verified successfully');
      return this.isHealthy;
    } catch (error) {
      console.warn(`[voyage] Warmup failed: ${error.message}`);
      this.isHealthy = false;
      return false;
    }
  }

  /**
   * Get provider metadata
   */
  getMetadata() {
    return {
      provider: 'voyage',
      model: this.modelName,
      dim: this.dim,
      baseUrl: this.baseUrl,
      healthy: this.isHealthy,
      requestCount: this.requestCount,
      totalTokens: this.totalTokens
    };
  }

  /**
   * Get embedding profile
   */
  getProfile() {
    return new EmbeddingProfile({
      provider: 'voyage',
      model: this.modelName,
      dim: this.dim,
      baseUrl: this.baseUrl
    });
  }

  /**
   * Check if provider is healthy
   */
  async healthCheck() {
    try {
      const result = await this.embedQuery('health check');
      this.isHealthy = result !== null;
      return this.isHealthy;
    } catch (error) {
      this.isHealthy = false;
      return false;
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    return {
      requestCount: this.requestCount,
      totalTokens: this.totalTokens,
      // voyage-3.5 pricing: $0.06 per 1M tokens
      estimatedCost: this.totalTokens * 0.00006
    };
  }
}

module.exports = { VoyageProvider, MODEL_DIMENSIONS };
