# Iteration 8: External Mining — aionforge concurrent-merge.md → Deep Loop fan-out merge

## Focus
Round B mining (tightened after a 600s timeout on the broader scope): concurrent-merge.md → NET-NEW Deep Loop candidates for the parallel-lineage finding merge (`fanout-merge.cjs`). Read-only.

## Findings — NET-NEW candidates (3; newInfoRatio 0.60)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| order-independent-merge-tiebreak (on id collision pick winner by event-time→canonical-value, not arrival; today keeps the FIRST-arriving body, appends only lineage label) | fanout-merge.cjs:125-132,221 | H/M | FIX | CONFIRMED |
| cross-lineage-contradiction-record (conflicting same-id findings: keep BOTH + CONTRADICTS/`_conflicts` marker, victim by trust then canonical order; today the loser's body is silently discarded) | fanout-merge.cjs:117-196 (GAP) | M/M | BUILD | CONFIRMED-gap |
| arrival-order-property-test (shuffle-replay disagreeing arrival orders → identical merged set AND node-count == distinct-assertions; nothing silently dropped) | fanout-merge.cjs:331-340,400 (no test) | H/M | BUILD | CONFIRMED |

**Already covered:** strongest-restriction severity rollup (max-severity, order-independent for severity rank) at `fanout-merge.cjs:218-228`; provenance-kept-out-of-merge via `_lineages` attribution (mirrors external "agent identity kept out of merge, still queryable").

## Cross-link (for synthesis)
This is the **determinism spine reaching Deep Loop's fan-out merge** — the SAME arrival-order non-determinism that the B3 CRDT candidates fix for code-graph reindex and that det-context-order-global fixes for code-graph walks. `fanout-merge`'s first-write-wins is the deep-loop instance of the same root pattern. Strengthens the cross-cutting determinism spine as the unifying theme.

## Next Focus
order-independent-merge-tiebreak (FIX, H) is the lead. Open: do deep-loop findings carry a stable derivable ordering key (iteration index / convergence score / event time) usable as the tiebreak, or must one be synthesized at merge time? → Round C/D verification.
