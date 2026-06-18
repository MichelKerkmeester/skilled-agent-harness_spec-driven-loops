---
title: "Deep Review Strategy: maintenance-grace daemon survives re-election"
description: "Strategy document for the deep review loop on spec 019-maintenance-grace-daemon-survives-reelection"
---

# Deep Review Strategy

## Topic

Review of spec 019: maintenance-grace daemon survives re-election. The daemon writes a refreshed `.maintenance-active.json` marker during background scans so competing launchers adopt a busy-but-healthy daemon instead of reaping it.

## Review Dimensions

- [x] D1 Correctness — reviewed (iteration 1)
- [ ] D2 Security — pending
- [ ] D3 Traceability — pending
- [ ] D4 Maintainability — pending

## Files Under Review

| File | Path | Status |
|------|------|--------|
| Daemon marker writer | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | reviewed |
| Pure supervision predicate | `.opencode/bin/lib/model-server-supervision.cjs` (lines 600-640) | reviewed |
| Launcher guard (dead-socket) | `.opencode/bin/mk-spec-memory-launcher.cjs` (lines 810-825) | reviewed |
| Launcher guard (stale-reclaim) | `.opencode/bin/mk-spec-memory-launcher.cjs` (lines 1685-1694) | reviewed |
| Unit test | `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts` | reviewed |
| Isolated harness | `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | reviewed |
| Spec doc | `.opencode/specs/.../019-.../spec.md` | reviewed |
| Implementation summary | `.opencode/specs/.../019-.../implementation-summary.md` | reviewed |
| Plan | `.opencode/specs/.../019-.../plan.md` | reviewed |
| Tasks | `.opencode/specs/.../019-.../tasks.md` | reviewed |

## Cross-Reference Status

### Core Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | partial | Spec says `jobId` in marker; code uses `labels` array. Spec says 60s TTL; code uses 180s. Spec says key_files are under `mcp_server/bin/`; actual path is `.opencode/bin/`. |
| `checklist_evidence` | skipped | No `checklist.md` exists (Level 1 spec) |

### Overlay Protocols

None applicable for spec-folder target type at Level 1.

## Known Context

- Spec is Level 1, status "Complete (code)", completion 100%.
- No `resource-map.md` present. Skipping coverage gate.
- Predecessor spec 018 made background scans cooperative; this phase ensures the daemon survives launcher contention during a scan.
- The implementation summary documents a live run where a full reindex completed in 330s without the daemon being reaped.

## Review Boundaries

- **In scope**: The maintenance-marker module, the pure supervision predicate, the launcher guard sites, unit tests, and spec-code alignment.
- **Out of scope**: The 018 cooperative yield work, the full end-to-end reindex (deploy-time check), changes to the JSON-RPC liveness probe.

## Non-Goals

- Reviewing the 018 cooperative yield implementation.
- Running the live reindex end-to-end test.

## Stop Conditions

- maxIterations=1 reached. Stopping after this iteration.
