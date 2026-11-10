---
title: "Tasks: Phase 7: lineage-reducer-compliance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "lineage reducer compliance tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: lineage-reducer-compliance

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

**Task Format**: `T### [P?] Description (file path)`

Evidence citations below point at `scratch/evidence/lane-01-reducer-provenance.txt` by section number, except T012, which cites `scratch/evidence/lane-review-fixes-merge.txt`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline before any edit: combined run 238 tests with 9 failures, solo `fanout-run.vitest.ts` run 167 tests with the same 9 failures (evidence section 5)
- [x] T002 Locate the cause from the saved proof artifacts: `proof-a` carries a hand-written dashboard and an 8-key registry with none of the reducer's machine-owned fields, `proof-b` carries the reducer stamp (evidence section 1)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the failing regression case first: `tests/unit/fanout-merge-reducer-provenance.vitest.ts`, 3 cases from the `proof-a` and `proof-b` shapes (evidence section 2)
- [x] T004 Record the red run: exit 1, 2 failed and 1 passed, with empty stderr in both failures as the negative control that no provenance check existed (evidence section 2)
- [x] T005 Add the merge-time check in `scripts/fanout-merge.cjs`: a stamped dashboard passes, a dashboard without the stamp is refused with `lineage_reducer_provenance_missing`, and a lineage with no dashboard merges with `lineage_reducer_provenance_unverified` (evidence section 7)
- [x] T006 Record the green run: exit 0, 3 of 3 new cases (evidence section 3)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun the merge suite: 5 files, 74 of 74, which is 71 pre-existing plus the 3 new cases (evidence section 3)
- [x] T008 Run the merge end to end over the saved proof lineages: exit 0, `refused_reducer_provenance: ["proof-a"]`, merged registry `mergedFrom: ["proof-b"]` with 4 findings and no `proof-a` finding id present (evidence section 4)
- [x] T009 Rerun `fanout-run.vitest.ts` against the baseline: 9 failed and 158 passed of 167, the same 9 pre-existing failures and delta 0 (evidence section 5)
- [x] T010 Run the static checks: `node --check` exit 0, `npm run typecheck` exit 0, a targeted `tsc` on the new test exit 0 with a control that exits 2, and the comment-hygiene check exit 0 (evidence section 6)
- [x] T011 Fill this packet's docs from the lane evidence and run `validate.sh --strict` on the folder (result recorded in `implementation-summary.md`)
- [x] T012 Address the two code review findings on the merge: a refused lineage now reads `REFUSED` in `fanout-attribution.md`, and a dashboard that is a symbolic link refuses only its own lineage instead of aborting the merge. Two new cases bring `fanout-merge-reducer-provenance.vitest.ts` to 5 (evidence `scratch/evidence/lane-review-fixes-merge.txt`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
