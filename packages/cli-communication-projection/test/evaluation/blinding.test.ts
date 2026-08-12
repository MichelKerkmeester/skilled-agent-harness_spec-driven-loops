// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Blinding Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  buildMaskedReviewPacket,
  verifyMaskedReviewPacket,
} from '../../src/evaluation/index.js';

const comparison = {
  comparisonId: 'comparison-secret-canary',
  stratumId: 'stratum-secret-canary',
  providerId: 'provider-secret-canary',
  modelId: 'model-secret-canary',
  promptProfileId: 'prompt-secret-canary',
  runtimeId: 'codex',
  presentationTier: 'full-projection',
  candidateArtifactId: 'candidate-secret-canary',
  referenceArtifactId: 'reference-secret-canary',
} as const;

describe('masked review packets', () => {
  it('hides every identity while retaining a reproducible trusted order record', () => {
    const first = buildMaskedReviewPacket(comparison, 'seed-17');
    const second = buildMaskedReviewPacket(comparison, 'seed-17');
    const serializedPacket = JSON.stringify(first.packet);

    expect(first).toEqual(second);
    expect(first.orderRecord.order).toHaveLength(2);
    expect(first.orderRecord.randomizationSeed).toBe('seed-17');
    expect(verifyMaskedReviewPacket(first.packet, comparison)).toBe(true);
    for (const hiddenValue of Object.values(comparison)) {
      expect(serializedPacket).not.toContain(hiddenValue);
    }
    for (const hiddenField of [
      'providerId',
      'modelId',
      'promptProfileId',
      'runtimeId',
      'candidate',
      'presentationTier',
      'comparisonId',
      'stratumId',
    ]) {
      expect(serializedPacket).not.toContain(hiddenField);
    }
  });

  it('rejects a packet with any extra identity-bearing field', () => {
    const result = buildMaskedReviewPacket(comparison, 'seed-17');
    const leaked = {
      ...result.packet,
      providerId: comparison.providerId,
    };

    expect(verifyMaskedReviewPacket(leaked, comparison)).toBe(false);
  });
});
