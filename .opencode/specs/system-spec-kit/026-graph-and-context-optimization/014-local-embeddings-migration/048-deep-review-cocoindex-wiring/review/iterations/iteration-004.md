# Iteration 4: Maintainability

## Focus
D4 Maintainability — Helper extraction quality, test coverage gaps, code readability, dependency surface, naming consistency.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 2 (`run-mcp-direct.mjs`, `shared-daemon-runner-helpers.vitest.ts`)
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.06

## Findings

### P2 — Suggestion

- **F011**: Test coverage uses fallback keys, not the primary keys used in production — `shared-daemon-runner-helpers.vitest.ts:48-53`
  - **Evidence**: The `selectClientForServer` test passes `{ memory, cocoindex }` with fallback key names. The function at `run-mcp-direct.mjs:127-128` checks `clients.spec_kit_memory ?? clients.memory ?? null` and `clients.cocoindex_code ?? clients.cocoindex ?? null`. The test only exercises the fallback path (`clients.memory`, `clients.cocoindex`), not the primary keys (`clients.spec_kit_memory`, `clients.cocoindex_code`) that the actual `main()` function uses at lines 566-569. If the primary-key check were broken, the test would still pass via the fallback.
  - **Category**: maintainability
  - **Recommendation**: Add a test with primary key names: `selectClientForServer({ spec_kit_memory: memory, cocoindex_code: cocoindex }, 'spec_kit_memory')`. This ensures the primary key path is covered. Also test with both primary and fallback keys present to verify primary takes precedence.

- **F012**: Minimal test coverage — only 2 of 14+ exported helper functions tested — `shared-daemon-runner-helpers.vitest.ts:1-55`
  - **Evidence**: The vitest file tests `parseScenarioToolCalls` (1 test) and `selectClientForServer` (1 test). Untested exports include `parseScenarioList`, `normalizeArguments`, `normalizeToolName`, `findMatchingParen`, `parseObjectLiteral`, `responseFailureMessage`, `isTransientCocoIndexFailure`, `parseToolJson`, `createCappedStderrStream`, and the entire `callScenarioTool` retry path. The test file name says "runner helpers" but only covers 2 of the 6 exported helpers (`parseScenarioToolCalls`, `selectClientForServer`) — `parseArgs`, `findScenarioFile`, `section`, `writeSummary` are not exported and don't need coverage.
  - **Category**: maintainability
  - **Recommendation**: The test suite is adequate for a sandbox evidence runner (not a production service), but the following would improve confidence: (a) `parseScenarioList` test for range parsing, dedup, single values; (b) `normalizeArguments` test for `num_results`→`limit` alias with `limit` already present; (c) `isTransientCocoIndexFailure` pattern test; (d) `responseFailureMessage` edge case test. For a test-infra packet (per commit message `feat(test-infra,045)`), the current coverage is reasonable but thin.

- **F013**: Deep relative import path fragile to file moves — `shared-daemon-runner-helpers.vitest.ts:6`
  - **Evidence**: Line 6: `import { parseScenarioToolCalls, selectClientForServer } from '../../../../../_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs';`. The 6-level deep relative path (`../../../../../`) is fragile — if either the test or the runner is moved, the import breaks silently. While this follows the project convention for sandbox evidence files, it's harder to maintain than a workspace-relative or alias-based import.
  - **Category**: maintainability
  - **Recommendation**: If the project adopts a `@sandbox/` or `@evidence/` import alias, update this path. Alternatively, copy the helpers into the MCP server's test helpers to avoid cross-tree imports. Not urgent (P2).

- **F014**: `runGenericScenario` mixes availability check, call execution, and result assembly — `run-mcp-direct.mjs:422-483`
  - **Evidence**: The function is ~61 lines with three distinct phases: (1) parse + availability check (lines 423-444, 21 lines), (2) call execution loop (lines 446-476, 30 lines), and (3) result assembly at line 477-482. The call execution loop has deep nesting (for → if parseError → selectClient → callScenarioTool → failureMessage). While the function is readable, extracting the availability precheck into `checkToolAvailability(clients, toolNameSets, calls)` and the execution into `executeScenarioCalls(clients, calls)` would make each piece more testable and the main function trivially composed.
  - **Category**: maintainability
  - **Recommendation**: Extract `checkToolAvailability` and `executeScenarioCalls` as pure functions. This would also enable unit-testing the availability logic and the call execution path independently. Low priority (P2) since the function is already correct and readable.

### Confirmed Good

| Aspect | Assessment | Evidence |
|--------|-----------|----------|
| Helper factoring | Good | 14 well-named functions, single-responsibility, no god objects. |
| Import management | Clean | Only Node.js built-in imports (no new npm deps). MCP SDK resolved via `createRequire`. |
| Code organization | Clean | Constants → imports → helpers → executors → main. Linear flow. |
| Naming consistency | Good | `connectSharedClient`, `selectClientForServer`, `createCappedStderrStream` — descriptive verb-noun patterns. |
| File size | Acceptable | 591 lines for a full suite runner with two transports, latency scenario, and evidence writing. |
| No dead code | Clean | All functions are called; no unused imports. |
| Dependency surface | Minimal | Only new built-in imports: `execFile`, `promisify`, `performance`. No new packages. |

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | spec.md:83 | "Add a small parser helper unit test if straightforward" — test added, covers parser+routing. |
| checklist_evidence | pass | hard | checklist.md:65-66 | CHK-013 "Code follows project patterns" — confirmed. Node ESM, scoped helpers, explicit verification paths. |

## Assessment
- New findings ratio: 0.06 (4 P2 maintainability findings)
- Dimensions addressed: maintainability
- Novelty justification: All 4 findings are new. F011 (test keys vs production keys) is the most impactful — a test passing through a fallback path means the primary path is untested. F012 (coverage thinness) is expected for a sandbox runner. F013 (fragile import) and F014 (extract more helpers) are refinements.
- Overall maintainability is good: the code is clean, well-factored, uses only built-in Node.js modules, and follows project conventions. The 2-test vitest suite is minimal but covers the two most critical helpers (parser and routing).

## Ruled Out
- **New transitive npm dependencies**: The only new imports are Node.js built-ins (`execFile`, `promisify`, `performance`). MCP SDK was already a dependency. Clean.
- **Dead code or unused exports**: All functions are called internally; `parseScenarioToolCalls` and `selectClientForServer` are exported for testing only. `parseArgs`, `findScenarioFile`, `section`, `writeSummary` are internal and correctly not exported.
- **Comment necessity**: Project convention is minimal comments. Function names are self-documenting.

## Dead Ends
None.

## Recommended Next Focus
All 4 dimensions are now covered. Proceed to convergence check. Perception: new-finding rates were 0.28 (It-1), 0.05 (It-2), 0.04 (It-3), 0.06 (It-4). The rolling trend is well below the 0.10 convergence threshold after It-2. A stabilization pass (It-5) should re-check the highest-risk files for any missed findings, then synthesize.
