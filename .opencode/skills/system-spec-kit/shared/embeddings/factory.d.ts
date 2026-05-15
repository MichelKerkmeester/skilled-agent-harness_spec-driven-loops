import { EmbeddingProfile } from './profile.js';
import type { IEmbeddingProvider, ProviderResolution, ProviderInfo, CreateProviderOptions, ApiKeyValidationResult } from '../types.js';
type SupportedProviderName = 'voyage' | 'openai' | 'hf-local' | 'llama-cpp';
type ConfiguredProviderName = SupportedProviderName | 'auto';
type ProviderFactoryMetadata = {
    requestedProvider: string;
    effectiveProvider: string;
    fallbackReason?: string;
    dimensionChanged: boolean;
};
type ProviderInfoWithFallback = ProviderInfo & ProviderFactoryMetadata;
type StartupEmbeddingConfig = {
    resolution: ProviderResolution;
    info: ProviderInfoWithFallback;
    dimension: number;
    validation: ApiKeyValidationResult;
};
export type AutoMigrationResult = {
    status: 'skipped';
    reason: string;
} | {
    status: 'completed';
    sourceRows: number;
    targetRows: number;
    wallClockSeconds: number;
    deletedFiles: string[];
} | {
    status: 'failed';
    reason: string;
    preservedSource: string;
    fallbackProvider: 'hf-local';
};
interface ValidateApiKeyOptions {
    timeout?: number;
    provider?: SupportedProviderName;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
}
interface MigrationRunResult {
    status: 'completed' | 'no-op' | 'failed';
    source: string;
    target: string;
    source_rows: number;
    target_rows: number;
    migrated_rows: number;
    skipped_rows: number;
    pruned_target_only_rows: number;
    summary_rows: number;
    validation_sample_size: number;
    mismatches: number;
    wall_clock_seconds: number;
    started_at: string;
    completed_at: string;
    reason?: string;
}
type MigrationRunner = (opts: {
    source?: string;
    target?: string;
    validationSampleSize?: number;
    logger?: (msg: string) => void;
}) => Promise<MigrationRunResult>;
interface AutoMigrationTestOverrides {
    databaseDir?: string;
    runMigration?: MigrationRunner;
}
export declare function setAutoMigrationTestOverridesForTests(overrides: AutoMigrationTestOverrides | null): void;
export declare const SUPPORTED_PROVIDERS: readonly ["openai", "voyage", "hf-local", "llama-cpp", "auto"];
export declare const VALID_PROVIDER_DIMENSIONS: Readonly<{
    voyage: Readonly<{
        [x: string]: number;
    }>;
    openai: Readonly<{
        [x: string]: number;
    }>;
    'hf-local': Readonly<{
        'nomic-ai/nomic-embed-text-v1.5': 768;
        'google/embeddinggemma-300m': 768;
        'onnx-community/embeddinggemma-300m-ONNX': 768;
        'intfloat/e5-large-v2': 1024;
        'mixedbread-ai/mxbai-embed-large-v1': 1024;
        'Snowflake/snowflake-arctic-embed-l-v2.0': 1024;
        'BAAI/bge-m3': 1024;
    }>;
    'llama-cpp': Readonly<{
        'unsloth/embeddinggemma-300m-GGUF': 768;
        'ggml-org/embeddinggemma-300M-GGUF': 768;
        'google/embeddinggemma-300m': 768;
    }>;
}>;
export declare function runAutoMigrationIfNeeded(profile: EmbeddingProfile): Promise<AutoMigrationResult>;
export declare function validateConfiguredEmbeddingsProvider(value?: string | undefined): ConfiguredProviderName | null;
export declare function resolveProviderDimension(provider: string, options?: Pick<CreateProviderOptions, 'model' | 'dim'>): number;
export declare function getStartupEmbeddingDimension(): number;
export declare function getStartupEmbeddingProfile(): EmbeddingProfile;
export declare function resolveStartupEmbeddingConfig(options?: Pick<ValidateApiKeyOptions, 'timeout'>): Promise<StartupEmbeddingConfig>;
/**
 * Resolve provider based on env vars.
 * Precedence:
 * 1) EMBEDDINGS_PROVIDER,
 * 2) VOYAGE_API_KEY,
 * 3) OPENAI_API_KEY,
 * 4) llama-cpp local default when available,
 * 5) hf-local local fallback.
 *
 * `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` disables destructive startup
 * migration and preserves the pre-018 warning + manual-script behavior.
 */
export declare function resolveProvider(): ProviderResolution;
/** Create provider instance based on configuration */
export declare function createEmbeddingsProvider(options?: CreateProviderOptions): Promise<IEmbeddingProvider>;
/** Get configuration information without creating the provider */
export declare function getProviderInfo(): ProviderInfoWithFallback;
/**
 * Validation timeout in milliseconds.
 * REQ-029, CHK-170: Must complete within 5s
 */
export declare const VALIDATION_TIMEOUT_MS: number;
/**
 * Validate API key at startup before any tool usage.
 * REQ-029: Pre-Flight API Key Validation
 *
 * This function should be called during MCP server startup to fail fast
 * if the configured embedding provider has an invalid API key.
 */
export declare function validateApiKey(options?: ValidateApiKeyOptions): Promise<ApiKeyValidationResult>;
export {};
//# sourceMappingURL=factory.d.ts.map