// ---------------------------------------------------------------
// MODULE: Openai
// ---------------------------------------------------------------
import { EmbeddingProfile } from '../profile.js';
import { retryWithBackoff } from '../../utils/retry.js';
// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------
const DEFAULT_MODEL = 'text-embedding-3-small';
const DEFAULT_DIM = 1536;
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const REQUEST_TIMEOUT = 30000;
/** Defines model dimensions. */
export const MODEL_DIMENSIONS = {
    'text-embedding-3-small': 1536,
    'text-embedding-3-large': 3072,
    'text-embedding-ada-002': 1536,
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
function parseOpenAIErrorBody(payload) {
    if (!payload || typeof payload !== 'object') {
        return {};
    }
    const payloadRecord = payload;
    if (!payloadRecord.error || typeof payloadRecord.error !== 'object') {
        return {};
    }
    const errorRecord = payloadRecord.error;
    if (typeof errorRecord.message !== 'string') {
        return {};
    }
    return {
        error: {
            message: errorRecord.message,
        },
    };
}
/** Provides open aiprovider. */
export class OpenAIProvider {
    apiKey;
    baseUrl;
    modelName;
    dim;
    timeout;
    isHealthy;
    requestCount;
    totalTokens;
    constructor(options = {}) {
        this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || '';
        this.baseUrl = options.baseUrl || process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL;
        this.modelName = options.model || process.env.OPENAI_EMBEDDINGS_MODEL || DEFAULT_MODEL;
        this.dim = options.dim || MODEL_DIMENSIONS[this.modelName] || DEFAULT_DIM;
        this.timeout = options.timeout || REQUEST_TIMEOUT;
        this.isHealthy = true;
        this.requestCount = 0;
        this.totalTokens = 0;
        if (!this.apiKey) {
            throw new Error('OpenAI API key is required. Set OPENAI_API_KEY.');
        }
    }
    /**
     * Execute a single HTTP request (internal, no retry).
     * @private
     */
    async executeRequest(input) {
        const url = `${this.baseUrl}/embeddings`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    input,
                    model: this.modelName,
                    encoding_format: 'float',
                }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorPayload = await response.json().catch(() => ({}));
                const errorBody = parseOpenAIErrorBody(errorPayload);
                const error = new Error(`OpenAI API error: ${errorBody.error?.message || response.statusText}`);
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
                const timeoutError = new Error('OpenAI request timeout');
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
    async makeRequest(input) {
        return retryWithBackoff(() => this.executeRequest(input), {
            operationName: 'openai-embedding',
            maxRetries: 3,
            baseDelayMs: 1000,
            onRetry: (attempt, error, delay) => {
                console.warn(`[openai] Retry ${attempt + 1}/3 after ${delay}ms: ${error.message}`);
            },
        });
    }
    async generateEmbedding(text) {
        if (!text || typeof text !== 'string') {
            console.warn('[openai] Empty or invalid text provided');
            return null;
        }
        const trimmedText = text.trim();
        if (trimmedText.length === 0) {
            console.warn('[openai] Empty text after trim');
            return null;
        }
        const start = Date.now();
        try {
            const response = await this.makeRequest(trimmedText);
            if (!response.data || response.data.length === 0) {
                throw new Error('OpenAI did not return embeddings');
            }
            const embedding = new Float32Array(response.data[0].embedding);
            if (embedding.length !== this.dim) {
                throw new Error(`Embedding dimension mismatch: expected ${this.dim}, got ${embedding.length} from openai. Cannot store mismatched embeddings.`);
            }
            const inferenceTime = Date.now() - start;
            if (inferenceTime > 2000) {
                console.warn(`[openai] Slow request: ${inferenceTime}ms`);
            }
            return embedding;
        }
        catch (error) {
            if (error instanceof Error) {
                void error.message;
            }
            console.warn(`[openai] Generation failed: ${getErrorMessage(error)}`);
            this.isHealthy = false;
            throw error;
        }
    }
    // OpenAI does not use task prefixes like nomic - same method for documents and queries
    async embedDocument(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return null;
        }
        return await this.generateEmbedding(text);
    }
    async embedQuery(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return null;
        }
        return await this.generateEmbedding(text);
    }
    async warmup() {
        try {
            console.error('[openai] Checking connectivity with OpenAI API...');
            const result = await Promise.race([
                this.embedQuery('test warmup query'),
                new Promise((_, reject) => {
                    setTimeout(() => {
                        const timeoutError = new Error(`OpenAI warmup timed out after ${this.timeout}ms`);
                        timeoutError.code = 'ETIMEDOUT';
                        reject(timeoutError);
                    }, this.timeout);
                }),
            ]);
            this.isHealthy = result !== null;
            console.error('[openai] Connectivity verified successfully');
            return this.isHealthy;
        }
        catch (error) {
            if (error instanceof Error) {
                void error.message;
            }
            if (hasTimeoutCode(error)) {
                console.warn(`[openai] Warmup timed out after ${this.timeout}ms; proceeding with cold provider state`);
                this.isHealthy = true;
                return true;
            }
            console.warn(`[openai] Warmup failed: ${getErrorMessage(error)}`);
            this.isHealthy = false;
            return false;
        }
    }
    getMetadata() {
        return {
            provider: 'openai',
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
            provider: 'openai',
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
            // ~$0.02 per 1M tokens for text-embedding-3-small
            estimatedCost: (this.totalTokens / 1_000_000) * 0.02,
        };
    }
    getProviderName() {
        return 'OpenAI Embeddings';
    }
}
//# sourceMappingURL=openai.js.map