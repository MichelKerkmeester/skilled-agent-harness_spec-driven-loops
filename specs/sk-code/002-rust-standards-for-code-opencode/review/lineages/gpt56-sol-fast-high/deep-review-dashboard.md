# Deep Review Dashboard

## Status

- Verdict: FAIL
- Release readiness: release-blocking
- Active findings: P0=1, P1=2, P2=1
- Advisories: true
- Stop reason: maxIterationsReached

## Progress

| Iteration | Focus | New ratio | New findings | Verdict |
|---|---|---:|---:|---|
| 1 | correctness | 0.00 | 0 | PASS |
| 2 | security | 0.00 | 0 | PASS |
| 3 | traceability | 1.00 | 1 P0 | FAIL |
| 4 | maintainability | 1.00 | 1 P1 | CONDITIONAL |
| 5 | traceability | 1.00 | 1 P1 | CONDITIONAL |
| 6 | maintainability | 1.00 | 1 P2 | PASS |
| 7 | stabilization replay | 0.00 | 0 | FAIL |

## Coverage

- Dimensions: 4/4
- Core protocols: spec_code=fail, checklist_evidence=partial
- Router guards: 21/21 pass
- Rust verifiers: pass
- Strict spec validation: fail
- Markdown links: fail, 154 repository-wide broken links; the output includes a substantial `sk-code` cluster attributable to split paths
