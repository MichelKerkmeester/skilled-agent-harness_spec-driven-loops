import { describe, expect, it } from 'vitest';
import {
  classifyIntent,
  INTENT_STABILITY_CORPUS,
} from '../lib/search/intent-classifier';

describe('intent classifier formal stability corpus', () => {
  it('classifies at least 80% of the 20-paraphrase corpus to golden intents', () => {
    expect(INTENT_STABILITY_CORPUS).toHaveLength(20);

    const results = INTENT_STABILITY_CORPUS.map((fixture) => {
      const classification = classifyIntent(fixture.query);
      return {
        ...fixture,
        actualIntent: classification.intent,
        confidence: classification.confidence,
      };
    });

    const correct = results.filter((result) => result.actualIntent === result.expectedIntent);
    const accuracy = correct.length / results.length;

    expect(accuracy).toBeGreaterThanOrEqual(0.8);
  });
});
