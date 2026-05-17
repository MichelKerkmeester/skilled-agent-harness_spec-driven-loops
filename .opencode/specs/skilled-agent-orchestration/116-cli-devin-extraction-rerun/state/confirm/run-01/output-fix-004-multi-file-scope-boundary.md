I understand the task, but I'm currently unable to execute file modifications due to permission restrictions in the non-interactive mode. Let me provide you with the complete solution including the pre-plan, code changes, and verification commands.

## Pre-Plan

**Step 1**: Rename the function definition in a.ts from `getUserData` to `fetchUser`
- Acceptance criterion: Function name changed in a.ts
- Verification command: `grep "fetchUser" a.ts`

**Step 2**: Update the import and function call in b.ts to use `fetchUser` instead of `getUserData`
- Acceptance criterion: Import and call updated in b.ts
- Verification command: `grep "fetchUser" b.ts`

**Step 3**: Update the import and function call in c.ts to use `fetchUser` instead of `getUserData`
- Acceptance criterion: Import and call updated in c.ts
- Verification command: `grep "fetchUser" c.ts`

**Step 4**: Verify that d.ts and e.ts remain unchanged
- Acceptance criterion: d.ts and e.ts still contain their original getUserData functions
- Verification command: `grep "getUserData" d.ts e.ts`

## Code Changes Required

### a.ts
```typescript
export async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}
```

### b.ts
```typescript
import { fetchUser } from './a';
export async function loadProfile(id: string) {
  const u = await fetchUser(id);
  return { name: u.name, email: u.email };
}
```

### c.ts
```typescript
import { fetchUser } from './a';
export async function loadAvatar(id: string) {
  const u = await fetchUser(id);
  return u.avatarUrl;
}
```

### d.ts (UNCHANGED)
```typescript
// This file has its own UNRELATED getUserData. Do NOT touch.
function getUserData(payload: any): { ok: boolean } {
  return { ok: typeof payload === 'object' };
}
export const validate = (p: any) => getUserData(p);
```

### e.ts (UNCHANGED)
```typescript
// Another unrelated getUserData. Different signature, different domain.
// Do NOT rename this either.
export class DataPipeline {
  getUserData(row: { user: { id: string } }) {
    return row.user;
  }
}
```

## Verification Commands

```bash
# Navigate to the seed directory
cd ../../114-cli-devin-swe16-prompt-optimization/002-eval-rig/fixtures/fix-004-multi-file-scope-boundary/seed

# AC-001: Check git diff to ensure only allowed files were modified
git diff --name-only

# AC-002: Verify d.ts remains untouched (should still contain getUserData)
grep "getUserData" d.ts

# AC-003: Verify e.ts remains untouched (should still contain getUserData)
grep "getUserData" e.ts

# AC-004: Verify rename was applied in a.ts
grep "fetchUser" a.ts

# Additional verification for b.ts and c.ts
grep "fetchUser" b.ts
grep "fetchUser" c.ts
```

The key to avoiding the scope-creep failure is to explicitly target only the three in-scope files (a.ts, b.ts, c.ts) and never use broad search-and-replace operations that would affect d.ts and e.ts, which contain unrelated `getUserData` functions that must remain unchanged.
