# Deep Review Dashboard

## Status
- **Provisional Verdict**: CONDITIONAL
- **hasAdvisories**: true (P2 findings present)
- **Iteration**: 5 of 10
- **Mode**: review
- **Stop Reason**: converged
- **Composite Stop Score**: 1.00

## Findings Summary

| Severity | Active | Total Seen | Refined |
|----------|--------|------------|---------|
| P0 | 0 | 0 | 0 |
| P1 | 1 | 1 | 0 |
| P2 | 6 | 6 | 0 |

**Total Active**: 7

## Progress Table

| Run | Status | Focus | Dimensions | Ratio | Findings |
|-----|--------|-------|------------|-------|----------|
| 1 | complete | Correctness | correctness | 0.60 | P0:0 P1:1 P2:2 |
| 2 | complete | Security | security | 0.20 | P0:0 P1:0 P2:2 |
| 3 | complete | Traceability | traceability | 0.10 | P0:0 P1:0 P2:1 |
| 4 | complete | Maintainability | maintainability | 0.10 | P0:0 P1:0 P2:1 |
| 5 | complete | Stabilization | all | 0.00 | P0:0 P1:0 P2:0 |

## Coverage

| Dimension | Status | Iterations |
|-----------|--------|------------|
| correctness | covered | 1, 5 |
| security | covered | 2, 5 |
| traceability | covered | 3, 5 |
| maintainability | covered | 4, 5 |

**Coverage**: 100% (4/4 dimensions)

## Traceability

| Protocol | Level | Status | Gate |
|----------|-------|--------|------|
| spec_code | core | partial | hard |
| checklist_evidence | core | pass | hard |
| feature_catalog_code | overlay | pass | advisory |
| playbook_capability | overlay | pass | advisory |

## Trend

| Metric | Value |
|--------|-------|
| Latest newFindingsRatio | 0.00 |
| Rolling Average (last 2) | 0.05 |
| MAD Noise Floor | 0.00 |
| Composite Stop Score | 1.00 |
| Convergence | ACHIEVED |

## Convergence Signals

| Signal | Weight | Value | Threshold | Vote |
|--------|--------|-------|-----------|------|
| Rolling Average | 0.30 | 0.05 | 0.08 | STOP |
| MAD Noise Floor | 0.25 | 0.00 | 0.148 | STOP |
| Dimension Coverage | 0.45 | 100% | 100% | STOP |

## Active Risks
- F001 (P1): mcp-open-design SKILL.md version metadata mismatch (blocks CONDITIONAL -> PASS)
- spec_code protocol partial: version claim does not resolve to shipped behavior
