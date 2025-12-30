/**
 * Embeddings Provider - Hugging Face Local
 * 
 * Uses @huggingface/transformers with nomic-embed-text-v1.5 to generate
 * 768-dimensional embeddings completely locally.
 * 
 * @module embeddings/providers/hf-local
 * @version 1.0.0
 */

'use strict';

const { EmbeddingProfile } = require('../profile');

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const DEFAULT_MODEL = 'nomic-ai/nomic-embed-text-v1.5';
const EMBEDDING_DIM = 768;
const MAX_TEXT_LENGTH = 8000; // nomic supports 8192 tokens
const EMBEDDING_TIMEOUT = 30000; // 30 second timeout

/**
 * Task prefixes required by nomic-embed-text-v1.5
 * See: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5
 */
const TASK_PREFIX = {
  DOCUMENT: 'search_document: ',
  QUERY: 'search_query: ',
  CLUSTERING: 'clustering: ',
  CLASSIFICATION: 'classification: '
};

// ───────────────────────────────────────────────────────────────
// DEVICE DETECTION
// ───────────────────────────────────────────────────────────────

let currentDevice = null;

/**
 * Determine optimal device for embeddings
 * - macOS with Apple Silicon: Use MPS (Metal Performance Shaders)
 * - Other platforms: Use CPU
 *
 * @returns {string} Device identifier ('mps' or 'cpu')
 */
function getOptimalDevice() {
  if (process.platform === 'darwin') {
    return 'mps';
  }
  return 'cpu';
}

// ───────────────────────────────────────────────────────────────
// PROVIDER CLASS
// ───────────────────────────────────────────────────────────────

class HFLocalProvider {
  constructor(options = {}) {
    this.modelName = options.model || process.env.HF_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    this.dim = options.dim || EMBEDDING_DIM;
    this.maxTextLength = options.maxTextLength || MAX_TEXT_LENGTH;
    this.timeout = options.timeout || EMBEDDING_TIMEOUT;
    
    this.extractor = null;
    this.modelLoadTime = null;
    this.loadingPromise = null;
    this.isHealthy = true;
  }

  /**
   * Get or create embeddings pipeline (singleton pattern)
   * First call downloads/loads the model (~274MB), subsequent calls return cached instance.
   * Prevents race conditions with multiple simultaneous load requests.
   *
   * @returns {Promise<Object>} Feature extraction pipeline
   */
  async getModel() {
    // If already loaded, return immediately
    if (this.extractor) {
      return this.extractor;
    }

    // If currently loading, wait for completion (race condition protection)
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Start loading and store promise
    this.loadingPromise = (async () => {
      const start = Date.now();
      try {
        console.warn(`[hf-local] Loading ${this.modelName} (~274MB, first load may take 15-30s)...`);

        // Dynamic import for ESM module
        const { pipeline } = await import('@huggingface/transformers');

        // Try optimal device first (MPS on Mac)
        let targetDevice = getOptimalDevice();
        console.log(`[hf-local] Attempting device: ${targetDevice}`);

        try {
          this.extractor = await pipeline('feature-extraction', this.modelName, {
            dtype: 'fp32',
            device: targetDevice
          });
          currentDevice = targetDevice;
        } catch (deviceError) {
          // MPS failed, fallback to CPU
          if (targetDevice !== 'cpu') {
            console.warn(`[hf-local] ${targetDevice.toUpperCase()} unavailable (${deviceError.message}), using CPU`);
            this.extractor = await pipeline('feature-extraction', this.modelName, {
              dtype: 'fp32',
              device: 'cpu'
            });
            currentDevice = 'cpu';
          } else {
            throw deviceError;
          }
        }

        this.modelLoadTime = Date.now() - start;
        console.warn(`[hf-local] Model loaded in ${this.modelLoadTime}ms (device: ${currentDevice})`);

        return this.extractor;
      } catch (error) {
        this.loadingPromise = null;  // Reset on failure to allow retry
        this.isHealthy = false;
        throw error;
      }
    })();

    return this.loadingPromise;
  }

  /**
   * Generate embedding for text without prefix (internal function)
   *
   * @param {string} text - Text to embed (with task prefix if necessary)
   * @returns {Promise<Float32Array>} Normalized embedding vector of 768 dimensions
   */
  async generateEmbedding(text) {
    if (!text || typeof text !== 'string') {
      console.warn('[hf-local] Empty or invalid text provided');
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn('[hf-local] Empty text after trim');
      return null;
    }

    // Truncate if exceeds limit (semantic chunking handled in upper layer)
    let inputText = trimmedText;
    if (inputText.length > this.maxTextLength) {
      console.warn(`[hf-local] Text truncated from ${inputText.length} to ${this.maxTextLength} characters`);
      inputText = inputText.substring(0, this.maxTextLength);
    }

    const start = Date.now();

    try {
      const model = await this.getModel();

      // Generate embedding with mean pooling and normalization
      const output = await model(inputText, {
        pooling: 'mean',
        normalize: true
      });

      // Convert to Float32Array
      const embedding = output.data instanceof Float32Array
        ? output.data
        : new Float32Array(output.data);

      const inferenceTime = Date.now() - start;

      // Performance logging (target <800ms)
      if (inferenceTime > 800) {
        console.warn(`[hf-local] Slow inference: ${inferenceTime}ms (target <800ms)`);
      }

      return embedding;

    } catch (error) {
      console.warn(`[hf-local] Generation failed: ${error.message}`);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Embed a document (for indexing)
   */
  async embedDocument(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    const prefixedText = TASK_PREFIX.DOCUMENT + text;
    return await this.generateEmbedding(prefixedText);
  }

  /**
   * Embed a search query
   */
  async embedQuery(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    const prefixedQuery = TASK_PREFIX.QUERY + text;
    return await this.generateEmbedding(prefixedQuery);
  }

  /**
   * Pre-warm the model (useful on server startup)
   */
  async warmup() {
    try {
      console.log('[hf-local] Pre-warming model...');
      await this.embedQuery('test warmup query');
      console.log('[hf-local] Model successfully pre-warmed');
      return true;
    } catch (error) {
      console.warn(`[hf-local] Warmup failed: ${error.message}`);
      this.isHealthy = false;
      return false;
    }
  }

  /**
   * Get provider metadata
   */
  getMetadata() {
    return {
      provider: 'hf-local',
      model: this.modelName,
      dim: this.dim,
      device: currentDevice,
      healthy: this.isHealthy,
      loaded: this.extractor !== null,
      loadTimeMs: this.modelLoadTime
    };
  }

  /**
   * Get embedding profile
   */
  getProfile() {
    return new EmbeddingProfile({
      provider: 'hf-local',
      model: this.modelName,
      dim: this.dim
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
}

module.exports = { HFLocalProvider, TASK_PREFIX };
