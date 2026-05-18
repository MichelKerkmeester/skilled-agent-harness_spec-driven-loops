# Lease Hardening From Review

**Date:** 2026-05-18
**Packet:** `016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/003-launcher-race-and-error-surface-hardening`
**Predecessor:** `016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/002-cross-launcher-lease-propagation`

## Summary

Closes 9 P1 findings from the 3-reviewer parallel audit of packets 006 + 007: race window between lease check and write in code-graph + spec-memory launchers, SIGTERM clearing the lease 5s after signal regardless of child exit, env-var parsing rejecting common falsy values, EPERM mishandled as "no guard" in `isLeaseHeld()`, `busy_timeout` set after `journal_mode = WAL` (the WAL switch race itself was unprotected), EACCES catch missing `SqliteError(code='SQLITE_READONLY')` (DELETE-mode fallback was dead code), test stdout races against the 'exit' event, host env vars leaking into tests, and skill-advisor lacking a subprocess-level spawn-twice test. The shipped code worked on the happy path but these gaps could surface under different uid, read-only mounts, double-spawn races, or slow child shutdowns.

## What Changed

| File | Change | Why |
|------|--------|-----|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Re-probe after `writeLeaseFile()` (REQ-001 race close); shared `isStrictModeDisabled()` env-var helper (REQ-003). |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Same re-probe + env-var helper; SIGTERM handler refactored to `child.once('exit')` with SIGKILL backstop (REQ-002). |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Env-var helper for cross-launcher parity (REQ-003). |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modify | EPERM branch in `isLeaseHeld()` returns `{held: true}` (REQ-004). |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | Pragma order swapped to `busy_timeout` BEFORE `journal_mode = WAL` (REQ-005); broadened EACCES predicate to include `EROFS` + `SQLITE_READONLY` + `SQLITE_CANTOPEN` + `SQLITE_IOERR_WRITE` (REQ-006). |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modify | `waitForStdoutClose()` gate before exit assertion + 5s test timeout (REQ-007); `spawnLauncher` strips `MK_*_STRICT_SINGLE_WRITER` from inherited env (REQ-008). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modify | Same. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Create | New subprocess-level test file mirroring 007 shape — 3 cases: spawn-twice + dead-PID reclaim + env-disable (REQ-009). Closes the 006/007 test-layer drift (skill-advisor previously had only in-process lease lib coverage). |

## Upgrade Notes

Zero migration required. Behavior changes operators may notice:

- `MK_*_STRICT_SINGLE_WRITER` now accepts `no`, `off`, `false`, `FALSE`, `False`, empty string in addition to `0` as values that disable strict mode.
- Launchers running under a different uid than the lease owner now correctly detect the lease as held (EPERM → `held: true`).
- SQLite databases on read-only mounts now correctly fall back to `journal_mode = DELETE` with a logged warning (previously the catch missed the actual `SqliteError` code).
- WAL-switch race during concurrent first-starts is now absorbed by `busy_timeout = 5000` (previously busy_timeout was set after, so the WAL switch itself ran at default 0ms).
- spec-memory SIGTERM now waits for the child `context-server.js` to exit before clearing the lease file (previously cleared 5s after signal regardless).

## Verification Evidence

```text
# Typechecks
$ npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
> tsc --noEmit --composite false -p tsconfig.build.json
exit 0

$ npm --prefix .opencode/skills/system-code-graph run typecheck
> tsc --noEmit -p tsconfig.json
exit 0

$ npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck
> tsc --noEmit --composite false -p tsconfig.json
exit 0

# Vitest
$ vitest --run launcher-lease (skill-advisor, new)
Test Files  1 passed (1)
     Tests  3 passed (3)  Duration  481ms

$ vitest --run launcher-bootstrap (skill-advisor, existing)
Test Files  1 passed (1)
     Tests  6 passed (6)  Duration  171ms

$ vitest --run launcher-lease (code-graph)
Test Files  1 passed (1)
     Tests  3 passed (3)  Duration  367ms

$ vitest --run launcher-lease (spec-memory)
Test Files  1 passed (1)
     Tests  3 passed (3)  Duration  367ms

# Cross-launcher parity grep
$ grep -c LEASE_HELD_BY .opencode/bin/mk-*-launcher.cjs
mk-skill-advisor-launcher.cjs:1
mk-code-index-launcher.cjs:2      # +1 from re-probe path (REQ-001)
mk-spec-memory-launcher.cjs:2     # +1 from re-probe path (REQ-001)
```

Total: 15 vitest tests across the 3 packages (was 12 before this packet). All typechecks clean. Cross-launcher parity preserved — the LEASE_HELD_BY contract is byte-identical; code-index + spec-memory have an additional emit site for the re-probe branch.

## Phase Outcome

Codex completed phases 1-8 cleanly. Phase 9 (new skill-advisor test) initially failed on the stale-reclaim case because the test's `waitForLeaseOwner` returned the pre-written deadPid before the stub server overwrote the lease. Patched by adding a `waitFor(pid !== deadPid)` gate before reading the new owner pid. Main agent finished Phase 10 (this changelog) after codex stopped per the failure-stop instruction.

## P2 Findings Deferred

14 P2 findings from the 3-reviewer audit remain open for future packets:

- PID-reuse diagnostics could emit `startedAt` alongside `LEASE_HELD_BY:<pid>`
- `SIGQUIT` / `uncaughtException` cleanup gaps (stale-reclaim covers it on next launch)
- `MK_SKILL_ADVISOR_DB_DIR` override can disconnect lease check from DB write
- code-index `stateFile` overwrites the lease file briefly during bootstrap
- `readLeaseSnapshot` opens/schema-mutates/closes the lease SQLite on every probe
- DELETE-mode fallback log doesn't warn about reduced concurrency
- `recoverMalformedDatabase`: `quick_check` still has 0ms `busy_timeout`
- WAL test doesn't cover EACCES → DELETE fallback path (no chmod-tempdir case)
- `findDeadPid` scans 99,999 PIDs from a fixed range (works on macOS, sparse on Linux with pid_max>1M)
- `tempDirs` arrays MODULE-scoped instead of `describe`-scoped (drift from 006)
- Stale-reclaim assert is loose substring (would pass on incidental match)
- No test asserts PID file is REMOVED on clean exit (REQ-003 has no negative-side assertion)
- 2s → 5s spawn-twice timeout buys headroom but loaded CI could still flake
- Production-relative path constants hardcoded in tests (silent drift risk)

None are correctness blockers; each is a hardening opportunity for a future packet.
