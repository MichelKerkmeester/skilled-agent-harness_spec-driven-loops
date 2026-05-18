# 009 P2 Cleanup From Review

## Summary

This packet closes the deferred P2 cleanup findings from the 006+007 review pass. All three MCP launchers now emit `LEASE_HELD_BY:<pid> startedAt=<iso>` for lease contention diagnostics and clear lease files for SIGQUIT plus uncaught exception crashes. The skill-advisor SQLite lease probe now opens readonly and avoids schema mutation during probes, while integrity checks wait for transient writer locks before `quick_check`. Code-index no longer writes non-lease diagnostic payloads to its lease-file path. The launcher lease suites now run 18 tests total, with exact `startedAt`, stale reclaim, clean exit, and SIGQUIT coverage.

## What Changed

| Area | Change | Evidence |
|------|--------|----------|
| Skill-advisor launcher | Added `startedAt=` to `LEASE_HELD_BY` stdout | `rg -n "LEASE_HELD_BY.*startedAt" .opencode/bin/mk-skill-advisor-launcher.cjs` |
| Code-index launcher | Added `startedAt=` to held-owner and reprobe stdout | `rg -n "LEASE_HELD_BY.*startedAt" .opencode/bin/mk-code-index-launcher.cjs` |
| Spec-memory launcher | Added `startedAt=` to held-owner and reprobe stdout | `rg -n "LEASE_HELD_BY.*startedAt" .opencode/bin/mk-spec-memory-launcher.cjs` |
| Signal cleanup | Added SIGQUIT handlers across all 3 launchers | `rg -n "SIGQUIT" .opencode/bin/mk-*-launcher.cjs` |
| Crash cleanup | Added uncaughtException cleanup hooks across all 3 launchers | `rg -n "uncaughtException" .opencode/bin/mk-*-launcher.cjs` |
| Skill-advisor lease helper | Added readonly `fileMustExist` probe path and `startedAt` result field | `npm run typecheck` in `system-skill-advisor/mcp_server` |
| Readonly absent DB | Short-circuited absent lease DB paths before opening readonly | `launcher-bootstrap` passed after exposing the absent-directory case |
| SQLite integrity | Added `busy_timeout = 5000` before `quick_check` | `rg -n "busy_timeout = 5000" sqlite-integrity.ts` |
| DELETE fallback | Expanded warning with reader-stall and performance consequence | `rg -n "performance degraded vs WAL mode" skill-graph-db.ts` |
| Code-index state collision | Removed ready/failed `writeState(...)` writes from the lease-file path | `rg -n "writeState\\(" mk-code-index-launcher.cjs` shows only the unused helper |
| DB-dir override contract | Documented `MK_SKILL_ADVISOR_DB_DIR` and `SYSTEM_SKILL_ADVISOR_DB_DIR` false-positive/false-negative risks | `daemon-lease-contract.md` §6 |
| Stale reclaim tests | Replaced loose substring checks with anchored regex assertions | 3 launcher-lease suites passed |
| Dead PID tests | Replaced PID-range scanning with spawn-then-kill helpers | Code-graph and spec-memory tests now mirror skill-advisor |
| Clean exit coverage | Added clean-exit PID-file removal tests across all 3 suites | 18 launcher-lease tests passed |
| SIGQUIT coverage | Added SIGQUIT PID-file removal tests across all 3 suites | 18 launcher-lease tests passed |

## Upgrade Notes

The `LEASE_HELD_BY` format change is additive. Existing operators matching only the `LEASE_HELD_BY:<pid>` prefix should continue to work, but strict log parsers should allow the new ` startedAt=<iso>` suffix. Operators using `MK_SKILL_ADVISOR_DB_DIR` or `SYSTEM_SKILL_ADVISOR_DB_DIR` should read the new daemon lease contract section before using strict single-writer mode with shared or split DB paths.

## Verification Evidence

| Check | Result |
|-------|--------|
| `npm run typecheck` in `.opencode/skills/system-skill-advisor/mcp_server` | PASS |
| `npm run typecheck` in `.opencode/skills/system-code-graph` | PASS |
| `npm run typecheck` in `.opencode/skills/system-spec-kit` | PASS |
| `npx vitest --run tests/launcher-lease.vitest.ts` in `system-skill-advisor/mcp_server` | PASS, 6 tests |
| `npx vitest --run mcp_server/tests/launcher-lease.vitest.ts` in `system-code-graph` | PASS, 6 tests |
| `npx vitest --run tests/launcher-lease.vitest.ts` in `system-spec-kit/mcp_server` | PASS, 6 tests |
| `npx vitest --run tests/launcher-bootstrap.vitest.ts` in `system-skill-advisor/mcp_server` | PASS, 6 tests |
| `rg -n "LEASE_HELD_BY|startedAt|SIGQUIT|uncaughtException" .opencode/bin/mk-*-launcher.cjs` | PASS, parity present across all 3 launchers |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../009-p2-cleanup-from-review --strict` | PASS, 0 errors and 0 warnings |
