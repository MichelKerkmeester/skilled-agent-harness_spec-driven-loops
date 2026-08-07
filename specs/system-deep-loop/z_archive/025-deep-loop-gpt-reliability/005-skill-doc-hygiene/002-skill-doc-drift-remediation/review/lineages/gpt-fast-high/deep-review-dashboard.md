# Deep Review Dashboard

| Field | Value |
|---|---|
| Session | `fanout-gpt-fast-high-1782925103545-7vw78n` |
| Lineage | `gpt-fast-high` |
| Executor | `cli-opencode openai/gpt-5.5-fast` |
| Stop Reason | `max-iterations` |
| Iterations | 5/5 |
| Verdict | CONDITIONAL |
| Release Readiness | in-progress |

## Severity Totals

| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 2 |
| P2 | 1 |

## Dimension Coverage

| Dimension | Covered | Iteration |
|---|---|---:|
| correctness | yes | 1 |
| security | yes | 2 |
| traceability | yes | 3 |
| maintainability | yes | 4 |
| stabilization | yes | 5 |

## New Findings Ratio

| Iteration | Ratio | Verdict |
|---:|---:|---|
| 1 | 0.50 | CONDITIONAL |
| 2 | 0.00 | PASS |
| 3 | 0.33 | CONDITIONAL |
| 4 | 0.08 | PASS |
| 5 | 0.00 | PASS |

## Active Findings

| ID | Severity | Category | Summary |
|---|---|---|---|
| F001 | P1 | cli-opencode-agent-routing-drift | Living cli-opencode references/playbooks still publish stale direct `--agent` patterns. |
| F002 | P1 | packet-completion-state-drift | Packet status surfaces disagree between in-progress and complete. |
| F003 | P2 | metadata-key-file-coverage | graph-metadata key_files omits additional files claimed in implementation-summary. |

## Legal Stop Gates

| Gate | Result |
|---|---|
| convergenceGate | pass-for-max-iterations |
| dimensionCoverageGate | pass |
| p0ResolutionGate | pass |
| evidenceDensityGate | pass |
| hotspotSaturationGate | pass |
| claimAdjudicationGate | pass-with-active-p1 |
| fixCompletenessReplayGate | partial |
| candidateCoverageGate | pass |
| graphlessFallbackGate | pass |
