---
title: "Launcher Race and Error Surface Hardening: 9 P1 Findings Closed"
description: "Nine P1 review findings from the 006+007 audit closed. Lease enforcement now holds under different-uid probes, read-only filesystems, fast double-spawn races, slow child shutdown. Test isolation tightened across all three launchers."
trigger_phrases:
  - "launcher race hardening"
  - "lease P1 findings closed"
  - "EPERM lease fix"
  - "launcher error surface hardening"
  - "mcp launcher concurrency review remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

The 006 and 007 packets shipped working lease enforcement on the happy path, but a 3-reviewer audit surfaced 9 P1 correctness gaps. The lease guard did not handle EPERM (different uid), leaving the signal check to silently bypass protection. The EACCES catch in `skill-graph-db.ts` missed `SqliteError(code='SQLITE_READONLY')`, making the DELETE-mode fallback dead code for the case it claimed to cover. The spec-memory SIGTERM handler cleared the lease on a fixed 5s timer rather than waiting for child exit, risking WAL corruption. Two launchers lacked a re-probe after writing the lease file, leaving a check-and-write race unguarded.

All 9 findings closed in one focused pass. Fifteen tests now pass across the three skills (up from 12). Strict validate returns zero errors.

### Added

- New `launcher-lease.vitest.ts` for skill-advisor with 3 subprocess cases: spawn-twice exit-0, dead-PID reclaim, env-var disable. Closes the coverage gap where skill-advisor had only in-process lease lib tests.
- `isStrictModeDisabled()` helper in each of the 3 launchers accepting `0`, `false`, `FALSE`, `False`, `no`, `off`, empty string as disabled values.

### Changed

- `mk-code-index-launcher.cjs` and `mk-spec-memory-launcher.cjs` now re-probe the lease file after writing it. If `parsed.pid !== process.pid` the launcher emits `LEASE_HELD_BY:<winner>` and exits 0.
- `mk-spec-memory-launcher.cjs` SIGTERM handler replaced: attaches `childProcess.once('exit', ...)` before sending SIGTERM. A 5s `setTimeout` escalates to SIGKILL if the child does not exit. Replaces the unconditional 5s timer that could clear the lease while the child was still flushing the SQLite WAL.
- `isLeaseHeld()` in `lease.ts` now returns `{ held: true, ... }` on EPERM instead of re-throwing. EPERM means the process exists but the caller lacks signal permission. The previous behavior allowed the guard to be bypassed silently.
- `skill-graph-db.ts` `initDb()` now sets `busy_timeout = 5000` before switching `journal_mode = WAL`. The WAL switch is itself a write requiring a lock. Setting busy_timeout after left the riskiest moment with a 0ms default wait.
- EACCES catch in `skill-graph-db.ts` broadened to match `EACCES`, `EROFS`, `SQLITE_READONLY`, `SQLITE_CANTOPEN`, `SQLITE_IOERR_WRITE` before falling back to DELETE mode.
- Both 007 test files gate the spawn-twice exit assertion on `waitForStdoutClose(second)` before checking `exit.code === 0`. Test timeout bumped from 2s to 5s for cold-start headroom.
- `spawnLauncher` helpers in both 007 test files now delete `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER`, `MK_CODE_INDEX_STRICT_SINGLE_WRITER`, `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER` from the inherited env before merging test-specific values.

### Fixed

- EPERM during `process.kill(pid, 0)` previously caused `isLeaseHeld()` to re-throw. The launcher catch block swallowed the error, bypassing the guard entirely. The new EPERM branch returns `held: true` instead.
- DELETE-mode fallback in `skill-graph-db.ts` was dead code for `SqliteError(code='SQLITE_READONLY')` because the catch only matched `EACCES`. Broadened predicate restores the fallback for read-only filesystem mounts.
- Spawn-twice tests could assert exit code before the final stdout line arrived, causing intermittent false-pass. Stdout-close gate eliminates the race.

### Verification

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | PASS. exit 0 |
| `npm --prefix .opencode/skills/system-code-graph run typecheck` | PASS. exit 0 |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS. exit 0 |
| `vitest --run launcher-lease` (skill-advisor, new file) | PASS. 3 tests, 481ms |
| `vitest --run launcher-bootstrap` (skill-advisor, existing) | PASS. 6 tests, 171ms (no regression) |
| `vitest --run launcher-lease` (code-graph) | PASS. 3 tests, 367ms |
| `vitest --run launcher-lease` (spec-memory) | PASS. 3 tests, 367ms |
| Cross-launcher parity grep | `grep -c LEASE_HELD_BY .opencode/bin/mk-*-launcher.cjs` returns skill-advisor:1. code-index:2 (original + re-probe). spec-memory:2 (original + re-probe) |
| Strict spec validate | PASS. 0 errors, 1 advisory PRIORITY_TAGS warning |
| Scope discipline | All 9 modified files appear in spec.md Files to Change. Zero drive-by edits. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify (+24) | Re-probe after lease write. Env-var helper added. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify (+59) | Re-probe after lease write. Child-exit handler replaces unconditional 5s timer. Env-var helper added. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify (+8) | Env-var helper added for parity with the other two launchers. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modify (+5) | EPERM branch in `isLeaseHeld()` returns held:true instead of re-throwing. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify (+7/-3) | `busy_timeout` moved before `journal_mode` pragma. EACCES predicate broadened to include SqliteError codes. |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modify (+16) | Stdout-close gate added. Host env vars stripped in `spawnLauncher`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modify (+16) | Same changes as code-graph test file above. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Create (+289) | New subprocess test with 3 cases mirroring 007 shape. |

### Follow-Ups

- Run a 24-hour zero-zombie soak across all 6 runtime configs to validate the new launchers under wall-clock conditions. Deferred to operator. Not blocked by this packet.
- Add a chmod-tempdir test asserting the `journal_mode = DELETE` fallback fires when `SqliteError(code='SQLITE_READONLY')` is thrown. The broadened predicate is wired but the fallback branch has no regression coverage.
- Investigate the `checkSqliteIntegrity` `busy_timeout` gap. The quick-check path still runs with a 0ms `busy_timeout`, so a transient lock during an integrity probe can still false-positive into a `.corrupt` rename.
