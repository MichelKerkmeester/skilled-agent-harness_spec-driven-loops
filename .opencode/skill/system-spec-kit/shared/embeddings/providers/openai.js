/**
 * Embeddings Provider - OpenAI
 * 
 * Uses OpenAI API to generate embeddings.
 * Supports text-embedding-3-small (1536 dims) and text-embedding-3-large (3072 dims).
 * 
 * @module embeddings/providers/openai
 * @version 1.0.0
 */

'use strict';

const { EmbeddingProfile } = require('../profile');

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const DEFAULT_MODEL = 'text-embedding-3-small';
const DEFAULT_DIM = 1536; // text-embedding-3-small
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const REQUEST_TIMEOUT = 30000; // 30 second timeout

// Dimensions by model
const MODEL_DIMENSIONS = {
  'text-embedding-3-small': 1536,
  'text-embedding-3-large': 3072,
  'text-embedding-ada-002': 1536
};

// ───────────────────────────────────────────────────────────────
// PROVIDER CLASS
// ───────────────────────────────────────────────────────────────

class OpenAIProvider {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    this.baseUrl = options.baseUrl || process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL;
    this.modelName = options.model || process.env.OPENAI_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    this.dim = options.dim || MODEL_DIMENSIONS[this.modelName] || DEFAULT_DIM;
    this.timeout = options.timeout || REQUEST_TIMEOUT;
    this.isHealthy = true;
    this.requestCount = 0;
    this.totalTokens = 0;

    if (!this.apiKey) {
      throw new Error('OpenAI API key is required. Set OPENAI_API_KEY.');
    }
  }

  /**
   * Make request to OpenAI API
   *
   * @param {string|string[]} input - Text or array of texts
   * @returns {Promise<Object>} API response
   */
  async makeRequest(input) {
    const url = `${this.baseUrl}/embeddings`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          input,
          model: this.modelName,
          encoding_format: 'float'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
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
        throw new Error('OpenAI request timeout');
      }
      
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Generate embedding for text
   *
   * @param {string} text - Text to embed
   * @returns {Promise<Float32Array>} Embedding vector
   */
  async generateEmbedding(text) {
    if (!text || typeof text !== 'string') {
      console.warn('[openai] Empty or invalid text provided');
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn('[openai] Empty text after trim');
      return null;
    }

    const start = Date.now();

    try {
      const response = await this.makeRequest(trimmedText);
      
      if (!response.data || response.data.length === 0) {
        throw new Error('OpenAI did not return embeddings');
      }

      // Extract embedding from first (and only) element
      const embedding = new Float32Array(response.data[0].embedding);

      // Check dimension
      if (embedding.length !== this.dim) {
        console.warn(`[openai] Unexpected dimension: ${embedding.length}, expected: ${this.dim}`);
      }

      const inferenceTime = Date.now() - start;
      
      if (inferenceTime > 2000) {
        console.warn(`[openai] Slow request: ${inferenceTime}ms`);
      }

      return embedding;

    } catch (error) {
      console.warn(`[openai] Generation failed: ${error.message}`);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Embed a document (for indexing)
   * Note: OpenAI does not require special prefixes like nomic
   */
  async embedDocument(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(text);
  }

  /**
   * Embed a search query
   * Note: OpenAI does not require special prefixes like nomic
   */
  async embedQuery(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(text);
  }

  /**
   * Pre-warm provider (verify connectivity)
   */
  async warmup() {
    try {
      console.log('[openai] Checking connectivity with OpenAI API...');
      const result = await this.embedQuery('test warmup query');
      this.isHealthy = result !== null;
      console.log('[openai] Connectivity verified successfully');
      return this.isHealthy;
    } catch (error) {
      console.warn(`[openai] Warmup failed: ${error.message}`);
      this.isHealthy = false;
      return false;
    }
  }

  /**
   * Get provider metadata
   */
  getMetadata() {
    return {
      provider: 'openai',
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
      provider: 'openai',
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
      estimatedCost: this.totalTokens * 0.00002 // ~$0.02 per 1M tokens for text-embedding-3-small
    };
  }
}

module.exports = { OpenAIProvider, MODEL_DIMENSIONS };
