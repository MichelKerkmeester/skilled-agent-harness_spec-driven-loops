import { describe, test, expect } from 'vitest';
import { deepEqual } from './deep-equal';

describe('deepEqual — 12 acceptance cases', () => {
  test('1. primitive equal', () => expect(deepEqual(1, 1)).toBe(true));
  test('2. primitive different', () => expect(deepEqual(1, 2)).toBe(false));
  test('3. nested object equal', () => expect(deepEqual({a: {b: 1}}, {a: {b: 1}})).toBe(true));
  test('4. array equal', () => expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true));
  test('5. NaN === NaN per protocol', () => expect(deepEqual(NaN, NaN)).toBe(true));
  test('6. Date equal', () => expect(deepEqual(new Date(0), new Date(0))).toBe(true));
  test('7. Date unequal', () => expect(deepEqual(new Date(0), new Date(1))).toBe(false));
  test('8. circular reference no stack overflow', () => {
    const a: any = {x: 1}; a.self = a;
    const b: any = {x: 1}; b.self = b;
    expect(() => deepEqual(a, b)).not.toThrow();
    expect(deepEqual(a, b)).toBe(true);
  });
  test('9. undefined keys treated equal', () => {
    expect(deepEqual({a: 1}, {a: 1, b: undefined})).toBe(true);
  });
  test('10. different types', () => expect(deepEqual('1', 1)).toBe(false));
  test('11. null vs undefined', () => expect(deepEqual(null, undefined)).toBe(false));
  test('12. nested NaN in array', () => expect(deepEqual([1, NaN, 3], [1, NaN, 3])).toBe(true));
});
