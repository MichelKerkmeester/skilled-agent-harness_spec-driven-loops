---
title: "Tasks: Opt-in expansive depth mode for deep-review: admission into candidateCoverage and searchDebt"
description: "Ordered tasks for the review frontier sub-mode: setup and golden review baseline, the review build steps, then the suite and the target-1 pilot."
trigger_phrases:
  - "review frontier mode tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Opt-in expansive depth mode for deep-review: admission into candidateCoverage and searchDebt

<!-- SPECKIT_LEVEL: 3 -->

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

`D` is `.skilled/skills/system-deep-loop`. `Y` is `.skilled/commands/deep/assets/deep-review.yaml`. `U` is `$D/runtime/tests/unit`.
<!-- /ANCHOR:notation -->

---

## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] spec.md scope unchanged
2. [ ] Current phase identified in plan.md
3. [ ] Predecessor phases named in spec.md metadata are merged
4. [ ] Relevant P0/P1 checklist items identified
5. [ ] The ADRs in plan.md that the task depends on are Accepted

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in the listed order; the golden test lands before any behavior change |
| TASK-SCOPE | Stay within the task's named file |
| TASK-VERIFY | Run the task's `Verify:` command and read its output and exit status |
| TASK-DOC | Mark `[x]` only after the verify output matches |
| TASK-GATE | Keep every new branch behind the `depthMode` flag |

### Status Reporting Format
Report each task as `T### <done|blocked|failed>: <verify command> -> <observed output>`.

### Blocked Task Protocol
Mark the task `[B]`, name the blocking phase, file or failing check on the same line, and stop work that depends on it. Three failed fixes for one symptom escalate to the operator with the evidence.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 008, 009 and 010 are merged on the working branch (`../008-review-dimension-coverage/`, `../009-fanout-review-coverage-merge/`, `../010-research-frontier-mode/`). Verify: each phase's `implementation-summary.md` names a merged commit and `git branch --contains <sha>` lists the working branch for all three.
- [ ] T002 Confirm 008's custom dimension support is in place: the review coverage universe this phase extends is the configured `reviewDimensions` list (`../008-review-dimension-coverage/implementation-summary.md`). Verify: this phase's `implementation-summary.md` quotes 008's support decision in one line.
- [ ] T003 Capture the golden review baseline: registry, dashboard, Next Focus, rendered pack, pivot seed output and a fan-out lineage prompt with `depthMode` absent (`$U/fixtures/`, path settled at build). Verify: the six baseline files exist and `sha256sum` prints one stable hash per file across two runs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `antiConvergence.depthMode: "default"`, the `expansiveDepth` block and the `lockedFields` entry (`$D/deep-review/assets/deep-review-config.json`). Verify: `jq '.antiConvergence.depthMode'` on that file prints `"default"`.
- [ ] T005 Lock the review `depthMode` key in the optimizer manifest (`.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json`). Verify: `npx vitest run $U/optimizer-manifest-anti-convergence.vitest.ts` exits 0 with a review lock case.
- [ ] T006 Add the flag row and write the keys in `step_create_config` (`.skilled/commands/deep/review.md`, `Y`). Verify: `rg -n 'depth-mode' .skilled/commands/deep/review.md` prints one flag row and `rg -n 'depthMode' Y` shows the config write.
- [ ] T007 Add the golden review test for absent key and `--depth-mode=default` (`$U/`, new golden review case). Verify: the case exits 0 against the T003 baseline for all six artifacts.
- [ ] T008 Add the review `frontier_proposal` row to the leaf contract (`.skilled/agents/deep-review.md`). Verify: `rg -n 'frontier_proposal' .skilled/agents/deep-review.md` prints the row and states leaves never write coverage surfaces.
- [ ] T009 [P] Add the conditional `## FRONTIER` block to the review pack and renderer (`$D/deep-review/assets/prompt-pack-iteration.md.tmpl`, `$D/runtime/lib/deep-loop/prompt-pack.ts`). Verify: `npx vitest run $U/prompt-pack.vitest.ts` exits 0 and the `deep-review-deltas-contract` suite passes with a proposal row case.
- [ ] T010 Add a review target mode to the phase-010 admission helper that emits debt entries instead of inbox rows (admission helper from phase 010). Verify: a review admit suite exits 0 with one prune case per check and the research admission suite still passes.
- [ ] T011 Add the review admission step after verify-iteration and before the reduce step, `enabled_when depthMode == expansive` (`Y`). Verify: `rg -n` for the step name in `Y` shows it between the two steps and no `inbox` write appears in it.
- [ ] T012 Add the review `registry.frontier` projection and admission into `searchDebt` (`$D/runtime/scripts/reduce-state.cjs`). Verify: a reducer case shows one admitted node as one open debt entry and one frontier node.
- [ ] T013 Add the close rule: a terminal node clears its debt and records its `candidateCoverage` bucket per plan ADR-001 (`$D/runtime/scripts/reduce-state.cjs`). Verify: a close case with one `exhausted` and one `answered` node shows no frontier-owned `searchDebt` entry and no `deferred` or `blocked` disposition for either.
- [ ] T014 Add the review Next Focus frontier assignment in the last-assignment-wins sequence, naming the node and its next uncovered dimension (`$D/runtime/scripts/reduce-state.cjs`). Verify: a precedence case shows blocked-stop, then pivot, then frontier, then leaf `nextFocus`, then first uncovered dimension.
- [ ] T015 Apply the `frontierOpen` veto to review STOP candidates (`$D/runtime/scripts/convergence.cjs`). Verify: `npx vitest run $U/stop-decision.vitest.ts` and the `review-depth-convergence` suite exit 0 with review veto rows for `all_dimensions_clean` and composite candidates.
- [ ] T016 Add the expansive review STUCK_RECOVERY sub-branch keeping `deep_review.recovery_started` (`Y`). Verify: a counter case shows `stuckCount` reset to 0 after the sub-branch.
- [ ] T017 Gate the review pivot on a terminal frontier, seed from `exhausted` and `blocked` nodes and route accepted candidates through admission (`$D/deep-review/scripts/divergent-review-pivot.ts`). Verify: `divergent-pivot` suites exit 0 with a gating case, and default seed output matches the T003 baseline byte for byte.
- [ ] T018 Add the review `frontier_scope:` binding beside `review_focus` with round-robin depth-1 partition (`$D/runtime/scripts/fanout-run.cjs`). Verify: `npx vitest run $U/fanout-run.vitest.ts` exits 0 with a review partition case and a no-flag case without a `frontier_scope:` line.
- [ ] T019 Add the review fan-in guard over the phase-009 merged coverage (`$D/runtime/scripts/fanout-merge.cjs`). Verify: `npx vitest run $U/fanout-merge.vitest.ts` exits 0 with a case that fails when one depth-1 node is missing.
- [ ] T020 [P] Add frontier size, pruned nodes, revisits and budget per depth to the review dashboard under the flag (`$D/deep-review/assets/deep-review-dashboard.md`). Verify: the golden review case still passes and an expansive fixture shows the four metrics.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Run the full deep-loop suite (`$D/runtime/tests/`). Verify: `npx vitest run $D/runtime/tests` exits 0.
- [ ] T022 Run the pilot on example target 1: record `<pilot-sha>`, review `<pilot-sha>~100..<pilot-sha>`, prune merges and index rebuilds at init with one sampled determinism node, admit the seven subsystem nodes and run with fan-out and a stated `maxIterations` and lineage count (pilot packet under this phase's `scratch/`). Verify: `jq '.frontier.stats'` on the merged registry shows seven depth-1 nodes, zero open and zero active, and the stop reason is not `maxIterationsReached`.
- [ ] T023 Check the pilot config satisfies the depth-1 band rule (pilot config). Verify: 50% of each lineage's `maxIterations` is at least `ceil(7 / lineages)`, computed with `jq` from the pilot config.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The golden review test passes and the pilot registry shows every frontier node terminal with no frontier debt
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked by an unmerged predecessor phase is marked `[B]` with the phase name and does not count as done.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phases 008-010 merged, per T001
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on every changed `.cjs` file and `tsc --noEmit` passes for changed `.ts` files
- [ ] CHK-011 [P0] No new branch is reachable when `depthMode` is absent or `default`
- [ ] CHK-012 [P1] Malformed proposal rows are pruned with a reason, not thrown
- [ ] CHK-013 [P1] Code comments carry the durable why and no spec, phase or task ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Golden review test passes for absent key and `--depth-mode=default`, pivot seeds and lineage prompt included
- [ ] CHK-022 [P1] Admission, veto, close, stuck and fan-out edge cases tested
- [ ] CHK-023 [P1] Pilot run on target 1 completed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Not a fix packet; every shared-file edit is classed `cross-consumer` and covered by the golden test.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory from plan.md affected surfaces completed.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `searchDebt`, `candidateCoverage`, `frontier_scope` and `depthMode`.
- [ ] CHK-FIX-004 [P0] Admission table covers malformed, duplicate, too-deep, over-fan-out, budget-growing and cyclic proposals.
- [ ] CHK-FIX-005 [P1] Matrix axes from plan.md listed with their row count before completion is claimed.
- [ ] CHK-FIX-006 [P1] No test reads process-wide state without restoring it.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential is read or written by any changed file
- [ ] CHK-031 [P0] Review leaves cannot write coverage surfaces; only the admission step and the reducer do
- [ ] CHK-032 [P1] Proposal scope must intersect the configured review target, so neither a leaf nor the pivot can expand it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `review.md` command flag table and the review agent definition describe the same flag and row
- [ ] CHK-042 [P2] The review synthesis names frontier-derived `deferred` entries as follow-up work
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Pilot packet and fixtures stay under `scratch/` or the test fixture folder
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Not yet verified; this phase is Planned.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 and ADR-002 in `plan.md` are Accepted or replaced before T013 and T014 run
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] No migration needed: an absent key reads as default
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01: no new process per iteration; the admission suite runs inside the existing vitest run
- [ ] CHK-111 [P1] Pilot iteration count stays within its stated `maxIterations`
- [ ] CHK-112 [P2] Frontier size per depth recorded from the pilot dashboard
- [ ] CHK-113 [P2] Budget spent per depth recorded from the pilot dashboard
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback is `git revert` of this phase's commits; confirmed by running the golden test on the reverted tree
- [ ] CHK-121 [P1] `--depth-mode` documented in the command flag table
- [ ] CHK-123 [P1] Pilot run steps recorded in `implementation-summary.md`
- [ ] CHK-124 [P2] Operator reviewed the pilot result
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] No new dependency added
- [ ] CHK-131 [P1] No license changed
- [ ] CHK-132 [P2] N/A: no web surface
- [ ] CHK-133 [P2] N/A: no personal data handled
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Review pack allowed-write list matches the review agent definition
- [ ] CHK-142 [P2] N/A: no user-facing documentation beyond the command doc
- [ ] CHK-143 [P2] N/A: knowledge lives in this packet and the parent research
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owner of the deep-loop skill, merges the phase | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
