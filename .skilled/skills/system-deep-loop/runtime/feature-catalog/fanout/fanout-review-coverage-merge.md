---
title: "Fan-out review coverage merge"
description: "A merged review fan-out keeps the six review coverage surfaces from its lineages instead of dropping them."
trigger_phrases:
  - "fan-out review coverage merge"
  - "mergeReviewRegistries coverage"
  - "review fan-out merged coverage"
  - "candidate dimension search coverage merge"
version: 1.0.2.0
---

# Fan-out review coverage merge

## 1. OVERVIEW

A review fan-out runs its lineages in parallel and merges their registries into one. The merge carries six coverage surfaces forward from the lineages: dimension coverage, traceability, search coverage, candidate coverage, divergence by lineage and ruled-out candidates.

---

## 2. HOW IT WORKS

### Merged Surfaces

`runtime/scripts/fanout-merge.cjs` `mergeReviewCoverageSurfaces` returns six surfaces, and `mergeReviewRegistries` spreads them into the returned registry:

- `dimensionCoverage`: a dimension counts as covered when any lineage covered it.
- `traceability`: the strictest status wins per protocol, an undecided status (`pending`, `deferred`, `skipped`) never replaces a decided one, and the summary is recounted from the merged results. `unfinishedCoreProtocols` is the union across lineages.
- `searchCoverage`: the required bug classes and the `covered`, `ruledOut`, `deferred` and `blocked` buckets are unioned. `graphCoverageMode` is kept only when every lineage shares it, else it is null.
- `candidateCoverage`: the buckets are unioned. A bug class two lineages share has each flag ORed, its iterations unioned, and a `lineages` list that names its sources.
- `divergenceByLineage`: each lineage's `divergence` object is kept whole under its label, because pivot state belongs to one lineage.
- `ruledOutCandidates`: one entry per lineage and candidate id, tagged with its `lineage`.

### Merge Behavior

The surfaces are combined across lineages rather than read from one lineage alone, so the merged registry reflects coverage from every lineage in the fan-out. Every merge walks lineages in label order and sorts its output, so arrival order never changes the merged registry.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Script | Merges the six review coverage surfaces in `mergeReviewCoverageSurfaces` and returns them from `mergeReviewRegistries`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Vitest | Per-surface merge cases. |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts` | Vitest | End-to-end merged-coverage case for a review fan-out. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | Manual playbook | DRV-071: a merged two-lineage review keeps its coverage surfaces. |

---

## 4. SOURCE METADATA

- Group: Fan-out
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `fanout/fanout-review-coverage-merge.md`

Related references:
- [fanout-merge.md](fanout-merge.md) - Fan-out merge
- [fanout-run.md](fanout-run.md) - Fan-out run
