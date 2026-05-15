import { EmbeddingProfile } from '../profile.js';
import type { IEmbeddingProvider, ProviderMetadata, TaskPrefixMap } from '../../types.js';
/** Defines task prefix. */
export declare const TASK_PREFIX: TaskPrefixMap;
export interface ModelPrefixConfig {
    document?: string;
    query?: string;
}
export declare const PREFIX_REGISTRY: Readonly<Record<string, Readonly<ModelPrefixConfig>>>;
/**
 * Resolve the prefix string for a given (modelId, kind) pair.
 * Returns '' (empty string) as the safe final fallback.
 *
 * @param modelId - HuggingFace model id, e.g. 'google/embeddinggemma-300m'
 * @param kind    - 'document' for index-time embeddings, 'query' for search-time embeddings
 */
export declare function getPrefixFor(modelId: string, kind: 'document' | 'query'): string;
interface HfLocalOptions {
    model?: string;
    dim?: number;
    maxTextLength?: number;
    timeout?: number;
    dtype?: HfLocalDtype;
}
export type HfLocalDtype = 'fp32' | 'fp16' | 'q4' | 'q4f16' | 'q8' | 'int8' | 'uint8' | 'bnb4';
export declare function resolveDtype(explicit?: string): HfLocalDtype;
type FeatureExtractionPipeline = (text: string, options: {
    pooling: string;
    normalize: boolean;
}) => Promise<{
    data: Float32Array | number[];
}>;
/** Provides hf local provider. */
export declare class HfLocalProvider implements IEmbeddingProvider {
    modelName: string;
    dim: number;
    dtype: HfLocalDtype;
    maxTextLength: number;
    timeout: number;
    extractor: FeatureExtractionPipeline | null;
    modelLoadTime: number | null;
    loadingPromise: Promise<FeatureExtractionPipeline> | null;
    isHealthy: boolean;
    constructor(options?: HfLocalOptions);
    getModel(): Promise<FeatureExtractionPipeline>;
    generateEmbedding(text: string): Promise<Float32Array | null>;
    embedDocument(text: string): Promise<Float32Array | null>;
    embedQuery(text: string): Promise<Float32Array | null>;
    warmup(): Promise<boolean>;
    getMetadata(): ProviderMetadata;
    getProfile(): EmbeddingProfile;
    healthCheck(): Promise<boolean>;
    getProviderName(): string;
}
export {};
//# sourceMappingURL=hf-local.d.ts.map