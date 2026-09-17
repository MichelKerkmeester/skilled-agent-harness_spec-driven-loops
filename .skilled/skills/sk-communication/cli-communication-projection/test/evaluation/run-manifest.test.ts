// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Run Manifest Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  createRunManifest,
  loadEvaluationCorpus,
} from '../../src/evaluation/index.js';

import type {
  CreateRunManifestInput,
  EvaluationCase,
} from '../../src/evaluation/index.js';

const runMetadata = {
  seed: 'portable-seed-17',
  runtime: {
    runtimeId: 'codex',
    runtimeVersion: '1.2.3',
    protocolVersion: '1.0.0',
    pathId: 'headless-json',
  },
  environment: {
    nodeVersion: 'v22.20.0',
    platform: 'linux',
    architecture: 'x64',
  },
} as const;

describe('reproducible evaluation run manifest', () => {
  it('is byte-reproducible for the same corpus, seed, runtime, and environment', () => {
    const corpus = loadEvaluationCorpus().cases;
    const input: CreateRunManifestInput = { corpus, ...runMetadata };

    const first = Buffer.from(JSON.stringify(createRunManifest(input)));
    const second = Buffer.from(JSON.stringify(createRunManifest(input)));

    expect(first.equals(second)).toBe(true);
    expect(JSON.parse(first.toString('utf8'))).toMatchObject({
      manifestVersion: 'evaluation-run/1.0.0',
      corpusVersion: 'evaluation-corpus/1.0.0',
      seed: 'portable-seed-17',
      environment: runMetadata.environment,
      runtime: runMetadata.runtime,
    });
  });

  it('changes the corpus and reproducibility digests when case metadata changes', () => {
    const corpus = loadEvaluationCorpus().cases;
    const firstCase = corpus[0];
    if (firstCase === undefined) {
      throw new Error('Expected a built-in corpus case.');
    }
    const changedCorpus: readonly EvaluationCase[] = [
      { ...firstCase, category: 'RAW_PROMPT_CANARY_9fd2' },
      ...corpus.slice(1),
    ];

    const original = createRunManifest({ corpus, ...runMetadata });
    const changed = createRunManifest({ corpus: changedCorpus, ...runMetadata });

    expect(changed.corpusDigest).not.toBe(original.corpusDigest);
    expect(changed.reproducibilityDigest).not.toBe(original.reproducibilityDigest);
    expect(JSON.stringify(changed)).not.toContain('RAW_PROMPT_CANARY_9fd2');
  });

  it('contains only content-free case identities and reproducibility metadata', () => {
    const manifest = createRunManifest({
      corpus: loadEvaluationCorpus().cases,
      ...runMetadata,
    });
    const serialized = JSON.stringify(manifest);

    expect(manifest.caseOrder).toHaveLength(5);
    expect(new Set(manifest.caseOrder).size).toBe(5);
    expect(serialized).not.toContain('expectedProtectedSpans');
    expect(serialized).not.toContain('bytesBase64');
    expect(serialized).not.toContain('prompt');
    expect(serialized).not.toContain('candidate');
    expect(serialized).not.toContain('credential');
  });
});

