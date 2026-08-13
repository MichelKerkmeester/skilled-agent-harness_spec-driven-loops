// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Variance Pilot Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  loadEvaluationCorpus,
  runVariancePilot,
} from '../../src/evaluation/index.js';

import type {
  PilotCandidateProducer,
  PilotCandidateScorer,
  PilotStratum,
} from '../../src/evaluation/index.js';

const strata: readonly PilotStratum[] = [
  {
    providerId: 'provider-z',
    modelId: 'model-z',
    promptProfileId: 'profile-b',
  },
  {
    providerId: 'provider-a',
    modelId: 'model-a',
    promptProfileId: 'profile-a',
  },
];

describe('three-sample variance pilot', () => {
  it('produces at least three deterministic samples per sorted stratum', async () => {
    const producer = vi.fn<PilotCandidateProducer>((input) =>
      `RAW_CANDIDATE_CANARY_${input.evaluationCase.id}_${input.sampleIndex}`);
    const scorer: PilotCandidateScorer = ({ candidate, sampleIndex }) => {
      expect(candidate).toContain('RAW_CANDIDATE_CANARY_');
      return sampleIndex + 1;
    };
    const input = {
      corpus: loadEvaluationCorpus().cases,
      strata,
      samplesPerStratum: 3,
      produceCandidate: producer,
      scoreCandidate: scorer,
    } as const;

    const first = await runVariancePilot(input);
    const second = await runVariancePilot(input);

    expect(first).toEqual(second);
    expect(first.map((estimate) => estimate.providerId)).toEqual([
      'provider-a',
      'provider-z',
    ]);
    expect(first.every((estimate) => estimate.sampleCount >= 3)).toBe(true);
    expect(first.every((estimate) => estimate.mean === 2)).toBe(true);
    expect(first.every((estimate) => estimate.variance === 1)).toBe(true);
    expect(first.every((estimate) => estimate.purpose === 'variance-planning-only')).toBe(true);
    expect(producer).toHaveBeenCalledTimes(12);
  });

  it('keeps candidate and protected content out of every sample and estimate', async () => {
    const estimates = await runVariancePilot({
      corpus: loadEvaluationCorpus().cases,
      strata: [strata[0] as PilotStratum],
      produceCandidate: () => 'RAW_CANDIDATE_CANARY_c88e',
      scoreCandidate: () => 4,
    });
    const serialized = JSON.stringify(estimates);

    expect(serialized).not.toContain('RAW_CANDIDATE_CANARY_c88e');
    expect(serialized).not.toContain('candidate');
    expect(serialized).not.toContain('expectedProtectedSpans');
    expect(serialized).not.toContain('bytesBase64');
    expect(Object.keys(estimates[0]?.samples[0] ?? {}).sort()).toEqual([
      'caseId',
      'modelId',
      'promptProfileId',
      'providerId',
      'sampleIndex',
      'score',
    ]);
  });

  it('rejects a pilot that could be mistaken for a sub-three-sample estimate', async () => {
    await expect(runVariancePilot({
      corpus: loadEvaluationCorpus().cases,
      strata: [strata[0] as PilotStratum],
      samplesPerStratum: 2,
      produceCandidate: () => 'synthetic-candidate',
      scoreCandidate: () => 1,
    })).rejects.toThrow('at least three samples per stratum');
  });
});

