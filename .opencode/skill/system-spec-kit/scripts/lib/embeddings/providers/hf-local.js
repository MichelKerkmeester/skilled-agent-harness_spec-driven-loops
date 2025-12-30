/**
 * Provider de Embeddings - Hugging Face Local
 * 
 * Usa @huggingface/transformers con nomic-embed-text-v1.5 para
 * generar embeddings de 768 dimensiones completamente locales.
 * 
 * @module embeddings/providers/hf-local
 * @version 1.0.0
 */

'use strict';

const { EmbeddingProfile } = require('../profile');

// ───────────────────────────────────────────────────────────────
// CONFIGURACIÓN
// ───────────────────────────────────────────────────────────────

const DEFAULT_MODEL = 'nomic-ai/nomic-embed-text-v1.5';
const EMBEDDING_DIM = 768;
const MAX_TEXT_LENGTH = 8000; // nomic soporta 8192 tokens
const EMBEDDING_TIMEOUT = 30000; // 30 segundos timeout

/**
 * Prefijos de tarea requeridos por nomic-embed-text-v1.5
 * Ver: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5
 */
const TASK_PREFIX = {
  DOCUMENT: 'search_document: ',
  QUERY: 'search_query: ',
  CLUSTERING: 'clustering: ',
  CLASSIFICATION: 'classification: '
};

// ───────────────────────────────────────────────────────────────
// DETECCIÓN DE DISPOSITIVO
// ───────────────────────────────────────────────────────────────

let currentDevice = null;

/**
 * Determinar el dispositivo óptimo para embeddings
 * - macOS con Apple Silicon: Usar MPS (Metal Performance Shaders)
 * - Otras plataformas: Usar CPU
 *
 * @returns {string} Identificador de dispositivo ('mps' o 'cpu')
 */
function getOptimalDevice() {
  if (process.platform === 'darwin') {
    return 'mps';
  }
  return 'cpu';
}

// ───────────────────────────────────────────────────────────────
// CLASE PROVIDER
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
   * Obtener o crear el pipeline de embeddings (patrón singleton)
   * La primera llamada descarga/carga el modelo (~274MB), las siguientes retornan la instancia cacheada.
   * Previene condiciones de carrera con múltiples solicitudes de carga simultáneas.
   *
   * @returns {Promise<Object>} Pipeline de extracción de features
   */
  async getModel() {
    // Si ya está cargado, retornar inmediatamente
    if (this.extractor) {
      return this.extractor;
    }

    // Si está cargando, esperar a que complete (protección contra race conditions)
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Iniciar carga y guardar la promesa
    this.loadingPromise = (async () => {
      const start = Date.now();
      try {
        console.warn(`[hf-local] Cargando ${this.modelName} (~274MB, primera carga puede tomar 15-30s)...`);

        // Import dinámico para módulo ESM
        const { pipeline } = await import('@huggingface/transformers');

        // Intentar dispositivo óptimo primero (MPS en Mac)
        let targetDevice = getOptimalDevice();
        console.log(`[hf-local] Intentando dispositivo: ${targetDevice}`);

        try {
          this.extractor = await pipeline('feature-extraction', this.modelName, {
            dtype: 'fp32',
            device: targetDevice
          });
          currentDevice = targetDevice;
        } catch (deviceError) {
          // MPS falló, fallback a CPU
          if (targetDevice !== 'cpu') {
            console.warn(`[hf-local] ${targetDevice.toUpperCase()} no disponible (${deviceError.message}), usando CPU`);
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
        console.warn(`[hf-local] Modelo cargado en ${this.modelLoadTime}ms (dispositivo: ${currentDevice})`);

        return this.extractor;
      } catch (error) {
        this.loadingPromise = null;  // Reset en caso de fallo para permitir reintento
        this.isHealthy = false;
        throw error;
      }
    })();

    return this.loadingPromise;
  }

  /**
   * Generar embedding para texto sin prefijo (función interna)
   *
   * @param {string} text - Texto a embeddear (con prefijo de tarea si es necesario)
   * @returns {Promise<Float32Array>} Vector de embeddings normalizado de 768 dimensiones
   */
  async generateEmbedding(text) {
    if (!text || typeof text !== 'string') {
      console.warn('[hf-local] Texto vacío o inválido proporcionado');
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn('[hf-local] Texto vacío después de trim');
      return null;
    }

    // Truncar si excede límite (chunking semántico se maneja en capa superior)
    let inputText = trimmedText;
    if (inputText.length > this.maxTextLength) {
      console.warn(`[hf-local] Texto truncado de ${inputText.length} a ${this.maxTextLength} caracteres`);
      inputText = inputText.substring(0, this.maxTextLength);
    }

    const start = Date.now();

    try {
      const model = await this.getModel();

      // Generar embedding con mean pooling y normalización
      const output = await model(inputText, {
        pooling: 'mean',
        normalize: true
      });

      // Convertir a Float32Array
      const embedding = output.data instanceof Float32Array
        ? output.data
        : new Float32Array(output.data);

      const inferenceTime = Date.now() - start;

      // Logging de performance (target <800ms)
      if (inferenceTime > 800) {
        console.warn(`[hf-local] Inferencia lenta: ${inferenceTime}ms (target <800ms)`);
      }

      return embedding;

    } catch (error) {
      console.warn(`[hf-local] Generación falló: ${error.message}`);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Embeddear un documento (para indexación)
   */
  async embedDocument(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    const prefixedText = TASK_PREFIX.DOCUMENT + text;
    return await this.generateEmbedding(prefixedText);
  }

  /**
   * Embeddear una query de búsqueda
   */
  async embedQuery(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    const prefixedQuery = TASK_PREFIX.QUERY + text;
    return await this.generateEmbedding(prefixedQuery);
  }

  /**
   * Pre-calentar el modelo (útil en startup del servidor)
   */
  async warmup() {
    try {
      console.log('[hf-local] Pre-calentando modelo...');
      await this.embedQuery('test warmup query');
      console.log('[hf-local] Modelo pre-calentado exitosamente');
      return true;
    } catch (error) {
      console.warn(`[hf-local] Warmup falló: ${error.message}`);
      this.isHealthy = false;
      return false;
    }
  }

  /**
   * Obtener metadata del provider
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
   * Obtener perfil de embeddings
   */
  getProfile() {
    return new EmbeddingProfile({
      provider: 'hf-local',
      model: this.modelName,
      dim: this.dim
    });
  }

  /**
   * Verificar si el provider está saludable
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
