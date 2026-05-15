import type { ParsedProfileSlug, ProfileJson } from '../types.js';
/** Create safe slug for filenames (e.g., openai__text-embedding-3-small__1536) */
export declare function createProfileSlug(provider: string, model: string, dim: number, dtype?: string | null): string;
/** Parse profile slug back to components */
export declare function parseProfileSlug(slug: string): ParsedProfileSlug | null;
interface EmbeddingProfileOptions {
    provider: string;
    model: string;
    dim: number;
    dtype?: string | null;
    baseUrl?: string | null;
}
/** Provides embedding profile. */
export declare class EmbeddingProfile {
    provider: string;
    model: string;
    dim: number;
    dtype: string | null;
    baseUrl: string | null;
    slug: string;
    constructor({ provider, model, dim, dtype, baseUrl }: EmbeddingProfileOptions);
    /** Get database path for the profile-keyed sqlite file. */
    getDatabasePath(baseDir: string): string;
    toFilename(): string;
    toDisplayString(): string;
    equals(other: EmbeddingProfile): boolean;
    toJson(): ProfileJson;
}
type ActiveProfileProvider = 'voyage' | 'openai' | 'hf-local' | 'llama-cpp';
export declare const ALLOWED_HF_LOCAL_DTYPES: ReadonlyArray<string>;
export declare const ALLOWED_LLAMA_CPP_DTYPES: ReadonlyArray<string>;
export declare function resolveActiveProfileProvider(): ActiveProfileProvider;
export declare function normalizeProfileDtype(value: string | undefined | null): string | null;
export declare function resolveActiveProfileDtype(provider: ActiveProfileProvider): string | null;
export declare function resolveActiveProfileDbPath(profile?: EmbeddingProfile, dbDir?: string): string;
export {};
//# sourceMappingURL=profile.d.ts.map