/**
 * Embeddings Module - Unified embedding generation
 *
 * Soporta múltiples providers (OpenAI, HF local, Ollama) con fallback robusto.
 * Mantiene compatibilidad con la API legacy mientras permite configuración por env vars.
 *
 * Precedencia de configuración:
 * 1. EMBEDDINGS_PROVIDER explícito (openai, hf-local, auto)
 * 2. Auto-detección: OpenAI si existe OPENAI_API_KEY
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
 * Obtener o crear la instancia del provider (singleton)
 * 
 * @returns {Promise<Object>} Instancia del provider
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
        warmup: false // No warmup automático, se hace explícitamente con preWarmModel
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
// CORE EMBEDDING GENERATION (API compatible con legacy)
// ───────────────────────────────────────────────────────────────

/**
 * Generate embedding for text (low-level function)
 *
 * @param {string} text - Texto a embeddear
 * @returns {Promise<Float32Array>} Vector de embeddings normalizado
 */
async function generateEmbedding(text) {
  if (!text || typeof text !== 'string') {
    console.warn('[embeddings] Texto vacío o inválido proporcionado');
    return null;
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    console.warn('[embeddings] Texto vacío después de trim');
    return null;
  }

  const provider = await getProvider();
  
  // Aplicar chunking semántico si es necesario
  const maxLength = 8000; // Compatible con nomic y seguro para la mayoría de modelos
  let inputText = trimmedText;
  if (inputText.length > maxLength) {
    inputText = semanticChunk(trimmedText, maxLength);
  }

  return await provider.generateEmbedding(inputText);
}

/**
 * Generate embedding with timeout protection
 *
 * @param {string} text - Texto a embeddear
 * @param {number} timeout - Timeout en milisegundos (default: 30000)
 * @returns {Promise<Float32Array>} Vector de embeddings
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
 * @param {string[]} texts - Array de textos
 * @returns {Promise<Float32Array[]>} Array de embeddings
 */
async function generateBatchEmbeddings(texts) {
  if (!Array.isArray(texts)) {
    throw new TypeError('texts debe ser un array');
  }

  const results = [];
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    results.push(embedding);
  }
  return results;
}

// ───────────────────────────────────────────────────────────────
// TASK-SPECIFIC FUNCTIONS (Recomendadas)
// ───────────────────────────────────────────────────────────────

/**
 * Generate embedding for a document (for indexing/storage)
 *
 * @param {string} text - Texto del documento
 * @returns {Promise<Float32Array>} Vector de embeddings
 */
async function generateDocumentEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn('[embeddings] Texto de documento vacío');
    return null;
  }

  const provider = await getProvider();
  
  // Aplicar chunking semántico si es necesario
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
 * @param {string} query - Query de búsqueda
 * @returns {Promise<Float32Array>} Vector de embeddings
 */
async function generateQueryEmbedding(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[embeddings] Query vacío');
    return null;
  }

  const provider = await getProvider();
  return await provider.embedQuery(query);
}

/**
 * Generate embedding for clustering task
 *
 * @param {string} text - Texto para clustering
 * @returns {Promise<Float32Array>} Vector de embeddings
 */
async function generateClusteringEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return null;
  }

  // Para clustering usamos la función de documento
  return await generateDocumentEmbedding(text);
}

// ───────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS (Compatibilidad con API legacy)
// ───────────────────────────────────────────────────────────────

/**
 * Get embedding dimension
 * @returns {number} Dimensión del embedding
 */
function getEmbeddingDimension() {
  if (providerInstance) {
    return providerInstance.getProfile().dim;
  }
  // Default para compatibilidad
  return 768;
}

/**
 * Get model name
 * @returns {string} Nombre del modelo
 */
function getModelName() {
  if (providerInstance) {
    return providerInstance.getProfile().model;
  }
  return 'not-loaded';
}

/**
 * Check if model is loaded
 * @returns {boolean} True si el modelo está cargado
 */
function isModelLoaded() {
  return providerInstance !== null;
}

/**
 * Get model load time (compatibility - may not be available for all providers)
 * @returns {number|null} Tiempo de carga en ms o null
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
 * @returns {string|null} Identificador del dispositivo o null
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
 * @returns {string} 'mps' o 'cpu'
 */
function getOptimalDevice() {
  return process.platform === 'darwin' ? 'mps' : 'cpu';
}

/**
 * Get task prefix (compatibility - algunos providers no usan prefijos)
 * @param {'document'|'query'|'clustering'|'classification'} task - Tipo de tarea
 * @returns {string} Prefijo de tarea
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
 * @returns {Promise<boolean>} True si se pre-calentó exitosamente
 */
async function preWarmModel() {
  try {
    const provider = await getProvider();
    await provider.warmup();
    console.log('[embeddings] Provider pre-calentado exitosamente');
    return true;
  } catch (error) {
    console.error('[embeddings] Pre-warmup falló:', error.message);
    return false;
  }
}

/**
 * Get current embedding profile
 * @returns {Object} Perfil de embeddings actual
 */
function getEmbeddingProfile() {
  if (providerInstance) {
    return providerInstance.getProfile();
  }
  return null;
}

/**
 * Get provider metadata
 * @returns {Object} Metadata del provider
 */
function getProviderMetadata() {
  if (providerInstance) {
    return providerInstance.getMetadata();
  }
  return getProviderInfo();
}

// ───────────────────────────────────────────────────────────────
// CONSTANTS (Compatibilidad)
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

  // Task-specific functions (recomendadas)
  generateDocumentEmbedding,
  generateQueryEmbedding,
  generateClusteringEmbedding,

  // Semantic chunking (re-export desde legacy)
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
