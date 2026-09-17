// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Corpus Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  EVALUATION_BASELINE_PLACEHOLDERS,
  EVALUATION_CORPUS_MANIFEST,
  EVALUATION_CORPUS_VERSION,
  loadEvaluationCorpus,
  verifyCorpusIntegrity,
} from '../../src/evaluation/index.js';

describe('secret-free evaluation corpus', () => {
  it('loads pinned synthetic cases with complete provenance and strata metadata', () => {
    const corpus = loadEvaluationCorpus();

    expect(corpus.manifest).toEqual(EVALUATION_CORPUS_MANIFEST);
    expect(corpus.manifest).toEqual({
      corpusVersion: 'evaluation-corpus/1.0.0',
      caseCount: 5,
      contentFreeDigest: 'sha256:24f5d2b2ac6efc61bb0998f6360d40eff8d331ce82b338c63cfeb6eef019a861',
    });
    expect(new Set(corpus.cases.map((entry) => entry.id)).size).toBe(corpus.cases.length);
    expect(new Set(corpus.cases.map((entry) => entry.category)).size).toBeGreaterThan(1);
    expect(new Set(corpus.cases.map((entry) => entry.privacyClass)).size).toBeGreaterThan(1);
    for (const evaluationCase of corpus.cases) {
      expect(evaluationCase.corpusVersion).toBe(EVALUATION_CORPUS_VERSION);
      expect(evaluationCase.provenance).toMatchObject({
        captureMethod: 'synthetic',
        sanitizationStatus: 'synthetic',
      });
      expect(evaluationCase.expectedProtectedSpans.length).toBeGreaterThan(0);
      expect(evaluationCase.expectedProtectedSpans.every((span) => span.count >= 1)).toBe(true);
      expect(Object.isFrozen(evaluationCase)).toBe(true);
    }
  });

  it('detects case metadata changes without exposing case content in the manifest', () => {
    const corpus = loadEvaluationCorpus();
    const first = corpus.cases[0];
    if (first === undefined) {
      throw new Error('Expected a built-in corpus case.');
    }
    const changed = [
      { ...first, category: 'changed-category' },
      ...corpus.cases.slice(1),
    ];

    expect(verifyCorpusIntegrity(changed, corpus.manifest)).toBe(false);
    expect(Object.keys(corpus.manifest).sort()).toEqual([
      'caseCount',
      'contentFreeDigest',
      'corpusVersion',
    ]);
  });

  it('provides only pending reference and original baseline structures', () => {
    expect(EVALUATION_BASELINE_PLACEHOLDERS).toHaveLength(8);
    expect(new Set(EVALUATION_BASELINE_PLACEHOLDERS.map((record) => record.comparison)))
      .toEqual(new Set(['reference-vs-reference', 'original-vs-reference']));
    for (const baseline of EVALUATION_BASELINE_PLACEHOLDERS) {
      expect(baseline).toMatchObject({
        status: 'pending',
        sampleCount: null,
        meanDifference: null,
        variance: null,
        frozenAt: null,
      });
    }
  });

  it('stores protected expectations as classifications rather than protected bytes', () => {
    const serialized = JSON.stringify(loadEvaluationCorpus());

    expect(serialized).not.toContain('bytesBase64');
    expect(serialized).not.toContain('charStart');
    expect(serialized).not.toContain('byteStart');
    expect(serialized).not.toContain('token');
    expect(serialized).not.toContain('credential');
    expect(serialized).not.toContain('rawPrompt');
    expect(serialized).not.toContain('candidateText');
  });
});

