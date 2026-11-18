# Fix plan

Target: topic expansive-depth; head: 6675f479b647233d4737e2bee384a2a2d84e2b50

## In scope

### docs:.skilled/commands

- [ ] L3-2 P1 .skilled/commands/deep/assets/deep-review.yaml:576 step_extend_completed_run derives the extension warning from config.antiConvergence.stopPolicy, but nothing in this workflow ever writes that key: step_create_config populates the top-level stopPolicy
  fix: const stopPolicy = config.antiConvergence && config.antiConvergence.stopPolicy || "convergence"; -> const stopPolicy = config.stopPolicy === "max-iterations" ? "max-iterations" : "convergence";
- [ ] L3-3 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:42 The PRE-BOUND SETUP ANSWERS sample shows maxIterations: 10, which is the deep-research default. The review default is 7, as this same file states in the Default Resolution Table (line 78), the consoli
  fix: maxIterations: 10 -> maxIterations: 7
- [ ] N1 P1 .skilled/commands/deep/assets/deep-research.yaml:1174 `step_check_convergence` presents its numbered list as the script's complete order ('The script applies this fixed order, first match wins'), but the list stops at the `minIterations` floor (item 5) a
- [ ] L3-1 P1 .skilled/commands/deep/assets/deep-review.yaml:1237 step_check_convergence promises the script's complete order ('The script applies this fixed order, first match wins') and runs its list 1, 1a, 2, 3, 3a, 4, 4a, 5, 6. convergence.cjs executes one more 
- [ ] L3-4 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:19 Tier 1 says it persists deep-review-config.json with the given 'shape', and the list carries antiConvergence.convergenceMode and even the reserved antiConvergence.divergent, but omits antiConvergence.
- [ ] L3-5 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:31 The marker block is presented as the complete field set of the PRE-BOUND SETUP ANSWERS block, and it lists the other internal fan-out field (config.fanout_lineage_artifact_dir, line 90 and line 138) b
- [ ] L3-6 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:432 'Each dimension can be individually included or excluded' holds only for the strategy dimension queue and the stop gate (which read config.reviewDimensions). Under --depth-mode=expansive the reducer b

### docs:.claude/agents

- [ ] L1-1 P2 .claude/agents/deep-research.md:84 The pointer to the research loop protocol names a section that does not exist. deep-research/references/protocol/loop-protocol.md has only `### Lifecycle Branch Contract (current release)`, and the re
  fix: §Lifecycle Branches -> §Lifecycle Branch Contract (current release)
- [ ] L1-2 P2 .claude/agents/deep-research.md:286 The prune list omits two admission checks the code runs. frontier-admit.cjs runs six checks in one fixed order and the sixth is `cycle`; it also prunes as `relevance` a proposal whose `parentId` the n
  fix: You only propose. The workflow's admission step decides, and it prunes a row that lacks evidence or scope, repeats a kno -> You only propose. The workflow's admission step decides, and in one fixed order it prunes a row that lacks evidence or s
- [ ] L1-3 P1 .claude/agents/deep-review.md:253 The doc tells the review leaf that admission prunes a proposal that `sits outside the review target`, stated unconditionally. The code enforces that containment only when the review config's `reviewTa
- [ ] L1-4 P2 .claude/agents/deep-review.md:329 The Custom row says a configured custom dimension `is not required for severity coverage` but never says it still joins the coverage universe. `buildDimensionUniverse` appends every configured non-can

### docs:.pi/agents

- [ ] L1-5 P2 .pi/agents/deep-research.md:92 The pointer to the research loop protocol names a section that does not exist. deep-research/references/protocol/loop-protocol.md has only `### Lifecycle Branch Contract (current release)`, and the re
  fix: §Lifecycle Branches -> §Lifecycle Branch Contract (current release)
- [ ] L1-6 P2 .pi/agents/deep-research.md:294 The prune list omits two admission checks the code runs. frontier-admit.cjs runs six checks in one fixed order and the sixth is `cycle`; it also prunes as `relevance` a proposal whose `parentId` the n
  fix: You only propose. The workflow's admission step decides, and it prunes a row that lacks evidence or scope, repeats a kno -> You only propose. The workflow's admission step decides, and in one fixed order it prunes a row that lacks evidence or s
- [ ] L1-7 P1 .pi/agents/deep-review.md:260 The doc tells the review leaf that admission prunes a proposal that `sits outside the review target`, stated unconditionally. The code enforces that containment only when the review config's `reviewTa
- [ ] L1-8 P2 .pi/agents/deep-review.md:336 The Custom row says a configured custom dimension `is not required for severity coverage` but never says it still joins the coverage universe. `buildDimensionUniverse` appends every configured non-can

### docs:.skilled/agents

- [ ] L1-10 P2 .skilled/agents/deep-research.md:302 The prune list omits two admission checks the code runs. frontier-admit.cjs runs six checks in one fixed order and the sixth is `cycle`; it also prunes as `relevance` a proposal whose `parentId` the n
  fix: You only propose. The workflow's admission step decides, and it prunes a row that lacks evidence or scope, repeats a kno -> You only propose. The workflow's admission step decides, and in one fixed order it prunes a row that lacks evidence or s
- [ ] L1-9 P2 .skilled/agents/deep-research.md:100 The pointer to the research loop protocol names a section that does not exist. deep-research/references/protocol/loop-protocol.md has only `### Lifecycle Branch Contract (current release)`, and the re
  fix: §Lifecycle Branches -> §Lifecycle Branch Contract (current release)
- [ ] L1-11 P1 .skilled/agents/deep-review.md:267 The doc tells the review leaf that admission prunes a proposal that `sits outside the review target`, stated unconditionally. The code enforces that containment only when the review config's `reviewTa
- [ ] L1-12 P2 .skilled/agents/deep-review.md:343 The Custom row says a configured custom dimension `is not required for severity coverage` but never says it still joins the coverage universe. `buildDimensionUniverse` appends every configured non-can

### docs:.skilled/skills

- [ ] L6-2 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:53 The source table credits frontier-admit.cjs with admitting "open searchDebt entries". frontier-admit.cjs never mentions searchDebt (rg exits 1); it writes only frontier-nodes.jsonl and, for research, 
  fix: Admits review proposals as node-store rows and open `searchDebt` entries. -> Admits review proposals as node-store rows; the reducer files the nodes it leaves open as `searchDebt`.
- [ ] N2 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:24 The review feature page says admission applies 'depth, fan-out, budget, dedupe and cycle caps', naming five checks and omitting `relevance`, which the code runs first. `checkProposal` prunes as `relev
  fix: Leaf `frontier_proposal` rows are admitted under depth, fan-out, budget, dedupe and cycle caps. -> Leaf `frontier_proposal` rows are admitted under relevance, dedupe, depth, fan-out, budget and cycle checks, in that ord
- [ ] N3 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:57 The Expected section says command 1 (`rg -n -- '--depth-mode' .skilled/commands/deep/research.md`) prints one flag row. It prints two lines: the preflight binding note at research.md:41 ('`depth_mode`
  fix: Command 1 prints one flag row. -> Command 1 prints two lines: the preflight `depth_mode` binding note and the flag row.
- [ ] N4 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md:31 The scenario makes 'exactly three new iteration files' a pass condition (also line 27 'adds exactly three iterations' and line 63 'exactly three new iterations'), but `--extend=N` only raises `maxIter

## Pre-existing or outside the scope

