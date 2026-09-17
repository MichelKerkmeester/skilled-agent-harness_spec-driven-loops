# Agent Improvement Dashboard

## Global Summary

| Field | Value |
| --- | --- |
| Total records | 3 |
| Target profiles | 1 |
| Prompt runs | 3 |
| Benchmark runs | 0 |
| Accepted candidates | 0 |
| Rejected candidates | 0 |
| Ties | 1 |
| Keep-baseline results | 1 |
| Benchmark passes | 0 |
| Benchmark fails | 0 |
| Infra failures | 0 |
| Lane (mode) mix | agent-improvement 3 / model-benchmark 0 |

## Sample Quality

| Field | Value |
| --- | --- |
| replayCount | 1 |
| stabilityCoefficient | n/a |
| insufficientSampleIterations | 2 |
| insufficientDataIterations | 2 |

Some iterations had insufficient data for trade-off / stability analysis. Review the specific iterations before trusting verdicts.


## Journal Summary

| Field | Value |
| --- | --- |
| Last session start | 2026-04-11T12:00:00Z |
| Last session end | 2026-04-11T12:01:30Z |
| Total events | 8 |
| Stop reason | converged |
| Session outcome | keptBaseline |
| Latest legal-stop evaluation | n/a |
| Latest blocked stop | n/a |

### Event Types

- candidate_generated: 2
- candidate_scored: 2
- gate_evaluation: 2
- session_end: 1
- session_start: 1




## Candidate Lineage

| Field | Value |
| --- | --- |
| Lineage depth | 2 |
| Total candidates | 3 |
| Current leaf | candidate-2 |

## Mutation Coverage

| Field | Value |
| --- | --- |
| Coverage ratio | 0.33 |
| Uncovered mutations | 4 |

## Mirror Sync Recovery

- Not available.


## Guardrails

- All targets evaluated via dynamic mode; promotion requires explicit per-target approval
- Mirror sync stays downstream packaging and is not counted as benchmark truth

## Stop Status

- Should stop: no
- Drift ambiguity: no
- Reasons: none

## dynamic

- Family: dynamic
- Prompt runs: 3
- Benchmark runs: 0
- Accepted candidates: 0
- Rejected candidates: 0
- Benchmark passes: 0
- Benchmark fails: 0
- Infra failures: 0
- Best prompt score: 7.2
- Best benchmark score: n/a
- Lane (mode) mix: agent-improvement 3 / model-benchmark 0
- Latest recommendation: keep-baseline

### Repeated Failure Modes

- none



## Recommendation

Continue only when the next run has a clearer signal than the current best-known state.
