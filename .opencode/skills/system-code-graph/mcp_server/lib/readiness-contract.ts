// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Readiness Contract (Shared)
// ───────────────────────────────────────────────────────────────
// Shared readiness contract for code-graph handlers. Extracted from
// handlers/code-graph/query.ts so the query handler and its sibling handlers
// (scan, status, context) can converge on one readiness vocabulary.
//
// Scope: 4 helpers that map ensure-ready `GraphFreshness`
// ('fresh'|'stale'|'empty'|'error') onto:
//   1. the canonical ops-hardening `StructuralReadiness`
//      vocabulary ('ready'|'stale'|'missing') used by
//      session_bootstrap / session_resume, and
//   2. the shared-payload `SharedPayloadTrustState` axis
//      ('live'|'stale'|'absent'|'unavailable' subset of the 8-state canonical).
//
// IMPORTANT: this module does NOT introduce a new trust-state
// enum. It consumes the canonical `SharedPayloadTrustState` from
// lib/context/shared-payload.ts. The handler-level helpers below only emit a
// 4-value subset
// (live|stale|absent|unavailable) because ensure-ready knows about
// four freshness states — that subset is a safe, forward-
// compatible projection over the canonical type.

import * as graphDb from './code-graph-db.js';
import type { ReadyResult } from './ensure-ready.js';
import type { StructuralReadiness } from './ops-hardening.js';
import {
  buildStructuralTrustFromProvenance,
  type DetectorProvenance,
  type SharedPayloadTrustState,
  type StructuralTrust,
} from './shared/shared-payload.js';
import { assertNever } from './shared/assert-never.js';

// Re-export the surface types that downstream consumers need so they can
// import everything readiness-related from a single module.
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
 *   'error' → 'missing'  (unreachable scope is structurally missing)
 *
 * A later change widens the union.
 */
export function canonicalReadinessFromFreshness(
  freshness: ReadyResult['freshness'],
): StructuralReadiness {
  switch (freshness) {
    case 'fresh':
      return 'ready';
    case 'stale':
      return 'stale';
    case 'empty':
      return 'missing';
    case 'error':
      return 'missing';
    default:
      return assertNever(freshness, 'graph-freshness');
  }
}

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
 *   'error' → 'unavailable'  (scope unreachable, not absent)
 *
 * The return type is the full canonical 8-state union
 * (`SharedPayloadTrustState`); the projection is a 4-value
 * subset (live | stale | absent | unavailable) matching the widened
 * `SkillGraphTrustState` axis at skill-advisor/lib/freshness/trust-state.ts.
 * Do not narrow this to a custom 4-state enum; the `error` arm is required.
 */
export function queryTrustStateFromFreshness(
  freshness: ReadyResult['freshness'],
): SharedPayloadTrustState {
  switch (freshness) {
    case 'fresh':
      return 'live';
    case 'stale':
      return 'stale';
    case 'empty':
      return 'absent';
    case 'error':
      return 'unavailable';
    default:
      return assertNever(freshness, 'graph-freshness');
  }
}

/**
 * Compute query-level detector provenance from the
 * last-persisted scan, returning an envelope that pairs the
 * provenance with its source label. Returns `undefined` when the
 * graph is empty (no scan has occurred) or when the db reports
 * no persisted provenance yet — callers should omit the
 * `graphMetadata` field entirely in that case rather than
 * surfacing a placeholder.
 *
 * Provenance is omitted when no trusted persisted source exists.
 */
function getPersistedDetectorProvenance(
  readiness: ReadyResult,
): DetectorProvenance | null {
  // 'empty' = scope has no rows yet; 'error' = scope unreachable
  // (probe crashed). Both cases must skip db lookup so we don't surface
  // stale or partial provenance from an unreachable store.
  if (readiness.freshness === 'empty' || readiness.freshness === 'error') {
    return null;
  }

  return graphDb.getLastDetectorProvenance();
}

function buildQueryTrustArtifacts(
  readiness: ReadyResult,
  detectorProvenance: DetectorProvenance | null = getPersistedDetectorProvenance(readiness),
): QueryTrustMetadata {
  const graphMetadata = detectorProvenance
    ? {
      detectorProvenance,
      detectorProvenanceSource: 'last-persisted-scan',
    }
    : undefined;

  switch (readiness.freshness) {
    case 'fresh':
      return {
        graphMetadata,
        structuralTrust: buildStructuralTrustFromProvenance({
          detectorProvenance,
          fallbackParserProvenance: 'unknown',
          evidenceStatus: 'confirmed',
          freshnessAuthority: 'live',
        }),
      };
    case 'stale':
      return {
        graphMetadata,
        structuralTrust: buildStructuralTrustFromProvenance({
          detectorProvenance,
          fallbackParserProvenance: 'unknown',
          evidenceStatus: 'probable',
          freshnessAuthority: 'stale',
        }),
      };
    case 'empty':
      return {
        graphMetadata,
        structuralTrust: buildStructuralTrustFromProvenance({
          fallbackParserProvenance: 'unknown',
          evidenceStatus: 'unverified',
          freshnessAuthority: 'unknown',
        }),
      };
    case 'error':
      // Unreachable scope. graphMetadata is omitted (provenance probe is
      // suppressed in getPersistedDetectorProvenance), and trust
      // collapses to 'unverified' / 'unknown'. Downstream consumers should
      // use the readiness-block trustState='unavailable' to differentiate
      // crash-on-probe from genuinely empty scopes.
      return {
        graphMetadata,
        structuralTrust: buildStructuralTrustFromProvenance({
          fallbackParserProvenance: 'unknown',
          evidenceStatus: 'unverified',
          freshnessAuthority: 'unknown',
        }),
      };
    default:
      return assertNever(readiness.freshness, 'graph-freshness');
  }
}

export function buildQueryGraphMetadata(
  readiness: ReadyResult,
): Record<string, unknown> | undefined {
  return buildQueryTrustArtifacts(readiness).graphMetadata;
}

export function buildQueryStructuralTrust(
  readiness: ReadyResult,
): StructuralTrust {
  return buildQueryTrustArtifacts(readiness).structuralTrust;
}

export function buildQueryTrustMetadata(
  readiness: ReadyResult,
): QueryTrustMetadata {
  return buildQueryTrustArtifacts(readiness);
}

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
 * Keeps readiness and trust-state mapping centralized for handlers.
 */
export function buildReadinessBlock(
  readiness: ReadyResult,
): CodeGraphReadinessBlock {
  return {
    ...readiness,
    canonicalReadiness: canonicalReadinessFromFreshness(readiness.freshness),
    trustState: queryTrustStateFromFreshness(readiness.freshness),
  };
}
