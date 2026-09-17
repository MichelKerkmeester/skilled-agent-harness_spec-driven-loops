// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Capability Matrix Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  ClaudeCapabilityRecords,
  CodexCapabilityRecords,
  CursorCapabilityRecords,
  DevinCapabilityRecords,
  OpenCodeCapabilityRecords,
  PiCapabilityRecords,
  RuntimeCapabilityMatrix,
  createRuntimeCapabilityMatrix,
  resolveRuntimeCapability,
} from '../../src/runtimes/index.js';
import { createCapabilityRecord } from './helpers.js';

import type { RuntimeCapabilityRecord } from '../../src/runtimes/index.js';

const RUNTIMES = ['claude', 'codex', 'cursor', 'devin', 'opencode', 'pi'] as const;
const TIERS = ['full-projection', 'safe-native'] as const;
const DEGRADATIONS = ['append', 'sidecar', 'original-only'] as const;

describe('runtime capability matrix', () => {
  it('derives all eight declared paths across the six runtime families', () => {
    const sourceRecords = [
      ...ClaudeCapabilityRecords,
      ...CodexCapabilityRecords,
      ...PiCapabilityRecords,
      ...OpenCodeCapabilityRecords,
      ...DevinCapabilityRecords,
      ...CursorCapabilityRecords,
    ];

    expect(RuntimeCapabilityMatrix).toHaveLength(8);
    expect(new Set(RuntimeCapabilityMatrix.map((entry) => entry.runtime)))
      .toEqual(new Set(RUNTIMES));
    expect(RuntimeCapabilityMatrix.map((entry) => `${entry.runtime}:${entry.pathId}`))
      .toEqual(sourceRecords.map((record) => `${record.runtime}:${record.pathId}`));
    expect(RuntimeCapabilityMatrix.filter((entry) =>
      entry.presentationTier === 'full-projection')).toHaveLength(6);
    expect(RuntimeCapabilityMatrix.filter((entry) =>
      entry.presentationTier === 'safe-native')).toHaveLength(2);
  });

  it('assigns one valid tier and degradation policy to every version-pinned row', () => {
    for (const entry of RuntimeCapabilityMatrix) {
      expect(TIERS).toContain(entry.presentationTier);
      expect(DEGRADATIONS).toContain(entry.degradationPolicy);
      expect(entry.allowedDegradationModes).toContain(entry.degradationPolicy);
      expect(entry.testedVersions.runtime).toMatch(/^\d+\.\d+\.\d+$/u);
      expect(entry.testedVersions.protocol).toMatch(/^\d+\.\d+\.\d+$/u);
      expect(Number.isNaN(Date.parse(entry.evidence.observedAt))).toBe(false);
      expect(entry.matrixVersion).toBe('runtime-capability-matrix/1.0.0');
      expect(Object.isFrozen(entry)).toBe(true);
    }
    expect(Object.isFrozen(RuntimeCapabilityMatrix)).toBe(true);
  });

  it('recomputes insufficient evidence to safe-native original-only', () => {
    const base = createCapabilityRecord();
    const untrusted: RuntimeCapabilityRecord = {
      ...base,
      evidence: {
        ...base.evidence,
        safePresentationBoundary: { state: 'unknown', confidence: 'unknown' },
        append: { state: 'yes', confidence: 'confirmed' },
        sidecar: { state: 'yes', confidence: 'confirmed' },
      },
      presentationTier: 'full-projection',
      allowedDegradationModes: ['append', 'sidecar', 'original-only'],
    };

    expect(createRuntimeCapabilityMatrix([untrusted])).toEqual([
      expect.objectContaining({
        presentationTier: 'safe-native',
        degradationPolicy: 'original-only',
        allowedDegradationModes: ['original-only'],
      }),
    ]);
  });

  it('does not grant full projection from unconfirmed ownership claims', () => {
    const base = createCapabilityRecord();
    const unconfirmed: RuntimeCapabilityRecord = {
      ...base,
      evidence: {
        ...base.evidence,
        completeMessage: { state: 'yes', confidence: 'unknown' },
      },
    };

    expect(createRuntimeCapabilityMatrix([unconfirmed])).toEqual([
      expect.objectContaining({
        presentationTier: 'safe-native',
        degradationPolicy: 'original-only',
      }),
    ]);
  });

  it('fails closed to original-only on incompatible runtime and protocol majors', () => {
    const entry = RuntimeCapabilityMatrix[0];
    if (entry === undefined) {
      throw new Error('Expected a populated runtime capability matrix.');
    }

    expect(resolveRuntimeCapability(
      entry,
      `${Number(entry.testedVersions.runtime.split('.')[0]) + 1}.0.0`,
      entry.testedVersions.protocol,
    )).toMatchObject({
      compatible: false,
      presentationTier: 'safe-native',
      degradationPolicy: 'original-only',
      reasonCode: 'incompatible-runtime-major',
    });
    expect(resolveRuntimeCapability(
      entry,
      entry.testedVersions.runtime,
      `${Number(entry.testedVersions.protocol.split('.')[0]) + 1}.0.0`,
    )).toMatchObject({
      compatible: false,
      presentationTier: 'safe-native',
      degradationPolicy: 'original-only',
      reasonCode: 'incompatible-protocol-major',
    });
  });
});
