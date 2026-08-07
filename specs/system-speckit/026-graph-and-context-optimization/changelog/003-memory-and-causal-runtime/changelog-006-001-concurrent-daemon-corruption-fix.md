---
title: "006/001 Concurrent Daemon Corruption Fix: launcher-boundary single-writer lease plus WAL pragmas"
description: "A single skill-advisor daemon now owns the SQLite file via a launcher-boundary lease probe, and every DB open sets WAL journal mode plus a 5s busy_timeout. Closes the multi-daemon corruption pathway that produced about 1005 .corrupt files in 6 hours."
trigger_phrases:
  - "concurrent daemon corruption fix"
  - "skill-advisor single-writer lease"
  - "isLeaseHeld launcher probe"
  - "WAL busy_timeout skill-graph-db"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

Multiple skill-advisor daemons could open the same SQLite database at once, and the resulting writer contention drove a `.corrupt` quarantine pathway that produced about 1005 files in 6 hours under the parallel-AI benchmark. A single daemon now owns the file at any time. Sibling launchers detect the live owner via a PID liveness probe, print `LEASE_HELD_BY:<pid>`, and exit cleanly before touching the database. Every database open also sets WAL journal mode plus a 5 second busy_timeout so the remaining single writer tolerates brief lock contention.

### Added

- `isLeaseHeld()` probe helper in `lib/daemon/lease.ts` returning `{held, ownerPid, staleReclaimable}`, where `staleReclaimable` distinguishes a live owner from a dead previous owner safe to reclaim
- Three new vitest cases in `launcher-bootstrap.vitest.ts` covering held-by-current-PID, no-lease, and the WAL plus busy_timeout assertion on a fresh DB open
- A launcher-boundary enforcement subsection plus a WAL subsection in `references/daemon-lease-contract.md`

### Changed

- `mk-skill-advisor-launcher.cjs` now calls `isLeaseHeld()` before any database path resolution or MCP bootstrap, exits 0 on a live-held lease, and continues on a stale-reclaimable lease. Gated by `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER` (default `1`, set `0` for a dev override)
- `skill-graph-db.ts:initDb` wraps the WAL pragma in a try/catch with an EACCES fallback to `journal_mode=DELETE` for read-only filesystems, and sets `busy_timeout=5000` unconditionally after the journal-mode decision

### Fixed

- The multi-daemon SQLite corruption pathway. With one enforced writer the `.corrupt` quarantine should no longer trigger under expected operation. This also addresses the Devin self-spawn case where every `devin` session spawns its own skill-advisor MCP child

### Verification

- `npm run typecheck` PASS, tsc exit 0 with no diagnostics
- `npm run build` PASS, `isLeaseHeld` export present in compiled `lease.js`
- `npx vitest --run launcher-bootstrap` PASS, 6 tests including the 3 new cases, 174ms
- Scope discipline PASS, only the 7 listed files touched with zero drive-by edits

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modified | Add `LeaseHeldResult` interface plus `isLeaseHeld()` probe |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Lease check before bootstrap, env-gated exit on held lease |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | WAL pragma with EACCES fallback plus `busy_timeout=5000` |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` | Modified | 3 new lease-held plus WAL pragma tests |
| `.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md` | Modified | Launcher-boundary enforcement plus WAL subsections |
| `.opencode/skills/system-skill-advisor/mcp_server/database/.gitignore` | Modified | Add `*.corrupt-shm` and `*.corrupt-wal` quarantine patterns |

### Follow-Ups

- The full spawn-twice integration test is deferred. Unit tests substitute for `isLeaseHeld` semantics for now
- The 24 hour zero-`.corrupt` soak (SC-001) is deferred to the operator, run after restart with the new launcher binary live
