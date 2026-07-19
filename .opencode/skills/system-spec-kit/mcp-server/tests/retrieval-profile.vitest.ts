import { afterEach, describe, expect, it } from 'vitest';
import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
import { fuseResultsMulti, SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';

import {
  applyRetrievalProfileToRankedLists,
  isRetrievalProfileWeightsEnabled,
} from '../lib/search/retrieval-profile';

const savedRetrievalProfileWeights = process.env.SPECKIT_RETRIEVAL_PROFILE_WEIGHTS;
const savedScoreNormalization = process.env.SPECKIT_SCORE_NORMALIZATION;
const savedCalibratedOverlap = process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS;

afterEach(() => {
  if (savedRetrievalProfileWeights === undefined) {
    delete process.env.SPECKIT_RETRIEVAL_PROFILE_WEIGHTS;
  } else {
    process.env.SPECKIT_RETRIEVAL_PROFILE_WEIGHTS = savedRetrievalProfileWeights;
  }

  if (savedScoreNormalization === undefined) {
    delete process.env.SPECKIT_SCORE_NORMALIZATION;
  } else {
    process.env.SPECKIT_SCORE_NORMALIZATION = savedScoreNormalization;
  }

  if (savedCalibratedOverlap === undefined) {
    delete process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS;
  } else {
    process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS = savedCalibratedOverlap;
  }
});

describe('MCP retrieval profile weights', () => {
  it('keeps ranked lists byte-equivalent when profile weights are off', () => {
    delete process.env.SPECKIT_RETRIEVAL_PROFILE_WEIGHTS;
    expect(isRetrievalProfileWeightsEnabled()).toBe(false);

    const lists: RankedList[] = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared' }], weight: 1 },
      { source: SOURCE_TYPES.GRAPH, results: [{ id: 'graph-only' }], weight: 0.5 },
    ];

    const profiled = applyRetrievalProfileToRankedLists(lists, 'Quote');
    expect(profiled).toBe(lists);
    expect(fuseResultsMulti(profiled)).toEqual(fuseResultsMulti(lists));
  });

  it('honors zero channel weights under the active overlap denominator', () => {
    process.env.SPECKIT_RETRIEVAL_PROFILE_WEIGHTS = 'true';
    process.env.SPECKIT_SCORE_NORMALIZATION = 'false';
    process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS = 'false';

    const baseLists: RankedList[] = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared' }], weight: 1 },
      { source: SOURCE_TYPES.BM25, results: [{ id: 'shared' }], weight: 1 },
    ];
    const withGraph: RankedList[] = [
      ...baseLists,
      { source: SOURCE_TYPES.GRAPH, results: [{ id: 'graph-only' }], weight: 1 },
    ];

    const profiled = applyRetrievalProfileToRankedLists(withGraph, 'SingleHop', {
      enabled: true,
      profiles: {
        SingleHop: {
          channelWeights: { graph: 0 },
        },
      },
    });

    expect(profiled.find((list) => list.source === SOURCE_TYPES.GRAPH)?.weight).toBe(0);
    expect(fuseResultsMulti(profiled, { bonusOverChannels: 'active' })).toEqual(
      fuseResultsMulti(baseLists, { bonusOverChannels: 'active' }),
    );
  });

  it('fails closed when a profile would zero every active list', () => {
    process.env.SPECKIT_RETRIEVAL_PROFILE_WEIGHTS = 'true';

    const lists: RankedList[] = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'v' }], weight: 1 },
      { source: SOURCE_TYPES.BM25, results: [{ id: 'b' }], weight: 1 },
    ];

    const profiled = applyRetrievalProfileToRankedLists(lists, 'SingleHop', {
      enabled: true,
      profiles: {
        SingleHop: {
          channelWeights: {
            '*': 0,
          },
        },
      },
    });

    expect(profiled).toBe(lists);
  });
});
