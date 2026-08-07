Now I have a clear picture of the fixture. The seed contains `src/deep-equal.ts` (existing implementation) and `src/deep-equal.test.ts` (12 acceptance tests). I need to ensure the implementation passes all 12 deterministic test cases and the function is exported.

Let me carefully trace through the existing code against all 12 tests to verify correctness, then produce the deliverable in the requested format.

<pre-plan>
1. **Analyze acceptance criteria**: Read `src/deep-equal.test.ts` to identify all 12 test cases (primitives, nested objects, arrays, NaN, Date, circular refs, undefined keys, type mismatches, null vs undefined, nested NaN in array). Verify the current `src/deep-equal.ts` handles each case correctly — especially the circular reference WeakMap guard and the `Object.keys().filter(k => record[k] !== undefined)` pattern for undefined-key equivalence.
2. **Produce clean implementation**: Write a corrected/refined `src/deep-equal.ts` that exports `deepEqual(a: unknown, b: unknown): boolean`. Keep the proven recursive+WeakMap architecture for circular references, preserve the NaN protocol, Date `.getTime()` comparison, array length+element recursion, and the undefined-key filtering logic.
3. **Verify acceptance**: The verification command is `npm test` (runs `vitest run`). All 12 test cases must pass, and `grep -n 'export function deepEqual' src/deep-equal.ts` must match to satisfy the grep criterion.
</pre-plan>

`src/deep-equal.ts`
```ts
function eq(x: unknown, y: unknown, seen: WeakMap<object, object>): boolean {
  if (x === y) return true;

  if (
    typeof x === 'number' &&
    typeof y === 'number' &&
    isNaN(x) &&
    isNaN(y)
  ) {
    return true;
  }

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

  if ((x instanceof Date) !== (y instanceof Date)) return false;

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

  const keysX = Object.keys(recordX).filter((k) => recordX[k] !== undefined);
  const keysY = Object.keys(recordY).filter((k) => recordY[k] !== undefined);

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

## Verification
- `npm test` — runs `vitest run` against the 12 deterministic acceptance cases; all must pass.
- `grep -n 'export function deepEqual' src/deep-equal.ts` — confirms the required function is exported.
