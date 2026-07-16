# Iteration 1: Correctness Review

## Focus
Correctness dimension (D1) across all target files: maintenance-marker.ts, memory-index.ts, retry-manager.ts, and maintenance-marker.vitest.ts. Reviewed reference-counting lifecycle, idempotency, overlap semantics, and embedding-queue wiring.

## Scorecard
- Dimensions covered: Correctness
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.15

## Findings

### P2, Suggestion

- **F001**: Stale labels on disk when multiple holders overlap, `mcp_server/lib/storage/maintenance-marker.ts:76-77`. When `end()` decrements `activeCount` but other holders remain, the on-disk marker file is NOT rewritten with the pruned label set. The in-memory `activeLabels` array is updated correctly (splice removes the label), but the file retains the old labels until the next write event (begin, refresh, or 20s timer tick). Impact: purely informational — the launcher reads the marker file for existence only (adopt/reap guard), never inspects labels. The reference-counting contract (file present while >=1 holder, removed at 0) is correct.

- **F002**: No test for duplicate-label reference counting, `mcp_server/tests/maintenance-marker.vitest.ts`. Calling `beginMaintenance('scan')` twice before either ends pushes two `'scan'` entries into `activeLabels`. `end()` removes the first found via `indexOf`. This works correctly (file removed at 0 holders) but produces duplicate labels in the on-disk file. No existing test covers this path.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | spec.md:103-106, maintenance-marker.ts:58-84 | beginMaintenance(label) -> {refresh(), end()} matches spec REQ-001; reference counting, 180s TTL, 20s refresh, idempotent end |
| spec_code | pass | hard | spec.md:105, retry-manager.ts:1038 | runBackgroundJob calls beginMaintenance('embedding-queue') after empty-queue guard, ends in finally; matches REQ-002 |
| spec_code | pass | hard | spec.md:104, memory-index.ts:13+scan IIFE | Scan IIFE uses shared module; matches spec scope |
| checklist_evidence | partial | hard | N/A | No checklist.md in spec folder |

## Assessment
- New findings ratio: 0.15 (2 P2 findings, no P0/P1)
- Dimensions addressed: Correctness
- Novelty justification: Both findings are low-severity advisory items. F001 is a cosmetic disk-state issue that doesn't affect the launcher's adopt/reap logic. F002 is a test-coverage gap for an edge case that works correctly.

## Ruled Out
- Reference-counting race condition: Node.js is single-threaded, so the module-level globals (activeCount, activeLabels, refreshTimer) are safe from concurrent mutation. No async interleaving between the count increment and the writeMarker call.
- Idempotent end() double-removal: The `ended` closure flag prevents double-decrement. `rmSync` with `force: true` is safe on missing file. Confirmed by existing test at line 111-121.
- Scan/embedding overlap clobbering: Reference counting correctly handles the overlap (scan defers embeddings, queue later drains them). Both can hold the marker simultaneously. The spec's REQ-003 is satisfied.

## Dead Ends
- None.

## Recommended Next Focus
Security dimension (D2): review input validation, error message sanitization in retry-manager.ts (sanitizeEmbeddingFailure), and potential information leakage in marker file contents (childPid, labels).

Review verdict: PASS
