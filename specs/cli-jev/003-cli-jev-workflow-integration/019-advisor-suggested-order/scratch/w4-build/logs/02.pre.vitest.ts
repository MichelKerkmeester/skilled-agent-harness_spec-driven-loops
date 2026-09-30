// ───────────────────────────────────────────────────────────────
// MODULE: Suggested Cluster Order Eval Tests
// ───────────────────────────────────────────────────────────────
// Offline checks with synthetic rows, stub binaries and stub children. No model call.

import { describe, expect, it } from 'vitest';

import {
  nearestRank,
  rotations,
  optionArgs,
  readProbabilities,
  topKey,
  orderFromMaps,
} from '../../scripts/routing-accuracy/score-suggested-order.mjs';

describe('score-suggested-order pure helpers', () => {
  it('nearestRank takes the nearest-rank quantile and leaves its input in place', () => {
    const values = [5, 1, 3];
    expect(nearestRank(values, 0.5)).toBe(3);
    expect(values).toEqual([5, 1, 3]);
    expect(nearestRank([], 0.95)).toBeNull();
    expect(nearestRank(Array.from({ length: 20 }, (_, index) => index + 1), 0.95)).toBe(19);
  });

  it('rotations returns the three left rotations of the keys', () => {
    expect(rotations(['a', 'b', 'none'])).toEqual([
      ['a', 'b', 'none'],
      ['b', 'none', 'a'],
      ['none', 'a', 'b'],
    ]);
  });

  it('optionArgs labels each key and disambiguates equal descriptions', () => {
    const texts: Record<string, string> = { a: 'same', b: 'same', c: 'other' };
    expect(optionArgs(['a', 'b', 'c', 'none'], (key: string) => texts[key], ['a', 'b', 'c'])).toEqual([
      '-o',
      'a=same [a]',
      '-o',
      'b=same [b]',
      '-o',
      'c=other',
      '-o',
      'none=None of these skills fits the request',
    ]);
  });

  it('readProbabilities returns the raw map and a full-coverage copy', () => {
    const stdout = JSON.stringify({ answers: { answer: { choice: 'a', probabilities: { a: 0.6, b: 0.3, none: 0.1 } } } });
    const { raw, full } = readProbabilities(stdout, ['a', 'b', 'none']);
    expect(full).toEqual({ a: 0.6, b: 0.3, none: 0.1 });
    expect(raw).toEqual({ a: 0.6, b: 0.3, none: 0.1 });
    expect(full).not.toBe(raw);
  });

  it('readProbabilities nulls the full map on a missing key or a non-number', () => {
    const withoutNone = JSON.stringify({ answers: { answer: { probabilities: { a: 0.6, b: 0.4 } } } });
    const missing = readProbabilities(withoutNone, ['a', 'b', 'none']);
    expect(missing.full).toBeNull();
    expect(missing.raw).toEqual({ a: 0.6, b: 0.4 });
    expect(readProbabilities('oops', ['a', 'b', 'none'])).toEqual({ raw: null, full: null });
    const stringValue = JSON.stringify({ answers: { answer: { probabilities: { a: '0.6', b: 0.4, none: 0 } } } });
    expect(readProbabilities(stringValue, ['a', 'b', 'none']).full).toBeNull();
  });

  it('topKey returns the first key with the highest value', () => {
    expect(topKey({ a: 0.2, b: 0.5, none: 0.3 }, ['a', 'b', 'none'])).toBe('b');
    expect(topKey({ a: 0.4, b: 0.4, none: 0.2 }, ['a', 'b', 'none'])).toBe('a');
  });

  it('orderFromMaps sorts the cluster by mean probability across the passes', () => {
    const row = { order: ['a', 'x', 'b', 'c'], cluster: ['a', 'b', 'c'] };
    const maps = [
      { a: 0.1, b: 0.6, c: 0.2, none: 0.1 },
      { a: 0.1, b: 0.5, c: 0.3, none: 0.1 },
      { a: 0.2, b: 0.4, c: 0.3, none: 0.1 },
    ];
    expect(orderFromMaps(row, maps)).toEqual({ order: ['b', 'x', 'c', 'a'], abstained: false });
  });

  it('orderFromMaps keeps the cluster order when the means tie', () => {
    const row = { order: ['a', 'b'], cluster: ['a', 'b'] };
    const maps = [
      { a: 0.4, b: 0.4, none: 0.2 },
      { a: 0.4, b: 0.4, none: 0.2 },
      { a: 0.4, b: 0.4, none: 0.2 },
    ];
    expect(orderFromMaps(row, maps)).toEqual({ order: ['a', 'b'], abstained: false });
  });

  it('orderFromMaps abstains when none leads every cluster key', () => {
    const row = { order: ['a', 'b'], cluster: ['a', 'b'] };
    const maps = [
      { a: 0.2, b: 0.3, none: 0.5 },
      { a: 0.2, b: 0.3, none: 0.5 },
      { a: 0.2, b: 0.3, none: 0.5 },
    ];
    expect(orderFromMaps(row, maps)).toEqual({ order: ['a', 'b'], abstained: true });
  });
});
