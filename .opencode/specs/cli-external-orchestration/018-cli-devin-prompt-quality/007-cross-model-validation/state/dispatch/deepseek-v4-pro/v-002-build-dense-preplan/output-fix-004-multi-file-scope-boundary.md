## Pre-Plan

```
<pre-plan>
Step 1: AUDIT — Read all 5 files to identify every `getUserData` occurrence
  Inputs:  seed/*.ts (committed state has getUserData in a.ts, b.ts, c.ts, d.ts, e.ts)
  Outputs: map of {file: [lines]} for all getUserData occurrences
  Accept:   d.ts lines 2,5; e.ts line 4 confirmed as OUT-OF-SCOPE (different signatures)
  Verify:   grep -n "getUserData" a.ts b.ts c.ts d.ts e.ts
  Stop:     if any file shows a getUserData usage that chains into scope files

Step 2: RENAME — Refactor a.ts: function declaration getUserData → fetchUser
  Inputs:  a.ts with `export async function getUserData(id: string)`
  Outputs: a.ts with `export async function fetchUser(id: string)`
  Accept:   function is renamed, no other changes
  Verify:   grep -n "fetchUser" a.ts && ! grep -n "getUserData" a.ts
  Stop:     if edit tool reports string not found

Step 3: RENAME — Refactor b.ts: import + call site getUserData → fetchUser
  Inputs:  b.ts with `import { getUserData } from './a'` + `await getUserData(id)`
  Outputs: b.ts with `import { fetchUser } from './a'` + `await fetchUser(id)`
  Accept:   both import and call site renamed
  Verify:   grep -n "fetchUser" b.ts && ! grep -n "getUserData" b.ts
  Stop:     if edit tool reports string not found

Step 4: RENAME — Refactor c.ts: import + call site getUserData → fetchUser
  Inputs:  c.ts with `import { getUserData } from './a'` + `await getUserData(id)`
  Outputs: c.ts with `import { fetchUser } from './a'` + `await fetchUser(id)`
  Accept:   both import and call site renamed
  Verify:   grep -n "fetchUser" c.ts && ! grep -n "getUserData" c.ts
  Stop:     if edit tool reports string not found

Step 5: VERIFY — Scope boundary + cross-file consistency
  Inputs:  all 5 files after steps 2-4
  Outputs: acceptance evidence for all 4 criteria
  Accept:   ac-001 through ac-004 all pass
  Verify:   git diff --name-only (only a.ts/b.ts/c.ts)
            grep getUserData d.ts e.ts (must still be present)
            grep fetchUser d.ts e.ts (must NOT be present)
  Stop:     if any out-of-scope file appears in diff or loses its getUserData
</pre-plan>
```

---

## Verification Results

**ac-001** `git_diff_paths` — only allowed files modified:
```
$ git diff --name-only
a.ts
b.ts
c.ts
```
PASS

**ac-002** `grep_absent` — d.ts untouched:
```
$ grep -n "getUserData" d.ts
1:// This file has its own UNRELATED getUserData. Do NOT touch.
2:function getUserData(payload: any): { ok: boolean } {
5:export const validate = (p: any) => getUserData(p);
```
`getUserData` still present; no `fetchUser` leaked. PASS

**ac-003** `grep_absent` — e.ts untouched:
```
$ grep -n "getUserData" e.ts
1:// Another unrelated getUserData. Different signature, different domain.
4:  getUserData(row: { user: { id: string } }) {
```
`getUserData` still present; no `fetchUser` leaked. PASS

**ac-004** `grep` — rename applied in a.ts:
```
$ grep -n "fetchUser" a.ts
1:export async function fetchUser(id: string) {
```
PASS

**Bonus consistency checks:**
- `getUserData` absent from a.ts, b.ts, c.ts (exit 1 — no matches)
- `fetchUser` absent from d.ts, e.ts (exit 1 — no matches)
- Import chain intact: a.ts exports `fetchUser`, b.ts and c.ts import it from `./a`

All 4 acceptance criteria pass. Only the 3 allowed files were modified.