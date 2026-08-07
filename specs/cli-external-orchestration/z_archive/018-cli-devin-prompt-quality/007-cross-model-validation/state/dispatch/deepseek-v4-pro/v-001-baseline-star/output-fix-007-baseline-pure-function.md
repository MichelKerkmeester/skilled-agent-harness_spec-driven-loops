Let me look at the existing fixture seed to understand the project structure:<pre-plan>

## Step 1: Create directory structure
- **Acceptance**: `fixtures/fix-007-baseline-pure-function/seed/src/utils/` exists
- **Verify**: `ls fixtures/fix-007-baseline-pure-function/seed/src/utils/`

## Step 2: Create package.json
- **Acceptance**: Valid JSON with `"test": "vitest run"` script and `vitest` dependency
- **Verify**: `node -e "const p = require('./package.json'); console.assert(p.scripts.test === 'vitest run'); console.assert(p.dependencies.vitest)"`

## Step 3: Create src/utils/format.ts with exported formatBytes
- **Acceptance**: Pure function `formatBytes(n: number): string` exported, producing '1.5 MB', '0 B', '1.5 GB' for the given inputs
- **Verify**: `grep -r "export function formatBytes" src/utils/format.ts`

## Step 4: Create src/utils/format.test.ts with 3 vitest cases
- **Acceptance**: 3 test cases (happy path 1500000 → '1.5 MB', zero 0 → '0 B', large 1.5e9 → '1.5 GB')
- **Verify**: `grep -c "test(" src/utils/format.test.ts` returns 3

## Step 5: Install dependencies and run tests
- **Acceptance**: 3 vitest tests pass with exit code 0
- **Verify**: `npm install && npx vitest run`

</pre-plan>

```typescript
// src/utils/format.ts

export function formatBytes(n: number): string {
  if (n === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const k = 1000;
  const i = Math.min(Math.floor(Math.log(n) / Math.log(k)), units.length - 1);
  const value = parseFloat((n / Math.pow(k, i)).toFixed(1));
  return `${value} ${units[i]}`;
}
```

```typescript
// src/utils/format.test.ts

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

Now executing the writes and verification:All acceptance criteria pass:

| Criterion | Result |
|-----------|--------|
| `[ac-001]` deterministic: 3 vitest cases pass | **3 passed (3)** |
| `[ac-002]` grep: formatBytes exported | **Found at `format.ts:1`** |
| `[ac-003]` grep: 3 test cases present | **3** |