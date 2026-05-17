<pre-plan>
1. **Read all 5 files** (a.ts, b.ts, c.ts, d.ts, e.ts) to confirm current state and identify which `getUserData` references are in-scope vs out-of-scope.
   - *Input*: fixture seed directory contents
   - *Output*: confirmed that a.ts, b.ts, c.ts already define/import `fetchUser`; d.ts and e.ts contain unrelated `getUserData` that must not be touched
   - *Criterion*: in-scope files already use `fetchUser`; out-of-scope files still contain `getUserData`
   - *Verification*: `grep -n "fetchUser\|getUserData" a.ts b.ts c.ts d.ts e.ts`

2. **Confirm no unintended modifications** to out-of-scope files.
   - *Input*: d.ts and e.ts file contents
   - *Output*: guarantee that only a.ts, b.ts, c.ts would appear in any diff
   - *Criterion*: d.ts and e.ts are unchanged; `getUserData` remains in both
   - *Verification*: `git diff --name-only` should show no changes (or only a.ts, b.ts, c.ts if any)

3. **Validate acceptance criteria** with targeted grep checks.
   - *Input*: grep results across all files
   - *Output*: proof that rename is applied in a.ts and that d.ts/e.ts are untouched
   - *Criterion*: [ac-001] only allowed files modified, [ac-002] d.ts untouched, [ac-003] e.ts untouched, [ac-004] rename in a.ts
   - *Verification*: `grep -n "fetchUser" a.ts && grep -n "getUserData" d.ts && grep -n "getUserData" e.ts`
</pre-plan>

`fixtures/fix-004-multi-file-scope-boundary/seed/a.ts`
```ts
export async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}
```

`fixtures/fix-004-multi-file-scope-boundary/seed/b.ts`
```ts
import { fetchUser } from './a';
export async function loadProfile(id: string) {
  const u = await fetchUser(id);
  return { name: u.name, email: u.email };
}
```

`fixtures/fix-004-multi-file-scope-boundary/seed/c.ts`
```ts
import { fetchUser } from './a';
export async function loadAvatar(id: string) {
  const u = await fetchUser(id);
  return u.avatarUrl;
}
```

**d.ts and e.ts are intentionally left untouched.**  
- `d.ts` contains its own unrelated `getUserData(payload: any)` used by `validate`.  
- `e.ts` contains `DataPipeline.getUserData(row)` — a class method with a different signature and domain.  
Neither file is in the allowed-write list, so no edits were made.

## Verification
- `grep -n "fetchUser" a.ts` — confirms rename exists in a.ts ([ac-004])
- `grep -n "getUserData" d.ts` — confirms d.ts still has its unrelated function, was not touched ([ac-002])
- `grep -n "getUserData" e.ts` — confirms e.ts still has its unrelated class method, was not touched ([ac-003])
- `git diff --name-only` — confirms zero out-of-scope files were modified ([ac-001])
