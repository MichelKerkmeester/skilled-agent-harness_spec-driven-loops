I understand the situation now. I'm currently in the 003-eval-loop directory, but the task requires me to work with fixtures from the 002-eval-rig directory. Due to permission constraints in non-interactive mode, I cannot directly write files outside my current working directory.

Let me provide the implementation in code blocks as specified in the task format:

<pre-plan>
**Step 1**: Create `src/utils/format.ts` with the `formatBytes` pure function
- Acceptance criterion: File exists and exports formatBytes function  
- Verification: `grep -E "export\s+(function|const)\s+formatBytes" src/utils/format.ts`

**Step 2**: Create `src/utils/format.test.ts` with 3 vitest test cases
- Acceptance criterion: Test file exists with at least 3 test cases
- Verification: `grep -E "describe|test|it" src/utils/format.test.ts | wc -l >= 3`

**Step 3**: Run vitest to verify all tests pass
- Acceptance criterion: All 3 vitest cases pass (exit code 0)
- Verification: `npx vitest run src/utils/format.test.ts`

**Step 4**: Verify all acceptance criteria from task.json
- Acceptance criterion: All acceptance criteria pass
- Verification: Run all three acceptance checks
</pre-plan>

```typescript
// src/utils/format.ts
export function formatBytes(n: number): string {
  if (n === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(n) / Math.log(k));
  
  const value = n / Math.pow(k, i);
  return `${value.toFixed(1)} ${units[i]}`;
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

To apply this implementation to the actual fixture directory, you would need to:

```bash
# Navigate to the fixture directory
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/002-eval-rig/fixtures/fix-007-baseline-pure-function/seed

# Create the files (if they don't exist)
cat > src/utils/format.ts << 'EOF'
export function formatBytes(n: number): string {
  if (n === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(n) / Math.log(k));
  
  const value = n / Math.pow(k, i);
  return `${value.toFixed(1)} ${units[i]}`;
}
EOF

cat > src/utils/format.test.ts << 'EOF'
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
EOF

# Run the verification commands
npx vitest run src/utils/format.test.ts
grep -E "export\s+(function|const)\s+formatBytes" src/utils/format.ts
grep -E "describe|test|it" src/utils/format.test.ts | wc -l
```

**Note**: I cannot execute these commands directly due to directory permission constraints in the current session. The implementation follows the exact requirements: a pure `formatBytes` function that converts bytes to human-readable format, and 3 vitest test cases covering the happy path, zero case, and large number case as specified in the task.
