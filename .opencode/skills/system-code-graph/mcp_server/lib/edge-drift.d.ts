import type { EdgeType } from './indexer-types.js';
/**
 * Drift thresholds shared across the status handler and tests.
 * Single source of truth so production and test cutoffs cannot diverge.
 */
export declare const EDGE_DRIFT_PSI_THRESHOLD = 0.25;
export declare const EDGE_DRIFT_JSD_THRESHOLD = 0.1;
export declare const EDGE_DRIFT_SHARE_THRESHOLD = 0.05;
export type EdgeDistribution = Record<EdgeType, number>;
export declare function buildEdgeDistribution(distribution?: Partial<Record<EdgeType, number>> | Record<string, number> | null): EdgeDistribution;
export declare function computeEdgeShare(edges: EdgeDistribution): EdgeDistribution;
export declare function computePSI(observed: EdgeDistribution, baseline: EdgeDistribution): number;
export declare function computeJSD(observed: EdgeDistribution, baseline: EdgeDistribution): number;
//# sourceMappingURL=edge-drift.d.ts.map