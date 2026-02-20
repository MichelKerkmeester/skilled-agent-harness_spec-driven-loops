// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { getSubgraphWeights } from '../lib/search/graph-search-fn';

// ---------------------------------------------------------------
// TESTS: Intent-based subgraph weight routing
// ---------------------------------------------------------------

describe('getSubgraphWeights', () => {
  // ----------------------------------------------------------------
  // 1. find_decision → causal-heavy
  // ----------------------------------------------------------------
  it('returns causalWeight 0.8 and sgqsWeight 0.2 for find_decision', () => {
    const weights = getSubgraphWeights('find_decision');
    expect(weights.causalWeight).toBe(0.8);
    expect(weights.sgqsWeight).toBe(0.2);
  });

  // ----------------------------------------------------------------
  // 2. understand_cause → causal-heavy
  // ----------------------------------------------------------------
  it('returns causalWeight 0.8 and sgqsWeight 0.2 for understand_cause', () => {
    const weights = getSubgraphWeights('understand_cause');
    expect(weights.causalWeight).toBe(0.8);
    expect(weights.sgqsWeight).toBe(0.2);
  });

  // ----------------------------------------------------------------
  // 3. find_spec → sgqs-heavy
  // ----------------------------------------------------------------
  it('returns causalWeight 0.2 and sgqsWeight 0.8 for find_spec', () => {
    const weights = getSubgraphWeights('find_spec');
    expect(weights.causalWeight).toBe(0.2);
    expect(weights.sgqsWeight).toBe(0.8);
  });

  // ----------------------------------------------------------------
  // 4. find_procedure → sgqs-heavy
  // ----------------------------------------------------------------
  it('returns causalWeight 0.2 and sgqsWeight 0.8 for find_procedure', () => {
    const weights = getSubgraphWeights('find_procedure');
    expect(weights.causalWeight).toBe(0.2);
    expect(weights.sgqsWeight).toBe(0.8);
  });

  // ----------------------------------------------------------------
  // 5. undefined intent → balanced
  // ----------------------------------------------------------------
  it('returns balanced 0.5/0.5 when intent is undefined', () => {
    const weights = getSubgraphWeights(undefined);
    expect(weights.causalWeight).toBe(0.5);
    expect(weights.sgqsWeight).toBe(0.5);
  });

  // ----------------------------------------------------------------
  // 6. Unknown intent string → balanced
  // ----------------------------------------------------------------
  it('returns balanced 0.5/0.5 for an unknown intent string', () => {
    const weights = getSubgraphWeights('some_unknown_intent');
    expect(weights.causalWeight).toBe(0.5);
    expect(weights.sgqsWeight).toBe(0.5);
  });
});
