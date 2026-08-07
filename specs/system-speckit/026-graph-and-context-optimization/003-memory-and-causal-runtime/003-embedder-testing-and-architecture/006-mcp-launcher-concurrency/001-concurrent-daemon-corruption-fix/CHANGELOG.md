# Concurrent Daemon Corruption Fix

**Date:** 2026-05-18

## Summary

Fixed SQLite database corruption caused by concurrent skill-advisor daemons. Three concurrent launchers generated ~1005 `.corrupt` quarantine files in 6 hours by racing on the same `skill-graph.sqlite` file. This fix enforces single-writer semantics at the launcher process boundary and adds WAL mode with busy timeout to improve concurrency safety.

## What Changed

| File | Change | Why |
|------|--------|-----|
| `mcp_server/lib/daemon/lease.ts` | Added `isLeaseHeld()` helper function and `LeaseHeldResult` interface | Provides lease probe for launcher to check before opening database |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Added lease check before MCP server bootstrap with env var gate | Enforces single-writer semantics at process boundary; exits cleanly when lease is held |
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Added `busy_timeout = 5000` pragma and EACCES fallback for WAL mode | Improves concurrency safety and handles read-only filesystems |
| `references/daemon-lease-contract.md` | Updated §2 to document launcher enforcement and WAL pragmas | Documents new lease lifecycle and SQLite configuration |
| `mcp_server/tests/launcher-bootstrap.vitest.ts` | Added unit tests for `isLeaseHeld()` and WAL pragma assertion | Verifies lease probe logic and database configuration |

## Upgrade Notes

No migration required. The new behavior is enabled by default:

- **Default behavior:** Launcher exits with code 0 and prints `LEASE_HELD_BY:<pid>` when a sibling launcher is alive. This prevents concurrent writers.
- **Dev override:** Set `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER=0` to disable the exit behavior for development workflows.
- **WAL mode:** Automatically enabled on all database opens with `busy_timeout=5000`. Falls back to `journal_mode=DELETE` on read-only filesystems with a warning.

## Verification Evidence

- **Typecheck:** `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exits 0
- **Vitest:** `npx vitest --run --config .opencode/skills/system-skill-advisor/mcp_server/vitest.config.ts launcher-bootstrap` exits 0 with 6 tests passing
- **Test coverage:** Added tests for `isLeaseHeld()` with held lease, no lease, and WAL pragma assertion
