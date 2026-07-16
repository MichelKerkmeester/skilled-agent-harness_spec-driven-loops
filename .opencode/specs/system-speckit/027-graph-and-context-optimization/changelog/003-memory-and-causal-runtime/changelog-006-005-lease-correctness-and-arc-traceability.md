---
title: "MCP Launcher Concurrency Phase 005: Lease Correctness and Arc Traceability"
description: "13 P1 deep-review findings closed across four clusters: doc-drift alignment, test-coverage gaps, real correctness bugs in lease ownership plus SQLite WAL fallback handling, plus verification evidence. The arc now has centralized invariants and passes strict validation end-to-end."
trigger_phrases:
  - "lease correctness arc traceability"
  - "launcher lease resolved db dir"
  - "wal fallback widening"
  - "mcp launcher p1 remediation"
  - "012-005 changelog"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability` (Level 2)
> Parent packet: `027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

The four-phase MCP launcher concurrency arc shipped with a CONDITIONAL deep-review verdict: no P0s, but 13 P1 findings across documentation drift, missing test evidence plus real correctness gaps. The highest-risk issue was lease ownership following workspace paths instead of the resolved SQLite database directory, which allowed two workspaces sharing a DB-dir override to bypass the single-writer boundary.

All 13 P1 findings were closed in one remediation packet. The launcher lease boundary now co-locates with the resolved database directory for all three launchers. The SQLite WAL fallback predicate was widened via a regex helper to cover the full `SQLITE_READONLY`, `CANTOPEN` plus `IOERR` code families plus filesystem write errors. Unconditional lease cleanup via `process.on('exit')` was added to all three launchers. Child spec status drift was corrected, arc invariants were centralized in the parent spec. All targeted vitest suites pass.

### Added

- `isWalFallbackError()` helper in `skill-graph-db.ts` matching SQLite base and extended READONLY, CANTOPEN plus IOERR code families plus EACCES, EROFS, EPERM plus ENOSPC filesystem errors
- Spawn-twice integration test in the skill-advisor `launcher-lease.vitest.ts` asserting `LEASE_HELD_BY` on the second launcher
- Stale-PID reclamation test case verifying `isLeaseHeld()` staleReclaimable behavior
- Watcher refresh and rebuild-from-source DB-open path coverage in `launcher-bootstrap.vitest.ts` via static routing assertions
- REQ anchor comments above all mapped launcher-lease test cases in the three launcher vitest suites
- Cross-Cutting Invariants section in the arc parent `spec.md` covering single-writer lease, WAL+busy timeout, signal-handler parity plus unconditional lease cleanup

### Changed

- Lease file and lease DB co-located with the resolved DB directory in all three launchers (`mk-skill-advisor-launcher.cjs`, `mk-code-index-launcher.cjs`, `mk-spec-memory-launcher.cjs`) for correctness when a `MK_*_DB_DIR` override redirects storage
- `process.on('exit')` cleanup hook added to all three launchers for unconditional lease removal on any exit path
- 002 child spec race-protection text corrected to name atomic temp-file+rename as the race guard
- 003 child spec REQ-009 updated to enumerate all six launcher-lease test cases
- 001, 002 plus 003 child spec statuses updated to Complete

### Fixed

- Lease ownership escaped the single-writer boundary when two workspaces shared a DB-dir override. Resolving leases against the DB directory closes the bypass.
- SQLite WAL fallback caught only a hardcoded short list of error codes. The regex-based `isWalFallbackError()` helper now handles future SQLite extended result code variants.
- Lease files could persist after SIGKILL if the launcher exited before signal handlers ran. The `process.on('exit')` cleanup hook removes leases unconditionally.
- Child spec status drift left 001, 002 plus 003 in Draft state after shipping. All three now report Complete.

### Verification

| Check | Result |
|-------|--------|
| `validate.sh <005> --strict` | PASS, exit 0. Errors: 0. Warnings: 0. |
| `validate.sh <arc parent> --strict --no-recursive` | PASS, exit 0. Errors: 0. Warnings: 0. |
| `validate.sh <001> --strict` | PASS, exit 0. Errors: 0. Warnings: 0. |
| `validate.sh <004> --strict` | PASS, exit 0. Errors: 0. Warnings: 0. |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | PASS, exit 0. |
| `npx vitest --run launcher-lease launcher-bootstrap` (skill-advisor) | PASS, exit 0. 2 files passed. 17 tests passed. |
| `npx vitest --run launcher-lease` (code-graph) | PASS, exit 0. 1 file passed. 7 tests passed. |
| `npx vitest --run launcher-lease` (spec-kit) | PASS, exit 0. 1 file passed. 6 tests passed. |
| Full skill-advisor `npx vitest --run` | 57 files passed. 3 pre-existing failures outside Phase 005 scope documented in implementation summary. |
| Commit `bd8a907475` | `feat(012/005): close 13 P1 findings from 29-iter deep-review`. 24 files changed. 1319 insertions. 72 deletions. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Lease file co-located with resolved DB dir. Unconditional cleanup via `process.on('exit')`. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | Same resolved-DB lease ownership and exit cleanup as skill-advisor launcher. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Same resolved-DB lease ownership and exit cleanup as skill-advisor launcher. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modified | Lease DB path resolved beside the skill-graph DB directory. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | `isWalFallbackError()` helper replaces the hardcoded error-code list. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Spawn-twice test, stale-PID reclaim test plus REQ anchor comments added. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` | Modified | Watcher and rebuild DB-open path coverage via static routing assertions. |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modified | REQ anchor comments added above all mapped test cases. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modified | REQ anchor comments added above all mapped test cases. |

### Follow-Ups

- Confirm the three pre-existing full-suite vitest failures (`skill-graph-diagnostic-redaction`, `lane-weight-sweep`, `manual-testing-playbook`) are tracked in their owning packets and closed there.
- Verify manual smoke of duplicate-launch behavior when no active MCP daemon session is running to complement the subprocess vitest coverage.
