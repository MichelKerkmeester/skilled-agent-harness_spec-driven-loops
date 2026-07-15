# Deep Review Dashboard

## Status

| Field | Value |
|---|---|
| Session | `fanout-codex-1-1780592070775-ubdboy` |
| State | complete |
| Final Verdict | FAIL |
| Release Readiness | release-blocking |
| hasAdvisories | true |
| Last Iteration | 5 |
| Stabilization Passes | 1 |

## Findings Summary

| Severity | Active |
|---|---:|
| P0 | 1 |
| P1 | 4 |
| P2 | 1 |

## Progress Table

| Iteration | Focus | New Findings Ratio | Findings | Status |
|---:|---|---:|---:|---|
| 0 | init | 0 | 0 | initialized |
| 1 | correctness | 1.000 | 2 | CONDITIONAL |
| 2 | security | 0.333 | 1 | FAIL |
| 3 | security follow-up and traceability | 0.400 | 2 | FAIL |
| 4 | maintainability | 0.167 | 1 | CONDITIONAL |
| 5 | stabilization | 0.000 | 0 | PASS |

## Coverage

| Dimension | Covered |
|---|---|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Active Risks

- F003 is a release blocker: community fallback can inject out-of-scope memory rows after scoped pipeline retrieval.
- F004 leaves `memory_search` on a weaker session trust boundary than `memory_context` and `memory_match_triggers`.
- F001 means no-session `memory_context` callers share process-scoped retrieval state.
- F002 and F006 can damage causal lineage integrity through orphan or ambiguous edges.
- F005 means the advertised MCP schema is stale relative to live causal stats behavior.

## Convergence

The loop converged after five iterations. The final pass rechecked all active findings and found no new P0/P1 issues.
