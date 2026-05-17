export declare const ADVISOR_SOURCE_CACHE_TTL_MS: number;
export declare const ADVISOR_SOURCE_CACHE_MAX_ENTRIES = 16;
/** Return a cached source-derived value or compute and retain it with TTL/LRU bounds. */
export declare function getOrCompute<TValue>(key: string, ttlMs: number, factory: () => TValue): TValue;
/** Clear all source-cache entries for tests and host reset flows. */
export declare function clearAdvisorSourceCache(): void;
//# sourceMappingURL=source-cache.d.ts.map