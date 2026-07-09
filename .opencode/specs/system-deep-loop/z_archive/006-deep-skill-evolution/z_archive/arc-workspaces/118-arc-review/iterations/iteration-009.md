# Iteration 9 — Cross-Finding Adjudication

## Summary

Adjudicated 15 P1 findings from iterations 1-8. Results: 13 confirmed, 1 false-positive, 1 duplicate. The false-positive (F-006) was a misreading of the manual testing playbook link structure. F-021 is a duplicate of F-002 (both describe the same ADR-001 drift issue). After adjudication: 12 unique confirmed P1 findings remain.

## Per-Finding Adjudication

### F-001 [Missing path validation on CLI args]
- **Status**: CONFIRMED
- **Evidence**: `const specFolder = ensureString(args, 'specFolder');` (convergence.cjs:231) - no path validation before use in database operations. The ENV_ALLOWLIST hardening added in commit f8f3bdcac6 addresses executor environment variables but does not validate CLI argument paths.
- **Action**: Keep as P1

### F-002 [DB lifecycle pattern deviates from ADR-001 contract]
- **Status**: CONFIRMED
- **Evidence**: ADR-001 line 80 documents: "A shared helper `.opencode/skills/deep-loop-runtime/scripts/lib/db-open.cjs` exposes `openDatabase(path)` and `withDatabase(path, fn)`." This file does not exist. Scripts use direct pattern: `try { ... } finally { db.closeDb(); }` (convergence.cjs:340-342).
- **Action**: Keep as P1

### F-005 [System-code-graph feature catalog entries reference stale MCP handler paths]
- **Status**: CONFIRMED
- **Evidence**: Feature catalog still references deleted paths: `|| .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:42-120 | Handler | validates namespace fields and routes query types |` (01-deep-loop-graph-query.md:41-43). The handlers directory was deleted in arc 118.
- **Action**: Keep as P1

### F-006 [Manual testing playbook cross-reference index uses inconsistent file naming]
- **Status**: FALSE-POSITIVE
- **Evidence**: The cross-reference index links are correct: `[01--executor/001-executor-config.md](01--executor/001-executor-config.md)` (manual_testing_playbook.md:398). The file actually exists at that relative path. The finding misread the link structure.
- **Action**: Drop

### F-010 [Script tests lack exit-code coverage for error paths]
- **Status**: CONFIRMED
- **Evidence**: All 4 script tests only assert exit code 3: `expect(result.exitCode).toBe(3);` (convergence-script.vitest.ts:65). Missing coverage for exit 1 (script error) and exit 2 (DB error) as specified in ADR-001 contract.
- **Action**: Keep as P1

### F-011 [DB lifecycle test does not exercise overlapping-writer lock semantics]
- **Status**: CONFIRMED
- **Evidence**: Test runs sequential invocations: `const upsert = runScript('upsert', [...]); const query = runScript('query', [...]);` (db-open-close.vitest.ts:25-36). It checks `SQLITE_BUSY` does not appear but never spawns concurrent writers to actually test lock rejection.
- **Action**: Keep as P1

### F-014 [001 tasks.md completion_pct is 5 despite phase being complete]
- **Status**: CONFIRMED
- **Evidence**: `completion_pct: 5` (001/tasks.md:26) with all tasks unchecked `[ ]`, but implementation-summary.md states "Status: Complete" (line 38).
- **Action**: Keep as P1

### F-015 [002 tasks.md completion_pct is 5 despite bundled completion]
- **Status**: CONFIRMED
- **Evidence**: `completion_pct: 5` (002/tasks.md:18) with all tasks unchecked, but implementation-summary.md states "Status: Complete as part of bundled 002+003+004+005 dispatch" (line 33).
- **Action**: Keep as P1

### F-016 [003 tasks.md completion_pct is 5 despite bundled completion]
- **Status**: CONFIRMED
- **Evidence**: `completion_pct: 5` (003/tasks.md:19) with all tasks unchecked, but implementation-summary.md states "Status: Complete as part of bundled 002+003+004+005 dispatch" (line 31).
- **Action**: Keep as P1

### F-017 [004 tasks.md completion_pct is 5 despite bundled completion]
- **Status**: CONFIRMED
- **Evidence**: `completion_pct: 5` (004/tasks.md:23) with all tasks unchecked, but implementation-summary.md states "Status: Complete as part of bundled 002+003+004+005 dispatch" (line 31).
- **Action**: Keep as P1

### F-021 [ADR-001 implementation drift — shared helper not implemented]
- **Status**: DUPLICATE OF F-002
- **Evidence**: Same issue as F-002 - ADR-001 documents `withDatabase` helper that doesn't exist. This is a duplicate finding.
- **Action**: Drop (duplicate)

### F-022 [ADR-004 incomplete deletion — coverage-graph README.md still references deleted tools]
- **Status**: CONFIRMED
- **Evidence**: README still lists deleted handlers: `+-- upsert.ts        # deep_loop_graph_upsert handler` (coverage-graph/README.md:71-74). Entry points table also references deleted tools (lines 152-155). The handlers directory no longer exists.
- **Action**: Keep as P1

### F-026 [deep-research changelog missing arc 118 dependency switch entry]
- **Status**: CONFIRMED
- **Evidence**: Changelog entries v1.7.0.0 through v1.11.0.0 contain no entry for the deep-loop-runtime dependency switch from arc 118. Deep-review changelog v1.4.0.0 documents this transition, but deep-research's does not.
- **Action**: Keep as P1

### F-027 [state_format.md documents PostDispatchValidateInput incorrectly]
- **Status**: CONFIRMED
- **Evidence**: Documentation shows `deltaPath` (state_format.md:132) but actual code uses `deltaFilePath` (post-dispatch-validate.ts:29). Documentation missing required fields `previousStateLogSize` and `requiredJsonlFields` (lines 19-20 in code).
- **Action**: Keep as P1

### F-028 [state_format.md documents LoopLockData incorrectly]
- **Status**: CONFIRMED
- **Evidence**: Documentation shows `acquiredAtIso` (state_format.md:98) but actual code uses `startedAtIso` (loop-lock.ts:12). Documentation missing `packetId` field (loop-lock.ts:15).
- **Action**: Keep as P1

## Adjudicated Severity Counts

- **Before adjudication**: P0=0, P1=15, P2=14
- **After adjudication**: P0=0, P1=12, P2=14
- **Changes**: 
  - Dropped 1 false-positive (F-006)
  - Dropped 1 duplicate (F-021, duplicate of F-002)
  - Net: -2 P1 findings

## Confirmed P1 Findings (12 unique)

1. F-001: Missing path validation on CLI args
2. F-002: DB lifecycle pattern deviates from ADR-001 contract
3. F-005: System-code-graph feature catalog entries reference stale MCP handler paths
4. F-010: Script tests lack exit-code coverage for error paths
5. F-011: DB lifecycle test does not exercise overlapping-writer lock semantics
6. F-014: 001 tasks.md completion_pct is 5 despite phase being complete
7. F-015: 002 tasks.md completion_pct is 5 despite bundled completion
8. F-016: 003 tasks.md completion_pct is 5 despite bundled completion
9. F-017: 004 tasks.md completion_pct is 5 despite bundled completion
10. F-022: ADR-004 incomplete deletion — coverage-graph README.md still references deleted tools
11. F-026: deep-research changelog missing arc 118 dependency switch entry
12. F-027: state_format.md documents PostDispatchValidateInput incorrectly
13. F-028: state_format.md documents LoopLockData incorrectly
