import { readFileSync } from 'node:fs';

import type { SemanticTriggerCacheEntry } from '../lib/triggers/semantic-trigger-matcher';

export type GoldenVariant = 'exact' | 'paraphrase' | 'distractor';

export interface TriggerGoldenCase {
  id: string;
  locale: 'latin' | 'cjk';
  memoryId: number;
  basis: number;
  triggerPhrase: string;
  variants: Record<GoldenVariant, string>;
  expectedMatchSource: Record<GoldenVariant, 'semantic-trigger-shadow' | null>;
}

export interface TriggerGoldensFixture {
  metadata: {
    description: string;
    honesty: string;
    vectorModel: {
      dimensions: number;
      exactCosine: number;
      paraphraseCosine: number;
      distractorCosine: number;
    };
  };
  options: {
    threshold: number;
    margin: number;
    max: number;
  };
  cases: TriggerGoldenCase[];
}

export function loadTriggerGoldens(): TriggerGoldensFixture {
  return JSON.parse(
    readFileSync(new URL('./fixtures/trigger-goldens.json', import.meta.url), 'utf8'),
  ) as TriggerGoldensFixture;
}

export function syntheticVector(
  dimensions: number,
  basis: number,
  variant: GoldenVariant | 'near-threshold',
): Float32Array {
  const vector = new Float32Array(dimensions);
  if (variant === 'distractor') {
    vector[dimensions - 1] = 1;
    return vector;
  }
  if (variant === 'paraphrase') {
    vector[basis] = 0.88;
    vector[dimensions - 2] = Math.sqrt(1 - (0.88 ** 2));
    return vector;
  }
  if (variant === 'near-threshold') {
    vector[basis] = 0.82;
    vector[dimensions - 2] = Math.sqrt(1 - (0.82 ** 2));
    return vector;
  }
  vector[basis] = 1;
  return vector;
}

export function buildTriggerCache(fixture: TriggerGoldensFixture): SemanticTriggerCacheEntry[] {
  const dimensions = fixture.metadata.vectorModel.dimensions;
  return fixture.cases.map((golden) => ({
    memoryId: golden.memoryId,
    specFolder: `trigger-goldens/${golden.locale}`,
    filePath: `/workspace/trigger-goldens/${golden.id}.md`,
    title: golden.id,
    importanceWeight: 0.5,
    phrase: golden.triggerPhrase,
    phraseHash: golden.id,
    embedding: syntheticVector(dimensions, golden.basis, 'exact'),
  }));
}
