// ───────────────────────────────────────────────────────────────
// MODULE: Query Classifier Tokenization Policy Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  calculateStopWordRatio,
  classifyQueryComplexity,
  extractTerms,
} from '../lib/search/query-classifier.js';
import { routeQuery } from '../lib/search/query-router.js';

describe('query classifier tokenization policy', () => {
  let originalComplexityFlag: string | undefined;
  let originalGraphPreservationFlag: string | undefined;

  beforeEach(() => {
    originalComplexityFlag = process.env.SPECKIT_COMPLEXITY_ROUTER;
    originalGraphPreservationFlag = process.env.SPECKIT_GRAPH_CHANNEL_PRESERVATION;
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
    process.env.SPECKIT_GRAPH_CHANNEL_PRESERVATION = 'false';
  });

  afterEach(() => {
    if (originalComplexityFlag === undefined) {
      delete process.env.SPECKIT_COMPLEXITY_ROUTER;
    } else {
      process.env.SPECKIT_COMPLEXITY_ROUTER = originalComplexityFlag;
    }
    if (originalGraphPreservationFlag === undefined) {
      delete process.env.SPECKIT_GRAPH_CHANNEL_PRESERVATION;
    } else {
      process.env.SPECKIT_GRAPH_CHANNEL_PRESERVATION = originalGraphPreservationFlag;
    }
  });

  it('normalizes punctuation without changing term boundaries or code identifiers', () => {
    expect(classifyQueryComplexity('').features.termCount).toBe(0);
    expect(classifyQueryComplexity('search').tier).toBe('simple');
    expect(classifyQueryComplexity('repair cache handler').tier).toBe('simple');
    expect(classifyQueryComplexity('repair cache handler safely').tier).toBe('moderate');

    const plain = classifyQueryComplexity('is bug');
    const punctuated = classifyQueryComplexity('“is,” bug');
    expect(punctuated.features.stopWordRatio).toBe(plain.features.stopWordRatio);
    expect(punctuated.tier).toBe(plain.tier);

    const identifierTerms = extractTerms('memory-index.ts');
    expect(identifierTerms).toEqual(['memory-index.ts']);
    expect(calculateStopWordRatio(identifierTerms)).toBe(0);
    expect(classifyQueryComplexity('memory-index.ts').features.termCount).toBe(1);
  });

  it('routes a CJK-dominant query by character count instead of whitespace', () => {
    const query = '请解释身份验证模块如何处理令牌刷新失败问题';
    const result = routeQuery(query);

    expect(result.classification.features.termCount).toBe(11);
    expect(result.tier).toBe('complex');
    expect(result.channels).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
  });
});
