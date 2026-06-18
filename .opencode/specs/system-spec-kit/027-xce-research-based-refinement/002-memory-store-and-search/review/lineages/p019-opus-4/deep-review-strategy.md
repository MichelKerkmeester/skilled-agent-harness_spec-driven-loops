# Deep Review Strategy — 019 maintenance-grace daemon survives re-election

Fan-out lineage: `p019-opus-4` (executor cli-claude-code, model claude-opus-4-8, maxIterations=1)

## Topic

Review the 019 fix: a daemon-written `.maintenance-active.json` marker plus launcher
adopt guards so a busy-but-healthy daemon (running a background reindex scan) is adopted
instead of reaped+respawned when a second launcher contends mid-scan.

## Review Dimensions

- [x] D1 Correctness — marker writer lifecycle, predicate logic, guard placement
- [x] D2 Security — path/boundary handling, marker trust, PID validation
- [x] D3 Traceability — spec/plan/tasks vs shipped code; REQ-001..004; checklist evidence
- [x] D4 Maintainability — clarity, fail-safe design, test coverage

## Files Under Review

| File | Role |
|------|------|
| `mcp_server/handlers/memory-index.ts` | Daemon marker writer (write/refresh/finally-clear) |
| `.opencode/bin/lib/model-server-supervision.cjs` | Pure predicate `maintenanceMarkerPath`/`readMaintenanceMarker`/`shouldAdoptDespiteProbe` |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | `maintenanceMarkerDir()`, two guard sites, re-exports |
| `mcp_server/core/config.ts` | `DATABASE_DIR` / `computeDatabasePaths` precedence (REQ-004 anchor) |
| `mcp_server/tests/launcher-maintenance-guard.vitest.ts` | Unit coverage (12 cases) |
| `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Isolated harness adopt + stale negative control |

## Cross-Reference Status

### Core (hard)
- `spec_code`: PASS — REQ-001..004 each resolve to shipped behavior (code + live reindex + marker artifact).
- `checklist_evidence`: PASS — implementation-summary Verification table corroborated.

### Overlay
- None applicable (spec-folder target; no skill/agent/catalog/playbook overlays scheduled).

## Known Context

- `resource-map.md not present. Skipping coverage gate.`
- Predecessor 018 made the scan cooperative; its yields are the discriminator that keeps the marker fresh.
- Live evidence: full force reindex completed in 330s with the daemon pid unchanged; launcher log shows the marker driving repeated adopt/refuse-respawn decisions.
- A live `.maintenance-active.json` artifact is present at `mcp_server/database/`, confirming the daemon's write dir matches the launcher's default `maintenanceMarkerDir()`.

## Review Boundaries

- Observation-only. No code under review was modified.
- All writes confined to the lineage artifact dir `review/lineages/p019-opus-4`.

## Non-Goals

- Re-running the live end-to-end reindex (deploy-time check, out of scope per spec §3).
- Re-touching 018 cooperative-yield work.

## Stop Conditions

- maxIterations=1 reached after one full-coverage pass.

## Next Focus

- Complete (single iteration; converged to synthesis).
