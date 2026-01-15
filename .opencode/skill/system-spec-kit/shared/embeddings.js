// ───────────────────────────────────────────────────────────────
// SHARED: EMBEDDINGS MODULE
// ───────────────────────────────────────────────────────────────
'use strict';

const crypto = require('crypto');
const { create_embeddings_provider, get_provider_info } = require('./embeddings/factory');
const { semantic_chunk, RESERVED_OVERVIEW, RESERVED_OUTCOME, MIN_SECTION_LENGTH } = require('./chunking');

/* ───────────────────────────────────────────────────────────────
   1. EMBEDDING CACHE
   ─────────────────────────────────────────────────────────────── */

const EMBEDDING_CACHE_MAX_SIZE = 1000;
const embedding_cache = new Map();

/** Generate SHA256 hash key (first 16 chars) for cache lookup */
function get_cache_key(text) {
  return crypto.createHash('sha256').update(text).digest('hex').substring(0, 16);
}

/** Get cached embedding or null */
function get_cached_embedding(text) {
  const key = get_cache_key(text);
  const cached = embedding_cache.get(key);
  if (cached) {
    embedding_cache.delete(key);
    embedding_cache.set(key, cached);
    return cached;
  }
  return null;
}

/** Store embedding in cache with LRU eviction */
function cache_embedding(text, embedding) {
  const key = get_cache_key(text);
  if (embedding_cache.size >= EMBEDDING_CACHE_MAX_SIZE) {
    const first_key = embedding_cache.keys().next().value;
    embedding_cache.delete(first_key);
  }
  embedding_cache.set(key, embedding);
}

function clear_embedding_cache() {
  embedding_cache.clear();
}

function get_embedding_cache_stats() {
  return {
    size: embedding_cache.size,
    max_size: EMBEDDING_CACHE_MAX_SIZE,
  };
}

/* ───────────────────────────────────────────────────────────────
   2. SINGLETON PROVIDER INSTANCE
   ─────────────────────────────────────────────────────────────── */

let provider_instance = null;
let provider_init_promise = null;

/** Get or create provider instance (singleton) */
async function get_provider() {
  if (provider_instance) {
    return provider_instance;
  }

  if (provider_init_promise) {
    return provider_init_promise;
  }

  provider_init_promise = (async () => {
    try {
      provider_instance = await create_embeddings_provider({
        warmup: false,
      });
      return provider_instance;
    } catch (error) {
      provider_init_promise = null;
      throw error;
    }
  })();

  return provider_init_promise;
}

/* ───────────────────────────────────────────────────────────────
   3. CORE EMBEDDING GENERATION
   ─────────────────────────────────────────────────────────────── */

/** Generate embedding for text (low-level function) */
async function generate_embedding(text) {
  if (!text || typeof text !== 'string') {
    console.warn('[embeddings] Empty or invalid text provided');
    return null;
  }

  const trimmed_text = text.trim();
  if (trimmed_text.length === 0) {
    console.warn('[embeddings] Empty text after trim');
    return null;
  }

  const cached = get_cached_embedding(trimmed_text);
  if (cached) {
    return cached;
  }

  const provider = await get_provider();
  
  const max_length = 8000;
  let input_text = trimmed_text;
  if (input_text.length > max_length) {
    input_text = semantic_chunk(trimmed_text, max_length);
  }

  const embedding = await provider.generate_embedding(input_text);
  
  if (embedding) {
    cache_embedding(trimmed_text, embedding);
  }
  
  return embedding;
}

/** Generate embedding with timeout protection (default: 30s) */
async function generate_embedding_with_timeout(text, timeout = 30000) {
  const timeout_promise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Embedding generation timed out')), timeout);
  });

  return Promise.race([
    generate_embedding(text),
    timeout_promise,
  ]);
}

/** Generate embeddings for batch of texts with parallel processing */
async function generate_batch_embeddings(texts, concurrency = 5) {
  if (!Array.isArray(texts)) {
    throw new TypeError('texts must be an array');
  }

  if (texts.length === 0) {
    return [];
  }

  const results = [];
  for (let i = 0; i < texts.length; i += concurrency) {
    const batch = texts.slice(i, i + concurrency);
    const batch_results = await Promise.all(
      batch.map(text => generate_embedding(text))
    );
    results.push(...batch_results);
  }
  return results;
}

/* ───────────────────────────────────────────────────────────────
   4. TASK-SPECIFIC FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

/** Generate embedding for a document (for indexing/storage) */
async function generate_document_embedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn('[embeddings] Empty document text');
    return null;
  }

  const trimmed_text = text.trim();
  const cache_text = 'doc:' + trimmed_text;
  const cached = get_cached_embedding(cache_text);
  if (cached) {
    return cached;
  }

  const provider = await get_provider();
  
  const max_length = 8000;
  let input_text = trimmed_text;
  if (input_text.length > max_length) {
    input_text = semantic_chunk(trimmed_text, max_length);
  }
  
  const embedding = await provider.embed_document(input_text);
  
  if (embedding) {
    cache_embedding(cache_text, embedding);
  }
  
  return embedding;
}

/** Generate embedding for a search query */
async function generate_query_embedding(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[embeddings] Empty query');
    return null;
  }

  const provider = await get_provider();
  return await provider.embed_query(query);
}

/** Generate embedding for clustering task */
async function generate_clustering_embedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return null;
  }
  return await generate_document_embedding(text);
}

/* ───────────────────────────────────────────────────────────────
   5. UTILITY FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

/**
 * Get embedding dimension
 * Priority: 1) Initialized provider, 2) Environment detection, 3) Legacy default (768)
 */
function get_embedding_dimension() {
  if (provider_instance) {
    return provider_instance.get_profile().dim;
  }
  
  const provider = process.env.EMBEDDINGS_PROVIDER?.toLowerCase();
  if (provider === 'voyage') return 1024;
  if (provider === 'openai') return 1536;
  
  if (process.env.VOYAGE_API_KEY && !process.env.OPENAI_API_KEY) return 1024;
  if (process.env.OPENAI_API_KEY && !process.env.VOYAGE_API_KEY) return 1536;
  
  return 768;
}

function get_model_name() {
  if (provider_instance) {
    return provider_instance.get_profile().model;
  }
  return 'not-loaded';
}

function is_model_loaded() {
  return provider_instance !== null;
}

function get_model_load_time() {
  if (provider_instance) {
    const metadata = provider_instance.get_metadata();
    return metadata.load_time_ms || null;
  }
  return null;
}

function get_current_device() {
  if (provider_instance) {
    const metadata = provider_instance.get_metadata();
    return metadata.device || null;
  }
  return null;
}

function get_optimal_device() {
  return process.platform === 'darwin' ? 'mps' : 'cpu';
}

function get_task_prefix(task) {
  const prefixes = {
    document: 'search_document: ',
    query: 'search_query: ',
    clustering: 'clustering: ',
    classification: 'classification: ',
  };
  return prefixes[task] || '';
}

/** Pre-warm the model for faster first embedding */
async function pre_warm_model() {
  try {
    const provider = await get_provider();
    await provider.warmup();
    console.error('[embeddings] Provider warmed up successfully');
    return true;
  } catch (error) {
    console.error('[embeddings] Pre-warmup failed:', error.message);
    return false;
  }
}

/** Get current embedding profile (sync - returns null if not initialized) */
function get_embedding_profile() {
  if (provider_instance) {
    return provider_instance.get_profile();
  }
  return null;
}

/** Get embedding profile with initialization guarantee (async) */
async function get_embedding_profile_async() {
  const provider = await get_provider();
  return provider.get_profile();
}

function get_provider_metadata() {
  if (provider_instance) {
    return provider_instance.get_metadata();
  }
  return get_provider_info();
}

/* ───────────────────────────────────────────────────────────────
   6. CONSTANTS
   ─────────────────────────────────────────────────────────────── */

const EMBEDDING_DIM = 768;
const EMBEDDING_TIMEOUT = 30000;
const MAX_TEXT_LENGTH = 8000;
const MODEL_NAME = 'nomic-ai/nomic-embed-text-v1.5';

const TASK_PREFIX = {
  DOCUMENT: 'search_document: ',
  QUERY: 'search_query: ',
  CLUSTERING: 'clustering: ',
  CLASSIFICATION: 'classification: ',
};

/* ───────────────────────────────────────────────────────────────
   7. MODULE EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Snake_case exports (original)
  generate_embedding,
  generate_embedding_with_timeout,
  generate_batch_embeddings,
  generate_document_embedding,
  generate_query_embedding,
  generate_clustering_embedding,
  semantic_chunk,
  get_embedding_dimension,
  get_model_name,
  is_model_loaded,
  get_model_load_time,
  get_current_device,
  get_optimal_device,
  get_task_prefix,
  pre_warm_model,
  get_embedding_profile,
  get_embedding_profile_async,
  get_provider_metadata,
  clear_embedding_cache,
  get_embedding_cache_stats,
  EMBEDDING_DIM,
  EMBEDDING_TIMEOUT,
  MAX_TEXT_LENGTH,
  MODEL_NAME,
  TASK_PREFIX,
  RESERVED_OVERVIEW,
  RESERVED_OUTCOME,
  MIN_SECTION_LENGTH,
  // CamelCase aliases (for generate-context.js compatibility)
  generateEmbedding: generate_embedding,
  generateEmbeddingWithTimeout: generate_embedding_with_timeout,
  generateBatchEmbeddings: generate_batch_embeddings,
  generateDocumentEmbedding: generate_document_embedding,
  generateQueryEmbedding: generate_query_embedding,
  generateClusteringEmbedding: generate_clustering_embedding,
  semanticChunk: semantic_chunk,
  getEmbeddingDimension: get_embedding_dimension,
  getModelName: get_model_name,
  isModelLoaded: is_model_loaded,
  getModelLoadTime: get_model_load_time,
  getCurrentDevice: get_current_device,
  getOptimalDevice: get_optimal_device,
  getTaskPrefix: get_task_prefix,
  preWarmModel: pre_warm_model,
  getEmbeddingProfile: get_embedding_profile,
  getEmbeddingProfileAsync: get_embedding_profile_async,
  getProviderMetadata: get_provider_metadata,
  clearEmbeddingCache: clear_embedding_cache,
  getEmbeddingCacheStats: get_embedding_cache_stats,
};
