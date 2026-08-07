# Deep Research Dashboard

## Lifecycle
- Session: `fanout-sol-1784861928387-6wq7tm`
- Status: complete
- Stop reason: `maxIterationsReached`
- Iterations: 10 / 10

## Iteration Table
| Run | Focus | newInfoRatio | Findings | Status |
|---|---|---:|---:|---|
| 1 | Direct-child consistency | 0.75 | 4 | complete |
| 2 | Nested resume topology | 1.00 | 4 | complete |
| 3 | Parent canon vs live runtime | 1.00 | 5 | complete |
| 4 | Full-tree links | 1.00 | 4 | complete |
| 5 | Fleet claims and lifecycle | 0.75 | 4 | complete |
| 6 | Other nested descendants | 0.83 | 3 | complete |
| 7 | 020/005 idea children | 0.88 | 4 | complete |
| 8 | Commit changed-hunk closure | 0.00 | 0 | insight |
| 9 | Finding reconciliation | 0.10 | 27 | insight |
| 10 | Terminal verification | 0.10 | 0 | insight |

## Canonical Findings
- Total: 27
- P1: 22
- P2: 5
- NEW: 4
- PRE-EXISTING: 23
- Source anchors verified: 62 / 62

## Active Risks
- Four defects were introduced by the parent corrective commit.
- Multiple phase parents cannot resume deterministically.
- Numerous children claim levels/completion unsupported by required packet files.
- Fleet compiled activation is live, but complete hard-invariant closure is not.

## Next Focus
Remediation planning outside this research-only lineage.
