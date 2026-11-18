# Fix plan

Target: topic expansive-depth; head: 65eb3c029d0c2c0a29dcfcc0039d7343692c2d83

## In scope

### docs:.skilled/commands

- [ ] C1 P1 .skilled/commands/deep/assets/deep-review.yaml:1244 The review workflow's stop-order list claims to give the whole decision ("the script applies this fixed order, first match wins") but stops at the floor and jumps to the legal-stop gates. convergence.
  fix: 4a. if iteration_count < min_iterations: CONTINUE (minIterationsNotReached). min_iterations is config.minIterations, els -> 4a. if iteration_count < min_iterations: CONTINUE (minIterationsNotReached). min_iterations is config.minIterations, els
- [ ] L2-1 P1 .skilled/commands/deep/assets/deep-research.yaml:1181 The step claims to give the whole stop decision ("The script applies this fixed order, first match wins") but the ordered list omits the frontierOpen stop veto. convergence.cjs returns CONTINUE with r
  fix: 5. if iteration_count < effective_min_iterations: CONTINUE (minIterationsNotReached) 6. a failed quality guard turns the -> 5. if iteration_count < effective_min_iterations: CONTINUE (minIterationsNotReached) 5a. if depth_mode == "expansive" AN
- [ ] C2 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:150 The consolidated prompt's Defaults line enumerates the setup defaults but omits antiConvergence.depthMode, although depth_mode is a required setup field (line 81) mapped to antiConvergence.depthMode (
  fix: antiConvergence.convergenceMode=`default`, antiConvergence.divergent=`{}` -> antiConvergence.convergenceMode=`default`, antiConvergence.depthMode=`default`, antiConvergence.divergent=`{}`
- [ ] C3 P2 .skilled/commands/deep/assets/deep-review.yaml:1319 The gate_results_array_json output says it carries one row per legal-stop gate and then enumerates eight names, dropping p0ResolutionGate, while the same step's item 5 names nine gates including p0Res
  fix: row per legal-stop gate (convergenceGate, dimensionCoverageGate, evidenceDensityGate, hotspotSaturationGate, claimAdjudi -> row per legal-stop gate (convergenceGate, dimensionCoverageGate, p0ResolutionGate, evidenceDensityGate, hotspotSaturatio
- [ ] L2-4 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:135 The consolidated prompt's Defaults line enumerates the setup defaults but omits antiConvergence.depthMode, although depth_mode is a required setup field (line 72) mapped to antiConvergence.depthMode (
  fix: antiConvergence.convergenceMode=`default`, antiConvergence.divergent=`{}` -> antiConvergence.convergenceMode=`default`, antiConvergence.depthMode=`default`, antiConvergence.divergent=`{}`
- [ ] L2-2 P2 .skilled/commands/deep/assets/deep-research.yaml:231 state_paths declares the synthesis snapshot as {artifact_dir}/synthesis-v{generation}.md, but the extension's snapshot step writes {state_paths.packet_dir}/synthesis-v${GENERATION}-r{continued_from_ru
  fix: synthesis_snapshot_pattern: "{artifact_dir}/synthesis-v{generation}.md" -> synthesis_snapshot_pattern: "{artifact_dir}/synthesis-v{generation}-r{continuedFromRun}.md"

### docs:.claude/agents

- [ ] L1-1 P1 .claude/agents/deep-research.md:286 The prune enumeration is presented as the complete set of admission outcomes but omits the sixth check. frontier-admit runs the checks in one fixed order — relevance, dedupe, depth, fan-out, budget, t
  fix: repeats a known question, or would exceed the depth, fan-out or budget caps. -> repeats a known question, would exceed the depth, fan-out or budget caps, or closes a cycle back onto its own ancestry.
- [ ] L1-2 P1 .claude/agents/deep-review.md:253 The prune enumeration is presented as the complete set of admission outcomes but omits the sixth check: frontier-admit runs relevance, dedupe, depth, fan-out, budget and then acyclicity for the review
  fix: repeats a known node, or would exceed the depth, fan-out or budget caps. -> repeats a known node, would exceed the depth, fan-out or budget caps, or closes a cycle back onto its own ancestry.

### docs:.pi/agents

- [ ] L1-3 P1 .pi/agents/deep-research.md:294 Same omission in the pi mirror: the sentence lists evidence/scope, duplicate and the depth, fan-out and budget caps as the reasons a frontier_proposal is pruned, but frontier-admit's sixth check rejec
  fix: repeats a known question, or would exceed the depth, fan-out or budget caps. -> repeats a known question, would exceed the depth, fan-out or budget caps, or closes a cycle back onto its own ancestry.
- [ ] L1-4 P1 .pi/agents/deep-review.md:260 Same omission in the pi mirror of the review leaf contract: the admission step's sixth check (acyclicity, pruning with reason 'cycle') is missing from the list of reasons a frontier_proposal is pruned
  fix: repeats a known node, or would exceed the depth, fan-out or budget caps. -> repeats a known node, would exceed the depth, fan-out or budget caps, or closes a cycle back onto its own ancestry.

### docs:.skilled/agents

- [ ] L1-5 P1 .skilled/agents/deep-research.md:302 The canonical research leaf doc gives the prune list as complete but stops at the budget cap. frontier-admit's fifth and sixth checks are separate: budget is a monotone check against the parent's budg
  fix: repeats a known question, or would exceed the depth, fan-out or budget caps. -> repeats a known question, would exceed the depth, fan-out or budget caps, or closes a cycle back onto its own ancestry.
- [ ] L1-6 P1 .skilled/agents/deep-review.md:267 The canonical review leaf doc gives the prune list as complete but stops at the budget cap, omitting the sixth admission check: frontier-admit closes the ordered checks with checkCycle and records 'cy
  fix: repeats a known node, or would exceed the depth, fan-out or budget caps. -> repeats a known node, would exceed the depth, fan-out or budget caps, or closes a cycle back onto its own ancestry.

### docs:.skilled/skills

- [ ] C4 P2 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:28 The page says only the expansive value reaches the runtime, but both workflows pass `--depth-mode "{depth_mode}"` to convergence.cjs unconditionally and pass the same bound value into the fan-out runn
  fix: Only the value `expansive` reaches the runtime. -> The runtime acts only on the value `expansive`.
- [ ] C5 P2 .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:609 The Locked Fields list names the expansiveDepth caps as runtime contracts the optimizer must not modify, but the canonical registry this section points to locks only antiConvergence.depthMode: optimiz
  fix: - Depth mode (`antiConvergence.depthMode`) and the `expansiveDepth` caps -> - Depth mode (`antiConvergence.depthMode`); the `expansiveDepth` caps are in neither the tunable nor the locked list
- [ ] C6 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md:224 The new pilot note reads as a statement about the shipped root cap: it says the root fan-out cap of 6 pruned a seventh depth-1 node. frontier-admit now sizes the review root at max(maxChildrenPerNode,
  fix: the root fan-out cap of 6 pruned a seventh depth-1 node -> the root fan-out cap of 6, since raised to 8, pruned a seventh depth-1 node

## Pre-existing or outside the scope

