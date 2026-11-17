---
title: "Fan-out review coverage merge"
description: "A merged review fan-out keeps the candidate, dimension and search coverage surfaces from its lineages instead of dropping them."
trigger_phrases:
  - "fan-out review coverage merge"
  - "mergeReviewRegistries coverage"
  - "review fan-out merged coverage"
  - "candidate dimension search coverage merge"
version: 1.0.0.0
---

# Fan-out review coverage merge

## 1. OVERVIEW

A review fan-out runs its lineages in parallel and merges their registries into one. The merge carries three coverage surfaces forward from the lineages: candidate coverage, dimension coverage and search coverage.

## 2. HOW IT WORKS

### Merged Surfaces

`runtime/scripts/fanout-merge.cjs` `mergeReviewRegistries` merges each lineage's candidate coverage, dimension coverage and search coverage, and adds the merged surfaces to the returned registry.

### Merge Behavior

The surfaces are combined across lineages rather than read from one lineage alone, so the merged registry reflects coverage from every lineage in the fan-out.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Script | Merges the review coverage surfaces in `mergeReviewRegistries` and returns them. |

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
