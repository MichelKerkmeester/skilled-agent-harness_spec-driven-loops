All 12 tests pass. Let me use sequential thinking to analyze the implementation and then present the work in the requested format.## Result: Implementation already satisfies both acceptance criteria.

```markdown
<pre-plan>
1. **Read existing source & test files** → Input: `src/deep-equal.ts`, `src/deep-equal.test.ts` → Output: 12 test cases defined, helper `eq()` + exported `deepEqual()` → Criterion: files exist and are parseable → `cat src/deep-equal.ts src/deep-equal.test.ts`
2. **Analyze acceptance coverage** → Input: 12 test cases → Output: mapped each case to code path (NaN line 4, Date lines 17–19, circular lines 12–14, undefined-key filter lines 40–41) → Criterion: every case has a deterministic path → manual trace
3. **Run test suite & export check** → Input: `npm test`, `grep export` → Output: 12/12 passed, export confirmed at line 53 → Criterion: [ac-001] + [ac-002] → `npm test && grep -n 'export function deepEqual' src/deep-equal.ts`
</pre-plan>

`src/deep-equal.ts`
```ts
function eq(x: unknown, y: unknown, seen: WeakMap<object, object>): boolean {
  if (x === y) return true;

  if (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)) return true;

  if (typeof x !== typeof y) return false;

  if (x === null || y === null) return x === y;

  if (typeof x !== 'object' || typeof y !== 'object') return false;

  if (seen.has(x as object)) {
    return seen.get(x as object) === (y as object);
  }
  seen.set(x as object, y as object);

  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }

  if (x instanceof Date !== y instanceof Date) return false;

  const isArrX = Array.isArray(x);
  const isArrY = Array.isArray(y);
  if (isArrX !== isArrY) return false;

  if (isArrX && isArrY) {
    const arrX = x as unknown[];
    const arrY = y as unknown[];
    if (arrX.length !== arrY.length) return false;
    for (let i = 0; i < arrX.length; i++) {
      if (!eq(arrX[i], arrY[i], seen)) return false;
    }
    return true;
  }

  const recordX = x as Record<string, unknown>;
  const recordY = y as Record<string, unknown>;

  const keysX = Object.keys(recordX).filter(k => recordX[k] !== undefined);
  const keysY = Object.keys(recordY).filter(k => recordY[k] !== undefined);

  if (keysX.length !== keysY.length) return false;

  for (const key of keysX) {
    if (!Object.prototype.hasOwnProperty.call(recordY, key)) return false;
    if (!eq(recordX[key], recordY[key], seen)) return false;
  }

  return true;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  return eq(a, b, new WeakMap<object, object>());
}
```

`src/deep-equal.test.ts`
```ts
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
```

## Verification
- `npm test` — 12 tests passed, 1 file passed (vitest run)
- `grep -n 'export function deepEqual' src/deep-equal.ts` — `53:export function deepEqual(a: unknown, b: unknown): boolean {`
```