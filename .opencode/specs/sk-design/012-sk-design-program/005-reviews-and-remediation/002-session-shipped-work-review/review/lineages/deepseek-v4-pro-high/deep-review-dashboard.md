# Deep Review Dashboard

## Status

- **Provisional verdict:** CONDITIONAL
- **hasAdvisories:** true (4 P2 findings)
- **Iteration:** 4 of 5
- **Mode:** auto
- **Stop reason:** convergence

## Findings Summary

| Severity | Active | New (last iter) | Refined (last iter) |
|----------|--------|-----------------|---------------------|
| P0 | 0 | 0 | 0 |
| P1 | 2 | 0 | 0 |
| P2 | 4 | 1 | 0 |

## Dimension Coverage

| Dimension | Covered | Status |
|-----------|---------|--------|
| Correctness | Yes | complete (iter 001) |
| Security | Yes | complete (iter 002) |
| Traceability | Yes | complete (iter 003) |
| Maintainability | Yes | complete (iter 004) |

## Progress Table

| Iter | Focus | Dims | Ratio | Findings | Status |
|------|-------|------|-------|----------|--------|
| 001 | Correctness | correctness | 0.55 | P1:2, P2:1 | complete |
| 002 | Security | security | 0.25 | P1:1 | complete |
| 003 | Traceability | traceability | 0.05 | P2:1 | complete |
| 004 | Maintainability | maintainability | 0.05 | P2:1 | complete |

## Next Focus

All dimensions complete. Synthesized to review-report.md.

## Trend

| Ratio Sequence | Direction |
|----------------|-----------|
| 0.55 → 0.25 → 0.05 → 0.05 | Descending → converged |

Rolling average (last 2): 0.05 < 0.08 rollingStopThreshold. Composite stop score: 0.75 ≥ 0.60. **CONVERGED.**

## Active Findings

| ID | Severity | Title |
|----|----------|-------|
| F001 | P1 | writeManifestPointer atomicity gap on afterRename failure |
| F002 | P1 | Stale feature-catalog docs reference deleted commands/design/ |
| F003 | P2 | Playbook scenario references deleted commands/design/ path |
| F004 | P1 | Temp-file naming uses process.pid, collision-prone under PID reuse |
| F005 | P2 | Changelog v1.6.0.0 claims /design:* aliases remain |
| F006 | P2 | isContained duplicated in two modules |
