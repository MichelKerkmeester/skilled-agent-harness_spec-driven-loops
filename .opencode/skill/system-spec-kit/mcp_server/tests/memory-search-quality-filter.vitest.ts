// ---------------------------------------------------------------
// TEST: Memory Search Quality Filter
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { __testables } from '../handlers/memory-search';

type Row = { id: string | number; quality_score?: number };

const {
  filterByMinQualityScore,
  resolveQualityThreshold,
  resolveArtifactRoutingQuery,
  applyArtifactRouting,
} = __testables;

describe('C136: minQualityScore and min_quality_score behavior', () => {
  it('prefers camelCase threshold when both values are provided', () => {
    expect(resolveQualityThreshold(0.8, 0.2)).toBe(0.8);
  });

  it('falls back to snake_case threshold when camelCase is missing', () => {
    expect(resolveQualityThreshold(undefined, 0.65)).toBe(0.65);
  });

  it('returns undefined for non-finite threshold values', () => {
    expect(resolveQualityThreshold(Number.NaN, 0.4)).toBe(0.4);
    expect(resolveQualityThreshold(Number.NaN, Number.NaN)).toBeUndefined();
  });

  it('filters out rows below threshold and keeps rows above threshold', () => {
    const rows: Row[] = [
      { id: 'a', quality_score: 0.2 },
      { id: 'b', quality_score: 0.5 },
      { id: 'c', quality_score: 0.9 },
    ];

    const filtered = filterByMinQualityScore(rows as any, 0.5);
    expect(filtered.map((r: Row) => r.id)).toEqual(['b', 'c']);
  });

  it('clamps threshold to [0, 1]', () => {
    const rows: Row[] = [
      { id: 'a', quality_score: 0.0 },
      { id: 'b', quality_score: 0.6 },
      { id: 'c', quality_score: 1.0 },
    ];

    const clampedLow = filterByMinQualityScore(rows as any, -1);
    const clampedHigh = filterByMinQualityScore(rows as any, 2);

    expect(clampedLow.map((r: Row) => r.id)).toEqual(['a', 'b', 'c']);
    expect(clampedHigh.map((r: Row) => r.id)).toEqual(['c']);
  });
});

describe('C136-09: artifact routing integration helpers', () => {
  it('prefers explicit query when building artifact routing input', () => {
    const routingQuery = resolveArtifactRoutingQuery('show checklist status', ['fallback', 'concepts']);
    expect(routingQuery).toBe('show checklist status');
  });

  it('falls back to joined concepts when query is missing', () => {
    const routingQuery = resolveArtifactRoutingQuery(null, ['phase', 'plan']);
    expect(routingQuery).toBe('phase plan');
  });

  it('does not apply boosts for unknown artifact class', () => {
    const rows = [{ id: 1, similarity: 80 }];
    const routed = applyArtifactRouting(rows as any, {
      detectedClass: 'unknown',
      confidence: 0,
      strategy: {
        artifactClass: 'unknown',
        semanticWeight: 0.5,
        keywordWeight: 0.5,
        recencyBias: 0.3,
        maxResults: 10,
        boostFactor: 1,
      },
    } as any);
    expect(routed).toEqual(rows);
  });

  it('applies boost metadata for known artifact class', () => {
    const rows = [{ id: 1, similarity: 80 }];
    const routed = applyArtifactRouting(rows as any, {
      detectedClass: 'memory',
      confidence: 0.8,
      strategy: {
        artifactClass: 'memory',
        semanticWeight: 0.8,
        keywordWeight: 0.2,
        recencyBias: 0.6,
        maxResults: 5,
        boostFactor: 1.1,
      },
    } as any);

    expect(routed[0].artifactBoostApplied).toBe(1.1);
    expect(routed[0].score).toBeCloseTo(0.88, 5);
  });
});
