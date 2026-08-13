// ───────────────────────────────────────────────────────────────────
// MODULE: Fixture Metadata Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFixture } from './fixture-loader.js';

import type {
  BoundedContextRecord,
  ContractFixtureCase,
  ContractRecord,
  EvaluationManifest,
  ExactOriginalRecord,
  FixtureCaseMetadata,
  PromptProfileRecord,
  ProviderRecord,
  RuntimeFixtureCase,
  TelemetryEvent,
} from '../../src/index.js';
import type { FixtureSet } from './fixture-loader.js';

interface RuntimeMatrix {
  readonly cases: readonly RuntimeFixtureCase[];
}

interface ExactOriginalSet {
  readonly cases: readonly ContractFixtureCase<ExactOriginalRecord>[];
}

interface EvaluationSet {
  readonly case: ContractFixtureCase<EvaluationManifest>;
}

interface EvidenceSet {
  readonly telemetryCases: readonly ContractFixtureCase<TelemetryEvent>[];
}

describe('fixture provenance', () => {
  it('declares version, source, sanitization, and expected behavior for every case', () => {
    const runtime = readFixture<RuntimeMatrix>('runtime-matrix.json');
    const originals = readFixture<ExactOriginalSet>('exact-originals.json');
    const contexts = readFixture<
      FixtureSet<ContractFixtureCase<BoundedContextRecord>>
    >('context-cases.json');
    const prompts = readFixture<
      FixtureSet<ContractFixtureCase<PromptProfileRecord>>
    >('prompt-profiles.json');
    const providers = readFixture<
      FixtureSet<ContractFixtureCase<ProviderRecord>>
    >('provider-cases.json');
    const outcomes = readFixture<
      FixtureSet<ContractFixtureCase<ContractRecord>>
    >('outcome-cases.json');
    const evaluation = readFixture<EvaluationSet>('reference-evaluation.json');
    const evidence = readFixture<EvidenceSet>('evidence-cases.json');
    const cases: readonly FixtureCaseMetadata[] = [
      ...runtime.cases,
      ...originals.cases,
      ...contexts.cases,
      ...prompts.cases,
      ...providers.cases,
      ...outcomes.cases,
      evaluation.case,
      ...evidence.telemetryCases,
    ];

    expect(cases.length).toBeGreaterThan(80);
    for (const fixture of cases) {
      expect(fixture.fixtureId).not.toBe('');
      expect(fixture.schemaVersion).toMatch(/^\d+\.\d+\.\d+$/);
      expect(fixture.sourceFamily).not.toBe('');
      expect(fixture.sourceVersion).not.toBe('');
      expect(fixture.captureMethod).toBe('synthetic');
      expect(fixture.sanitizationStatus).toBe('synthetic');
      expect(fixture.expectedResult).not.toBe('');
    }
  });
});
