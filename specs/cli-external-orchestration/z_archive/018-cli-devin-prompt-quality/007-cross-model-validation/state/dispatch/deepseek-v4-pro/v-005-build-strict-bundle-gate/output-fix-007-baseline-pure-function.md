The seed files already contain the implementation and tests. Let me verify they pass:Now let me run the verification:All 3 tests pass, all acceptance criteria met. The seed implementation is already correct.

---

## `<pre-plan>`
1. **READ seed**: Inputs: `package.json`, `src/utils/format.ts`, `src/utils/format.test.ts`. Outputs: confirmed `vitest` dep, function defined, 3 tests present. Accept: all 3 files readable. Verify: `wc -l src/utils/format.ts src/utils/format.test.ts`. Stop: missing/malformed files.
2. **VERIFY pure function**: Inputs: `src/utils/format.ts`. Outputs: confirmed zero external deps, no side effects, Math-only computation. Accept: `import` grep on format.ts returns empty. Verify: `rg 'import' src/utils/format.ts`. Stop: non-builtin imports found.
3. **LAYER 1+2 bundle-gate**: Inputs: `src/utils/format.ts`, `src/utils/format.test.ts`. Outputs: import specifiers list: `vitest` (in package.json), `./format` (local). Export list: `export function formatBytes`. Accept: all import specifiers resolve. Verify: `rg 'import|export' src/utils/format.ts src/utils/format.test.ts`. Stop: unresolvable import.
4. **LAYER 3 smoke-run**: Inputs: completed source files. Outputs: vitest output showing 3/3 passed. Accept: exit code 0, 3 passing tests. Verify: `npm test` (→ `vitest run`). Stop: any test failure.
## `</pre-plan>`

### Verification

```
# [ac-001] 3 vitest cases pass
$ npm test
 ✓ src/utils/format.test.ts  (3 tests) 1ms
 Tests  3 passed (3)

# [ac-002] formatBytes exported
$ rg 'export' src/utils/format.ts
export function formatBytes(n: number): string {

# [ac-003] 3 test cases present
$ rg 'test\(' src/utils/format.test.ts
  test('happy path: 1500000 → 1.5 MB', ...
  test('zero: 0 → 0 B', ...
  test('large: 1.5e9 → 1.5 GB', ...
```

### Bundle-gate self-check

| Layer | Check | Result |
|-------|-------|--------|
| L1 — imports | `vitest` → `package.json` ✓, `./format` → local ✓ | PASS |
| L2 — exports | `export function formatBytes(n: number): string` | PASS |
| L3 — smoke-run | `npm test` → 3 passed, 0 failed | PASS |