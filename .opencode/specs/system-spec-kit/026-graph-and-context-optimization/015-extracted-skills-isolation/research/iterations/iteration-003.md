# Iteration 3: Test Coupling Classification

## Focus
Classify all 19 test files that couple spec-kit to extracted skills: distinguish tests that should MOVE to the owning skill, CONVERT to mock the boundary, or are LEGITIMATE in spec-kit.

## Findings

### 3.1 Tests to MOVE to system-code-graph (9 tests)

These tests primarily exercise code that lives in system-code-graph. They should be moved to `system-code-graph/mcp_server/tests/`.

| # | File | Justification |
|---|------|---------------|
| 1 | `tests/startup-brief.vitest.ts` | Tests `buildStartupBrief`, code-graph-db operations, graph-readiness snapshot — all code-graph behaviors. |
| 2 | `tests/runtime-detection.vitest.ts` | Tests `detectRuntime`, `areHooksAvailable`, `getRecoveryApproach` from `runtime-detection.js` — lives in code-graph. |
| 3 | `tests/runtime-routing.vitest.ts` | Tests `classifyQueryIntent` from `query-intent-classifier.js` — lives in code-graph. |
| 4 | `tests/readiness-contract.vitest.ts` | Tests `canonicalReadinessFromFreshness`, `buildReadinessBlock` from `readiness-contract.js` — lives in code-graph. |
| 5 | `tests/query-intent-classifier.vitest.ts` | Tests `classifyQueryIntent` keyword-scoring — lives in code-graph. |
| 6 | `tests/ensure-ready.vitest.ts` | Tests `ensureCodeGraphReady`, `getGraphFreshness` from `ensure-ready.js` — lives in code-graph. |
| 7 | `tests/compact-merger.vitest.ts` | Tests `mergeCompactBrief` from `compact-merger.js` — lives in code-graph. |
| 8 | `tests/budget-allocator.vitest.ts` | Tests `allocateBudget`, `DEFAULT_FLOORS` from `budget-allocator.js` — lives in code-graph. |
| 9 | `stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts` | Tests `handleCodeGraphQuery` from code-graph's `handlers/query.js` — code-graph query behavior. |

### 3.2 Tests to MOVE to system-skill-advisor (2 tests)

| # | File | Justification |
|---|------|---------------|
| 10 | `tests/spec-kit-skill-advisor-plugin.vitest.ts` | Tests `SpecKitSkillAdvisorPlugin` from `plugins/spec-kit-skill-advisor.js` — advisor plugin behavior. |
| 11 | `stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | Tests advisor plugin bridge under stress — skill-advisor bridge behavior. |

### 3.3 Tests to CONVERT-to-mocks in spec-kit (6 tests)

These tests validate spec-kit's own behavior at the boundary. They should stay but use mocks instead of real imports.

| # | File | Justification |
|---|------|---------------|
| 12 | `tests/session-resume.vitest.ts` | Tests spec-kit's `handleSessionResume` handler and resume ladder; code-graph imports already mocked, just need to point mocks at local routes instead of cross-skill paths. |
| 13 | `tests/opencode-transport.vitest.ts` | Tests spec-kit's `buildOpenCodeTransportPlan`; only uses `CodeGraphOpsContract` as a type — can become local type. |
| 14 | `tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts` | Tests spec-kit's hook-state quarantine; `buildStartupBrief` used as supporting assertion only — mock it. |
| 15 | `tests/handler-memory-search-live-envelope.vitest.ts` | Tests spec-kit's `handleMemorySearch` and envelope capture; `getGraphReadinessSnapshot` already mocked — keep, just update mock path. |
| 16 | `tests/crash-recovery.vitest.ts` | **SPLIT**: Primary suite (lines 370-876) tests spec-kit's session-manager — KEEP with mocks. Secondary "code-graph SQLite recovery" suite (lines 878-1051) — MOVE to code-graph. |
| 17 | `tests/dual-scope-hooks.vitest.ts` | Tests spec-kit's `autoSurfaceAtToolDispatch` from hooks/memory-surface; compact-merger import used only in final integration test — mock it. |

### 3.4 Legitimate test in spec-kit (1 test)

| # | File | Justification |
|---|------|---------------|
| 18 | `tests/graph-readiness-mapper.vitest.ts` | Tests spec-kit's own `mapGraphReadinessToTelemetry` function in `lib/search/graph-readiness-mapper.js`. Only imports `GraphReadinessSnapshot` as a type for fixture typing. The mapper is a spec-kit-owned telemetry adapter. |

### 3.5 Additional tests with code-graph mock references (indirect coupling)

These test files use `vi.doMock` / `vi.mock` with system-code-graph paths but do NOT import real code-graph symbols. They should stay in spec-kit with mock path updates:
- `tests/hook-session-start.vitest.ts` (mocks `startup-brief.js`)
- `tests/structural-contract.vitest.ts` (mocks `indexer-types.js`, `code-graph-db.js`, `ensure-ready.js`, `structural-indexer.js`)
- `tests/symlink-realpath-hardening.vitest.ts` (mocks `code-graph-db.js`, imports `indexer-types.js` dynamically)
- `tests/session-resume-auth.vitest.ts` (mocks `code-graph-db.js`, `ensure-ready.js`)
- `tests/graph-payload-validator.vitest.ts` (mocks `ensure-ready.js`, `code-graph-db.js`, dynamically imports `handleCodeGraphQuery`)
- `tests/index-scope.vitest.ts` (mocks `code-graph-db.js`, dynamically imports `structural-indexer.js`)
- `tests/graph-first-routing-nudge.vitest.ts` (mocks `startup-brief.js`, `code-graph-context.js`)
- `tests/gate-d-regression-intent-routing.vitest.ts` (mocks `query-intent-classifier.js`, `code-graph-context.js`)
- `stress_test/session/gate-d-benchmark-session-resume.vitest.ts` (mocks `code-graph-db.js`, `ensure-ready.js`)

These 9 files have INDIRECT coupling only — their mock strings reference `../../../system-code-graph/` paths. After decoupling, these mock paths need updating but the test logic stays.

### 3.6 Summary table

| Category | Count | Action |
|----------|-------|--------|
| MOVE to code-graph | 9 | `git mv` to `system-code-graph/mcp_server/tests/`; update vitest config |
| MOVE to skill-advisor | 2 | `git mv` to `system-skill-advisor/mcp_server/tests/`; update vitest config |
| CONVERT to mocks | 6 | Stay in spec-kit; replace cross-skill imports with local mocks |
| LEGITIMATE | 1 | Stay in spec-kit; update type import path only |
| INDIRECT (mock paths) | 9 | Stay in spec-kit; update mock path strings |
| **Total direct coupling** | **18** | |
| **Total including indirect** | **27** | |

## Sources Consulted
- [SOURCE: file] All 19 test files with system-code-graph/system-skill-advisor imports
- [SOURCE: file] Each test's import statements, `describe()` blocks, and primary assertions

## Assessment
- **New information ratio: 0.65**
  - 2 fully new (precise classification of all 19 tests into MOVE/CONVERT/LEGITIMATE; discovery of additional 9 INDIRECT mock-referencing files)
  - 1 refinement (crash-recovery.vitest.ts needs SPLIT not simple MOVE)
  - 0 redundant
- **Questions addressed**: Q4 (test coupling)
- **Questions answered**: Q4 (complete)

## Reflection
- **What worked**: Reading actual test descriptions and assertions to determine what is the "subject under test" was critical — many tests looked like they tested code-graph (by import) but actually tested spec-kit integration.
- **What did not work**: The boundary between CONVERT-to-mocks and CONVERT-to-MCP-runtime is blurry. For most spec-kit handler tests, mocks are more practical than MCP runtime calls (MCP calls add serialization overhead and require a running server). The decision framework should be: use MCP runtime for integration tests, mocks for unit tests.
- **What I would do differently**: The next iterations should focus on strategy evaluation now that the full coupling picture is clear.

## Recommended Next Focus
Iter-4: Strategy evaluation — evaluate Strategies A (shared types), B (MCP runtime) against the concrete coupling data. Now that we know the exact symbols and their categories (type-only vs value), we can produce accurate cost estimates.
