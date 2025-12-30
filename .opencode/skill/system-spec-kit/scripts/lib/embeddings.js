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
 * @version 12.0.0
 */

'use strict';

const { createEmbeddingsProvider, getProviderInfo } = require('./embeddings/factory');
const { semanticChunk, RESERVED_OVERVIEW, RESERVED_OUTCOME, MIN_SECTION_LENGTH } = require('./embeddings-legacy');

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

  const provider = await getProvider();
  
  // Apply semantic chunking if necessary
  const maxLength = 8000; // Compatible with nomic and safe for most models
  let inputText = trimmedText;
  if (inputText.length > maxLength) {
    inputText = semanticChunk(trimmedText, maxLength);
  }

  return await provider.generateEmbedding(inputText);
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
 * Generate embeddings for batch of texts
 *
 * @param {string[]} texts - Array of texts
 * @returns {Promise<Float32Array[]>} Array of embeddings
 */
async function generateBatchEmbeddings(texts) {
  if (!Array.isArray(texts)) {
    throw new TypeError('texts must be an array');
  }

  const results = [];
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    results.push(embedding);
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

  const provider = await getProvider();
  
  // Apply semantic chunking if necessary
  const maxLength = 8000;
  let inputText = text;
  if (inputText.length > maxLength) {
    inputText = semanticChunk(text, maxLength);
  }
  
  return await provider.embedDocument(inputText);
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
 * @returns {number} Embedding dimension
 */
function getEmbeddingDimension() {
  if (providerInstance) {
    return providerInstance.getProfile().dim;
  }
  // Default for compatibility
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
 * Get current embedding profile
 * @returns {Object} Current embedding profile
 */
function getEmbeddingProfile() {
  if (providerInstance) {
    return providerInstance.getProfile();
  }
  return null;
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
  getProviderMetadata,

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
