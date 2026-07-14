# Deep Review Dashboard

## Status

- Iterations: 10 / 10
- Stop reason: `maxIterationsReached`
- Verdict: `FAIL`
- hasAdvisories: false

## Findings Summary

| Severity | Active | Resolved |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 2 | 0 |
| P2 | 0 | 0 |

## Progress

| Iteration | Focus | New ratio | Status |
|---:|---|---:|---|
| 1 | Inventory/correctness | 0.00 | complete |
| 2 | Template correctness | 1.00 | complete |
| 3 | Security | 0.00 | complete |
| 4 | Traceability | 1.00 | complete |
| 5 | Maintainability scope | 0.50 | insight |
| 6 | Correctness replay | 0.00 | complete |
| 7 | Security stabilization | 0.00 | complete |
| 8 | Traceability replay | 0.00 | complete |
| 9 | Maintainability stabilization | 0.00 | complete |
| 10 | Cross-dimensional stabilization | 0.00 | complete |

## Coverage

- Dimensions: 4 / 4
- Core traceability: `spec_code=partial`, `checklist_evidence=fail`
- Corpus: 163 / 163 target files structurally checked
- Hub link replay: 328 tracked Markdown files checked

## Active Risks

- F001: template semantics remain incomplete in 21 files.
- F002: completion evidence claims a gate that currently fails.
- Strict packet validation is blocked by stale compiled validator infrastructure.
