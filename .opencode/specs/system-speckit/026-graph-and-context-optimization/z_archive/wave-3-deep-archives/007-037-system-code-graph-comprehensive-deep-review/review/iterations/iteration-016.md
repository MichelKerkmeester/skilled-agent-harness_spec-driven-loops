# Iteration 016 — system-code-graph: Stress test suite design + coverage (stress_test/code-graph/)

## Summary

The stress test suite demonstrates comprehensive coverage of code-graph pressure scenarios including scan breadth, context assembly, degraded-mode behavior, change detection, CCC bridge integration, and DoS protection. Tests are well-structured with proper isolation using temporary workspaces. However, two test files appear misplaced (testing system-spec-kit coverage graph instead of code-graph), and several tests are skipped pending missing fixtures/dependencies.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md` (lines read: 156)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts` (lines read: 145)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts` (lines read: 170)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/ccc-integration-stress.vitest.ts` (lines read: 185)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` (lines read: 403)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts` (lines read: 145)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` (lines read: 291)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts` (lines read: 96)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/budget-allocator-stress.vitest.ts` (lines read: 51)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts` (lines read: 175)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/deep-loop-crud-stress.vitest.ts` (lines read: 271)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts` (lines read: 207)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts` (lines read: 230)
- `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/w10-degraded-readiness-integration.vitest.ts` (lines read: 91)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 016-P1-001 | deep-loop-crud-stress.vitest.ts:1-271 | Test file imports from system-spec-kit coverage graph modules (`../../../../system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.js`) instead of system-code-graph modules, testing wrong component | Misplaced tests create false coverage signal for code-graph when they actually test coverage-graph functionality | Move these tests to system-spec-kit stress test directory or remove if coverage-graph has its own stress suite |
| 016-P1-002 | deep-loop-graph-convergence-stress.vitest.ts:1-207 | Test file imports from system-spec-kit coverage graph handlers (`../../../../system-spec-kit/mcp_server/handlers/coverage-graph/convergence.js`) instead of system-code-graph, testing wrong component | Same misplaced test issue as deep-loop-crud-stress - tests coverage graph convergence not code-graph | Move to system-spec-kit stress test directory or remove if duplicate |
| 016-P1-003 | doctor-apply-mode-stress.vitest.ts:125,184 | Two tests skipped with REASON comment referencing "026/000/002-vitest-baseline-recovery-followup requires missing fixture, daemon, auth, or offline-unavailable toolchain" - critical apply-mode safety assertions are not being verified | Skipped tests cover read-only vs apply-mode boundary and scope awareness documentation - these are safety-critical for doctor apply mode that mutates config files | Restore missing fixtures/dependencies or implement alternative test approach that doesn't require external toolchain |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 016-P2-001 | ccc-integration-stress.vitest.ts:28-31 | CCC integration tests are conditionally skipped when binary unavailable (`hasCccBinary ? it : it.skip`) - reduces coverage in environments without CCC installed | Tests provide valuable integration coverage but are optional; skipping is reasonable but should be documented in README | Document conditional test execution in README.md §6 VALIDATION section |
| 016-P2-002 | walker-dos-caps.vitest.ts:12 | Test imports from system-spec-kit (`../../../../system-spec-kit/mcp_server/handlers/memory-index-discovery.js`) for spec discovery depth caps - cross-skill dependency | Test is valid for code-graph (spec discovery affects indexing) but creates cross-skill coupling | Consider if spec discovery depth caps should be tested in system-spec-kit instead |
| 016-P2-003 | README.md:40 | README states "Exercises walker caps and doctor apply-mode policy in disposable temp workspaces" but doesn't explicitly mention the two misplaced coverage-graph tests | Documentation doesn't reflect actual test composition after removing misplaced files | Update README §3 KEY FILES and §2 DIRECTORY TREE after addressing P1-001/P1-002 |

## Convergence Signal

newInfoRatio 0.65 vs prior iterations (first review of stress test suite; misplaced files and skipped tests discovered)
