I need write permissions to create the required files. The system is currently in non-interactive mode and blocking file writes. Please run with `--permission-mode dangerous` to allow me to create the `format.ts` and `format.test.ts` files in the seed directory.

Alternatively, if you prefer, I can provide the complete code for both files here and you can create them manually:

**src/utils/format.ts:**
```typescript
export function formatBytes(n: number): string {
  if (n === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const k = 1024;
  const i = Math.floor(Math.log(n) / Math.log(k));
  const value = n / Math.pow(k, i);
  
  return `${value.toFixed(1)} ${units[i]}`;
}
```

**src/utils/format.test.ts:**
```typescript
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

Once created, you can verify with:
```bash
npx vitest run src/utils/format.test.ts
```
