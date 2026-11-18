# Fix plan

Target: topic expansive-depth; head: 7799a67f677576d07a9f1082fb3db8d9b6efbaa4

## In scope

### docs:.skilled/agents

- [x] L1-1 P1 .skilled/agents/deep-research.md:302 The frontier-proposal contract lists the budget prune as an admission outcome ("would exceed the depth, fan-out or budget caps") and constrains the row's optional `budget` to "never above the parent's [handed off]
- [x] L1-4 P1 .skilled/agents/deep-review.md:267 The review leaf's frontier-proposal contract lists the budget prune as an admission outcome ("would exceed the depth, fan-out or budget caps") and constrains the row's optional `budget` to "never abov [handed off]

### docs:.claude/agents

- [x] L1-2 P1 .claude/agents/deep-research.md:286 Same clause in the claude mirror: the frontier-proposal contract lists the budget prune as an admission outcome ("would exceed the depth, fan-out or budget caps") and constrains the row's optional `bu [handed off]
- [x] L1-5 P1 .claude/agents/deep-review.md:253 Same clause in the claude mirror of the review leaf: the budget prune is listed as an admission outcome ("would exceed the depth, fan-out or budget caps") and the row's optional `budget` is constraine [handed off]

### docs:.pi/agents

- [x] L1-3 P1 .pi/agents/deep-research.md:294 Same clause in the pi mirror: the frontier-proposal contract lists the budget prune as an admission outcome ("would exceed the depth, fan-out or budget caps") and constrains the row's optional `budget [handed off]
- [x] L1-6 P1 .pi/agents/deep-review.md:260 Same clause in the pi mirror of the review leaf: the budget prune is listed as an admission outcome ("would exceed the depth, fan-out or budget caps") and the row's optional `budget` is constrained to [handed off]

### docs:.skilled/commands

- [ ] L4-1 P1 .skilled/commands/deep/review.md:105 The `--review-focus` row says the value is cut to one line of at most 1000 characters. Nothing truncates it: the init normalization step fails setup when more than 1000 characters remain after collaps
  fix: It is cut to one line of at most 1000 characters, stored as `reviewFocus` in the config and shown in the review report. -> It is collapsed to one line and fails setup when more than 1000 characters remain; it is stored as `reviewFocus` in the 
- [ ] L2-1 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:19 The persisted-config shape names the topic field `researchTopic`, but the config field the workflow writes and every consumer reads is `topic`. `research_topic` is only the setup binding; `researchTop
  fix: `researchTopic`, `specFolder` -> `topic`, `specFolder`
- [ ] L3-2 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:72 The Default Resolution Table resolves `review_dimensions` from `flag `--dims` if supported by caller`. No caller supports it: the token occurs nowhere under `.skilled/commands` or `.skilled/skills/sys
  fix: flag `--dims` if supported by caller, marker `review_dimensions`, or default -> marker `review_dimensions`, or default
- [ ] L3-1 P1 .skilled/commands/deep/assets/deep-review-presentation.txt:224 The compact reply example passes the dimension list as `correctness security` (space-separated), which the documented init normalization cannot split: `step_normalize_review_dimensions` in deep-review
- [ ] L2-2 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:300 The success template presents three values as the stop-reason set. The runtime's frozen set is eight (`STOP_REASONS`: converged, maxIterationsReached, blockedStop, manualStop, error, stuckRecovery, us
- [ ] L4-2 P2 .skilled/commands/deep/review.md:100 The row says node status is kept in `review/frontier-nodes.jsonl`, and the same sentence then relies on nodes being answered. The store only holds the statuses its writer writes: `pruned` from the see
- [ ] L4-3 P2 .skilled/commands/deep/review.md:100 The closed list of gates the frontier veto never outranks leaves out two the code applies before it: the anti-convergence min-iterations floor, which returns CONTINUE with reason `minIterationsNotReac

### docs:.skilled/skills

- [x] L6-1 P1 .skilled/skills/system-deep-loop/deep-research/SKILL.md:93 The doc tells the operator that at the default iteration budget the run never grows past the seed: "At the default budget of 10 an expansive run works its seeds only; raise `--max-iterations`, as the  [handed off]
  fix: At the default budget of 10 an expansive run works its seeds only; raise `--max-iterations`, as the pilots did at 16, to -> At the default budget of 10 the run-wide cap is 5 live nodes, so a seed of 5 or 6 works its seeds only while a 3- or 4-n
- [ ] L7-1 P1 .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:48 The --depth-mode row says expansive "stops on `frontier_drained` once every node is closed". convergence.cjs forms that candidate only when the projected frontier holds nodes, none open or active, AND
  fix: and stops on `frontier_drained` once every node is closed -> and forms the `frontier_drained` stop candidate once no node is open or active and at least one was answered
- [x] L5-1 P2 .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:68 The doc states an unconditional budget rule: "At the default budget of 10 an expansive run works its seeds only". The admission code does not work that way. `readCaps` derives `maxFrontierNodes = max( [handed off]
  fix: At the default budget of 10 an expansive run works its seeds only; raise `--max-iterations`, as the pilots did at 16, to -> At the default budget of 10 the run cap is 5 live nodes, so a 5- or 6-node seed fills it and a 3- or 4-node seed still a
- [x] L5-2 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:21 Same budget claim as L5-1, stated here as the operator guidance that makes the flag usable: "At the default budget of 10 an expansive run works its seeds only". The admission run cap is half the itera [handed off]
  fix: At the default budget of 10 an expansive run works its seeds only; raise `--max-iterations`, as the pilots did at 16, to -> At the default budget of 10 the run cap is 5 live nodes, so a 5- or 6-node seed fills it and a 3- or 4-node seed still a
- [ ] L5-3 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:57 The doc tells the operator that the verify command prints 14 lines: "Command 1 prints 14 lines." The command is `rg -n "return '(relevance|dedupe|depth|fanout|budget|cycle)'" .skilled/skills/system-de
  fix: Command 1 prints 14 lines. -> Command 1 prints 15 lines.
- [ ] L5-4 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md:31 The scenario contract says "Two YAML contract cases pass", but the verify filter matches four cases and the doc's own Commands/Expected section below says `Tests 4 passed`. `npx vitest run stop-decisi
  fix: Two YAML contract cases pass. -> Four YAML contract cases pass, two research and two review.
- [ ] L7-3 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:469 "A node needs one iteration per configured dimension" understates the node universe. reduce-state.cjs buildDimensionUniverse starts from the four canonical dimensions and appends the configured ones, 
  fix: A node needs one iteration per configured dimension, so 50% of each lineage's `maxIterations` should reach `ceil(nodes / -> A node needs one iteration per dimension in its universe, the four canonical dimensions plus any custom name, so 50% of 
- [ ] L7-4 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:38 The mutability row (and section 2's "Created during initialization. Not modified after creation.") records one post-init config write, the terminal `status: complete` flip. `--extend=N` rewrites the s
  fix: Immutable after init, except the terminal `status: complete` flip -> Immutable after init, except the terminal `status: complete` flip and the `--extend=N` rewrite of `maxIterations`, `maxD
- [ ] L7-5 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md:15 The scenario says the run "names `performance` next to the four canonical dimensions". Neither the case the doc invokes nor the doc's own prompt does that: review-depth-convergence.vitest.ts writes `r
  fix: names `performance` next to the four canonical dimensions -> is configured with `correctness` and `performance`
- [x] L8-1 P1 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:16 The new sentence says admission caps the live frontier at half of `maxIterations` "and the seed counts toward that cap, so at the default budgets an expansive run works its seeds only". The code exemp [handed off]
- [ ] L7-2 P1 .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:105 The Expansive Depth Mode section lists `budgetSplit` 0.5/0.35/0.15 as one of the caps but never says what a spent band does to the nodes in it. reduce-state.cjs applyReviewFrontierBudget closes every 
- [x] L6-2 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:21 The budget rule is stated as "Admission caps the live frontier at half of `maxIterations`, and the seed counts toward that cap", which reads as if the depth-1 seed is subject to the run-wide cap. The  [handed off]

## Pre-existing or outside the scope

