---
title: Deep Research Dashboard
description: Auto-generated view of the detached git advisory research lineage.
---

# Deep Research Dashboard

## Status
- Topic: Git PreToolUse advisory candidates, pre-execution state, and noise threshold
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-sol-1785178337201-eaydo6
- Stop reason: maxIterationsReached
- Stop policy: max-iterations

## Progress
| # | Focus | Ratio | Findings | Status |
|---:|---|---:|---:|---|
| 1 | Operation and pre-state inventory | 0.92 | 12 | complete |
| 2 | Destructive history and recovery | 0.60 | 10 | complete |
| 3 | Staging and commit semantics | 0.72 | 9 | complete |
| 4 | Worktree, remote, and account coordination | 0.75 | 10 | complete |
| 5 | Final noise and candidate calibration | 0.80 | 5 | complete |

- Questions answered: 5/5
- Retained candidates: 23
- Rejected candidate classes: 14
- Remaining research questions: 0

## Trend
- newInfoRatio: `0.92 -> 0.60 -> 0.72 -> 0.75 -> 0.80`
- Convergence was telemetry only before the forced fifth iteration.
- Exact option-sensitive fire rates remain unmeasured.

## Noise Budget
- Target per rule: `<0.5` advisories per 100 eligible invocations
- Hard ceiling per rule: `1/100`
- Aggregate target: `<2/100`
- Aggregate hard ceiling: `3/100`
- Minimum sample: 500 eligible invocations or 30 days
- Presentation: one line, at most 180 characters, at most two facts plus `+N`

## Active Risks
- Stateful probes are not supported by the current command-only evaluator.
- The tracked pre-push hook was not installed in the configured hook path during measurement.
- Network/account/remote state remains raceable and cannot predict outcomes.
- The full 23-rule set may need implementation-driven reduction before promotion.

## Dead Ends
- Git log/reflog cannot recover exact argv, failed commands, or predicate matches.
- Git state cannot identify session ownership of paths.
- Network reads do not eliminate receive-time races.
- Full object scans and all-worktree sweeps exceed hot-path latency limits.

## Next Focus
Shadow-mode specification and implementation planning.
