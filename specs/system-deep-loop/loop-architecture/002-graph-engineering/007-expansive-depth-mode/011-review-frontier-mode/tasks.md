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

`D` is `.skilled/skills/system-deep-loop`. `Y` is `.skilled/commands/deep/assets/deep-review.yaml`. `U` is `$D/runtime/tests/unit`. `R` is `cd $D/runtime && npm test --`: the only Vitest config is `$D/runtime/vitest.config.ts`, so a test path is given relative to `$D/runtime`, and a run from any other directory finds no `.vitest.ts` file.
<!-- /ANCHOR:notation -->

---

## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] spec.md scope unchanged
2. [ ] Current phase identified in plan.md
3. [ ] Predecessor phases named in spec.md metadata are merged (003, 004, 008, 009, 010, 012)
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

- [x] T000 Record the operator's acceptance or replacement of ADR-001 to ADR-004, including the pilot's choice between a larger `maxIterations` and narrower `review_dimensions` under ADR-002 (`plan.md`). Verify: each ADR's `**Status**` line reads `Accepted`, or names the ADR that replaces it. Done 2026-11-17: the operator accepted all four as proposed; the builder may raise an amendment if the code disagrees. ADR-002 as proposed leaves both pilot options open, so the pilot's pick between a larger `maxIterations` and narrower `review_dimensions` is still to be recorded in this phase's `goal.md` log before the pilot runs. Pilot pick recorded 2026-11-17 in goal.md log: larger maxIterations, all four review dimensions kept.
- [x] T001 Confirm phases 003, 004, 008, 009, 010 and 012 are merged on the working branch (`../003-review-min-iterations-floor/`, `../004-focus-hijack-fix/`, `../008-review-dimension-coverage/`, `../009-fanout-review-coverage-merge/`, `../010-research-frontier-mode/`, `../012-pivot-hygiene/`). Verify: each phase's `implementation-summary.md` names a merged commit and `git branch --contains <sha>` lists the working branch for all six. All six merge commits are on branch 469 (goal.md log, T001 row).
- [x] T002 Confirm 008's custom dimension support is in place: the review coverage universe this phase extends is the configured `reviewDimensions` list (`../008-review-dimension-coverage/implementation-summary.md`). Verify: this phase's `implementation-summary.md` quotes 008's support decision in one line. 008 implementation-summary: "Support custom dimensions in buildDimensionCoverage (ADR-001, OD-001) | Operator choice: every configured dimension is tracked and can be covered".
- [x] T003 Capture the golden review baseline: registry, dashboard, Next Focus, rendered pack, pivot seed output and a fan-out lineage prompt with `depthMode` absent (`$U/fixtures/`, path settled at build). Verify: the six baseline files exist and `shasum -a 256` prints one stable hash per file across two runs. Seven baselines in runtime/tests/fixtures/golden-review-default/, stable sha256 across two runs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `antiConvergence.depthMode: "default"`, the `expansiveDepth` block and the `lockedFields` entry (`$D/deep-review/assets/deep-review-config.json`). Verify: `jq '.antiConvergence.depthMode'` on that file prints `"default"`. Pi dispatch; jq '.antiConvergence.depthMode' prints "default", expansiveDepth.maxDepth 3, lockedFields carries antiConvergence.depthMode; golden review 14/14 still passes.
- [x] T005 Lock the review `depthMode` key in the optimizer manifest (`.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json`). Verify: `$R tests/unit/optimizer-manifest-anti-convergence.vitest.ts` exits 0 with a review lock case. The manifest lock is shared by deep-research and deep-review (010 added it); new case 'locks the review depthMode key for deep-review and in the review config asset': optimizer-manifest-anti-convergence.vitest 5 passed.
- [x] T006 Add the flag row and write the keys in `step_create_config` (`.skilled/commands/deep/review.md`, `Y`). Verify: `rg -n 'depth-mode' .skilled/commands/deep/review.md` prints one flag row and `rg -n 'depthMode' Y` shows the config write. review.md flag row at the --convergence-mode row; step_create_config writes antiConvergence.depthMode and the expansiveDepth keys.
- [x] T007 Bind `depth_mode` on every surface `convergence_mode` is bound on: the presentation setup default, input table row, resolution rule and bound-values list (`.skilled/commands/deep/assets/deep-review-presentation.txt`, today `:42`, `:75`, `:228`, `:244`); `user_inputs`, `step_preflight_contract`, the `step_read_state` extract and a `--depth-mode` argument on the `convergence.cjs` call (`Y`, today `:54-58`, `:356`, `:889`, `:989`). Verify: `$R tests/unit/stop-decision-yaml-contract.vitest.ts` exits 0 with a review binding case. Presentation default, table row, resolution line, mapping line, bound value and phase output; user_inputs, preflight, step_read_state extract and convergence.cjs --depth-mode; stop-decision-yaml-contract 27 passed with the review binding block.
- [x] T008 Add the golden review test for absent key and `--depth-mode=default` (`$U/`, new golden review case). Verify: the case exits 0 against the T003 baseline for all six artifacts. review-depth-mode-golden.vitest: 14 passed (both variants x seven artifacts).
- [x] T009 Add the review `frontier_proposal` row to the leaf contract and sync the five runtime mirrors (`.skilled/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.pi/agents/deep-review.md`, `.vibe/agents/deep-review.toml`, `.dsh/agents/deep-review.patch.yml`). Verify: `rg -n 'frontier_proposal'` prints the row in all six files, the row states leaves never write coverage surfaces or the node store, and `/doctor:runtime-mirrors` reports no drift. Pi dispatch: the review frontier_proposal paragraph under Step 10 in .skilled/agents/deep-review.md; codex, pi, vibe and dsh generators plus the hand-kept .claude twin; rg finds frontier_proposal in all six; check-agent-mirror-sync: 11 agents, all comparable mirrors in sync. The paragraph changes the CLI lineage prompt bytes, so the golden strips exactly that paragraph (ADR-005, AC-001 waived pending ratification); deep-review-deltas-contract gains a proposal-row case; golden review + deltas contract 17 passed.
- [x] T010 Add one `{frontier_block}` token to the review template, placed so an empty value adds no byte, and add `frontier_block` (empty unless expansive) to `render_prompt_pack.variables` beside `review_focus_block` and to every other caller that renders the template (`$D/deep-review/assets/prompt-pack-iteration.md.tmpl`, `Y`, the callers from `rg -l 'prompt-pack-iteration.md.tmpl' $D/runtime/tests`). Verify: `$R tests/unit/prompt-pack.vitest.ts tests/unit/deep-review-marker-scan.vitest.ts tests/fanout-review-focus.vitest.ts tests/unit/deep-review-deltas-contract.vitest.ts` exits 0 with a proposal row case, and the golden case still passes. Pi dispatch: {saturated_directions}{frontier_block} in the review template, frontier_block in render_prompt_pack.variables plus a bind_before_render rule calling frontier-admit.cjs block --target review --node-id; prompt-pack, deep-review-marker-scan, fanout-review-focus and golden review: 47 passed.
- [x] T011 Add a review target mode to the phase-010 admission helper that writes `review/frontier-nodes.jsonl` rows instead of inbox rows, with `seed`, `admit` and `close` entry points (`$D/runtime/scripts/frontier-admit.cjs`, per ADR-003). Verify: a review admit suite exits 0 with one prune case per check and a store-row case, and `$R tests/unit/frontier-admit.vitest.ts` still passes. Pi dispatch: --target review on seed/admit/block (close unchanged), review config caps, no inbox row, scope-inside-target relevance, seed pruneReason rows, block by --node-id; frontier-admit-review.vitest + frontier-admit.vitest 42 passed (one prune case per check, store-row case, no inbox file, CLI case).
- [x] T012 Add the review `step_frontier_seed`: before `step_fanout_spawn` on the fan-out path and in `phase_init` after `step_create_config` otherwise, calling `frontier-admit.cjs seed --target review`; the target-1 pruning of merges and index rebuilds happens here (`Y`). Verify: a review seed case writes admitted depth-1 rows, and `stop-decision-yaml-contract` finds the step in both places (a wording check). Pi dispatch: step_frontier_seed --target review at the workflow root before step_fanout_spawn and in phase_init after step_create_config (skipped inside a lineage), with merge-no-own-diff and generated-artifact prune reasons; yaml-contract cases check both key orders.
- [x] T013 Add the review admission step after verify-iteration and before the reduce step, `enabled_when depthMode == expansive` (`Y`). Verify: `rg -n` for the step name in `Y` shows it between the two steps and no `inbox` write appears in it. step_frontier_admit --target review sits right before step_reduce_review_state and after step_dispatch_iteration; the yaml-contract case asserts no 'inbox' in the step.
- [x] T014 Build the review `registry.frontier`, the frontier-owned `searchDebt` entries and per-node dimension coverage from `review/frontier-nodes.jsonl` (`$D/runtime/scripts/reduce-state.cjs`). Verify: `$R tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with a case where one admitted node gives one open debt entry and one frontier node, and a case where two reduces of the same state give a byte-identical `frontier` and `searchDebt`. Pi dispatch: registry.frontier, frontier-owned searchDebt and per-node coveredDimensions/nextDimension built from review/frontier-nodes.jsonl under depthMode expansive; deep-review-state-reducer cases: one open node gives one debt entry and one frontier node; two reduces give byte-identical frontier and searchDebt; default config has no frontier key. deep-review-state-reducer + golden review: 42 passed.
- [x] T015 Add the close rule: a terminal node clears its debt and records its `candidateCoverage` bucket per plan ADR-001, and a node whose configured dimensions are all covered closes `answered` (`$D/runtime/scripts/reduce-state.cjs`). Verify: a close case with one `exhausted` and one `answered` node shows no frontier-owned `searchDebt` entry and no `deferred` or `blocked` disposition for either. Close case: exhausted and answered nodes leave no frontier debt entry and no deferred or blocked frontier class; answered maps to covered, pruned/abstained to ruledOut, exhausted/blocked stay frontier-only.
- [x] T016 Add the review Next Focus frontier assignment in the last-assignment-wins sequence of the strategy focus block and its dashboard twin, naming the node and its next uncovered dimension (`$D/runtime/scripts/reduce-state.cjs`, today `:2173-2187` and `:2271-2274`). Verify: a precedence case shows blocked-stop, then pivot, then frontier, then leaf `nextFocus`, then first uncovered dimension, in both the strategy and dashboard text. Pi dispatch: pickReviewFrontierFocus assigned after the leaf/uncovered base and before the pivot and blocked-stop overrides in the strategy, and between pivot and base in the dashboard twin; precedence case passes in deep-review-state-reducer (45 passed with golden).
- [x] T017 Steer dispatch: add the `active_frontier_node` extract from `registry.frontier` to `step_read_state` and a flag-gated case in the `next_dimension` rule that returns that node's next uncovered dimension, and fill `frontier_block` from the node (`Y`, per ADR-004). Verify: `stop-decision-yaml-contract` finds the flag-gated case in the `next_dimension` rule and the unchanged default rule (a wording check), and a reducer case shows the active node and its next uncovered dimension in `registry.frontier`. step_read_state extracts active_frontier_node and the flag-gated next_dimension case (default sentence verbatim); step_frontier_activate marks the node active before dispatch; frontier_block is bound by node id; reducer case shows activeNodeId and activeNextDimension.
- [x] T018 Apply the `frontierOpen` veto to review STOP candidates, after the review floor (`$D/runtime/scripts/convergence.cjs`). Verify: `$R tests/unit/stop-decision.vitest.ts tests/integration/review-depth-convergence.vitest.ts` exits 0 with review veto rows for `all_dimensions_clean` and composite candidates, a case asserting the echo is unchanged when `--depth-mode default` is passed, and `'echoes the input unchanged'` passing unedited. Pi dispatch: stopDecisionReviewFacts reports frontierOpen; the veto now also applies to review hard stop candidates (all_dimensions_clean is hardStop true), still after cap, failures, stuck, off, max-iterations and the review floor. stop-decision + review-depth-convergence: 95 passed; 'echoes the input unchanged' unedited.
- [x] T019 Add the expansive review STUCK_RECOVERY sub-branch that calls `frontier-admit.cjs close --target review --status exhausted` and keeps `deep_review.recovery_started` (`Y`). Verify: `stop-decision-yaml-contract` finds the close call and the event in the sub-branch (a wording check), and a review close case shows the node `exhausted` after the call. if_stuck_recovery.if_expansive_open_node closes the active node exhausted (close --target review) and keeps pending_stop_event stuck_recovery, which step_normalize_pause_events appends as deep_review.recovery_started; yaml-contract case passes; review close case in frontier-admit-review.
- [x] T020 Gate the review pivot on a terminal frontier, seed from `exhausted` and `blocked` nodes and route accepted candidates through admission, on the pivot code and branch as 012 left them (`$D/deep-review/scripts/divergent-review-pivot.ts`, `Y` divergent branch). Verify: `$R tests/integration/divergent-pivot.vitest.ts` exits 0 with a gating case, and default seed output matches the T003 baseline byte for byte. Pi dispatch: under the expansive mode buildCandidateSeeds adds a 'frontier-unanswered' seed per exhausted or blocked node and buildReviewPivotPreparationInput refuses an open frontier; the YAML eligibility contract carries frontier_gate and routes an accepted candidate through admission; divergent-pivot + golden review 40 passed (gating, seed and default cases), default pivot seeds byte-identical; typecheck exit 0.
- [x] T021 Add the review fan-out path in `fanout-run.cjs`: `config.depthMode` in review lineage params only when the value is `expansive`, the `frontier_scope:` binding beside `review_focus` with round-robin depth-1 partition, the partition recorded in `orchestration-summary.json`, each lineage's nodes written into `lineages/<label>/review/frontier-nodes.jsonl` before spawn, and the frontier rules in the review detached `leafContract` (`$D/runtime/scripts/fanout-run.cjs`). Verify: `$R tests/unit/fanout-run.vitest.ts` exits 0 with a review partition case, a store-written-before-spawn case and a no-flag case and a `--depth-mode default` case without a `frontier_scope:` or `depthMode` line. Pi dispatch: depthMode normalized for review lineages, round-robin partition recorded in orchestration-summary frontier_partition, each review lineage store written at its lineage dir root before spawn with no inbox (D-011-06), frontier_scope beside review_focus and the review leaf-contract line; fanout-run + fanout-review-focus + golden review 231 passed incl. 3/2/2 partition, store-without-inbox, frontier_scope binding, and no-flag and default cases without frontier_scope or depthMode.
- [x] T022 Pass `--depth-mode {depth_mode}` on the review `fanout-run.cjs` command in `step_fanout_spawn_cli` (`Y`). Verify: `stop-decision-yaml-contract` finds the argument on that command. step_fanout_spawn_cli passes --depth-mode {depth_mode}; the yaml-contract case 'passes the depth mode to the review fan-out runner' passes.
- [x] T023 Add the merged review `frontier` to the return of `mergeReviewRegistries` and the review fan-in guard over the recorded partition and the phase-009 merged coverage (`$D/runtime/scripts/fanout-merge.cjs`). Verify: `$R tests/unit/fanout-merge.vitest.ts` exits 0 with a merged-frontier case and a case that fails when one depth-1 node is missing. Pi dispatch: mergeReviewRegistries returns the merged frontier with the partition guard read from orchestration-summary frontier_partition, and the review merge output carries frontier_partition_guard; fanout-merge.vitest 88 passed incl. merged-frontier and missing-node cases.
- [x] T024 [P] Add frontier size, pruned nodes, revisits and budget per depth to the review dashboard rows under the flag (`$D/runtime/scripts/reduce-state.cjs`, `renderDashboard`). Verify: a reducer dashboard case shows the four metrics on an expansive fixture and the golden review case still passes. Dashboard section 10B. FRONTIER under the flag only: size, pruned, revisits, budget per depth, active node; default fixture renders no section; golden review still passes.
- [x] T025 Update the review reference docs for the flag, seed step, node store, steering rule, veto and fan-out partition (`$D/deep-review/references/`, `$D/deep-review/assets/review-mode-contract.yaml`, `$D/deep-review/SKILL.md`, `$D/deep-review/README.md`). Verify: `rg -l -- '--depth-mode'` prints each of those files. Pi dispatch: rg -l -- '--depth-mode' prints convergence.md, loop-protocol.md, quick-reference.md, state-format.md, review-mode-contract.yaml, deep-review/SKILL.md and deep-review/README.md; check-documentation-drift.cjs exit 0; review-mode-contract.yaml parses. The SKILL.md version bump was reverted so the version moves with the T027 changelog entry.
- [x] T026 Write the expansive review playbook scenarios through `/create:manual-testing-playbook system-deep-loop update --path $D/deep-review/manual-testing-playbook` (`$D/deep-review/manual-testing-playbook/`). Verify: the command completes and `rg -l -- '--depth-mode=expansive' $D/deep-review/manual-testing-playbook` prints at least one file. Written by @markdown in integration after merge. Done 2026-11-18: DRV-076 to DRV-082 added, one file each, in entry-points-and-modes (1), initialization-and-state-setup (1), iteration-execution-and-state-discipline (2), convergence-and-recovery (2) and fanout (1), and linked from the root index, which now counts 69 scenarios across 10 categories. Evidence: `rg -l -- '--depth-mode=expansive'` printed the DRV-076 feature file, and `validate-playbook-package.cjs --package` printed PASS with violations=0 and the three advisory warnings the baseline already had. Authored under the update contract of `sk-create-manual-testing-playbook`; the slash command was not run as a process.
- [x] T027 Add the changelog entry for the review flag (`$D/deep-review/changelog/`, through `/create:changelog`). Verify: `rg -l -- '--depth-mode' $D/deep-review/changelog` prints the new file. Written by @markdown in integration after merge (it also bumps deep-review/SKILL.md, whose version must match the newest changelog entry). Done 2026-11-18: `deep-review/changelog/v1.13.0.0.md` written in the expanded format as a minor bump from v1.12.0.0. Evidence: `rg -l -- '--depth-mode' $D/deep-review/changelog` printed the new file, `check_changelog_shape.py` printed PASS, `deep-review/SKILL.md` is at 1.13.0.0, and `parent-skill-check.cjs` on system-deep-loop printed OK with checks 13a, 13b and 13d passing. Authored under the `sk-create-changelog` contract; the slash command was not run as a process.
- [x] T028 Regenerate the review compiled contract after the last digested source change (`.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`). Verify: `node $D/runtime/scripts/compile-command-contracts.cjs --command deep/review --write` exits 0, then `$R tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0. Both compiled contracts regenerated after the last digested change (no diff remained: the commit hook had refreshed them); check-contract-drift OK commands=2; check-contract-drift + compile-command-contracts 26 passed.
- [x] T032 Keep each fan-out lineage's coverage graph inside the lineage, the named defect fix REQ-016 (`$D/runtime/scripts/fanout-run.cjs` lineage `extraEnv`, the graph-writing steps of `.skilled/commands/deep/assets/deep-review.yaml` and `deep-research.yaml`, both compiled contracts). Verify: `$R tests/unit/fanout-run.vitest.ts tests/unit/stop-decision-yaml-contract.vitest.ts -t "coverage graph store inside|lineage-local graph store"` exits 0. Root cause from the first pilot: five of six lineages wrote no graph because the store defaulted to the shared runtime database outside the lineage write surface (each lineage report says so); pi-3 pointed `DEEP_LOOP_COVERAGE_DB_DIR` at its own `graph-db/` and replays as `STOP converged all_dimensions_clean` with it. Red first on 2026-11-18: both lineage env cases failed with an empty `DEEP_LOOP_COVERAGE_DB_DIR` and all six YAML step cases failed; green after the fix. Default fan-out runs of both loop types change too, as REQ-016 names.
- [x] T033 Add the expansive review candidate `frontier_drained` behind every legal-stop gate, plan ADR-006 under decision-record Q003 and the operator's option-3 ruling of 2026-11-18 (`$D/runtime/scripts/convergence.cjs`, the `step_check_convergence` order in `deep-review.yaml`, the review reference docs). Verify: `$R tests/unit/stop-decision.vitest.ts -t frontier_drained` exits 0. Red first: 7 of 18 cases failed (the stop, three gate blocks, the floor, the graph-continue case and the `frontierTotal` fact) before the candidate existed; green after. Cases cover a drained lineage with passing gates that stops `converged`/`frontier_drained`, BLOCKED on `hotspotSaturationGate`, `p0ResolutionGate` and `dimensionCoverageGate`, an open node that continues, an empty or uncounted partition, default and absent depth mode with no candidate, and the cap, floor, stuck recovery, `off` and `max-iterations` still winning. The hard-stop choice is D-011-07. Full runtime suite after both tasks: 190 files, 3414 passed, 11 skipped, 0 failed; `check-contract-drift.cjs` prints OK commands=2. AC-011 and the pilot criterion stay open until a live pilot rerun.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T029 Run the full deep-loop suite. Verify: `npm test` from `$D/runtime` exits 0. Runs at the integration merge gate (full runtime suite); this branch ran the named suites only, per the build brief. Closed 2026-11-18: integration gate `adedc72e930` (this phase merged) ran the full deep-loop suite: 190 files, 3358 passed, 11 skipped, 0 failed.
- [B] T030 Run the pilot on example target 1: record `<pilot-sha>`, review `<pilot-sha>~100..<pilot-sha>`, prune merges and index rebuilds in the seed step with one sampled determinism node, admit the seven subsystem nodes and run with fan-out and a stated `maxIterations`, lineage count and `review_dimensions` (pilot packet under this phase's `scratch/`). Verify: `jq '.frontier.stats'` on the merged registry shows seven depth-1 nodes, zero open and zero active, and the stop reason is not `maxIterationsReached`. Runs on the integration tip after merge (D-011-04). Pilot choice recorded at T000: raise maxIterations, keep all four dimensions. First live run 2026-11-18 (`scratch/pilot-run-1.md`): FAIL, 6 of 7 depth-1 nodes (root cap) and 3 of 6 lineages stopped on the cap. The four defects found are fixed on integration `43eb6d47b8e`. Rerun waits on the research rerun result and an operator ruling on the stop criterion.
- [x] T031 Check the pilot config satisfies the depth-1 band rule (pilot config). Verify: 50% of each lineage's `maxIterations` is at least `ceil(7 / lineages) * dimensions`, computed with `jq` from the pilot config. Runs with the T030 pilot on the integration tip after merge; the band rule to check is 50% of each lineage's maxIterations >= ceil(7 / lineages) * 4. Live 2026-11-18 (`scratch/pilot-run-1.md`): PASS, `{"half":8,"need":8,"holds":true}` for 6 lineages x 16.
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

- [x] CHK-001 [P0] Requirements documented in spec.md spec.md REQ-001 to REQ-015, unchanged by the build.
- [x] CHK-002 [P0] Technical approach defined in plan.md plan.md ADR-001 to ADR-004 Accepted; build decisions in decision-record.md.
- [x] CHK-003 [P1] Phases 003, 004, 008, 009, 010 and 012 merged, per T001 T001: all six merge commits are on branch 469.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on every changed `.cjs` file and `tsc --noEmit` passes for changed `.ts` files node --check exits 0 on every changed .cjs file; npm run typecheck exits 0 for the changed .ts files.
- [x] CHK-011 [P0] No new branch is reachable when `depthMode` is absent or `default` Every new branch is gated on depthMode === 'expansive' (reducer, convergence, fan-out, pivot, YAML enabled_when); review-depth-mode-golden 14 of 14 for absent and default.
- [x] CHK-012 [P1] Malformed proposal rows are pruned with a reason, not thrown checkProposal returns 'relevance' for a non-object or a row without evidence or scope; the review admit suite prunes each malformed row with its reason and never throws.
- [x] CHK-013 [P1] Code comments carry the durable why and no spec, phase or task ids git diff 5e583331cc9 over changed .cjs/.ts/.yaml finds no task, REQ, ADR, CHK, spec-path or phase id in an added comment.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Golden review test passes for absent key and `--depth-mode=default`, pivot seeds and lineage prompt included review-depth-mode-golden: 14 of 14, pivot seeds and lineage prompt included (lineage prompt with the one stripped paragraph, ADR-005).
- [x] CHK-022 [P1] Admission, veto, close, stuck and fan-out edge cases tested Admission (frontier-admit-review), veto (stop-decision), close and stuck (reducer, yaml-contract), and fan-out (fanout-run, fanout-merge) edge cases all pass.
- [ ] CHK-023 [P1] Pilot run on target 1 completed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Not a fix packet; every shared-file edit is classed `cross-consumer` and covered by the golden test. Every shared-file edit (reduce-state.cjs, convergence.cjs, fanout-run.cjs, fanout-merge.cjs, frontier-admit.cjs, divergent-review-pivot.ts, deep-review.yaml, the template and the agent) is cross-consumer and gated on the expansive mode; the golden review test covers the default path of each.
- [x] CHK-FIX-002 [P0] Same-class producer inventory from plan.md affected surfaces completed. Producers of frontier state: frontier-admit.cjs (seed, admit, close, block) is the only store writer; the reducer is the only producer of registry.frontier and frontier debt; fanout-run.cjs writes lineage stores from the parent store. No other producer exists (rg over runtime/scripts, lib and deep-review/scripts).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `searchDebt`, `candidateCoverage`, `frontier_scope` and `depthMode`. Consumers: searchDebt read by convergence.cjs, review-verdict.cjs, fanout-merge.cjs, divergent-review-pivot.ts and deep-review.yaml; candidateCoverage by convergence.cjs, fanout-merge.cjs and deep-review.yaml; frontier_scope only by fanout-run.cjs prompts; depthMode by deep-review.yaml, reduce-state.cjs, convergence.cjs, fanout-run.cjs and divergent-review-pivot.ts. Open frontier debt makes the verdict CONDITIONAL while nodes are open, which the veto already holds at CONTINUE.
- [x] CHK-FIX-004 [P0] Admission table covers malformed, duplicate, too-deep, over-fan-out, budget-growing and cyclic proposals. frontier-admit-review covers malformed (no evidence), out-of-target scope, duplicate, too-deep, over-fan-out, budget-growing and cyclic proposals, one reason each.
- [x] CHK-FIX-005 [P1] Matrix axes from plan.md listed with their row count before completion is claimed. plan.md matrix: depthMode (absent, default, expansive) x convergenceMode (default, divergent) x executor (single, fan-out) = 12 rows. Absent/default rows: golden review plus the unchanged existing suites; expansive single: reducer, veto, yaml-contract; expansive divergent: divergent-pivot gating; expansive fan-out: fanout-run and fanout-merge. Expansive x divergent x fan-out has no dedicated end-to-end case; the pilot exercises fan-out live.
- [x] CHK-FIX-006 [P1] No test reads process-wide state without restoring it. The new tests write temp dirs only and restore nothing global; no case reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA. Evidence is pinned to the branch commits listed in goal.md; the final sha is in the last log row.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential is read or written by any changed file No changed file reads or writes a credential; the changes are state files, workflow prose and tests.
- [x] CHK-031 [P0] Review leaves cannot write coverage surfaces or `review/frontier-nodes.jsonl`; only `frontier-admit.cjs` and the reducer do The leaf contract paragraph forbids writing review/frontier-nodes.jsonl, searchDebt or any coverage surface; frontier-admit.cjs is the only store writer and the reducer derives debt and coverage.
- [x] CHK-032 [P1] Proposal scope must intersect the configured review target, so neither a leaf nor the pivot can expand it scopeInsideReviewTarget prunes a proposal scoped outside a file-list review target as relevance (frontier-admit-review case); the pivot's boundary regexes and target ban are unchanged.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized spec.md status In Progress; plan ADRs, tasks and acceptance rows carry the build evidence.
- [x] CHK-041 [P1] `review.md` command flag table and the review agent definition describe the same flag and row review.md flag row and the review agent's frontier_proposal paragraph name the same flag and row.
- [ ] CHK-042 [P2] The review synthesis names frontier-derived `deferred` entries as follow-up work
- [x] CHK-043 [P1] Reference docs, playbook scenarios and the changelog entry name `--depth-mode`, per T025-T027 Reference docs, SKILL.md and README name --depth-mode (T025); the playbook scenarios (T026) and the changelog (T027) were written 2026-11-18. Evidence: `rg -l -- '--depth-mode'` over `deep-review/` lists ten files, including `changelog/v1.13.0.0.md` and the DRV-076 scenario, the only new scenario that carries the flag literal.
- [x] CHK-044 [P1] The review compiled contract is regenerated and the agent mirrors show no drift, per T009 and T028 Both compiled contracts regenerated (no diff after the last digested change); check-contract-drift OK commands=2; check-contract-drift + compile-command-contracts 26 passed; agent mirrors in sync.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Pilot packet and fixtures stay under `scratch/` or the test fixture folder No pilot packet exists yet; test fixtures sit under runtime/tests/fixtures/golden-review-default and temp dirs.
- [x] CHK-051 [P1] scratch/ cleaned before completion This branch wrote nothing under scratch/; dispatch briefs and logs live in the session scratchpad, outside the repository.
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

- [x] CHK-100 [P0] ADR-001 to ADR-004 in `plan.md` are Accepted or replaced in T000, before any Phase 2 task runs. Accepted as proposed 2026-11-17.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted). Each reads Accepted since 2026-11-17.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale plan.md ADR-001 to ADR-004 each list rejected alternatives; decision-record.md build decisions each name a rollback.
- [x] CHK-103 [P2] No migration needed: an absent key reads as default An absent antiConvergence.depthMode reads as default in step_read_state, the reducer, convergence.cjs and fanout-run.cjs; the golden absent-key variant passes.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01: no new process per iteration; the admission suite runs inside the existing vitest run Admission runs as one frontier-admit.cjs call per iteration inside the existing step order; the review admit suite runs inside the vitest run.
- [ ] CHK-111 [P1] Pilot iteration count stays within its stated `maxIterations`
- [ ] CHK-112 [P2] Frontier size per depth recorded from the pilot dashboard
- [ ] CHK-113 [P2] Budget spent per depth recorded from the pilot dashboard
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback is `git revert` of this phase's commits; confirmed by running the golden test on the reverted tree Rollback is git revert of this branch's commits: the golden baselines were captured on the pre-phase tree 5e583331cc9 and passed there 14 of 14 (T003), so a revert restores a tree the golden already passed on.
- [x] CHK-121 [P1] `--depth-mode` documented in the command flag table review.md flag table row for --depth-mode.
- [ ] CHK-123 [P1] Pilot run steps recorded in `implementation-summary.md`
- [ ] CHK-124 [P2] Operator reviewed the pilot result
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No new dependency added No package.json or lockfile change; no new require of an external module.
- [x] CHK-131 [P1] No license changed No license file changed.
- [x] CHK-132 [P2] N/A: no web surface N/A: no web surface.
- [x] CHK-133 [P2] N/A: no personal data handled N/A: no personal data handled.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized spec, plan, tasks, decision-record, acceptance-criteria, implementation-summary and goal.md agree on the built scope and the open merge-time rows.
- [x] CHK-141 [P1] Review pack allowed-write list matches the review agent definition frontier_proposal rows go inside the existing delta file, so the pack's STATE FILES list and the agent's writable files (iteration file, strategy, write-once delta) still agree; neither gained a write target.
- [x] CHK-142 [P2] User-facing docs beyond the command doc are listed in T025-T027 T025 lists the reference docs, SKILL.md, README.md and review-mode-contract.yaml; T026 and T027 own the playbook and changelog.
- [x] CHK-143 [P2] N/A: knowledge lives in this packet and the parent research N/A: knowledge lives in this packet and the parent research.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owner of the deep-loop skill, merges the phase | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
