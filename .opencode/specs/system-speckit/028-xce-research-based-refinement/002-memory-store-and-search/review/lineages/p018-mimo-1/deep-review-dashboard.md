# Deep Review Dashboard

## Run Summary

| Field | Value |
|-------|-------|
| **Spec Folder** | `018-reindex-scan-responsiveness-and-cancellation` |
| **Session ID** | `fanout-p018-mimo-1-1781718236450-bbehhf` |
| **Lineage** | p018-mimo-1 |
| **Executor** | cli-opencode model=xiaomi/mimo-v2.5-pro |
| **Iterations Completed** | 1 / 1 (maxIterations hit) |
| **Stop Reason** | maxIterations |
| **Verdict** | CONDITIONAL |

## Severity Counts

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 1 |
| P2 | 4 |

## Dimension Coverage

| Dimension | Iteration | Status |
|-----------|-----------|--------|
| Correctness | 001 | ✅ Covered |
| Security | — | Not covered (maxIterations=1) |
| Spec-Alignment | — | Not covered (maxIterations=1) |
| Completeness | — | Not covered (maxIterations=1) |

## Finding Details

### P1-001: isCancelRequestedFast / crash-recovery coupling
- **File:** `job-store.ts:339-341`
- **Class:** design-coupling
- **Status:** Active
- **Remediation:** Document coupling; consider DB-backfill on boot

### P2-001 to P2-004: Advisory notes
- Yield granularity (200 rows, 50 folders) — acceptable for current scale
- shouldAbort batch-level vs item-level — dual-layer guard covers
- cancelledJobIds cleanup — verified on both paths

## Risk Score (Advisory)

Overall risk: **Low**. The single P1 is mitigated by an existing code path (resetRunningJobsForKind) and does not affect the deployed behavior. All P2 findings are advisory.
