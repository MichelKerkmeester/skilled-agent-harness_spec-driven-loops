# Alignment report: topic expansive-depth

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic expansive-depth`
- Commits: `65eb3c029d0c2c0a29dcfcc0039d7343692c2d83` to `65eb3c029d0c2c0a29dcfcc0039d7343692c2d83`, 0 first-parent commits
- Files: 67, of which 0 uncommitted or untracked
- Owners: 6
- Findings: 15 (P0 0, P1 8, P2 7), 15 literal, 0 inferred, 0 outside the scope; 13 more overturned by the critic and not counted
- Lanes: L1, L2, L5, L8
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 67 | lens only |
| D2 | Topic checks pass | yes | 0 | 2 |

## Battery

pass 2, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-contract-drift` | 0 | 52 |
| pass | P1 | no | `D2-doc-facts` | 0 | 304 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **C1** P1 literal `.skilled/commands/deep/assets/deep-review.yaml:1244`: The review workflow's stop-order list claims to give the whole decision ("the script applies this fixed order, first match wins") but stops at the floor and jumps to the legal-stop gates. convergence.cjs applies the frontierOpen veto to every review candidate after minIterations and before the gates (lines 1192-1196), and because a review clean candidate is a hard stop that veto is the one that ma...
  - Evidence: `rg -n "frontierOpen|4a\. if iteration_count|5\. the nine legal-stop gates" .skilled/commands/deep/assets/deep-review.yaml .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: ...ansive' the pivot is eligible only once registry.frontier holds no open or active node. The frontierOpen stop veto already returns CONTINUE while one is open ..." .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1196: return emit('CONTINUE', null, 'frontierOpen', gatesAt(false), []);
- **L1-1** P1 literal `.claude/agents/deep-research.md:286`: The prune enumeration is presented as the complete set of admission outcomes but omits the sixth check. frontier-admit runs the checks in one fixed order — relevance, dedupe, depth, fan-out, budget, then acyclicity — and returns 'cycle' when the parent chain loops, so a proposal that closes onto an ancestor is pruned instead of reaching the inbox. The research workflow's own admission step names a...
  - Evidence: `rg -n "// [1-6]\. (relevance|dedupe|depth|fan-out|budget|cycle)|return checkCycle|helper runs the six" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs .skilled/commands/deep/assets...` exit 0: ...kCycle(proposal.parentId, nodes, caps); .skilled/commands/deep/assets/deep-research.yaml:1826: The helper runs the six admission checks in order (relevance, dedupe, depth, .skilled/commands/deep/assets/deep-review.yaml:1988: duplicate. An absent registry gives an empty array. The helper runs the six
- **C2** P2 literal `.skilled/commands/deep/assets/deep-review-presentation.txt:150`: The consolidated prompt's Defaults line enumerates the setup defaults but omits antiConvergence.depthMode, although depth_mode is a required setup field (line 81) mapped to antiConvergence.depthMode (lines 123 and 164) and the review config template defaults it to "default". The sibling research contract had the same omission and is recorded as a finding; this is the review mirror no lane filed, s...
  - Evidence: `rg -n "Defaults:|depthMode" .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` exit 0: ... |-- --depth-mode=default|expansive -> antiConvergence.depthMode = value .skilled/commands/deep/assets/deep-review-presentation.txt:150: +-- Defaults: maxIterations=7, convergenceThreshold=0.10, antiConvergence.convergenceMode=`default`, antiConvergence.divergent=`{}`, stop_policy=`convergence`, ...
- **C3** P2 literal `.skilled/commands/deep/assets/deep-review.yaml:1319`: The gate_results_array_json output says it carries one row per legal-stop gate and then enumerates eight names, dropping p0ResolutionGate, while the same step's item 5 names nine gates including p0ResolutionGate and the blocked_stop contract in references/convergence/convergence.md says the full 9-gate set is load-bearing and read verbatim by the reducer. A producer following this output spec pers...
  - Evidence: `rg -n "nine legal-stop gates|gate_results_array_json:" .skilled/commands/deep/assets/deep-review.yaml` exit 0: ...ionCoverageGate, evidenceDensityGate, hotspotSaturationGate, claimAdjudicationGate, fixCompletenessReplayGate, candidateCoverageGate, graphlessFallbackGate), with at least one fail row when decision == BLOCKED" 1372: fail_closed: "... The nine legal-stop gates have already run and remain unchanged."
- **C4** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:28`: The page says only the expansive value reaches the runtime, but both workflows pass `--depth-mode "{depth_mode}"` to convergence.cjs unconditionally and pass the same bound value into the fan-out runner, and normalizeDepthMode accepts `default` as a value. The explicit-default golden variant carries depthMode 'default' into both the config and the convergence args. A lane fixed the identical sente...
  - Evidence: `rg -n -- "--depth-mode" .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/d...` exit 0: ...ts/convergence.cjs ... --depth-mode "{depth_mode}" ...' .skilled/commands/deep/assets/deep-review.yaml:384: --depth-mode {depth_mode} .skilled/commands/deep/assets/deep-review.yaml:1204: bash: 'node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs ... --depth-mode "{depth_mode}" ...'
- **C5** P2 literal `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:609`: The Locked Fields list names the expansiveDepth caps as runtime contracts the optimizer must not modify, but the canonical registry this section points to locks only antiConvergence.depthMode: optimizer-manifest.json's lockedFields and its invariant group carry no expansiveDepth.* path, and both config templates' _optimizerManaged.lockedFields omit the caps too. The same file's Expansive Depth Mod...
  - Evidence: `rg -n "Depth mode|expansiveDepth|lockedFields" .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md .skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manife...` exit 0: ...w/references/convergence/convergence.md:609:- Depth mode (`antiConvergence.depthMode`) and the `expansiveDepth` caps .skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json:128: "lockedFields": ["antiConvergence.convergenceMode", "convergenceMode", "antiConvergence.depthMode"],
- **C6** P2 literal `.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md:224`: The new pilot note reads as a statement about the shipped root cap: it says the root fan-out cap of 6 pruned a seventh depth-1 node. frontier-admit now sizes the review root at max(maxChildrenPerNode, ROOT_CHILDREN_FLOOR.review), which is 8, and frontier-admit-review.vitest asserts a review seed admits up to eight depth-1 sub-targets. The note records a defect the same release fixed, without sayin...
  - Evidence: `rg -n "root fan-out cap|ROOT_CHILDREN_FLOOR" .skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs .skille...` exit 0: ...oop/runtime/scripts/frontier-admit.cjs:60:const ROOT_CHILDREN_FLOOR = Object.freeze({ research: 6, review: 8 }); .skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts:384: it('seeds up to eight depth-1 review sub-targets, the top of the documented 3 to 8 range', () => {
- **L2-4** P2 literal `.skilled/commands/deep/assets/deep-research-presentation.txt:135`: The consolidated prompt's Defaults line enumerates the setup defaults but omits antiConvergence.depthMode, although depth_mode is a required setup field (line 72) mapped to antiConvergence.depthMode (lines 112 and 149) and the config template defaults it to "default" (deep-research-config.json:8). The Tier-1 persist shape at line 19 likewise omits the key, so the setup contract never states what t...
  - Evidence: `rg -n 'Defaults:|depthMode": "default"|antiConvergence.depthMode' .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/skills/system-deep-loop/deep-research/assets/deep-research-confi...` exit 0: ...ergence.convergenceMode=`default`, antiConvergence.divergent=`{}`, lineage_mode=`auto`, config.executor.kind=`native`, config.executor.timeoutSeconds=900, config.resource_map.emit=`true` .skilled/commands/deep/assets/deep-research-presentation.txt:149: - `--depth-mode` -> `antiConvergence.depthMode`

### D2 Topic checks pass

- **L1-2** P1 literal `.claude/agents/deep-review.md:253`: The prune enumeration is presented as the complete set of admission outcomes but omits the sixth check: frontier-admit runs relevance, dedupe, depth, fan-out, budget and then acyclicity for the review target too, pruning with reason 'cycle' when the parent chain loops. The review workflow's own admission step states it runs the six checks in order, so a leaf reading this sentence believes a cyclin...
  - Evidence: `rg -n "// [1-6]\. (relevance|dedupe|depth|fan-out|budget|cycle)|return checkCycle|helper runs the six" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs .skilled/commands/deep/assets...` exit 0: ...kCycle(proposal.parentId, nodes, caps); .skilled/commands/deep/assets/deep-research.yaml:1826: The helper runs the six admission checks in order (relevance, dedupe, depth, .skilled/commands/deep/assets/deep-review.yaml:1988: duplicate. An absent registry gives an empty array. The helper runs the six
- **L2-1** P1 literal `.skilled/commands/deep/assets/deep-research.yaml:1181`: The step claims to give the whole stop decision ("The script applies this fixed order, first match wins") but the ordered list omits the frontierOpen stop veto. convergence.cjs returns CONTINUE with reasonDetail 'frontierOpen' after the minIterations floor (line 1181) and before the quality-guard check (line 1204) whenever config.depthMode is 'expansive' and the research facts report an open or ac...
  - Evidence: `rg -n "minIterationsNotReached|depthMode === 'expansive'|frontierOpen'|qualityGuardFailed" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: ...imensions_clean, 1181: return emit('CONTINUE', null, 'minIterationsNotReached', gatesAt(false), []); 1192: if (config.depthMode === 'expansive' 1196: return emit('CONTINUE', null, 'frontierOpen', gatesAt(false), []); 1204: return emit('CONTINUE', null, 'qualityGuardFailed', evaluated, failedGuards);
- **L2-2** P2 literal `.skilled/commands/deep/assets/deep-research.yaml:231`: state_paths declares the synthesis snapshot as {artifact_dir}/synthesis-v{generation}.md, but the extension's snapshot step writes {state_paths.packet_dir}/synthesis-v${GENERATION}-r{continued_from_run}.md (line 582), and the synthesis note at line 2093 and the protocol reference both name synthesis-v{generation}-r{continuedFromRun}.md. No step writes the declared path, so a reader following the s...
  - Evidence: `rg -n "synthesis_snapshot_pattern|SNAPSHOT=" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 231: synthesis_snapshot_pattern: "{artifact_dir}/synthesis-v{generation}.md" 582: SNAPSHOT="{state_paths.packet_dir}/synthesis-v${GENERATION}-r{continued_from_run}.md"

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **L5-1** P1 literal `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md:27`: The doc says a completed-run extension "raises `maxIterations` by N". The extension step does not add N to the prior cap: it sets `maxIterations` to `continuedFromRun + N`, where `continuedFromRun` is the number of distinct iteration numbers in the state log. A run that stopped early at 7 of 10 and is extended by 3 ends at 10, not 13, and the new cap can even fall below the prior `maxIterations`. ... [D2, L5]
  - Evidence: `rg -n "newMaxIterations" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 520: const newMaxIterations = continuedFromRun + addedIterations; 536: newMaxIterations, 546: maxIterations: newMaxIterations,
  - Critic override: refuted, lane severity P1. Already applied in the working tree. initialization.md:27 now reads 'sets `maxIterations` to the iterations run so far plus N', which matches the extension step's `continuedFromRun + addedIterations` (deep-research.yaml:520). The old string no longer occurs.
- **L2-3** P2 judgment `.skilled/commands/deep/assets/deep-research-presentation.txt:208`: The step says "Parse response and store ALL results", but its binding list carries depth_mode and neither extend nor extend_minutes, which are the two values the extension step consumes (deep-research.yaml:563 passes "{extend}" "{extend_minutes}"), and the sibling deep-review-presentation.txt list carries lineage_mode and extend. The Phase Output list at line 222 also omits both, so a :confirm set... [D1, L2]
  - Evidence: `rg -n "store ALL results|depth_mode = |\{extend\}|\{extend_minutes\}" .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-research.yaml` exit 0: ...or default `default`; one of `default`, `expansive`] .skilled/commands/deep/assets/deep-research.yaml:563: ' "{state_paths.config}" "{state_paths.state_log}" "{state_paths.packet_dir}/inbox.jsonl" "{extend}" "{extend_minutes}" "$WORK_DIR" > "$WORK_DIR/result.json" || { rm -rf "$WORK_DIR"; exit 2; }'
  - Critic override: refuted, lane severity P2. The binding exists in the same consolidated prompt at step 3: deep-research-presentation.txt:116 binds `--extend=N -> extend = N, lineage_mode = completed-continue` and :117 binds `--extend-minutes=M -> extend_minutes = M`, which are the values the extension step consumes. Step 8 enumerates the answers to Q0-Q3/Q-Exec, so no extension flag reaches the YAML unbound and the Phase Output omission is ...
- **L8-1** P2 literal `README.md:255`: The summary presents `--extend=N` as adding N passes to any finished run, with no fan-out restriction. Both workflows refuse the flag when the config carries fan-out executors: `step_reject_extend_with_fanout` in deep-research.yaml (331-340) and deep-review.yaml (308-317) halts with a usage error before any lineage spawns, and both presentation contracts and both packet catalogs state "refused wit... [D1, L8]
  - Evidence: `rg -n "Refuse --extend on a fan-out|extend-with-fanout|refused with fan-out" .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml .skilled/commands/deep/asse...` exit 0: ...ion: "Refuse --extend on a fan-out config before any lineage spawns" .skilled/commands/deep/assets/deep-review.yaml:317: message: "Usage error (extend-with-fanout): --extend extends a single-executor review run only. This config has fanout executors, so nothing was spawned and the run is unchanged."
  - Critic override: refuted, lane severity P2. Already applied. README.md:255 now reads '`--extend=N` adds N passes to a finished single-executor run in the same session.'
- **L8-2** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:51`: The entry says only the expansive value reaches the runtime. The explicit default reaches it too: both workflows write `antiConvergence.depthMode: "{depth_mode}"` into the config and pass `--depth-mode "{depth_mode}"` to convergence.cjs and fanout-run.cjs, and the default-identity golden test carries a variant named "explicit --depth-mode=default" with `depthMode: 'default'` in both the config and... [D1, L8]
  - Evidence: `rg -n "explicit --depth-mode=default|depthMode: 'default'|antiConvergence.depthMode" .skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts .skilled/commands/deep/ass...` exit 0: ...esearch-depth-mode-golden.vitest.ts:78: convergenceArgs: { convergenceMode: 'default', depthMode: 'default' }, .skilled/commands/deep/assets/deep-research.yaml:725: antiConvergence.depthMode: "{depth_mode}" .skilled/commands/deep/assets/deep-review.yaml:878: antiConvergence.depthMode: "{depth_mode}"
  - Critic override: refuted, lane severity P2. Already applied. system-deep-loop/feature-catalog/feature-catalog.md:51 now reads '`mode-registry.json` has no depth field, and the runtime acts only on the expansive value.' The identical claim in depth-mode-flag.md:28 was not fixed and is filed as C4.
- **L5-5** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md:100`: The scenario claims no feature-catalog entry covers the frontier focus branch, but `feature-catalog/convergence/expansive-depth-mode.md` documents it in its "Stop And Next Focus" section ("Next Focus steers to the shallowest open node"). The statement is stale. [D10, L5]
  - Evidence: `rg -n "expansive-depth-mode" .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` exit 0: 475:See [`convergence/expansive-depth-mode.md`](../feature-catalog/convergence/expansive-depth-mode.md) for full implementation and validation file listings.
  - Critic override: refuted, lane severity P2. Already applied. frontier-focus-picks-shallowest-open-node.md:100 now cites expansive-depth-mode.md's Stop And Next Focus section.
- **L5-9** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md:56`: The expected summaries for both `deep-research-reduce-state.vitest` commands assume 49 tests in the file. The file registers 51 tests, so the reported lines are `1 passed | 50 skipped (51)`, not `1 passed | 48 skipped (49)`. [D10, L5]
  - Evidence: `rg -c "^\s*it\(" .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` exit 0: 51
  - Critic override: refuted, lane severity P2. Already applied. frontier-focus-picks-shallowest-open-node.md:56 now prints `Tests 1 passed | 50 skipped (51)` for both commands, matching the 51 `it(` registrations in deep-research-reduce-state.vitest.
- **L5-10** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:232`: The DR-069 summary says two YAML contract cases pass. The seeded command `stop-decision-yaml-contract.vitest -t "seeds"` matches four cases, because the file carries both the research and the review seed-order cases. Repeating the count as two here propagates the stale expectation from the scenario file. [D11, L5]
  - Evidence: `rg -n "it\('seeds" .skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts` exit 0: ...69: it('seeds the frontier before fan-out spawns', () => { 178: it('seeds the single-executor frontier right after the config exists', () => { 248: it('seeds the review frontier before fan-out spawns', () => { 257: it('seeds the single-executor review frontier right after the config exists', () => {
  - Critic override: refuted, lane severity P2. Already applied. manual-testing-playbook.md:232 now reads 'four YAML contract cases pass (two research, two review) and two admission cases pass', matching the four `seeds` cases at stop-decision-yaml-contract.vitest:169,178,248,257.
- **L5-6** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md:100`: The scenario claims no feature-catalog entry covers the frontier veto, but `feature-catalog/convergence/expansive-depth-mode.md` documents the veto in its "Stop And Next Focus" section and cites DR-072 as its manual playbook. The statement is stale. [D4, L5]
  - Evidence: `rg -n "expansive-depth-mode" .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` exit 0: 475:See [`convergence/expansive-depth-mode.md`](../feature-catalog/convergence/expansive-depth-mode.md) for full implementation and validation file listings.
  - Critic override: refuted, lane severity P2. Already applied. frontier-open-veto-holds-soft-stop.md:100 now cites expansive-depth-mode.md's Stop And Next Focus section.
- **L5-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:103`: The scenario claims no feature-catalog entry covers the expansive depth mode, but `feature-catalog/convergence/expansive-depth-mode.md` exists, is indexed in feature-catalog.md, and even cites DR-068 as its manual playbook. The statement is stale. [D5, L5]
  - Evidence: `rg -n "expansive-depth-mode" .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` exit 0: 475:See [`convergence/expansive-depth-mode.md`](../feature-catalog/convergence/expansive-depth-mode.md) for full implementation and validation file listings.
  - Critic override: refuted, lane severity P2. Already applied. expansive-depth-flag-and-default-identity.md:103 now reads 'Feature catalog status: `feature-catalog/convergence/expansive-depth-mode.md` covers the expansive depth mode.'
- **L5-7** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md:103`: The scenario claims no feature-catalog entry covers the fan-out frontier partition, but `feature-catalog/convergence/expansive-depth-mode.md` has a "Fan-Out" section that names the partition in fanout-run.cjs and the merge guard in fanout-merge.cjs. The statement is stale. [D7, L5]
  - Evidence: `rg -n "expansive-depth-mode" .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` exit 0: 475:See [`convergence/expansive-depth-mode.md`](../feature-catalog/convergence/expansive-depth-mode.md) for full implementation and validation file listings.
  - Critic override: refuted, lane severity P2. Already applied. fanout-frontier-partition-round-robin.md:103 now cites expansive-depth-mode.md's Fan-Out section.
- **L5-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md:101`: The scenario claims no feature-catalog entry covers the expansive seed step, but `feature-catalog/convergence/expansive-depth-mode.md` documents seeding in its "Seeding And Admission" section and lists the seed paths among its source files. The statement is stale. [D8, L5]
  - Evidence: `rg -n "expansive-depth-mode" .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` exit 0: 475:See [`convergence/expansive-depth-mode.md`](../feature-catalog/convergence/expansive-depth-mode.md) for full implementation and validation file listings.
  - Critic override: refuted, lane severity P2. Already applied. expansive-seed-writes-depth-one-nodes.md:101 now cites expansive-depth-mode.md's Seeding And Admission section.
- **L5-8** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md:56`: The expected summary for `vitest run stop-decision-yaml-contract.vitest -t "seeds"` is stale. The filter matches four seed cases, not two: the file also holds the two review seed cases, and the suite totals 35 tests (six cases under `describe.each` over the two workflow YAMLs, plus 23 others), not 22. The operator would see `4 passed | 31 skipped (35)` and mark a correct run FAIL. [D8, L5]
  - Evidence: `rg -n "it\('seeds" .skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts` exit 0: ...69: it('seeds the frontier before fan-out spawns', () => { 178: it('seeds the single-executor frontier right after the config exists', () => { 248: it('seeds the review frontier before fan-out spawns', () => { 257: it('seeds the single-executor review frontier right after the config exists', () => {
  - Critic override: refuted, lane severity P2. Already applied, and the lane's total was wrong. stop-decision-yaml-contract.vitest registers 34 tests (research 5 + review 6 under describe.each over the two YAMLs, plus 4+5+7+7 in the four later describes), so the correct summary is `4 passed | 30 skipped (34)`, which the scenario now states. The lane's proposed `31 skipped (35)` would have introduced a false total.
- **L5-4** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:100`: The scenario claims no feature-catalog entry covers the expansive admission step, but `feature-catalog/convergence/expansive-depth-mode.md` documents admission (the six caps and the recorded prune reason) in its "Seeding And Admission" section. The statement is stale. [D9, L5]
  - Evidence: `rg -n "expansive-depth-mode" .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` exit 0: 475:See [`convergence/expansive-depth-mode.md`](../feature-catalog/convergence/expansive-depth-mode.md) for full implementation and validation file listings.
  - Critic override: refuted, lane severity P2. Already applied. frontier-admission-prunes-with-reasons.md:100 now cites expansive-depth-mode.md's Seeding And Admission section.

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/70materia/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/anacuna/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/base44/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/elementor/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/flatfile/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/speakeasy/DESIGN.md`
- `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/anti-convergence-floor.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md`
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md`
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md`
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md`
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md`
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/cross-mode-anti-convergence-contract.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md`
- `.skilled/skills/system-deep-loop/deep-review/README.md`
- `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md`
- `.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md`
- `.skilled/skills/system-deep-loop/deep-review/SKILL.md`

## Inputs and overrides that could not be used

- critic.json override 1 (L1-1) is a severity override without a valid severity and was ignored
- critic.json override 2 (L1-2) is a severity override without a valid severity and was ignored
- critic.json override 3 (L1-3) is a severity override without a valid severity and was ignored
- critic.json override 4 (L1-4) is a severity override without a valid severity and was ignored
- critic.json override 5 (L1-5) is a severity override without a valid severity and was ignored
- critic.json override 6 (L1-6) is a severity override without a valid severity and was ignored

