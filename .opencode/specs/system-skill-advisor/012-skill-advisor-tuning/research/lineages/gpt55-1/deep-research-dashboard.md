# Deep Research Dashboard

## Lifecycle

| Field | Value |
|---|---|
| Session | `fanout-gpt55-1-1783437123377-4illnj` |
| Lineage | `gpt55-1` |
| Status | complete |
| Stop reason | maxIterationsReached |
| Iterations | 10/10 |
| Write boundary | `research/lineages/gpt55-1` |

## Iteration Table

| run | focus | newInfoRatio | findings count | status |
|---:|---|---:|---:|---|
| 1 | Layer-1b half-landed vocabulary | 1.00 | 5 | complete |
| 2 | Vocabulary authority split | 0.86 | 5 | complete |
| 3 | Cross-hub collision guard | 0.78 | 5 | complete |
| 4 | Full projection-surface guard | 0.74 | 6 | complete |
| 5 | Cross-hub ambiguity fixture | 0.68 | 6 | complete |
| 6 | Reindex/rebaseline runbook | 0.58 | 5 | complete |
| 7 | conflicts_with authoring criteria | 0.48 | 5 | complete |
| 8 | Command bridge hardcoding | 0.42 | 4 | complete |
| 9 | Taxonomy crosswalk | 0.34 | 4 | complete |
| 10 | semantic_shadow hygiene | 0.26 | 5 | complete |

## Question Status

10/10 agenda angles covered. 4 resolved questions are canonicalized in `deep-research-findings-registry.json`; 2 follow-up decisions remain open for implementation planning.

## Convergence Trend

Trend: `[1.00 -> 0.86 -> 0.78 -> 0.74 -> 0.68 -> 0.58 -> 0.48 -> 0.42 -> 0.34 -> 0.26]` descending.

Convergence before iteration 10 was telemetry only per operator instruction; the loop stopped on max iterations.

## Dead Ends

| Approach | Reason Eliminated | Iteration |
|---|---|---|
| Remove `codeAuditDeepReviewPenalty` first | Metadata still projects the contested phrase. | 1 |
| Move all vocabulary to graph metadata | Exact command/colon syntax needs code-level anchors. | 2 |
| Raw string collision only | Existing normalization is already better and should be reused. | 3 |
| Alias-guard all key files/source docs | Would over-match file/doc names as user aliases. | 4 |
| Tune lane weights before labels | No fixture-backed way to know whether changes help. | 5 |
| Live SQLite mutation experiments | Existing packets use read-only copies or fixture projections. | 6 |
| Broad `conflicts_with` seeding | Overlap is not mutual exclusion. | 7 |
| Command bridge from markdown body prose | Too much overmatch risk. | 8 |
| Eval buckets as sole taxonomy | Measurement slices cannot replace runtime intent classes. | 9 |
| Immediate semantic_shadow weight change | 008 froze the lane after net-negative evidence. | 10 |

## Next Focus

Implement a parent-hub compatibility hardening packet in this order: metadata cleanup, cross-hub guard, projection-surface guard, parent-hub ambiguity fixture, atomic reindex/rebaseline.

## Active Risks

- Labels for proposed ambiguity fixture need explicit approval before freezing.
- Removing scorer compensations before metadata cleanup can regress code-audit routing.
- Any metadata movement can legitimately move ratchet counts; improvements must be recaptured, not silently accepted.
