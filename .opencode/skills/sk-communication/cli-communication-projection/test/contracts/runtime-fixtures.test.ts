// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Fixture Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  RuntimeFixtureClasses,
  RuntimeIds,
  validateEventEnvelope,
  validateEventStream,
} from '../../src/index.js';
import { readFixture } from './fixture-loader.js';

import type {
  ContractFixtureCase,
  ExactOriginalRecord,
  RuntimeFixtureCase,
} from '../../src/index.js';

interface RuntimeMatrix {
  readonly fixtureSetVersion: string;
  readonly description: string;
  readonly cases: readonly RuntimeFixtureCase[];
}

interface ExactOriginalSet {
  readonly fixtureSetVersion: string;
  readonly description: string;
  readonly cases: readonly ContractFixtureCase<ExactOriginalRecord>[];
}

const matrix = readFixture<RuntimeMatrix>('runtime-matrix.json');
const originals = readFixture<ExactOriginalSet>('exact-originals.json');

describe('six-runtime fixture matrix', () => {
  it('contains every runtime and behavior-class combination exactly once', () => {
    const combinations = new Set(
      matrix.cases.map((fixture) => `${fixture.runtime}:${fixture.fixtureClass}`),
    );
    const expected = Object.values(RuntimeIds).flatMap((runtime) =>
      Object.values(RuntimeFixtureClasses).map((fixtureClass) =>
        `${runtime}:${fixtureClass}`,
      ),
    );

    expect(matrix.fixtureSetVersion).toBe('1.0.0');
    expect(matrix.cases).toHaveLength(30);
    expect(combinations).toEqual(new Set(expected));
  });

  it('validates every event and links it to an immutable original', () => {
    const originalsById = new Map(
      originals.cases.map((fixture) => [fixture.record.originalId, fixture.record]),
    );

    for (const fixture of matrix.cases) {
      const result = validateEventEnvelope(fixture.event);
      expect(result.success, fixture.fixtureId).toBe(true);
      expect(result.success && result.value).toBe(fixture.event);
      expect(fixture.schemaVersion).toBe('1.0.0');
      expect(fixture.captureMethod).toBe('synthetic');
      expect(fixture.sanitizationStatus).toBe('synthetic');
      expect(originalsById.has(fixture.exactOriginalId)).toBe(true);
      expect(fixture.event.canonicalPayloadRef).toBe(fixture.exactOriginalId);
    }
  });

  it('accepts a metadata-only extension event and preserves its namespace', () => {
    const fixture = matrix.cases.find(
      (candidate) => candidate.runtime === 'claude'
        && candidate.fixtureClass === 'extension',
    );
    expect(fixture).toBeDefined();
    if (fixture === undefined) {
      return;
    }

    expect(fixture.event.payload).toEqual({});
    expect(validateEventEnvelope(fixture.event).success).toBe(true);
    expect(fixture.expectedResult).toBe('preserve-extension');
    expect(Object.keys(fixture.event.extensions)).toEqual(['claude.fixture']);
  });

  it('rejects an extension without a stable dotted namespace', () => {
    const base = matrix.cases[0];
    expect(base).toBeDefined();
    if (base === undefined) {
      return;
    }
    const invalid = {
      ...base.event,
      extensions: { unnamespaced: true },
    };
    const result = validateEventEnvelope(invalid);
    expect(result.success).toBe(false);
    expect(!result.success && result.originalInput).toBe(invalid);
    expect(!result.success && result.issues.some((issue) => issue.code === 'namespace'))
      .toBe(true);
  });

  it('rejects duplicate source coordinates and streams without a final event', () => {
    const normal = matrix.cases.find(
      (candidate) => candidate.runtime === 'codex'
        && candidate.fixtureClass === 'normal',
    );
    const streaming = matrix.cases.find(
      (candidate) => candidate.runtime === 'codex'
        && candidate.fixtureClass === 'streaming',
    );
    expect(normal).toBeDefined();
    expect(streaming).toBeDefined();
    if (normal === undefined || streaming === undefined) {
      return;
    }

    const duplicate = {
      ...normal.event,
      eventId: 'event-codex-normal-duplicate',
      order: { ...normal.event.order, arrivalIndex: 1 },
    };
    const duplicateResult = validateEventStream([normal.event, duplicate]);
    expect(duplicateResult.success).toBe(false);
    expect(
      !duplicateResult.success
        && duplicateResult.issues.some((issue) => issue.code === 'duplicate_sequence'),
    ).toBe(true);

    const incompleteResult = validateEventStream([streaming.event]);
    expect(incompleteResult.success).toBe(false);
    expect(
      !incompleteResult.success
        && incompleteResult.issues.some((issue) => issue.code === 'missing_terminal'),
    ).toBe(true);
  });

  it('rejects inconsistent terminal states and mixed runtime turns', () => {
    const claude = matrix.cases.find(
      (candidate) => candidate.runtime === 'claude'
        && candidate.fixtureClass === 'normal',
    );
    const codex = matrix.cases.find(
      (candidate) => candidate.runtime === 'codex'
        && candidate.fixtureClass === 'normal',
    );
    expect(claude).toBeDefined();
    expect(codex).toBeDefined();
    if (claude === undefined || codex === undefined) {
      return;
    }

    const inconsistent = {
      ...claude.event,
      terminalStatus: 'none',
    };
    const terminalResult = validateEventEnvelope(inconsistent);
    expect(terminalResult.success).toBe(false);
    expect(
      !terminalResult.success
        && terminalResult.issues.some((issue) => issue.code === 'terminal_state'),
    ).toBe(true);

    const mixedResult = validateEventStream([claude.event, codex.event]);
    expect(mixedResult.success).toBe(false);
    expect(
      !mixedResult.success
        && mixedResult.issues.some((issue) => issue.code === 'stream_identity'),
    ).toBe(true);
  });
});
