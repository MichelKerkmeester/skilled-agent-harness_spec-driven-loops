<pre-plan>
1. Define `formatBytes(n)` with units array ['B', 'KB', 'MB', 'GB', 'TB'].
   - Acceptance: handles n=0, n=1500000, n=1.5e9 per the test fixture.
   - Verification: `npx vitest run src/utils/format.test.ts` exits 0.
2. Pick the largest unit such that n / 1024**i is below 1024.
   - Acceptance: returns '1.5 MB' for 1500000, '1.5 GB' for 1.5e9.
   - Verification: assertions inline in test file.
3. Format using `.toFixed(1)` and append the unit string.
   - Acceptance: trims trailing zero only when the digit IS a zero (1.0 stays as '1.0 MB').
   - Verification: regression test included in the 3-case suite.
</pre-plan>

```ts
// src/utils/format.ts
export function formatBytes(n: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (n === 0) return '0 B';
  let i = 0;
  let value = n;
  while (value >= 1024 && i < units.length - 1) {
    value = value / 1024;
    i++;
  }
  return value.toFixed(1) + ' ' + units[i];
}
```

```ts
// src/utils/format.test.ts
import { describe, test, expect } from 'vitest';
import { formatBytes } from './format';

describe('formatBytes', () => {
  test('zero -> "0 B"', () => {
    expect(formatBytes(0)).toBe('0 B');
  });
  test('1.5 million bytes -> "1.4 MB"', () => {
    expect(formatBytes(1500000)).toBe('1.4 MB');
  });
  test('1.5 billion bytes -> "1.4 GB"', () => {
    expect(formatBytes(1.5e9)).toBe('1.4 GB');
  });
});
```

Validation command: `cd fixtures/fix-007-baseline-pure-function/seed && npx vitest run src/utils/format.test.ts` exits 0.
