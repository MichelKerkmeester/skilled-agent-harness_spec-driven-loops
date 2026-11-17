---
title: "Feature Specification: Carry the review coverage surfaces through the fan-out merge (D12)"
description: "The fan-out review merge keeps findings, search debt and the verdict but drops dimensionCoverage, traceability, searchCoverage, candidateCoverage, divergence and ruledOutCandidates, so a merged review run has no coverage map for any guard to read. This phase merges all six with stated, deterministic rules."
trigger_phrases:
  - "fanout review coverage merge"
  - "merge review registries coverage"
  - "slice i d12"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Carry the review coverage surfaces through the fan-out merge (D12)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None. This slice ships in any order with the other defect slices. |
| **Successor** | `../011-review-frontier-mode/spec.md` (the review frontier needs this slice first) |
| **Source** | Parent `research/research.md` §13 row D12, §18 item 5, §20 Slice I; plan review `../scratch/fable-5-2-plan-review.md` F009-1, X-3, X-7, X-9 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mergeReviewRegistries` in `runtime/scripts/fanout-merge.cjs:869-997` returns findings, resolved findings, severity counts, search debt and the merged verdict, and nothing else. The six review coverage surfaces each lineage's reducer writes (`dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergence`, `ruledOutCandidates`, assembled at `runtime/scripts/reduce-state.cjs:1986-2001`) are dropped, so a merged review run cannot say which dimensions, protocols or bug classes any lineage covered. The research merge does carry its open and resolved questions, so only review is affected.

### Purpose
A merged review registry carries all six coverage surfaces under documented merge rules, so a merge-time coverage guard (Slice K) has data to read. The frontier partition check also needs a merged `frontier`, which this slice does not produce; see Out of Scope.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from `.skilled/skills/system-deep-loop`.
```text
$ for k in dimensionCoverage traceability searchCoverage candidateCoverage divergence ruledOutCandidates; do printf "%s " $k; rg -c "$k" runtime/scripts/fanout-merge.cjs || echo 0; done
dimensionCoverage 0
traceability 0
searchCoverage 0
candidateCoverage 0
divergence 0
ruledOutCandidates 0
```
None of the six surface names appears anywhere in the merge script.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Merge `dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergence` and `ruledOutCandidates` in `mergeReviewRegistries`, using the rules in `plan.md` section 3.
- Keep every merged list in a deterministic order, as the existing search-debt merge does.
- Add a merged-coverage test case and keep the existing merge suites green.
- Add a manual testing playbook scenario that inspects the merged registry of a two-lineage review fan-out.

### Out of Scope
- A merge-time coverage guard that blocks on gaps. This slice provides the data; the guard ships with Slice K (`../011-review-frontier-mode/`).
- The research merge. It already carries open and resolved questions.
- `cleanSearchProof`, which the review registry also carries (`reduce-state.cjs:1998`). D12 does not list it; Slice K decides whether its guard needs it.
- Changing the per-lineage reducer output shapes.
- The merged `frontier` projection. No producer or shape for a review `registry.frontier` exists until Slice K creates it (`../011-review-frontier-mode/spec.md` REQ-008 and `../011-review-frontier-mode/tasks.md` T019 and T022 read it), so this slice cannot define its merge rule. Slice K must deliver it itself: the `frontier` merge rule in `mergeReviewRegistries`, the `frontier.stats` its pilot reads, and the fan-out partition that `frontier_scope:` binds. The research merge (`mergeResearchRegistries`, `fanout-merge.cjs:758`) does not carry `frontier` either; that belongs to `../010-research-frontier-mode/`.
- A compiled-contract regeneration or an agent mirror sync. `fanout-merge.cjs` and the two test files are not digest sources of either compiled contract, and no agent definition changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Merge the six coverage surfaces in `mergeReviewRegistries` (:869-997) and add them to the returned registry |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modify | Add per-surface merge cases |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts` | Modify | Add the end-to-end merged-coverage case |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/` | Modify | A merged-coverage scenario through `/create:manual-testing-playbook system-deep-loop update` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The merged review registry carries all six surfaces. | A two-lineage merge case asserts that `dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergenceByLineage` and `ruledOutCandidates` are all present on the result. |
| REQ-002 | Dimension coverage merges as a union. | Lineage A covers `correctness`, lineage B covers `security`: the merged `dimensionCoverage` marks both `true` and the other two `false`. |
| REQ-003 | Traceability merges by strongest restriction. | One protocol is `pass` in A and `fail` in B: the merged result is `fail`, and the recomputed `summary` counts it once as `fail`. A `pending` in B does not overwrite a `pass` in A. `unfinishedCoreProtocols` is the sorted union of both lineages' lists. |
| REQ-004 | Existing merge behavior does not change. | `fanout-merge.vitest.ts`, `fanout-merge-latest-record.vitest.ts`, `fanout-merge-structured-missing.vitest.ts`, `fanout-merge-reducer-provenance.vitest.ts` and `fanout-review-focus.vitest.ts` pass; findings, verdict and search debt on their fixtures are unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The merge is deterministic. | Merging lineages in order A, B and in order B, A yields byte-identical JSON for all six surfaces. |
| REQ-006 | A lineage with no coverage surface does not break the merge. | A lineage registry missing all six fields merges without error and contributes nothing to them. |
| REQ-007 | Every reader of the merged review registry is checked. | The readers of `deep-review-findings-registry.json` (seven non-test files today: `divergent-review-pivot.ts`, `fanout-run.cjs`, `fanout-merge.cjs`, `score-fanout-pairs.cjs`, `reduce-state.cjs`, `deep-review-projections-contract.ts`, `legacy-projection-manifest.ts`) are each recorded as safe or changed in `goal.md` section 4. |
| REQ-008 | The operator can see the merged coverage. | A playbook scenario under `deep-review/manual-testing-playbook/fanout/` runs a two-lineage review fan-out and reads the six surfaces from the merged registry with `jq`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-merge.vitest.ts tests/fanout-review-focus.vitest.ts` passes, including the new cases.
- **SC-002**: The Measured Behavior loop prints a non-zero count for each of the six surface names after the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None upstream. Slice K (`../011-review-frontier-mode/`) depends on this slice. | K cannot build its merge-time guard until this lands | Land this slice before K starts |
| Dependency | Slice K also edits the `mergeReviewRegistries` return (`fanout-merge.cjs:981-996`) for its `frontier` merge and guard | Same-function conflict | Land this slice first; K adds `frontier` beside the six surfaces |
| Risk | Default-path risk is LOW: the change is additive and only fan-out review runs reach it. A consumer that iterates the merged registry's keys could see new fields. | Low | Grep readers by the file name `deep-review-findings-registry.json`, not the variable `mergedRegistry` (which matches only `fanout-merge.cjs`); REQ-004 suites guard existing output |
| Risk | Union coverage can over-state coverage when lineages review different scopes. | Low | Keep per-lineage detail (`divergenceByLineage`, lineage labels on candidates) so a guard can check partitions; documented in `plan.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The merge rules are set in `plan.md` section 3 and follow the existing strongest-restriction and search-debt precedents.
<!-- /ANCHOR:questions -->

---
