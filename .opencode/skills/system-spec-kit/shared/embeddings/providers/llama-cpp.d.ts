import type { EmbeddingProfileData, IEmbeddingProvider, ProviderMetadata } from '../../types.js';
interface LlamaCppOptions {
    model?: string;
    modelPath?: string;
    dim?: number;
    maxTextLength?: number;
    timeout?: number;
}
export interface NodeLlamaCppModule {
    getLlama: () => Promise<LlamaRuntime>;
}
export interface LlamaRuntime {
    loadModel: (options: Record<string, unknown>) => Promise<LlamaModel>;
    gpu?: string;
}
export interface LlamaModel {
    createEmbeddingContext: (options?: Record<string, unknown>) => Promise<LlamaEmbeddingContext>;
    embeddingVectorSize?: number;
    trainContextSize?: number;
    tokenize?: (text: string) => unknown[];
    detokenize?: (tokens: unknown[]) => string;
    dispose?: () => Promise<void>;
}
export interface LlamaEmbeddingContext {
    getEmbeddingFor: (input: string) => Promise<{
        vector: readonly number[];
    }>;
    dispose?: () => Promise<void>;
}
export interface LlamaCppRuntimeState {
    llama: LlamaRuntime;
    model: LlamaModel;
    context: LlamaEmbeddingContext;
    modelPath: string;
    loadTimeMs: number;
    gpu: string | null;
    tokenBudget: number;
    contextSize: number;
}
interface LlamaCppAvailability {
    available: boolean;
    reason?: string;
}
declare function loadRuntime(modelPath: string): Promise<LlamaCppRuntimeState>;
export declare class LlamaCppProvider implements IEmbeddingProvider {
    modelName: string;
    modelPath: string;
    dim: number;
    maxTextLength: number;
    timeout: number;
    modelLoadTime: number | null;
    isHealthy: boolean;
    prefixModelId: string;
    constructor(options?: LlamaCppOptions);
    static canLoad(options?: Pick<LlamaCppOptions, 'modelPath'>): Promise<LlamaCppAvailability>;
    getRuntime(): Promise<LlamaCppRuntimeState>;
    generateEmbedding(text: string): Promise<Float32Array | null>;
    embedDocument(text: string): Promise<Float32Array | null>;
    embedQuery(text: string): Promise<Float32Array | null>;
    warmup(): Promise<boolean>;
    getMetadata(): ProviderMetadata;
    getProfile(): EmbeddingProfileData;
    healthCheck(): Promise<boolean>;
    getProviderName(): string;
}
declare function resetRuntimeForTesting(): void;
export declare const __llamaCppTestables: {
    DEFAULT_MODEL_PATH: any;
    loadRuntime: typeof loadRuntime;
    resetRuntimeForTesting: typeof resetRuntimeForTesting;
    setRuntimeOverride(runtime: LlamaCppRuntimeState | null): void;
    setNodeLlamaCppModule(module: NodeLlamaCppModule | null): void;
};
export {};
//# sourceMappingURL=llama-cpp.d.ts.map