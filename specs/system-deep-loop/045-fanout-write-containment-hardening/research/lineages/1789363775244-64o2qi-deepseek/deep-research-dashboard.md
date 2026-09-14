# Deep Research Dashboard — fanout-deepseek-1789363775244-64o2qi

## Iteration Table

| Iteration | Status | Focus | newInfoRatio | Findings |
|-----------|--------|-------|--------------|----------|
| 1 | complete | git-native alternatives vs repo anatomy | 1.00 | 7 |
| 2 | complete | non-git mechanisms vs the attribution invariant | 0.90 | 6 |
| 3 | complete | frontier comparison, relocation matrix, adoption path, web verification | 0.85 | 6 |

## Question Status

- q1 resolved: sparse cone worktree (git worktree add --no-checkout + git sparse-checkout set)
- q2 resolved: .opencode/ + target spec family + dispatch-named spec paths + seed paths
- q3 resolved: no — exact attribution requires a per-lane index + tree of the same repo
- q4 resolved: sparse inherits the baseline handling of all four classes; clones/CoW/sandbox/redirection violate at least one each
- q5 resolved: only the sparse worktree survives git worktree move; runner gains cone-aware create + per-run cone + min git >= 2.37

## Convergence Trend

Stop policy max-iterations (convergence off). Average newInfoRatio 0.92 across 3 iterations.

## Dead Ends

- shallow clone: history ≠ tree; new repo boundary breaks sweep
- reference/shared clone: documented corruption hazard; object sharing already free
- partial clone: needs real transport; promisor fetches break the detector
- CoW/overlay: attribution loss + platform lock + no reclaim
- write redirection: scored 3/10 in ADR-003; watch report-only
- sandbox + object store: detector-blind; collapses into clone or worktree
- per-lane index + checkout-index: wrong-tree detection; no registration

## Blocked Stops

(none)

## Graph Convergence

(n/a)

## Next Focus

Synthesis complete. Recommended follow-up: stub-executor measurement of a sparse-cone run
against the packet's 16.5/149.7 s protocol.
