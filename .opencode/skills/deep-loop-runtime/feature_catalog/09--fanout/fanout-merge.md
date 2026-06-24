---
title: "Fan-out cross-lineage merge"
description: "Cross-lineage merge: research (dedup by findingId + cross-model attribution) or review (strongest-restriction: any active P0 → merged FAIL). Writes consolidated registry and fanout-attribution.md."
trigger_phrases:
  - "fan-out cross-lineage merge"
  - "fanout-merge.cjs"
  - "merge fanout lineages"
  - "strongest-restriction review merge"
  - "cross-model finding attribution"
version: 1.4.0.3
---

# Fan-out cross-lineage merge

<!-- sk-doc-template: skill_asset_feature_catalog -->

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
> P2=1), counts active P0/P1/P2, derives `mergedVerdict` (FAIL if `activeP0 > 0`,
CONDITIONAL if `activeP1 > 0`, PASS otherwise). Non-active findings (resolved,
`resolved_false_positive`) are excluded from counts.

Both modes write `{artifact_dir}/fanout-attribution.md`: a per-lineage Markdown table with
label, kind, model, iterations, convergence score, salvaged event count, and verdict.

### Why This Matters

The merge step is what makes fan-out useful — without it, N lineages produce N separate
reports with no cross-lineage synthesis. The strongest-restriction policy ensures a P0
finding in ANY lineage surfaces to the final review verdict.

---

## 2. HOW IT WORKS

Fully shipped. Dual-mode script: exports `mergeResearchRegistries`,
`mergeReviewRegistries`, `buildAttributionMd` for unit testing; `main()` executes when
`require.main === module`. CLI: `--loop-type research|review --artifact-dir <path>`. Exit
codes: 0=ok, 3=input validation error.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-merge.cjs` | `mergeResearchRegistries`, `mergeReviewRegistries`, `buildAttributionMd`, `main()` (guarded behind `require.main === module`); near-dup dedup via `nearDuplicateContentKey`, `titleOverlap` and the title-aware `getFindingBucket` behind `SPECKIT_FANOUT_NEAR_DUP_DEDUP` |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-merge.vitest.ts` | 10 tests: research dedup/attribution (3: dedup by id + cross-lineage tracking, iteration count aggregation, null registry handled); review strongest-restriction (5: clean+P0→FAIL, all clean→PASS, P1-only→CONDITIONAL, duplicate escalates severity, non-active excluded); script e2e (2: no lineages dir → ok, 2-lineage review fixture → merged FAIL + attribution.md) |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Feature ID: F027
- Catalog source: `feature_catalog/09--fanout/fanout-merge.md`
- Primary source files: `scripts/fanout-merge.cjs`
Related references:
- [fanout-salvage.md](fanout-salvage.md) — Fan-out write-failure salvage
