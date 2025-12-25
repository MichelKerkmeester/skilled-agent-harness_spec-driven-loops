/**
 * Embeddings Module - Local vector embedding generation
 *
 * Uses @huggingface/transformers with nomic-embed-text-v1.5 for
 * 768-dimensional sentence embeddings. Runs entirely locally
 * with no external API calls.
 *
 * UPGRADE NOTE (2025-12-09):
 * - Changed from all-MiniLM-L6-v2 (384-dim) to nomic-embed-text-v1.5 (768-dim)
 * - Added task prefix support (search_document/search_query) per nomic spec
 * - Increased context window from 512 to 8192 tokens
 * - Requires database migration (vec_memories table recreation)
 *
 * @module embeddings
 * @version 11.0.0
 */

'use strict';

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const MODEL_NAME = 'nomic-ai/nomic-embed-text-v1.5';
const EMBEDDING_DIM = 768;
const MAX_TEXT_LENGTH = 8000; // nomic supports 8192 tokens

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
// DEVICE DETECTION (MPS/Metal on Mac, CPU fallback)
// ───────────────────────────────────────────────────────────────

let currentDevice = null;

/**
 * Determine optimal compute device for embeddings
 * - macOS with Apple Silicon: Use MPS (Metal Performance Shaders)
 * - Other platforms: Use CPU
 *
 * @returns {string} Device identifier ('mps' or 'cpu')
 */
function getOptimalDevice() {
  // MPS available on macOS with Apple Silicon (M1/M2/M3)
  if (process.platform === 'darwin') {
    return 'mps';
  }
  return 'cpu';
}

// ───────────────────────────────────────────────────────────────
// SINGLETON MODEL INSTANCE
// ───────────────────────────────────────────────────────────────

let extractor = null;
let modelLoadTime = null;
let loadingPromise = null;  // Track loading state to prevent race conditions

/**
 * Get or create the embedding pipeline (singleton pattern)
 * First call downloads/loads model (~274MB), subsequent calls return cached instance.
 * Prevents race conditions with multiple simultaneous model load requests.
 * Attempts MPS acceleration on Mac, falls back to CPU if unavailable.
 *
 * @returns {Promise<Object>} Feature extraction pipeline
 */
async function getModel() {
  // If already loaded, return immediately
  if (extractor) {
    return extractor;
  }

  // If currently loading, wait for that to complete
  if (loadingPromise) {
    return loadingPromise;
  }

  // Start loading and store the promise
  loadingPromise = (async () => {
    const startTime = Date.now();
    try {
      console.log('[embeddings] Loading nomic-embed-text-v1.5 (~274MB, first load may take 15-30s)...');
      const { pipeline } = await import('@huggingface/transformers');

      // Try optimal device first (MPS on Mac)
      let targetDevice = getOptimalDevice();
      console.log(`[embeddings] Attempting device: ${targetDevice}`);

      try {
        extractor = await pipeline('feature-extraction', MODEL_NAME, {
          dtype: 'fp32',
          device: targetDevice
        });
        currentDevice = targetDevice;
      } catch (deviceError) {
        // MPS failed, fall back to CPU
        if (targetDevice !== 'cpu') {
          console.warn(`[embeddings] ${targetDevice.toUpperCase()} unavailable (${deviceError.message}), falling back to CPU`);
          extractor = await pipeline('feature-extraction', MODEL_NAME, {
            dtype: 'fp32',
            device: 'cpu'
          });
          currentDevice = 'cpu';
        } else {
          throw deviceError;
        }
      }

      modelLoadTime = Date.now() - startTime;
      console.log(`[embeddings] Model loaded in ${modelLoadTime}ms (device: ${currentDevice})`);
      return extractor;
    } catch (error) {
      loadingPromise = null;  // Reset on failure so retry is possible
      throw new Error(`Failed to load embedding model: ${error.message}`);
    }
  })();

  return loadingPromise;
}

// ───────────────────────────────────────────────────────────────
// CORE EMBEDDING GENERATION
// ───────────────────────────────────────────────────────────────

/**
 * Generate a 768-dimensional embedding vector for text
 *
 * NOTE: For best results, use generateDocumentEmbedding() for indexing
 * and generateQueryEmbedding() for search queries. This function is
 * the low-level implementation that handles the actual embedding.
 *
 * @param {string} text - Text to embed (with task prefix if needed)
 * @returns {Promise<Float32Array>} Normalized 768-dim embedding vector
 * @throws {Error} If embedding generation fails
 *
 * @example
 * const embedding = await generateEmbedding('search_document: Hello world');
 * console.log(embedding.length); // 768
 */
async function generateEmbedding(text) {
  // Handle empty/null text
  if (!text || typeof text !== 'string') {
    console.warn('[embeddings] Empty or invalid text provided, skipping embedding');
    return null;
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    console.warn('[embeddings] Empty text after trimming, skipping embedding');
    return null;
  }

  // Truncate at MAX_TEXT_LENGTH
  let inputText = trimmedText;
  if (inputText.length > MAX_TEXT_LENGTH) {
    inputText = inputText.substring(0, MAX_TEXT_LENGTH);
    console.warn(`[embeddings] Text truncated from ${trimmedText.length} to ${MAX_TEXT_LENGTH} chars`);
  }

  const start = Date.now();

  try {
    const model = await getModel();

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

    // Performance logging (target <800ms for larger model)
    if (inferenceTime > 800) {
      console.warn(`[embeddings] Slow inference: ${inferenceTime}ms (target <800ms)`);
    }

    return embedding;

  } catch (error) {
    console.warn(`[embeddings] Generation failed: ${error.message}`);
    throw error;
  }
}

// ───────────────────────────────────────────────────────────────
// TASK-SPECIFIC EMBEDDING FUNCTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Generate embedding for a document (for indexing/storage)
 *
 * Uses the "search_document: " prefix required by nomic-embed-text-v1.5
 * for optimal document retrieval performance.
 *
 * @param {string} text - Document text to embed
 * @returns {Promise<Float32Array>} 768-dim embedding vector
 *
 * @example
 * const embedding = await generateDocumentEmbedding('OAuth implementation details...');
 */
async function generateDocumentEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn('[embeddings] Empty document text, skipping embedding');
    return null;
  }

  const prefixedText = TASK_PREFIX.DOCUMENT + text;
  return await generateEmbedding(prefixedText);
}

/**
 * Generate embedding for a search query
 *
 * Uses the "search_query: " prefix required by nomic-embed-text-v1.5
 * for optimal query-document matching.
 *
 * @param {string} query - Search query text
 * @returns {Promise<Float32Array>} 768-dim embedding vector
 *
 * @example
 * const embedding = await generateQueryEmbedding('how did we implement auth?');
 */
async function generateQueryEmbedding(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[embeddings] Empty query text, skipping embedding');
    return null;
  }

  const prefixedQuery = TASK_PREFIX.QUERY + query;
  return await generateEmbedding(prefixedQuery);
}

/**
 * Generate embedding for clustering task
 *
 * @param {string} text - Text to embed for clustering
 * @returns {Promise<Float32Array>} 768-dim embedding vector
 */
async function generateClusteringEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return null;
  }

  const prefixedText = TASK_PREFIX.CLUSTERING + text;
  return await generateEmbedding(prefixedText);
}

// ───────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Get embedding dimension (for validation)
 * @returns {number} Embedding dimension (768)
 */
function getEmbeddingDimension() {
  return EMBEDDING_DIM;
}

/**
 * Get model name
 * @returns {string} Model identifier
 */
function getModelName() {
  return MODEL_NAME;
}

/**
 * Check if model is loaded
 * @returns {boolean} True if model is cached
 */
function isModelLoaded() {
  return extractor !== null;
}

/**
 * Get model load time (if loaded)
 * @returns {number|null} Load time in ms or null
 */
function getModelLoadTime() {
  return modelLoadTime;
}

/**
 * Get current compute device
 * @returns {string|null} Device identifier ('mps' or 'cpu') or null if not loaded
 */
function getCurrentDevice() {
  return currentDevice;
}

/**
 * Get task prefix for a given task type
 * @param {'document'|'query'|'clustering'|'classification'} task - Task type
 * @returns {string} Task prefix string
 */
function getTaskPrefix(task) {
  const prefixes = {
    document: TASK_PREFIX.DOCUMENT,
    query: TASK_PREFIX.QUERY,
    clustering: TASK_PREFIX.CLUSTERING,
    classification: TASK_PREFIX.CLASSIFICATION
  };
  return prefixes[task] || '';
}

/**
 * Pre-warm the embedding model (call on server startup)
 * @returns {Promise<boolean>} true if model loaded successfully
 */
async function preWarmModel() {
  try {
    console.log('[embeddings] Pre-warming model...');
    await getModel();
    console.log('[embeddings] Model pre-warmed successfully');
    return true;
  } catch (error) {
    console.error(`[embeddings] Pre-warm failed: ${error.message}`);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────
// MODULE EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Core function
  generateEmbedding,

  // Task-specific functions (recommended)
  generateDocumentEmbedding,
  generateQueryEmbedding,
  generateClusteringEmbedding,

  // Utility functions
  getEmbeddingDimension,
  getModelName,
  isModelLoaded,
  getModelLoadTime,
  getCurrentDevice,
  getOptimalDevice,
  getTaskPrefix,
  preWarmModel,

  // Constants for external use
  EMBEDDING_DIM,
  MAX_TEXT_LENGTH,
  MODEL_NAME,
  TASK_PREFIX
};
