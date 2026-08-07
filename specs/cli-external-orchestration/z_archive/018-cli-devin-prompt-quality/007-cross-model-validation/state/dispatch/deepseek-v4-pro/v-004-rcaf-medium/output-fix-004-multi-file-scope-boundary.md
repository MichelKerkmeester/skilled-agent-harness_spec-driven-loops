<pre-plan>
1. **Read all 5 seed files** → Input: seed directory; Output: file contents for a.ts, b.ts, c.ts, d.ts, e.ts. Acceptance: all files readable. Verification: `ls a.ts b.ts c.ts d.ts e.ts`
2. **Confirm in-scope files already use `fetchUser`** → Input: a.ts, b.ts, c.ts; Output: confirmation that zero `getUserData` occurrences exist in a/b/c. Acceptance: `getUserData` absent from a/b/c; `fetchUser` present. Verification: `grep -rn "getUserData" a.ts b.ts c.ts` (expect empty), `grep -rn "fetchUser" a.ts b.ts c.ts` (expect hits)
3. **Confirm out-of-scope files untouched** → Input: d.ts, e.ts; Output: confirmation that `getUserData` still present in d/e (unrelated functions). Acceptance: d.ts and e.ts unchanged from seed. Verification: `grep "getUserData" d.ts e.ts` (expect hits — prove they're untouched), `git diff --name-only` (expect no diff for d/e)
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

## Verification

- `git -C fixtures/fix-004-multi-file-scope-boundary/seed diff --name-only` — [ac-001] no unexpected files modified
- `grep -rn "getUserData" fixtures/fix-004-multi-file-scope-boundary/seed/d.ts` — [ac-002] d.ts still has its own `getUserData`, untouched
- `grep -rn "getUserData" fixtures/fix-004-multi-file-scope-boundary/seed/e.ts` — [ac-003] e.ts still has its own `getUserData`, untouched
- `grep -rn "fetchUser" fixtures/fix-004-multi-file-scope-boundary/seed/a.ts` — [ac-004] rename applied in a.ts