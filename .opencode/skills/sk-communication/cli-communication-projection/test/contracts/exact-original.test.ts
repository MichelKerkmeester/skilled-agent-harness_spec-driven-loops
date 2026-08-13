// ───────────────────────────────────────────────────────────────────
// MODULE: Exact Original Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  ContractErrorCodes,
  ContractValidationError,
  assertValidContract,
  createExactOriginalRecord,
  decodeExactOriginal,
  validateExactOriginal,
  verifyExactOriginal,
} from '../../src/index.js';
import { readFixture } from './fixture-loader.js';

import type {
  ContractFixtureCase,
  ExactOriginalRecord,
  FixtureProvenance,
} from '../../src/index.js';

interface ExactOriginalSet {
  readonly fixtureSetVersion: string;
  readonly description: string;
  readonly cases: readonly ContractFixtureCase<ExactOriginalRecord>[];
}

const fixtureSet = readFixture<ExactOriginalSet>('exact-originals.json');
const provenance: FixtureProvenance = {
  sourceFamily: 'contract-test',
  sourceVersion: '1.0.0',
  captureMethod: 'synthetic',
  sanitizationStatus: 'synthetic',
  capturedAt: '2026-08-11T12:00:00.000Z',
};

describe('exact-original records', () => {
  it('reproduces all source and reference bytes without normalization', () => {
    expect(fixtureSet.cases).toHaveLength(38);
    for (const fixture of fixtureSet.cases) {
      const record = fixture.record;
      expect(fixture.schemaVersion).toBe('1.0.0');
      expect(fixture.captureMethod).toBe('synthetic');
      expect(fixture.sanitizationStatus).toBe('synthetic');
      expect(fixture.expectedResult).toBe('byte-identical');
      const result = validateExactOriginal(record);
      expect(result.success, record.originalId).toBe(true);
      expect(verifyExactOriginal(record), record.originalId).toBe(true);
      expect(Buffer.from(decodeExactOriginal(record)).toString('base64'))
        .toBe(record.bytesBase64);
    }
  });

  it('round-trips a multi-megabyte binary-looking tool result', () => {
    const bytes = new Uint8Array(2 * 1024 * 1024);
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = index % 256;
    }
    const record = createExactOriginalRecord(
      'binary-looking-tool-result',
      bytes,
      'application/octet-stream',
      provenance,
    );

    expect(validateExactOriginal(record).success).toBe(true);
    expect(decodeExactOriginal(record)).toEqual(bytes);
    expect(Object.isFrozen(record)).toBe(true);
    expect(Object.isFrozen(record.provenance)).toBe(true);
  });

  it('rejects digest corruption while retaining the rejected object', () => {
    const base = fixtureSet.cases[0]?.record;
    expect(base).toBeDefined();
    if (base === undefined) {
      return;
    }
    const corrupted = {
      ...base,
      sha256: `sha256:${'0'.repeat(64)}`,
    };
    const result = validateExactOriginal(corrupted);
    expect(result.success).toBe(false);
    expect(!result.success && result.originalInput).toBe(corrupted);
    expect(!result.success && result.issues.some((issue) => issue.code === 'exact_bytes'))
      .toBe(true);
  });

  it('fails closed on an unsupported major schema', () => {
    const base = fixtureSet.cases[0]?.record;
    expect(base).toBeDefined();
    if (base === undefined) {
      return;
    }
    const unsupported = { ...base, schemaVersion: '2.0.0' };
    const result = validateExactOriginal(unsupported);
    expect(result.success).toBe(false);
    expect(!result.success && result.originalInput).toBe(unsupported);
    expect(
      !result.success && result.issues.some((issue) => issue.code === 'unsupported_major'),
    ).toBe(true);

    try {
      assertValidContract(unsupported);
      throw new Error('Expected an unsupported-schema error.');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ContractValidationError);
      if (error instanceof ContractValidationError) {
        expect(error.code).toBe(ContractErrorCodes.UNSUPPORTED_SCHEMA_MAJOR);
        expect(error.originalInput).toBe(unsupported);
      }
    }
  });

  it('preserves additive same-major fields and the original object reference', () => {
    const base = fixtureSet.cases[0]?.record;
    expect(base).toBeDefined();
    if (base === undefined) {
      return;
    }
    const additive = {
      ...base,
      schemaVersion: '1.1.0',
      futureMetadata: { mode: 'preserve-me' },
    };
    const result = validateExactOriginal(additive);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.value).toBe(additive);
    const roundTrip = JSON.parse(JSON.stringify(result.value)) as Record<string, unknown>;
    expect(roundTrip.futureMetadata).toEqual({ mode: 'preserve-me' });
  });
});
