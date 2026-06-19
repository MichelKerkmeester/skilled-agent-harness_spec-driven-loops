// ───────────────────────────────────────────────────────────────
// MODULE: Retrieval Profile
// ───────────────────────────────────────────────────────────────
// Opt-in per-shape channel multipliers for pre-fusion ranked lists.

import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RetrievalClass } from './retrieval-class-classifier.js';

interface RetrievalProfile {
  channelWeights: Partial<Record<string, number>>;
}

const RETRIEVAL_PROFILE_FLAG = 'SPECKIT_RETRIEVAL_PROFILE_WEIGHTS';
const TRUTHY_PROFILE_VALUES = new Set(['true', '1', 'yes', 'on', 'enabled']);

const IDENTITY_RETRIEVAL_PROFILE: RetrievalProfile = Object.freeze({
  channelWeights: Object.freeze({}),
});

const DEFAULT_RETRIEVAL_PROFILES: Readonly<Record<RetrievalClass, RetrievalProfile>> = Object.freeze({
  Neutral: IDENTITY_RETRIEVAL_PROFILE,
  SingleHop: Object.freeze({
    channelWeights: Object.freeze({
      vector: 1.0,
      fts: 1.10,
      bm25: 1.10,
      keyword: 1.10,
      graph: 0,
      degree: 0,
    }),
  }),
  MultiHop: Object.freeze({
    channelWeights: Object.freeze({
      vector: 1.0,
      fts: 0.95,
      bm25: 0.95,
      keyword: 0.95,
      graph: 1.20,
      degree: 1.10,
    }),
  }),
  Temporal: Object.freeze({
    channelWeights: Object.freeze({
      vector: 0.95,
      fts: 1.05,
      bm25: 1.05,
      keyword: 1.05,
      graph: 0.90,
      degree: 0.80,
    }),
  }),
  Entity: Object.freeze({
    channelWeights: Object.freeze({
      vector: 0.95,
      fts: 1.15,
      bm25: 1.15,
      keyword: 1.15,
      graph: 1.0,
      degree: 1.0,
    }),
  }),
  Quote: Object.freeze({
    channelWeights: Object.freeze({
      vector: 0.70,
      fts: 1.35,
      bm25: 1.35,
      keyword: 1.35,
      graph: 0,
      degree: 0,
    }),
  }),
});

function isRetrievalProfileWeightsEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const raw = env[RETRIEVAL_PROFILE_FLAG]?.toLowerCase().trim();
  return raw !== undefined && TRUTHY_PROFILE_VALUES.has(raw);
}

function sanitizeProfileWeight(weight: number | undefined): number {
  return typeof weight === 'number' && Number.isFinite(weight) && weight >= 0 ? weight : 1;
}

function resolveRetrievalProfile(
  retrievalClass: RetrievalClass | undefined,
  options: {
    enabled?: boolean;
    profiles?: Partial<Record<RetrievalClass, RetrievalProfile>>;
  } = {},
): RetrievalProfile {
  const enabled = options.enabled ?? isRetrievalProfileWeightsEnabled();
  if (!enabled) return IDENTITY_RETRIEVAL_PROFILE;

  const key = retrievalClass ?? 'Neutral';
  return options.profiles?.[key] ?? DEFAULT_RETRIEVAL_PROFILES[key] ?? IDENTITY_RETRIEVAL_PROFILE;
}

function getRetrievalProfileChannelWeight(
  retrievalClass: RetrievalClass | undefined,
  source: string,
  options: {
    enabled?: boolean;
    profiles?: Partial<Record<RetrievalClass, RetrievalProfile>>;
  } = {},
): number {
  const profile = resolveRetrievalProfile(retrievalClass, options);
  return sanitizeProfileWeight(profile.channelWeights[source] ?? profile.channelWeights['*']);
}

function applyRetrievalProfileToRankedLists(
  lists: RankedList[],
  retrievalClass: RetrievalClass | undefined,
  options: {
    enabled?: boolean;
    profiles?: Partial<Record<RetrievalClass, RetrievalProfile>>;
  } = {},
): RankedList[] {
  const profile = resolveRetrievalProfile(retrievalClass, options);
  if (profile === IDENTITY_RETRIEVAL_PROFILE) return lists;

  const profiled = lists.map((list) => {
    const multiplier = sanitizeProfileWeight(profile.channelWeights[list.source] ?? profile.channelWeights['*']);
    if (multiplier === 1) return list;

    const baseWeight = sanitizeProfileWeight(list.weight);
    return {
      ...list,
      weight: baseWeight * multiplier,
    };
  });
  const hasActiveList = profiled.some((list) =>
    list.results.length > 0 && sanitizeProfileWeight(list.weight) > 0
  );
  return hasActiveList ? profiled : lists;
}

export {
  DEFAULT_RETRIEVAL_PROFILES,
  applyRetrievalProfileToRankedLists,
  getRetrievalProfileChannelWeight,
  isRetrievalProfileWeightsEnabled,
  resolveRetrievalProfile,
};

export type {
  RetrievalProfile,
};
