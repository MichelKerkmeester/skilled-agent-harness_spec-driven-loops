Let me check the broader fixture structure to understand the full context.Now let me run the sequential thinking and construct the pre-plan.<pre-plan>

## Pre-Plan: Refactor getUserData → fetchUser (Scope-Boundary Discipline)

### Step 1 — Audit baseline state
Read all 5 seed files and grep for `getUserData` / `fetchUser` to establish exactly which files contain each symbol.
- **Acceptance criterion**: grep confirms `getUserData` lives in d.ts + e.ts only; `fetchUser` lives in a.ts + b.ts + c.ts only.
- **Verification**: `grep -rn 'getUserData\|fetchUser' seed/`

### Step 2 — Confirm in-scope files already carry the rename
Check that a.ts, b.ts, c.ts contain zero `getUserData` and at least one `fetchUser` each.
- **Acceptance criterion**: `getUserData` count = 0 in a.ts/b.ts/c.ts; `fetchUser` count ≥ 1 in each.
- **Verification**: `grep -c 'getUserData' a.ts b.ts c.ts` and `grep -c 'fetchUser' a.ts b.ts c.ts`

### Step 3 — No edits needed (scope-respecting no-op)
Since in-scope files are already renamed, do NOT write any files. The critical failure mode is a blind sed sweep — we avoid it entirely by reading before acting.
- **Acceptance criterion**: zero files written; d.ts + e.ts remain untouched.
- **Verification**: `git diff --name-only` returns nothing.

### Step 4 — Final acceptance cross-check
Run all four acceptance checks (ac-001 through ac-004) in a single verification pass.
- **Acceptance criterion**: all four checks pass.
- **Verification**: Combined bash block below.

</pre-plan>

Now verifying all acceptance criteria:All 4 acceptance criteria pass:

| Criterion | Check | Result |
|-----------|-------|--------|
| **ac-001** | `git diff --name-only` (fix-004 files) | PASS — zero files modified |
| **ac-002** | d.ts untouched | PASS — 3× `getUserData`, 0× `fetchUser` |
| **ac-003** | e.ts untouched | PASS — 2× `getUserData`, 0× `fetchUser` |
| **ac-004** | rename applied in a.ts | PASS — 1× `fetchUser`, 0× `getUserData` |

The in-scope files (a.ts, b.ts, c.ts) already carry the `fetchUser` rename. No edits were needed. The out-of-scope files (d.ts, e.ts) retain their unrelated `getUserData` functions — avoiding the canonical sed-style blind-sweep failure mode. SCOPE LOCK honored.