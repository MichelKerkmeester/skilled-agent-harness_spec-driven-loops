# Fix plan

Target: topic expansive-depth; head: a2382a3f063312cd0534aa8b858212bf5a0c6d34

## In scope

### docs:.skilled/skills

- [ ] C-1 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:96 The frontier veto line says it 'never outranks the iteration cap, consecutive failures, stuck recovery, `--convergence-mode=off` or `--stop-policy=max-iterations`'. It leaves out two workflow stops th
  fix: stuck recovery, `--convergence-mode=off` or `--stop-policy=max-iterations` -> stuck recovery, pause, the max-duration stop, `--convergence-mode=off` or `--stop-policy=max-iterations`
- [ ] C-2 P2 .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:70 Same gap as C-1. The veto 'never outranks the iteration cap, consecutive failures, stuck recovery, `--convergence-mode=off` or `--stop-policy=max-iterations`'. It leaves out pause (step_check_pause_se
  fix: stuck recovery, `--convergence-mode=off` or `--stop-policy=max-iterations` -> stuck recovery, pause, the max-duration stop, `--convergence-mode=off` or `--stop-policy=max-iterations`
- [ ] L7-1 P2 .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:185 Decision Priority item 8 says only an open node triggers the frontier veto. The code counts nodes whose status is open or active (convergence.cjs:1483 and :1650), then vetoes when that count is above 
  fix: an open frontier node turns the candidate into -> an open or active frontier node turns the candidate into
- [ ] L8-1 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md:47 The frontierOpen Veto section lists `--convergence-mode=off` among the decisions that come before the veto. That is the /deep:* command spelling, but this doc is about convergence.cjs. Its parseArgs (
  fix: `--convergence-mode=off` -> convergence mode `off` (`--convergence-mode off` or `antiConvergence.convergenceMode`)
- [ ] C-5 P2 .skilled/skills/system-deep-loop/deep-research/README.md:108 The Packet Files table lists frontier-nodes.jsonl for an expansive run but not the seed input {artifact_dir}/frontier-seed.json. Both research seed steps write that file and pass it to frontier-admit.
- [x] L4-1 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/anti-convergence-floor.md:25 The doc says the template defines `antiConvergence.minIterations` and 'The workflow writes those values into the config record'. That implies the run's floor lives at `antiConvergence.minIterations`.  [handed off]
- [ ] L6-1 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:57 feature-catalog.md:228 says this page holds the 'full implementation and validation file listings'. The tables leave files out. The Implementation table has no row for runtime/scripts/fanout-run.cjs, 
- [ ] L6-2 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md:28 The doc says 'a custom name that appears in the finding's focus is kept as its own dimension'. deriveDimension (runtime/scripts/reduce-state.cjs:1237-1244) does a substring match of each universe entr
- [ ] L6-3 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:28 The doc says the active node's next uncovered dimension is dispatched 'apart from the last iteration under the cap while a core traceability protocol is unfinished'. The override in deep-review.yaml:1
- [ ] L6-4 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:779 Section 13, AUTOMATED TEST CROSS-REFERENCE, lists where automated deep-review coverage lives. It names none of the suites that cover expansive depth and the stop changes, although the DRV-076 to DRV-0
- [ ] L7-2 P2 .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:107 The list of what the frontier veto 'never outranks' names pause, which is a workflow-level check, but leaves out the max-duration stop. In deep-review.yaml, step_check_max_duration (line 1190) runs be
- [ ] L7-3 P2 .skilled/skills/system-deep-loop/deep-review/SKILL.md:242 Same gap as L7-2. The 'never outranks' list (iteration cap, consecutive failures, stuck recovery, pause, --convergence-mode=off, --stop-policy=max-iterations, the review floor) leaves out the max-dura
- [ ] L7-4 P2 .skilled/skills/system-deep-loop/deep-review/README.md:163 Same gap as L7-2. 'The frontier veto never outranks the iteration cap, consecutive failures, stuck recovery, pause, ...' leaves out the max-duration stop. step_check_max_duration (deep-review.yaml:119
- [ ] L7-5 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:467 Same gap as L7-2. The 'never outranks' list for the frontierOpen veto leaves out the max-duration stop. step_check_max_duration (deep-review.yaml:1190) runs before step_check_convergence (:1276).
- [ ] L7-6 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:165 Same gap as L7-2. The Frontier veto line's 'never outranks' list leaves out the max-duration stop. step_check_max_duration (deep-review.yaml:1190) runs before step_check_convergence (:1276).
- [ ] L7-7 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:34 The doc says 'a run started with `--depth-mode=expansive` adds a tenth, `frontier-nodes.jsonl`'. Both review seed steps also write the seed input {artifact_dir}/frontier-seed.json and pass it to front

### docs:.skilled/commands

- [ ] C-3 P2 .skilled/commands/deep/research.md:107 The --depth-mode row's 'never outranks the iteration cap, consecutive failures, the minIterations floor, stuck recovery, pause, `--convergence-mode=off` or `--stop-policy=max-iterations`' leaves out t
  fix: stuck recovery, pause, `--convergence-mode=off` or `--stop-policy=max-iterations` -> stuck recovery, pause, the max-duration stop, `--convergence-mode=off` or `--stop-policy=max-iterations`
- [ ] C-4 P2 .skilled/commands/deep/review.md:100 Same gap as L7-2, but in the command doc, which L7 did not review. The --depth-mode row's 'never outranks' list leaves out the max-duration stop. step_check_max_duration (deep-review.yaml:1190) runs b
  fix: stuck recovery, pause, `--convergence-mode=off` or `--stop-policy=max-iterations` -> stuck recovery, pause, the max-duration stop, `--convergence-mode=off` or `--stop-policy=max-iterations`
- [ ] L2-1 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:70 The maxIterations row says: 'Under --depth-mode=expansive a `default` budget is resized after the seed step to `min(24, max(10, 2·c·(S + maxDepth − 1)))`, with S the depth-1 nodes the seed admitted an
- [ ] L3-1 P2 .skilled/commands/deep/assets/deep-review.yaml:2645 The custom-dimension rubric row says a configured custom dimension "is not required for severity coverage". The code does require it. step_normalize_review_dimensions (yaml 830-831) keeps custom names
- [ ] L3-2 P2 .skilled/commands/deep/assets/deep-review.yaml:599 step_extend_completed_run on_fail says "Exit 2 is a usage error, such as a run that is not complete ... Any other failure halts with STATUS=FAIL". The command at line 588 ends the inline node script w

### docs:.claude/agents

- [ ] L1-1 P2 .claude/agents/deep-research.md:286 The prune list that follows 'so it prunes a row that' leaves out one relevance prune. frontier-admit.cjs:429 also prunes a proposal whose parent the store holds with status 'pruned'. The doc only name
  fix: names a parent the store does not hold, -> names a parent the store does not hold or holds as pruned,
- [ ] L1-4 P2 .claude/agents/deep-review.md:253 The review prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too.
  fix: names a parent the store does not hold, -> names a parent the store does not hold or holds as pruned,

### docs:.pi/agents

- [ ] L1-2 P2 .pi/agents/deep-research.md:294 The prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too.
  fix: names a parent the store does not hold, -> names a parent the store does not hold or holds as pruned,
- [ ] L1-5 P2 .pi/agents/deep-review.md:260 The review prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too.
  fix: names a parent the store does not hold, -> names a parent the store does not hold or holds as pruned,

### docs:.skilled/agents

- [ ] L1-3 P2 .skilled/agents/deep-research.md:302 The prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too.
  fix: names a parent the store does not hold, -> names a parent the store does not hold or holds as pruned,
- [ ] L1-6 P2 .skilled/agents/deep-review.md:267 The review prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too.
  fix: names a parent the store does not hold, -> names a parent the store does not hold or holds as pruned,

## Pre-existing or outside the scope

