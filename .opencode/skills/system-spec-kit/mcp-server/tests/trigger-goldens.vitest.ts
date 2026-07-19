import { describe, expect, it } from 'vitest';

import { matchSemanticTriggers } from '../lib/triggers/semantic-trigger-matcher';
import {
  buildTriggerCache,
  loadTriggerGoldens,
  syntheticVector,
  type GoldenVariant,
} from './trigger-golden-fixture';

interface VariantMetrics {
  correct: number;
  predicted: number;
  total: number;
}

function runVariant(variant: GoldenVariant): VariantMetrics {
  const fixture = loadTriggerGoldens();
  const cache = buildTriggerCache(fixture);
  const dimensions = fixture.metadata.vectorModel.dimensions;
  const metrics: VariantMetrics = { correct: 0, predicted: 0, total: fixture.cases.length };

  for (const golden of fixture.cases) {
    const matches = matchSemanticTriggers(
      syntheticVector(dimensions, golden.basis, variant),
      cache,
      fixture.options,
    );
    const expectedSource = golden.expectedMatchSource[variant];
    if (matches.length > 0) {
      metrics.predicted += 1;
    }
    if (expectedSource === null) {
      if (matches.length === 0) {
        metrics.correct += 1;
      }
      continue;
    }
    if (matches[0]?.memoryId === golden.memoryId && matches[0]?.source === expectedSource) {
      metrics.correct += 1;
    }
  }

  return metrics;
}

describe('trigger goldens fixture', () => {
  it('loads synthetic CJK and Latin goldens with explicit honesty metadata', () => {
    const fixture = loadTriggerGoldens();

    expect(fixture.metadata.honesty).toContain('SYNTHETIC');
    expect(fixture.metadata.honesty).toContain('not real embedding-model recall evidence');
    expect(fixture.cases).toHaveLength(40);
    expect(fixture.cases.some((golden) => golden.locale === 'latin')).toBe(true);
    expect(fixture.cases.some((golden) => golden.locale === 'cjk')).toBe(true);
  });

  it('computes precision, recall, and false positives on engineered vectors', () => {
    const exact = runVariant('exact');
    const paraphrase = runVariant('paraphrase');
    const distractor = runVariant('distractor');

    const exactPrecision = exact.correct / exact.predicted;
    const paraphraseRecall = paraphrase.correct / paraphrase.total;
    const distractorFalsePositiveRate = distractor.predicted / distractor.total;

    expect(exact.predicted).toBe(exact.total);
    expect(exactPrecision).toBe(1);
    expect(paraphraseRecall).toBe(1);
    expect(paraphraseRecall).toBeGreaterThanOrEqual(0.7);
    expect(distractorFalsePositiveRate).toBe(0);
  });

  it('exercises matcher dedup, max, and ambiguous-margin gates on the fixture cache', () => {
    const fixture = loadTriggerGoldens();
    const cache = buildTriggerCache(fixture);
    const dimensions = fixture.metadata.vectorModel.dimensions;
    const first = fixture.cases[0];
    const duplicateCache = [
      ...cache,
      {
        ...cache[0],
        phrase: 'save state alias',
        phraseHash: 'save-state-alias',
      },
    ];

    const deduped = matchSemanticTriggers(
      syntheticVector(dimensions, first.basis, 'exact'),
      duplicateCache,
      { ...fixture.options, margin: 0 },
    );
    const broadQuery = new Float32Array(dimensions);
    for (const golden of fixture.cases) {
      broadQuery[golden.basis] = 1 / Math.sqrt(fixture.cases.length);
    }
    const capped = matchSemanticTriggers(broadQuery, cache, { threshold: 0.1, margin: 0, max: 5 });
    const ambiguous = matchSemanticTriggers(
      syntheticVector(dimensions, first.basis, 'exact'),
      [cache[0], { ...cache[1], embedding: cache[0].embedding }],
      { threshold: 0.84, margin: 0.04, max: 10 },
    );

    expect(deduped).toHaveLength(1);
    expect(deduped[0].matchedPhrases).toEqual(['save context', 'save state alias']);
    expect(capped).toHaveLength(5);
    expect(ambiguous).toEqual([]);
  });
});
