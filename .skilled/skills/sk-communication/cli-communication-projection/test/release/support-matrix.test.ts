// ───────────────────────────────────────────────────────────────────
// MODULE: Release Support Matrix Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createOpenCodeGoDeepSeekV4FlashRecord } from '../../src/providers/index.js';
import {
  SupportMatrix,
  assessOpenCodeGoHostedPrivacyFreshness,
  assessSupportMatrixFreshness,
  createSupportMatrix,
} from '../../src/release/index.js';

import type { SupportMatrixRecord } from '../../src/release/index.js';

const DIMENSIONS = [
  'runtime',
  'protocol',
  'provider',
  'model',
  'operating-system',
  'prompt-profile',
  'presentation-tier',
] as const;

describe('release support matrix', () => {
  it('dates at least one evidence-backed row for every support dimension', () => {
    expect(new Set(SupportMatrix.rows.map((row) => row.dimension)))
      .toEqual(new Set(DIMENSIONS));

    for (const row of SupportMatrix.rows) {
      expect(row.identifier.length).toBeGreaterThan(0);
      expect(row.evidenceRef.length).toBeGreaterThan(0);
      expect(row.testedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      expect(row.expiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      expect(['supported', 'provisional', 'unsupported']).toContain(row.releaseStatus);
    }
  });

  it('reports an expired row as stale and blocks release', () => {
    const row = SupportMatrix.rows[0];
    if (row === undefined) {
      throw new Error('Expected a populated support matrix.');
    }
    const expiredMatrix: SupportMatrixRecord = {
      version: SupportMatrix.version,
      rows: [{ ...row, expiryDate: '2026-08-12' }],
      contentFreeDigest: SupportMatrix.contentFreeDigest,
    };

    expect(assessSupportMatrixFreshness(expiredMatrix, '2026-08-13T00:00:00.000Z'))
      .toMatchObject({
        decision: 'block',
        status: 'stale',
        freshRows: [],
        staleRows: [{ row: expiredMatrix.rows[0], reasonCode: 'expired' }],
      });
  });

  it('allows release while every row remains fresh', () => {
    const result = assessSupportMatrixFreshness(
      SupportMatrix,
      '2026-08-12T00:00:00.000Z',
    );

    expect(result).toMatchObject({ decision: 'allow', status: 'fresh', staleRows: [] });
    expect(result.freshRows).toHaveLength(SupportMatrix.rows.length);
    expect(result.freshRows.every((entry) => entry.reasonCode === 'fresh')).toBe(true);
  });

  it('blocks support evidence observed in the future', () => {
    const row = SupportMatrix.rows[0];
    if (row === undefined) {
      throw new Error('Expected a populated support matrix.');
    }
    const futureMatrix: SupportMatrixRecord = {
      version: SupportMatrix.version,
      rows: [{
        ...row,
        testedDate: '2026-08-12T12:00:00.000Z',
        expiryDate: '2026-08-13T12:00:00.000Z',
      }],
      contentFreeDigest: SupportMatrix.contentFreeDigest,
    };

    expect(assessSupportMatrixFreshness(futureMatrix, '2026-08-12T11:59:59.999Z'))
      .toMatchObject({
        decision: 'block',
        staleRows: [{ row: futureMatrix.rows[0], reasonCode: 'tested-date-future' }],
      });
  });

  it('expires support evidence at its exact expiry instant', () => {
    const row = SupportMatrix.rows[0];
    if (row === undefined) {
      throw new Error('Expected a populated support matrix.');
    }
    const expiringMatrix: SupportMatrixRecord = {
      version: SupportMatrix.version,
      rows: [{
        ...row,
        testedDate: '2026-08-12T08:00:00.000Z',
        expiryDate: '2026-08-12T12:00:00.000Z',
      }],
      contentFreeDigest: SupportMatrix.contentFreeDigest,
    };

    expect(assessSupportMatrixFreshness(expiringMatrix, '2026-08-12T11:59:59.999Z'))
      .toMatchObject({ decision: 'allow' });
    expect(assessSupportMatrixFreshness(expiringMatrix, '2026-08-12T12:00:00.000Z'))
      .toMatchObject({ decision: 'block', reasonCodes: ['expired'] });
    expect(assessSupportMatrixFreshness(expiringMatrix, '2026-08-12T12:00:00.001Z'))
      .toMatchObject({ decision: 'block', reasonCodes: ['expired'] });
  });

  it('blocks OpenCode Go hosted routing after its privacy facts expire', () => {
    const record = createOpenCodeGoDeepSeekV4FlashRecord({
      credentialReference: 'managed:release-support-test',
    });
    const result = assessOpenCodeGoHostedPrivacyFreshness(
      record,
      '2026-09-01T00:00:00.000Z',
    );

    expect(result).toEqual({
      decision: 'block',
      reasonCode: 'privacy-fact-expired',
      factNames: ['retention', 'training-use'],
    });
  });

  it('blocks OpenCode Go privacy facts observed in the future', () => {
    const record = createOpenCodeGoDeepSeekV4FlashRecord({
      credentialReference: 'managed:release-support-test',
    });
    const futureRecord = structuredClone({
      ...record,
      privacyFacts: record.privacyFacts.map((fact) => ({
        ...fact,
        observedAt: '2026-08-12T12:00:00.000Z',
      })),
    });

    expect(assessOpenCodeGoHostedPrivacyFreshness(
      futureRecord,
      '2026-08-12T11:59:59.999Z',
    )).toEqual({
      decision: 'block',
      reasonCode: 'privacy-fact-future',
      factNames: ['retention', 'training-use'],
    });
  });

  it('expires OpenCode Go privacy facts at their exact expiry instant', () => {
    const record = createOpenCodeGoDeepSeekV4FlashRecord({
      credentialReference: 'managed:release-support-test',
    });
    const expiringRecord = structuredClone({
      ...record,
      privacyFacts: record.privacyFacts.map((fact) => ({
        ...fact,
        observedAt: '2026-08-12T08:00:00.000Z',
        expiresAt: '2026-08-12T12:00:00.000Z',
      })),
    });

    expect(assessOpenCodeGoHostedPrivacyFreshness(
      expiringRecord,
      '2026-08-12T11:59:59.999Z',
    )).toMatchObject({ decision: 'allow' });
    expect(assessOpenCodeGoHostedPrivacyFreshness(
      expiringRecord,
      '2026-08-12T12:00:00.000Z',
    )).toEqual({
      decision: 'block',
      reasonCode: 'privacy-fact-expired',
      factNames: ['retention', 'training-use'],
    });
  });

  it('stores neither secrets nor raw content in rows or the digest', () => {
    const serialized = JSON.stringify(SupportMatrix);

    expect(Object.keys(SupportMatrix).sort()).toEqual([
      'contentFreeDigest',
      'rows',
      'version',
    ]);
    expect(serialized).not.toContain('credentialReference');
    expect(serialized).not.toContain('systemInstruction');
    expect(serialized).not.toContain('candidateText');
    expect(serialized).not.toContain('bytesBase64');
    expect(serialized).not.toContain('rawContent');
    expect(serialized).not.toContain('release-support-test');
    expect(SupportMatrix.contentFreeDigest).toMatch(/^sha256:[a-f0-9]{64}$/u);
  });

  it('reproduces the digest from the same source records', () => {
    const first = createSupportMatrix();
    const second = createSupportMatrix();

    expect(first).toEqual(second);
    expect(first.contentFreeDigest).toBe(SupportMatrix.contentFreeDigest);
  });
});
