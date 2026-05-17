Understood. I'll produce the work as markdown output per the task format. Here's the complete implementation for fix-007-baseline-pure-function:

<pre-plan>
1. Read seed structure: package.json exists with vitest, src/utils/.gitkeep present. No format.ts or format.test.ts yet. Input: seed directory listing. Output: confirmed scaffold. AC: seed directory contains package.json + src/utils/. Verification: `ls src/utils/`
2. Write src/utils/format.ts — export function formatBytes(n: number): string. Uses SI units (base 1000): B, KB, MB, GB, TB. Zero returns '0 B'. Uses Math.log10 to find unit tier, divides, formats with toFixed(1) unless whole number. Input: spec from task.json (3 test expectations). Output: pure function file. AC: grep confirms export. Verification: `grep -c "export function formatBytes" src/utils/format.ts`
3. Write src/utils/format.test.ts — 3 vitest cases: happy path (1500000 → '1.5 MB'), zero (0 → '0 B'), large (1.5e9 → '1.5 GB'). Input: task.json acceptance criteria. Output: test file. AC: 3 describe/test/it calls present. Verification: `grep -c "test(" src/utils/format.test.ts`
4. Run verification: `npx vitest run src/utils/format.test.ts`. Input: both files written. Output: 3/3 passing. AC: exit 0. Verification: same command.
</pre-plan>

`src/utils/format.ts`
```ts
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export function formatBytes(n: number): string {
  if (n === 0) return '0 B';

  const idx = Math.min(
    Math.floor(Math.log10(Math.abs(n)) / 3),
    UNITS.length - 1
  );
  const val = n / Math.pow(1000, idx);
  const formatted = val % 1 === 0 ? val.toString() : val.toFixed(1);

  return `${formatted} ${UNITS[idx]}`;
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

- `npx vitest run src/utils/format.test.ts` — [ac-001] deterministic: 3 vitest cases pass, exit 0
- `grep -c "export function formatBytes" src/utils/format.ts` — [ac-002] returns 1 (formatBytes exported)
- `grep -c "test(" src/utils/format.test.ts` — [ac-003] returns 3 (3 test cases present)
