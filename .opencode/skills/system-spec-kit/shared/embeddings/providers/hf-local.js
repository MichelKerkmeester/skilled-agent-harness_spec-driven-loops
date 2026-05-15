// ───────────────────────────────────────────────────────────────────
// MODULE: HF Local
// ───────────────────────────────────────────────────────────────────
import { ALLOWED_HF_LOCAL_DTYPES, EmbeddingProfile, normalizeProfileDtype } from '../profile.js';
import { semanticChunk, MAX_TEXT_LENGTH } from '../../chunking.js';
// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------
const DEFAULT_MODEL = 'onnx-community/embeddinggemma-300m-ONNX';
const EMBEDDING_DIM = 768;
// MAX_TEXT_LENGTH imported from chunking.ts (single source of truth)
const EMBEDDING_TIMEOUT = 30000;
const MODEL_LOAD_TIMEOUT = 120000; // 2 minutes (model is ~274MB)
// Task prefixes required by nomic-embed-text-v1.5
// See: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5
// NOTE: legacy compatibility export, not the current default, kept for consumers
// (shared/embeddings.ts, shared/index.ts, mcp_server/lib/providers/embeddings.ts).
// New code should call getPrefixFor() instead — see PREFIX_REGISTRY below.
/** Defines task prefix. */
export const TASK_PREFIX = {
    DOCUMENT: 'search_document: ',
    QUERY: 'search_query: ',
    CLUSTERING: 'clustering: ',
    CLASSIFICATION: 'classification: ',
};
export const PREFIX_REGISTRY = Object.freeze({
    'nomic-ai/nomic-embed-text-v1.5': Object.freeze({
        document: 'search_document: ',
        query: 'search_query: ',
    }),
    'google/embeddinggemma-300m': Object.freeze({
        document: 'title: none | text: ',
        query: 'task: search result | query: ',
    }),
    // transformers.js-compatible ONNX port of the same model (shares prefix shape)
    'onnx-community/embeddinggemma-300m-ONNX': Object.freeze({
        document: 'title: none | text: ',
        query: 'task: search result | query: ',
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
 * @param modelId - HuggingFace model id, e.g. 'google/embeddinggemma-300m'
 * @param kind    - 'document' for index-time embeddings, 'query' for search-time embeddings
 */
export function getPrefixFor(modelId, kind) {
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
let currentDevice = null;
function getOptimalDevice() {
    // macOS with Apple Silicon uses MPS (Metal Performance Shaders)
    if (process.platform === 'darwin') {
        return 'mps';
    }
    return 'cpu';
}
export function resolveDtype(explicit) {
    const raw = explicit ?? process.env.HF_EMBEDDINGS_DTYPE ?? 'q8';
    const normalized = normalizeProfileDtype(raw);
    if (!normalized || !ALLOWED_HF_LOCAL_DTYPES.includes(normalized)) {
        console.warn(`[hf-local] Unknown HF_EMBEDDINGS_DTYPE="${raw}"; falling back to q8. Allowed: ${ALLOWED_HF_LOCAL_DTYPES.join(', ')}`);
        return 'q8';
    }
    return normalized;
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
function getErrorCode(error) {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return undefined;
    }
    const { code } = error;
    return typeof code === 'string' ? code : undefined;
}
function createTimeoutError(message) {
    const error = new Error(message);
    error.code = 'ETIMEDOUT';
    return error;
}
async function withTimeout(operation, timeoutMs, message) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(createTimeoutError(message)), timeoutMs);
        operation
            .then((value) => {
            clearTimeout(timeoutId);
            resolve(value);
        })
            .catch((error) => {
            clearTimeout(timeoutId);
            reject(error);
        });
    });
}
/** Provides hf local provider. */
export class HfLocalProvider {
    modelName;
    dim;
    dtype;
    maxTextLength;
    timeout;
    extractor;
    modelLoadTime;
    loadingPromise;
    isHealthy;
    constructor(options = {}) {
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
    async getModel() {
        if (this.extractor) {
            return this.extractor;
        }
        // Race condition protection: wait for in-progress load
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        this.loadingPromise = (async () => {
            const start = Date.now();
            try {
                console.warn(`[hf-local] Loading ${this.modelName} (dtype=${this.dtype}, first load may take 15-30s)...`);
                const { pipeline } = await import('@huggingface/transformers');
                let targetDevice = getOptimalDevice();
                console.error(`[hf-local] Attempting device: ${targetDevice}`);
                const loadWithTimeout = async (device) => {
                    return new Promise((resolve, reject) => {
                        const timeoutId = setTimeout(() => {
                            reject(new Error(`Model loading timed out after ${MODEL_LOAD_TIMEOUT}ms. ` +
                                'This may indicate a corrupted cache or network issue. ' +
                                'Try clearing: ~/.cache/huggingface/hub/'));
                        }, MODEL_LOAD_TIMEOUT);
                        pipeline('feature-extraction', this.modelName, {
                            dtype: this.dtype,
                            device: device,
                        }).then((extractor) => {
                            clearTimeout(timeoutId);
                            resolve(extractor);
                        }).catch((err) => {
                            clearTimeout(timeoutId);
                            reject(err);
                        });
                    });
                };
                try {
                    this.extractor = await loadWithTimeout(targetDevice);
                    currentDevice = targetDevice;
                }
                catch (deviceError) {
                    if (deviceError instanceof Error) {
                        void deviceError.message;
                    }
                    // MPS unavailable, fallback to CPU
                    if (targetDevice !== 'cpu' && !getErrorMessage(deviceError).includes('timed out')) {
                        console.warn(`[hf-local] ${targetDevice.toUpperCase()} unavailable (${getErrorMessage(deviceError)}), using CPU`);
                        this.extractor = await loadWithTimeout('cpu');
                        currentDevice = 'cpu';
                    }
                    else {
                        throw deviceError;
                    }
                }
                this.modelLoadTime = Date.now() - start;
                console.warn(`[hf-local] Model loaded in ${this.modelLoadTime}ms (device: ${currentDevice})`);
                return this.extractor;
            }
            catch (error) {
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
    async generateEmbedding(text) {
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
            const output = await withTimeout(model(inputText, {
                pooling: 'mean',
                normalize: true,
            }), this.timeout, `HF local inference timed out after ${this.timeout}ms`);
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
        }
        catch (error) {
            if (error instanceof Error) {
                void error.message;
            }
            console.warn(`[hf-local] Generation failed: ${getErrorMessage(error)}`);
            this.isHealthy = false;
            throw error;
        }
    }
    async embedDocument(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return null;
        }
        const prefixedText = getPrefixFor(this.modelName, 'document') + text;
        return await this.generateEmbedding(prefixedText);
    }
    async embedQuery(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return null;
        }
        const prefixedQuery = getPrefixFor(this.modelName, 'query') + text;
        return await this.generateEmbedding(prefixedQuery);
    }
    async warmup() {
        try {
            console.error('[hf-local] Pre-warming model...');
            await this.embedQuery('test warmup query');
            console.error('[hf-local] Model successfully pre-warmed');
            return true;
        }
        catch (error) {
            if (error instanceof Error) {
                void error.message;
            }
            console.warn(`[hf-local] Warmup failed: ${getErrorMessage(error)}`);
            this.isHealthy = false;
            return false;
        }
    }
    getMetadata() {
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
    getProfile() {
        return new EmbeddingProfile({
            provider: 'hf-local',
            model: this.modelName,
            dim: this.dim,
            dtype: this.dtype,
        });
    }
    async healthCheck() {
        try {
            const result = await this.embedQuery('health check');
            this.isHealthy = result !== null;
            return this.isHealthy;
        }
        catch (error) {
            if (error instanceof Error) {
                void error.message;
            }
            this.isHealthy = false;
            return false;
        }
    }
    getProviderName() {
        return 'HuggingFace Local Embeddings';
    }
}
//# sourceMappingURL=hf-local.js.map