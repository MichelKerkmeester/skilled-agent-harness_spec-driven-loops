# Deep Review Strategy — 019-maintenance-grace-daemon-survives-reelection

Lineage: `fanout-p019-opus-1` · executor `cli-claude-code` model `claude-opus-4-8` · maxIterations 1

## Topic

Review the maintenance-grace fix: the daemon writes a refreshed `.maintenance-active.json` marker during a background index scan, and both launcher reap paths adopt a busy-but-healthy daemon instead of reaping it, so a heavy reindex survives launcher contention (re-election).

## Review Dimensions

- [x] D1 Correctness — marker writer, pure predicate, both guard sites, ref-counting, fail-safe
- [x] D2 Security — untrusted marker file parse, trust boundary of adopt decision
- [x] D3 Traceability — spec/plan/tasks/summary vs shipped code (REQ-001..004, file paths, marker schema, limitations)
- [x] D4 Maintainability — module structure, comments, testability

## Files Under Review

| File | Role | Notes |
|------|------|-------|
| `mcp_server/handlers/memory-index.ts` (~1486-1554) | Marker writer call site | Uses `beginMaintenance('index_scan')` + phase-boundary `refresh()` + `finally end()` |
| `mcp_server/lib/storage/maintenance-marker.ts` | Marker module (NOT named in spec) | Ref-counted `beginMaintenance`/`MaintenanceMarkerHandle`, 180s TTL, 20s refresh |
| `.opencode/bin/lib/model-server-supervision.cjs` (557-640) | Pure predicate | `maintenanceMarkerPath`/`readMaintenanceMarker`/`shouldAdoptDespiteProbe`, injectable fs/now |
| `.opencode/bin/mk-spec-memory-launcher.cjs` (329-333, 820-825, 1688-1694) | Guard sites | `maintenanceMarkerDir()` + both reap paths |
| `mcp_server/lib/providers/retry-manager.ts` (1024-1061) | Embedding-queue marker | `beginMaintenance('embedding-queue')` — protects post-scan burst |
| `mcp_server/tests/launcher-maintenance-guard.vitest.ts` | Unit test | Predicate + reader, cases a–g |
| `mcp_server/tests/maintenance-marker.vitest.ts` | Unit test | Ref-counting / refresh |
| `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` (343, 408) | Isolated harness | Adopt + stale-marker negative control |

## Cross-Reference Status

### Core (hard)
- `spec_code` — RUN. REQ-001..004 satisfied by code; literal-value drift on TTL (60s→180s) and marker schema (`jobId`→`labels`) and file paths.
- `checklist_evidence` — N/A (Level 1, no `checklist.md`).

### Overlay (advisory)
- `feature_catalog_code` — N/A for this packet (no catalog claim under review).
- `playbook_capability` — N/A.

## Known Context

- `resource-map.md` not present. Skipping coverage gate.
- Level 1 spec folder, no `checklist.md` → AC_COVERAGE exempt.
- Predecessor: 018 cooperative-yield work (the discriminator that keeps a healthy scan refreshing the marker).
- Build/test re-execution was NOT independently run in this review context (node execution gated). Build/syntax/test PASS claims are taken from the implementation-summary and corroborated by static inspection of the test files and dist presence.

## Review Boundaries

### Non-Goals
- Re-running the live end-to-end reindex (deploy-time check, not a code deliverable).
- Modifying any code (observation-only).
- Reviewing the 018 cooperative-yield internals (not re-touched here).

### Stop Conditions
- Single iteration (maxIterations=1) covering all four dimensions, then synthesis.
