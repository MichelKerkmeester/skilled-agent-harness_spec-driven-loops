# Fix plan

Target: topic expansive-depth; head: 65eb3c029d0c2c0a29dcfcc0039d7343692c2d83

## In scope

### docs:.skilled/commands

- [ ] C1 P1 .skilled/commands/deep/assets/deep-review.yaml:1237 The `step_check_convergence` list claims to give the script's fixed order, first match wins, but it jumps from `4a` (the review floor) to `5` (the nine legal-stop gates) and never names the expansive 
  fix: 4a. if iteration_count < min_iterations: CONTINUE (minIterationsNotReached). min_iterations is config.minIterations, els -> 4a. if iteration_count < min_iterations: CONTINUE (minIterationsNotReached). min_iterations is config.minIterations, els
- [ ] L2-3 P1 .skilled/commands/deep/research.md:17 The YAML START CONDITION says to load the YAML only when ALL required inputs are bound, but the list omits `depth_mode` (and `convergence_mode`). The research workflow preflight requires `depth_mode` 
  fix: - `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, `lineage_mo -> - `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `convergence_mode`, `depth
- [ ] L2-2 P1 .skilled/commands/deep/review.md:17 The YAML START CONDITION says to load the YAML only when ALL required inputs are bound, but the list omits `depth_mode` (and `convergence_mode`). The workflow preflight requires `depth_mode` in `requi
  fix: - `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `converg -> - `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `converg
- [ ] L1-1 P1 .skilled/commands/deep/assets/deep-research.yaml:1181 This step claims to list the script's "fixed order, first match wins", but the list omits the expansive frontier veto. convergence.cjs returns CONTINUE with reasonDetail `frontierOpen` when `config.de
  fix: 5. if iteration_count < effective_min_iterations: CONTINUE (minIterationsNotReached) 6. a failed quality guard turns the -> 5. if iteration_count < effective_min_iterations: CONTINUE (minIterationsNotReached) 5a. if depth_mode == "expansive" an
- [ ] L2-4 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:19 The Tier-1 persist shape is incomplete for the config the workflow writes on every run: it lists `antiConvergence.convergenceMode` and the reserved `antiConvergence.divergent` but omits `antiConvergen
  fix: `antiConvergence.convergenceMode`, reserved `antiConvergence.divergent: {}` -> `antiConvergence.convergenceMode`, `antiConvergence.depthMode`, `expansiveDepth.*`, reserved `antiConvergence.divergent:
- [ ] L2-5 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:150 The `:confirm` defaults recap omits `antiConvergence.depthMode`, although the Default Resolution Table sets `depth_mode` to `default` and the runtime writes `antiConvergence.depthMode` into every revi
  fix: antiConvergence.convergenceMode=`default`, antiConvergence.divergent=`{}` -> antiConvergence.convergenceMode=`default`, antiConvergence.depthMode=`default`, antiConvergence.divergent=`{}`
- [ ] L2-1 P1 .skilled/commands/deep/review.md:97 The row tells the reader "A node needs one iteration per configured dimension, so set `--max-iterations` to at least `ceil(nodes / lineages) * dimensions` for the depth-1 band." That minimum funds onl

### docs:.skilled/skills

- [ ] L4-1 P1 .skilled/skills/system-deep-loop/deep-review/SKILL.md:158 The lifecycle-mode list names only `new`, `resume` and `restart`, omitting `completed-continue`, the mode `--extend=N` writes on a completed run. The workflow's `lineage_mode` input accepts `auto|resu
  fix: - **Lifecycle modes:** `new`, `resume`, and `restart`. -> - **Lifecycle modes:** `new`, `resume`, `restart`, and `completed-continue` (set by `--extend=N` on a completed run).
- [ ] C5 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:38 The catalog's Initialization summary says the runtime supports only `new`, `resume` and `restart`, but the same file's Completed-run extension section (line 203) and `deep-research.yaml` (line 68) acc
  fix: and only exposes `new`, `resume`, and `restart` as runtime-supported lineage modes. -> and exposes `new`, `resume`, `restart`, and `completed-continue` (set by `--extend=N`) as runtime-supported lineage mode
- [ ] C6 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md:56 Both expected test counts are stale. Command 1's `frontierOpen veto` filter now matches the research and review describes and runs 28 cases: `Tests 28 passed | 64 skipped (92)`, not `15 passed | 64 sk
  fix: Command 1 prints `Tests 15 passed | 64 skipped (79)`. Those cases include the eight rows of the veto table, each named ` -> Command 1 prints `Tests 28 passed | 64 skipped (92)`. Those cases include the eight research rows and the eight review r
- [ ] C7 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md:58 All four expected counts are stale: command 1 runs `2 passed | 206 skipped (208)` because two round-robin cases now match, commands 2 and 3 each run `1 passed | 207 skipped (208)`, and command 4 runs 
  fix: Command 1 prints `Tests 1 passed | 202 skipped (203)`, with the case `deals open depth-1 nodes round-robin in node-id or -> Command 1 prints `Tests 2 passed | 206 skipped (208)`, with the two round-robin cases passing. Command 2 prints `Tests 1
- [ ] C8 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:57 Command 1 prints 14 lines, not 13. The pattern matches five `relevance` returns, three `dedupe`, one `depth`, two `fanout`, one `budget` and two `cycle` returns; the expected count is one short.
  fix: Command 1 prints 13 lines. -> Command 1 prints 14 lines.
- [ ] C9 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:57 Command 3 prints six lines, not three, because the unrestricted search matches both `research-depth-mode-golden.vitest.ts` and `review-depth-mode-golden.vitest.ts`, each with a comment, a helper defin
  fix: 3. `rg -n 'withoutExpansiveOnlyPersona' .skilled/skills/system-deep-loop/runtime/tests` -> 3. `rg -n --glob 'research-depth-mode-golden.vitest.ts' 'withoutExpansiveOnlyPersona' .skilled/skills/system-deep-loop/r
- [ ] C2 P1 .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:182 The live loop step says `All questions answered? STOP` unconditionally, with no `minIterations` floor and no expansive frontier veto. In `convergence.cjs`, `all_questions_answered` is a soft candidate
- [ ] C3 P1 .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:126 The LIVE ALGORITHM Decision Order block omits the consecutive-failure hard stop, the `minIterations` floor and the `frontierOpen` veto, and places the all-questions candidate (step 2) before stuck det
- [ ] L4-2 P1 .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:174 The Decision Priority section says "Checks are evaluated in this order (first match wins)" but its six-item list omits the two checks this topic adds: the `minIterations` floor, which `buildStopDecisi
- [ ] L4-3 P1 .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:204 The tuning row tells the operator to pass `--dimensions security,correctness`, but `/deep:review` has no `--dimensions` flag. Its Workflow Flag Surface table (review.md:91-108) lists no dimension flag
- [ ] C10 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:28 The budgeting formula underfunds by the band share. `applyReviewFrontierBudget` gives the depth-1 band `budgetSplit.depth1` (0.5) of `maxIterations`, depth 2 0.35 and depth 3 0.15, and closes a band's
- [ ] C4 P2 .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:138 The convergence decision tree says `All questions answered? Yes --> STOP` before stuck detection and never mentions the `minIterations` floor or the expansive `frontierOpen` veto. The code nominates `
- [ ] L4-5 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:34 The packet inventory says the loop uses 9 state files and lists them, but an expansive run also writes `{artifact_dir}/frontier-nodes.jsonl` (frontier-admit.cjs:42, used by seed/admit/close) and reads
- [ ] L4-6 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:141 The config field reference says `continuedFromRun` is set on `resume` and `restart`, but the only non-null writer is `step_extend_completed_run`, which sets it with `lineageMode: completed-continue` (
- [ ] L4-4 P2 .skilled/skills/system-deep-loop/deep-review/README.md:158 The list of checks the frontier veto never outranks omits consecutive failures. `buildStopDecision` returns `STOP` with stop reason `error` once `consecutiveFailureCount` reaches the limit of 3 (conve

### docs:.claude/agents

- [ ] L1-4 P2 .claude/agents/deep-research.md:84 The lifecycle reference names a section that does not exist. The research loop protocol's heading is `### Lifecycle Branch Contract (current release)` (loop-protocol.md:119); there is no `Lifecycle Br
  fix: §Lifecycle Branches`) -> §Lifecycle Branch Contract`)
- [ ] L1-5 P2 .claude/agents/deep-review.md:253 The admission-prune claim is unconditional, but frontier-admit.cjs only narrows a proposal to the review target when `reviewTargetType === 'files'`. For every other target type, including the template
  fix: it prunes a row that lacks evidence or scope, sits outside the review target, repeats a known node, or would exceed the  -> it prunes a row that lacks evidence or scope, sits outside a path-scoped review target (a file list or a commit range), 

### docs:.pi/agents

- [ ] L1-6 P2 .pi/agents/deep-research.md:92 The lifecycle reference names a section that does not exist. The research loop protocol's heading is `### Lifecycle Branch Contract (current release)` (loop-protocol.md:119); there is no `Lifecycle Br
  fix: §Lifecycle Branches`) -> §Lifecycle Branch Contract`)
- [ ] L1-7 P2 .pi/agents/deep-review.md:260 The admission-prune claim is unconditional, but frontier-admit.cjs only narrows a proposal to the review target when `reviewTargetType === 'files'`. For every other target type, including the template
  fix: it prunes a row that lacks evidence or scope, sits outside the review target, repeats a known node, or would exceed the  -> it prunes a row that lacks evidence or scope, sits outside a path-scoped review target (a file list or a commit range), 

### docs:.skilled/agents

- [ ] L1-2 P2 .skilled/agents/deep-research.md:100 The lifecycle reference names a section that does not exist. The research loop protocol's heading is `### Lifecycle Branch Contract (current release)` (loop-protocol.md:119); there is no `Lifecycle Br
  fix: §Lifecycle Branches`) -> §Lifecycle Branch Contract`)
- [ ] L1-3 P2 .skilled/agents/deep-review.md:267 The admission-prune claim is unconditional, but frontier-admit.cjs only narrows a proposal to the review target when `reviewTargetType === 'files'`. For every other target type, including the template
  fix: it prunes a row that lacks evidence or scope, sits outside the review target, repeats a known node, or would exceed the  -> it prunes a row that lacks evidence or scope, sits outside a path-scoped review target (a file list or a commit range), 

## Pre-existing or outside the scope

