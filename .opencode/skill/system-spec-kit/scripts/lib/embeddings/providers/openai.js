/**
 * Provider de Embeddings - OpenAI
 * 
 * Usa la API de OpenAI para generar embeddings.
 * Soporta text-embedding-3-small (1536 dims) y text-embedding-3-large (3072 dims).
 * 
 * @module embeddings/providers/openai
 * @version 1.0.0
 */

'use strict';

const { EmbeddingProfile } = require('../profile');

// ───────────────────────────────────────────────────────────────
// CONFIGURACIÓN
// ───────────────────────────────────────────────────────────────

const DEFAULT_MODEL = 'text-embedding-3-small';
const DEFAULT_DIM = 1536; // text-embedding-3-small
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const REQUEST_TIMEOUT = 30000; // 30 segundos

// Dimensiones por modelo
const MODEL_DIMENSIONS = {
  'text-embedding-3-small': 1536,
  'text-embedding-3-large': 3072,
  'text-embedding-ada-002': 1536
};

// ───────────────────────────────────────────────────────────────
// CLASE PROVIDER
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
      throw new Error('OpenAI API key es requerida. Setear OPENAI_API_KEY.');
    }
  }

  /**
   * Hacer request a la API de OpenAI
   *
   * @param {string|string[]} input - Texto o array de textos
   * @returns {Promise<Object>} Respuesta de la API
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
      
      // Actualizar estadísticas
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
   * Generar embedding para texto
   *
   * @param {string} text - Texto a embeddear
   * @returns {Promise<Float32Array>} Vector de embeddings
   */
  async generateEmbedding(text) {
    if (!text || typeof text !== 'string') {
      console.warn('[openai] Texto vacío o inválido proporcionado');
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn('[openai] Texto vacío después de trim');
      return null;
    }

    const start = Date.now();

    try {
      const response = await this.makeRequest(trimmedText);
      
      if (!response.data || response.data.length === 0) {
        throw new Error('OpenAI no retornó embeddings');
      }

      // Extraer el embedding del primer (y único) elemento
      const embedding = new Float32Array(response.data[0].embedding);

      // Verificar dimensión
      if (embedding.length !== this.dim) {
        console.warn(`[openai] Dimensión inesperada: ${embedding.length}, esperada: ${this.dim}`);
      }

      const inferenceTime = Date.now() - start;
      
      if (inferenceTime > 2000) {
        console.warn(`[openai] Request lento: ${inferenceTime}ms`);
      }

      return embedding;

    } catch (error) {
      console.warn(`[openai] Generación falló: ${error.message}`);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Embeddear un documento (para indexación)
   * Nota: OpenAI no requiere prefijos especiales como nomic
   */
  async embedDocument(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(text);
  }

  /**
   * Embeddear una query de búsqueda
   * Nota: OpenAI no requiere prefijos especiales como nomic
   */
  async embedQuery(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(text);
  }

  /**
   * Pre-calentar el provider (verificar conectividad)
   */
  async warmup() {
    try {
      console.log('[openai] Verificando conectividad con OpenAI API...');
      const result = await this.embedQuery('test warmup query');
      this.isHealthy = result !== null;
      console.log('[openai] Conectividad verificada exitosamente');
      return this.isHealthy;
    } catch (error) {
      console.warn(`[openai] Warmup falló: ${error.message}`);
      this.isHealthy = false;
      return false;
    }
  }

  /**
   * Obtener metadata del provider
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
   * Obtener perfil de embeddings
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

  /**
   * Obtener estadísticas de uso
   */
  getUsageStats() {
    return {
      requestCount: this.requestCount,
      totalTokens: this.totalTokens,
      estimatedCost: this.totalTokens * 0.00002 // ~$0.02 por 1M tokens para text-embedding-3-small
    };
  }
}

module.exports = { OpenAIProvider, MODEL_DIMENSIONS };
