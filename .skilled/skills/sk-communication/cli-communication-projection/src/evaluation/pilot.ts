// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Variance Pilot
// ───────────────────────────────────────────────────────────────────

import type {
  EvaluationCase,
  PilotCandidateProducer,
  PilotCandidateScorer,
  PilotSample,
  PilotStratum,
  PilotVarianceEstimate,
} from './types.js';

/** Complete injected boundary for a content-free pilot result. */
export interface RunVariancePilotInput {
  readonly corpus: readonly EvaluationCase[];
  readonly strata: readonly PilotStratum[];
  readonly samplesPerStratum?: number;
  readonly produceCandidate: PilotCandidateProducer;
  readonly scoreCandidate: PilotCandidateScorer;
}

const MINIMUM_SAMPLES_PER_STRATUM = 3;

/** Estimate sample variance without retaining any produced candidate text. */
export async function runVariancePilot(
  input: RunVariancePilotInput,
): Promise<readonly PilotVarianceEstimate[]> {
  const samplesPerStratum = input.samplesPerStratum ?? MINIMUM_SAMPLES_PER_STRATUM;
  validateInput(input, samplesPerStratum);
  const corpus = [...input.corpus].sort((left, right) => compareText(left.id, right.id));
  const strata = input.strata.map(normalizeStratum).sort(compareStrata);
  const estimates: PilotVarianceEstimate[] = [];

  for (const stratum of strata) {
    const samples: PilotSample[] = [];
    for (let sampleIndex = 0; sampleIndex < samplesPerStratum; sampleIndex += 1) {
      const evaluationCase = corpus[sampleIndex % corpus.length];
      if (evaluationCase === undefined) {
        throw new Error('Pilot corpus must contain at least one case.');
      }
      const coordinates = { ...stratum, evaluationCase, sampleIndex };
      const candidate = await input.produceCandidate(coordinates);
      if (typeof candidate !== 'string') {
        throw new TypeError('Pilot candidate producer must return a string.');
      }
      const score = await input.scoreCandidate({ ...coordinates, candidate });
      if (!Number.isFinite(score)) {
        throw new RangeError('Pilot scorer must return a finite number.');
      }
      samples.push(Object.freeze({
        ...stratum,
        caseId: evaluationCase.id,
        sampleIndex,
        score: normalizeZero(score),
      }));
    }

    const mean = calculateMean(samples);
    estimates.push(Object.freeze({
      estimateVersion: 'pilot-variance/1.0.0',
      purpose: 'variance-planning-only',
      ...stratum,
      sampleCount: samples.length,
      mean,
      variance: calculateSampleVariance(samples, mean),
      samples: Object.freeze(samples),
    }));
  }
  return Object.freeze(estimates);
}

function calculateMean(samples: readonly PilotSample[]): number {
  const total = samples.reduce((sum, sample) => sum + sample.score, 0);
  return normalizeZero(total / samples.length);
}

function calculateSampleVariance(
  samples: readonly PilotSample[],
  mean: number,
): number {
  const squaredDifferences = samples.reduce((sum, sample) => {
    const difference = sample.score - mean;
    return sum + difference * difference;
  }, 0);
  return normalizeZero(squaredDifferences / (samples.length - 1));
}

function compareStrata(left: PilotStratum, right: PilotStratum): number {
  return compareText(stratumKey(left), stratumKey(right));
}

function stratumKey(stratum: PilotStratum): string {
  return JSON.stringify([
    stratum.providerId,
    stratum.modelId,
    stratum.promptProfileId,
  ]);
}

function validateInput(
  input: RunVariancePilotInput,
  samplesPerStratum: number,
): void {
  if (input.corpus.length === 0) {
    throw new RangeError('Pilot corpus must contain at least one case.');
  }
  if (input.strata.length === 0) {
    throw new RangeError('Pilot must contain at least one stratum.');
  }
  if (
    !Number.isInteger(samplesPerStratum)
    || samplesPerStratum < MINIMUM_SAMPLES_PER_STRATUM
  ) {
    throw new RangeError('Pilot requires at least three samples per stratum.');
  }
  const keys = new Set<string>();
  for (const stratum of input.strata) {
    const values = [stratum.providerId, stratum.modelId, stratum.promptProfileId];
    const key = stratumKey(stratum);
    if (values.some((value) => value.length === 0) || keys.has(key)) {
      throw new TypeError('Pilot strata must have unique non-empty identifiers.');
    }
    keys.add(key);
  }
}

function normalizeZero(value: number): number {
  return Object.is(value, -0) ? 0 : value;
}

function normalizeStratum(stratum: PilotStratum): PilotStratum {
  return Object.freeze({
    providerId: stratum.providerId,
    modelId: stratum.modelId,
    promptProfileId: stratum.promptProfileId,
  });
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
