# Iteration 1: Correctness of reference-counted maintenance marker

## Focus
- Dimension: D1 Correctness
- Files reviewed:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts`
- Scope: Verify that the shared marker module satisfies the reference-counting contract, that the scan and embedding queue wire it correctly, and that idle ticks do not mark.

## Scorecard
- Dimensions covered: [correctness]
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F001**: Test-only reset helper leaves the on-disk marker behind, `mcp_server/lib/storage/maintenance-marker.ts:87-91`. `__resetMaintenanceMarkerForTest` clears the in-memory timer, `activeCount`, and `activeLabels`, but does not remove the `.maintenance-active.json` file from `DATABASE_DIR`. The current tests create a fresh temp directory per case and remove it in `afterEach`, so the leak is benign today. If a future test reuses a `DATABASE_DIR` and calls this helper without directory cleanup, the stale marker could cause false positives. Fix: call `rmSync(markerPath(), { force: true })` inside `__resetMaintenanceMarkerForTest` before clearing state, or document that callers must clean the directory.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | spec.md:103, spec.md:116-118, implementation-summary.md:86-92 | Correctness claims verified against code; traceability claims not yet audited in this iteration |

## Assessment
- New findings ratio: 1.00 (one P2 finding, severity weight 1.0 / total findings weight 1.0)
- Dimensions addressed: [correctness]
- Novelty justification: The reference-counting core logic is correct; the only new observation is a benign test-helper cleanup gap.

## Ruled Out
- Race between overlapping `beginMaintenance`/`end()` calls: JavaScript runs the synchronous body of these functions to completion, so the module-level state transitions are atomic with respect to each other. Timer callbacks cannot interleave mid-call.
- Marker leak on exception in `runBackgroundJob`: the `finally` block at `retry-manager.ts:1052-1061` always calls `maintenanceHandle?.end()`.
- Marker leak on exception in background scan: the `finally` block at `memory-index.ts:1536-1541` always calls `maintenance.end()`.

## Dead Ends
- N/A

## Recommended Next Focus
If continuing, review D3 Traceability: confirm the synchronous foreground scan path was intentionally left unmarked (vs. 019's inline writer) and verify checklist evidence in `implementation-summary.md`.

Review verdict: PASS
