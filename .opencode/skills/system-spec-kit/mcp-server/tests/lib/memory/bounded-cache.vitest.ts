// ───────────────────────────────────────────────────────────────
// TEST: Bounded Memory Cache
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { BoundedMap, TtlMap } from '../../../lib/memory/bounded-cache.js';

describe('BoundedMap', () => {
  it('evicts the least recently used entry when max size is exceeded', () => {
    const cache = new BoundedMap<string, number>(2);
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.get('a')).toBe(1);
    cache.set('c', 3);

    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(false);
    expect(cache.has('c')).toBe(true);
  });

  it('keeps size bounded during repeated sets', () => {
    const cache = new BoundedMap<number, number>(10);
    for (let index = 0; index < 1_000; index += 1) {
      cache.set(index, index);
    }

    expect(cache.size).toBe(10);
    expect([...cache.keys()]).toEqual([990, 991, 992, 993, 994, 995, 996, 997, 998, 999]);
  });

  it('evicts an undefined oldest key without exceeding max size', () => {
    const cache = new BoundedMap<string | undefined, number>(2);
    cache.set(undefined, 1);
    cache.set('b', 2);
    cache.set('c', 3);

    expect(cache.size).toBe(2);
    expect(cache.has(undefined)).toBe(false);
    expect([...cache.keys()]).toEqual(['b', 'c']);
  });
});

describe('TtlMap', () => {
  it('expires entries lazily on get and size reads', () => {
    let now = 1_000;
    const cache = new TtlMap<string, number>(10, () => now);
    cache.set('fresh', 1, 100);

    expect(cache.get('fresh')).toBe(1);
    now = 1_101;
    expect(cache.get('fresh')).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it('reports stored undefined values as present until expiry', () => {
    let now = 1_000;
    const cache = new TtlMap<string, number | undefined>(10, () => now);
    cache.set('present', undefined, 100);

    expect(cache.get('present')).toBeUndefined();
    expect(cache.has('present')).toBe(true);

    now = 1_101;
    expect(cache.has('present')).toBe(false);
  });
});
