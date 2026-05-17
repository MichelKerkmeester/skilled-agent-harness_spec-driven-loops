Let me use sequential thinking as required, then investigate the fixture context more deeply.<pre-plan>

## Pre-Plan: fix-003-bundle-gate-smoke-run

### Step 1 — Verify `vitest/config` import path exists
- **Action:** Confirm `vitest/config` is a real export path by checking `node_modules/vitest/package.json` exports map.
- **Acceptance criterion:** `"./config"` entry exists with `"require": "./dist/config.cjs"`.
- **Source:** `package.json` exports `"./config"` → `dist/config.cjs` (verified at `seed/node_modules/vitest/package.json:77-81`).
- **Verification:** `node -e "console.log(require.resolve('vitest/config'))"` prints a real path.

### Step 2 — Verify `defineConfig` is a real export from `vitest/config`
- **Action:** Confirm `dist/config.cjs` exports `defineConfig` as a named export.
- **Acceptance criterion:** File contains `exports.defineConfig = defineConfig` or equivalent.
- **Source:** `dist/config.cjs:145` — `exports.defineConfig = defineConfig;`.
- **Verification:** `grep` the export line in `node_modules/vitest/dist/config.cjs`.

### Step 3 — Write `scripts/check.cjs` and smoke-run
- **Action:** Create/verify `scripts/check.cjs` that `require('vitest/config')`, calls `defineConfig({})`, and exits 0 on success.
- **Acceptance criterion (ac-001):** `node scripts/check.cjs` exits 0 — this IS Layer 3 of the bundle-gate.
- **Verification:** `node scripts/check.cjs && echo "EXIT 0: PASS"`.

</pre-plan>

**Result:** The seed script at `scripts/check.cjs` is already correct and passes all 3 bundle-gate layers:

| Layer | Gate | Status | Evidence |
|-------|------|--------|----------|
| 1 | grep | PASS | `require('vitest/config')` matches real export in `package.json:77-81` |
| 2 | parse | PASS | Valid CJS syntax, no syntax errors |
| 3 | smoke-run | PASS | `node scripts/check.cjs` → `PASS: defineConfig({}) returned valid config`, exit 0 |

- **[ac-001]** Smoke-run IS the acceptance: `node scripts/check.cjs` exits 0.
- **[ac-002]** Grep: imports real `vitest/config` (not a hallucinated path).

No changes needed — the Phase B regression (2 P0s past grep-only gate) is already resolved.