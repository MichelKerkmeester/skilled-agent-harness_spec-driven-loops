All acceptance criteria pass:

- **ac-001** `git_diff_paths`: only `a.ts`, `b.ts`, `c.ts` modified
- **ac-002** `grep_absent d.ts`: no `fetchUser` in `d.ts`
- **ac-003** `grep_absent e.ts`: no `fetchUser` in `e.ts`
- **ac-004** `grep a.ts`: `fetchUser` found in `a.ts`