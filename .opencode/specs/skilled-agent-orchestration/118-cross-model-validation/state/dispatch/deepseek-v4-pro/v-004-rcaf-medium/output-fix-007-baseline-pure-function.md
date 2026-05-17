The files already exist with the implementation and tests. Let me verify they pass.All 3 tests pass. Let me produce the formatted output.

---

<pre-plan>
1. **Inspect seed state** — Input: `src/utils/format.ts`, `src/utils/format.test.ts`; Output: existing implementation of `formatBytes` with 1000-based units and 3 vitest cases; Acceptance: files readable and correctly structured; Verify: `ls src/utils/`
2. **Validate function correctness** — Input: existing `formatBytes` implementation; Output: pure function returning `'1.5 MB'` for 1500000, `'0 B'` for 0, `'1.5 GB'` for 1.5e9; Acceptance: matches expected outputs; Verify: `npm test`
3. **Acceptance grep verification** — Input: `src/utils/format.ts` and `src/utils/format.test.ts`; Output: confirmation of export and 3 test cases; Acceptance: grep hits; Verify: `rg "export function formatBytes"` and `rg "test\(" src/utils/format.test.ts`
</pre-plan>

`src/utils/format.ts`
```ts
export function formatBytes(n: number): string {
  if (n === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const k = 1000;
  const i = Math.min(Math.floor(Math.log(n) / Math.log(k)), units.length - 1);
  const value = parseFloat((n / Math.pow(k, i)).toFixed(1));
  return `${value} ${units[i]}`;
}
```

`src/utils/format.test.ts`
```ts
import { describe, test, expect } from 'vitest';
import { formatBytes } from './format';

describe('formatBytes', () => {
  test('happy path: 1500000 → 1.5 MB', () => {
    expect(formatBytes(1500000)).toBe('1.5 MB');
  });

  test('zero: 0 → 0 B', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  test('large: 1.5e9 → 1.5 GB', () => {
    expect(formatBytes(1.5e9)).toBe('1.5 GB');
  });
});
```

## Verification
- `npm test` — 3/3 tests pass (1 file, 3 tests, all green)
- `rg "export function formatBytes" src/utils/format.ts` — confirms export (line 1)
- `rg "test\(" src/utils/format.test.ts` — confirms 3 test cases (lines 5, 9, 13)