// ───────────────────────────────────────────────────────────────
// SHARED: EMBEDDINGS MODULE
// ───────────────────────────────────────────────────────────────
'use strict';

const crypto = require('crypto');
const { create_embeddings_provider, get_provider_info } = require('./embeddings/factory');
const { semantic_chunk, MAX_TEXT_LENGTH, RESERVED_OVERVIEW, RESERVED_OUTCOME, MIN_SECTION_LENGTH } = require('./chunking');

/* ───────────────────────────────────────────────────────────────
   1. EMBEDDING CACHE
   ─────────────────────────────────────────────────────────────── */

const EMBEDDING_CACHE_MAX_SIZE = 1000;
const embedding_cache = new Map();

/* ───────────────────────────────────────────────────────────────
   RATE LIMITING CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

/**
 * Delay between batch embedding requests (ms).
 * Prevents overwhelming external embedding providers (Voyage, OpenAI).
 * Configurable via EMBEDDING_BATCH_DELAY_MS environment variable.
 * Default: 100ms (allows ~10 requests/second, well under typical rate limits)
 */
const BATCH_DELAY_MS = parseInt(process.env.EMBEDDING_BATCH_DELAY_MS, 10) || 100;

/**
 * Sleep helper for rate limiting
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate SHA256 hash key for cache lookup.
 * Uses 32 hex chars (128 bits) for cache keys.
 * 
 * Collision Analysis:
 * - 32 hex chars = 128 bits = 2^128 possible values
 * - With 1000 cache entries, birthday paradox collision probability ≈ 0
 * - Even with 10^18 entries, collision probability < 10^-20
 * 
 * @param {string} text - Text to hash
 * @returns {string} 32-character hex hash
 */
function get_cache_key(text) {
  return crypto.createHash('sha256').update(text).digest('hex').substring(0, 32);
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

/**
 * Generate embeddings for batch of texts with parallel processing and rate limiting.
 * 
 * Rate limiting prevents overwhelming external embedding providers (Voyage, OpenAI)
 * by adding a configurable delay between batch requests.
 * 
 * @param {string[]} texts - Array of texts to embed
 * @param {number} concurrency - Number of parallel requests per batch (default: 5)
 * @param {object} options - Optional configuration
 * @param {number} options.delayMs - Delay between batches in ms (default: BATCH_DELAY_MS)
 * @param {boolean} options.verbose - Log rate limiting behavior (default: false)
 * @returns {Promise<(Float32Array|null)[]>} Array of embeddings
 */
async function generate_batch_embeddings(texts, concurrency = 5, options = {}) {
  if (!Array.isArray(texts)) {
    throw new TypeError('texts must be an array');
  }

  if (texts.length === 0) {
    return [];
  }

  const delay_ms = options.delayMs ?? BATCH_DELAY_MS;
  const verbose = options.verbose ?? false;
  const total_batches = Math.ceil(texts.length / concurrency);

  if (verbose && total_batches > 1) {
    console.error(`[embeddings] Processing ${texts.length} texts in ${total_batches} batches (delay: ${delay_ms}ms)`);
  }

  const results = [];
  for (let i = 0; i < texts.length; i += concurrency) {
    const batch_num = Math.floor(i / concurrency) + 1;
    const batch = texts.slice(i, i + concurrency);
    
    const batch_results = await Promise.all(
      batch.map(text => generate_embedding(text))
    );
    results.push(...batch_results);

    // Rate limiting: delay between batches (skip after last batch)
    const is_last_batch = i + concurrency >= texts.length;
    if (!is_last_batch && delay_ms > 0) {
      if (verbose) {
        console.error(`[embeddings] Batch ${batch_num}/${total_batches} complete, waiting ${delay_ms}ms...`);
      }
      await sleep(delay_ms);
    }
  }

  if (verbose && total_batches > 1) {
    console.error(`[embeddings] All ${total_batches} batches complete`);
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

/**
 * Generate embedding for a search query.
 * 
 * Note: Query embeddings are intentionally NOT cached because:
 * 1. Queries are typically unique and transient (low cache hit rate)
 * 2. Query patterns differ from documents (different semantic context)
 * 3. Caching queries would consume cache space better used for documents
 * 4. Query generation is fast enough for interactive use
 * 
 * If your use case has repeated identical queries, consider caching
 * at the application layer with query-specific TTL.
 */
async function generate_query_embedding(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[embeddings] Empty query');
    return null;
  }

  // Check cache for repeated queries (optional optimization)
  const trimmed = query.trim();
  const cache_key = 'query:' + trimmed;
  const cached = get_cached_embedding(cache_key);
  if (cached) {
    return cached;
  }

  const provider = await get_provider();
  const embedding = await provider.embed_query(trimmed);
  
  // Cache query embeddings with lower priority (only if space available)
  if (embedding && embedding_cache.size < EMBEDDING_CACHE_MAX_SIZE * 0.9) {
    cache_embedding(cache_key, embedding);
  }
  
  return embedding;
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
// MAX_TEXT_LENGTH is imported from chunking.js (single source of truth)
// DEFAULT_MODEL_NAME is the fallback; use get_model_name() for the actual active model
const DEFAULT_MODEL_NAME = 'nomic-ai/nomic-embed-text-v1.5';
// Legacy alias for backwards compatibility
const MODEL_NAME = DEFAULT_MODEL_NAME;
const BATCH_RATE_LIMIT_DELAY = BATCH_DELAY_MS; // Alias for export

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
  DEFAULT_MODEL_NAME,
  TASK_PREFIX,
  BATCH_DELAY_MS,
  BATCH_RATE_LIMIT_DELAY,
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
