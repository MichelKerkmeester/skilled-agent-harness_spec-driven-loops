import { deepEqual } from './deep-equal';

function assertDeepEqual(a: unknown, b: unknown, expected: boolean) {
  const result = deepEqual(a, b);
  if (result !== expected) {
    throw new Error(`deepEqual(${JSON.stringify(a)}, ${JSON.stringify(b)}) = ${result}, expected ${expected}`);
  }
}

function assertThrows(fn: () => void) {
  try {
    fn();
  } catch {
    return;
  }
  throw new Error('Expected function to throw');
}

const tests: Array<[unknown, unknown, boolean]> = [
  [{ a: 1 }, { a: 1 }, true],
  [{ a: 1, b: undefined }, { a: 1 }, true],
  [{ a: 1 }, { a: 1, b: undefined }, true],
  [{ a: 1, b: undefined }, { a: 1, b: undefined }, true],
  [{ a: 1, b: 2 }, { a: 1, b: 3 }, false],
  [{ a: { b: 1 } }, { a: { b: 1 } }, true],
  [{ a: { b: 1 } }, { a: { b: 2 } }, false],
  [[1, 2, 3], [1, 2, 3], true],
  [[1, 2, 3], [1, 2, 4], false],
  [[1, [2, 3]], [1, [2, 3]], true],
  [NaN, NaN, true],
  [new Date(0), new Date(0), true],
  [new Date(0), new Date(1), false],
];

tests.forEach(([a, b, expected]) => assertDeepEqual(a, b, expected));

const circularA: Record<string, unknown> = { a: 1 };
circularA.self = circularA;
const circularB: Record<string, unknown> = { a: 1 };
circularB.self = circularB;
assertDeepEqual(circularA, circularB, true);

assertDeepEqual({ a: 1 }, { a: 2 }, false);
assertDeepEqual(null, null, true);
assertDeepEqual(undefined, undefined, true);
assertDeepEqual(null, undefined, false);
assertDeepEqual(1, 1, true);
assertDeepEqual('a', 'a', true);
assertDeepEqual('a', 'b', false);

console.log('All tests passed');
