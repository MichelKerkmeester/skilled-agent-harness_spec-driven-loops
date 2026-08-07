All acceptance criteria pass:

- **[ac-001] Smoke-run IS the acceptance (Layer 3)**: `node scripts/check.cjs` exits 0
- **[ac-002] Grep: real `vitest/config` import (Layer 1)**: confirmed on line 1 of `scripts/check.cjs`

### Files created

| File | Purpose |
|------|---------|
| `fixtures/fix-003-bundle-gate-smoke-run/seed/package.json` | Declares `vitest` dependency |
| `fixtures/fix-003-bundle-gate-smoke-run/seed/scripts/check.cjs` | Imports `vitest/config`, calls `defineConfig({})`, exits 0 on valid config |