/**
 * Embeddings Module - Unified embedding generation
 *
 * Supports multiple providers (OpenAI, HF local, Ollama) with robust fallback.
 * Maintains compatibility with legacy API while allowing environment variable configuration.
 *
 * Configuration precedence:
 * 1. Explicit EMBEDDINGS_PROVIDER (openai, hf-local, auto)
 * 2. Auto-detection: OpenAI if OPENAI_API_KEY exists
 * 3. Fallback: HF local
 *
 * @module embeddings
 */

'use strict';

const crypto = require('crypto');
const { createEmbeddingsProvider, getProviderInfo } = require('./embeddings/factory');
const { semanticChunk, RESERVED_OVERVIEW, RESERVED_OUTCOME, MIN_SECTION_LENGTH } = require('./chunking');

// ───────────────────────────────────────────────────────────────
// EMBEDDING CACHE
// ───────────────────────────────────────────────────────────────

// Cache configuration
const EMBEDDING_CACHE_MAX_SIZE = 1000;
const embeddingCache = new Map();

/**
 * Generate a hash key for cache lookup
 * @param {string} text - Text to hash
 * @returns {string} - SHA256 hash (first 16 chars)
 */
function getCacheKey(text) {
  return crypto.createHash('sha256').update(text).digest('hex').substring(0, 16);
}

/**
 * Get cached embedding or null
 * @param {string} text - Text to look up
 * @returns {Float32Array|null} - Cached embedding or null
 */
function getCachedEmbedding(text) {
  const key = getCacheKey(text);
  const cached = embeddingCache.get(key);
  if (cached) {
    // Update access time for LRU
    embeddingCache.delete(key);
    embeddingCache.set(key, cached);
    return cached;
  }
  return null;
}

/**
 * Store embedding in cache
 * @param {string} text - Original text
 * @param {Float32Array} embedding - Embedding to cache
 */
function cacheEmbedding(text, embedding) {
  const key = getCacheKey(text);
  
  // Evict oldest entries if cache is full
  if (embeddingCache.size >= EMBEDDING_CACHE_MAX_SIZE) {
    const firstKey = embeddingCache.keys().next().value;
    embeddingCache.delete(firstKey);
  }
  
  embeddingCache.set(key, embedding);
}

/**
 * Clear the embedding cache
 */
function clearEmbeddingCache() {
  embeddingCache.clear();
}

/**
 * Get cache statistics
 * @returns {Object} - { size, maxSize, hitRate }
 */
function getEmbeddingCacheStats() {
  return {
    size: embeddingCache.size,
    maxSize: EMBEDDING_CACHE_MAX_SIZE
  };
}

// ───────────────────────────────────────────────────────────────
// SINGLETON PROVIDER INSTANCE
// ───────────────────────────────────────────────────────────────

let providerInstance = null;
let providerInitPromise = null;

/**
 * Get or create provider instance (singleton)
 * 
 * @returns {Promise<Object>} Provider instance
 */
async function getProvider() {
  if (providerInstance) {
    return providerInstance;
  }

  if (providerInitPromise) {
    return providerInitPromise;
  }

  providerInitPromise = (async () => {
    try {
      providerInstance = await createEmbeddingsProvider({
        warmup: false // No automatic warmup, done explicitly with preWarmModel
      });
      return providerInstance;
    } catch (error) {
      providerInitPromise = null;
      throw error;
    }
  })();

  return providerInitPromise;
}

// ───────────────────────────────────────────────────────────────
// CORE EMBEDDING GENERATION (API compatible with legacy)
// ───────────────────────────────────────────────────────────────

/**
 * Generate embedding for text (low-level function)
 *
 * @param {string} text - Text to embed
 * @returns {Promise<Float32Array>} Normalized embedding vector
 */
async function generateEmbedding(text) {
  if (!text || typeof text !== 'string') {
    console.warn('[embeddings] Empty or invalid text provided');
    return null;
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    console.warn('[embeddings] Empty text after trim');
    return null;
  }

  // Check cache first
  const cached = getCachedEmbedding(trimmedText);
  if (cached) {
    return cached;
  }

  const provider = await getProvider();
  
  // Apply semantic chunking if necessary
  const maxLength = 8000; // Compatible with nomic and safe for most models
  let inputText = trimmedText;
  if (inputText.length > maxLength) {
    inputText = semanticChunk(trimmedText, maxLength);
  }

  const embedding = await provider.generateEmbedding(inputText);
  
  // Cache the result
  if (embedding) {
    cacheEmbedding(trimmedText, embedding);
  }
  
  return embedding;
}

/**
 * Generate embedding with timeout protection
 *
 * @param {string} text - Text to embed
 * @param {number} timeout - Timeout in milliseconds (default: 30000)
 * @returns {Promise<Float32Array>} Embedding vector
 */
async function generateEmbeddingWithTimeout(text, timeout = 30000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Embedding generation timed out')), timeout);
  });

  return Promise.race([
    generateEmbedding(text),
    timeoutPromise
  ]);
}

/**
 * Generate embeddings for batch of texts with parallel processing
 *
 * Processes texts in parallel batches for improved performance.
 * Uses concurrency control to avoid overwhelming the embedding provider.
 *
 * @param {string[]} texts - Array of texts
 * @param {number} [concurrency=5] - Number of texts to process in parallel
 * @returns {Promise<Float32Array[]>} Array of embeddings
 */
async function generateBatchEmbeddings(texts, concurrency = 5) {
  if (!Array.isArray(texts)) {
    throw new TypeError('texts must be an array');
  }

  if (texts.length === 0) {
    return [];
  }

  // Process in parallel batches for better performance
  const results = [];
  for (let i = 0; i < texts.length; i += concurrency) {
    const batch = texts.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(text => generateEmbedding(text))
    );
    results.push(...batchResults);
  }
  return results;
}

// ───────────────────────────────────────────────────────────────
// TASK-SPECIFIC FUNCTIONS (Recommended)
// ───────────────────────────────────────────────────────────────

/**
 * Generate embedding for a document (for indexing/storage)
 *
 * @param {string} text - Document text
 * @returns {Promise<Float32Array>} Embedding vector
 */
async function generateDocumentEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn('[embeddings] Empty document text');
    return null;
  }

  const trimmedText = text.trim();
  
  // Check cache first (using document prefix for cache key distinction)
  const cacheText = 'doc:' + trimmedText;
  const cached = getCachedEmbedding(cacheText);
  if (cached) {
    return cached;
  }

  const provider = await getProvider();
  
  // Apply semantic chunking if necessary
  const maxLength = 8000;
  let inputText = trimmedText;
  if (inputText.length > maxLength) {
    inputText = semanticChunk(trimmedText, maxLength);
  }
  
  const embedding = await provider.embedDocument(inputText);
  
  // Cache the result
  if (embedding) {
    cacheEmbedding(cacheText, embedding);
  }
  
  return embedding;
}

/**
 * Generate embedding for a search query
 *
 * @param {string} query - Search query
 * @returns {Promise<Float32Array>} Embedding vector
 */
async function generateQueryEmbedding(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[embeddings] Empty query');
    return null;
  }

  const provider = await getProvider();
  return await provider.embedQuery(query);
}

/**
 * Generate embedding for clustering task
 *
 * @param {string} text - Text for clustering
 * @returns {Promise<Float32Array>} Embedding vector
 */
async function generateClusteringEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return null;
  }

  // For clustering we use the document function
  return await generateDocumentEmbedding(text);
}

// ───────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS (Legacy API compatibility)
// ───────────────────────────────────────────────────────────────

/**
 * Get embedding dimension
 * 
 * Returns the embedding dimension for the current provider.
 * Priority: 1) Initialized provider, 2) Environment-based detection, 3) Legacy default
 * 
 * @returns {number} Embedding dimension (768 for HF-local, 1024 for Voyage, 1536 for OpenAI)
 */
function getEmbeddingDimension() {
  // Priority 1: Use initialized provider (most accurate)
  if (providerInstance) {
    return providerInstance.getProfile().dim;
  }
  
  // Priority 2: Detect from environment configuration
  const provider = process.env.EMBEDDINGS_PROVIDER?.toLowerCase();
  if (provider === 'voyage') {
    return 1024; // Voyage AI models use 1024 dimensions
  }
  if (provider === 'openai') {
    return 1536; // OpenAI text-embedding-3-small uses 1536
  }
  
  // Priority 3: Check for API keys as hints
  if (process.env.VOYAGE_API_KEY && !process.env.OPENAI_API_KEY) {
    return 1024; // Voyage likely configured
  }
  if (process.env.OPENAI_API_KEY && !process.env.VOYAGE_API_KEY) {
    return 1536; // OpenAI likely configured
  }
  
  // Default: HF-local (nomic-embed-text-v1.5 uses 768)
  return 768;
}

/**
 * Get model name
 * @returns {string} Model name
 */
function getModelName() {
  if (providerInstance) {
    return providerInstance.getProfile().model;
  }
  return 'not-loaded';
}

/**
 * Check if model is loaded
 * @returns {boolean} True if model is loaded
 */
function isModelLoaded() {
  return providerInstance !== null;
}

/**
 * Get model load time (compatibility - may not be available for all providers)
 * @returns {number|null} Load time in ms or null
 */
function getModelLoadTime() {
  if (providerInstance) {
    const metadata = providerInstance.getMetadata();
    return metadata.loadTimeMs || null;
  }
  return null;
}

/**
 * Get current compute device (compatibility - only for HF local)
 * @returns {string|null} Device identifier or null
 */
function getCurrentDevice() {
  if (providerInstance) {
    const metadata = providerInstance.getMetadata();
    return metadata.device || null;
  }
  return null;
}

/**
 * Get optimal device (compatibility function)
 * @returns {string} 'mps' or 'cpu'
 */
function getOptimalDevice() {
  return process.platform === 'darwin' ? 'mps' : 'cpu';
}

/**
 * Get task prefix (compatibility - some providers do not use prefixes)
 * @param {'document'|'query'|'clustering'|'classification'} task - Task type
 * @returns {string} Task prefix
 */
function getTaskPrefix(task) {
  const prefixes = {
    document: 'search_document: ',
    query: 'search_query: ',
    clustering: 'clustering: ',
    classification: 'classification: '
  };
  return prefixes[task] || '';
}

/**
 * Pre-warm the model for faster first embedding
 *
 * @returns {Promise<boolean>} True if pre-warm was successful
 */
async function preWarmModel() {
  try {
    const provider = await getProvider();
    await provider.warmup();
    console.log('[embeddings] Provider warmed up successfully');
    return true;
  } catch (error) {
    console.error('[embeddings] Pre-warmup failed:', error.message);
    return false;
  }
}

/**
 * Get current embedding profile (sync - returns null if not initialized)
 * @returns {Object|null} Current embedding profile or null
 */
function getEmbeddingProfile() {
  if (providerInstance) {
    return providerInstance.getProfile();
  }
  return null;
}

/**
 * Get embedding profile with initialization guarantee (async)
 * Use this when you need the profile and can't risk getting null
 * @returns {Promise<Object>} Embedding profile (never null)
 */
async function getEmbeddingProfileAsync() {
  const provider = await getProvider();
  return provider.getProfile();
}

/**
 * Get provider metadata
 * @returns {Object} Provider metadata
 */
function getProviderMetadata() {
  if (providerInstance) {
    return providerInstance.getMetadata();
  }
  return getProviderInfo();
}

// ───────────────────────────────────────────────────────────────
// CONSTANTS (Compatibility)
// ───────────────────────────────────────────────────────────────

const EMBEDDING_DIM = 768; // Default legacy
const EMBEDDING_TIMEOUT = 30000;
const MAX_TEXT_LENGTH = 8000;
const MODEL_NAME = 'nomic-ai/nomic-embed-text-v1.5'; // Default legacy

const TASK_PREFIX = {
  DOCUMENT: 'search_document: ',
  QUERY: 'search_query: ',
  CLUSTERING: 'clustering: ',
  CLASSIFICATION: 'classification: '
};

// ───────────────────────────────────────────────────────────────
// MODULE EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Core functions
  generateEmbedding,
  generateEmbeddingWithTimeout,
  generateBatchEmbeddings,

  // Task-specific functions (recommended)
  generateDocumentEmbedding,
  generateQueryEmbedding,
  generateClusteringEmbedding,

  // Semantic chunking (re-export from legacy)
  semanticChunk,

  // Utility functions
  getEmbeddingDimension,
  getModelName,
  isModelLoaded,
  getModelLoadTime,
  getCurrentDevice,
  getOptimalDevice,
  getTaskPrefix,
  preWarmModel,

  // New functions
  getEmbeddingProfile,
  getEmbeddingProfileAsync,
  getProviderMetadata,

  // Cache functions
  clearEmbeddingCache,
  getEmbeddingCacheStats,

  // Constants
  EMBEDDING_DIM,
  EMBEDDING_TIMEOUT,
  MAX_TEXT_LENGTH,
  MODEL_NAME,
  TASK_PREFIX,
  
  // Chunking configuration (re-export)
  RESERVED_OVERVIEW,
  RESERVED_OUTCOME,
  MIN_SECTION_LENGTH
};
