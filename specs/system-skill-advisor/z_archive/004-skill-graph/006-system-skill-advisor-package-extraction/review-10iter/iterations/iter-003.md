# iter-003 — ROBUSTNESS

**Dimension**: Robustness — Error handling, edge cases, SQLite integrity guards, restart safety
**Date**: 2026-05-15
**Files Reviewed**: sqlite-integrity.ts (both), daemon/lifecycle.ts, daemon/lease.ts, watcher.ts, skill-graph-db.ts, mk-skill-advisor-launcher.cjs, advisor-server.ts

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| R-001 | P2 | Launcher `buildIfNeeded` checks artifact existence, not content correctness | `mk-skill-advisor-launcher.cjs:119-137` | robustness/build-verification |
| R-002 | P2 | Advisor server fatal error handler calls `closeSkillGraphDb()` but not daemon shutdown | `advisor-server.ts:302-305` | robustness/cleanup |
| R-003 | P2 | `checkSqliteIntegrity` re-throws non-corruption errors without wrapping — caller must handle unknown exceptions | `sqlite-integrity.ts:27-34` | robustness/error-surface |
| R-004 | P1 | Launcher `acquireBootstrapLock` creates lockdir via `mkdirSync` — stale lockdir from crash survives indefinitely if not cleaned | `mk-skill-advisor-launcher.cjs:140-160` | robustness/restart-safety |
| R-005 | P2 | Daemon watcher's `watchFactory` is dynamically imported — if chokidar is unavailable, startup fails with unclear error message | `advisor-server.ts:91-112` | robustness/dependency-failure |

## Analysis

### SQLite integrity: GOOD

`checkSqliteIntegrity` in `sqlite-integrity.ts:13-38` uses `PRAGMA quick_check` with a readonly connection and `fileMustExist: true`. Corruption errors are caught via regex matching on `SQLITE_CORRUPT`, `SQLITE_NOTADB`, and malformed disk image messages. The `db.close()` in `finally` ensures cleanup even on errors. The neutral re-export in spec-kit prevents cross-domain import coupling.

### Signal handling: GOOD

The launcher at `mk-skill-advisor-launcher.cjs:184-193` handles SIGINT, SIGTERM, SIGHUP by forwarding signals to the child process with a 5-second exit timeout. The server at `advisor-server.ts:296-301` handles SIGINT/SIGTERM with graceful daemon shutdown.

### Edge cases: MINOR CONCERNS

R-001: The `buildIfNeeded` function checks only that required artifact files EXIST (`artifactsReady()` returns `requiredArtifacts().every(exists)`). It does not verify that the built dist content is up-to-date. If a stale dist with old content (e.g., `system_skill_advisor` server name post-rename) is present, the build check passes without rebuilding. This actually occurred during the 015 rename implementation — the first launcher smoke exposed stale dist output. The timestamp-based build system (`npm run build`) mitigates this but does not eliminate it.

R-004: The bootstrap lock uses a directory (`mkdirSync`) pattern. If the launcher crashes while holding the lock, the `lockDir` is only cleaned in the `finally` block at line 235-237. On a hard crash (SIGKILL), the lockdir persists, blocking the next launcher startup until:
- `artifactsReady()` returns true (bypasses lock check)
- 120-second deadline expires
- Manual cleanup

The launcher does use `artifactsReady()` as a fast-path check (line 151-153) before the timeout, which mitigates this. However, on a clean checkout where dist doesn't exist yet, a stale lockdir would require the full 120-second timeout before erroring out.

### Restart safety: ADEQUATE

The daemon lifecycle tracks generation state through `publishSkillGraphGeneration`/`readSkillGraphGeneration`. Lease takeover on stale locks works through the `STALE_LEASE_TAKEOVER_UNAVAILABLE` state. The startup scan re-indexes skills on cold start.

## Verdict: PASS with 1 P1, 4 P2 advisories
