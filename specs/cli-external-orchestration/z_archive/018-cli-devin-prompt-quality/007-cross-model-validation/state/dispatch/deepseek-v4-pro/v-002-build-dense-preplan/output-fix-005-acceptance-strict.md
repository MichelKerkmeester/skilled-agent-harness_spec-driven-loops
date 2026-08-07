Let me run the tests to see what currently fails.All 12 tests already pass. Let me use sequential thinking to analyze the implementation for correctness issues before making changes.**`<pre-plan>`**

**Step 1 — Fix shared WeakMap scoping**
- **Inputs**: `deep-equal.ts` with module-level `const seen = new WeakMap<object, object>()` and `function eq(x,y)` that references it (lines 1, 14-17)
- **Outputs**: `deep-equal.ts` with `seen` created inside `deepEqual` and threaded through `eq` as a parameter
- **Acceptance**: No module-level mutable state; each `deepEqual()` call gets a fresh WeakMap
- **Verification**: `npx vitest run` — all 12 tests pass
- **Stop**: If any test fails or grep doesn't show `export function deepEqual`

**Step 2 — Run tests**
- **Inputs**: Updated `deep-equal.ts`
- **Outputs**: `npx vitest run` output showing 12/12 passed
- **Acceptance**: `[ac-001]` — 12 deterministic test cases pass
- **Verification**: `npx vitest run` with exit code 0
- **Stop**: If any test fails

**Step 3 — Verify export**
- **Inputs**: Updated `deep-equal.ts`
- **Outputs**: grep showing `export function deepEqual`
- **Acceptance**: `[ac-002]` — function exported
- **Verification**: `grep -n "export function deepEqual" src/deep-equal.ts`
- **Stop**: If grep returns empty

`</pre-plan>`

Now implement Step 1:Now update recursive `eq` calls to pass `seen`:Step 2 — Run tests:Step 3 — Verify export:**Done.** Fixed the shared `WeakMap` determinism bug by moving it from module scope into `deepEqual()`, passing it as a parameter to `eq()`.

**Verification results:**
- `[ac-001]` ✅ `npx vitest run` — 12/12 tests pass (1 file, 12 tests, 0 failures)
- `[ac-002]` ✅ `grep -n "export function deepEqual" src/deep-equal.ts` — exported at line 53