// ───────────────────────────────────────────────────────────────
// VOYAGE.JS: Voyage AI embeddings provider implementation
// ───────────────────────────────────────────────────────────────
'use strict';

const { EmbeddingProfile } = require('../profile');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const DEFAULT_MODEL = 'voyage-4';
const DEFAULT_DIM = 1024;
const DEFAULT_BASE_URL = 'https://api.voyageai.com/v1';
const REQUEST_TIMEOUT = 30000;

const MODEL_DIMENSIONS = {
  // Voyage 4 family (Shared embedding space)
  'voyage-4-large': 1024, // Supports 256/512/1024/2048 - default to 1024 for compat
  'voyage-4': 1024,       // Supports 256/512/1024/2048
  'voyage-4-lite': 1024,  // Supports 256/512/1024/2048
  
  // Voyage 3 family
  'voyage-3.5': 1024,
  'voyage-3.5-lite': 1024,
  'voyage-3-large': 1024,
  'voyage-code-3': 1024,
  'voyage-code-2': 1536,
  'voyage-3': 1024,
  'voyage-finance-2': 1024,
  'voyage-law-2': 1024,
};

/* ───────────────────────────────────────────────────────────────
   2. PROVIDER CLASS
   ─────────────────────────────────────────────────────────────── */

class VoyageProvider {
  constructor(options = {}) {
    this.api_key = options.apiKey || process.env.VOYAGE_API_KEY;
    this.base_url = options.baseUrl || DEFAULT_BASE_URL;
    this.model_name = options.model || process.env.VOYAGE_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    this.dim = options.dim || MODEL_DIMENSIONS[this.model_name] || DEFAULT_DIM;
    this.timeout = options.timeout || REQUEST_TIMEOUT;
    this.is_healthy = true;
    this.request_count = 0;
    this.total_tokens = 0;

    if (!this.api_key) {
      throw new Error('Voyage API key is required. Set VOYAGE_API_KEY.');
    }
  }

  async make_request(input, input_type = null) {
    const url = `${this.base_url}/embeddings`;
    
    const controller = new AbortController();
    const timeout_id = setTimeout(() => controller.abort(), this.timeout);

    const body = {
      input: Array.isArray(input) ? input : [input],
      model: this.model_name,
    };

    // Voyage-specific: input_type optimizes retrieval ('document' or 'query')
    if (input_type) {
      body.input_type = input_type;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.api_key}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout_id);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(`Voyage API error: ${error.detail || error.error?.message || response.statusText}`);
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
        throw new Error('Voyage request timeout');
      }
      
      this.is_healthy = false;
      throw error;
    }
  }

  async generate_embedding(text, input_type = null) {
    if (!text || typeof text !== 'string') {
      console.warn('[voyage] Empty or invalid text provided');
      return null;
    }

    const trimmed_text = text.trim();
    if (trimmed_text.length === 0) {
      console.warn('[voyage] Empty text after trim');
      return null;
    }

    const start = Date.now();

    try {
      const response = await this.make_request(trimmed_text, input_type);
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Voyage did not return embeddings');
      }

      const embedding = new Float32Array(response.data[0].embedding);

      if (embedding.length !== this.dim) {
        console.warn(`[voyage] Unexpected dimension: ${embedding.length}, expected: ${this.dim}`);
      }

      const inference_time = Date.now() - start;
      
      if (inference_time > 2000) {
        console.warn(`[voyage] Slow request: ${inference_time}ms`);
      }

      return embedding;

    } catch (error) {
      console.warn(`[voyage] Generation failed: ${error.message}`);
      this.is_healthy = false;
      throw error;
    }
  }

  async embed_document(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generate_embedding(text, 'document');
  }

  async embed_query(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generate_embedding(text, 'query');
  }

  async warmup() {
    try {
      console.log('[voyage] Checking connectivity with Voyage API...');
      const result = await this.embed_query('test warmup query');
      this.is_healthy = result !== null;
      console.log('[voyage] Connectivity verified successfully');
      return this.is_healthy;
    } catch (error) {
      console.warn(`[voyage] Warmup failed: ${error.message}`);
      this.is_healthy = false;
      return false;
    }
  }

  get_metadata() {
    return {
      provider: 'voyage',
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
      provider: 'voyage',
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
      // voyage-4 pricing: $0.06 per 1M tokens (same as 3.5)
      // voyage-4-lite: $0.03 per 1M tokens
      // voyage-4-large: $0.12 per 1M tokens
      estimated_cost: this.total_tokens * 0.00006,
    };
  }
}

module.exports = { VoyageProvider, MODEL_DIMENSIONS };
