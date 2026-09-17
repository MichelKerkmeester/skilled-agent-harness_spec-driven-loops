// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Routing Performance Test
// ───────────────────────────────────────────────────────────────────

import os from 'node:os';

import { describe, expect, it } from 'vitest';

import { validateBenchmarkRecord } from '../../src/index.js';
import { selectPrivacyRoute } from '../../src/privacy/index.js';
import { NOW, createProviderMatrix } from './helpers.js';

const WARMUP_RUNS = 5;
const MEASURED_RUNS = 30;

describe('provider routing performance', () => {
  it('keeps privacy classification and routing below the provisional p95 budget', () => {
    const records = createProviderMatrix();
    const input = {
      records,
      candidateProviderIds: records.map((record) => record.provider.providerId),
      policy: {
        allowedPrivacyClasses: [
          'hosted-retained',
          'hosted-zdr',
          'local-networked',
          'local-offline',
        ] as const,
        egressConsent: true,
        requiredKnownFacts: [] as const,
      },
      now: NOW,
    };
    for (let index = 0; index < WARMUP_RUNS; index += 1) {
      expect(selectPrivacyRoute(input).status).toBe('approved');
    }

    const samples: number[] = [];
    for (let index = 0; index < MEASURED_RUNS; index += 1) {
      const startedAt = performance.now();
      expect(selectPrivacyRoute(input).status).toBe('approved');
      samples.push(performance.now() - startedAt);
    }
    const sorted = [...samples].sort((left, right) => left - right);
    const p50 = percentile(sorted, 0.50);
    const p95 = percentile(sorted, 0.95);
    const cpu = os.cpus()[0];
    const benchmark = {
      contractKind: 'benchmark',
      schemaVersion: '1.0.0',
      benchmarkId: 'provider-routing-privacy-first',
      scenario: 'privacy classification, eligibility, and deterministic ranking',
      environment: {
        platform: process.platform,
        release: os.release(),
        architecture: process.arch,
        cpu: cpu?.model ?? 'unknown',
        logicalCpuCount: os.cpus().length,
        totalMemoryBytes: os.totalmem(),
        nodeVersion: process.version,
        powerMode: 'test-runner-unspecified',
      },
      mode: 'warm',
      warmupRuns: WARMUP_RUNS,
      measuredRuns: MEASURED_RUNS,
      sampleUnit: 'milliseconds',
      p50,
      p95,
      recordedAt: NOW,
    } as const;

    expect(validateBenchmarkRecord(benchmark).success).toBe(true);
    expect(p95).toBeLessThan(20);
  });
});

function percentile(sorted: readonly number[], quantile: number): number {
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * quantile) - 1);
  return sorted[index] ?? 0;
}
