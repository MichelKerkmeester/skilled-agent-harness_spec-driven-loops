import { describe, it, expect } from 'vitest';
import { getSubgraphWeights } from '../lib/search/graph-search-fn';

describe('getSubgraphWeights', () => {
  it('returns causal-only weights for decision intents', () => {
    expect(getSubgraphWeights('find_decision')).toEqual({ causalWeight: 1 });
    expect(getSubgraphWeights('understand_cause')).toEqual({ causalWeight: 1 });
  });

  it('returns causal-only weights for spec/procedure intents', () => {
    expect(getSubgraphWeights('find_spec')).toEqual({ causalWeight: 1 });
    expect(getSubgraphWeights('find_procedure')).toEqual({ causalWeight: 1 });
  });

  it('returns causal-only weights for unknown and undefined intents', () => {
    expect(getSubgraphWeights('explore')).toEqual({ causalWeight: 1 });
    expect(getSubgraphWeights(undefined)).toEqual({ causalWeight: 1 });
  });
});
