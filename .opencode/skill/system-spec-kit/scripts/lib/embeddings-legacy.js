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
const EMBEDDING_TIMEOUT = 30000; // 30 seconds timeout for embedding generation

// Semantic chunking configuration
const RESERVED_OVERVIEW = 500;   // First N chars always included
const RESERVED_OUTCOME = 300;    // Last N chars always included
const MIN_SECTION_LENGTH = 20;   // Ignore sections shorter than this

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

  // If currently loading, wait for that to complete (race protection)
  if (loadingPromise) {
    return loadingPromise;
  }

  // Start loading and store the promise
  loadingPromise = (async () => {
    const start = Date.now();
    try {
      console.warn('[embeddings] Loading nomic-embed-text-v1.5 (~274MB, first load may take 15-30s)...');

      // Dynamic import for ESM module
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

      modelLoadTime = Date.now() - start;
      console.warn(`[embeddings] Model loaded in ${modelLoadTime}ms (device: ${currentDevice})`);

      return extractor;
    } catch (error) {
      loadingPromise = null;  // Reset on failure to allow retry
      throw error;
    }
  })();

  return loadingPromise;
}

// ───────────────────────────────────────────────────────────────
// SEMANTIC CHUNKING
// ───────────────────────────────────────────────────────────────

/**
 * Priority patterns for section categorization
 * Sections matching these patterns are prioritized during chunking
 */
const PRIORITY_PATTERNS = {
  high: /overview|summary|decision|chose|key outcome|conclusion|result|important|critical|must|required/i,
  medium: /implementation|file|change|technical|approach|solution|method|function|class|component/i,
  // Everything else is low priority
};

/**
 * Intelligently chunk text to fit within maxLength while preserving important content
 * 
 * Priority-based chunking strategy:
 * 1. Always include first RESERVED_OVERVIEW chars (usually overview/intro)
 * 2. Always include last RESERVED_OUTCOME chars (usually outcomes/conclusions)
 * 3. Always include sections containing "decision" or "chose"
 * 4. Fill remaining space with high → medium → low priority sections
 * 
 * @param {string} text - Full text to chunk
 * @param {number} maxLength - Maximum output length (default: MAX_TEXT_LENGTH)
 * @returns {string} Chunked text within maxLength
 */
function semanticChunk(text, maxLength = MAX_TEXT_LENGTH) {
  // If text fits, return as-is
  if (text.length <= maxLength) {
    return text;
  }

  const originalLength = text.length;
  
  // Step 1: Extract guaranteed sections
  const overview = text.substring(0, RESERVED_OVERVIEW);
  const outcome = text.substring(text.length - RESERVED_OUTCOME);
  
  // Calculate remaining budget after reserved sections
  // Account for separator newlines
  let remainingBudget = maxLength - overview.length - outcome.length - 10;
  
  // Step 2: Split middle content into sections by headers/paragraphs
  const middleText = text.substring(RESERVED_OVERVIEW, text.length - RESERVED_OUTCOME);
  const sections = middleText.split(/\n#{1,3}\s|\n\n/).filter(s => s.trim().length >= MIN_SECTION_LENGTH);
  
  // Step 3: Categorize sections by priority
  const priorities = {
    critical: [],  // Decision sections - always include
    high: [],      // Overview, summary, conclusions
    medium: [],    // Implementation details
    low: []        // Everything else
  };
  
  sections.forEach(section => {
    const trimmed = section.trim();
    if (trimmed.length < MIN_SECTION_LENGTH) return;
    
    // Critical: sections with decision keywords - always include
    if (/decision|chose|decided|selected|picked|concluded/i.test(trimmed)) {
      priorities.critical.push(trimmed);
    } else if (PRIORITY_PATTERNS.high.test(trimmed)) {
      priorities.high.push(trimmed);
    } else if (PRIORITY_PATTERNS.medium.test(trimmed)) {
      priorities.medium.push(trimmed);
    } else {
      priorities.low.push(trimmed);
    }
  });
  
  // Step 4: Build middle content within budget
  const includedSections = [];
  
  // Critical sections (decisions) - always include, subtract from budget
  for (const section of priorities.critical) {
    includedSections.push(section);
    remainingBudget -= section.length + 2; // +2 for separator
  }
  
  // Fill remaining budget with priority order
  for (const priority of ['high', 'medium', 'low']) {
    for (const section of priorities[priority]) {
      if (remainingBudget <= 0) break;
      if (section.length + 2 <= remainingBudget) {
        includedSections.push(section);
        remainingBudget -= section.length + 2;
      }
    }
    if (remainingBudget <= 0) break;
  }
  
  // Step 5: Assemble final text
  let result = overview;
  if (includedSections.length > 0) {
    result += '\n\n' + includedSections.join('\n\n');
  }
  result += '\n\n' + outcome;
  
  // Final safety truncation (should rarely trigger)
  if (result.length > maxLength) {
    result = result.substring(0, maxLength);
  }
  
  // Log chunking stats
  console.warn(`[embeddings] Semantic chunking: ${originalLength} → ${result.length} chars (${Math.round((1 - result.length/originalLength) * 100)}% reduced)`);
  console.warn(`[embeddings] Sections: ${priorities.critical.length} critical, ${priorities.high.length} high, ${priorities.medium.length} medium, ${priorities.low.length} low priority`);
  console.warn(`[embeddings] Included: ${includedSections.length} middle sections + overview(${overview.length}) + outcome(${outcome.length})`);
  
  return result.trim();
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

  // Apply semantic chunking if text exceeds limit
  let inputText = trimmedText;
  if (inputText.length > MAX_TEXT_LENGTH) {
    inputText = semanticChunk(trimmedText, MAX_TEXT_LENGTH);
  }

  const start = Date.now();

  try {
    const model = await getModel();

    // Generate embedding with mean pooling and normalization
    const output = await model(inputText, {
      pooling: 'mean',
      normalize: true
    });

    // Convert to Float32Array (check if already correct type to avoid unnecessary allocation)
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
// TIMEOUT AND BATCH EMBEDDING FUNCTIONS (L12, L13)
// ───────────────────────────────────────────────────────────────

/**
 * Generate embedding with timeout protection (L12)
 *
 * Wraps generateEmbedding with a timeout to prevent hanging on slow operations.
 * Useful for production environments where responsiveness is critical.
 *
 * @param {string} text - Text to embed
 * @param {number} [timeout=EMBEDDING_TIMEOUT] - Timeout in milliseconds (default: 30000)
 * @returns {Promise<Float32Array>} Normalized 768-dim embedding vector
 * @throws {Error} If embedding generation times out or fails
 *
 * @example
 * try {
 *   const embedding = await generateEmbeddingWithTimeout('Hello world', 5000);
 * } catch (err) {
 *   if (err.message.includes('timed out')) {
 *     console.log('Embedding took too long');
 *   }
 * }
 */
async function generateEmbeddingWithTimeout(text, timeout = EMBEDDING_TIMEOUT) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Embedding generation timed out')), timeout);
  });

  return Promise.race([
    generateEmbedding(text),
    timeoutPromise
  ]);
}

/**
 * Generate embeddings for multiple texts in batches (L13)
 *
 * Processes texts in configurable batch sizes to balance throughput
 * and memory usage. Provides progress callback for long operations.
 *
 * @param {string[]} texts - Array of texts to embed
 * @param {Object} [options] - Batch options
 * @param {number} [options.batchSize=5] - Number of texts to process in parallel
 * @param {Function} [options.onProgress] - Progress callback: ({completed, total}) => void
 * @returns {Promise<Float32Array[]>} Array of embedding vectors (null for failed texts)
 *
 * @example
 * const embeddings = await generateBatchEmbeddings(
 *   ['text1', 'text2', 'text3'],
 *   {
 *     batchSize: 2,
 *     onProgress: ({completed, total}) => console.log(`${completed}/${total}`)
 *   }
 * );
 */
async function generateBatchEmbeddings(texts, options = {}) {
  const { batchSize = 5, onProgress } = options;
  const results = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(text => generateEmbedding(text).catch(err => {
        console.warn(`[embeddings] Batch embedding failed for text: ${err.message}`);
        return null;
      }))
    );
    results.push(...batchResults);

    if (onProgress) {
      onProgress({
        completed: Math.min(i + batchSize, texts.length),
        total: texts.length
      });
    }
  }

  return results;
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
 * Pre-warm the model for faster first embedding
 * Call this during server startup to avoid cold start latency
 *
 * @returns {Promise<boolean>} True if model loaded successfully
 */
async function preWarmModel() {
  try {
    await getModel();
    console.log('[embeddings] Model pre-warmed successfully');
    return true;
  } catch (error) {
    console.error('[embeddings] Model pre-warm failed:', error.message);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────
// MODULE EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Core function
  generateEmbedding,

  // Timeout and batch functions (L12, L13)
  generateEmbeddingWithTimeout,
  generateBatchEmbeddings,

  // Task-specific functions (recommended)
  generateDocumentEmbedding,
  generateQueryEmbedding,
  generateClusteringEmbedding,

  // Semantic chunking (can be used standalone)
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

  // Constants for external use
  EMBEDDING_DIM,
  EMBEDDING_TIMEOUT,
  MAX_TEXT_LENGTH,
  MODEL_NAME,
  TASK_PREFIX,
  
  // Chunking configuration
  RESERVED_OVERVIEW,
  RESERVED_OUTCOME,
  MIN_SECTION_LENGTH
};
