import { describe, expect, it } from 'vitest';

import { canonicalFingerprint, canonicalizeInput, codeHash } from '../lib/storage/canonical-fingerprint';

describe('canonical fingerprint storage helper', () => {
  it('sorts object keys and normalizes line endings deterministically', () => {
    const left = {
      z: ['a\r\nb', { y: 2, x: 1 }],
      a: 'root',
    };
    const right = {
      a: 'root',
      z: ['a\nb', { x: 1, y: 2 }],
    };

    expect(canonicalizeInput(left)).toBe(canonicalizeInput(right));
    expect(canonicalFingerprint(left)).toBe(canonicalFingerprint(right));
  });

  it('changes code hashes when the relevant code surface changes', () => {
    const before = codeHash(['parse:v1', 'canonical:v1']);
    const after = codeHash(['parse:v2', 'canonical:v1']);

    expect(before).not.toBe(after);
    expect(before).toHaveLength(64);
  });

  it('handles non-JSON values uniformly across containers (array -> null, object key dropped)', () => {
    const fn = () => undefined;
    // Old behavior: a function as an array element threw while undefined became
    // null — the failure depended on the container. Now both coerce to null in
    // arrays and are dropped as object keys, mirroring JSON.stringify.
    expect(() => canonicalizeInput([fn, undefined, 1])).not.toThrow();
    expect(canonicalizeInput([fn, undefined, 1])).toBe(JSON.stringify([null, null, 1]));
    expect(canonicalizeInput({ a: fn, b: undefined, c: 1 })).toBe(JSON.stringify({ c: 1 }));
  });
});
