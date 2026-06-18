// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Lane Registry
// ───────────────────────────────────────────────────────────────

import type { LaneDampingConfig } from './types.js';
import { ADVISOR_BM25_LEXICAL_SHADOW_LANE_ID } from './lanes/bm25.js';

const LANE_DEFINITIONS = [
  { id: 'explicit_author', defaultWeight: 0.42, defaultShadowWeight: 0.40, live: true },
  { id: 'lexical', defaultWeight: 0.28, defaultShadowWeight: 0.25, live: true },
  { id: 'graph_causal', defaultWeight: 0.13, defaultShadowWeight: 0.20, live: true },
  { id: 'derived_generated', defaultWeight: 0.12, defaultShadowWeight: 0.10, live: true },
  { id: 'semantic_shadow', defaultWeight: 0.05, defaultShadowWeight: 0.05, live: true },
] as const satisfies readonly {
  readonly id: string;
  readonly defaultWeight: number;
  readonly defaultShadowWeight: number;
  readonly live: boolean;
}[];

export const SHADOW_SCORER_LANE_DEFINITIONS = [
  {
    id: ADVISOR_BM25_LEXICAL_SHADOW_LANE_ID,
    defaultWeight: 0,
    defaultShadowWeight: 0.10,
    live: false,
    envFlag: 'SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW',
  },
] as const;

export type ScorerLaneId = (typeof LANE_DEFINITIONS)[number]['id'];

const DEFAULT_WEIGHTS = Object.fromEntries(
  LANE_DEFINITIONS.map((lane) => [lane.id, lane.defaultWeight]),
) as Record<ScorerLaneId, number>;

const DEFAULT_SHADOW_WEIGHTS = Object.fromEntries(
  LANE_DEFINITIONS.map((lane) => [lane.id, lane.defaultShadowWeight]),
) as Record<ScorerLaneId, number>;

function resolveLaneWeightsOverride(
  envKey: string,
  defaults: Record<ScorerLaneId, number>,
): Record<ScorerLaneId, number> {
  const raw = process.env[envKey];
  if (typeof raw !== 'string' || raw.trim() === '') return defaults;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return defaults;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return defaults;
  }
  const merged: Record<ScorerLaneId, number> = { ...defaults };
  for (const key of Object.keys(parsed) as ScorerLaneId[]) {
    if (!(key in defaults)) continue;
    const value = (parsed as Record<string, unknown>)[key];
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1) {
      merged[key] = value;
    }
  }
  return merged;
}

const RESOLVED_WEIGHTS = resolveLaneWeightsOverride(
  'SPECKIT_ADVISOR_LANE_WEIGHTS_JSON',
  DEFAULT_WEIGHTS,
);
const RESOLVED_SHADOW_WEIGHTS = resolveLaneWeightsOverride(
  'SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON',
  DEFAULT_SHADOW_WEIGHTS,
);

export const SCORER_LANE_REGISTRY: readonly {
  readonly id: ScorerLaneId;
  readonly weight: number;
  readonly shadowWeight: number;
  readonly live: boolean;
  readonly damping?: LaneDampingConfig;
}[] = LANE_DEFINITIONS.map((lane) => ({
  id: lane.id,
  weight: RESOLVED_WEIGHTS[lane.id],
  shadowWeight: RESOLVED_SHADOW_WEIGHTS[lane.id],
  live: lane.live,
}));

export const SCORER_LANE_IDS = SCORER_LANE_REGISTRY.map((lane) => lane.id) as [
  ScorerLaneId,
  ...ScorerLaneId[],
];

export const LIVE_SCORER_LANE_IDS = SCORER_LANE_REGISTRY
  .filter((lane) => lane.live)
  .map((lane) => lane.id) as ScorerLaneId[];

export const DEFAULT_SCORER_LANE_WEIGHTS = RESOLVED_WEIGHTS;

export const DEFAULT_SHADOW_SCORER_LANE_WEIGHTS = RESOLVED_SHADOW_WEIGHTS;

export function isLiveScorerLane(lane: ScorerLaneId): boolean {
  return SCORER_LANE_REGISTRY.some((entry) => entry.id === lane && entry.live);
}
