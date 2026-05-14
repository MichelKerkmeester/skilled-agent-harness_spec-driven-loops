export interface CrossFileCallResolutionStats {
    resolved: number;
    unresolved: number;
    ambiguousSkipped: number;
}
export declare function hasCrossFileCallResolutionActivity(stats: CrossFileCallResolutionStats): boolean;
export declare function resolveCrossFileCallEdges(): CrossFileCallResolutionStats;
//# sourceMappingURL=cross-file-edge-resolver.d.ts.map