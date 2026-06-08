# Deep Review Dashboard — fan-out lineage opus-1 (auto-generated)

## Status
- Provisional verdict: **PASS**
- hasAdvisories: **true** (5 active P2)
- Release readiness: **converged**

## Findings Summary
| Severity | Active | Δ vs prev |
|----------|--------|-----------|
| P0 | 0 | 0 |
| P1 | 0 | 0 |
| P2 | 5 | +5 |

## Progress Table
| Iter | Focus | newFindingsRatio | Findings (new) | Status |
|------|-------|------------------|----------------|--------|
| 1 | correctness · security · traceability · maintainability | 1.00 | P0:0 P1:0 P2:5 | complete |

## Coverage
- Dimensions: 4/4 (correctness, security, traceability, maintainability)
- Files reviewed: 12/12 (2 partial: launcher-session-proxy.cjs, release-integration.vitest.ts)
- Traceability: core spec_code=pass, checklist_evidence=partial; overlay feature_catalog_code=partial, others N/A

## Trend
- Last ratios: 1.00 (single iteration; flat — converged at maxIterations)

## Active Risks
- None blocking. 5 P2 advisories open. F003 carries a conditional upgrade-to-P1 trigger pending Codex hook-schema confirmation.
