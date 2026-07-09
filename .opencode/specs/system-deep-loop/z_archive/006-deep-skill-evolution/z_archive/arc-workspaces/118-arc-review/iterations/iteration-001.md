# Iteration 1 — Correctness + Security (cli-devin swe-1.6)

## Summary

This iteration audited the deep-loop-runtime skill for correctness and security issues following the 118/003 ADR-001 script interface contract. The review covered all 4 .cjs script entry points (convergence.cjs, upsert.cjs, query.cjs, status.cjs) and 13 TypeScript lib modules across deep-loop/ and coverage-graph/. Overall, the implementation correctly follows the ADR-001 contract for CLI args, exit codes, DB lifecycle, and JSON output. Import paths are coherent post-move, with no stale references to old MCP server paths. Security posture is strong: all SQL queries use parameterized statements, and permissions-gate.ts correctly scopes writes. However, two P1 issues were identified: (1) missing path validation on `--spec-folder` and similar CLI args creates a path traversal risk, and (2) the DB open/close pattern in scripts lacks the documented `withDatabase` helper wrapper from ADR-001, instead using direct try/finally which is functionally correct but deviates from the contract's intended pattern.

## Findings

### P0 (Blockers)
None found.

### P1 (Required)

- [F-001] Missing path validation on CLI args — scripts/convergence.cjs:231, scripts/upsert.cjs:75, scripts/query.cjs:59, scripts/status.cjs:59 — The `--spec-folder` argument is passed directly to database and file operations without validation or normalization, creating a path traversal risk.
  Evidence: `const specFolder = ensureString(args, 'specFolder');` (convergence.cjs:231) - no validation before use in `db.getNodes(ns)` where `ns = { specFolder, loopType, sessionId }`
  Recommended fix: Add path validation using `path.resolve()` and check that the path is within expected bounds before use.

- [F-002] DB lifecycle pattern deviates from ADR-001 contract — scripts/convergence.cjs:243-342, scripts/upsert.cjs:153-172, scripts/query.cjs:71-111, scripts/status.cjs:68-95 — The scripts use direct try/finally with `db.closeDb()` instead of the documented `withDatabase(path, fn)` helper pattern from ADR-001.
  Evidence: `try { ... } finally { db.closeDb(); }` (convergence.cjs:340-342) - direct pattern instead of the documented shared helper
  Recommended fix: Either implement the documented `withDatabase` helper in `scripts/lib/db-open.cjs` and update all scripts to use it, or update ADR-001 to reflect the actual implementation pattern.

### P2 (Suggestions)

- [F-003] TSX loader path assumes specific directory structure — scripts/convergence.cjs:11-21, scripts/upsert.cjs:12-24, scripts/query.cjs:12-24, scripts/status.cjs:12-24 — The TSX_LOADER path is hardcoded to `../../../system-spec-kit/scripts/node_modules/tsx/dist/loader.mjs` which assumes a specific relative directory layout.
  Evidence: `const TSX_LOADER = path.resolve(__dirname, '..', '..', 'system-spec-kit', 'scripts', 'node_modules', 'tsx', 'dist', 'loader.mjs');` (convergence.cjs:11-14)
  Recommended fix: Consider making the TSX loader path configurable via environment variable or detecting it at runtime.

- [F-004] Lock file path in loop-lock.ts is relative to caller — lib/deep-loop/loop-lock.ts:175-191 — The `acquireLoopLock` function takes a `lockPath` parameter but doesn't validate or normalize it, and there's no default path construction shown.
  Evidence: `export function acquireLoopLock(lockPath: string, data: LoopLockData): LoopLockAcquireResult` (loop-lock.ts:175) - no path validation or default construction
  Recommended fix: Add a helper function to construct the default lock path relative to the skill's storage directory and validate the path is within expected bounds.

## Dimensions Covered This Iter

- **correctness**: Verified CLI args match ADR-001 contract across all 4 scripts. Verified exit codes (0/1/2/3) are correctly implemented. Verified DB lifecycle uses try/finally pattern. Verified import paths are coherent post-move with no stale references to old MCP server paths. Verified loop-lock.ts single-writer behavior preserved. Verified atomic-state.ts write-temp + rename pattern intact. Verified coverage-graph-db.ts SQLite path points to correct location and schema-creation is idempotent.

- **security**: Audited all SQL queries for injection risks - all use parameterized statements. Verified permissions-gate.ts correctly scopes writes to expected paths via glob matching. Checked for hardcoded secrets/credentials - none found. Identified path traversal risk in CLI arg validation (P1). Verified sandbox boundary is respected (scripts are read-only on review targets).

## Next-Iter Suggestions

- **traceability**: Iteration 2 should audit that all functions have adequate inline documentation, that error messages include sufficient context for debugging, and that the codebase has consistent logging patterns.
- **maintainability**: Iteration 2 should review code duplication across the 4 scripts (arg parsing, error handling patterns), assess test coverage for the lib modules, and check for consistent TypeScript strictness compliance.
- **cross-cutting**: Iteration 2 should verify the skill's SKILL.md and README.md accurately reflect the current implementation, validate that the feature_catalog and manual_testing_playbook are complete, and check that graph-metadata.json is correctly structured.

## Convergence Signal (self-report)

- newFindings: 4
- newFindingsRatio (vs prior iter): N/A (this is iter-1; baseline)
- evidence gate: PASS
- scope gate: PASS
- coverage gate: PASS
