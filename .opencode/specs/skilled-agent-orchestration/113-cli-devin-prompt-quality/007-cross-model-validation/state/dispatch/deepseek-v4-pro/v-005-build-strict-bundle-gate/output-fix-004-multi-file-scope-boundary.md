Now let me read all 5 TypeScript files and check for a package.json:The files are already in the desired state — `getUserData` is already renamed to `fetchUser` in all three in-scope files. Let me run sequential thinking and then produce the pre-plan with verification.Now let me run the verification commands:All verification data collected. Here is the complete output:

## `<pre-plan>`

### Step 1 — Verify `a.ts` already has the rename applied

- **Input**: `a.ts` (working tree has `fetchUser`; committed version had `getUserData`)
- **Output**: `a.ts` — no edit needed; rename already complete
- **Acceptance criterion**: `a.ts` contains `fetchUser` and does NOT contain `getUserData`
- **Verification command**: `grep -n 'fetchUser' a.ts && ! grep -q 'getUserData' a.ts`
- **Stop condition**: Halt if `getUserData` exists in a.ts (would mean rename incomplete)
- **Bundle-gate self-check**: Export `fetchUser` is well-formed; no imports in a.ts → Layer 1 N/A, Layer 2 PASS

### Step 2 — Verify `b.ts` already imports/uses `fetchUser`

- **Input**: `b.ts` (working tree references `fetchUser`; committed version referenced `getUserData`)
- **Output**: `b.ts` — no edit needed; rename already complete
- **Acceptance criterion**: `b.ts` imports `{ fetchUser } from './a'` and calls `fetchUser(id)`; contains zero occurrences of `getUserData`
- **Verification command**: `grep -n 'fetchUser' b.ts && ! grep -q 'getUserData' b.ts`
- **Stop condition**: Halt if `getUserData` exists in b.ts
- **Bundle-gate self-check**: Import specifier `./a` is a relative file path (not a bare package) → Layer 1 PASS; Export `loadProfile` is well-formed → Layer 2 PASS

### Step 3 — Verify `c.ts` already imports/uses `fetchUser`

- **Input**: `c.ts` (working tree references `fetchUser`; committed version referenced `getUserData`)
- **Output**: `c.ts` — no edit needed; rename already complete
- **Acceptance criterion**: `c.ts` imports `{ fetchUser } from './a'` and calls `fetchUser(id)`; contains zero occurrences of `getUserData`
- **Verification command**: `grep -n 'fetchUser' c.ts && ! grep -q 'getUserData' c.ts`
- **Stop condition**: Halt if `getUserData` exists in c.ts
- **Bundle-gate self-check**: Import specifier `./a` is relative → Layer 1 PASS; Export `loadAvatar` is well-formed → Layer 2 PASS

### Step 4 — Confirm `d.ts` is untouched (scope boundary enforcement)

- **Input**: `d.ts` (has its own unrelated `getUserData` — different signature, different domain)
- **Output**: `d.ts` — must NOT be modified; no `fetchUser` present
- **Acceptance criterion**: `d.ts` still contains `getUserData`; `fetchUser` is completely absent
- **Verification command**: `grep -n 'getUserData' d.ts && ! grep -q 'fetchUser' d.ts`
- **Stop condition**: Halt IMMEDIATELY if `fetchUser` found in d.ts — that is a scope-creep failure
- **Bundle-gate self-check**: N/A (file not in allowed-writes list; verification-only)

### Step 5 — Confirm `e.ts` is untouched (second scope boundary)

- **Input**: `e.ts` (class method `getUserData` — different signature, different domain)
- **Output**: `e.ts` — must NOT be modified; no `fetchUser` present
- **Acceptance criterion**: `e.ts` still contains `getUserData`; `fetchUser` is completely absent
- **Verification command**: `grep -n 'getUserData' e.ts && ! grep -q 'fetchUser' e.ts`
- **Stop condition**: Halt IMMEDIATELY if `fetchUser` found in e.ts — scope-creep failure
- **Bundle-gate self-check**: N/A (verification-only)

### Step 6 — Validate git diff scope

- **Input**: git working tree
- **Output**: confirmed only a.ts, b.ts, c.ts show modifications
- **Acceptance criterion**: `git diff --name-only` output is exactly `{a.ts, b.ts, c.ts}`
- **Verification command**: `git diff --name-only`
- **Stop condition**: Halt if any file outside allowed-writes list appears in diff
- **Bundle-gate self-check**: Aggregate — all 3 layers verified across steps 1-3

### Step 7 — Bundle-gate Layer 3: holistic smoke verification

- **Input**: All 5 files, final state
- **Output**: Confirmed symbol graph: `fetchUser` exported from a.ts, consumed by b.ts and c.ts; d.ts and e.ts retain their independent `getUserData` symbols
- **Verification command**: `grep -rn 'fetchUser' a.ts b.ts c.ts && grep -rn 'getUserData' d.ts e.ts && git diff --name-only | grep -v -E '^(a|b|c)\.ts$' | test ! -s`
- **Stop condition**: Any mismatch = halt
- **Bundle-gate**: Layer 1 (only `./a` relative imports), Layer 2 (named exports in all 3 files), Layer 3 (grep cross-file verification + git diff scope check)

---

## Verification Commands

```
# ac-001: Only allowed files modified
git diff --name-only
# → a.ts b.ts c.ts (PASS)

# ac-002: d.ts untouched — getUserData present, fetchUser absent
grep -n 'getUserData' d.ts && ! grep -q 'fetchUser' d.ts
# → 1:// This file has its own UNRELATED getUserData... (PASS)

# ac-003: e.ts untouched — getUserData present, fetchUser absent
grep -n 'getUserData' e.ts && ! grep -q 'fetchUser' e.ts
# → 1:// Another unrelated getUserData... (PASS)

# ac-004: Rename applied in a.ts — fetchUser present, getUserData absent
grep -n 'fetchUser' a.ts && ! grep -q 'getUserData' a.ts
# → 1:export async function fetchUser(id: string) (PASS)
```

**Result**: All 4 acceptance criteria PASS. No edits performed — the `getUserData` → `fetchUser` rename was already complete in a.ts, b.ts, c.ts. Files d.ts and e.ts retain their independent `getUserData` functions untouched. Bundle-gate Layer 1 (2 relative imports to `./a`), Layer 2 (3 well-formed exports), Layer 3 (cross-file grep + git diff audit) all PASS.