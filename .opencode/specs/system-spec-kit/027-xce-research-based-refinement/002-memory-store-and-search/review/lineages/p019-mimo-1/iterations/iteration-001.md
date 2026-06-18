# Review Iteration 001: Correctness Dimension

**Focus**: D1 Correctness — logic, behavior, error handling
**Files reviewed**: 6 files across daemon marker module, launcher guards, supervision predicate, and tests

---

## Summary

Reviewed the maintenance-active marker system end-to-end: the daemon-side writer (`maintenance-marker.ts`), the pure supervision predicate (`model-server-supervision.cjs`), both launcher guard sites (`mk-spec-memory-launcher.cjs`), and the unit + isolated-harness test suites. The core mechanism is sound: reference-counted marker lifecycle, atomic file writes, injectable fs/now for testability, fail-safe toward reaping, and comprehensive test coverage including stale-marker negative controls. No P0 correctness issues found. One P1 spec-code alignment issue and three P2 advisories.

---

## Findings

### F001 [P1] Spec defines `jobId` in marker shape but code uses `labels` array

**Category**: spec-alignment | **File**: `mcp_server/lib/storage/maintenance-marker.ts:44-50` + `spec.md:103`

**Claim**: The spec defines the marker shape as `{ childPid, activeUntilMs, jobId, refreshedAtIso }` but the implementation writes `{ childPid, activeUntilMs, labels, refreshedAtIso }`. The `jobId` field is absent from the marker; instead a `labels` array tracks active maintenance sources (e.g. `['index_scan']`). The `labels` field is not documented in the spec.

**Evidence**:
- `maintenance-marker.ts:44-50`: `writeMarker()` serializes `childPid`, `activeUntilMs`, `labels`, `refreshedAtIso`
- `spec.md:103`: "`.maintenance-active.json` (`{ childPid, activeUntilMs, jobId, refreshedAtIso }`, 60s TTL)"
- `maintenance-marker.ts:28-34`: `MaintenanceMarkerHandle` interface has `refresh()` and `end()`, no `jobId` getter

**Adversarial self-check**: The `labels` approach is strictly better for the reference-counted design (multiple overlapping sources). The spec is stale relative to the implementation. This is a spec-code alignment issue, not a runtime bug.

**Claim adjudication**:
- findingId: F001
- claim: Spec marker shape diverges from implementation (jobId vs labels)
- evidenceRefs: ["mcp_server/lib/storage/maintenance-marker.ts:44-50", "spec.md:103"]
- counterevidenceSought: Checked `tests/launcher-maintenance-guard.vitest.ts` — tests use `jobId` in marker objects but the reader accepts any shape with valid childPid + activeUntilMs, so tests pass despite the field name difference
- alternativeExplanation: Could be an intentional spec simplification, but the mismatch creates confusion for anyone implementing against the spec
- finalSeverity: P1
- confidence: 0.90
- downgradeTrigger: If the spec is updated to document `labels` instead of `jobId`, this becomes P2

---

### F002 [P2] Spec says 60s TTL but implementation uses 180s

**Category**: spec-alignment | **File**: `spec.md:103` + `mcp_server/lib/storage/maintenance-marker.ts:25`

**Claim**: The spec states a 60s TTL for the marker, but the implementation uses 180s. The implementation summary documents this was a deliberate change after a live run showed a 60s TTL lapsed during a ~79s blocking tail phase. The spec was not updated to reflect this.

**Evidence**:
- `spec.md:103`: "60s TTL"
- `maintenance-marker.ts:25`: `const MAINTENANCE_MARKER_TTL_MS = 180_000;`
- `implementation-summary.md:56`: Documents the TTL was raised to 180s after the live failure

---

### F003 [P2] Spec lists key files under `mcp_server/bin/` but actual paths are `.opencode/bin/`

**Category**: spec-alignment | **File**: `spec.md:117-119`

**Claim**: The spec's "Files to Change" table lists `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs`, but the actual files live at `.opencode/bin/lib/model-server-supervision.cjs` and `.opencode/bin/mk-spec-memory-launcher.cjs`.

**Evidence**:
- `spec.md:118`: Lists `mcp_server/bin/lib/model-server-supervision.cjs`
- `spec.md:119`: Lists `mcp_server/bin/mk-spec-memory-launcher.cjs`
- Actual glob results: `.opencode/bin/lib/model-server-supervision.cjs` and `.opencode/bin/mk-spec-memory-launcher.cjs`

---

### F004 [P2] Silent clamping in `end()` without defensive logging

**Category**: correctness | **File**: `mcp_server/lib/storage/maintenance-marker.ts:72-81`

**Claim**: The `end()` method uses `Math.max(0, activeCount - 1)` which silently clamps the count if called more times than `beginMaintenance()`. While harmless (the marker is removed at zero), a defensive log would aid debugging if this ever happens due to a double-end bug.

**Evidence**:
- `maintenance-marker.ts:75`: `activeCount = Math.max(0, activeCount - 1);`

---

## Traceability Checks

### spec_code (partial)

| Aspect | Spec | Code | Status |
|--------|------|------|--------|
| Marker shape | `{ childPid, activeUntilMs, jobId, refreshedAtIso }` | `{ childPid, activeUntilMs, labels, refreshedAtIso }` | MISMATCH |
| TTL | 60s | 180s | MISMATCH (documented in impl-summary) |
| Refresh interval | 20s | 20s | MATCH |
| Marker cleared on exit | Yes (finally) | Yes (finally) | MATCH |
| Pure predicate | `shouldAdoptDespiteProbe` with injectable fs/now | Implemented in `model-server-supervision.cjs:632-640` | MATCH |
| Guard at both reap sites | stale-reclaim + dead-socket | Lines 820-824 and 1688-1693 | MATCH |
| Fail-safe toward reaping | Missing/expired/mismatch/dead → reap | All 4 cases verified in unit tests | MATCH |
| Key files paths | `mcp_server/bin/...` | `.opencode/bin/...` | MISMATCH |

---

## Coverage

- **Dimensions covered**: D1 Correctness (1/4)
- **Files reviewed**: 6/6 listed in strategy
- **New findings**: 4 (0 P0, 1 P1, 3 P2)
- **newFindingsRatio**: 0.40

---

## Verdict

P1 finding present (spec-code marker shape mismatch). No P0 findings.

Review verdict: CONDITIONAL
