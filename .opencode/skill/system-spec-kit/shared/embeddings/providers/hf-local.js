// ───────────────────────────────────────────────────────────────
// HF-LOCAL.JS: Hugging Face local embeddings provider
// ───────────────────────────────────────────────────────────────
'use strict';

const { EmbeddingProfile } = require('../profile');
const { semantic_chunk, MAX_TEXT_LENGTH } = require('../../chunking');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const DEFAULT_MODEL = 'nomic-ai/nomic-embed-text-v1.5';
const EMBEDDING_DIM = 768;
// MAX_TEXT_LENGTH imported from chunking.js (single source of truth)
const EMBEDDING_TIMEOUT = 30000;
const MODEL_LOAD_TIMEOUT = 120000; // 2 minutes (model is ~274MB)

// Task prefixes required by nomic-embed-text-v1.5
// See: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5
const TASK_PREFIX = {
  DOCUMENT: 'search_document: ',
  QUERY: 'search_query: ',
  CLUSTERING: 'clustering: ',
  CLASSIFICATION: 'classification: ',
};

/* ───────────────────────────────────────────────────────────────
   2. DEVICE DETECTION
   ─────────────────────────────────────────────────────────────── */

let current_device = null;

function get_optimal_device() {
  // macOS with Apple Silicon uses MPS (Metal Performance Shaders)
  if (process.platform === 'darwin') {
    return 'mps';
  }
  return 'cpu';
}

/* ───────────────────────────────────────────────────────────────
   3. PROVIDER CLASS
   ─────────────────────────────────────────────────────────────── */

class HfLocalProvider {
  constructor(options = {}) {
    this.model_name = options.model || process.env.HF_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    this.dim = options.dim || EMBEDDING_DIM;
    this.max_text_length = options.maxTextLength || MAX_TEXT_LENGTH;
    this.timeout = options.timeout || EMBEDDING_TIMEOUT;
    
    this.extractor = null;
    this.model_load_time = null;
    this.loading_promise = null;
    this.is_healthy = true;
  }

  async get_model() {
    if (this.extractor) {
      return this.extractor;
    }

    // Race condition protection: wait for in-progress load
    if (this.loading_promise) {
      return this.loading_promise;
    }

    this.loading_promise = (async () => {
      const start = Date.now();
      try {
        console.warn(`[hf-local] Loading ${this.model_name} (~274MB, first load may take 15-30s)...`);

        const { pipeline } = await import('@huggingface/transformers');

        let target_device = get_optimal_device();
        console.log(`[hf-local] Attempting device: ${target_device}`);

        const load_with_timeout = async (device) => {
          return new Promise((resolve, reject) => {
            const timeout_id = setTimeout(() => {
              reject(new Error(`Model loading timed out after ${MODEL_LOAD_TIMEOUT}ms. ` +
                'This may indicate a corrupted cache or network issue. ' +
                'Try clearing: ~/.cache/huggingface/hub/'));
            }, MODEL_LOAD_TIMEOUT);

            pipeline('feature-extraction', this.model_name, {
              dtype: 'fp32',
              device: device,
            }).then(extractor => {
              clearTimeout(timeout_id);
              resolve(extractor);
            }).catch(err => {
              clearTimeout(timeout_id);
              reject(err);
            });
          });
        };

        try {
          this.extractor = await load_with_timeout(target_device);
          current_device = target_device;
        } catch (device_error) {
          // MPS unavailable, fallback to CPU
          if (target_device !== 'cpu' && !device_error.message.includes('timed out')) {
            console.warn(`[hf-local] ${target_device.toUpperCase()} unavailable (${device_error.message}), using CPU`);
            this.extractor = await load_with_timeout('cpu');
            current_device = 'cpu';
          } else {
            throw device_error;
          }
        }

        this.model_load_time = Date.now() - start;
        console.warn(`[hf-local] Model loaded in ${this.model_load_time}ms (device: ${current_device})`);

        return this.extractor;
      } catch (error) {
        this.loading_promise = null;
        this.is_healthy = false;
        throw error;
      }
    })();

    return this.loading_promise;
  }

  async generate_embedding(text) {
    if (!text || typeof text !== 'string') {
      console.warn('[hf-local] Empty or invalid text provided');
      return null;
    }

    const trimmed_text = text.trim();
    if (trimmed_text.length === 0) {
      console.warn('[hf-local] Empty text after trim');
      return null;
    }

    let input_text = trimmed_text;
    if (input_text.length > this.max_text_length) {
      // Use semantic chunking instead of simple truncation to preserve important content
      console.warn(`[hf-local] Text ${input_text.length} chars exceeds max ${this.max_text_length}, applying semantic chunking`);
      input_text = semantic_chunk(input_text, this.max_text_length);
    }

    const start = Date.now();

    try {
      const model = await this.get_model();

      const output = await model(input_text, {
        pooling: 'mean',
        normalize: true,
      });

      const embedding = output.data instanceof Float32Array
        ? output.data
        : new Float32Array(output.data);

      const inference_time = Date.now() - start;

      if (inference_time > 800) {
        console.warn(`[hf-local] Slow inference: ${inference_time}ms (target <800ms)`);
      }

      return embedding;

    } catch (error) {
      console.warn(`[hf-local] Generation failed: ${error.message}`);
      this.is_healthy = false;
      throw error;
    }
  }

  async embed_document(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    const prefixed_text = TASK_PREFIX.DOCUMENT + text;
    return await this.generate_embedding(prefixed_text);
  }

  async embed_query(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    const prefixed_query = TASK_PREFIX.QUERY + text;
    return await this.generate_embedding(prefixed_query);
  }

  async warmup() {
    try {
      console.log('[hf-local] Pre-warming model...');
      await this.embed_query('test warmup query');
      console.log('[hf-local] Model successfully pre-warmed');
      return true;
    } catch (error) {
      console.warn(`[hf-local] Warmup failed: ${error.message}`);
      this.is_healthy = false;
      return false;
    }
  }

  get_metadata() {
    return {
      provider: 'hf-local',
      model: this.model_name,
      dim: this.dim,
      device: current_device,
      healthy: this.is_healthy,
      loaded: this.extractor !== null,
      load_time_ms: this.model_load_time,
    };
  }

  get_profile() {
    return new EmbeddingProfile({
      provider: 'hf-local',
      model: this.model_name,
      dim: this.dim,
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

  getProviderName() {
    return 'HuggingFace Local Embeddings';
  }
}

module.exports = { HfLocalProvider, TASK_PREFIX };
