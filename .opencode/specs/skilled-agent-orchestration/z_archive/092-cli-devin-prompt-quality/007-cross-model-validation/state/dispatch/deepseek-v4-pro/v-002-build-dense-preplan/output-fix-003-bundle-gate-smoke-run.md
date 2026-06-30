Let me verify the current state by running the check script to see if it already passes or fails.Let me dig deeper into what vitest/config actually exports, since there's only a `.d.ts` file visible.Let me check the broader intent of this fixture.Fixture is already correctly built. Here's the verification pre-plan and results:

<pre-plan>
## Step 1: Verify file existence and structure
- **Inputs**: CWD `fixtures/fix-003-bundle-gate-smoke-run/seed/`
- **Outputs**: Confirmation that `scripts/check.cjs` and `package.json` exist
- **Acceptance**: Both files exist and are readable
- **Verification**: `ls scripts/check.cjs package.json`
- **Stop**: If either file is missing, halt and investigate

## Step 2: Verify package.json declares vitest dependency
- **Inputs**: `package.json` (lines 1-8)
- **Outputs**: Confirmation that `vitest: ^3.2.4` is in `dependencies`
- **Acceptance**: grep `"vitest"` returns a match
- **Verification**: `node -e "const p = require('./package.json'); console.log(!!p.dependencies?.vitest)"`
- **Stop**: If vitest not declared, halt

## Step 3: Layer 1 grep check — script imports real vitest/config
- **Inputs**: `scripts/check.cjs` (line 1)
- **Outputs**: Confirmation the file contains `require('vitest/config')`
- **Acceptance**: grep `vitest/config` in the file
- **Verification**: grep `require('vitest/config')` scripts/check.cjs
- **Stop**: If no match, halt

## Step 4: Layer 3 smoke-run — script executes and exits 0
- **Inputs**: `scripts/check.cjs`, installed node_modules
- **Outputs**: PASS message, exit code 0
- **Acceptance**: `node scripts/check.cjs` exits 0 (deterministic)
- **Verification**: `node scripts/check.cjs; echo "EXIT: $?"`
- **Stop**: If exit != 0, halt and investigate vitest resolution

## Step 5: Runtime export verification — defineConfig is a real function
- **Inputs**: vitest package in node_modules
- **Outputs**: Confirmation `defineConfig` is typeof function
- **Acceptance**: `require('vitest/config').defineConfig` is a function
- **Verification**: `node -e "console.log(typeof require('vitest/config').defineConfig)"`
- **Stop**: If not a function, vitest version mismatch
</pre-plan>

### Executing verification steps:All 5 verification steps pass. Summary:

| Criterion | Result |
|-----------|--------|
| `scripts/check.cjs` exists | PASS |
| `package.json` declares vitest | PASS |
| **ac-002**: Layer 1 grep — `require('vitest/config')` on line 1 | PASS |
| **ac-001**: Layer 3 smoke-run — `node scripts/check.cjs` exits 0 | PASS |
| `defineConfig` is a real function at runtime | PASS |

No modifications needed — the fixture is already in a correct, deterministic-passing state. It serves as a positive control: a real `vitest/config` import that survives both grep (Layer 1) and smoke-run (Layer 3), catching any SWE 1.6 tendency to invent non-existent exports.