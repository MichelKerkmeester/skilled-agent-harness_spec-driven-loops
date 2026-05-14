// ───────────────────────────────────────────────────────────────
// MODULE: Edge Distribution Drift
// ───────────────────────────────────────────────────────────────
// Builds edge-type distributions and computes divergence metrics
// (PSI, JSD, share drift) used by the status handler and tests.
import { DEFAULT_EDGE_WEIGHTS } from './indexer-types.js';
const EDGE_TYPES = Object.keys(DEFAULT_EDGE_WEIGHTS);
const DIVERGENCE_EPSILON = 1e-12;
/**
 * Drift thresholds shared across the status handler and tests.
 * Single source of truth so production and test cutoffs cannot diverge.
 */
export const EDGE_DRIFT_PSI_THRESHOLD = 0.25;
export const EDGE_DRIFT_JSD_THRESHOLD = 0.10;
export const EDGE_DRIFT_SHARE_THRESHOLD = 0.05;
function normalizeValue(value) {
    return Number.isFinite(value) && value > 0 ? value : 0;
}
function normalizeWithSmoothing(distribution) {
    const share = computeEdgeShare(distribution);
    const smoothedEntries = EDGE_TYPES.map((edgeType) => [
        edgeType,
        share[edgeType] + DIVERGENCE_EPSILON,
    ]);
    const total = smoothedEntries.reduce((sum, [, value]) => sum + value, 0);
    return Object.fromEntries(smoothedEntries.map(([edgeType, value]) => [edgeType, value / total]));
}
export function buildEdgeDistribution(distribution) {
    return Object.fromEntries(EDGE_TYPES.map((edgeType) => [edgeType, normalizeValue(distribution?.[edgeType] ?? 0)]));
}
export function computeEdgeShare(edges) {
    const total = EDGE_TYPES.reduce((sum, edgeType) => sum + normalizeValue(edges[edgeType]), 0);
    if (total === 0) {
        return Object.fromEntries(EDGE_TYPES.map((edgeType) => [edgeType, 0]));
    }
    return Object.fromEntries(EDGE_TYPES.map((edgeType) => [edgeType, normalizeValue(edges[edgeType]) / total]));
}
export function computePSI(observed, baseline) {
    const observedShare = normalizeWithSmoothing(observed);
    const baselineShare = normalizeWithSmoothing(baseline);
    return EDGE_TYPES.reduce((sum, edgeType) => {
        const observedValue = observedShare[edgeType];
        const baselineValue = baselineShare[edgeType];
        return sum + (observedValue - baselineValue) * Math.log(observedValue / baselineValue);
    }, 0);
}
export function computeJSD(observed, baseline) {
    const observedShare = normalizeWithSmoothing(observed);
    const baselineShare = normalizeWithSmoothing(baseline);
    const midpoint = Object.fromEntries(EDGE_TYPES.map((edgeType) => [
        edgeType,
        (observedShare[edgeType] + baselineShare[edgeType]) / 2,
    ]));
    const kl = (left, right) => EDGE_TYPES.reduce((sum, edgeType) => {
        const leftValue = left[edgeType];
        const rightValue = right[edgeType];
        return sum + leftValue * Math.log(leftValue / rightValue);
    }, 0);
    return 0.5 * kl(observedShare, midpoint) + 0.5 * kl(baselineShare, midpoint);
}
//# sourceMappingURL=edge-drift.js.map