# Alignment report: topic expansive-depth

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic expansive-depth`
- Commits: `65eb3c029d0c2c0a29dcfcc0039d7343692c2d83` to `65eb3c029d0c2c0a29dcfcc0039d7343692c2d83`, 0 first-parent commits
- Files: 66, of which 0 uncommitted or untracked
- Owners: 5
- Findings: 28 (P0 0, P1 10, P2 18), 18 literal, 0 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Lanes: L1, L2, L4
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 66 | lens only |
| D2 | Topic checks pass | yes | 0 | 2 |

## Battery

pass 2, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-contract-drift` | 0 | 49 |
| pass | P1 | no | `D2-doc-facts` | 0 | 147 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **C1** P1 literal `.skilled/commands/deep/assets/deep-review.yaml:1237`: The `step_check_convergence` list claims to give the script's fixed order, first match wins, but it jumps from `4a` (the review floor) to `5` (the nine legal-stop gates) and never names the expansive `frontierOpen` veto. `convergence.cjs` returns CONTINUE with reasonDetail `frontierOpen` after the floor (1180-1182) and before the gates (1199) whenever `config.depthMode === 'expansive'` and `review...
  - Evidence: `rg -n "4a\.|4b\.|5\. the nine legal-stop gates|frontierOpen" .skilled/commands/deep/assets/deep-review.yaml .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: ...: 5. the nine legal-stop gates run on a candidate: ... .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1192: if (config.depthMode === 'expansive' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1196: return emit('CONTINUE', null, 'frontierOpen', gatesAt(false), []);
- **C2** P1 judgment `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:182`: The live loop step says `All questions answered? STOP` unconditionally, with no `minIterations` floor and no expansive frontier veto. In `convergence.cjs`, `all_questions_answered` is a soft candidate (`hardStop: false`, line 1167) that returns CONTINUE below the floor (1180-1182) and while `frontierOpen > 0` (1192-1196). The same document's expansive section (409-421) never states the veto either...
  - Evidence: `nl -ba .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md | sed -n '177,183p' && rg -n "all_questions_answered|minIterations > 1|frontierOpen" .skilled/skills/system-d...` exit 0: ...red? STOP 183-- Otherwise: CONTINUE convergence.cjs:1167: candidate = { reasonDetail: 'all_questions_answered', hardStop: false }; convergence.cjs:1180: if (minIterations > 1 && iterationCount < minIterations) { convergence.cjs:1196: return emit('CONTINUE', null, 'frontierOpen', gatesAt(false), []);
- **C3** P1 judgment `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:126`: The LIVE ALGORITHM Decision Order block omits the consecutive-failure hard stop, the `minIterations` floor and the `frontierOpen` veto, and places the all-questions candidate (step 2) before stuck detection (step 3), while `buildStopDecision` checks stuck first (1151) and selects the candidate at 1163. A reader following this order cannot predict that a converged run with open frontier nodes conti...
  - Evidence: `nl -ba .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md | sed -n '123,134p' && rg -n "consecutiveFailureCount >=|stuckCount >=|minIterations > 1|config.depthMode ==...` exit 0: ...oor or frontierOpen) convergence.cjs:1147: if (consecutiveFailureCount >= CONSECUTIVE_FAILURE_LIMIT) { convergence.cjs:1151: if (stuckCount >= stuckThreshold) { convergence.cjs:1180: if (minIterations > 1 && iterationCount < minIterations) { convergence.cjs:1192: if (config.depthMode === 'expansive'
- **C10** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:28`: The budgeting formula underfunds by the band share. `applyReviewFrontierBudget` gives the depth-1 band `budgetSplit.depth1` (0.5) of `maxIterations`, depth 2 0.35 and depth 3 0.15, and closes a band's remaining open nodes as `exhausted` with reason `budget` once its spend reaches the share. A node also needs every dimension in `buildDimensionUniverse`, the four canonical dimensions plus any custom...
  - Evidence: `rg -n "function applyReviewFrontierBudget|const shares = \[|Number.isFinite\(split.depth1\)|const allotted = cap \* shares" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` exit 0: ...h2 : 0.35, 1970: Number.isFinite(split.depth3) ? split.depth3 : 0.15, 1980: const allotted = cap * shares[band] + carry; 1982: result = result.map((node) => (bandOf(node.depth) === band && (node.status === 'open' || node.status === 'active') 1983: ? { ...node, status: 'exhausted', reason: 'budget' }
- **C4** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:138`: The convergence decision tree says `All questions answered? Yes --> STOP` before stuck detection and never mentions the `minIterations` floor or the expansive `frontierOpen` veto. The code nominates `all_questions_answered` as a soft candidate only after the stuck check (1151-1167), then returns CONTINUE below the floor (1180-1182) and while open nodes remain (1192-1196). An operator using this qu...
  - Evidence: `nl -ba .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md | sed -n '134,149p' && rg -n "all_questions_answered|minIterations > 1|frontierOpen" .skilled/skills/system-d...` exit 0: ...RY (no consecutive-failure, minIterations or frontierOpen branch) convergence.cjs:1167: candidate = { reasonDetail: 'all_questions_answered', hardStop: false }; convergence.cjs:1180: if (minIterations > 1 && iterationCount < minIterations) { convergence.cjs:1192: if (config.depthMode === 'expansive'
- **C5** P2 literal `.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:38`: The catalog's Initialization summary says the runtime supports only `new`, `resume` and `restart`, but the same file's Completed-run extension section (line 203) and `deep-research.yaml` (line 68) accept `completed-continue`, which `--extend=N` writes. The sibling `loop-lifecycle/initialization.md` lists all four modes, so this line is the stale outlier.
  - Evidence: `rg -n "only exposes|run_extended|completed-continue" .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md .skilled/commands/deep/assets/deep-research.yaml` exit 0: ...y exposes `new`, `resume`, and `restart` as runtime-supported lineage modes. feature-catalog.md:203:A completed deep-research run extends in place by N iterations under --extend=N ... records one run_extended event. deep-research.yaml:68: lineage_mode accepts [auto|resume|restart|completed-continue]
- **C6** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md:56`: Both expected test counts are stale. Command 1's `frontierOpen veto` filter now matches the research and review describes and runs 28 cases: `Tests 28 passed | 64 skipped (92)`, not `15 passed | 64 skipped (79)`. Command 2 runs `Tests 1 passed | 91 skipped (92)`, not `1 passed | 78 skipped (79)`. An operator following the scenario records a false failure on a green suite.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision.vitest -t "frontierOpen veto" --reporter=verbose && npx vitest run stop-decision.vitest -t "echoes the input unchanged" --re...` exit 0: Test Files 1 passed (1) Tests 28 passed | 64 skipped (92) --- Tests 1 passed | 91 skipped (92)
- **C7** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md:58`: All four expected counts are stale: command 1 runs `2 passed | 206 skipped (208)` because two round-robin cases now match, commands 2 and 3 each run `1 passed | 207 skipped (208)`, and command 4 runs `4 passed | 86 skipped (90)`. The document expects `1/202/203` and `2/82/84`, so every command in the scenario reads as a failure even though all tests pass.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest -t "round-robin" && npx vitest run fanout-run.vitest -t "writes the lineage store before spawn" && npx vitest run fanout...` exit 0: 1: Tests 2 passed | 206 skipped (208) 2: Tests 1 passed | 207 skipped (208) 3: Tests 1 passed | 207 skipped (208) 4: Tests 4 passed | 86 skipped (90)
- **C8** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:57`: Command 1 prints 14 lines, not 13. The pattern matches five `relevance` returns, three `dedupe`, one `depth`, two `fanout`, one `budget` and two `cycle` returns; the expected count is one short.
  - Evidence: `rg -n "return '(relevance|dedupe|depth|fanout|budget|cycle)'" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs | wc -l` exit 0: 14
- **C9** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:57`: Command 3 prints six lines, not three, because the unrestricted search matches both `research-depth-mode-golden.vitest.ts` and `review-depth-mode-golden.vitest.ts`, each with a comment, a helper definition and a call. Adding the same `--glob 'research-depth-mode-golden.vitest.ts'` restriction the review scenario already uses restores the three-line expectation.
  - Evidence: `rg -n 'withoutExpansiveOnlyPersona' .skilled/skills/system-deep-loop/runtime/tests | wc -l && rg -n --glob 'research-depth-mode-golden.vitest.ts' 'withoutExpansiveOnlyPersona' .skilled/skills/system-d...` exit 0: without glob: 6 with --glob research-depth-mode-golden.vitest.ts: 3
- **L1-4** P2 literal `.claude/agents/deep-research.md:84`: The lifecycle reference names a section that does not exist. The research loop protocol's heading is `### Lifecycle Branch Contract (current release)` (loop-protocol.md:119); there is no `Lifecycle Branches` section, and the workflow cites the correct name at deep-research.yaml:684 and :2093. A reader following the completed-run extension reference lands on nothing.
  - Evidence: `rg -n "^### Lifecycle" .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` exit 0: 119:### Lifecycle Branch Contract (current release)
- **L2-4** P2 literal `.skilled/commands/deep/assets/deep-review-presentation.txt:19`: The Tier-1 persist shape is incomplete for the config the workflow writes on every run: it lists `antiConvergence.convergenceMode` and the reserved `antiConvergence.divergent` but omits `antiConvergence.depthMode` and the `expansiveDepth` block (`maxDepth`, `maxChildrenPerNode`, `budgetSplit`, `maxFrontierNodes`) that `step_create_config` populates unconditionally.
  - Evidence: `rg -n "antiConvergence.depthMode|expansiveDepth.maxDepth" .skilled/commands/deep/assets/deep-review.yaml` exit 0: 878: antiConvergence.depthMode: "{depth_mode}" 879: expansiveDepth.maxDepth: 3
- **L2-5** P2 literal `.skilled/commands/deep/assets/deep-review-presentation.txt:150`: The `:confirm` defaults recap omits `antiConvergence.depthMode`, although the Default Resolution Table sets `depth_mode` to `default` and the runtime writes `antiConvergence.depthMode` into every review config. A setup that binds its defaults from this line alone leaves `depth_mode` unresolved.
  - Evidence: `rg -n "antiConvergence.depthMode" .skilled/commands/deep/assets/deep-review.yaml` exit 0: 878: antiConvergence.depthMode: "{depth_mode}" 1140: - depth_mode: "Extract antiConvergence.depthMode when it is 'expansive'; any other or missing value is 'default'"

### D2 Topic checks pass

- **L1-5** P2 literal `.claude/agents/deep-review.md:253`: The admission-prune claim is unconditional, but frontier-admit.cjs only narrows a proposal to the review target when `reviewTargetType === 'files'`. For every other target type, including the template default `spec-folder`, `scopeInsideReviewTarget` returns true immediately, so a proposal scoped outside the target is admitted rather than pruned; a commit-range target is checked against `reviewScop...
  - Evidence: `rg -n -A 6 "function scopeInsideReviewTarget" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: ...e is no 297- // path to be outside of and every scope stays relevant. 298- if (source.reviewTargetType !== 'files') return true; 299- if (typeof source.reviewTarget !== 'string') return true; 300- if (isCommitRange(source.reviewTarget)) return scopeInsideTouchedFiles(scope, source.reviewScopeFiles);

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/anti-convergence-floor.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/anti-convergence-floor.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-deep-loop/deep-research/README.md`
- `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
- `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md`
- `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`
- `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md`
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md`
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md`
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md`
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

