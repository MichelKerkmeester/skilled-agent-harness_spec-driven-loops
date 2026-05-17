The seed files already contain the requested code. Let me use sequential thinking as required, then verify the acceptance criteria.All three acceptance criteria verified:

| Criterion | Result | Evidence |
|-----------|--------|----------|
| [ac-001] 3 vitest cases pass | `3 passed (3)` | vitest run: `src/utils/format.test.ts` — 3 tests passed |
| [ac-002] formatBytes exported | `export function formatBytes` at `src/utils/format.ts:1` | grep hit |
| [ac-003] 3 test cases present | 3 `test(` calls at lines 5, 9, 13 | grep hit |

The seed already contained the correct implementation (`src/utils/format.ts:1-8`) and tests (`src/utils/format.test.ts:1-16`). No modifications needed — the pure function `formatBytes(n: number): string` handles the happy path (1.5 MB), zero (0 B), and large (1.5 GB) cases with base-1000 units, and all tests pass deterministically.