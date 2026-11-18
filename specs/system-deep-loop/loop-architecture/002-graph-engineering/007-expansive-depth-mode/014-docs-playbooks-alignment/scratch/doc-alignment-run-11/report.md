# Alignment report: topic expansive-depth

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic expansive-depth`
- Commits: `a2382a3f063312cd0534aa8b858212bf5a0c6d34` to `a2382a3f063312cd0534aa8b858212bf5a0c6d34`, 0 first-parent commits
- Files: 79, of which 0 uncommitted or untracked
- Owners: 6
- Findings: 27 (P0 0, P1 0, P2 27), 12 literal, 10 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 26 (1 handed off, 0 rebutted)
- Lanes: L1, L2, L3, L4, L5, L6, L7, L8
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 79 | lens only |
| D2 | Topic checks pass | yes | 0 | 2 |

## Battery

pass 2, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-contract-drift` | 0 | 59 |
| pass | P1 | no | `D2-doc-facts` | 0 | 169 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **C-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:96`: The frontier veto line says it 'never outranks the iteration cap, consecutive failures, stuck recovery, `--convergence-mode=off` or `--stop-policy=max-iterations`'. It leaves out two workflow stops that run before step_check_convergence (deep-research.yaml:1209): step_check_max_duration (deep-research.yaml:1127) ends the loop when maxDurationMinutes is reached, and step_check_pause_sentinel (deep-...
  - Evidence: `rg -n "^ step_(check_max_duration|check_pause_sentinel|check_convergence):" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 1127: step_check_max_duration: 1162: step_check_pause_sentinel: 1209: step_check_convergence:
- **C-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:70`: Same gap as C-1. The veto 'never outranks the iteration cap, consecutive failures, stuck recovery, `--convergence-mode=off` or `--stop-policy=max-iterations`'. It leaves out pause (step_check_pause_sentinel, deep-research.yaml:1162) and the max-duration stop (step_check_max_duration, deep-research.yaml:1127). Both run before step_check_convergence (deep-research.yaml:1209).
  - Evidence: `sed -n 70p .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` exit 0: ... never outranks the iteration cap, consecutive failures, stuck recovery, `--convergence-mode=off` or `--stop-policy=max-iterations`. ...
- **C-3** P2 literal `.skilled/commands/deep/research.md:107`: The --depth-mode row's 'never outranks the iteration cap, consecutive failures, the minIterations floor, stuck recovery, pause, `--convergence-mode=off` or `--stop-policy=max-iterations`' leaves out the max-duration stop. step_check_max_duration (deep-research.yaml:1127) runs before step_check_convergence (deep-research.yaml:1209) and stops the loop when maxDurationMinutes is reached, whatever sta...
  - Evidence: `rg -n "^ step_(check_max_duration|check_convergence):" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 1127: step_check_max_duration: 1209: step_check_convergence:
- **C-4** P2 literal `.skilled/commands/deep/review.md:100`: Same gap as L7-2, but in the command doc, which L7 did not review. The --depth-mode row's 'never outranks' list leaves out the max-duration stop. step_check_max_duration (deep-review.yaml:1190) runs before step_check_convergence (deep-review.yaml:1276).
  - Evidence: `rg -n "^ step_(check_max_duration|check_convergence):" .skilled/commands/deep/assets/deep-review.yaml` exit 0: 1190: step_check_max_duration: 1276: step_check_convergence:
- **C-5** P2 judgment `.skilled/skills/system-deep-loop/deep-research/README.md:108`: The Packet Files table lists frontier-nodes.jsonl for an expansive run but not the seed input {artifact_dir}/frontier-seed.json. Both research seed steps write that file and pass it to frontier-admit.cjs seed --input (deep-research.yaml:353/359 and :763/769). This is the research-side counterpart of L7-7: L7-7's claim that 'no reviewed doc' lists the file was checked only against the review docs, ...
  - Evidence: `rg -n "frontier-seed" .skilled/skills/system-deep-loop/deep-research -g '*.md'` exit 1: 
- **L1-1** P2 literal `.claude/agents/deep-research.md:286`: The prune list that follows 'so it prunes a row that' leaves out one relevance prune. frontier-admit.cjs:429 also prunes a proposal whose parent the store holds with status 'pruned'. The doc only names a parent the store does not hold.
  - Evidence: `sed -n 425,430p .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: if (proposal.parentId !== 'root' && !nodes.has(proposal.parentId)) return 'relevance'; // A child of a pruned node would reopen a branch admission already rejected. if (proposal.parentId !== 'root' && nodes.get(proposal.parentId).status === 'pruned') return 'relevance';
- **L1-2** P2 literal `.pi/agents/deep-research.md:294`: The prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too. (inferred)
- **L1-3** P2 literal `.skilled/agents/deep-research.md:302`: The prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too. (inferred)
- **L1-4** P2 literal `.claude/agents/deep-review.md:253`: The review prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too. (inferred)
- **L1-5** P2 literal `.pi/agents/deep-review.md:260`: The review prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too. (inferred)
- **L1-6** P2 literal `.skilled/agents/deep-review.md:267`: The review prune list leaves out the pruned-parent relevance prune (frontier-admit.cjs:429): a proposal whose parent is stored with status 'pruned' is pruned too. (inferred)
- **L2-1** P2 judgment `.skilled/commands/deep/assets/deep-research-presentation.txt:70`: The maxIterations row says: 'Under --depth-mode=expansive a `default` budget is resized after the seed step to `min(24, max(10, 2·c·(S + maxDepth − 1)))`, with S the depth-1 nodes the seed admitted and c = 1; any other source is kept as given'. It does not limit this to single-executor runs. In a fan-out run the parent budget is never resized. fanout-run.cjs expansiveLineageBudgets (lines 332-350)...
  - Evidence: `rg -n "loopDefault: lineage.kind === 'native' \? 12" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` exit 0: 347: loopDefault: lineage.kind === 'native' ? 12 : LOOP_DEFAULT_MAX_ITERATIONS[loopType],
- **L3-1** P2 judgment `.skilled/commands/deep/assets/deep-review.yaml:2645`: The custom-dimension rubric row says a configured custom dimension "is not required for severity coverage". The code does require it. step_normalize_review_dimensions (yaml 830-831) keeps custom names in config.reviewDimensions, and the registry seed (yaml 1027) writes "<custom>":false. convergence.cjs 1599-1614 then builds missingDimensions from config.reviewDimensions, so dimensionCoverageGate f...
  - Evidence: `rg -n "missingDimensions: dimensions.filter|config.reviewDimensions$" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: 1600: ? config.reviewDimensions 1614: missingDimensions: dimensions.filter((dimension) => coverage[dimension] !== true),
  - Critic override: severity P1 to P2. 'Severity coverage' is a defined contract term, not a claim about the stop gate. deep-review/assets/review-mode-contract.yaml:69-92 sets requiredForSeverityCoverage true only for correctness and security. It sets it false for traceability, maintainability and customDimensionRule, yet traceability and maintainability also block all_dimensions_clean. The only code that reads the flag is render-contr...
- **L3-2** P2 judgment `.skilled/commands/deep/assets/deep-review.yaml:599`: step_extend_completed_run on_fail says "Exit 2 is a usage error, such as a run that is not complete ... Any other failure halts with STATUS=FAIL". The command at line 588 ends the inline node script with `|| { rm -rf "$WORK_DIR"; exit 2; }`. That turns every failure of the script into exit 2 and so into the usage-error branch: an unparseable config, an unreadable state log, a JSON.parse throw. Onl...
  - Evidence: `sed -n 588,590p .skilled/commands/deep/assets/deep-review.yaml` exit 0: ' "{state_paths.config}" "{state_paths.state_log}" "{extend}" "{extend_minutes}" "$WORK_DIR" > "$WORK_DIR/result.json" || { rm -rf "$WORK_DIR"; exit 2; } node "$GATEWAY" ... || { rm -rf "$WORK_DIR"; exit 1; } mv "$WORK_DIR/config.json" "{state_paths.config}" || { rm -rf "$WORK_DIR"; exit 1; }
- **L4-1** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/anti-convergence-floor.md:25`: The doc says the template defines `antiConvergence.minIterations` and 'The workflow writes those values into the config record'. That implies the run's floor lives at `antiConvergence.minIterations`. In fact `step_create_config` in deep-research.yaml writes the floor as a top-level `minIterations: 3` (line 723), and `stopDecisionConfig` in convergence.cjs (lines 1398-1400) reads `config.minIterati... [handed off]
  - Disposition: Not this program's: deep-research/feature-catalog/convergence/anti-convergence-floor.md, the top-level minIterations: 3 that step_create_config writes in deep-research.yaml, and the precedence in convergence.cjs stopDecisionConfig all predate the program base 21c4b325b5a, and the catalog entry has no diff since then. Owner: the deep-research feature catalog (convergence group). The finding stands:...
  - Evidence: `rg -n "^ minIterations: 3|antiConvergence.minIterations" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 723: minIterations: 3
- **L6-1** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:57`: feature-catalog.md:228 says this page holds the 'full implementation and validation file listings'. The tables leave files out. The Implementation table has no row for runtime/scripts/fanout-run.cjs, yet the page's own Fan-Out section says that script exports DEEP_LOOP_COVERAGE_DB_DIR (fanout-run.cjs:4114) and deals the seed round-robin (fanout-run.cjs:314-321). The Validation table lists only DRV...
  - Evidence: `rg -n "DRV-07[789]|DRV-083" .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md; echo exit=$?` exit 1: exit=1
- **L6-2** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md:28`: The doc says 'a custom name that appears in the finding's focus is kept as its own dimension'. deriveDimension (runtime/scripts/reduce-state.cjs:1237-1244) does a substring match of each universe entry against the iteration focus plus the finding's title and description. It checks the universe in order, and the canonical four come first (buildDimensionUniverse, reduce-state.cjs:1224-1235). So when...
  - Evidence: `sed -n 1237,1244p .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` exit 0: ...mension(finding, iteration, universe = REQUIRED_DIMENSIONS) { const focus = `${iteration.focus} ${finding.title} ${finding.description}`.toLowerCase(); for (const dimension of universe) { if (focus.includes(dimension)) { return dimension; } } return iteration.dimensionsAddressed[0] || 'correctness';
- **L6-3** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:28`: The doc says the active node's next uncovered dimension is dispatched 'apart from the last iteration under the cap while a core traceability protocol is unfinished'. The override in deep-review.yaml:1160 also needs max_iterations >= 2. With a cap of 1, the run keeps the frontier node's dimension even on its last iteration. (inferred)
- **L6-4** P2 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:779`: Section 13, AUTOMATED TEST CROSS-REFERENCE, lists where automated deep-review coverage lives. It names none of the suites that cover expansive depth and the stop changes, although the DRV-076 to DRV-083 scenarios in this playbook run them: runtime/tests/unit/frontier-admit-review.vitest.ts, review-depth-mode-golden.vitest.ts, stop-decision.vitest.ts and stop-decision-yaml-contract.vitest.ts. All f...
  - Evidence: `rg -c "frontier-admit-review|review-depth-mode-golden|stop-decision" .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md; echo exit=$?` exit 1: exit=1
- **L7-1** P2 literal `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:185`: Decision Priority item 8 says only an open node triggers the frontier veto. The code counts nodes whose status is open or active (convergence.cjs:1483 and :1650), then vetoes when that count is above zero (convergence.cjs:1207-1211). The doc's own prose at line 107 says 'open or active'.
  - Evidence: `rg -n "node?.status === 'open' || node?.status === 'active'" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: 1483: ? { frontierOpen: registry.frontier.nodes.filter((node) => node?.status === 'open' || node?.status === 'active').length } 1650: frontierOpen: registry.frontier.nodes.filter((node) => node?.status === 'open' || node?.status === 'active').length,
- **L7-2** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:107`: The list of what the frontier veto 'never outranks' names pause, which is a workflow-level check, but leaves out the max-duration stop. In deep-review.yaml, step_check_max_duration (line 1190) runs before step_check_convergence (line 1276). When maxDurationMinutes is reached, the loop skips dispatch and goes to synthesis with maxDurationReached. That stop also beats the veto, so a reader could thi...
  - Evidence: `rg -n "^ step_(check_max_duration|check_pause_sentinel|check_convergence):" .skilled/commands/deep/assets/deep-review.yaml` exit 0: 1190: step_check_max_duration: 1217: step_check_pause_sentinel: 1276: step_check_convergence:
- **L7-3** P2 judgment `.skilled/skills/system-deep-loop/deep-review/SKILL.md:242`: Same gap as L7-2. The 'never outranks' list (iteration cap, consecutive failures, stuck recovery, pause, --convergence-mode=off, --stop-policy=max-iterations, the review floor) leaves out the max-duration stop. step_check_max_duration runs before step_check_convergence (deep-review.yaml:1190 vs :1276), so maxDurationReached also outranks the veto. (inferred)
- **L7-4** P2 judgment `.skilled/skills/system-deep-loop/deep-review/README.md:163`: Same gap as L7-2. 'The frontier veto never outranks the iteration cap, consecutive failures, stuck recovery, pause, ...' leaves out the max-duration stop. step_check_max_duration (deep-review.yaml:1190) runs before step_check_convergence (:1276) and stops the loop with maxDurationReached whatever state the frontier is in. (inferred)
- **L7-5** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:467`: Same gap as L7-2. The 'never outranks' list for the frontierOpen veto leaves out the max-duration stop. step_check_max_duration (deep-review.yaml:1190) runs before step_check_convergence (:1276). (inferred)
- **L7-6** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:165`: Same gap as L7-2. The Frontier veto line's 'never outranks' list leaves out the max-duration stop. step_check_max_duration (deep-review.yaml:1190) runs before step_check_convergence (:1276). (inferred)
- **L7-7** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:34`: The doc says 'a run started with `--depth-mode=expansive` adds a tenth, `frontier-nodes.jsonl`'. Both review seed steps also write the seed input {artifact_dir}/frontier-seed.json and pass it to frontier-admit.cjs seed --input (deep-review.yaml:333-334 and :914-924). No reviewed doc that lists the artifact-dir files includes it.
  - Evidence: `rg -n "frontier-seed" .skilled/skills/system-deep-loop/deep-review/README.md .skilled/skills/system-deep-loop/deep-review/SKILL.md .skilled/skills/system-deep-loop/deep-review/references` exit 1: 
- **L8-1** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md:47`: The frontierOpen Veto section lists `--convergence-mode=off` among the decisions that come before the veto. That is the /deep:* command spelling, but this doc is about convergence.cjs. Its parseArgs (convergence.cjs:150-166) never splits a --flag=value token, so assertKnownFlags (convergence.cjs:1724) rejects `--convergence-mode=off` as an unknown option with exit 3. The branch the doc means is `c...
  - Evidence: `node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs --convergence-mode=off` exit 3: {"status":"error","error":"Unknown option: --convergence-mode=off","code":"INPUT_VALIDATION"}

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Probes awaiting the critic

None.

## Files no lane reviewed

None.

