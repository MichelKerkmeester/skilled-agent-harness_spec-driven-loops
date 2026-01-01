// ───────────────────────────────────────────────────────────────
// OPENAI.JS: OpenAI embeddings provider implementation
// ───────────────────────────────────────────────────────────────
'use strict';

const { EmbeddingProfile } = require('../profile');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const DEFAULT_MODEL = 'text-embedding-3-small';
const DEFAULT_DIM = 1536;
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const REQUEST_TIMEOUT = 30000;

const MODEL_DIMENSIONS = {
  'text-embedding-3-small': 1536,
  'text-embedding-3-large': 3072,
  'text-embedding-ada-002': 1536,
};

/* ───────────────────────────────────────────────────────────────
   2. PROVIDER CLASS
   ─────────────────────────────────────────────────────────────── */

class OpenAIProvider {
  constructor(options = {}) {
    this.api_key = options.apiKey || process.env.OPENAI_API_KEY;
    this.base_url = options.baseUrl || process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL;
    this.model_name = options.model || process.env.OPENAI_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    this.dim = options.dim || MODEL_DIMENSIONS[this.model_name] || DEFAULT_DIM;
    this.timeout = options.timeout || REQUEST_TIMEOUT;
    this.is_healthy = true;
    this.request_count = 0;
    this.total_tokens = 0;

    if (!this.api_key) {
      throw new Error('OpenAI API key is required. Set OPENAI_API_KEY.');
    }
  }

  async make_request(input) {
    const url = `${this.base_url}/embeddings`;
    
    const controller = new AbortController();
    const timeout_id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.api_key}`,
        },
        body: JSON.stringify({
          input,
          model: this.model_name,
          encoding_format: 'float',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout_id);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      this.request_count++;
      if (data.usage) {
        this.total_tokens += data.usage.total_tokens;
      }

      return data;

    } catch (error) {
      clearTimeout(timeout_id);
      
      if (error.name === 'AbortError') {
        throw new Error('OpenAI request timeout');
      }
      
      this.is_healthy = false;
      throw error;
    }
  }

  async generate_embedding(text) {
    if (!text || typeof text !== 'string') {
      console.warn('[openai] Empty or invalid text provided');
      return null;
    }

    const trimmed_text = text.trim();
    if (trimmed_text.length === 0) {
      console.warn('[openai] Empty text after trim');
      return null;
    }

    const start = Date.now();

    try {
      const response = await this.make_request(trimmed_text);
      
      if (!response.data || response.data.length === 0) {
        throw new Error('OpenAI did not return embeddings');
      }

      const embedding = new Float32Array(response.data[0].embedding);

      if (embedding.length !== this.dim) {
        console.warn(`[openai] Unexpected dimension: ${embedding.length}, expected: ${this.dim}`);
      }

      const inference_time = Date.now() - start;
      
      if (inference_time > 2000) {
        console.warn(`[openai] Slow request: ${inference_time}ms`);
      }

      return embedding;

    } catch (error) {
      console.warn(`[openai] Generation failed: ${error.message}`);
      this.is_healthy = false;
      throw error;
    }
  }

  // OpenAI does not use task prefixes like nomic - same method for documents and queries
  async embed_document(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generate_embedding(text);
  }

  async embed_query(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generate_embedding(text);
  }

  async warmup() {
    try {
      console.log('[openai] Checking connectivity with OpenAI API...');
      const result = await this.embed_query('test warmup query');
      this.is_healthy = result !== null;
      console.log('[openai] Connectivity verified successfully');
      return this.is_healthy;
    } catch (error) {
      console.warn(`[openai] Warmup failed: ${error.message}`);
      this.is_healthy = false;
      return false;
    }
  }

  get_metadata() {
    return {
      provider: 'openai',
      model: this.model_name,
      dim: this.dim,
      base_url: this.base_url,
      healthy: this.is_healthy,
      request_count: this.request_count,
      total_tokens: this.total_tokens,
    };
  }

  get_profile() {
    return new EmbeddingProfile({
      provider: 'openai',
      model: this.model_name,
      dim: this.dim,
      baseUrl: this.base_url,
    });
  }

  async health_check() {
    try {
      const result = await this.embed_query('health check');
      this.is_healthy = result !== null;
      return this.is_healthy;
    } catch (error) {
      this.is_healthy = false;
      return false;
    }
  }

  get_usage_stats() {
    return {
      request_count: this.request_count,
      total_tokens: this.total_tokens,
      // ~$0.02 per 1M tokens for text-embedding-3-small
      estimated_cost: this.total_tokens * 0.00002,
    };
  }
}

module.exports = { OpenAIProvider, MODEL_DIMENSIONS };
