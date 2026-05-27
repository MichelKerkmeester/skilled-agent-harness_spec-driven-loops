// ───────────────────────────────────────────────────────────────────
// MODULE: HF Local
// ───────────────────────────────────────────────────────────────────

import { ALLOWED_HF_LOCAL_DTYPES, EmbeddingProfile, normalizeProfileDtype } from '../profile.js';
import { getCanonicalFallback } from '../registry.js';
import { semanticChunk, MAX_TEXT_LENGTH } from '../../chunking.js';
import type { IEmbeddingProvider, ProviderMetadata, TaskPrefixMap } from '../../types.js';

// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------

// Derived from registry MANIFESTS[0] (single source of truth).
const DEFAULT_MODEL: string = getCanonicalFallback('hf-local');
const EMBEDDING_DIM: number = 768;
// MAX_TEXT_LENGTH imported from chunking.ts (single source of truth)
const EMBEDDING_TIMEOUT: number = 30000;
const MODEL_LOAD_TIMEOUT: number = 120000; // 2 minutes (model is ~274MB)

// Task prefixes required by nomic-embed-text-v1.5
// See: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5
// NOTE: legacy compatibility export, not the current default, kept for consumers
// (shared/embeddings.ts, shared/index.ts, mcp_server/lib/providers/embeddings.ts).
// New code should call getPrefixFor() instead — see PREFIX_REGISTRY below.
/** Defines task prefix. */
export const TASK_PREFIX: TaskPrefixMap = {
  DOCUMENT: 'search_document: ',
  QUERY: 'search_query: ',
  CLUSTERING: 'clustering: ',
  CLASSIFICATION: 'classification: ',
};

// ---------------------------------------------------------------
// 1b. PREFIX REGISTRY (014-local-embeddings-setup-a / 001-prefix-registry-architecture)
// ---------------------------------------------------------------
// Model-keyed prefix lookup. Different embedding models use different prefix
// conventions (Nomic vs E5 vs Snowflake-Arctic vs mxbai vs bge).
// Hardcoding Nomic's `search_document:` / `search_query:` for every model causes
// ~5-8% silent recall loss when running a non-Nomic model.
//
// Resolution order (getPrefixFor):
//   1) env override:
//        HF_EMBEDDINGS_PREFIX_DOC   — overrides document prefix for any model
//        HF_EMBEDDINGS_PREFIX_QUERY — overrides query prefix for any model
//      Empty string is a VALID override meaning "no prefix"; `undefined` (unset)
//      means "fall through to the registry".
//   2) PREFIX_REGISTRY entry for the modelId
//   3) empty string '' (safe — no prefix is always valid)
export interface ModelPrefixConfig {
  document?: string;
  query?: string;
}

export const PREFIX_REGISTRY: Readonly<Record<string, Readonly<ModelPrefixConfig>>> = Object.freeze({
  'nomic-ai/nomic-embed-text-v1.5': Object.freeze({
    document: 'search_document: ',
    query: 'search_query: ',
  }),
  'BAAI/bge-base-en-v1.5': Object.freeze({
    document: '',
    query: 'Represent this sentence for searching relevant passages: ',
  }),
  'intfloat/e5-large-v2': Object.freeze({
    document: 'passage: ',
    query: 'query: ',
  }),
  'mixedbread-ai/mxbai-embed-large-v1': Object.freeze({
    document: '',
    query: '',
  }),
  'Snowflake/snowflake-arctic-embed-l-v2.0': Object.freeze({
    document: '',
    query: 'Represent this sentence for searching relevant passages: ',
  }),
  'BAAI/bge-m3': Object.freeze({
    document: '',
    query: '',
  }),
});

/**
 * Resolve the prefix string for a given (modelId, kind) pair.
 * Returns '' (empty string) as the safe final fallback.
 *
 * @param modelId - HuggingFace model id, e.g. 'BAAI/bge-base-en-v1.5'
 * @param kind    - 'document' for index-time embeddings, 'query' for search-time embeddings
 */
export function getPrefixFor(modelId: string, kind: 'document' | 'query'): string {
  // 1) env override (distinguish unset vs empty-string)
  const envKey = kind === 'document' ? 'HF_EMBEDDINGS_PREFIX_DOC' : 'HF_EMBEDDINGS_PREFIX_QUERY';
  const envValue = process.env[envKey];
  if (envValue !== undefined) {
    return envValue;
  }

  // 2) registry entry
  const entry = PREFIX_REGISTRY[modelId];
  if (entry) {
    const candidate = entry[kind];
    if (candidate !== undefined) {
      return candidate;
    }
  }

  // 3) safe fallback
  return '';
}

// ---------------------------------------------------------------
// 2. DEVICE DETECTION
// ---------------------------------------------------------------

let currentDevice: string | null = null;

function getOptimalDevice(): string {
  // macOS with Apple Silicon uses MPS (Metal Performance Shaders)
  if (process.platform === 'darwin') {
    return 'mps';
  }
  return 'cpu';
}

// ---------------------------------------------------------------
// 3. PROVIDER CLASS
// ---------------------------------------------------------------

interface HfLocalOptions {
  model?: string;
  dim?: number;
  maxTextLength?: number;
  timeout?: number;
  dtype?: HfLocalDtype;
}

// 014-local-embeddings-setup-a / 005-q4-quantization:
// Allowed dtypes for ONNX model variants exposed by @huggingface/transformers.
// Local transformer models expose several dtype variants through
// @huggingface/transformers. q8 remains the default because it keeps local
// bootstrap memory bounded while preserving enough retrieval quality for the
// fallback path. Users can opt back to fp32 by setting HF_EMBEDDINGS_DTYPE=fp32.
export type HfLocalDtype = 'fp32' | 'fp16' | 'q4' | 'q4f16' | 'q8' | 'int8' | 'uint8' | 'bnb4';

export function resolveDtype(explicit?: string): HfLocalDtype {
  const raw = explicit ?? process.env.HF_EMBEDDINGS_DTYPE ?? 'q8';
  const normalized = normalizeProfileDtype(raw);
  if (!normalized || !ALLOWED_HF_LOCAL_DTYPES.includes(normalized)) {
    console.warn(
      `[hf-local] Unknown HF_EMBEDDINGS_DTYPE="${raw}"; falling back to q8. Allowed: ${ALLOWED_HF_LOCAL_DTYPES.join(', ')}`,
    );
    return 'q8';
  }
  return normalized as HfLocalDtype;
}

interface ErrorWithCode extends Error {
  code?: string;
}

// Type for the HuggingFace pipeline extractor
type FeatureExtractionPipeline = (text: string, options: { pooling: string; normalize: boolean }) => Promise<{ data: Float32Array | number[] }>;

// Type for the HuggingFace pipeline factory function
type PipelineFactory = (task: string, model: string, options: Record<string, unknown>) => Promise<FeatureExtractionPipeline>;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined;
  }

  const { code } = error as { code?: unknown };
  return typeof code === 'string' ? code : undefined;
}

function createTimeoutError(message: string): ErrorWithCode {
  const error = new Error(message) as ErrorWithCode;
  error.code = 'ETIMEDOUT';
  return error;
}

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(createTimeoutError(message)), timeoutMs);

    operation
      .then((value: T) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/** Provides hf local provider. */
export class HfLocalProvider implements IEmbeddingProvider {
  modelName: string;
  dim: number;
  dtype: HfLocalDtype;
  maxTextLength: number;
  timeout: number;
  extractor: FeatureExtractionPipeline | null;
  modelLoadTime: number | null;
  loadingPromise: Promise<FeatureExtractionPipeline> | null;
  isHealthy: boolean;

  constructor(options: HfLocalOptions = {}) {
    this.modelName = options.model || process.env.HF_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    this.dim = options.dim || EMBEDDING_DIM;
    this.dtype = resolveDtype(options.dtype);
    this.maxTextLength = options.maxTextLength || MAX_TEXT_LENGTH;
    this.timeout = options.timeout || EMBEDDING_TIMEOUT;

    this.extractor = null;
    this.modelLoadTime = null;
    this.loadingPromise = null;
    this.isHealthy = true;
  }

  async getModel(): Promise<FeatureExtractionPipeline> {
    if (this.extractor) {
      return this.extractor;
    }

    // Race condition protection: wait for in-progress load
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async (): Promise<FeatureExtractionPipeline> => {
      const start = Date.now();
      try {
        console.warn(`[hf-local] Loading ${this.modelName} (dtype=${this.dtype}, first load may take 15-30s)...`);

        const { pipeline } = await import('@huggingface/transformers');

        let targetDevice = getOptimalDevice();
        console.error(`[hf-local] Attempting device: ${targetDevice}`);

        const loadWithTimeout = async (device: string): Promise<FeatureExtractionPipeline> => {
          return new Promise<FeatureExtractionPipeline>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error(`Model loading timed out after ${MODEL_LOAD_TIMEOUT}ms. ` +
                'This may indicate a corrupted cache or network issue. ' +
                'Try clearing: ~/.cache/huggingface/hub/'));
            }, MODEL_LOAD_TIMEOUT);

            (pipeline as PipelineFactory)('feature-extraction', this.modelName, {
              dtype: this.dtype,
              device: device,
            }).then((extractor: FeatureExtractionPipeline) => {
              clearTimeout(timeoutId);
              resolve(extractor);
            }).catch((err: Error) => {
              clearTimeout(timeoutId);
              reject(err);
            });
          });
        };

        try {
          this.extractor = await loadWithTimeout(targetDevice);
          currentDevice = targetDevice;
        } catch (deviceError: unknown) {
          if (deviceError instanceof Error) {
            void deviceError.message;
          }
          // MPS unavailable, fallback to CPU
          if (targetDevice !== 'cpu' && !getErrorMessage(deviceError).includes('timed out')) {
            console.warn(`[hf-local] ${targetDevice.toUpperCase()} unavailable (${getErrorMessage(deviceError)}), using CPU`);
            this.extractor = await loadWithTimeout('cpu');
            currentDevice = 'cpu';
          } else {
            throw deviceError;
          }
        }

        this.modelLoadTime = Date.now() - start;
        console.warn(`[hf-local] Model loaded in ${this.modelLoadTime}ms (device: ${currentDevice})`);

        return this.extractor!;
      } catch (error: unknown) {
        if (error instanceof Error) {
          void error.message;
        }
        this.loadingPromise = null;
        this.isHealthy = false;

        // Detect native module version mismatch (e.g., sharp built against a different Node ABI)
        const errMsg = getErrorMessage(error);
        const errCode = getErrorCode(error);
        if (errCode === 'ERR_DLOPEN_FAILED' || errMsg.includes('NODE_MODULE_VERSION') || errMsg.includes('was compiled against a different Node.js version')) {
          console.error('[hf-local] \u2550\u2550\u2550 NATIVE MODULE ERROR \u2550\u2550\u2550');
          console.error(`[hf-local] ${errMsg}`);
          console.error(`[hf-local] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
          console.error('[hf-local] Recovery options:');
          console.error('[hf-local]   1. Clear cache: rm -rf ~/.cache/huggingface/hub/');
          console.error('[hf-local]   2. Switch provider: EMBEDDINGS_PROVIDER=voyage');
          console.error('[hf-local] \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
        }

        throw error;
      }
    })();

    return this.loadingPromise;
  }

  async generateEmbedding(text: string): Promise<Float32Array | null> {
    if (!text || typeof text !== 'string') {
      console.warn('[hf-local] Empty or invalid text provided');
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn('[hf-local] Empty text after trim');
      return null;
    }

    let inputText = trimmedText;
    if (inputText.length > this.maxTextLength) {
      // Use semantic chunking instead of simple truncation to preserve important content
      console.warn(`[hf-local] Text ${inputText.length} chars exceeds max ${this.maxTextLength}, applying semantic chunking`);
      inputText = semanticChunk(inputText, this.maxTextLength);
    }

    const start = Date.now();

    try {
      const model = await this.getModel();

      const output = await withTimeout(
        model(inputText, {
          pooling: 'mean',
          normalize: true,
        }),
        this.timeout,
        `HF local inference timed out after ${this.timeout}ms`,
      );

      const embedding = output.data instanceof Float32Array
        ? output.data
        : new Float32Array(output.data);

      if (embedding.length !== this.dim) {
        throw new Error(`Embedding dimension mismatch: expected ${this.dim}, got ${embedding.length}`);
      }

      const inferenceTime = Date.now() - start;

      if (inferenceTime > 800) {
        console.warn(`[hf-local] Slow inference: ${inferenceTime}ms (target <800ms)`);
      }

      return embedding;

    } catch (error: unknown) {
      if (error instanceof Error) {
        void error.message;
      }
      console.warn(`[hf-local] Generation failed: ${getErrorMessage(error)}`);
      this.isHealthy = false;
      throw error;
    }
  }

  async embedDocument(text: string): Promise<Float32Array | null> {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    const prefixedText = getPrefixFor(this.modelName, 'document') + text;
    return await this.generateEmbedding(prefixedText);
  }

  async embedQuery(text: string): Promise<Float32Array | null> {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    const prefixedQuery = getPrefixFor(this.modelName, 'query') + text;
    return await this.generateEmbedding(prefixedQuery);
  }

  async warmup(): Promise<boolean> {
    try {
      console.error('[hf-local] Pre-warming model...');
      await this.embedQuery('test warmup query');
      console.error('[hf-local] Model successfully pre-warmed');
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        void error.message;
      }
      console.warn(`[hf-local] Warmup failed: ${getErrorMessage(error)}`);
      this.isHealthy = false;
      return false;
    }
  }

  getMetadata(): ProviderMetadata {
    return {
      provider: 'hf-local',
      model: this.modelName,
      dim: this.dim,
      dtype: this.dtype,
      device: currentDevice,
      healthy: this.isHealthy,
      loaded: this.extractor !== null,
      loadTimeMs: this.modelLoadTime,
    };
  }

  getProfile(): EmbeddingProfile {
    return new EmbeddingProfile({
      provider: 'hf-local',
      model: this.modelName,
      dim: this.dim,
      dtype: this.dtype,
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.embedQuery('health check');
      this.isHealthy = result !== null;
      return this.isHealthy;
    } catch (error: unknown) {
      if (error instanceof Error) {
        void error.message;
      }
      this.isHealthy = false;
      return false;
    }
  }

  getProviderName(): string {
    return 'HuggingFace Local Embeddings';
  }
}
