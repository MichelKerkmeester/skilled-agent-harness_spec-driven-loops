# Deep Review Dashboard

**Target**: 019-maintenance-grace-daemon-survives-reelection
**Status**: CONDITIONAL | **hasAdvisories**: true
**Session**: fanout-p019-mimo-1-1781719527072-mk6no9
**Executor**: cli-opencode (xiaomi/mimo-v2.5-pro)

## Findings Summary

| Severity | Count | Delta |
|----------|-------|-------|
| P0 | 0 | — |
| P1 | 1 | +1 |
| P2 | 3 | +3 |

## Progress Table

| Iter | Focus | Ratio | Findings | Status |
|------|-------|-------|----------|--------|
| 1 | Correctness | 0.40 | 1P1 + 3P2 | complete |

## Coverage

- **Dimensions**: 1/4 complete (Correctness)
- **Files reviewed**: 6
- **Traceability**: spec_code=partial, checklist_evidence=skipped (no checklist.md)

## Trend

- Ratios: [0.40] — single iteration, no trend yet

## Active Risks

- **P1 spec-code alignment**: marker shape (jobId vs labels) and TTL (60s vs 180s) mismatch spec
- **maxIterations reached**: 1/1 iterations used, stopping
