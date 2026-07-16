# Deep Review Dashboard — p017c002-opus (auto-generated)

## Status

- Provisional verdict: **CONDITIONAL**
- hasAdvisories: **true**
- Release-readiness: in-progress

## Findings Summary

| Severity | Active | New (iter 1) | Delta |
|----------|--------|--------------|-------|
| P0 | 0 | 0 | — |
| P1 | 3 | 3 | +3 |
| P2 | 2 | 2 | +2 |

## Progress Table

| Iter | Status | Focus | Dimensions | newFindingsRatio | Findings |
|------|--------|-------|------------|------------------|----------|
| 1 | complete | full packet | correctness, security, traceability, maintainability | 0.80 | 0 / 3 / 2 |

## Coverage

- Dimensions completed: 4 / 4 (correctness, security, traceability, maintainability)
- Files reviewed: 8
- Traceability protocols: core spec_code=fail, checklist_evidence=skipped; overlays n/a

## Trend

- Single iteration (fan-out lineage, maxIterations=1); no rolling trend.
- Stop reason: maxIterations reached.

## Active Risks

- F003: shipped fix is not live (dist unbuilt) yet packet marked 100% complete.
- F001: graph-metadata Status="planned" misrepresents a finished packet to resume/search.
- Test suite not re-executed here (permission-blocked); code verified by trace + self-report.
```
