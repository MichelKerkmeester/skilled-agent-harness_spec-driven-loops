// ───────────────────────────────────────────────────────────────────
// MODULE: Rotating Keyed Correlation Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  createRotatingCorrelationDigest,
  verifyCorrelationRotationUnlinkability,
} from '../../src/observability/index.js';

const coordinates = {
  runtime: 'codex',
  sessionId: 'session-1',
  turnId: 'turn-1',
  messageId: 'message-1',
  generationId: 'generation-1',
  attempt: 1,
} as const;

const rotation = {
  secretKey: 'deterministic-test-master-key',
  epochMs: 0,
  windowDurationMs: 60_000,
} as const;

describe('rotating keyed lifecycle correlation', () => {
  it('breaks linkability for identical coordinates after a key rotation', () => {
    const first = createRotatingCorrelationDigest(coordinates, {
      ...rotation,
      nowMs: 59_999,
    });
    const second = createRotatingCorrelationDigest(coordinates, {
      ...rotation,
      nowMs: 60_000,
    });

    expect(first.status).toBe('created');
    expect(second.status).toBe('created');
    if (first.status !== 'created' || second.status !== 'created') {
      return;
    }
    expect(first.keyRotationId).not.toBe(second.keyRotationId);
    expect(first.correlationDigest).not.toBe(second.correlationDigest);
    expect(verifyCorrelationRotationUnlinkability(first, second)).toEqual({
      unlinkable: true,
      reasonCode: 'rotation-and-digest-differ',
    });
  });

  it('is deterministic within a window and never encodes identifiers or keys', () => {
    const first = createRotatingCorrelationDigest(coordinates, {
      ...rotation,
      nowMs: 12_345,
    });
    const second = createRotatingCorrelationDigest(coordinates, {
      ...rotation,
      nowMs: 59_999,
    });

    expect(first).toEqual(second);
    expect(first.status).toBe('created');
    const serialized = JSON.stringify(first);
    for (const value of [
      coordinates.runtime,
      coordinates.sessionId,
      coordinates.turnId,
      coordinates.messageId,
      coordinates.generationId,
      rotation.secretKey,
    ]) {
      expect(serialized).not.toContain(String(value));
    }
  });

  it('treats a new secret at the same window index as a true rotation', () => {
    const first = createRotatingCorrelationDigest(coordinates, {
      ...rotation,
      nowMs: 12_345,
    });
    const second = createRotatingCorrelationDigest(coordinates, {
      ...rotation,
      secretKey: 'different-deterministic-master-key',
      nowMs: 12_345,
    });

    expect(first.status).toBe('created');
    expect(second.status).toBe('created');
    if (first.status !== 'created' || second.status !== 'created') {
      return;
    }
    expect(first.keyRotationId).not.toBe(second.keyRotationId);
    expect(verifyCorrelationRotationUnlinkability(first, second)).toEqual({
      unlinkable: true,
      reasonCode: 'rotation-and-digest-differ',
    });
  });

  it('rejects raw-content fields instead of hashing them', () => {
    const result = createRotatingCorrelationDigest({
      ...coordinates,
      prompt: 'RAW_PROMPT_CANARY',
      candidateText: 'RAW_CANDIDATE_CANARY',
      protectedSpans: ['RAW_PROTECTED_SPAN_CANARY'],
    }, {
      ...rotation,
      nowMs: 1,
    });

    expect(result).toEqual({
      status: 'rejected',
      reasonCode: 'invalid-correlation-input',
    });
    expect(JSON.stringify(result)).not.toContain('RAW_');
  });
});
