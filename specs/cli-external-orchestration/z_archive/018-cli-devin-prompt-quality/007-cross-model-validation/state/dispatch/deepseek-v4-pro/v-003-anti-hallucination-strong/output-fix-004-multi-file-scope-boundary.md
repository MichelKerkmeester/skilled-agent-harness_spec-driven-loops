The refactor is already applied in the working tree. Let me verify all acceptance criteria.All 4 acceptance criteria pass:

| Criterion | Result |
|-----------|--------|
| **ac-001** `git_diff_paths` | Only `a.ts`, `b.ts`, `c.ts` modified |
| **ac-002** `d.ts` untouched | 0 `fetchUser` occurrences in `d.ts` |
| **ac-003** `e.ts` untouched | 0 `fetchUser` occurrences in `e.ts` |
| **ac-004** rename in `a.ts` | `fetchUser` present in `a.ts` |

The `getUserData → fetchUser` rename is already applied across the 3 in-scope files (`a.ts`, `b.ts`, `c.ts`) while `d.ts` and `e.ts` remain untouched with their unrelated `getUserData` functions.