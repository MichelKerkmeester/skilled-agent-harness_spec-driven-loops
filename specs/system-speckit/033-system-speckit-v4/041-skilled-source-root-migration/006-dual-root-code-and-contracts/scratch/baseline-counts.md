# Baseline counts at the start commit

Every command in `plan.md` §5, run on 2026-09-17 in worktree 055 at `cfeba3e1fb` with fresh `dist/` trees. `dist-freshness.cjs check --package <id> --json` read `"stale":false` for `system-spec-kit/shared`, `system-spec-kit/runtime/cli` and `system-skill-advisor/runtime` before the run. Each count is read from the command's printed result, and every command exited 0.

| ID | Command (working directory) | Result |
|----|-----------------------------|--------|
| b01 | `npx vitest run --config ../../vitest.config.ts --project cli tests/package-root-parity.vitest.ts tests/workspace-identity.vitest.ts tests/spec-root-validation-matrix.vitest.ts tests/spec-root-config-precedence.vitest.ts` (`runtime/cli`) | 4 files, 21 tests passed |
| b02 | The same with `tests/spec-root-*.vitest.ts` (`runtime/cli`) | 13 files, 56 tests passed |
| b03 | `npm run test:legacy` (`runtime/cli`) | `test-scripts-modules.js` 262 passed, 0 failed, 5 skipped. `test-extractors-loaders.js` 267 passed, 0 failed, 6 skipped |
| b04 | `node tests/test-folder-detector-functional.js` (`runtime/cli`) | `RESULTS: 14 passed, 0 failed, 0 skipped` |
| b05 | `npx vitest run tests/utils/workspace-root.vitest.ts tests/schemas/advisor-tool-schemas.vitest.ts` (advisor runtime) | 2 files, 26 tests passed |
| b06 | `node --test .opencode/bin/mcp-code-mode-launcher.test.cjs` (repository root). The installer test does not exist yet | 4 tests: 1 pass, 3 skipped because the vendored server is not installed here |
| b07 | `npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts` (`.opencode`) | 1 file, 25 tests passed |
| b08 | `npx vitest run --no-coverage tests/unit/check-contract-drift.vitest.ts` (deep-loop runtime) | 1 file, 8 tests passed |
| b09 | `bash .opencode/bin/tests/worktree-session.test.sh` | `worktree-session tests: PASS=25 FAIL=0` |
| b10 | `bash .opencode/bin/tests/relink-local-specs.test.sh` | Absent at the start commit |
| b11 | `node --test .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` | 90 tests: 87 pass, 0 fail, 3 skipped |
| b12 | `npm run typecheck` (`.opencode/skills/system-spec-kit`) | Exit 0, no diagnostics |
| b13 | `npm run typecheck` (advisor runtime) | Exit 0, no diagnostics |
| b14 | `node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3` |
| b15 | `node .opencode/bin/check-no-spec-imports.cjs` with no argument, then with the CI `positive` and `negative` fixtures | Default: `ok: no spec-tree imports in 29 runtime file(s) across 1 dir(s)`, exit 0. Positive: exit 1. Negative: `ok` over 1 file, exit 0 |

The suites for the five root-discovery twins and the git hook installer are recorded beside their units, before any of those files change.
