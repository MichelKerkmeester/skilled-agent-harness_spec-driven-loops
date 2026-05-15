import type { ReadyResult } from './ensure-ready.js';
import type { StructuralReadiness } from './ops-hardening.js';
import { type SharedPayloadTrustState, type StructuralTrust } from './shared/shared-payload.js';
export type { ReadyResult } from './ensure-ready.js';
export type { StructuralReadiness } from './ops-hardening.js';
export type { SharedPayloadTrustState } from './shared/shared-payload.js';
interface QueryTrustMetadata {
    graphMetadata?: Record<string, unknown>;
    structuralTrust: StructuralTrust;
}
/** Readiness payload shared by code-graph handler responses. */
export interface CodeGraphReadinessBlock extends ReadyResult {
    readonly canonicalReadiness: StructuralReadiness;
    readonly trustState: SharedPayloadTrustState;
}
/**
 * Map ensure-ready `GraphFreshness` onto the canonical
 * ops-hardening `StructuralReadiness` vocabulary. The canonical
 * vocabulary is the one emitted by session_bootstrap /
 * session_resume, so aligning query / scan / status / context
 * readiness on it gives consumers a single vocabulary across
 * every code-graph surface.
 *
 * Mapping:
 *   'fresh' → 'ready'
 *   'stale' → 'stale'
 *   'empty' → 'missing'
 *   'error' → 'missing'  (PR 4 / F71: unreachable scope is structurally missing)
 *
 * Origin: M8 / T-CGQ-11 (R22-001, R23-001); PR 4 step 2 widens the union.
 */
export declare function canonicalReadinessFromFreshness(freshness: ReadyResult['freshness']): StructuralReadiness;
/**
 * Map ensure-ready `GraphFreshness` onto the shared-payload
 * `SharedPayloadTrustState` axis. Adds 'absent' for 'empty'
 * graphs so queries against an uninitialised store don't
 * masquerade as 'stale'.
 *
 * Mapping:
 *   'fresh' → 'live'
 *   'stale' → 'stale'
 *   'empty' → 'absent'
 *   'error' → 'unavailable'  (PR 4 / F71: scope unreachable, not absent)
 *
 * The return type is the full canonical 8-state union
 * (`SharedPayloadTrustState`); the projection is a 4-value
 * subset (live | stale | absent | unavailable) matching the V5-widened
 * `SkillGraphTrustState` axis at skill-advisor/lib/freshness/trust-state.ts.
 * Callers must NOT narrow this to a custom 4-state enum —
 * see M8 / T-SHP-01 (R9-001); PR 4 step 2 adds the `error` arm.
 */
export declare function queryTrustStateFromFreshness(freshness: ReadyResult['freshness']): SharedPayloadTrustState;
export declare function buildQueryGraphMetadata(readiness: ReadyResult): Record<string, unknown> | undefined;
export declare function buildQueryStructuralTrust(readiness: ReadyResult): StructuralTrust;
export declare function buildQueryTrustMetadata(readiness: ReadyResult): QueryTrustMetadata;
/**
 * Build the readiness block emitted on every query-family
 * response payload. Preserves the raw ensure-ready fields so
 * existing consumers that key off `readiness.freshness` keep
 * working, and augments them with:
 *   - `canonicalReadiness` — the ops-hardening vocabulary
 *     (`ready|stale|missing`), aligned with session_bootstrap /
 *     session_resume.
 *   - `trustState` — the shared-payload axis
 *     (`live|stale|absent` subset of the canonical 8-state type).
 *
 * Origin: M8 / T-CGQ-11.
 */
export declare function buildReadinessBlock(readiness: ReadyResult): CodeGraphReadinessBlock;
//# sourceMappingURL=readiness-contract.d.ts.map