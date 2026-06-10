// ───────────────────────────────────────────────────────────────
// MODULE: Edge Tier Basement
// ───────────────────────────────────────────────────────────────
// Keeps edge-derived retention floors aligned with retrieval tier caps.

import { STATE_LIMITS } from '../search/pipeline/stage4-filter.js';

export type EdgeTierFloorState = 'HOT' | 'WARM';

export interface EdgeTierBasementInput {
  sourceImportanceTier?: string | null;
  targetImportanceTier?: string | null;
  provenance?: string | null;
  evidence?: string | null;
  constitutionalChain?: boolean;
}

export interface EdgeTierBasementDecision {
  floored: boolean;
  floorState: EdgeTierFloorState | null;
  stateLimit: number | null;
  reason: string;
}

const HIGH_TIERS = new Set(['constitutional', 'critical', 'important']);
const TOP_TIERS = new Set(['constitutional', 'critical']);
const AUTHOR_PROVENANCE = new Set(['manual', 'authored']);
const AUTO_PROVENANCE = new Set(['auto', 'auto_derived', 'inferred', 'llm', 'batch']);

function normalize(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase().replace(/-/g, '_');
  return normalized && normalized.length > 0 ? normalized : null;
}

function isAutoDerived(input: EdgeTierBasementInput): boolean {
  const provenance = normalize(input.provenance);
  return provenance !== null && AUTO_PROVENANCE.has(provenance);
}

function hasAuthoredProvenance(input: EdgeTierBasementInput): boolean {
  const provenance = normalize(input.provenance);
  return provenance !== null && AUTHOR_PROVENANCE.has(provenance);
}

function hasConstitutionalChain(input: EdgeTierBasementInput): boolean {
  return input.constitutionalChain === true || normalize(input.evidence) === 'constitutional_chain';
}

function resolveFloorState(sourceTier: string | null, targetTier: string | null): EdgeTierFloorState {
  return TOP_TIERS.has(sourceTier ?? '') || TOP_TIERS.has(targetTier ?? '') ? 'HOT' : 'WARM';
}

export function resolveEdgeTierBasement(input: EdgeTierBasementInput): EdgeTierBasementDecision {
  const sourceTier = normalize(input.sourceImportanceTier);
  const targetTier = normalize(input.targetImportanceTier);

  if (isAutoDerived(input)) {
    return { floored: false, floorState: null, stateLimit: null, reason: 'auto_derived_not_floored' };
  }

  if (hasConstitutionalChain(input)) {
    return {
      floored: true,
      floorState: 'HOT',
      stateLimit: STATE_LIMITS.HOT,
      reason: 'constitutional_chain',
    };
  }

  if (
    hasAuthoredProvenance(input)
    && HIGH_TIERS.has(sourceTier ?? '')
    && HIGH_TIERS.has(targetTier ?? '')
  ) {
    const floorState = resolveFloorState(sourceTier, targetTier);
    return {
      floored: true,
      floorState,
      stateLimit: STATE_LIMITS[floorState],
      reason: 'authored_high_tier_pair',
    };
  }

  return { floored: false, floorState: null, stateLimit: null, reason: 'no_floor_evidence' };
}

export { STATE_LIMITS as EDGE_TIER_STATE_LIMITS };
