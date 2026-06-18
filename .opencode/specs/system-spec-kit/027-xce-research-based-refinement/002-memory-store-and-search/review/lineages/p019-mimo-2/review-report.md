# Review Report: 019-maintenance-grace-daemon-survives-reelection

**Deep Review — Fan-out Lineage p019-mimo-2**

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | CONDITIONAL |
| **hasAdvisories** | true |
| **Scope** | Spec folder 019-maintenance-grace-daemon-survives-reelection |
| **Iterations** | 1 |
| **Stop Reason** | maxIterations (1) |
| **Release Readiness** | in-progress |

**Active Findings:** P0: 0 | P1: 2 | P2: 3

The core runtime logic is sound: the reference-counted maintenance marker in `maintenance-marker.ts` correctly signals busy-by-design state, the 180s TTL provides adequate margin over the longest observed blocking phase (~79s), the `finally`-based cleanup ensures the marker is removed on every terminal exit, and the fail-safe direction (missing/expired marker → reap) is correct. Live verification confirmed a full reindex completed in 330s without daemon reaping.

The two P1 findings are spec-code drift, not runtime defects: the spec declares a `jobId` field but the implementation writes `labels`, and the launcher guard implementation files are not present in the current source tree.

---

## 2. Planning Trigger

The CONDITIONAL verdict with 2 P1 findings routes to `/speckit:plan` for spec alignment work. The findings are documentation/spec drift, not code defects — no runtime behavior change is needed.

---

## 3. Active Finding Registry

### P1-001: Spec declares `jobId` field but implementation writes `labels` array

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Category** | traceability |
| **Evidence** | `maintenance-marker.ts:48`, `spec.md:103`, `launcher-maintenance-guard.vitest.ts:31` |
| **Finding Class** | spec-code-mismatch |

The spec and implementation-summary describe the marker as `{ childPid, activeUntilMs, jobId, refreshedAtIso }`, but `writeMarker()` outputs `{ childPid, activeUntilMs, labels, refreshedAtIso }`. The `labels` array is the reference-counted replacement for the single `jobId`. The test fixture still uses `jobId`, confirming the spec/implementation mismatch.

**Resolution:** Update spec.md to reflect the actual marker shape with `labels` instead of `jobId`.

### P1-002: Launcher guard implementation files not found in codebase

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Category** | traceability |
| **Evidence** | `spec.md:117-118`, `launcher-maintenance-guard.vitest.ts:13` |
| **Finding Class** | missing-implementation |

The spec declares `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs` as files to change. The `bin/` directory does not exist. The unit test requires from `../../../../bin/mk-spec-memory-launcher.cjs`. These may be build artifacts generated from TypeScript sources elsewhere, or they may have been relocated.

**Resolution:** Confirm whether `.cjs` files are build artifacts. If so, update spec to reference the TypeScript source locations. If not, the guard implementation cannot be verified.

### P2-001: `writeMarker()` has no error handling around `atomicWriteFile`

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Category** | correctness |
| **Evidence** | `maintenance-marker.ts:44-51` |
| **Finding Class** | error-handling |

If `atomicWriteFile` fails, the marker won't refresh and will age out. The fail-safe direction (expire → reap) is correct. Self-healing on transient errors via the 20s interval timer.

### P2-002: Module-level mutable state prevents concurrent test isolation

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Category** | maintainability |
| **Evidence** | `maintenance-marker.ts:36-38` |
| **Finding Class** | testability |

`activeCount`, `refreshTimer`, `activeLabels` are module-level. The `__resetMaintenanceMarkerForTest()` export handles this, but parallel test runs of `beginMaintenance` itself would be flaky. Current tests avoid this by testing the launcher predicate instead.

### P2-003: Spec says 60s TTL, implementation uses 180s

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Category** | traceability |
| **Evidence** | `spec.md:103`, `maintenance-marker.ts:25` |
| **Finding Class** | documentation-lag |

The TTL was raised from 60s to 180s after live testing. The implementation-summary documents this. The spec.md scope section still says "60s TTL".

---

## 4. Remediation Workstreams

| Workstream | Findings | Effort |
|------------|----------|--------|
| Spec alignment | P1-001, P2-003 | Low — update spec.md field list and TTL |
| Source tree audit | P1-002 | Low — confirm `.cjs` file provenance |
| Error handling hardening | P2-001 | Low — optional try/catch in writeMarker |

---

## 5. Spec Seed

Update `spec.md` scope section:
- Change marker shape from `{ childPid, activeUntilMs, jobId, refreshedAtIso }` to `{ childPid, activeUntilMs, labels, refreshedAtIso }`
- Change TTL from "60s" to "180s"
- Clarify whether `bin/*.cjs` files are build artifacts or source

---

## 6. Plan Seed

1. Update spec.md to match actual marker shape (P1-001, P2-003)
2. Confirm `.cjs` file provenance and update spec references (P1-002)
3. Optionally add try/catch to `writeMarker()` for defensive logging (P2-001)

---

## 7. Traceability Status

| Protocol | Gate | Status | Notes |
|----------|------|--------|-------|
| `spec_code` | hard | partial | Marker writer works; 2 spec-code mismatches |
| `checklist_evidence` | hard | N/A | Level 1 spec, no checklist.md |

---

## 8. Deferred Items

- D2: Security dimension not reviewed (only 1 iteration allocated)
- D4: Maintainability dimension not reviewed (only 1 iteration allocated)
- The marker `labels` field exposes maintenance source names — low security concern for a local daemon but worth noting

---

## 9. Audit Appendix

### Convergence Evidence

| Signal | Value | Threshold | Vote |
|--------|-------|-----------|------|
| Rolling Average | 0.45 | 0.08 | CONTINUE |
| Dimension Coverage | 2/4 partial | 100% | CONTINUE |
| Stabilization | 0 passes | ≥1 | CONTINUE |

**Composite:** CONTINUE (maxIterations reached before convergence)

### Replay Validation

Iteration 1 JSONL record validated: all required fields present (`type`, `iteration`, `dimensions`, `filesReviewed`, `findingsSummary`, `findingsNew`, `findingDetails`, `newFindingsRatio`). Finding details include `severity`, `category`, `file:line` evidence, `finding_class`, and `content_hash`.

### Session Metadata

| Field | Value |
|-------|-------|
| Session ID | fanout-p019-mimo-2-1781719527072-mk6no9 |
| Lineage Mode | new |
| Generation | 1 |
| Executor | cli-opencode model=xiaomi/mimo-v2.5-pro |
| Artifact Dir | .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/review/lineages/p019-mimo-2 |
