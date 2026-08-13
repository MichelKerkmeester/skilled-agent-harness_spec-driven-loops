// ───────────────────────────────────────────────────────────────────
// MODULE: Release Rollback Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createExactOriginalRecord } from '../../src/contracts/index.js';
import { OriginalOnlyEmergencyMode, planRollback } from '../../src/release/index.js';

describe('release rollback coordination', () => {
  it('selects provider-free and network-free original-only emergency mode', () => {
    const plan = planRollback({
      previousPackageVersion: '0.0.9',
      canonicalTranscriptDigest: `sha256:${'1'.repeat(64)}`,
      trigger: 'release-gate-blocked',
    });

    expect(plan.emergencyMode).toEqual({
      mode: 'original-only',
      projectionEnabled: false,
      providerRequired: false,
      networkRequired: false,
    });
    expect(plan.emergencyMode).toBe(OriginalOnlyEmergencyMode);
    expect(plan.steps.map((step) => step.action)).toEqual([
      'disable-projection',
      'select-original-only',
      'restore-previous-package',
      'verify-canonical-transcript',
    ]);
    expect(plan.steps[2]).toMatchObject({
      action: 'restore-previous-package',
      packageVersion: '0.0.9',
    });
  });

  it('coordinates rollback without receiving or mutating canonical transcript content', () => {
    const transcript = createExactOriginalRecord(
      'rollback-original',
      new TextEncoder().encode('Canonical transcript must remain byte-identical.'),
      'text/plain; charset=utf-8',
      {
        sourceFamily: 'synthetic-rollback-test',
        sourceVersion: '1.0.0',
        captureMethod: 'synthetic',
        sanitizationStatus: 'synthetic',
        capturedAt: '2026-08-12T00:00:00.000Z',
      },
    );
    const before = structuredClone(transcript);
    const plan = planRollback({
      previousPackageVersion: '0.0.9',
      canonicalTranscriptDigest: transcript.sha256,
      trigger: 'provider-failure',
    });

    expect(transcript).toEqual(before);
    expect(plan.mutatesCanonicalTranscript).toBe(false);
    expect(plan.steps[3]).toEqual({
      order: 4,
      action: 'verify-canonical-transcript',
      expectedDigest: transcript.sha256,
      mutationAllowed: false,
    });
    expect(JSON.stringify(plan)).not.toContain(transcript.bytesBase64);
  });
});
