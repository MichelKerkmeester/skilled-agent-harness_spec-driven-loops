# Iteration 1: Correctness

## Focus
D1 Correctness — All implementation files: `maintenance-marker.ts`, `memory-index.ts` (scan integration), `retry-manager.ts` (embedding queue integration), `maintenance-marker.vitest.ts` (unit test).

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F001**: End-of-`end()` leaves stale labels in marker file until next refresh. When a holder calls `end()` while other holders remain active, the marker file is not rewritten, so the on-disk `labels` array may include the just-ended holder's label for up to 20s (next timer refresh). The marker presence/absence logic is unaffected — the file stays present while `activeCount > 0`. This is a cosmetic diagnostic staleness concern.
  - `mcp_server/lib/storage/maintenance-marker.ts:72-81`
  - Dimension: maintainability

- **F002**: `activeLabels` index-based removal is O(n) via `indexOf` + `splice`. In typical usage (2-3 concurrent labels: `'index_scan'`, `'embedding-queue'`, potentially `'checkpoint'`) this is harmless, but the linear scan is not bounded.
  - `mcp_server/lib/storage/maintenance-marker.ts:76-77`
  - Dimension: maintainability

- **F003**: No explicit test distinguishes foreground vs background scan marker behavior. The `handleMemoryIndexScan` function dispatches to `runIndexScan(args, {})` (no marker) for synchronous paths and to a `setImmediate` IIFE (with marker) for background paths. The existing test suite covers the marker module internals and the scan/launcher-guard integration, but does not include a unit test that verifies the foreground path does NOT produce a maintenance marker.
  - `mcp_server/handlers/memory-index.ts:1488-1491`
  - Dimension: maintainability

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | All 4 REQ claims verified against implementation at cited file:line | REQ-001 verified at maintenance-marker.ts:25-26,58-84; REQ-002 verified at retry-manager.ts:1032-1038; REQ-003 verified via reference-counting logic at maintenance-marker.ts:58-84; REQ-004 verified at retry-manager.ts:1033 return early before beginMaintenance |
| checklist_evidence | notApplicable | hard | No checklist.md present (Level 1 spec per spec.md:37) | Per protocol, checked-item verification is skipped when no checklist exists |
| feature_catalog_code | pass | advisory | Feature catalog claim "Workspace scanning and indexing (memory_index_scan)" at memory-index.ts:77-78 matches handler dispatch at memory-index.ts:1488-1553 | Catalog matches implementation |

## Assessment
- New findings ratio: 1.00 (3 new P2 findings weighted at 1.0 each; weightedNew=3.0, weightedTotal=3.0, ratio=1.00 on all-new first iteration)
- Dimensions addressed: correctness
- Novelty justification: First-pass review of all spec-mapped source files. All 4 REQ claims confirmed resolved in implementation. Three minor maintainability observations noted as P2 advisories.

All normative spec claims (REQ-001 through REQ-004) resolve to shipped behavior with verified file:line evidence:
- REQ-001 (shared ref-counted module): `maintenance-marker.ts:25-26` (TTL/refresh constants), `58-84` (beginMaintenance/end/ref-count logic)
- REQ-002 (embedding queue protected): `retry-manager.ts:1032-1038` (empty-queue guard then beginMaintenance), `1055` (end in finally)
- REQ-003 (overlapping scan + embedding queue): Reference counting at `maintenance-marker.ts:58-84` prevents either holder's end() from removing the file while the other is active
- REQ-004 (idle tick never marks): `retry-manager.ts:1033` returns `{ queue_empty: true }` before `beginMaintenance` is called

The scan integration in `memory-index.ts:1496-1543` correctly: creates the marker at line 1502 (`beginMaintenance('index_scan')`), refreshes at each phase boundary (line 1510), and ends in the finally block (line 1540). The synchronous foreground path at line 1489-1490 correctly skips the marker since the caller blocks synchronously.

## Ruled Out
- **Race between activeCount and file write**: Single-threaded Node.js environment makes reference-counting safe without atomics — no interleaving within the event loop tick. Ruled out.
- **Timer leak on overlapping begin/end cycles**: `beginMaintenance` guards timer creation with `if (!refreshTimer)`, and `end()` only clears when `activeCount === 0`. Correctly reuses one timer across all holders.

## Dead Ends
No dead-end investigation paths.

## Recommended Next Focus
D2 Security — verify input handling in the marker module (process.pid, label string), and check that the marker file write path (`atomicWriteFile`) is secure. Verify the embedding queue's content loading and retry logic does not expose filesystem access beyond intended paths.

## Claim Adjudication
No P0/P1 findings to adjudicate.

Review verdict: PASS
