# Alignment report: topic expansive-depth

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic expansive-depth`
- Commits: `0a845d0d8ef0b1d3c48a2b14560196358a38d961` to `0a845d0d8ef0b1d3c48a2b14560196358a38d961`, 0 first-parent commits
- Files: 69, of which 0 uncommitted or untracked
- Owners: 6
- Findings: 27 (P0 0, P1 10, P2 17), 15 literal, 0 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 24 (3 handed off, 0 rebutted)
- Lanes: L1, L2, L3, L5, L6, L7, L8
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 69 | lens only |
| D2 | Topic checks pass | yes | 0 | 2 |

## Battery

pass 2, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-contract-drift` | 0 | 44 |
| pass | P1 | no | `D2-doc-facts` | 0 | 137 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **L1-1** P1 judgment `.claude/agents/deep-research.md:286`: The frontier-proposal paragraph lists the budget cap among the admission prunes ("would exceed the depth, fan-out or budget caps") and the row shape above it constrains `budget` to "never above the parent's", but the budget arm cannot fire. checkProposal compares proposal.budget with parent.budget only when both are finite (frontier-admit.cjs:437-441), and no node-row writer ever stores `budget`: ...
  - Evidence: `D=$(mktemp -d "$TMPDIR/fb-XXXX"); printf '%s' '{"maxIterations":10,"expansiveDepth":{"maxDepth":3}}' > "$D/deep-research-config.json"; printf '%s' '[{"question":"q one","scope":"src/app","evidence":"s...` exit 0: {"admitted":["F-1-001"],"pruned":[],"derivedMaxIterations":10,"growthSlots":4} {"admitted":["F-2-002"],"pruned":[]}
- **L3-1** P1 literal `.skilled/commands/deep/assets/deep-review-presentation.txt:446`: The Convergence Detection list says review's STOP is gated by "Three binary quality gates (evidence, scope, coverage)". The review stop path evaluates nine legal-stop gates before a candidate becomes STOP — convergenceGate, dimensionCoverageGate, p0ResolutionGate, evidenceDensityGate, hotspotSaturationGate, claimAdjudicationGate, fixCompletenessReplayGate, candidateCoverageGate, graphlessFallbackG... [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: deep-review command presentation (deep-review-presentation.txt:446, commit 8c2f5e483cc). The 'three binary quality gates' list predates the program; the review stop path checks nine legal-stop gates.
  - Evidence: `rg -n "Three binary quality gates" .skilled/commands/deep/assets/deep-review-presentation.txt; sed -n '1002,1014p' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs; sed -n '39,41p' .sk...` exit 0: ...s, failed }; --- const EVIDENCE_GATE_ID = 'evidence'; const SCOPE_GATE_ID = 'scope'; const COVERAGE_GATE_ID = 'coverage'; --- const failedGateIds = Array.isArray(failedRequiredGateIds) ? failedRequiredGateIds : []; let verdict = 'PASS'; if (activeP0 > 0 || failedGateIds.length > 0) verdict = 'FAIL';
- **L6-1** P1 literal `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:45`: The file table declares `deep-research-config.json` as "Created at init; read-only after", and §4 (line 106) repeats the same claim as the meaning of the `immutable` protection class. The workflow rewrites the config twice after creation: `step_frontier_budget` (deep-research.yaml:773) reserialises it through a tmp file with a new `maxIterations` (line 796), and `step_extend_completed_run` (line 4...
  - Evidence: `rg -n "read-only after" .skilled/skills/system-deep-loop/deep-research/references/state/state-format.md; rg -n "maxIterations: budget.derivedMaxIterations|maxIterations: newMaxIterations|lineageMode: ...` exit 0: ... parameters and lineage | Created at init; read-only after | 547: maxIterations: newMaxIterations, 549: lineage: { ...lineage, lineageMode: "completed-continue", continuedFromRun }, 796: fs.writeFileSync(tmp, JSON.stringify({ ...config, maxIterations: budget.derivedMaxIterations }, null, 2) + "\n");
- **C1** P2 literal `.skilled/commands/deep/research.md:107`: The `--depth-mode` row enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle", but `checkProposal` runs six checks in one fixed order and records the first failure as the prune reason: relevance (frontier-admit.cjs:396-403), dedupe (:406-419), depth (:422-423), fan-out (:426-433), budget (:435-441), cycle (:444). The row omits relevance entirely — the check that prunes a propo...
  - Evidence: `rg -n "under depth, fan-out, budget, dedupe and cycle caps" .skilled/commands/deep/research.md; rg -n "applies six checks in order" .skilled/skills/system-deep-loop/deep-research/references/protocol/l...` exit 0: ...as new questions under depth, fan-out, budget, dedupe and cycle caps ... 415:A leaf may append `frontier_proposal` rows ... `step_frontier_admit` runs before `step_reduce_state` and calls `frontier-admit.cjs admit`, which applies six checks in order: relevance, dedupe, depth, fan-out, budget, cycle.
- **C2** P2 literal `.skilled/commands/deep/review.md:100`: The `--depth-mode` row enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle", omitting relevance and placing dedupe after budget. `checkProposal` runs relevance first (frontier-admit.cjs:396-403), and for a review run relevance is the check that prunes a proposal whose scope falls outside a `files` review target through `scopeInsideReviewTarget` (:402) — the one admission rul...
  - Evidence: `rg -n "under depth, fan-out, budget, dedupe and cycle caps" .skilled/commands/deep/review.md; rg -n "applies six checks in order" .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-...` exit 0: ...dmits leaf `frontier_proposal` rows under depth, fan-out, budget, dedupe and cycle caps ... 465:`step_frontier_admit` runs before the reducer and applies six checks in order: relevance, dedupe, depth, fan-out, budget, cycle. Relevance includes a node's scope sitting inside a file-list review target.
- **C3** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:96`: The section 5 STATE FILES table presents itself as the packet's file list and omits `frontier-nodes.jsonl`, even though the same cheat sheet documents `--depth-mode=expansive` at line 59 and routes an open frontier node to CONTINUE at line 149. The string `frontier-nodes` does not appear anywhere in the file. `frontier-admit.cjs:42` names it as the node store, `deep-research/references/state/state...
  - Evidence: `rg -n "frontier-nodes" .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md; echo "doc-exit=$?"; rg -n "NODE_STORE_FILE = " .skilled/skills/system-deep-loop/runtime/scri...` exit 1: doc-exit=1 42:const NODE_STORE_FILE = 'frontier-nodes.jsonl';
- **L2-1** P2 judgment `.skilled/commands/deep/assets/deep-research-presentation.txt:210`: The section is headed "Parse response and store ALL results" but its list stops at depth_mode and omits lineage_mode and extend, the two bindings the completed-run extension sets. The review presentation doc's equivalent list carries both (deep-review-presentation.txt:238-239), and the yaml's preflight requires lineage_mode (required_values_present at deep-research.yaml:407), so a reader following...
  - Evidence: `rg -n "lineage_mode = |extend = " .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/commands/deep/assets/deep-research-presentation.txt; rg -n "required_values_present" .skilled/comm...` exit 0: ...leted-continue from --extend=N] .skilled/commands/deep/assets/deep-review-presentation.txt:239: - extend = [N from --extend=N, else unset] --- 407: - required_values_present: [research_topic, spec_folder, lineage_mode, max_iterations, convergence_threshold, convergence_mode, depth_mode, stop_policy]
- **L3-2** P2 literal `.skilled/commands/deep/assets/deep-review.yaml:367`: The fan-out spawn step tells the executor to skip "phase_init and phase_main_loop", but this workflow has no phase_main_loop: its phases are phase_init, phase_loop, phase_synthesis and phase_save (deep-review.yaml:393, 1122, 2125, 2514). A reader following the instruction looks for a phase key that does not exist; the sibling frontier-seed and extend-refusal steps already state the same fan-out ju... [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: deep-review workflow YAML (deep-review.yaml:367, commit 7f1d9ac5891). The fan-out spawn step names a phase_main_loop the workflow does not have; predates the program.
  - Evidence: `rg -n "phase_main_loop|^ phase_" .skilled/commands/deep/assets/deep-review.yaml` exit 0: 393: phase_init: 1122: phase_loop: 2125: phase_synthesis: 2514: phase_save: --- 367: phase_main_loop entirely (those are the single-executor path). The merge step in
- **L8-1** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:16`: The overview states the run-wide frontier cap as half of `maxIterations` with the seed inside it. The code makes that cap configurable and exempts the seed pass: `runCap = capValue(expansive.maxFrontierNodes, derivedCap)` (frontier-admit.cjs:258), so a config that sets `expansiveDepth.maxFrontierNodes` is not capped at half; when no config exists yet, which is the fan-out parent seed because it ru...
  - Evidence: `rg -n "runCap = capValue|derivedCap =|DEFAULT_MAX_FRONTIER_NODES =|!seeding && countLiveNodes" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 53:const DEFAULT_MAX_FRONTIER_NODES = 10; 255: const derivedCap = iterationBudget === null 258: const runCap = capValue(expansive.maxFrontierNodes, derivedCap); 433: if (!seeding && countLiveNodes(nodes) >= caps.maxFrontierNodes) return 'fanout';
- **L8-2** P2 judgment `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:46`: The Implementation table credits `fanout-run.cjs` only with passing `depthMode` to lineages and omits `runtime/scripts/fanout-merge.cjs`, which carries the other half of the fan-out partition the doc's own DR-073 and DRV-082 rows describe. Under expansive depth `fanout-run.cjs` records `summary.frontier_partition` (fanout-run.cjs:3838), and `fanout-merge.cjs` merges the lineage frontiers through `...
  - Evidence: `rg -n "mergeResearchFrontier|partitionGuard|frontier_partition" .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` exit 0: ....frontier?.partitionGuard && !mergedRegistry.frontier.partitionGuard.passed) { .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1771: process.stderr.write(`${JSON.stringify({ warning: 'frontier_partition_guard_failed', missing: mergedRegistry.frontier.partitionGuard.missing })}\n`);

### D2 Topic checks pass

- **L1-2** P1 judgment `.claude/agents/deep-review.md:253`: The frontier-proposal paragraph lists the budget cap among the admission prunes ("would exceed the depth, fan-out or budget caps") and the row shape above it constrains `budget` to "never above the parent's", but review admission runs the same checkProposal, whose budget comparison needs a finite `parent.budget` on a node-store row (frontier-admit.cjs:437-441). No writer stores `budget` on a node ...
  - Evidence: `rg -n -A6 '// 5\. budget' .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: ...Number.isFinite(proposal.budget) && parent && Number.isFinite(parent.budget)) { 438- // Budgets only narrow from parent to child; a child that claims more than 439- // its parent could spend work the run never allotted to that branch. 440- if (proposal.budget > parent.budget) return 'budget'; 441- }
- **L6-2** P1 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:228`: The prohibition list tells the reader that "Research parameters are read-only after initialization; the terminal `step_update_config_status` flip to `status: complete` is the one permitted write". Two other writes exist in the shipped workflow: `step_frontier_budget` (deep-research.yaml:773) rewrites `maxIterations` from the seed-derived budget via tmp+rename (line 796), and `step_extend_completed...
  - Evidence: `rg -n "one permitted write" .skilled/skills/system-deep-loop/deep-research/SKILL.md; rg -n "step_frontier_budget:|step_extend_completed_run:" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 228:6. **Modify config after init** -- Research parameters are read-only after initialization; the terminal `step_update_config_status` flip to `status: complete` is the one permitted write 466: step_extend_completed_run: 773: step_frontier_budget:
- **L2-2** P2 judgment `.skilled/commands/deep/assets/deep-research.yaml:356`: Both copies of step_frontier_seed (fan-out at line 356, init at line 765) state "frontier-admit.cjs is the only writer of the node store and the frontier inbox rows", but fanout-run.cjs's writeLineageFrontierStore writes frontier-nodes.jsonl and appends the frontier inbox rows for each lineage (fanout-run.cjs:370-378), so the claim is false on the fan-out path the same step describes.
  - Evidence: `rg -n "function writeLineageFrontierStore" -A 9 .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` exit 0: ...eturn true; 376- const inboxRows = nodes.map((node) => JSON.stringify({ id: node.nodeId, text: node.question, source: 'frontier', origin: 'frontier', injectedAtIteration: 0 })); 377- fs.appendFileSync(path.join(lineageDir, 'inbox.jsonl'), `${inboxRows.join('\n')}\n`, 'utf8'); 378- return true; 379-}

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.skilled/commands/deep/research.md`
- `.skilled/commands/deep/review.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/70materia/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/anacuna/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/base44/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/elementor/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/flatfile/DESIGN.md`
- `.skilled/skills/sk-design/sk-design-md-generator/styles/library/bundles/speakeasy/DESIGN.md`
- `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/anti-convergence-floor.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md`

## Inputs and overrides that could not be used

- critic.json override 1 (L1-1) is a severity override without a valid severity and was ignored
- critic.json override 2 (L1-2) is a severity override without a valid severity and was ignored
- critic.json override 3 (L1-3) is a severity override without a valid severity and was ignored
- critic.json override 4 (L1-4) is a severity override without a valid severity and was ignored
- critic.json override 5 (L1-5) is a severity override without a valid severity and was ignored
- critic.json override 6 (L1-6) is a severity override without a valid severity and was ignored

