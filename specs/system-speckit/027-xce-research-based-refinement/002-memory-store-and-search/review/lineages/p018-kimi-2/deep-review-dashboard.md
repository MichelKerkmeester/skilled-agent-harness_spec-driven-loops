# Deep Review Dashboard: reindex-scan responsiveness and cancellation

> Auto-generated. Do not edit manually.

## Status

- Iteration: 1 of 1
- Provisional verdict: PASS
- hasAdvisories: true
- Mode: review
- Target: spec-folder

## Findings Summary

| Severity | Active | Delta |
|----------|--------|-------|
| P0 | 0 | 0 |
| P1 | 0 | 0 |
| P2 | 1 | +1 |

## Progress Table

| Run | Status | Focus | Dimensions | New Findings Ratio | Duration (ms) |
|-----|--------|-------|------------|-------------------|---------------|
| 1 | complete | correctness | correctness | 0.10 | 300000 |

## Coverage

| Dimension | Covered |
|-----------|---------|
| correctness | yes |
| security | no |
| traceability | no |
| maintainability | no |

### Traceability Protocols

| Protocol | Level | Status |
|----------|-------|--------|
| spec_code | core | pass |
| checklist_evidence | core | pass |
| feature_catalog_code | overlay | not run |
| playbook_capability | overlay | not run |

## Trend

- Last new findings ratio: 0.10
- Direction: flat (single iteration)

## Active Risks

- Single-iteration review; security, traceability, and maintainability dimensions not covered.
- Synchronous scan path remains non-cancellable (P2 advisory).
