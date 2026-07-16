# Deep Review Strategy — p020-opus-2

## Topic

Release-readiness review of spec folder `020-maintenance-grace-background-embedding`: a shared, reference-counted maintenance-marker module that protects both the reindex scan and the post-scan background-embedding queue from launcher re-election, closing the loop 019 left open.

## Review Dimensions

- [x] Correctness — logic of the reference-counted marker, begin/end/refresh, idle-tick guard
- [x] Security — marker file contents, trust boundary, injection surface
- [x] Traceability — REQ-001..004, SC-001/SC-002 vs shipped code; spec/impl claims
- [x] Maintainability — clarity, comments, test coverage, module-global state

## Completed Dimensions

All four dimensions covered in iteration 1 (single-pass fan-out lineage, `config.maxIterations=1`).

## Running Findings

- P0: 0
- P1: 0
- P2: 3 (F001 doc-accuracy, F002 design-assumption, F003 observability)

## What Worked

- Tracing the marker writer (`maintenance-marker.ts`) to its consumer (`model-server-supervision.cjs` `readMaintenanceMarker` / `shouldAdoptDespiteProbe`) confirmed the writer/reader schema contract end to end.
- Confirming the dir-resolution parity (`DATABASE_DIR` vs launcher `maintenanceMarkerDir()`) — both mirror `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` precedence — validated the load-bearing path agreement.

## What Failed

- Live test execution (`vitest run tests/maintenance-marker.vitest.ts`) is approval-gated in this autonomous lineage and could not be re-run. SC-001 is verified by static review of the test contract + the impl-summary's recorded PASS, not by re-execution.

## Exhausted Approaches

- N/A (single pass).

## Ruled-Out Directions

- Per-tick marker gap as a P0/P1: ruled out. The marker only matters while the daemon fails the launcher probe (blocked/unresponsive). Between embedding ticks the daemon is responsive and passes the probe, so the absence of a marker between ticks does not expose it to reaping.

## Next Focus

None — converged. Verdict PASS with P2 advisories.

## Known Context

- Predecessor 019 wrote a scan-scoped marker (inline writer, `jobId` field). This phase extracts a shared reference-counted module and widens the writer to the embedding queue.
- Launcher reader consumes only `childPid` + `activeUntilMs`; `labels`/`jobId` are ignored by the adopt guard.
- `resource-map.md` not present at init → coverage gate skipped.
- No `checklist.md` (Level 1) → checklist_evidence protocol skipped; AC_COVERAGE exempt.

## Cross-Reference Status

### Core (hard gates)
- `spec_code`: PASS (REQ-001..004 resolve to shipped behavior; SC-002 deploy-time; one partial claim → F001)
- `checklist_evidence`: SKIPPED (no checklist.md; Level 1)

### Overlay (advisory)
- `feature_catalog_code`: N/A (no catalog claims in scope)
- `playbook_capability`: N/A (no playbook in scope)
- `skill_agent`: N/A (target is spec-folder, not skill)
- `agent_cross_runtime`: N/A (target is spec-folder, not agent)

## Files Under Review

| File | Role |
|------|------|
| `mcp_server/lib/storage/maintenance-marker.ts` | New shared reference-counted marker module |
| `mcp_server/handlers/memory-index.ts` | Scan IIFE refactored onto shared module |
| `mcp_server/lib/providers/retry-manager.ts` | `runBackgroundJob` wired into `beginMaintenance('embedding-queue')` |
| `mcp_server/tests/maintenance-marker.vitest.ts` | New unit test for the module |
| `bin/lib/model-server-supervision.cjs` | Launcher reader (`readMaintenanceMarker`, `shouldAdoptDespiteProbe`) — consumer parity check |
| `bin/mk-spec-memory-launcher.cjs` | Launcher adopt-guard call sites — consumer parity check |

## Review Boundaries

### Non-Goals
- The 019 launcher-side adopt/reap guard (read path) — unchanged, reviewed only for consumer-contract parity.
- A live end-to-end reindex+embedding survival run — deploy-time check, out of code scope.

### Stop Conditions
- `config.maxIterations=1` reached after one all-dimension pass with no P0/P1.
