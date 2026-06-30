# Deep Review Dashboard - GLM Lineage

| Metric | Value |
|--------|-------|
| Lineage | glm |
| Executor | cli-opencode (zai-coding-plan/glm-5.2) |
| Stop reason | early-convergence (operator directive) |
| Iterations verified (JSONL) | 11 |
| Iterations attempted | 11 |
| maxIterations | 50 |
| convergenceThreshold | 0.01 |
| Stop policy | max-iterations (overridden to early-converge) |
| **P0** | **0** |
| **P1** | **8** |
| **P2** | **1** |
| Verdict | CONDITIONAL |
| Release-readiness | converged (CONDITIONAL) |

## Dimension Coverage

| Dimension | Verdict | Iteration |
|-----------|---------|-----------|
| workflow-state-integrity | CONDITIONAL | 001 |
| fanout-lineage-isolation | CONDITIONAL | 002 |
| correctness | CONDITIONAL | 003 |
| security | CONDITIONAL | 004 |
| traceability | CONDITIONAL | 005 |
| maintainability | CONDITIONAL | 006 |
| resource-map-coverage | CONDITIONAL | 007 |
| cross-runtime-parity | PASS | 008 |
| observability | PASS (1 P2 advisory) | 009 |
| test-adequacy | PASS | 010 |
| synthesis-readiness | PARTIAL (011, no JSONL delta) | 011 |

## Convergence Telemetry

| Iteration | newFindingsRatio |
|-----------|------------------|
| 001 | 1.0 |
| 002 | 0.5 |
| 003 | 0.333 |
| 004 | 0.25 |
| 005 | 0.2 |
| 006 | 0.167 |
| 007 | 0.143 |
| 008 | 0.0 |
| 009 | 0.028 |
| 010 | 0.0 |

Telemetry dropped below the 0.01 threshold from iteration 009 onward; all dimensions covered at iteration 010.
