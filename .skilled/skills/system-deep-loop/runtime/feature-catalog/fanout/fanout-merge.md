---
title: "Fan-out cross-lineage merge"
description: "Cross-lineage merge: research (dedup by findingId + cross-model attribution) or review (strongest-restriction: any active P0 or failed required gate → merged FAIL, plus the six coverage surfaces). Merges lineage frontiers under a partition guard. Writes consolidated registry and fanout-attribution.md."
trigger_phrases:
  - "fan-out cross-lineage merge"
  - "fanout-merge.cjs"
  - "merge fanout lineages"
  - "strongest-restriction review merge"
  - "cross-model finding attribution"
version: 1.4.8.0
---

# Fan-out cross-lineage merge

---

## 1. OVERVIEW

`fanout-merge.cjs` reads every `{artifact_dir}/lineages/{label}/` sub-packet registry and
state log to produce a consolidated registry at the base artifact dir.

**Research merge**: deduplicates `keyFindings` by `id` field (first entry wins; subsequent
lineages are added to a `_lineages` attribution array), aggregates total
`iterationsCompleted`, averages `convergenceScore`, deduplicates `openQuestions` and
`ruledOutDirections`.

**Near-duplicate dedup (opt-in, title-aware)**: the default-off
`SPECKIT_FANOUT_NEAR_DUP_DEDUP` flag collapses findings that different workers restate under
different ids when their bodies match, keeping the strongest severity. The collapse is gated
by `titleOverlap`, a Jaccard overlap of stopword-stripped title tokens, at
`TITLE_DISTINCT_OVERLAP_THRESHOLD = 0.15`: two same-body findings collapse only when their
title token sets overlap at or above that threshold, so disjoint titles that name different
specific subjects stay separate while a paraphrased restatement that shares its subject noun
still collapses. The bucketer `getFindingBucket` is title-aware to match. With the flag off
the merge never calls the title-aware match or bucketer, so the off path is byte-identical.

**Review merge (strongest-restriction)**: iterates active findings across all lineages,
escalates to highest severity for duplicate `findingId` using `SEVERITY_RANK` (P0=3 > P1=2
> P2=1), counts active P0/P1/P2, derives `mergedVerdict` (FAIL if `activeP0 > 0` or any lineage still has a failed
required gate in `failedRequiredGateIds`, CONDITIONAL if `activeP1 > 0` or open search debt remains,
PASS otherwise). The merge also unions `searchDebt` across lineages, one entry per bug class. Non-active
findings (resolved,
`resolved_false_positive`) are excluded from counts.

**Lineage trust**: a lineage is untrusted when the runner's `orchestration-summary.json` rejected
it, or when its log flags a pass `unexamined: true`. A lineage with no summary entry is not
rejected, and a pass that cannot be judged is not flagged. Both merges keep an untrusted
lineage's findings in the list and in the severity counts, so its P1 still moves the verdict, and
label a merged finding `_untrusted` with the reasons only when every lineage that reported it is
untrusted. An untrusted lineage claims no coverage: the review merge builds `dimensionCoverage`,
`searchCoverage` and `candidateCoverage` from trusted lineages only, and in the research merge only
a trusted lineage's answer resolves a question. The merged registry lists them as
`untrustedLineages` and stdout as `untrusted_lineages`, both omitted when every lineage is trusted.

**Review coverage surfaces**: the review merge also spreads the result of
`mergeReviewCoverageSurfaces` into the merged registry: `dimensionCoverage`, `traceability`,
`searchCoverage`, `candidateCoverage`, `divergenceByLineage` and `ruledOutCandidates`. Each
surface walks lineages in label order and sorts its output. See
[fanout-review-coverage-merge.md](fanout-review-coverage-merge.md) for the per-surface rules.

**Frontier merge (expansive depth)**: both merges add a merged `frontier` when any lineage
registry carries `frontier.nodes`, or when the recorded `frontier_partition` dealt at least one
node. `mergeResearchFrontier` builds it for both loop types, and `mergeReviewRegistries` calls
the same function rather than a review-specific one. Lineages
number the nodes they admit from their own store, so two lineages can both name a node
`F-2-002`. `qualifyFrontierId` prefixes each node id and its `parentId` with the lineage label
(`{label}:{nodeId}`), leaving `root` and empty ids as they are. Each merged node keeps its
original id as `lineageNodeId` and its label as `lineage`. The merged `frontier.stats` counts
the total and each node status.

**Partition guard**: `main()` reads `frontier_partition` from `orchestration-summary.json` and
passes it to the merge as `frontierPartition`. The guard runs inside the frontier merge, and a
recorded partition with at least one dealt node builds that merge even when no lineage reports a
frontier, so the guard cannot go silent on a lost node. When the partition names any node,
`frontier.partitionGuard` records `passed` and `missing`: every dealt node id that no lineage
reports as a `lineageNodeId`. When the guard fails, the script writes a
`{"warning":"frontier_partition_guard_failed","missing":[...]}` JSON line to stderr. The stdout
summary carries `frontier_partition_guard` for both loop types, and the exit code stays 0.

Both modes write `{artifact_dir}/fanout-attribution.md`: a per-lineage Markdown table with
label, kind, model, iterations, convergence score, salvaged event count, and verdict, followed
by a provider cost table (USD per lineage, `unknown` for a missing log or one with no cost
record, so a native lineage reads `unknown`) and a run total that reads `unknown` while any
lineage is unknown.

### Why This Matters

The merge step is what makes fan-out useful — without it, N lineages produce N separate
reports with no cross-lineage synthesis. The strongest-restriction policy ensures a P0
finding, or a required gate still failing, in ANY lineage surfaces to the final review verdict.

---

## 2. HOW IT WORKS

Fully shipped. Dual-mode script: exports `mergeResearchRegistries`, `mergeResearchFrontier`,
`mergeReviewRegistries`, `buildAttributionMd` for unit testing; `main()` executes when
`require.main === module`. CLI: `--loop-type research|review --artifact-dir <path>
[--enable-near-duplicate-dedup [1|true|yes|on]]`. The dedup flag turns on the same near-duplicate
collapse as `SPECKIT_FANOUT_NEAR_DUP_DEDUP` and wins over it when given; a bare flag is on, and
any other value is off. Any other flag is refused. Exit codes: 0=ok, 3=input validation error
(an unknown flag, a missing or invalid `--loop-type` or `--artifact-dir`, a linked lineage
directory), 1=any other error.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-merge.cjs` | `mergeResearchRegistries`, `mergeReviewRegistries`, `buildAttributionMd`, `main()` (guarded behind `require.main === module`); near-dup dedup via `nearDuplicateContentKey`, `titleOverlap` and the title-aware `getFindingBucket` behind `SPECKIT_FANOUT_NEAR_DUP_DEDUP`; review coverage surfaces via `mergeReviewCoverageSurfaces`; frontier merge and partition guard via `qualifyFrontierId` and `mergeResearchFrontier` |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-merge.vitest.ts` | Research dedup/attribution (dedup by id + cross-lineage tracking, iteration count aggregation, null registry handled), review strongest-restriction (clean+P0→FAIL, all clean→PASS, P1-only→CONDITIONAL, duplicate escalates severity, non-active excluded) and script e2e (no lineages dir → ok, 2-lineage review fixture → merged FAIL + attribution.md) |
| `tests/unit/fanout-merge.vitest.ts` | Expansive and coverage groups: `research frontier merge`, `review frontier merge` and the `mergeReviewRegistries` coverage surfaces |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Catalog source: `feature-catalog/fanout/fanout-merge.md`
- Primary source files: `scripts/fanout-merge.cjs`
Related references:
- [fanout-salvage.md](../../feature-catalog/fanout/fanout-salvage.md) — Fan-out write-failure salvage
