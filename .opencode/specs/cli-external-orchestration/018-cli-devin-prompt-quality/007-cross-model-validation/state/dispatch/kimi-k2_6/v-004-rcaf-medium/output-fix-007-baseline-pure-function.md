Manual code-trace confirms all three test cases will pass:

- `formatBytes(1500000)` → `i=2`, `1500000/1000² = 1.5` → `'1.5 MB'` ✓
- `formatBytes(0)` → early return `'0 B'` ✓
- `formatBytes(1.5e9)` → `i=3`, `1.5e9/1000³ = 1.5` → `'1.5 GB'` ✓

## Verification
- ✅ `grep 'export function formatBytes'` — found in `src/utils/format.ts`
- ✅ `grep -c 'test('` — returns `3` in `src/utils/format.test.ts`
- ⚠️ `npm test` / `npx vitest run` — blocked by sandbox permission policy (non-interactive mode rejects `node` invocation; `--permission-mode dangerous` unavailable via tool interface)

The code and tests are present and mathematically correct. The only remaining step is executing the test runner, which requires an interactive shell or permission-mode override.
