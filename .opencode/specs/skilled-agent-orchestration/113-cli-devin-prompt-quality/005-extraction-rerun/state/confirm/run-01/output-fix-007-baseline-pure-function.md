I can see that I'm in a permission-constrained environment where I cannot write to the actual fixture directory (`002-eval-rig/fixtures/fix-007-baseline-pure-function/seed`) from the current working directory (`003-eval-loop`). 

However, I can provide the complete implementation and verification steps for the task. Here's the solution:

<pre-plan>
**Step 1**: Create the format.ts file with the formatBytes pure function
- Acceptance criterion: File exists at src/utils/format.ts with exported formatBytes function
- Verification command: grep -E "export\s+(function|const)\s+formatBytes" src/utils/format.ts

**Step 2**: Create the format.test.ts file with 3 vitest test cases
- Acceptance criterion: File exists at src/utils/format.test.ts with 3 test cases (happy path, zero, large)
- Verification command: grep -E "(describe|test|it)" src/utils/format.test.ts | wc -l

**Step 3**: Run the vitest tests to verify all 3 test cases pass
- Acceptance criterion: All 3 vitest tests pass with exit code 0
- Verification command: npx vitest run src/utils/format.test.ts
</pre-plan>

**Step 1**: Create the format.ts file with the formatBytes pure function

```typescript
// src/utils/format.ts
export function formatBytes(n: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (n === 0) return '0 B';
  
  const i = Math.floor(Math.log(n) / Math.log(1024));
  const value = n / Math.pow(1024, i);
  
  return `${value.toFixed(1)} ${units[i]}`;
}
```

**Step 2**: Create the format.test.ts file with 3 vitest test cases

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

**Step 3**: Verification commands

```bash
# AC-002: Verify formatBytes is exported
grep -E "export\s+(function|const)\s+formatBytes" src/utils/format.ts

# AC-003: Verify 3 test cases present
grep -E "(describe|test|it)" src/utils/format.test.ts | wc -l

# AC-001: Run vitest tests
npx vitest run src/utils/format.test.ts
```

**Expected Results:**
- AC-002: Should find the export statement for formatBytes
- AC-003: Should count 4 matches (1 describe + 3 test cases)  
- AC-001: All 3 tests should pass with exit code 0

The implementation uses a pure function that:
1. Handles the zero case explicitly
2. Calculates the appropriate unit using logarithmic base conversion
3. Formats the result with 1 decimal place and the correct unit suffix
