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

`R` is `.skilled/skills/system-deep-loop/runtime`. `M` is `R/scripts/fanout-merge.cjs`. Every test command runs as `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/...` from the repository root. No compiled-contract regeneration or agent mirror sync is needed: `M` is not a contract digest source and no agent changes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline of the REQ-004 suites (`R/tests/`). Verify: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-merge.vitest.ts tests/unit/fanout-merge-latest-record.vitest.ts tests/unit/fanout-merge-structured-missing.vitest.ts tests/unit/fanout-merge-reducer-provenance.vitest.ts tests/fanout-review-focus.vitest.ts` exits 0 and the pass count is written in `goal.md` section 4. Done: 5 files, 92 passed, exit 0 (recorded in `goal.md` §4).
- [x] T002 List every reader of the merged review registry by its file name (`.skilled/skills/system-deep-loop/`). Verify: `rg -l 'deep-review-findings-registry\.json' .skilled/skills/system-deep-loop --glob '*.cjs' --glob '*.ts' --glob '!**/tests/**'` lists seven files (`divergent-review-pivot.ts`, `fanout-run.cjs`, `fanout-merge.cjs`, `score-fanout-pairs.cjs`, `reduce-state.cjs`, `deep-review-projections-contract.ts`, `legacy-projection-manifest.ts` on 2026-11-17), and each is recorded in `goal.md` section 4 as safe or needing a change. The variable name `mergedRegistry` matches only `M`. Done: seven files, each recorded in `goal.md` §4; only `fanout-merge.cjs` changes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Merge `dimensionCoverage` as a sorted-key union (`M`). Verify: the REQ-002 case in `tests/unit/fanout-merge.vitest.ts` passes. Done: `mergeDimensionCoverage`; the union case passes.
- [x] T004 Merge `traceability` results per protocol by strongest restriction, recompute `summary` and union `unfinishedCoreProtocols` (`M`). Verify: the REQ-003 case passes. Done: `mergeTraceability`; the strongest-restriction and summary case passes.
- [x] T005 Merge `searchCoverage` bucket lists as sorted unions, keeping `graphCoverageMode` only when all lineages agree (`M`). Verify: a case with two lineages and different modes yields `null` and passes. Done: `mergeSearchCoverage`; disagreeing modes give `null`, agreeing modes are kept.
- [x] T006 Merge `candidateCoverage` buckets and `byBugClass` entries with a `lineages` list (`M`). Verify: a shared bug class lists both lineage labels and its flags are ORed; the case passes. Done: `mergeCandidateCoverage`; the shared bug class lists both lineages with flags ORed.
- [x] T007 Return pivot state as `divergenceByLineage` keyed by lineage label (`M`). Verify: a case with a pivot in one lineage shows it under that label only; the case passes. Done: `mergeDivergenceByLineage`; only the lineage with a pivot appears.
- [x] T008 Merge `ruledOutCandidates` with a `lineage` field, deduped on lineage plus `id` and sorted (`M`). Verify: a repeated `id` within one lineage appears once, the same `id` in two lineages appears twice; the case passes. Done: `mergeRuledOutCandidates`; one entry per lineage plus id, sorted.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add the end-to-end merged-coverage case (`R/tests/fanout-review-focus.vitest.ts`). Verify: the merged registry carries all six surfaces (REQ-001) and the case passes. Done: the end-to-end case runs `fanout-merge.cjs` on two lineages and reads all six surfaces from disk.
- [x] T010 Add the order-swap and missing-fields cases (`R/tests/unit/fanout-merge.vitest.ts`). Verify: A,B and B,A merges are byte-identical, a lineage without the fields merges cleanly, and both cases pass. Done, written first: the A,B and B,A surfaces are byte-identical, and a bare lineage merges cleanly.
- [x] T011 Rerun the T001 suites and compare with the baseline (`R/tests/`). Verify: the same command exits 0 and the pass count rose only by the new cases. Done: 5 files, 102 passed (92 + 10), exit 0.
- [x] T012 Rerun the Measured Behavior loop (`M`). Verify: each of the six names prints a count above 0. Done: counts 2, 5, 2, 2, 3 and 3.
- [x] T013 Write the merged-coverage manual testing playbook scenario: a two-lineage review fan-out whose merged registry is read with `jq` for the six surfaces, through `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` (`.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/`). Verify: `rg -l 'dimensionCoverage' .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout` lists the new scenario. Done 2026-11-17 through the update-mode steps of `create-manual-testing-playbook-auto.yaml` (`@markdown`): DRV-071 in `deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md`, listed in the root index. `rg -l dimensionCoverage` on the folder lists it. `validate-playbook-package.cjs` PASS (58 scenarios, 0 violations). The two-lineage fan-out was not run as a walk, so the scenario's live merge read is still open.
- [x] T014 Write the changelog entry for the merged review coverage fix through `/create:changelog` under `.skilled/skills/system-deep-loop/changelog/` (cross-phase handoff §3). Verify: the entry names the six merged surfaces and `divergenceByLineage`. Done 2026-11-17 through the update-mode steps of `create-changelog-auto.yaml` (`@markdown`): `.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` (patch). The entry names the six merged surfaces and `divergenceByLineage`. validate_document VALID, DQI 89. Step 6 moved the hub version carriers to 2.1.2.0; parent-skill-check PASS.
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
