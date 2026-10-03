# Deep Research Dashboard — Luna lineage

State is lineage-local. The standard reducer was not run because its resolver targets the packet folder outside this lineage's authorized write surface.

## Iteration Table
| Iteration | Focus | Findings | newInfoRatio | Status |
|---:|---|---:|---:|---|
| 1 | Score arithmetic and detector behavior | 5 | 0.80 | complete |
| 2 | Accuracy, cost and measurement trust | 5 | 0.80 | complete |
| 3 | Reuse and default-on integration | 5 | 0.80 | complete |

## Question Status
5/5 primary questions answered with limits; 1 residual data question remains open.

## Convergence Trend
0.80, 0.80, 0.80 vs threshold 0.05. Early stop was not indicated; max-iterations was reached at iteration 3.

## Dead Ends
Do not infer live miss causes or label quality from aggregate counts or synthetic fixtures. Do not use the current regex as the model-call gate. Do not default-on Jev after stop (margin).

## Next Focus
Synthesis at stopReason maxIterationsReached.
