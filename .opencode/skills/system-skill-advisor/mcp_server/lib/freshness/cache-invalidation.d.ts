export interface CacheInvalidationEvent {
    readonly generation: number;
    readonly changedPaths: readonly string[];
    readonly invalidatedAt: string;
    readonly reason: string;
}
export type CacheInvalidationListener = (event: CacheInvalidationEvent) => void;
export declare function onCacheInvalidation(listener: CacheInvalidationListener): () => void;
export declare function invalidateSkillGraphCaches(event: Omit<CacheInvalidationEvent, 'invalidatedAt'>): CacheInvalidationEvent;
export declare function getLastCacheInvalidation(): CacheInvalidationEvent | null;
export declare function clearCacheInvalidationListeners(): void;
//# sourceMappingURL=cache-invalidation.d.ts.map