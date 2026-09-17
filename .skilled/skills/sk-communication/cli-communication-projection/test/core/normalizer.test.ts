// ───────────────────────────────────────────────────────────────────
// MODULE: Core Normalizer Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  normalizeEvent,
  normalizeEventSequence,
} from '../../src/index.js';
import { readFixture } from '../contracts/fixture-loader.js';

import type { RuntimeFixtureCase } from '../../src/index.js';

interface RuntimeMatrix {
  readonly fixtureSetVersion: string;
  readonly description: string;
  readonly cases: readonly RuntimeFixtureCase[];
}

const matrix = readFixture<RuntimeMatrix>('runtime-matrix.json');

describe('runtime-neutral normalization', () => {
  it('replays all thirty runtime fixtures deterministically without mutation', () => {
    const events = matrix.cases.map((fixture) => fixture.event);
    const before = JSON.stringify(events);
    const first = normalizeEventSequence(events);
    const second = normalizeEventSequence(structuredClone(events));

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    if (!first.success || !second.success) {
      return;
    }
    expect(first.value.events).toHaveLength(30);
    expect(first.value.digest).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(first.value.digest).toBe(second.value.digest);
    expect(JSON.stringify(events)).toBe(before);
    expect(Object.isFrozen(first.value)).toBe(true);
    expect(Object.isFrozen(first.value.events)).toBe(true);
    for (const event of first.value.events) {
      expect(Object.isFrozen(event)).toBe(true);
      expect(Object.isFrozen(event.order)).toBe(true);
      expect(Object.isFrozen(event.payload)).toBe(true);
      expect(Object.isFrozen(event.extensions)).toBe(true);
    }
  });

  it('keeps source, arrival, and assembly coordinates independent', () => {
    const base = matrix.cases[0]?.event;
    expect(base).toBeDefined();
    if (base === undefined) {
      return;
    }
    const event = {
      ...base,
      order: {
        sourceSequence: 9,
        arrivalIndex: 2,
        assemblyIndex: null,
      },
    };
    const result = normalizeEvent(event);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.order).toEqual(event.order);
      expect(result.value.order).not.toBe(event.order);
    }
  });

  it('returns a typed failure with the untouched rejected input', () => {
    const invalid = { contractKind: 'event', payload: { text: 'canary' } };
    const result = normalizeEventSequence([invalid]);

    expect(result.success).toBe(false);
    expect(!result.success && result.originalInput).toEqual([invalid]);
    expect(!result.success && result.issues[0]?.path.startsWith('$[0]')).toBe(true);
  });
});
