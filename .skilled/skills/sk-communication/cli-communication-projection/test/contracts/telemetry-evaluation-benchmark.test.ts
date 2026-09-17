// ───────────────────────────────────────────────────────────────────
// MODULE: Telemetry, Evaluation, and Benchmark Tests
// ───────────────────────────────────────────────────────────────────

import { arch, cpus, platform, release, totalmem } from 'node:os';
import { performance } from 'node:perf_hooks';

import { describe, expect, it } from 'vitest';

import {
  createExactOriginalRecord,
  validateBenchmarkRecord,
  validateEvaluationManifest,
  validateExactOriginal,
  validateTelemetryEvent,
} from '../../src/index.js';
import { readFixture } from './fixture-loader.js';

import type {
  BenchmarkRecord,
  EvaluationManifest,
  FixtureProvenance,
  TelemetryEvent,
} from '../../src/index.js';
import type { FixtureCase } from './fixture-loader.js';

interface EvidenceFixture {
  readonly fixtureSetVersion: string;
  readonly description: string;
  readonly telemetryCases: readonly FixtureCase<TelemetryEvent>[];
  readonly benchmarkPolicy: {
    readonly schemaVersion: string;
    readonly scenario: string;
    readonly provisionalP95BudgetMs: number;
    readonly warmupRuns: number;
    readonly measuredRuns: number;
    readonly percentileMethod: 'nearest-rank';
    readonly measurementSource: 'generated-during-test';
  };
}

interface EvaluationFixture {
  readonly fixtureSetVersion: string;
  readonly description: string;
  readonly case: FixtureCase<EvaluationManifest>;
  readonly blindOrderManifest: {
    readonly manifestId: string;
    readonly manifestVersion: string;
    readonly assignmentDisclosure: string;
    readonly pairOrder: readonly {
      readonly pairId: string;
      readonly caseId: string;
      readonly labels: readonly string[];
    }[];
  };
}

const evidence = readFixture<EvidenceFixture>('evidence-cases.json');
const evaluation = readFixture<EvaluationFixture>('reference-evaluation.json');

describe('content-free telemetry', () => {
  it('accepts only the closed telemetry shape with a rotating keyed digest', () => {
    for (const fixture of evidence.telemetryCases) {
      expect(validateTelemetryEvent(fixture.record).success, fixture.fixtureId).toBe(true);
      expect(fixture.record.correlationDigest).toMatch(/^hmac-sha256:[a-f0-9]{64}$/);
      expect(fixture.record.keyRotationId).not.toBeNull();
    }
  });

  it('rejects raw content fields and unkeyed digests', () => {
    const base = evidence.telemetryCases[0];
    expect(base).toBeDefined();
    if (base === undefined) {
      return;
    }
    const withRawContent = {
      ...base.record,
      rawText: 'synthetic content that must never enter telemetry',
    };
    const rawResult = validateTelemetryEvent(withRawContent);
    expect(rawResult.success).toBe(false);
    expect(!rawResult.success && rawResult.issues.some((issue) => issue.code === 'unknown_key'))
      .toBe(true);

    const withUnkeyedDigest = {
      ...base.record,
      correlationDigest: `sha256:${'a'.repeat(64)}`,
    };
    const digestResult = validateTelemetryEvent(withUnkeyedDigest);
    expect(digestResult.success).toBe(false);
    expect(!digestResult.success && digestResult.originalInput).toBe(withUnkeyedDigest);

    const withFreeFormReason = {
      ...base.record,
      reasonCode: 'user-provided text must not be logged',
    };
    expect(validateTelemetryEvent(withFreeFormReason).success).toBe(false);

    const withUnsafeIdentifier = {
      ...base.record,
      providerId: 'provider identifier containing raw text',
    };
    expect(validateTelemetryEvent(withUnsafeIdentifier).success).toBe(false);
  });
});

describe('blinded parity evaluation', () => {
  it('validates a pre-candidate manifest without inventing variance measurements', () => {
    const manifest = evaluation.case.record;
    expect(validateEvaluationManifest(manifest).success).toBe(true);
    expect(manifest.reviewerCount).toBe(3);
    expect(manifest.baselineVarianceInputs).toHaveLength(4);
    expect(
      manifest.baselineVarianceInputs.every(
        (input) => input.status === 'pending'
          && input.referenceToReference === null
          && input.humanToHuman === null,
      ),
    ).toBe(true);
    expect(manifest.marginStatus).toBe('provisional-zero-tolerance');
    expect(Object.values(manifest.nonInferiorityMargins).every((margin) => margin === 0))
      .toBe(true);
    expect(manifest.inconclusivePolicy).toBe('block-release');
    expect(evaluation.blindOrderManifest.assignmentDisclosure)
      .toBe('withheld-until-scoring-complete');
  });

  it('rejects fabricated pending measurements and non-zero provisional margins', () => {
    const manifest = evaluation.case.record;
    const fabricated = {
      ...manifest,
      baselineVarianceInputs: manifest.baselineVarianceInputs.map((input, index) =>
        index === 0 ? { ...input, referenceToReference: 0.2 } : input,
      ),
    };
    expect(validateEvaluationManifest(fabricated).success).toBe(false);

    const permissive = {
      ...manifest,
      nonInferiorityMargins: {
        ...manifest.nonInferiorityMargins,
        directness: 0.25,
      },
    };
    expect(validateEvaluationManifest(permissive).success).toBe(false);

    const derivedWithoutMeasurements = {
      ...manifest,
      marginStatus: 'baseline-derived',
    };
    expect(validateEvaluationManifest(derivedWithoutMeasurements).success).toBe(false);
  });
});

describe('schema-validation benchmark', () => {
  it('measures a one-mebibyte record under the provisional warm p95 budget', () => {
    const policy = evidence.benchmarkPolicy;
    const provenance: FixtureProvenance = {
      sourceFamily: 'benchmark-generator',
      sourceVersion: '1.0.0',
      captureMethod: 'synthetic',
      sanitizationStatus: 'synthetic',
      capturedAt: '2026-08-11T12:00:00.000Z',
    };
    const original = createExactOriginalRecord(
      'benchmark-one-mebibyte',
      new Uint8Array(1024 * 1024).fill(97),
      'application/octet-stream',
      provenance,
    );

    for (let index = 0; index < policy.warmupRuns; index += 1) {
      expect(validateExactOriginal(original).success).toBe(true);
    }

    const samples: number[] = [];
    for (let index = 0; index < policy.measuredRuns; index += 1) {
      const startedAt = performance.now();
      const result = validateExactOriginal(original);
      samples.push(performance.now() - startedAt);
      expect(result.success).toBe(true);
    }
    const p50 = nearestRank(samples, 0.5);
    const p95 = nearestRank(samples, 0.95);
    const machineCpus = cpus();
    const benchmark: BenchmarkRecord = {
      contractKind: 'benchmark',
      schemaVersion: '1.0.0',
      benchmarkId: 'one-mebibyte-exact-original-warm',
      scenario: policy.scenario,
      environment: {
        platform: platform(),
        release: release(),
        architecture: arch(),
        cpu: machineCpus[0]?.model ?? 'unknown',
        logicalCpuCount: machineCpus.length,
        totalMemoryBytes: totalmem(),
        nodeVersion: process.version,
        powerMode: 'unknown',
      },
      mode: 'warm',
      warmupRuns: policy.warmupRuns,
      measuredRuns: policy.measuredRuns,
      sampleUnit: 'milliseconds',
      p50,
      p95,
      recordedAt: new Date().toISOString(),
    };

    expect(validateBenchmarkRecord(benchmark).success).toBe(true);
    expect(p95).toBeLessThan(policy.provisionalP95BudgetMs);
    console.info('schema-validation-benchmark', JSON.stringify(benchmark));
  });
});

function nearestRank(samples: readonly number[], percentile: number): number {
  const ordered = [...samples].sort((left, right) => left - right);
  const index = Math.max(0, Math.ceil(percentile * ordered.length) - 1);
  const value = ordered[index];
  if (value === undefined) {
    throw new Error('Cannot calculate a percentile from an empty sample.');
  }
  return value;
}
