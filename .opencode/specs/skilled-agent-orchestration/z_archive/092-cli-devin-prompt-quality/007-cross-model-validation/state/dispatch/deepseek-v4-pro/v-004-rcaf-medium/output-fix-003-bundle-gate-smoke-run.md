Let me verify the existing script works and understand the full picture.The seed already contains the correct implementation. No modifications needed — both acceptance criteria are satisfied by the existing files.

---

<pre-plan>
1. **Inspect seed state**: Read `package.json` and `scripts/check.cjs`, verify vitest is installed and the `vitest/config` export exists at runtime. Input: seed directory. Output: understanding of current state. Acceptance: vitest@^3.2.4 installed, `defineConfig` exported from `vitest/config`. Verification: `node -e "const m = require('vitest/config'); console.log(typeof m.defineConfig)"` → `function`.

2. **Verify Layer 1 (grep)**: Confirm `check.cjs` imports from the real `vitest/config` path (not a fabricated path or non-existent export). Input: `scripts/check.cjs`. Output: confirmed `require('vitest/config')` line exists. Acceptance: grep for `vitest/config` matches. Verification: `grep 'vitest/config' scripts/check.cjs` → match.

3. **Verify Layer 2+3 (resolution + smoke run)**: Execute the script and confirm it exits 0. Input: `node scripts/check.cjs`. Output: `PASS: defineConfig({}) returned valid config` + exit 0. Acceptance: deterministic exit 0. Verification: `node scripts/check.cjs; echo $?` → `PASS...` + `0`.
</pre-plan>

`scripts/check.cjs`
```js
const { defineConfig } = require('vitest/config');

const config = defineConfig({});

if (!config || typeof config !== 'object') {
  console.error('FAIL: defineConfig({}) did not return a valid config object');
  process.exit(1);
}

console.log('PASS: defineConfig({}) returned valid config');
process.exit(0);
```

`package.json`
```json
{
  "name": "fix-003-bundle-gate-smoke-run",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "vitest": "^3.2.4"
  }
}
```

## Verification

- `grep 'vitest/config' scripts/check.cjs` — [ac-002] Layer 1: confirms real vitest/config import
- `node scripts/check.cjs && echo "EXIT: 0" || echo "EXIT: 1"` — [ac-001] Layer 3: smoke run exits 0
- `node -e "const m = require('vitest/config'); console.assert(typeof m.defineConfig === 'function', 'defineConfig missing')"` — Layer 2: runtime export resolves to a function