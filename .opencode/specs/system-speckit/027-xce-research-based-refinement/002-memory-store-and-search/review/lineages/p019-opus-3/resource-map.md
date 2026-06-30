# Resource Map — lineage p019-opus-3 (emitted from review delta evidence)

> The target spec folder had no `resource-map.md` at init (`resource_map_present: false`), so the
> implementation-vs-map **coverage gate** was skipped and no `## Resource Map Coverage Gate` section
> appears in `review-report.md`. This file is the Phase-5 augmentation map emitted from converged delta
> evidence.

## Reviewed implementation surfaces
| Path | Role | Verdict |
|------|------|---------|
| `mcp_server/lib/storage/maintenance-marker.ts` | Reference-counted marker writer (`beginMaintenance`/`refresh`/`end`) | correct; emits `labels` (F002) |
| `mcp_server/handlers/memory-index.ts` | Scan IIFE integration (`beginMaintenance('index_scan')` + phase-boundary refresh) | correct |
| `mcp_server/lib/providers/retry-manager.ts` | Embedding-queue integration (`beginMaintenance('embedding-queue')`) | correct; contradicts impl-summary limitation (F001) |
| `mcp_server/core/config.ts` | `DATABASE_DIR` env precedence + boundary check | correct; REQ-004 parity |
| `.opencode/bin/lib/model-server-supervision.cjs` | Pure `shouldAdoptDespiteProbe` / `readMaintenanceMarker` predicate | correct; fail-safe |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Both guard sites + `maintenanceMarkerDir()` | correct |
| `mcp_server/tests/launcher-maintenance-guard.vitest.ts` | Predicate + reader unit tests | covers 7 branches; fixtures use `jobId` (F002) |
| `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Isolated harness adopt + stale negative control | covers SC-001 |

## Phase-5 Augmentation — novel logic gaps
- **Empty result.** No novel-logic gaps surfaced beyond the four documentation-drift findings already in
  `review-report.md` (F001-F004). No untested code path, no uncovered branch, and no implementation file
  absent from the change set was found. The predicate's 7 decision branches and both harness cases
  (adopt + stale) are exercised.
