# Iteration 1: Correctness + Traceability

**Focus Dimension:** D1: Correctness (with traceability cross-checks)
**Files Reviewed:** maintenance-marker.ts, memory-index.ts:1490-1549, launcher-maintenance-guard.vitest.ts, daemon-reelection-adoption-live.vitest.ts:340-488
**Date:** 2026-06-17

---

## Findings

### P1-001: Spec declares `jobId` field but implementation writes `labels` array

**Severity:** P1
**Category:** traceability
**Evidence:** [SOURCE: mcp_server/lib/storage/maintenance-marker.ts:48] — the marker JSON includes `labels: activeLabels`. [SOURCE: spec.md:103] — spec declares marker shape `{ childPid, activeUntilMs, jobId, refreshedAtIso }`.

The spec and implementation-summary both describe the marker as containing a `jobId` field, but the actual `writeMarker()` writes a `labels` array (the accumulated maintenance source labels). The test at [SOURCE: tests/launcher-maintenance-guard.vitest.ts:31] uses `jobId: 'index-scan-1'` in its `freshMarker` fixture, confirming the spec/implementation mismatch — the test fixture shape does not match the actual writer output.

**Impact:** The launcher guard predicate (which checks `childPid` and `activeUntilMs`) is unaffected since it does not read `jobId` or `labels`. However, any future launcher logic that expects `jobId` per the spec will find `labels` instead. This is a spec-code drift, not a runtime bug.

**Claim Adjudication Packet:**
- **findingId:** P1-001
- **claim:** The marker writer outputs `labels` instead of the spec-declared `jobId` field
- **evidenceRefs:** ["mcp_server/lib/storage/maintenance-marker.ts:48", "spec.md:103", "tests/launcher-maintenance-guard.vitest.ts:31"]
- **counterevidenceSought:** Checked if `labels` was a rename of `jobId` — no, the test still uses `jobId` in its fixture while the writer emits `labels`. The two fields serve different purposes (`jobId` is a single identifier, `labels` is an array of maintenance source names).
- **alternativeExplanation:** The spec may have been written before the reference-counting design was implemented, and `jobId` was replaced by `labels` during implementation without updating the spec.
- **finalSeverity:** P1
- **confidence:** 0.95
- **downgradeTrigger:** If the launcher guard predicate is confirmed to never read `jobId`, this could be downgraded to P2 (spec drift with no runtime impact).
- **transitions:** []

### P1-002: Launcher guard implementation files not found in codebase

**Severity:** P1
**Category:** traceability
**Evidence:** [SOURCE: spec.md:117-118] — spec declares `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs` as files to change. [SOURCE: implementation-summary.md:57-58] — claims the guard is "exported for both the launcher and the unit test". [SOURCE: tests/launcher-maintenance-guard.vitest.ts:13] — `require('../../../../bin/mk-spec-memory-launcher.cjs')` references a path that does not exist in the current source tree.

The `bin/` directory under `mcp_server/` does not exist. The launcher and supervision `.cjs` files are absent. The unit test `launcher-maintenance-guard.vitest.ts` requires from `../../../../bin/mk-spec-memory-launcher.cjs`, which would fail at test runtime unless these are build artifacts generated from a different source.

**Impact:** Cannot verify the launcher-side guard implementation matches the spec. The `shouldAdoptDespiteProbe` and `readMaintenanceMarker` predicates — the core of this spec — cannot be audited. The unit test exercises the predicate through the launcher require, so if the test passes, the predicate works, but the source of truth for the predicate logic is invisible.

**Claim Adjudication Packet:**
- **findingId:** P1-002
- **claim:** The launcher guard implementation files referenced in the spec and tests are not present in the current codebase
- **evidenceRefs:** ["spec.md:117-118", "tests/launcher-maintenance-guard.vitest.ts:13"]
- **counterevidenceSought:** Searched for `model-server-supervision` and `mk-spec-memory-launcher` across the entire codebase with glob — no matches. Checked if they might be under a `dist/` or `build/` directory — no `bin/` directory exists at all.
- **alternativeExplanation:** The `.cjs` files may be generated build artifacts from TypeScript sources that live elsewhere, or they may have been relocated/renamed since the spec was written.
- **finalSeverity:** P1
- **confidence:** 0.90
- **downgradeTrigger:** If the `.cjs` files are confirmed to be build artifacts generated from TypeScript sources elsewhere, this becomes P2 (documentation gap about build output location).
- **transitions:** []

### P2-001: `writeMarker()` has no error handling around `atomicWriteFile`

**Severity:** P2
**Category:** correctness
**Evidence:** [SOURCE: mcp_server/lib/storage/maintenance-marker.ts:44-51]

`writeMarker()` calls `atomicWriteFile()` without a try/catch. If the write fails (disk full, permissions error), the marker will not be refreshed, and after the TTL expires the daemon becomes reapable — even though it is still healthy. The interval timer will call `writeMarker` again in 20s, so the failure is self-healing if the cause is transient. For a persistent disk error, the marker will age out and the daemon will be reaped, which is the correct fail-safe behavior.

**Impact:** Low. The fail-safe direction (marker expires → reap) is correct. A persistent disk error that prevents marker writes would also likely affect other daemon operations.

### P2-002: Module-level mutable state prevents concurrent test isolation

**Severity:** P2
**Category:** maintainability
**Evidence:** [SOURCE: mcp_server/lib/storage/maintenance-marker.ts:36-38]

`activeCount`, `refreshTimer`, and `activeLabels` are module-level variables. The `__resetMaintenanceMarkerForTest()` function resets them, but if tests run in parallel (vitest default), the shared state can cause flaky tests. The test file at [SOURCE: tests/launcher-maintenance-guard.vitest.ts] avoids this by testing the launcher's predicate (which uses injected fs/now) rather than the marker module directly, but any future tests of `beginMaintenance` itself will need careful serialization.

**Impact:** Low. Current tests avoid the issue. The `__resetMaintenanceMarkerForTest` export is a reasonable convention for this codebase.

### P2-003: Spec says 60s TTL, implementation uses 180s — documentation lag

**Severity:** P2
**Category:** traceability
**Evidence:** [SOURCE: spec.md:103] — "60s TTL". [SOURCE: mcp_server/lib/storage/maintenance-marker.ts:25] — `MAINTENANCE_MARKER_TTL_MS = 180_000`.

The spec was written with the original 60s TTL. The implementation raised it to 180s after live testing showed a ~79s blocking phase that caused the marker to expire prematurely. The implementation-summary documents this change, but the spec.md scope section still says "60s TTL".

**Impact:** None at runtime. The 180s value is correct and documented in implementation-summary.md. The spec.md just needs updating.

---

## Adversarial Self-Check (P0 candidates)

No P0 findings were identified. The core design is sound: reference-counted marker with TTL-based expiry, fail-safe toward reaping, and clean `finally`-based cleanup. The two P1 findings are spec-code drift, not runtime defects.

---

## Dimension Coverage

| Dimension | Status |
|-----------|--------|
| D1: Correctness | reviewed (this iteration) |
| D2: Security | partial (marker writes to DATABASE_DIR with atomicWriteFile; no injection surface identified) |
| D3: Traceability | partial (2 P1 spec-code mismatches found) |
| D4: Maintainability | not yet |

## Strategy Updates

- Next focus: D4 Maintainability (or D2 Security if more iterations allowed)
- The two P1 findings are both traceability drift, not correctness defects
- The core marker logic is clean and well-tested

---

Review verdict: CONDITIONAL
