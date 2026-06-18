# Deep Research Dashboard - gpt Lineage

## Iteration Table

| run | focus | newInfoRatio | findings count | status |
|---:|---|---:|---:|---|
| 1 | KQ1 parity matrix | 0.92 | 5 | complete |
| 2 | KQ2 daemon dependencies | 0.78 | 5 | complete |
| 3 | KQ3 affordance transfer | 0.70 | 5 | complete |
| 4 | KQ4 Python prior art | 0.90 | 7 | complete |
| 5 | KQ5 long-running ops | 0.62 | 5 | complete |
| 6 | KQ6 integration map | 0.68 | 6 | complete |
| 7 | KQ7 hook latency | 0.74 | 6 | complete |
| 8 | KQ8 races/orphans | 0.76 | 6 | complete |
| 9 | KQ9 design deltas | 0.66 | 8 | complete |
| 10 | KQ10 verdict | 0.42 | 6 | complete |

## Question Status

10/10 answered. Stop reason: `maxIterationsReached` by forced lineage cap; all questions have terminal answers.

## Trend

Last 3 ratios: `0.76 -> 0.66 -> 0.42`, descending as the lane moved from discovery to synthesis.

## Dead Ends

- Python-only CLI.
- MCP removal.
- Hook-time one-shot native subprocess.
- Daemonless full parity.
- Hand-written schema fork.

## Next Focus

Implementation D1-D4 first: generated CLI registry, Python reconciliation, trusted graph mutation policy, warm hook path.

## Active Risks

- Direct rebuild/scan timings still need a mutation-capable implementation phase.
- Live orphan count was not re-measured because process inspection was blocked.
