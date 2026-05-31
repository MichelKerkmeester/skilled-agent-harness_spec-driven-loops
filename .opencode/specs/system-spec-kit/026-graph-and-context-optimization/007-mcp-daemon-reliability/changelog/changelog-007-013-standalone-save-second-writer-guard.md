---
title: "013 Standalone Save Second-Writer Guard"
description: "A new daemon-detect.ts helper probes the mk-spec-memory launcher lease for PID liveness. Step 11.5 of the standalone save workflow now skips direct SQLite indexing when the daemon is alive and routes operators to MCP memory_index_scan instead."
trigger_phrases:
  - "standalone save second writer guard"
  - "Step 11.5 daemon guard"
  - "daemon-detect.ts liveness probe"
  - "generate-context SQLite second writer"
  - "memory_index_scan standalone save routing"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The standalone `generate-context.js` save workflow had an unconditional Step 11.5 that opened its own better-sqlite3 connection to `context-index.sqlite` and wrote FTS5 rows directly. When the mk-spec-memory daemon was already running, this made the save process a second SQLite writer against the daemon-owned WAL, violating the single-writer invariant and creating data contention.

A new `daemon-detect.ts` helper was introduced that resolves the canonical mk-spec-memory launcher lease file, reads the `pid` and `ownerPid` fields, and probes liveness with the same ESRCH-tolerant `process.kill(pid, 0)` check already used for workflow stale-lock cleanup. `workflow.ts` now imports that shared helper and calls `isSpecMemoryDaemonAlive()` before Step 11.5 touches the indexing API. When the daemon is alive, indexing is skipped with a named diagnostic pointing to `memory_index_scan`. When the daemon is down, the existing standalone path remains intact.

A focused adversarial review caught a P0 defect in the initial implementation: the lease resolver anchored on a fixed relative path from the compiled `dist/core` location, landing in the wrong directory and always returning `alive:false`. The fix anchored resolution on the `system-spec-kit` ancestor marker, mirroring the launcher's own derivation, and added a regression test to lock that behavior. Empirical verification against a live daemon confirmed the detector now returns `{alive:true, pid:73257}` where it previously returned `{alive:false}`.

### Added

- `daemon-detect.ts` helper in `scripts/core/` that reads the launcher lease and exposes `isSpecMemoryDaemonAlive()` with ESRCH-tolerant PID probing
- Step 11.5 daemon-up guard in `workflow.ts` that skips `initializeIndexingRuntime()` and `reindexSpecDocs()` when the daemon is alive
- Contention-specific catch diagnostics in `workflow.ts` for `embedding_cache` UNIQUE, `SQLITE_BUSY`, and `vector_index is null` errors pointing to `memory_index_scan`
- `daemon-detect.vitest.ts` covering live PID, dead PID, missing lease, and no-arg path-resolution cases
- `workflow-step115-daemon-guard.vitest.ts` covering daemon-up skip and contention fallback warning behavior
- Daemon-up/down indexing contract documented in `.opencode/commands/memory/save.md`

### Changed

- `workflow.ts` PID liveness check refactored from a local inline copy to the shared `isSpecMemoryDaemonAlive()` import from `daemon-detect.ts`
- Step 11.5 lease-path resolution anchored on the `system-spec-kit` ancestor marker instead of a fixed relative path from the compiled output location

### Fixed

- Standalone save opened a second SQLite writer when the mk-spec-memory daemon was already running. Now skips direct indexing when the daemon is alive.
- Initial `resolveSpecMemoryDaemonLeasePath()` walked a fixed two levels up from `dist/core`, landing at the nonexistent `scripts/mcp_server/database/` and always returning `alive:false`. Anchoring on the ancestor marker corrects the resolution.
- Catch block for Step 11.5 errors issued a generic skip warning for known contention signatures. Now names the daemon/contention risk and the `memory_index_scan` workaround.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` from `.opencode/skills/system-spec-kit/scripts` (tsc) | PASS |
| Focused scripts vitest (daemon-detect + workflow-step115-daemon-guard) | PASS (6 tests, including the no-arg path-resolution regression guard) |
| Empirical live-daemon check (fixed detector vs running daemon pid 73257) | PASS. Resolves the real lease and returns `{alive:true, pid:73257}` (was `{alive:false}` before the fix) |
| Focused adversarial review | 1 P0 (dead-code lease-path) FIXED and empirically confirmed. PID-reuse false-positive accepted (safe: skip plus route, not corruption) |
| `validate.sh --strict` on this packet | PASS (0 errors, 0 warnings) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts` (NEW) | Created | Reads launcher lease and reports daemon PID liveness via `isSpecMemoryDaemonAlive()` |
| `.opencode/skills/system-spec-kit/scripts/core/workflow.ts` | Modified | Imports shared liveness helper, guards Step 11.5 before indexing import, hardens contention diagnostics |
| `.opencode/skills/system-spec-kit/scripts/tests/daemon-detect.vitest.ts` (NEW) | Created | Covers live PID, dead PID, missing lease, and no-arg path-resolution behavior |
| `.opencode/skills/system-spec-kit/scripts/tests/workflow-step115-daemon-guard.vitest.ts` (NEW) | Created | Covers daemon-up skip and contention fallback warning |
| `.opencode/commands/memory/save.md` | Modified | Adds daemon-up/down indexing contract for standalone saves |

### Follow-Ups

- The daemon-up path leaves the memory index stale until `memory_index_scan` runs. A future packet could automate that MCP call at the end of a daemon-up standalone save to close the freshness gap without reopening the second-writer risk.
- PID-reuse false-positives are accepted as safe (deferred stale index rather than corruption). Adding `startedAt` cross-check parity with the launcher would eliminate the false-positive class entirely.
