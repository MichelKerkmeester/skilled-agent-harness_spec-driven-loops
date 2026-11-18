# Fix plan

Target: topic expansive-depth; head: cee8682a6c9ef068533304435765dac7aad72702

## In scope

### docs:.claude/agents

- [ ] L1-5 P2 .claude/agents/deep-research.md:286 Same incomplete prune list in the claude mirror: the six admission checks end in `cycle`, and a proposal whose `parentId` the store does not hold is pruned as `relevance`, neither of which the enumera
  fix: You only propose. The workflow's admission step decides, and it prunes a row that lacks evidence or scope, repeats a kno -> You only propose. The workflow's admission step decides, and in one fixed order it prunes a row that lacks evidence or s
- [ ] L1-2 P1 .claude/agents/deep-review.md:253 Same unconditioned prune claim in the claude mirror: "sits outside the review target" is enforced by `scopeInsideReviewTarget` only when `reviewTargetType === 'files'`; the shipped default (`spec-fold

### docs:.skilled/commands

- [ ] C1 P2 .skilled/commands/deep/assets/deep-review.yaml:1377 The review pivot gate says "A candidate the pivot accepts re-enters breadth through step_frontier_admit as a frontier_proposal row". No review-pivot code writes that row or any node-store row: `diverg
  fix: A candidate the pivot accepts re-enters breadth through step_frontier_admit as a frontier_proposal row, and the pivot ma -> A candidate the pivot accepts becomes the next review direction through pivot_result.restoredFocus, which the workflow b
- [ ] C3 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:298 The research success display pins the stop reason to `converged|max_iterations|all_answered`. The workflow's frozen stop reason set is `converged`, `maxIterationsReached`, `blockedStop`, `stuckRecover
  fix: Iterations: [N] | Stop reason: [converged|max_iterations|all_answered] -> Iterations: [N] | Stop reason: [converged|maxIterationsReached]
- [ ] L2-1 P2 .skilled/commands/deep/assets/deep-research.yaml:1272 The frontier_gate prose claims the frontier is refilled from a diverging pivot: "Candidates the pivot opens re-enter breadth through step_frontier_admit as frontier_proposal rows." No pivot code write
  fix: Candidates the pivot opens re-enter breadth through step_frontier_admit as frontier_proposal rows. -> A candidate the pivot accepts becomes the next focus through registry.divergence.currentFocus, so the leaf gets no front
- [ ] L3-1 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:384 The review success display pins the displayed stop reason to `converged|max_iterations|all_dimensions_clean`. The workflow emits `reason` from the frozen eight-value STOP_REASONS enum, so the iteratio
  fix: Iterations: [N] | Stop reason: [converged|max_iterations|all_dimensions_clean] -> Iterations: [N] | Stop reason: [converged|maxIterationsReached]
- [ ] L3-2 P2 .skilled/commands/deep/assets/deep-review.yaml:883 The rationale attached to the `expansiveDepth.maxFrontierNodes: null` default claims the derived run cap is what protects the seeded questions. The seed no longer answers to that cap at all: readCaps 
  fix: # Null derives the node cap at admission as half the iteration budget, so seeded questions and the stop gates keep itera -> # Null derives the run cap at admission as half the iteration budget, so frontier growth cannot outrun the run's iterati
- [ ] L4-1 P1 .skilled/commands/deep/review.md:100 The `--depth-mode` row describes the expansive review's stop handling with one sentence, "turns a review stop candidate into another iteration while nodes stay open", and never mentions the `frontier_
- [ ] L2-2 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:47 The PRE-BOUND SETUP ANSWERS schema and the Default Resolution Table omit the `frontier_scope` marker, which fanout-run.cjs writes for an expansive research lineage: line 1852 appends `depth_mode: expa
- [ ] L4-3 P2 .skilled/commands/deep/research.md:107 The `--depth-mode` row enumerates the `expansiveDepth` keys as "`maxDepth` 3, `maxChildrenPerNode` 6, a 50/35/15 iteration budget across depths" and leaves out `maxFrontierNodes`, which the workflow w

### docs:.skilled/skills

- [ ] L8-1 P1 .skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:63 The catalog presents --extend-minutes=M as a flag that on its own reopens a completed run. The code makes it a modifier that is only valid alongside --extend: `.skilled/commands/deep/assets/deep-revie
  fix: The --extend=N and --extend-minutes=M flags on /deep:research and /deep:review reopen a completed single-executor run in -> The --extend=N flag on /deep:research and /deep:review reopens a completed single-executor run in place, and --extend-mi
- [ ] C2 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:36 The Pivot section says the review pivot "seeds from terminal unanswered nodes and routes accepted candidates through admission". The first clause is accurate: exhausted and blocked nodes seed a `front
  fix: It seeds from terminal unanswered nodes and routes accepted candidates through admission. -> It seeds from terminal unanswered nodes, and an accepted candidate becomes the next review direction through restoredFoc
- [ ] L6-5 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md:56 Doc says "Command 2 prints `Tests 1 passed | 33 skipped (34)`" for `stop-decision-yaml-contract.vitest -t "takes the next dimension from the active frontier node"`. The file now holds 50 cases and the
  fix: Command 2 prints `Tests 1 passed | 33 skipped (34)` -> Command 2 prints `Tests 1 passed | 49 skipped (50)`
- [ ] L6-6 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:56 Doc says "Command 2 prints `Tests 1 passed | 33 skipped (34)`" for `stop-decision-yaml-contract.vitest -t "gates the divergent pivot on a terminal review frontier"`. The same file now reports `1 passe
  fix: Command 2 prints `Tests 1 passed | 33 skipped (34)` -> Command 2 prints `Tests 1 passed | 49 skipped (50)`
- [ ] L6-7 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md:57 Doc says "Command 1 prints `Tests 4 passed | 204 skipped (208)`" for the four-case `fanout-run.vitest` filter. The suite now holds 210 cases and the same filtered run reports `4 passed | 206 skipped (
  fix: Command 1 prints `Tests 4 passed | 204 skipped (208)` -> Command 1 prints `Tests 4 passed | 206 skipped (210)`
- [ ] L7-2 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:186 Under "Composite convergence votes `STOP` only after", the doc says "Dimension coverage reaches 100% across the 4-dimension model". The convergence script builds the coverage universe from `config.rev
  fix: Dimension coverage reaches 100% across the 4-dimension model -> Dimension coverage reaches 100% across every configured dimension (the four by default)
- [ ] L7-3 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:142 The `continuedFromRun` field is described as the "Count of completed iteration records", but `step_extend_completed_run` counts every distinct run number among all `type: "iteration"` rows, error and 
  fix: Count of completed iteration records when `--extend=N` reopened a completed run (`completed-continue`). -> Count of distinct iteration runs in the state log, error and timeout rows included, when `--extend=N` reopened a complet
- [ ] L4-2 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:28 The "### Configuration" section claims to say what `expansiveDepth` sets, but lists three of its four keys and omits `maxFrontierNodes`. Both the config template and the workflows write `expansiveDept
  fix: `expansiveDepth` in `deep-research-config.json` sets `maxDepth` to 3, `maxChildrenPerNode` to 6, and a 50/35/15 iteratio -> `expansiveDepth` in `deep-research-config.json` sets `maxDepth` to 3, `maxChildrenPerNode` to 6, a 50/35/15 iteration bu
- [ ] L7-1 P1 .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:52 The Parameters table lists `--severity-threshold` (default `P2`, "Minimum severity to report"), but `/deep:review` has no such flag: it is absent from the Workflow Flag Surface in `.skilled/commands/d
- [ ] L8-2 P1 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:45 The Implementation table lists only mode-registry.json, the two command docs, convergence.cjs and fanout-run.cjs, yet feature-catalog.md:55 says this doc holds "full implementation and validation file
- [ ] L6-1 P1 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md:29 Doc says "The new duration budget is `max(prior, elapsed) + M`", which is only true when `--extend-minutes` is passed. `.skilled/commands/deep/assets/deep-review.yaml:542` computes `const addedMinutes
- [ ] C4 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md:56 Three expected values in this playbook are stale. Command 1 now prints `Tests 1 passed | 24 skipped (25)`, not `1 passed | 22 skipped (23)`; command 2 now prints `Tests 2 passed | 48 skipped (50)`, no
- [ ] L5-1 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:57 The expected vitest summary strings are stale. Command 2 now prints `Tests 7 passed | 20 skipped (27)`, not `7 passed | 17 skipped (24)`; commands 3 and 4 each now print `Tests 1 passed | 26 skipped (
- [ ] L5-2 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md:56 Both expected summaries are stale: the doc states `Tests 1 passed | 50 skipped (51)` for command 1 and again for command 2, but each command now prints `Tests 1 passed | 52 skipped (53)`. deep-researc
- [ ] L5-3 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md:56 The expected summaries are stale. Command 1 now prints `Tests 28 passed | 85 skipped (113)`, not `28 passed | 64 skipped (92)`, and command 2 now prints `Tests 1 passed | 112 skipped (113)`, not `1 pa
- [ ] L5-4 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md:56 The expected summaries are stale. Command 2 now prints `Tests 4 passed | 46 skipped (50)`, not `4 passed | 30 skipped (34)`, and command 3 now prints `Tests 2 passed | 25 skipped (27)`, not `2 passed 
- [ ] L5-5 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md:58 Three of the four expected summaries are stale. Command 1 now prints `Tests 2 passed | 208 skipped (210)`, not `2 passed | 206 skipped (208)`; commands 2 and 3 each now print `Tests 1 passed | 209 ski
- [ ] L5-6 P2 .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:411 The cap list for the expansive mode omits the rule that makes the derived cap compatible with the seed range the next paragraph states. `maxFrontierNodes` derives from `maxIterations` as `Math.max(1, 
- [ ] L6-3 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:57 Four stale expected values in the Expected block. (1) "Command 1 prints `Tests 7 passed | 16 skipped (23)`" — the suite now reports `7 passed | 18 skipped (25)`. (2) "Command 2 prints `Tests 1 passed 
- [ ] L6-4 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md:55 Two stale values. (1) "Command 2 prints one line, 1191, which sets `vetoable`" — the guard `const vetoable = loopType === 'review' || !candidate.hardStop;` is line 1206 of `runtime/scripts/convergence
- [ ] L8-3 P2 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:52 The Validation And Tests table names only the two default-identity playbooks (DR-068, DRV-076), so the "validation file listings" claimed as full omit the scenarios that validate the behavior the flag
- [ ] L8-5 P2 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:53 Both validation rows (52 and 53) summarize the default-identity scenarios as "a default run matches the baseline", with no exception. The scenarios themselves and the code qualify that: a fan-out CLI 
- [ ] L6-2 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md:204 Doc says "A review run with a configured minIterations floor returns CONTINUE with minIterationsNotReached until its iteration count reaches the floor, so a review never stops before the floor." The f

### docs:.pi/agents

- [ ] L1-6 P2 .pi/agents/deep-research.md:294 Same incomplete prune list in the pi mirror: the admission order's sixth check (`cycle`) and the dangling-parent `relevance` prune are missing from a list presented as the reasons a `frontier_proposal
  fix: You only propose. The workflow's admission step decides, and it prunes a row that lacks evidence or scope, repeats a kno -> You only propose. The workflow's admission step decides, and in one fixed order it prunes a row that lacks evidence or s
- [ ] L1-3 P1 .pi/agents/deep-review.md:260 Same unconditioned prune claim in the pi mirror: "sits outside the review target" holds only for a `files` target because `scopeInsideReviewTarget` short-circuits to true for every other target kind, 

### docs:README.md

- [ ] L8-4 P1 README.md:255 The README states unconditionally that "A review can also track custom dimensions beside its four defaults". Two code facts contradict the "beside" reading. First, a named dimension list is a filter, 

### docs:.skilled/agents

- [ ] L1-4 P2 .skilled/agents/deep-research.md:302 The research prune list is written as the complete set of admission outcomes but stops at the budget cap. `frontier-admit.cjs` runs six checks in one fixed order — relevance, dedupe, depth, fan-out, b
  fix: You only propose. The workflow's admission step decides, and it prunes a row that lacks evidence or scope, repeats a kno -> You only propose. The workflow's admission step decides, and in one fixed order it prunes a row that lacks evidence or s
- [ ] L1-1 P1 .skilled/agents/deep-review.md:267 The sentence gives the review admission prune set as complete and unconditional: "it prunes a row that lacks evidence or scope, sits outside the review target, repeats a known node, or would exceed th

## Pre-existing or outside the scope

