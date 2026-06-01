---
title: "MCP Launcher P2 Cleanup: Diagnostics, Signal Coverage, Readonly Probes and Test Hygiene"
description: "Closed all 14 deferred P2 findings from the 3-reviewer audit of packets 006+007. All three MCP launchers now emit LEASE_HELD_BY diagnostics with startedAt timestamps, handle SIGQUIT and crash cleanup then run 18 discriminative lease tests."
trigger_phrases:
  - "p2 cleanup launcher diagnostics"
  - "launcher signal coverage SIGQUIT"
  - "isLeaseHeld readonly probe"
  - "mcp launcher startedAt diagnostics"
  - "launcher lease test hygiene"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/004-launcher-diagnostics-and-signal-coverage` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

The 3-reviewer audit of packets 006+007 surfaced 14 P2 findings covering diagnostic gaps, signal handling omissions, a schema-mutating lease probe and loose test assertions. None were correctness blockers but together they left operators without enough information to triage PID-reuse contention and left the system exposed to lease-file leaks on atypical exits.

All 14 findings shipped in one pass. Each of the three MCP launchers now emits `LEASE_HELD_BY:<pid> startedAt=<iso>` for lease contention diagnostics, handles SIGQUIT and uncaught exception cleanup then passes 6 discriminative lease tests covering live-owner exit, exact `startedAt` reporting, stale reclaim, clean exit, SIGQUIT cleanup and strict-mode disable. The skill-advisor `isLeaseHeld()` probe now opens the lease DB readonly with `fileMustExist` so it no longer mutates schema or WAL state on every call. SQLite integrity checks now wait up to 5 seconds for a writer lock before `quick_check`. The code-index launcher no longer writes a diagnostic state payload to the same path used as its lease file.

### Added

- `startedAt=<iso>` field in the `LEASE_HELD_BY:<pid>` stdout line across all three launchers
- SIGQUIT and uncaughtException lease cleanup hooks in all three launchers
- `fileMustExist` readonly probe path in `isLeaseHeld()` returning `{held: false}` on ENOENT without schema creation
- `startedAt` result field on the `isLeaseHeld()` return type in `lease.ts`
- `busy_timeout=5000` pragma before `quick_check` in `checkSqliteIntegrity`
- Clean-exit PID file removal test cases across all three launcher-lease suites (18 total tests, up from 15)

### Changed

- `isLeaseHeld()` now opens the SQLite lease DB with `{ readonly: true, fileMustExist: true }` to avoid WAL and CREATE TABLE overhead on every probe call
- DELETE-mode fallback warning in `skill-graph-db.ts` now states the concurrency cost: `Concurrent readers may stall during writes` and `performance degraded vs WAL mode`
- Stale-reclaim assertions in all three launcher-lease test suites replaced with anchored regex patterns for tighter discrimination
- `findDeadPid` helper in all three test files replaced with a spawn-then-kill approach to avoid PID-range scanning
- Spawn-twice timeout bumped from 5 seconds to 8 seconds across the three test files for loaded CI tolerance
- `references/runtime/daemon_lease_contract.md` extended with a section documenting how `MK_SKILL_ADVISOR_DB_DIR` and `SYSTEM_SKILL_ADVISOR_DB_DIR` overrides can disconnect lease checks from database paths

### Fixed

- Code-index launcher was writing a `writeState(...)` diagnostic payload to the same file path used as its lease file. Removed the collision writes so only `log()` output covers diagnostics.
- `isLeaseHeld()` was triggering `PRAGMA journal_mode=WAL` and `CREATE TABLE IF NOT EXISTS` on every lease probe call. The readonly probe path eliminates both.
- SIGQUIT and uncaughtException exits leaked lease files in all three launchers. New handlers clear the lease file before exit or re-throw.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` in `system-skill-advisor/mcp_server` | PASS |
| `npm run typecheck` in `system-code-graph` | PASS |
| `npm run typecheck` in `system-spec-kit` | PASS |
| `npx vitest --run tests/launcher-lease.vitest.ts` in `system-skill-advisor/mcp_server` | PASS. 6 tests |
| `npx vitest --run mcp_server/tests/launcher-lease.vitest.ts` in `system-code-graph` | PASS. 6 tests |
| `npx vitest --run tests/launcher-lease.vitest.ts` in `system-spec-kit/mcp_server` | PASS. 6 tests |
| `npx vitest --run tests/launcher-bootstrap.vitest.ts` in `system-skill-advisor/mcp_server` | PASS. 6 tests after readonly absent-file fix |

### Files Changed

| File | Action | What changed |
|------|--------|-------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Added `startedAt` to `LEASE_HELD_BY` stdout. Added SIGQUIT and uncaughtException cleanup hooks. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | Added `startedAt` diagnostics. Added SIGQUIT and uncaughtException cleanup hooks. Removed `writeState(...)` collision writes from the lease-file path. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Added `startedAt` to `LEASE_HELD_BY` stdout. Added SIGQUIT and uncaughtException cleanup hooks. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modified | Readonly `fileMustExist` probe path in `isLeaseHeld()`. Added `startedAt` to lease result type. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/sqlite-integrity.ts` | Modified | Added `busy_timeout=5000` pragma before `quick_check` in `checkSqliteIntegrity`. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Expanded DELETE-mode warning with concurrency cost statement. |
| `.opencode/skills/system-skill-advisor/references/runtime/daemon_lease_contract.md` | Modified | New section documenting `MK_SKILL_ADVISOR_DB_DIR` and `SYSTEM_SKILL_ADVISOR_DB_DIR` override disconnect risk. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Tightened stale-reclaim assertions. Replaced `findDeadPid` with spawn-then-kill helper. Added clean-exit and SIGQUIT coverage tests. Bumped spawn-twice timeout. |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Same hygiene set as skill-advisor: anchored assertions, spawn-then-kill, clean-exit and SIGQUIT tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Same hygiene set as skill-advisor: anchored assertions, spawn-then-kill, clean-exit and SIGQUIT tests. |

### Follow-Ups

- Evaluate whether `MK_SKILL_ADVISOR_DB_DIR` and `SYSTEM_SKILL_ADVISOR_DB_DIR` overrides should fail closed in strict single-writer mode. The current documentation approach was chosen to stay within the P2 cleanup scope.
