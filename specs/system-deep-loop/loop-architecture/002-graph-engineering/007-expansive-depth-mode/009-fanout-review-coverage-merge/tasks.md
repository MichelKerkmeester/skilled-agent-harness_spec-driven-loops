---
title: "Tasks: Carry the review coverage surfaces through the fan-out merge (D12)"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fanout review coverage merge tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Carry the review coverage surfaces through the fan-out merge (D12)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-deep-loop/runtime`. Run every `npm test` from `R`. `M` is `R/scripts/fanout-merge.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the baseline of the REQ-004 suites (`R/tests/`). Verify: `npm test -- tests/unit/fanout-merge.vitest.ts tests/unit/fanout-merge-latest-record.vitest.ts tests/unit/fanout-merge-structured-missing.vitest.ts tests/unit/fanout-merge-reducer-provenance.vitest.ts tests/fanout-review-focus.vitest.ts` exits 0 and the pass count is written in `goal.md` section 4.
- [ ] T002 List every reader of the merged review registry (`R/scripts/`). Verify: `rg -n "mergedRegistry" R/scripts` output is recorded in `goal.md` section 4 with each reader marked safe or needing a change.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Merge `dimensionCoverage` as a sorted-key union (`M`). Verify: the REQ-002 case in `tests/unit/fanout-merge.vitest.ts` passes.
- [ ] T004 Merge `traceability` results per protocol by strongest restriction, recompute `summary` and union `unfinishedCoreProtocols` (`M`). Verify: the REQ-003 case passes.
- [ ] T005 Merge `searchCoverage` bucket lists as sorted unions, keeping `graphCoverageMode` only when all lineages agree (`M`). Verify: a case with two lineages and different modes yields `null` and passes.
- [ ] T006 Merge `candidateCoverage` buckets and `byBugClass` entries with a `lineages` list (`M`). Verify: a shared bug class lists both lineage labels and its flags are ORed; the case passes.
- [ ] T007 Return pivot state as `divergenceByLineage` keyed by lineage label (`M`). Verify: a case with a pivot in one lineage shows it under that label only; the case passes.
- [ ] T008 Merge `ruledOutCandidates` with a `lineage` field, deduped on lineage plus `id` and sorted (`M`). Verify: a repeated `id` within one lineage appears once, the same `id` in two lineages appears twice; the case passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add the end-to-end merged-coverage case (`R/tests/fanout-review-focus.vitest.ts`). Verify: the merged registry carries all six surfaces (REQ-001) and the case passes.
- [ ] T010 Add the order-swap and missing-fields cases (`R/tests/unit/fanout-merge.vitest.ts`). Verify: A,B and B,A merges are byte-identical, a lineage without the fields merges cleanly, and both cases pass.
- [ ] T011 Rerun the T001 suites and compare with the baseline (`R/tests/`). Verify: the same command exits 0 and the pass count rose only by the new cases.
- [ ] T012 Rerun the Measured Behavior loop (`M`). Verify: each of the six names prints a count above 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The T011 rerun matches the baseline plus the new cases
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (section 3 holds the merge rules)
<!-- /ANCHOR:cross-refs -->

---
