# Deep Review Dashboard

## Status

- Provisional verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- hasAdvisories: false
- Release readiness: in-progress

## Findings Summary

| Severity | Active | New In Iteration 001 |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 2 | 2 |
| P2 | 0 | 0 |

## Progress Table

| Iteration | Focus | Dimensions | New Findings Ratio | Status |
| ---: | --- | --- | ---: | --- |
| 001 | correctness/security/IPC lifecycle | correctness, security, traceability | 1.00 | complete |

## Coverage

- Dimensions covered: 3 / 4
- Required protocols: `spec_code` partial, `checklist_evidence` N/A
- Files reviewed: 12
- Resource-map coverage: skipped because scope has no resource-map.md

## Trend

- Last ratios: 1.00
- Trend: insufficient history, max iteration cap reached

## Active Risks

- F001: server and CLI disagree on `tcp://` IPC endpoint handling.
- F002: proxy replay classifier treats `memory_save` as replayable despite documented non-idempotent secondary index behavior.

## BLOCKED STOPS

- No blocked_stop events emitted; terminal stop was maxIterationsReached.

## GRAPH CONVERGENCE

- Graph convergence not used in this one-iteration direct-code audit.
