// ---------------------------------------------------------------
// MODULE: Voyage
// ---------------------------------------------------------------
import { EmbeddingProfile } from '../profile.js';
import { retryWithBackoff } from '../../utils/retry.js';
// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------
const DEFAULT_MODEL = 'voyage-4';
const DEFAULT_DIM = 1024;
const DEFAULT_BASE_URL = 'https://api.voyageai.com/v1';
const REQUEST_TIMEOUT = 30000;
// Config: honor VOYAGE_BASE_URL for startup validation, not just runtime
export function resolveVoyageBaseUrl(baseUrl) {
    if (typeof baseUrl === 'string' && baseUrl.trim().length > 0) {
        return baseUrl.trim();
    }
    if (typeof process.env.VOYAGE_BASE_URL === 'string' && process.env.VOYAGE_BASE_URL.trim().length > 0) {
        return process.env.VOYAGE_BASE_URL.trim();
    }
    return DEFAULT_BASE_URL;
}
/** Defines model dimensions. */
export const MODEL_DIMENSIONS = {
    // Voyage 4 family (Shared embedding space)
    'voyage-4-large': 1024, // Supports 256/512/1024/2048 - default to 1024 for compat
    'voyage-4': 1024, // Supports 256/512/1024/2048
    'voyage-4-lite': 1024, // Supports 256/512/1024/2048
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
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
function isAbortError(error) {
    return error instanceof Error && error.name === 'AbortError';
}
function hasTimeoutCode(error) {
    return typeof error === 'object'
        && error !== null
        && 'code' in error
        && error.code === 'ETIMEDOUT';
}
function parseVoyageErrorBody(payload) {
    if (!payload || typeof payload !== 'object') {
        return {};
    }
    const payloadRecord = payload;
    const detail = typeof payloadRecord.detail === 'string' ? payloadRecord.detail : undefined;
    let message;
    if (payloadRecord.error && typeof payloadRecord.error === 'object') {
        const errorRecord = payloadRecord.error;
        if (typeof errorRecord.message === 'string') {
            message = errorRecord.message;
        }
    }
    return {
        detail,
        error: message ? { message } : undefined,
    };
}
/** Provides voyage provider. */
export class VoyageProvider {
    apiKey;
    baseUrl;
    modelName;
    dim;
    timeout;
    isHealthy;
    requestCount;
    totalTokens;
    constructor(options = {}) {
        this.apiKey = options.apiKey || process.env.VOYAGE_API_KEY || '';
        this.baseUrl = resolveVoyageBaseUrl(options.baseUrl);
        this.modelName = options.model || process.env.VOYAGE_EMBEDDINGS_MODEL || DEFAULT_MODEL;
        this.dim = options.dim || MODEL_DIMENSIONS[this.modelName] || DEFAULT_DIM;
        this.timeout = options.timeout || REQUEST_TIMEOUT;
        this.isHealthy = true;
        this.requestCount = 0;
        this.totalTokens = 0;
        if (!this.apiKey) {
            throw new Error('Voyage API key is required. Set VOYAGE_API_KEY.');
        }
    }
    /**
     * Execute a single HTTP request (internal, no retry).
     * @private
     */
    async executeRequest(input, inputType = null) {
        const url = `${this.baseUrl}/embeddings`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        const body = {
            input: Array.isArray(input) ? input : [input],
            model: this.modelName,
        };
        // Voyage-specific: input_type optimizes retrieval ('document' or 'query')
        if (inputType) {
            body.input_type = inputType;
        }
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorPayload = await response.json().catch(() => ({}));
                const errorBody = parseVoyageErrorBody(errorPayload);
                const error = new Error(`Voyage API error: ${errorBody.detail || errorBody.error?.message || response.statusText}`);
                // Attach status code for retry classification
                error.status = response.status;
                throw error;
            }
            const data = await response.json();
            this.requestCount++;
            this.isHealthy = true;
            if (data.usage) {
                this.totalTokens += data.usage.total_tokens;
            }
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                void error.message;
            }
            clearTimeout(timeoutId);
            if (isAbortError(error)) {
                const timeoutError = new Error('Voyage request timeout');
                timeoutError.code = 'ETIMEDOUT';
                throw timeoutError;
            }
            this.isHealthy = false;
            throw error;
        }
    }
    /**
     * Make request with retry logic for transient errors.
     * REQ-032: 3 retries with backoff (1s, 2s, 4s), fail fast for 401/403.
     */
    async makeRequest(input, inputType = null) {
        return retryWithBackoff(() => this.executeRequest(input, inputType), {
            operationName: 'voyage-embedding',
            maxRetries: 3,
            baseDelayMs: 1000,
            onRetry: (attempt, error, delay) => {
                console.warn(`[voyage] Retry ${attempt + 1}/3 after ${delay}ms: ${error.message}`);
            },
        });
    }
    async generateEmbedding(text, inputType = null) {
        if (!text || typeof text !== 'string') {
            console.warn('[voyage] Empty or invalid text provided');
            return null;
        }
        const trimmedText = text.trim();
        if (trimmedText.length === 0) {
            console.warn('[voyage] Empty text after trim');
            return null;
        }
        const start = Date.now();
        try {
            const response = await this.makeRequest(trimmedText, inputType);
            if (!response.data || response.data.length === 0) {
                throw new Error('Voyage did not return embeddings');
            }
            const embedding = new Float32Array(response.data[0].embedding);
            if (embedding.length !== this.dim) {
                throw new Error(`Embedding dimension mismatch: expected ${this.dim}, got ${embedding.length} from voyage. Cannot store mismatched embeddings.`);
            }
            const inferenceTime = Date.now() - start;
            if (inferenceTime > 2000) {
                console.warn(`[voyage] Slow request: ${inferenceTime}ms`);
            }
            return embedding;
        }
        catch (error) {
            if (error instanceof Error) {
                void error.message;
            }
            console.warn(`[voyage] Generation failed: ${getErrorMessage(error)}`);
            this.isHealthy = false;
            throw error;
        }
    }
    async embedDocument(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return null;
        }
        return await this.generateEmbedding(text, 'document');
    }
    async embedQuery(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return null;
        }
        return await this.generateEmbedding(text, 'query');
    }
    async warmup() {
        try {
            console.error('[voyage] Checking connectivity with Voyage API...');
            const result = await Promise.race([
                this.embedQuery('test warmup query'),
                new Promise((_, reject) => {
                    setTimeout(() => {
                        const timeoutError = new Error(`Voyage warmup timed out after ${this.timeout}ms`);
                        timeoutError.code = 'ETIMEDOUT';
                        reject(timeoutError);
                    }, this.timeout);
                }),
            ]);
            this.isHealthy = result !== null;
            console.error('[voyage] Connectivity verified successfully');
            return this.isHealthy;
        }
        catch (error) {
            if (error instanceof Error) {
                void error.message;
            }
            if (hasTimeoutCode(error)) {
                console.warn(`[voyage] Warmup timed out after ${this.timeout}ms; proceeding with cold provider state`);
                this.isHealthy = true;
                return true;
            }
            console.warn(`[voyage] Warmup failed: ${getErrorMessage(error)}`);
            this.isHealthy = false;
            return false;
        }
    }
    getMetadata() {
        return {
            provider: 'voyage',
            model: this.modelName,
            dim: this.dim,
            baseUrl: this.baseUrl,
            healthy: this.isHealthy,
            requestCount: this.requestCount,
            totalTokens: this.totalTokens,
        };
    }
    getProfile() {
        return new EmbeddingProfile({
            provider: 'voyage',
            dtype: 'cloud',
            model: this.modelName,
            dim: this.dim,
            baseUrl: this.baseUrl,
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
    getUsageStats() {
        return {
            requestCount: this.requestCount,
            totalTokens: this.totalTokens,
            // voyage-4 pricing: $0.06 per 1M tokens (same as 3.5)
            // voyage-4-lite: $0.03 per 1M tokens
            // voyage-4-large: $0.12 per 1M tokens
            estimatedCost: (this.totalTokens / 1_000_000) * 0.06,
        };
    }
    getProviderName() {
        return 'Voyage AI Embeddings';
    }
}
//# sourceMappingURL=voyage.js.map