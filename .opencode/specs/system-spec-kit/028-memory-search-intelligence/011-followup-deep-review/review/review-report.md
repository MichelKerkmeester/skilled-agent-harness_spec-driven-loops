---
title: "Review Report: Graduation Follow-Ups, Opus Deep Review"
verdict: "FAIL"
severityCounts: { "P0": 3, "P1": 8, "P2": 4 }
model: "claude-opus-4-8"
method: "ten iterative opus passes, loop-until-dry, rotating review lenses"
target: "028/010-graduation-follow-ups (commit 420c4734f3)"
---
# Review Report: Graduation Follow-Ups, Opus Deep Review

## Verdict: FAIL

Three P0 blockers, all in the code-graph bitemporal wiring, which corrupts live reads and is defeated on the real reindex path. The cli test pass was green because the existing tests did not cover these failure modes, the opus deep read found them. Eight P1 and four P2 round out the set.

## P0 — bitemporal wiring is broken (FAIL blockers)

1. **Live readers return superseded edges unfiltered.** `queryEdgesFrom`/`queryEdgesTo` (code-graph-db.ts:1856-1894) have no `invalid_at IS NULL` filter. Every production read surface (code-graph-context.ts:654,686,733,772 and query.ts at 289,293,624,631,811,837,1703,1729) returns both the closed and the open edge after a flag-on reindex. Fix: add `AND invalid_at IS NULL` to the live readers when `codeGraphEdgeBitemporalReadsEnabled()`, and a flag-on regression that asserts only the live edge survives.

2. **`pruneDanglingEdges` hard-deletes regardless of flag.** The production scan defers the prune (scan.ts:618) then calls `pruneDanglingEdges` (scan.ts:736), which issues an unconditional DELETE (code-graph-db.ts:1609-1621). The flag-aware inline close at 1574-1587 is dead for full-scan reindex. Fix: make `pruneDanglingEdges` close (UPDATE invalid_at) when the flag is on.

3. **`replaceNodes` hard-deletes edges before the close path.** `replaceNodes` (code-graph-db.ts:1473-1490) DELETEs edges with no bitemporal awareness, and ensure-ready.ts:600-602 runs it before `replaceEdges`, so there is nothing left to close on every real reindex. Empirically: `asOfEdgesFrom('caller', gen1)` returns `[]`. Fix: make `replaceNodes` close instead of delete under the flag.

## P1 — conditional blockers

4. **As-of stamps off by one generation.** The generation bumps at scan end (scan.ts:683) after all writes, so valid_at/invalid_at carry the prior generation. Fix: bump before the persistence loop, or insert at current+1.
5. **Zero-width edge lifetimes.** The inline close stamps invalid_at at the same generation as the insert valid_at, so the row is unreadable at every as-of. Fix: close strictly after the insert generation.
6. **Append-exempt evicts the top primary result.** `selectBudgetTrimIndex` drops every non-exempt row before any exempt backfill, so the hardest squeeze can return only backfill rows and evict the top-scored requested result. Fix: reserve at least one primary row, trim exempt backfill before the last non-exempt.
7. **Lag-ceiling fires on normal backpressure.** lagCeilingMs=1500 fires whenever width > concurrency, signalling queue depth, not a stalled tail. Fix: measure time-since-eligible or time-since-last-completion, or document it as a backpressure gauge.
8. **Degree cap silently disables repair on hot hubs.** Above the cap a renamed high-fan-in dependency leaves all importer edges durably stale. Fix: record the correctness cost, or change the cap semantics to a degree-aware partial repair.
9. **Advisor penalty defends only the exact id, not the alias.** fusion.ts:611 uses `=== 'system-skill-advisor'`, so the `skill-advisor` alias self-recommends in the guard-off default. Fix: use the canonical self-rec id set (isAdvisorSelfRecommendationSkill).
10. **`asOfEdgesFrom` is orphaned.** No production path calls the temporal reader the wiring exists to feed. Fix: wire an as-of parameter onto code_graph_query/context, or de-scope the graduation claim.
11. **The integration test never drives the real reindex.** It hand-bumps the generation mid-reindex, a sequence production never produces. Fix: drive persistIndexedFileResult/code_graph_scan twice with the flag on under the real bump ordering.

## P2 — advisory

12. **Density both-classes gate passes lopsided ledgers** (199:1 graduates). Add a per-class floor or ratio bound.
13. **Degree-cap 10 not benchmark-distinguished** from any value in (2,30). Soften the spec claim or run a degree sweep.
14. **Budget-trim spares appends before constitutional pinned rows.** Treat always-surface rows as at least as exempt as appendExempt.
15. **Dedup-scale metric blind to title-only-distinct findings** (the free-text risk 009 flagged). Add a same-body different-title fixture class.

## Per-cluster readiness

- **bitemporal-wiring:** FAIL, needs the three P0 fixes plus the off-by-one and the real-reindex test before it can graduate.
- **degree-cap, append-exempt, advisor-penalty, gauges:** each one concrete fix from CONDITIONAL to PASS.
- **density-probe, dedup-scale:** advisory only, doc and test reconciliations.


## Re-Review Outcome: PASS

A second opus re-review (loop-until-dry) verified the fixes against the committed code (b8a7a07b17 + b542901459). New verdict: PASS, zero P0 and zero P1 remaining. All three prior bitemporal P0s are explicitly resolved, every cluster passes (bitemporal, search-budget, density, advisor-alias, deep-loop-gauges, dedup), and the live-read path is confirmed correct because queryEdgesFrom/queryEdgesTo filter on invalid_at IS NULL independent of the generation bump.

Two residual P2s remain, both as-of-only window-integrity issues in the as-of surface that P1-10 deliberately de-scoped. They are invisible to live reads and only surface through as-of reads under the bitemporal flag, so they are tracked for when the public as-of reader graduates rather than fixed now:

- The ensure-ready auto-index path stamps bitemporal windows but never bumps the generation, so an edge inserted by one ensure-ready reindex and closed by the next gets a zero-width window. ensure-ready.ts:555,704,737. Live reads are unaffected.
- recordSupersedesLineage inserts SUPERSEDES edges with a NULL valid_at under the flag, so lineage edges have no as-of-readable window. code-graph-db.ts:601-604. Pre-existing, not introduced by the fixes.
