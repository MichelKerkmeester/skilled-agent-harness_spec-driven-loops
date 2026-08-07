# Deep Review Dashboard

## Status
| Field | Value |
|---|---|
| Session | `fanout-codex-4-1780592070776-ladjto` |
| Iteration | 5 of 7 |
| Provisional Verdict | CONDITIONAL |
| `hasAdvisories` | true |
| Stop Reason | converged |
| Release Readiness | converged with required P1 fixes |

## Findings Summary
| Severity | Active | Resolved |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 1 | 0 |

## Dimension Coverage
| Dimension | Covered |
|---|---|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Progress
| Iteration | Focus | New Findings Ratio | New Findings | Status |
|---:|---|---:|---:|---|
| 1 | correctness | 1.0000 | 1 | insight |
| 2 | security | 0.6667 | 2 | insight |
| 3 | traceability | 0.0000 | 0 | thought |
| 4 | maintainability | 0.0625 | 1 | insight |
| 5 | stabilization | 0.0000 | 0 | thought |

## Next Focus
Synthesis complete. Remediate security P1s first: F002 scoped cursor propagation and F003 causal mutation scoping.

## Active Risks
- F002 allows chained continuation cursors to lose scope enforcement.
- F003 allows causal graph mutation tools to operate on raw IDs without governed scope checks.
- F001 can corrupt causal graph edges through ambiguous partial references.
- F004 keeps perishable labels in comments and should be cleaned during remediation.
