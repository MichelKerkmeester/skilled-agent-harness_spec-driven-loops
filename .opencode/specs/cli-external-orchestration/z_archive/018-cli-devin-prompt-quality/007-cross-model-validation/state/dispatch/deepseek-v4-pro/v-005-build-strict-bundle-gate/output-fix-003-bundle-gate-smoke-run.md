Let me verify the vitest dependency is installed and the export exists.vitest isn't installed. Need to run `npm install` first.Now let me verify the vitest/config export exists.`defineConfig` is confirmed at `node_modules/vitest/dist/config.cjs:145`. Now let me think through the bundle-gate systematically.Let me run the smoke test to verify:Smoke-run passes with exit 0. The existing code is correct. Here is the deliverable:

---

<pre-plan>
## Step 1 — Verify seed state (read inputs)
- **Inputs:** `package.json` (exists, has `vitest: ^3.2.4`), `scripts/check.cjs` (exists, already coded), `node_modules/` (vitest not installed initially)
- **Outputs:** Same files, no writes yet
- **Acceptance:** All input files readable, package.json dependency list known
- **Verify:** `cat package.json | grep vitest`
- **Stop if:** package.json is missing or doesn't declare vitest
- **Bundle-gate self-check L1:** `vitest` is in `package.json` dependencies ✓

## Step 2 — Install dependencies (npm install)
- **Inputs:** `package.json` with vitest declared, `node_modules/` missing vitest
- **Outputs:** `node_modules/vitest/` populated, transitive deps (vite, std-env) installed
- **Acceptance:** `node_modules/vitest/dist/config.cjs` exists
- **Verify:** `test -f node_modules/vitest/dist/config.cjs && echo "FOUND"`
- **Stop if:** npm install fails or vitest/config.cjs not found after install

## Step 3 — Verify vitest/config exports (Layer 1 + Layer 2 grep)
- **Inputs:** `node_modules/vitest/dist/config.cjs` (installed in Step 2), `node_modules/vitest/package.json` (exports map)
- **Outputs:** Confirmed: `exports.defineConfig = defineConfig` at config.cjs:145, exports map proves `require('vitest/config')` → `./dist/config.cjs`
- **Acceptance:** `defineConfig` is a real named export of `vitest/config`
- **Verify:** `grep -n "exports.defineConfig" node_modules/vitest/dist/config.cjs`
- **Stop if:** `defineConfig` not found among exports
- **Bundle-gate L1:** `require('vitest/config')` resolves to `package.json` dep `vitest` + export map `./config` ✓
- **Bundle-gate L2:** Script has no exports (consumer-only script) — vacuous pass ✓

## Step 4 — Smoke-run (Layer 3)
- **Inputs:** `scripts/check.cjs` (imports vitest/config, calls defineConfig({})), installed node_modules
- **Outputs:** Exit code 0, stdout "PASS: defineConfig({}) returned valid config"
- **Acceptance:** `node scripts/check.cjs` exits 0
- **Verify:** `node scripts/check.cjs; echo "EXIT=$?"` → EXIT=0
- **Stop if:** non-zero exit or "FAIL" output
- **Bundle-gate L3:** Smoke-run is the acceptance — exit 0 confirms ✓

## Step 5 — Final bundle-gate 3-layer status
- **Layer 1 (imports grep):** `require('vitest/config')` — `vitest` ∈ package.json dependencies ✓
- **Layer 2 (exports grep):** Zero exports in consumer script — no malformed exports ✓
- **Layer 3 (smoke-run):** `node scripts/check.cjs` → PASS, exit 0 ✓
- **All 3 layers pass.** No code rewrite needed — seed script was correct on arrival.
</pre-plan>

---

**Verification commands (inline):**

```bash
# Layer 1 — imports grep
grep -n "require\|import" scripts/check.cjs
# => 1: const { defineConfig } = require('vitest/config');
# vitest ∈ package.json dependencies ✓

# Layer 2 — exports grep
grep -n "exports\|module.exports" scripts/check.cjs
# => (no output) — consumer script, no exports needed ✓

# Layer 3 — smoke-run (acceptance)
node scripts/check.cjs; echo "EXIT=$?"
# => PASS: defineConfig({}) returned valid config
# => EXIT=0 ✓
```

**[ac-001]** PASS — `node scripts/check.cjs` exits 0 (smoke-run IS the acceptance, Layer 3).
**[ac-002]** PASS — `require('vitest/config')` resolves to real `vitest` dep in `package.json` (Layer 1).