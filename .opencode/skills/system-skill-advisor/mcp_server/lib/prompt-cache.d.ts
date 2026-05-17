export declare const ADVISOR_PROMPT_CACHE_TTL_MS: number;
export declare const ADVISOR_PROMPT_CACHE_DEFAULT_MAX_TOKENS = 80;
export declare const ADVISOR_PROMPT_CACHE_MAX_TOKENS = 120;
export declare const MAX_CACHE_ENTRIES = 1000;
export interface AdvisorThresholds {
    readonly confidenceThreshold?: number;
    readonly uncertaintyThreshold?: number;
    readonly confidenceOnly?: boolean;
    readonly showRejections?: boolean;
    readonly includeAttribution?: boolean;
    readonly includeAbstainReasons?: boolean;
}
export interface AdvisorPromptCacheKeyParts {
    readonly canonicalPrompt: string;
    readonly sourceSignature: string;
    readonly workspaceRoot?: string;
    readonly runtime: string;
    readonly maxTokens?: number;
    readonly thresholdConfig?: AdvisorThresholds;
}
export interface AdvisorPromptCacheEntry<T> {
    readonly key: string;
    readonly sourceSignature: string;
    readonly value: T;
    readonly skillLabels: readonly string[];
    readonly createdAtMs: number;
    readonly expiresAtMs: number;
}
/** Build an opaque HMAC key for exact prompt-cache lookups. */
export declare function createAdvisorPromptCacheKey(parts: AdvisorPromptCacheKeyParts, secret?: Buffer): string;
/** In-memory exact cache for advisor briefs scoped to one host process. */
export declare class AdvisorPromptCache<T> {
    private readonly ttlMs;
    private readonly secret;
    private readonly entries;
    constructor(ttlMs?: number, secret?: Buffer);
    /** Create an opaque cache key from normalized prompt/runtime/source inputs. */
    makeKey(parts: AdvisorPromptCacheKeyParts): string;
    /** Return a live entry, evicting it first when its TTL has expired. */
    get(key: string, nowMs?: number): AdvisorPromptCacheEntry<T> | null;
    /** Insert or replace an entry, sweeping expired rows and evicting oldest overflow. */
    set(args: {
        key: string;
        sourceSignature: string;
        value: T;
        skillLabels: readonly string[];
        nowMs?: number;
    }): AdvisorPromptCacheEntry<T>;
    /** Remove a single cache entry by key. */
    invalidate(key: string): void;
    /** Drop entries produced from stale advisor source signatures. */
    invalidateSourceSignatureChange(currentSourceSignature: string): number;
    /** Clear all cache entries, primarily for tests and session teardown. */
    clear(): void;
    /** Return the number of live and unswept entries currently retained. */
    size(): number;
    private sweepExpired;
    private evictOldestUntilBelowLimit;
}
export declare const advisorPromptCache: AdvisorPromptCache<unknown>;
//# sourceMappingURL=prompt-cache.d.ts.map