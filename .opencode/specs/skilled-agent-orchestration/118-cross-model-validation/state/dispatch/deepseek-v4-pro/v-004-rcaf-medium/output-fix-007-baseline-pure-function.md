Let me read the existing fixture files to understand the starting state.Now I have full context. Let me implement the solution.Now install dependencies and run verification.All 3 tests pass. Now run the grep-based acceptance checks.All acceptance criteria verified. Here's the completed work:

<pre-plan>
1. **Write `src/utils/format.ts`** — pure `formatBytes(n: number): string` using SI decimal units (base 1000). Input: bytes count. Output: formatted string like '1.5 MB'. Acceptance: function exported, deterministic, zero handled.
2. **Write `src/utils/format.test.ts`** — 3 vitest test cases (happy path 1500000 → '1.5 MB', zero 0 → '0 B', large 1.5e9 → '1.5 GB'). Acceptance: all 3 pass with exit code 0.
3. **Install deps + run tests + grep verify** — `npm install` then `npx vitest run`, grep for export + test cases. Acceptance: exit 0, 1 export match, ≥3 test matches.
</pre-plan>

`src/utils/format.ts`
```ts
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatBytes(n: number): string {
  if (n === 0) return '0 B';

  const magnitude = Math.min(
    Math.floor(Math.log(Math.abs(n)) / Math.log(1000)),
    UNITS.length - 1
  );
  const value = n / Math.pow(1000, magnitude);

  return `${parseFloat(value.toFixed(1))} ${UNITS[magnitude]}`;
}
```

`src/utils/format.test.ts`
```ts
import { describe, test, expect } from 'vitest';
import { formatBytes } from './format';

describe('formatBytes', () => {
  test('converts bytes to MB', () => {
    expect(formatBytes(1500000)).toBe('1.5 MB');
  });

  test('returns 0 B for zero', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  test('converts bytes to GB', () => {
    expect(formatBytes(1.5e9)).toBe('1.5 GB');
  });
});
```

## Verification
- `npx vitest run src/utils/format.test.ts` — 3 tests passed, exit 0
- `grep -c "export function formatBytes\|export const formatBytes" src/utils/format.ts` — 1 (formatBytes exported)
- `grep -c "test" src/utils/format.test.ts` — 4 (≥3 test cases present)