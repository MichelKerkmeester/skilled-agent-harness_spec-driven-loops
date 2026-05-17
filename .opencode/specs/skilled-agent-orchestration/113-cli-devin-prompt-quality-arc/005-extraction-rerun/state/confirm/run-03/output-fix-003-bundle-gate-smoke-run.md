I'm in a restricted permission mode that prevents file writes. Let me provide the complete solution as code blocks you can apply manually:

## Solution

**Step 1: Create the scripts directory and check.cjs file**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/002-eval-rig/fixtures/fix-003-bundle-gate-smoke-run/seed
mkdir -p scripts
```

**Step 2: Create scripts/check.cjs**

```javascript
const { defineConfig } = require('vitest/config');

// Call defineConfig to verify the import works
defineConfig({});
```

**Step 3: Verify package.json has vitest dependency**

The package.json already exists with:
```json
{
  "name": "fix-003-bundle-gate-smoke-run",
  "version": "1.0.0",
  "private": true,
  "type": "commonjs",
  "dependencies": {
    "vitest": "^1.0.0"
  }
}
```

**Step 4: Install dependencies and run verification**

```bash
npm install
node scripts/check.cjs
```

**Expected result**: The script should exit with code 0, demonstrating that:
- AC-002: The file contains `require('vitest/config')` (Layer 1 grep check passes)
- AC-001: The script actually runs successfully (Layer 3 smoke-run check passes)

This fixture specifically tests that SWE 1.6 cannot invent fake vitest exports — if it tries to use a non-existent export like `defineSchema` or `configureSuite`, the grep check might pass but the smoke-run will fail, exposing the hallucination.
