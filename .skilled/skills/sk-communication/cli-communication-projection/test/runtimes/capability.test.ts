// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Capability Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { assessRuntimeCompatibility } from '../../src/runtimes/index.js';
import {
  TESTED_CLAUDE_VERSION,
  TESTED_PROTOCOL_VERSION,
  createCapabilityRecord,
} from './helpers.js';

describe('runtime capability mapping', () => {
  it('grants full projection only with complete-message and atomic-render ownership', () => {
    const record = createCapabilityRecord();

    expect(record.presentationTier).toBe('full-projection');
    expect(record.allowedDegradationModes).toEqual(['original-only']);
    expect(record.failClosedDefaults).toEqual({
      unknownCapability: 'original-only',
      incompatibleRuntimeMajor: 'original-only',
      incompatibleProtocolMajor: 'original-only',
    });
    expect(Object.isFrozen(record)).toBe(true);
  });

  it('maps constrained known boundaries to explicit safe-native degradations', () => {
    const record = createCapabilityRecord({
      atomicRenderDecision: { state: 'no', confidence: 'confirmed' },
      append: { state: 'yes', confidence: 'confirmed' },
      sidecar: { state: 'yes', confidence: 'confirmed' },
    });

    expect(record.presentationTier).toBe('safe-native');
    expect(record.allowedDegradationModes).toEqual([
      'append',
      'sidecar',
      'original-only',
    ]);
  });

  it('fails closed to original-only when the safe presentation boundary is unknown', () => {
    const record = createCapabilityRecord({
      safePresentationBoundary: { state: 'unknown', confidence: 'unknown' },
      append: { state: 'yes', confidence: 'confirmed' },
      sidecar: { state: 'yes', confidence: 'confirmed' },
    });

    expect(record.presentationTier).toBe('safe-native');
    expect(record.allowedDegradationModes).toEqual(['original-only']);
  });

  it('accepts same-major versions and rejects incompatible or malformed majors', () => {
    const record = createCapabilityRecord();
    expect(assessRuntimeCompatibility(
      record,
      TESTED_CLAUDE_VERSION,
      TESTED_PROTOCOL_VERSION,
    )).toEqual({ compatible: true, reasonCode: 'none' });
    expect(assessRuntimeCompatibility(record, '3.0.0', TESTED_PROTOCOL_VERSION))
      .toEqual({ compatible: false, reasonCode: 'incompatible-runtime-major' });
    expect(assessRuntimeCompatibility(record, TESTED_CLAUDE_VERSION, '2.0.0'))
      .toEqual({ compatible: false, reasonCode: 'incompatible-protocol-major' });
    expect(assessRuntimeCompatibility(record, 'current', TESTED_PROTOCOL_VERSION))
      .toEqual({ compatible: false, reasonCode: 'incompatible-runtime-major' });
  });
});
