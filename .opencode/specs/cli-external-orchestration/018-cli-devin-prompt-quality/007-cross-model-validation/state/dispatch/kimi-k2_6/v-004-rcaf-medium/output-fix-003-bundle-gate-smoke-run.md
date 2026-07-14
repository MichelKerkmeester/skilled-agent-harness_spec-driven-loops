**Sequential thinking (5+ verification steps):**

1. **Requirement analysis**: The fixture requires `scripts/check.cjs` to import `defineConfig` from the real `vitest/config` subpath, invoke it with `{}`, and exit 0 — this is Layer 3 (smoke-run) of the bundle gate. A hallucinated export would pass grep (Layer 1) but fail at runtime.

2. **Package export verification**: I inspected `node_modules/vitest/package.json` and confirmed the exports map contains `"./config": { "require": "./dist/config.cjs", ... }`, which means `require('vitest/config')` from a `.cjs` file resolves to a real CommonJS module.

3. **Runtime export verification**: I read `node_modules/vitest/dist/config.cjs` and verified `defineConfig` is explicitly exported (`exports.defineConfig = defineConfig`) and its implementation is `function defineConfig(config) { return config; }`.

4. **Script logic verification**: The existing `scripts/check.cjs` destructures `defineConfig` from `vitest/config`, calls it with `{}`, validates the return is truthy and typeof `'object'`, logs PASS, and calls `process.exit(0)`. This path is deterministic and will succeed because `{}` is truthy and an object.

5. **Dependency closure check**: `node_modules` is fully populated (including `vite` and `std-env` which `dist/config.cjs` requires), so runtime resolution will not throw on missing transitive deps.

---

<pre-plan>
1. **Verify vitest/config export availability**
   - *Input:* `node_modules/vitest/package.json` exports map + `dist/config.cjs`
   - *Output:* Confirmation that `require('vitest/config')` exposes `defineConfig` in CJS context
   - *Acceptance:* `"require": "./dist/config.cjs"` exists AND `exports.defineConfig` is present in that file
   - *Verification:* `grep '"require": "./dist/config.cjs"' node_modules/vitest/package.json` + `grep 'exports.defineConfig' node_modules/vitest/dist/config.cjs`

2. **Construct / verify scripts/check.cjs**
   - *Input:* Fixture acceptance criteria (import `vitest/config`, call `defineConfig({})`, exit 0)
   - *Output:* A `.cjs` script that requires the real export, invokes it, validates the return, and exits 0 on success
   - *Acceptance:* Script contains `require('vitest/config')` and `defineConfig({})`, exits 0 deterministically
   - *Verification:* `cat scripts/check.cjs`

3. **Smoke-run validation (Layer 3)**
   - *Input:* The `scripts/check.cjs` file + installed `node_modules`
   - *Output:* Process exits with code 0 and emits PASS message
   - *Acceptance:* `node scripts/check.cjs` returns exit code 0
   - *Verification:* `node scripts/check.cjs && echo "Exit code: $?"`
</pre-plan>

`fixtures/fix-003-bundle-gate-smoke-run/seed/scripts/check.cjs`
```js
// scripts/check.cjs — Bundle-gate 3-layer smoke-run validator
// Layer 1 (grep): must reference real vitest/config export
// Layer 3 (smoke-run): executing this script must exit 0

const { defineConfig } = require('vitest/config');

const config = defineConfig({});

if (!config || typeof config !== 'object') {
  console.error('FAIL: defineConfig({}) did not return a valid config object');
  process.exit(1);
}

console.log('PASS: defineConfig({}) returned valid config');
process.exit(0);
```

`fixtures/fix-003-bundle-gate-smoke-run/seed/package.json`
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
- `cd fixtures/fix-003-bundle-gate-smoke-run/seed && node scripts/check.cjs` — must print `PASS: defineConfig({}) returned valid config` and exit 0
- `grep -q "require('vitest/config')" fixtures/fix-003-bundle-gate-smoke-run/seed/scripts/check.cjs` — Layer 1 (grep) confirms real import path is present
- `grep -q "defineConfig({})" fixtures/fix-003-bundle-gate-smoke-run/seed/scripts/check.cjs` — confirms the function is actually invoked

---

**Acceptance status:**
- [ac-001] **PASS** — Smoke-run is the acceptance: running `node scripts/check.cjs` exits 0 deterministically because `defineConfig({})` returns `{}` (truthy object).
- [ac-002] **PASS** — Grep layer satisfied: the script imports from the real `vitest/config` subpath (`require('vitest/config')`), not a hallucinated export. Verified against `node_modules/vitest/dist/config.cjs` which exports `defineConfig`.
