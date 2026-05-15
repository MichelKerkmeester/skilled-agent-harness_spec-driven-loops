import { EmbeddingProfile } from '../profile.js';
import type { IEmbeddingProvider, ModelDimensions, ProviderMetadata, UsageStats } from '../../types.js';
/** Defines model dimensions. */
export declare const MODEL_DIMENSIONS: ModelDimensions;
interface OpenAIOptions {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    dim?: number;
    timeout?: number;
}
interface OpenAIEmbeddingResponse {
    data: Array<{
        embedding: number[];
    }>;
    usage?: {
        total_tokens: number;
    };
}
/** Provides open aiprovider. */
export declare class OpenAIProvider implements IEmbeddingProvider {
    private readonly apiKey;
    readonly baseUrl: string;
    readonly modelName: string;
    readonly dim: number;
    readonly timeout: number;
    isHealthy: boolean;
    requestCount: number;
    totalTokens: number;
    constructor(options?: OpenAIOptions);
    /**
     * Execute a single HTTP request (internal, no retry).
     * @private
     */
    private executeRequest;
    /**
     * Make request with retry logic for transient errors.
     * REQ-032: 3 retries with backoff (1s, 2s, 4s), fail fast for 401/403.
     */
    makeRequest(input: string): Promise<OpenAIEmbeddingResponse>;
    generateEmbedding(text: string): Promise<Float32Array | null>;
    embedDocument(text: string): Promise<Float32Array | null>;
    embedQuery(text: string): Promise<Float32Array | null>;
    warmup(): Promise<boolean>;
    getMetadata(): ProviderMetadata;
    getProfile(): EmbeddingProfile;
    healthCheck(): Promise<boolean>;
    getUsageStats(): UsageStats;
    getProviderName(): string;
}
export {};
//# sourceMappingURL=openai.d.ts.map