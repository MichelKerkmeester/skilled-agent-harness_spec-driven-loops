---
title: "Tasks: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules"
description: "Ordered tasks for the research frontier sub-mode: setup and golden baseline, the eight build steps in the parent research order, then the suite and the target-2 pilot."
trigger_phrases:
  - "research frontier mode tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules

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

`D` is `.skilled/skills/system-deep-loop`. `Y` is `.skilled/commands/deep/assets/deep-research.yaml`. `U` is `$D/runtime/tests/unit`.
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

- [ ] T001 Confirm phases 004, 005, 006 and 007 are merged on the working branch (`../004-focus-hijack-fix/`, `../005-prompt-pack-contract-alignment/`, `../006-state-log-leaf-fields/`, `../007-source-diversity-quality-class/`). Verify: each phase's `implementation-summary.md` names a merged commit and `git branch --contains <sha>` lists the working branch for all four.
- [ ] T002 Capture the golden baseline on that tree: registry, dashboard, Next Focus and rendered prompt pack for a fixed research fixture with `depthMode` absent (`$U/fixtures/`, path settled at build). Verify: the four baseline files exist and `sha256sum` prints one stable hash per file across two runs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add `antiConvergence.depthMode: "default"` and the `expansiveDepth` block, and add `depthMode` to `lockedFields` (`$D/deep-research/assets/deep-research-config.json`). Verify: `jq '.antiConvergence.depthMode, .expansiveDepth.maxDepth'` on that file prints `"default"` and `3`.
- [ ] T004 Lock `antiConvergence.depthMode` in the optimizer manifest (`.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json`). Verify: `npx vitest run $U/optimizer-manifest-anti-convergence.vitest.ts` exits 0 with a new case asserting the lock.
- [ ] T005 Add the `--depth-mode=default|expansive` flag row and write the new keys in `step_create_config` (`.skilled/commands/deep/research.md`, `Y`). Verify: `rg -n 'depth-mode' .skilled/commands/deep/research.md` prints one flag row and `rg -n 'depthMode' Y` shows the `step_create_config` write.
- [ ] T006 Add the golden byte-identity test for absent key and explicit `--depth-mode=default` (`$U/`, new golden case). Verify: `npx vitest run` on the golden case exits 0 against the T002 baseline.
- [ ] T007 Add `'frontier'` to `VALID_QUESTION_ORIGINS` and the opt-in `frontier: {nodes, stats}` field in `buildRegistry` (`$D/deep-research/scripts/reduce-state.cjs`). Verify: `npx vitest run $U/deep-research-reduce-state.vitest.ts` exits 0 with a case where a `frontier`-origin inbox row keeps its origin.
- [ ] T008 Add the question close rule: a terminal frontier status marks its `frontier`-origin question resolved and records the status (`$D/deep-research/scripts/reduce-state.cjs`). Verify: the close case asserts an `exhausted` node's question is resolved and `all_questions_answered` becomes reachable.
- [ ] T009 Add the frontier branch in `resolveNextFocus` after pivot and blocked-stop, before continuity, emitting a focus string that is not the question text (`$D/deep-research/scripts/reduce-state.cjs`). Verify: a reducer case shows lowest-depth-first selection and that one visit with that focus leaves the question unresolved.
- [ ] T010 Create the admission helper with the six ordered checks and per-check prune reasons (admission helper script, name settled at build). Verify: `npx vitest run $U/frontier-admit.vitest.ts` exits 0 with one table row per failing check.
- [ ] T011 Add `step_frontier_admit` after verify-iteration and before `step_reduce_state`, `enabled_when depthMode == expansive`, writing admitted rows to `research/inbox.jsonl` with `origin: "frontier"` (`Y`). Verify: `rg -n 'step_frontier_admit' Y` shows the step between the two named steps and the `stop-decision-yaml-contract` suite passes.
- [ ] T012 Add the depth budget split 50/35/15 with roll-down only and `exhausted: budget` closes (admission helper and `$D/deep-research/scripts/reduce-state.cjs`). Verify: a budget case shows an unspent depth-1 share added to depth 2 and never the reverse.
- [ ] T013 Add the `depthMode` passthrough in `stopDecisionConfig` and the `frontierOpen` veto after the `minIterations` floor (`$D/runtime/scripts/convergence.cjs`). Verify: `npx vitest run $U/stop-decision.vitest.ts` exits 0 with a table that builds a `composite_converged` candidate and shows the veto only under expansive mode with open nodes.
- [ ] T014 Add the expansive STUCK_RECOVERY sub-branch that closes the active node as `exhausted`, advances focus and keeps the `stuckRecovery` append (`Y`). Verify: a convergence case shows `stuckCount` reset to 0 after the sub-branch runs.
- [ ] T015 Add the `frontier_proposal` delta row type to the leaf contract (`.skilled/agents/deep-research.md`). Verify: `rg -n 'frontier_proposal' .skilled/agents/deep-research.md` prints the row definition and states leaves never write the inbox.
- [ ] T016 [P] Add the conditional `## FRONTIER` block and proposal row shape to the template and renderer (`$D/deep-research/assets/prompt-pack-iteration.md.tmpl`, `$D/runtime/lib/deep-loop/prompt-pack.ts`). Verify: `npx vitest run $U/prompt-pack.vitest.ts` exits 0 and the golden case still passes.
- [ ] T017 Add `step_frontier_graph_upsert` after `step_graph_upsert` with the graph close rule (`Y`). Verify: the close case shows an exhausted node no longer lowers question coverage or source diversity in `coverage-graph-signals`.
- [ ] T018 Gate the divergent Council pivot so it fires only once every frontier node is terminal (`Y`). Verify: a composition case shows no pivot while a node is open and a pivot once all are terminal.
- [ ] T019 Add the `frontier_scope:` binding with round-robin depth-1 partition (`$D/runtime/scripts/fanout-run.cjs`). Verify: `npx vitest run $U/fanout-run.vitest.ts` exits 0 with a partition case and a no-flag case whose prompt has no `frontier_scope:` line.
- [ ] T020 Add the fan-in guard that every depth-1 node is accounted for (`$D/runtime/scripts/fanout-merge.cjs`). Verify: `npx vitest run $U/fanout-merge.vitest.ts` exits 0 with a case that fails the guard when one node is missing.
- [ ] T021 [P] Add frontier size, pruned nodes, revisits and budget per depth to the dashboard under the flag (`$D/deep-research/assets/deep-research-dashboard.md`). Verify: the golden case still passes and an expansive fixture dashboard shows the four metrics.
- [ ] T022 Add the `focusAlignment` risk case with `keyQuestions` present on an expansive fixture (`$U/convergence-score-delta.vitest.ts` or a sibling convergence suite). Verify: the case asserts the guard alone does not stop a frontier-driven continue.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Run the full deep-loop unit suite (`$U/`). Verify: `npx vitest run $U` exits 0 and the guard suites from parent research section 10 are all listed as passed.
- [ ] T024 Run the pilot on example target 2 with `--depth-mode=expansive`, a stated `maxIterations`, depth-1 nodes rooted at `runtime/lib/prompt-policy.ts` and `runtime/data/prompt-policy.default.json`, the scorer at depth 2 and dedupe against `specs/system-skill-advisor/routing-and-scoring/001-010` (pilot packet under this phase's `scratch/`). Verify: `jq '.frontier.stats'` on the pilot `findings-registry.json` shows zero open and zero active nodes, and the stop reason is not `maxIterationsReached`.
- [ ] T025 Check the pilot cites the current command-surfacing symbols (pilot `research.md`). Verify: `rg -c 'COMMAND_POLICIES'` on it prints nothing and `rg -c 'COMMAND_ROWS|TRACKED_COMMANDS'` prints at least 1.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The golden test passes and the pilot registry shows every frontier node terminal
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
- [ ] CHK-003 [P1] Phases 004-007 merged, per T001
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
- [ ] CHK-021 [P0] Golden byte-identity test passes for absent key and `--depth-mode=default`
- [ ] CHK-022 [P1] Admission, veto, close, stuck and fan-out edge cases tested
- [ ] CHK-023 [P1] Pilot run on target 2 completed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Not a fix packet; every shared-file edit is classed `cross-consumer` and covered by the golden test.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory from plan.md affected surfaces completed.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `frontier`, `depthMode` and `frontier_proposal`.
- [ ] CHK-FIX-004 [P0] Admission table covers malformed, duplicate, too-deep, over-fan-out, budget-growing and cyclic proposals.
- [ ] CHK-FIX-005 [P1] Matrix axes from plan.md listed with their row count before completion is claimed.
- [ ] CHK-FIX-006 [P1] No test reads process-wide state without restoring it.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential is read or written by any changed file
- [ ] CHK-031 [P0] Leaves cannot write `research/inbox.jsonl`; only `step_frontier_admit` does
- [ ] CHK-032 [P1] Proposal scope must intersect the root scope, so a leaf cannot steer the run outside its target
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `research.md` command flag table and the agent definition describe the same flag and row
- [ ] CHK-042 [P2] `wave_orchestration` carries a pointer to the frontier mode
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

- [ ] CHK-100 [P0] ADR-001 to ADR-003 in `plan.md` are Accepted or replaced before T009, T017 and T003 run
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
- [ ] CHK-141 [P1] Prompt-pack allowed-write list matches the agent definition
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
