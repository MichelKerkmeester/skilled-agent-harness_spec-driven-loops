# Alignment report: topic expansive-depth

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic expansive-depth`
- Commits: `1e350ae863f1d4fe433e4b708ab58a3eabb6ac46` to `1e350ae863f1d4fe433e4b708ab58a3eabb6ac46`, 0 first-parent commits
- Files: 69, of which 0 uncommitted or untracked
- Owners: 6
- Findings: 25 (P0 0, P1 10, P2 15), 15 literal, 0 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 3 (21 handed off, 1 rebutted)
- Lanes: L1, L2, L3, L4, L5, L6, L7, L8
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
| pass | P1 | no | `D2-contract-drift` | 0 | 46 |
| pass | P1 | no | `D2-doc-facts` | 0 | 145 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **L1-1** P1 judgment `.claude/agents/deep-research.md:286`: The frontier-proposal paragraph presents the budget cap as an admission outcome ("would exceed the depth, fan-out or budget caps") and the row shape above it constrains `budget` to "never above the parent's", but the budget arm can never fire. `checkProposal` compares `proposal.budget` with `parent.budget` only when both are finite, and no writer ever stores `budget` on a node row (the admitted ro... [handed off]
  - Disposition: Owner: the coordinator (expansive admission design). frontier-admit.cjs compares proposal.budget with parent.budget only when both are finite (checkProposal :428-431), and no node-row writer stores budget (admitted and pruned rows :463-492, seed rows :539, close rows :574 hold no budget field), so the budget prune never fires. The agent text states the intended contract; the defect is the missing ...
  - Evidence: `D=$(mktemp -d "$TMPDIR/fb-XXXX"); printf '%s' '{"maxIterations":10,"expansiveDepth":{"maxDepth":3}}' > "$D/deep-research-config.json"; printf '%s' '[{"question":"q one","scope":"src/app","evidence":"s...` exit 0: {"admitted":["F-1-001"],"pruned":[],"derivedMaxIterations":10,"growthSlots":4} {"admitted":["F-2-002"],"pruned":[]}
- **L3-1** P1 judgment `.skilled/commands/deep/assets/deep-review-presentation.txt:446`: The Convergence Detection list claims review's STOP is gated by "Three binary quality gates (evidence, scope, coverage)". The review stop path evaluates nine legal-stop gates before a candidate becomes STOP — convergenceGate, dimensionCoverageGate, p0ResolutionGate, evidenceDensityGate, hotspotSaturationGate, claimAdjudicationGate, fixCompletenessReplayGate, candidateCoverageGate, graphlessFallbac... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: the expansive-depth docs follow-up the coordinator opens after this phase. deep-review-presentation.txt:446 lists three quality gates where the review stop path checks nine legal-stop gates; older presentation text this program did not write.
  - Evidence: `rg --no-config -n "Three binary quality gates" .skilled/commands/deep/assets/deep-review-presentation.txt; sed -n '1004,1015p' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: ...ality gates (evidence, scope, coverage) must pass before STOP const gateOrder = [ 'convergenceGate', 'dimensionCoverageGate', 'p0ResolutionGate', 'evidenceDensityGate', 'hotspotSaturationGate', 'claimAdjudicationGate', 'fixCompletenessReplayGate', 'candidateCoverageGate', 'graphlessFallbackGate', ];
- **L2-1** P2 literal `.skilled/commands/deep/assets/deep-research-presentation.txt:70`: The `maxIterations` resolution row states the expansive derived budget only as `min(24, max(10, 2·c·(S + maxDepth − 1)))`. `expansiveBudget` returns the loop default before that formula whenever no depth-1 node was seeded: frontier-admit.cjs:273 `if (seededCount === 0) return floor;` (floor = the run's default budget, 10 for research), and the nodes term is only computed from line 274 on. So the d... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 010 research frontier mode. deep-research-presentation.txt:70 gives the derived budget formula without the zero-seed loop-default case; with maxDepth 7 or more the formula and frontier-admit.cjs:273 differ at S 0.
  - Evidence: `node -e 'const {expansiveBudget}=require("./skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs");console.log(expansiveBudget({target:"research",seeded:0,maxDepth:8,loopDefault:10}), Ma...` exit 0: 10 14
- **L4-1** P2 literal `.skilled/commands/deep/research.md:107`: The `--depth-mode` row enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle". frontier-admit.cjs runs six checks in one fixed order and records the first failing check's name as the prune reason: relevance (1), dedupe (2), depth (3), fan-out (4), budget (5), cycle (6). The row omits the first check entirely and places dedupe after budget, which is not the order the store appl... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 010 research frontier mode. research.md:107 --depth-mode row lists the admission checks without relevance, the first of six in frontier-admit.cjs.
  - Evidence: `rg -n "return 'relevance'|// 1. relevance|// 2. dedupe|// 3. depth" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: ...eviewTarget(proposal.scope, reviewConfig)) return 'relevance'; 394: if (proposal.parentId !== 'root' && !nodes.has(proposal.parentId)) return 'relevance'; 396: if (proposal.parentId !== 'root' && nodes.get(proposal.parentId).status === 'pruned') return 'relevance'; 398: // 2. dedupe 412: // 3. depth
- **L5-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:415`: The protocol says the FRONTIER block's allowance is computed "from the node's remaining child slots". frontier-admit.cjs:612-615 takes the minimum of the node's remaining child slots and the run-wide remaining nodes (`maxFrontierNodes - countLiveNodes`), so in the shipped default flow the leaf's allowance is the run cap's remainder, not its child slots. With the six-seed default the derived budget... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 010 research frontier mode. deep-research loop-protocol.md:415 says the FRONTIER allowance comes from remaining child slots; frontier-admit.cjs takes the minimum with the run-wide remainder.
  - Evidence: `rg -n "maxChildrenPerNode - countLiveChildren|maxFrontierNodes - countLiveNodes" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 613: caps.maxChildrenPerNode - countLiveChildren(nodes, resolvedId), 614: caps.maxFrontierNodes - countLiveNodes(nodes),
- **L5-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:868`: The FAN-OUT section blurb says the section "covers 4 scenarios" and then enumerates only three: "CLI lineage pool dispatch, native sequential agent dispatch, and single-executor parity". The fourth is DR-073 ("Fan-out deals seeded frontier nodes round-robin", line 909), the expansive frontier partition that fanout-run.cjs `partitionFrontierNodes`/`writeLineageFrontierStore` and the fanout-merge.cj... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 010 research frontier mode. deep-research manual-testing-playbook.md:868 FAN-OUT blurb says 4 scenarios and names three, leaving out DR-073.
  - Evidence: `rg -n "covers 4 scenarios validating the opt-in fan-out|^### DR-052|^### DR-053|^### DR-054|^### DR-073" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook....` exit 0: ...quential agent dispatch, and single-executor parity. 870:### DR-052 | Fan-out research with two CLI lineages 883:### DR-053 | Fan-out native sequential research dispatch 896:### DR-054 | Fan-out single-executor parity for research loop 909:### DR-073 | Fan-out deals seeded frontier nodes round-robin
- **L6-1** P2 literal `.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md:29`: The doc enumerates the optimizer manifest's anti-convergence invariant group as locking only `antiConvergence.convergenceMode` and `convergenceMode`. The manifest's `anti-convergence-floor` group locks three fields: `antiConvergence.convergenceMode`, `convergenceMode` and `antiConvergence.depthMode`, and `antiConvergence.depthMode` also carries its own locked entry ("Depth mode selects whether the... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 011 review frontier mode. cross-mode-anti-convergence-contract.md:29 omits antiConvergence.depthMode from the optimizer manifest's anti-convergence-floor lock group.
  - Evidence: `rg -n '"lockedFields": \["antiConvergence.convergenceMode"' .skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json` exit 0: 128: "lockedFields": ["antiConvergence.convergenceMode", "convergenceMode", "antiConvergence.depthMode"],

### D2 Topic checks pass

- **L1-2** P1 judgment `.claude/agents/deep-review.md:253`: Same inert budget claim in the review mirror: the list of admission prunes names "would exceed the depth, fan-out or budget caps" and the row shape constrains `budget` to "never above the parent's". Review admission runs the same `checkProposal`, whose budget comparison requires a finite `parent.budget` on a node row, and frontier-admit never writes `budget` onto a node row (admitted row and seede... [handed off]
  - Disposition: Owner: the coordinator (expansive admission design). frontier-admit.cjs compares proposal.budget with parent.budget only when both are finite (checkProposal :428-431), and no node-row writer stores budget (admitted and pruned rows :463-492, seed rows :539, close rows :574 hold no budget field), so the budget prune never fires. The agent text states the intended contract; the defect is the missing ...
  - Evidence: `sed -n '426,432p;480,491p;539,549p' .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: ...al.parentId === 'root' ? null : nodes.get(proposal.parentId); if (Number.isFinite(proposal.budget) && parent && Number.isFinite(parent.budget)) { if (proposal.budget > parent.budget) return 'budget'; } const row = { nodeId, parentId: proposal.parentId, ... dedupeKey: dedupeKey(proposal.question), };
- **L2-2** P2 judgment `.skilled/commands/deep/assets/deep-research.yaml:356`: The fan-out seed step tells the operator that "frontier-admit.cjs is the only writer of the node store and the frontier inbox rows", in the very step whose next act is `fanout-run.cjs` splitting the seeded nodes. fanout-run.cjs does not go through frontier-admit for that: `writeLineageFrontierStore` writes `{lineageDir}/frontier-nodes.jsonl` itself (line 371-372) and appends `{lineageDir}/inbox.js... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 010 research frontier mode. deep-research.yaml:356 calls frontier-admit.cjs the only node-store writer, but fanout-run.cjs writeLineageFrontierStore writes each lineage store directly.
  - Evidence: `rg -n "frontier-nodes.jsonl|inbox.jsonl" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | head -4` exit 0: 316: const nodes = [...readNodeStore(path.join(baseArtifactDir, 'frontier-nodes.jsonl')).values()] 371: const storePath = path.join(lineageDir, 'frontier-nodes.jsonl'); 377: fs.appendFileSync(path.join(lineageDir, 'inbox.jsonl'), `${inboxRows.join('\n')}\n`, 'utf8');
- **L3-2** P2 literal `.skilled/commands/deep/assets/deep-review.yaml:367`: The fan-out spawn step tells the executor to skip "phase_init and phase_main_loop", but this workflow has no phase_main_loop: its phases are phase_init, phase_loop, phase_synthesis and phase_save, so a reader following the instruction looks for a phase key that does not exist. The sibling frontier-seed step and step_reject_extend_with_fanout already state the same fan-out jump with the real names ... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 011 review frontier mode. deep-review.yaml:367 names a phase_main_loop the workflow does not have (phase_loop).
  - Evidence: `rg --no-config -n "phase_main_loop" .skilled/commands/deep/assets/deep-review.yaml; rg --no-config -n "^ phase_" .skilled/commands/deep/assets/deep-review.yaml` exit 0: 367: phase_main_loop entirely (those are the single-executor path). The merge step in 393: phase_init: 1122: phase_loop: 2125: phase_synthesis: 2514: phase_save:
- **L4-2** P2 literal `.skilled/commands/deep/review.md:100`: The `--depth-mode` row enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle" and omits the relevance check, which is the one check that keeps a review node inside the review target. frontier-admit.cjs applies relevance first (lines 385-396) and, for a review run, prunes a proposal whose scope falls outside a `files` review target as `relevance` through `scopeInsideReviewTarge... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 011 review frontier mode. review.md:100 --depth-mode row lists the admission checks without relevance, which keeps a review node inside the target.
  - Evidence: `rg -n "scopeInsideReviewTarget\(proposal.scope" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 393: if (reviewConfig !== undefined && !scopeInsideReviewTarget(proposal.scope, reviewConfig)) return 'relevance';
- **L4-3** P2 literal `.skilled/commands/deep/review.md:100`: The row states "the ceiling of 24 binds from two seeds on". expansiveBudget derives min(24, max(7, 2 × D × (S + maxDepth − 1))), and with the four canonical dimensions (D = 4) and maxDepth 3 a single seeded node already gives 2 × 4 × (1 + 2) = 24, so the derived review budget is the 24-iteration ceiling from the first seed. A one-seed review has exactly as much headroom as a two-seed one, one seed... [rebutted]
  - Disposition: The sentence is accurate. 'Binds' means the ceiling changes the value: with D 4 and maxDepth 3, one seed gives 2 x 4 x (1 + 2) = 24, which min(24, ...) leaves unchanged, and two seeds give 2 x 4 x 4 = 32, which the ceiling cuts to 24. So the ceiling binds from two seeds on, as written; the lane's arithmetic (24 at one seed) agrees.
  - Evidence: `node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs seed --target review --artifact-dir $S --iteration 0 --input $S/frontier-seed.json --max-iterations-source default # $S holds a...` exit 0: frontier-admit: budget after seed 24 iterations, 11 growth slots {"admitted":["F-1-002"],"pruned":[{"nodeId":"F-1-001","reason":"merge-no-own-diff"},{"nodeId":"F-1-003","reason":"relevance"},{"nodeId":"F-1-004","reason":"relevance"}],"derivedMaxIterations":24,"growthSlots":11}
- **L8-1** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:16`: The overview states the run-wide frontier cap as "half of `maxIterations`" with the seed inside it. The code makes that cap configurable and exempts the seed pass: `runCap = capValue(expansive.maxFrontierNodes, derivedCap)` (frontier-admit.cjs:249), so a config that sets `expansiveDepth.maxFrontierNodes` is not capped at half; when no config exists yet — which is the fan-out parent seed, since it ... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 010 research frontier mode. depth-mode-flag.md:16 states the run cap as half of maxIterations without the configurable expansiveDepth.maxFrontierNodes or the seed-pass exemption.
  - Evidence: `rg -n "const derivedCap|const runCap|const seeding =|if \(!seeding" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 246: const derivedCap = iterationBudget === null 249: const runCap = capValue(expansive.maxFrontierNodes, derivedCap); 423: const seeding = isPlainObject(options) && options.seeding === true; 424: if (!seeding && countLiveNodes(nodes) >= caps.maxFrontierNodes) return 'fanout';
- **L8-2** P2 judgment `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:46`: The Implementation table credits `fanout-run.cjs` only with passing `depthMode` to lineages, and omits `runtime/scripts/fanout-merge.cjs`, which carries the other half of the fan-out partition the doc's own DR-073/DRV-082 rows describe. Under expansive depth fanout-run records `summary.frontier_partition` (fanout-run.cjs:3834-3838) and fans the merged result in through `mergeResearchFrontier`, whi... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 011 review frontier mode. depth-mode-flag.md:46 implementation table omits fanout-merge.cjs, which carries the merged frontier and the partition guard.
  - Evidence: `rg -n "function mergeResearchFrontier|partitionGuard: \{ passed|frontier_partition_guard_failed" .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` exit 0: ...chFrontier(lineageData, frontierPartition) { 796: ...(expected.length > 0 ? { partitionGuard: { passed: missing.length === 0, missing } } : {}), 1771: process.stderr.write(`${JSON.stringify({ warning: 'frontier_partition_guard_failed', missing: mergedRegistry.frontier.partitionGuard.missing })}\n`);

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Probes awaiting the critic

None.

## Files no lane reviewed

No critic output in this run, so coverage was not checked.

