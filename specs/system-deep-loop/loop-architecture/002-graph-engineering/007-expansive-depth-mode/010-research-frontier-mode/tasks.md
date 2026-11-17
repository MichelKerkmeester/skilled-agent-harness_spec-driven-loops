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

`D` is `.skilled/skills/system-deep-loop`. `Y` is `.skilled/commands/deep/assets/deep-research.yaml`. `U` is `$D/runtime/tests/unit`. `R` is `cd $D/runtime && npm test --`: the only Vitest config is `$D/runtime/vitest.config.ts`, so a test path is given relative to `$D/runtime`, and a run from any other directory finds no `.vitest.ts` file.
<!-- /ANCHOR:notation -->

---

## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] spec.md scope unchanged
2. [ ] Current phase identified in plan.md
3. [ ] Predecessor phases named in spec.md metadata are merged (004, 005, 006, 007, 012)
4. [ ] Relevant P0/P1 checklist items identified
5. [ ] The ADRs in plan.md that the task depends on are Accepted (T000)

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

- [x] T000 Record the operator's acceptance or replacement of ADR-001 to ADR-005 (`plan.md`). Verify: each ADR's `**Status**` line reads `Accepted`, or names the ADR that replaces it. Done 2026-11-17: the operator accepted all five as proposed; the builder may raise an amendment if the code disagrees.
- [x] T001 Confirm phases 004, 005, 006, 007 and 012 are merged on the working branch (`../004-focus-hijack-fix/`, `../005-prompt-pack-contract-alignment/`, `../006-state-log-leaf-fields/`, `../007-source-diversity-quality-class/`, `../012-pivot-hygiene/`). Verify: each phase's `implementation-summary.md` names a merged commit and `git branch --contains <sha>` lists the working branch for all five. Done 2026-11-17: `git branch --contains` lists `worktrees/467-ed-010-research-frontier-mode` for 004 `11bc7693a27`, 005 `f34e06123f9`, 006 `dbeddaf20ba`, 007 `42fdf690604` and 012 `51cd0448c24` (base: integration `b5fb87abad8`).
- [x] T002 Capture the golden baseline on that tree: registry, dashboard, Next Focus, rendered prompt pack, one fan-out lineage prompt and the `stopDecisionConfig` echo for a fixed research fixture with `depthMode` absent (`$U/fixtures/`, path settled at build). Verify: the six baseline files exist and `shasum -a 256` prints one stable hash per file across two runs. Done 2026-11-17: `GOLDEN_UPDATE=1 npx vitest run research-depth-mode-golden.vitest` wrote the six baselines to `runtime/tests/fixtures/golden-research-default/` (registry, dashboard, Next Focus, prompt pack, lineage prompt, stop-decision config) on the untouched tree; `shasum -a 256` matched across two captures.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `antiConvergence.depthMode: "default"` and the `expansiveDepth` block, and add `depthMode` to `lockedFields` (`$D/deep-research/assets/deep-research-config.json`). Verify: `jq '.antiConvergence.depthMode, .expansiveDepth.maxDepth'` on that file prints `"default"` and `3`. Done 2026-11-17: `jq` prints `"default"` and `3`; `antiConvergence.depthMode` added to `lockedFields`.
- [x] T004 Lock `antiConvergence.depthMode` in the optimizer manifest (`.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json`). Verify: `$R tests/unit/optimizer-manifest-anti-convergence.vitest.ts` exits 0 with a new case asserting the lock. Done 2026-11-17: `npx vitest run optimizer-manifest-anti-convergence.vitest` 4 of 4 with the new depth-mode lock case; the spec-kit `optimizer-promote.vitest.ts` still passes 25 of 25.
- [x] T005 Add the `--depth-mode=default|expansive` flag row and write the new keys in `step_create_config` (`.skilled/commands/deep/research.md`, `Y`). Verify: `rg -n 'depth-mode' .skilled/commands/deep/research.md` prints one flag row and `rg -n 'depthMode' Y` shows the `step_create_config` write. Done 2026-11-17: `rg -n 'depth-mode' .skilled/commands/deep/research.md` prints the one flag row (line 104); `step_create_config` writes `antiConvergence.depthMode`, the `expansiveDepth` caps and `maxFrontierNodes: {max_iterations}` (ADR-003).
- [x] T006 Bind `depth_mode` on every surface `convergence_mode` is bound on: the presentation setup default, input table row, resolution rule and bound-values list (`.skilled/commands/deep/assets/deep-research-presentation.txt`, today `:46`, `:68`, `:197`, `:211`); `user_inputs`, `step_preflight_contract` `required_values_present`, the `step_read_state` extract and a `--depth-mode "{depth_mode}"` argument on the `convergence.cjs` call (`Y`, today `:71`, `:369`, `:868`, `:947`), accepted by the argument parser in `$D/runtime/scripts/convergence.cjs`. Verify: `$R tests/unit/stop-decision-yaml-contract.vitest.ts` exits 0 with a case that finds `depth_mode` beside `convergence_mode` in each of those places. Done 2026-11-17: `depth_mode` bound in the presentation default, input row, resolution rule, mapping, bound values and Phase Output; in `user_inputs`, `required_values_present`, the `step_read_state` extract and the `convergence.cjs` call; `CONVERGENCE_FLAGS` accepts `depthMode`/`depth_mode`. `npx vitest run stop-decision-yaml-contract.vitest stop-decision.vitest research-depth-mode-golden.vitest convergence-script.vitest` 129 of 129.
- [x] T007 Add the golden byte-identity test for absent key and explicit `--depth-mode=default`, over the six T002 artifacts (`$U/`, new golden case). Verify: `$R tests/unit/<golden file>` exits 0 against the T002 baseline. Done 2026-11-17: `research-depth-mode-golden.vitest.ts` compares all six artifacts for the absent key and for an explicit `depthMode: default` config plus `--depth-mode default` args; 12 of 12 pass.
- [x] T008 Create the admission helper with the node-status store writer, the six ordered checks and per-check prune reasons, and the `seed` and `close` entry points (`$D/runtime/scripts/frontier-admit.cjs`, per ADR-004). Verify: `$R tests/unit/frontier-admit.vitest.ts` exits 0 with one table row per failing check, one admit case that writes exactly one inbox row and one store row, and one close case. Done 2026-11-17: `runtime/scripts/frontier-admit.cjs` (store writer, six ordered checks, `seed`/`admit`/`close` entry points and CLI). `npx vitest run frontier-admit.vitest` 14 of 14: one row per failing check, first-failure-wins, one admit case writing exactly one inbox row and one store row, a close case, a pruned case and a CLI case.
- [x] T009 Add `'frontier'` to `VALID_QUESTION_ORIGINS` and build the opt-in `frontier: {nodes, stats}` field in `buildRegistry` from `research/frontier-nodes.jsonl` (`$D/deep-research/scripts/reduce-state.cjs`). Verify: `$R tests/unit/deep-research-reduce-state.vitest.ts` exits 0 with a case where a `frontier`-origin inbox row keeps its origin and a case where two reduces of the same state give a byte-identical `frontier`. Done 2026-11-17: `'frontier'` origin plus `readFrontierNodeStore`/`buildFrontierProjection`, projected only under expansive. `npx vitest run deep-research-reduce-state.vitest research-depth-mode-golden.vitest` 60 of 60: the origin case and the two-reduce equality case.
- [x] T010 Add the question close rule: a terminal frontier status marks its `frontier`-origin question resolved and records the status (`$D/deep-research/scripts/reduce-state.cjs`). Verify: the close case asserts an `exhausted` node's question is resolved and `all_questions_answered` becomes reachable. Done 2026-11-17: a terminal node resolves its inbox question and records `frontierStatus`. The close case gives an empty `openQuestions` with an `exhausted` node, so `all_questions_answered` is reachable. `npx vitest run deep-research-reduce-state.vitest research-depth-mode-golden.vitest` 60 of 60.
- [x] T011 Add the frontier branch in `resolveNextFocus` after pivot and blocked-stop, before continuity, emitting a focus string that is not the question text (`$D/deep-research/scripts/reduce-state.cjs`). Verify: a reducer case shows lowest-depth-first selection and that one visit with that focus leaves the question unresolved. Done 2026-11-17: `pickFrontierFocus` after pivot and blocked-stop, before continuity; focus is `Frontier node <id> (depth, scope): <question>`, never the bare text. The focus case picks depth 1 first and the visited question stays open. `npx vitest run deep-research-reduce-state.vitest research-depth-mode-golden.vitest` 60 of 60.
- [x] T012 Add `step_frontier_seed`, `enabled_when depthMode == expansive`: before `step_fanout_spawn` on the fan-out path and in `phase_init` after `step_create_config` on the single-executor path, calling `frontier-admit.cjs seed` (`Y`, per ADR-005). Verify: a `frontier-admit` seed case writes admitted depth-1 rows to the store, and the `stop-decision-yaml-contract` suite finds the step before `step_fanout_spawn` and after `step_create_config`. Done 2026-11-17: `step_frontier_seed` sits at the workflow root before `step_fanout_spawn` and in `phase_init` after `step_create_config`, skipped inside a fan-out lineage. The contract cases check both key orders. `frontier-admit` seed case (`npx vitest run frontier-admit.vitest` 19 of 19). `npx vitest run stop-decision-yaml-contract.vitest` 21 of 21.
- [x] T013 Add `step_frontier_admit` after verify-iteration and before `step_reduce_state`, `enabled_when depthMode == expansive`, calling `frontier-admit.cjs admit` (`Y`). Verify: `rg -n 'step_frontier_admit' Y` shows the step between the two named steps and the `stop-decision-yaml-contract` suite passes. Done 2026-11-17: `step_frontier_admit` sits directly before `step_reduce_state` and after the dispatch and verify block; it builds the dedupe known-texts file and calls `frontier-admit.cjs admit`. `npx vitest run stop-decision-yaml-contract.vitest` 21 of 21.
- [x] T014 Add the depth budget split 50/35/15 with roll-down only and `exhausted: budget` closes (`$D/runtime/scripts/frontier-admit.cjs` and `$D/deep-research/scripts/reduce-state.cjs`). Verify: a budget case shows an unspent depth-1 share added to depth 2 and never the reverse. Done 2026-11-17: `applyFrontierBudget` in the reducer (50/35/15, roll-down only once a band has no open node, `exhausted`/`budget` closes); `frontier-admit.cjs` keeps child budgets monotone. Roll-down case: depth 2 allotted 6.5 keeps its node open; no-roll-up case: depth 1 allotted 5 closes its node. `npx vitest run deep-research-reduce-state.vitest research-depth-mode-golden.vitest` 60 of 60.
- [x] T015 Add `depthMode` to `stopDecisionConfig` only when the resolved value is `expansive`, and the `frontierOpen` veto after the `minIterations` floor (`$D/runtime/scripts/convergence.cjs`). The YAML passes `--depth-mode default` on every default run, so "only when set" would change every echo. Verify: `$R tests/unit/stop-decision.vitest.ts` exits 0 with a table that builds a `composite_converged` candidate and shows the veto only under expansive mode with open nodes, a case asserting the echo is unchanged when `--depth-mode default` is passed, and `'echoes the input unchanged'` passing without edits. Done 2026-11-17: `stopDecisionConfig` adds `depthMode` only for expansive; research facts carry `frontierOpen` only when `registry.frontier` exists; the veto sits after the `minIterations` floor. `npx vitest run stop-decision.vitest stop-decision-yaml-contract.vitest research-depth-mode-golden.vitest convergence-script.vitest loop-counters-derivation.vitest` 158 of 158, with the composite precedence table (veto, empty frontier, no flag, cap, off, max-iterations, floor, stuck) and the config-echo cases.
- [x] T016 Add the expansive STUCK_RECOVERY sub-branch that calls `frontier-admit.cjs close --status exhausted` for the active node, advances focus and keeps the `stuckRecovery` append (`Y`). Verify: the `stop-decision-yaml-contract` suite finds the close call and the `stuckRecovery` append in the sub-branch (a wording check: Vitest cannot run YAML prose), and a `frontier-admit` close case shows the node `exhausted` after the call. Done 2026-11-17: `if_stuck_recovery.if_expansive_open_node` closes the focused node with `--status exhausted --reason stuck`, re-reduces, and takes the refreshed Next Focus; the `stuckRecovery` append stays on the path. The contract case checks both (a wording check, since YAML prose does not run). The `frontier-admit` close case shows the store row. `npx vitest run stop-decision-yaml-contract.vitest` 21 of 21.
- [x] T017 Add the `frontier_proposal` delta row type to the leaf contract and sync it to the five runtime mirrors (`.skilled/agents/deep-research.md`, `.claude/agents/deep-research.md`, `.codex/agents/deep-research.toml`, `.pi/agents/deep-research.md`, `.vibe/agents/deep-research.toml`, `.dsh/agents/deep-research.patch.yml`). Verify: `rg -n 'frontier_proposal'` prints the row in all six files and `/doctor:runtime-mirrors` reports no drift. Done 2026-11-17: the `frontier_proposal` row is in Step 9 of `.skilled/agents/deep-research.md` and its hand-kept `.claude` twin; the four `sync-agents*.cjs` generators wrote codex, dsh, pi and vibe. `rg -c frontier_proposal` prints 1 in all six files, and `node .skilled/bin/check-agent-mirror-sync.cjs` gives 'all comparable mirrors in sync — OK' (exit 0).
- [ ] T018 Add one `{frontier_block}` token at the end of an existing template line and the proposal row shape inside the block text; add `frontier_block` (empty unless expansive) to `render_prompt_pack.variables` and to every other caller that renders the template (`$D/deep-research/assets/prompt-pack-iteration.md.tmpl`, `Y` `:1376-1398`, the callers from `rg -l 'prompt-pack-iteration.md.tmpl' $D/runtime/tests`). Verify: `$R tests/unit/prompt-pack.vitest.ts tests/unit/deep-research-marker-scan.vitest.ts tests/fanout-loop-prompt-in-process.test.ts` exits 0 and the golden case still passes.
- [x] T019 Add `step_frontier_graph_upsert` after `step_graph_upsert` with the graph close rule (`Y`). Verify: the close case shows an exhausted node no longer lowers question coverage or source diversity in `coverage-graph-signals`. Done 2026-11-17: `step_frontier_graph_upsert` after `step_graph_upsert` runs `frontier-admit.cjs graph` then `upsert.cjs --events`. Pruned nodes are never written; exhausted, blocked and abstained nodes are re-kinded to a closed CLAIM (decision D-010-01). The close case in `frontier-admit.vitest` shows that question coverage and source diversity return to their base values. 19 of 19, plus `npx vitest run stop-decision-yaml-contract.vitest` 21 of 21.
- [x] T020 Gate the divergent Council pivot, on the branch as 012 left it, so it fires only once every frontier node is terminal (`Y`, the `convergence_mode == 'divergent'` branch). Verify: the `stop-decision-yaml-contract` suite finds the gate condition in that branch (a wording check), and a reducer case shows `frontier.stats` with zero open and zero active nodes only once every node is terminal. Done 2026-11-17: `eligibility_contract.frontier_gate` makes the pivot eligible only once no node is open or active; the `frontierOpen` veto enforces it, and pivot candidates re-enter through admission. `npx vitest run stop-decision-yaml-contract.vitest` 21 of 21.
- [ ] T021 Add the fan-out path in `fanout-run.cjs`: `depthMode` in `FANOUT_FLAGS`, `config.depthMode` in the lineage params only when the value is `expansive`, the round-robin `frontier_scope:` binding over the seeded depth-1 nodes, the partition recorded in `orchestration-summary.json`, each lineage's nodes written into `lineages/<label>/research/frontier-nodes.jsonl` before it spawns, and the frontier rules in the detached `leafContract` (`$D/runtime/scripts/fanout-run.cjs`). Verify: `$R tests/unit/fanout-run.vitest.ts` exits 0 with a partition case, a store-written-before-spawn case and a no-flag case and a `--depth-mode default` case whose prompts have no `frontier_scope:` or `depthMode` line.
- [ ] T022 Pass `--depth-mode {depth_mode}` on the `fanout-run.cjs` command in `step_fanout_spawn_cli` (`Y`). Verify: the `stop-decision-yaml-contract` suite finds the argument on that command.
- [ ] T023 Add the merged `frontier` to `mergeResearchRegistries` and the fan-in guard that reads the recorded partition (`$D/runtime/scripts/fanout-merge.cjs`). Verify: `$R tests/unit/fanout-merge.vitest.ts` exits 0 with a merged-frontier case and a case that fails the guard when one partitioned node is missing from every lineage.
- [x] T024 [P] Add frontier size, pruned nodes, revisits and budget per depth to `renderDashboard` under the flag (`$D/deep-research/scripts/reduce-state.cjs`, `renderDashboard`). Verify: a reducer dashboard case shows the four metrics on an expansive fixture and the golden case still passes. Done 2026-11-17: `## 6B. FRONTIER` with size, pruned, revisits and per-band budget, rendered only under expansive. The dashboard case asserts all four and that a default dashboard has no section; the golden still passes 12 of 12.
- [x] T025 Add the `focusAlignment` risk case with `keyQuestions` present on an expansive fixture (`$D/runtime/tests/unit/convergence-score-delta.vitest.ts` or a sibling convergence suite). Verify: the case asserts the guard alone does not stop a frontier-driven continue. Done 2026-11-17: three cases in `stop-decision.vitest.ts`. With an empty frontier, an off-focus frontier answer gives `CONTINUE`/`qualityGuardFailed` and never a stop. Open nodes continue on `frontierOpen` first. A frontier answer listed in `keyQuestions` passes. `npx vitest run stop-decision.vitest` 79 of 79.
- [ ] T026 Update the research reference docs for the flag, seed step, node store, veto and fan-out partition (`$D/deep-research/references/` `convergence.md`, `loop-protocol.md`, `state-format.md` and the quick reference, `$D/deep-research/SKILL.md`, `$D/deep-research/README.md`). Verify: `rg -l -- '--depth-mode'` prints each of those files.
- [ ] T027 Write the expansive research playbook scenarios through `/create:manual-testing-playbook system-deep-loop update --path $D/deep-research/manual-testing-playbook` (`$D/deep-research/manual-testing-playbook/`). Verify: the command completes and `rg -l -- '--depth-mode=expansive' $D/deep-research/manual-testing-playbook` prints at least one file.
- [ ] T028 Add the changelog entry for the new flag (`$D/deep-research/changelog/`, through `/create:changelog`). Verify: `rg -l -- '--depth-mode' $D/deep-research/changelog` prints the new file.
- [ ] T029 Regenerate the research compiled contract after the last digested source change (`.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`). Verify: `node $D/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` exits 0, then `$R tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run the full deep-loop suite. Verify: `npm test` from `$D/runtime` exits 0 and the guard suites from parent research section 10 are all listed as passed.
- [ ] T031 Run the pilot on example target 2 with `--depth-mode=expansive`, a stated `maxIterations`, depth-1 nodes rooted at `runtime/lib/prompt-policy.ts` and `runtime/data/prompt-policy.default.json`, the scorer at depth 2 and dedupe against `specs/system-skill-advisor/routing-and-scoring/001-010` (pilot packet under this phase's `scratch/`). Verify: `jq '.frontier.stats'` on the pilot `findings-registry.json` shows zero open and zero active nodes, the stop reason is not `maxIterationsReached`, and the log records how many depth-1 nodes the seed step produced.
- [ ] T032 Check the pilot cites the current command-surfacing symbols (pilot `research.md`). Verify: `rg -c 'COMMAND_POLICIES'` on it prints nothing and `rg -c 'COMMAND_ROWS|TRACKED_COMMANDS'` prints at least 1.
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
- [ ] CHK-003 [P1] Phases 004-007 and 012 merged, per T001
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
- [ ] CHK-031 [P0] Leaves cannot write `research/inbox.jsonl` or `research/frontier-nodes.jsonl`; only `frontier-admit.cjs` does
- [ ] CHK-032 [P1] Proposal scope must intersect the root scope, so a leaf cannot steer the run outside its target
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `research.md` command flag table and the agent definition describe the same flag and row
- [ ] CHK-042 [P2] `wave_orchestration` carries a pointer to the frontier mode
- [ ] CHK-043 [P1] Reference docs, playbook scenarios and the changelog entry name `--depth-mode`, per T026-T028
- [ ] CHK-044 [P1] The research compiled contract is regenerated and the agent mirrors show no drift, per T017 and T029
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
| P1 Items | 25 | 0/25 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Not yet verified; this phase is Planned.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001 to ADR-005 in `plan.md` are Accepted or replaced in T000, before any Phase 2 task runs. Accepted as proposed 2026-11-17.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted). Each reads Accepted since 2026-11-17.
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
- [ ] CHK-142 [P2] User-facing docs beyond the command doc are listed in T026-T028
- [ ] CHK-143 [P2] N/A: knowledge lives in this packet and the parent research
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owner of the deep-loop skill, merges the phase | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
