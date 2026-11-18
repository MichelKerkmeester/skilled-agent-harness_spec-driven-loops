# Alignment report: topic expansive-depth

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic expansive-depth`
- Commits: `c10bb24f3e58dbd2fb01eb518d6e1d85da4caab7` to `c10bb24f3e58dbd2fb01eb518d6e1d85da4caab7`, 0 first-parent commits
- Files: 78, of which 0 uncommitted or untracked
- Owners: 6
- Findings: 16 (P0 0, P1 3, P2 13), 13 literal, 0 inferred, 0 outside the scope; 1 more overturned by the critic and not counted
- Open findings: 12 (4 handed off, 0 rebutted)
- Lanes: L1, L2, L3, L4, L5, L6, L7, L8
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 78 | lens only |
| D2 | Topic checks pass | yes | 0 | 2 |

## Battery

pass 2, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-contract-drift` | 0 | 43 |
| pass | P1 | no | `D2-doc-facts` | 0 | 182 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **L1-1** P1 literal `.claude/agents/deep-research.md:165`: The doc tells the leaf that the orchestrator flags single-weak-source answers during convergence quality checks. The code never evaluates that guard: `evaluateResearchQualityGuards` hardcodes `singleWeakSource = guardOutcome('notEvaluated', [])`, so it can never fail or flag anything. The guard that does run is `sourceDiversity`, and it counts distinct SOURCE nodes behind the findings that answer ... [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: deep-research source-diversity guards. The singleWeakSource guard is hardcoded notEvaluated at runtime/scripts/convergence.cjs:907 (commit d9a4cec88a3, pre-program), and .claude/agents/deep-research.md:165 (commit e23154af674) describes a flag the code never raises.
  - Evidence: `rg -n "singleWeakSource = guardOutcome|count < 2" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: 878: return typeof count !== 'number' || !Number.isFinite(count) || count < 2; 907: const singleWeakSource = guardOutcome('notEvaluated', []);
- **C1** P2 judgment `.skilled/commands/deep/assets/deep-review.yaml:2612`: The NEVER list forbids `modify_config_after_initialization` outright, but this workflow rewrites the config after init in the two steps this topic adds: `step_extend_completed_run` writes `maxIterations: newMaxIterations` (line 571) and `step_frontier_budget` writes `maxIterations: budget.derivedMaxIterations` (line 950). The runtime then reads the rewritten value: `seedBudget` takes the floor fro...
  - Evidence: `rg -n "modify_config_after_initialization|maxIterations: newMaxIterations|maxIterations: budget.derivedMaxIterations" .skilled/commands/deep/assets/deep-review.yaml; rg -n "Modify config after init" ....` exit 0: ...ew-config.json` are read-only after initialization. The workflow makes three permitted writes: the terminal `step_update_config_status` flip to `status: complete`, the `--extend=N` rewrite, and `step_frontier_budget` setting `maxIterations` from the seed for an expansive run with a defaulted budget.
- **C2** P2 literal `.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:302`: The review Frontier Node Store row shape is given as a closed list that omits `budget`, but `admitProposals` writes an optional `budget` field onto an admitted row for either target and the budget admission check reads it back from the stored parent. Without the field on the row, no later child could be held to its parent's budget, so the schema description is incomplete. L6 recorded this omission...
  - Evidence: `rg -n -F "{nodeId, parentId, depth, scope, question, status, reason, iteration, dedupeKey}" .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md; rg -n "Number.isFinite\(propo...` exit 0: 302:Rows are append-only and carry `{nodeId, parentId, depth, scope, question, status, reason, iteration, dedupeKey}`. 441: if (Number.isFinite(proposal.budget) && parent && Number.isFinite(parent.budget)) { 505: ...(Number.isFinite(proposal.budget) ? { budget: proposal.budget } : {}),
- **C3** P2 literal `.skilled/skills/system-deep-loop/deep-research/README.md:122`: The README tells the reader the legal-stop gates check "that one weak source does not carry a finding", but `evaluateResearchQualityGuards` hardcodes `singleWeakSource = guardOutcome('notEvaluated', [])` and the suite pins that with the case `always leaves single weak source not evaluated`, so the guard can never fail. The guard that does run is `sourceDiversity`, which counts distinct SOURCE node... [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: deep-research source-diversity guards. The singleWeakSource guard is hardcoded notEvaluated at runtime/scripts/convergence.cjs:907 (commit d9a4cec88a3, pre-program), and deep-research/README.md:122 (commit 096fe534033) names the same unevaluated guard among the legal-stop checks.
  - Evidence: `rg -n "singleWeakSource = guardOutcome|always leaves single weak source not evaluated" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs .skilled/skills/system-deep-loop/runtime/tests/u...` exit 0: convergence.cjs:907: const singleWeakSource = guardOutcome('notEvaluated', []); stop-decision.vitest.ts:514: it('always leaves single weak source not evaluated', () => {
- **L2-1** P2 judgment `.skilled/commands/deep/assets/deep-research.yaml:2378`: The NEVER list still forbids `modify_config_after_initialization` outright, but the workflow rewrites the config after init in the two steps this topic adds: `step_extend_completed_run` (line 467) writes `maxIterations: newMaxIterations` and `maxDurationMinutes` (line 548), and `step_frontier_budget` (line 775) writes `maxIterations: budget.derivedMaxIterations` (line 798). The runtime then reads ...
  - Evidence: `rg -n "modify_config_after_initialization|step_frontier_budget:|step_extend_completed_run:|maxIterations: budget.derivedMaxIterations|maxIterations: newMaxIterations" .skilled/commands/deep/assets/dee...` exit 0: 467: step_extend_completed_run: 548: maxIterations: newMaxIterations, 775: step_frontier_budget: 798: fs.writeFileSync(tmp, JSON.stringify({ ...config, maxIterations: budget.derivedMaxIterations }, null, 2) + "\n"); 2378: - modify_config_after_initialization
- **L4-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:16`: The page enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle". `checkProposal` runs six checks in one fixed order and records the first failing check's name as the prune reason: relevance (frontier-admit.cjs:398), dedupe (:411), depth (:425), fan-out (:429), budget (:439), cycle (:447). The list omits the first check and puts dedupe after budget, so a proposal with no `evide...
  - Evidence: `rg -o "admits leaf .frontier_proposal. rows as nodes under [a-z, -]+ caps" .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md; rg -n "^ // [1-6]\. " .sk...` exit 0: admits leaf `frontier_proposal` rows as nodes under depth, fan-out, budget, dedupe and cycle caps 398: // 1. relevance 411: // 2. dedupe 425: // 3. depth 429: // 4. fan-out 439: // 5. budget 447: // 6. cycle
- **L4-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:38`: The list of gates that decide before the frontier veto omits the consecutive-failure halt. convergence.cjs returns STOP/error/`consecutiveFailures` once the count reaches `CONSECUTIVE_FAILURE_LIMIT` (3, line 53) at line 1148, and that check sits above the `frontierOpen` veto at line 1211, so a run that fails three iterations in a row stops even with open frontier nodes. research.md:107 and review....
  - Evidence: `rg -o "The iteration cap, the anti-convergence floor, stuck recovery, pause," .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md; rg -n "CONSECUTIVE_FAI...` exit 0: The iteration cap, the anti-convergence floor, stuck recovery, pause, 53:const CONSECUTIVE_FAILURE_LIMIT = 3; 1148: return emit('STOP', 'error', 'consecutiveFailures', gatesAt(false), []); 1211: return emit('CONTINUE', null, 'frontierOpen', gatesAt(false), []);
- **L4-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:487`: The catalog's `--depth-mode` summary lists the gates that decide before the frontier veto as "the iteration cap, the floor, stuck recovery, pause, convergence off and the max-iterations policy" and omits the consecutive-failure halt. convergence.cjs stops on `consecutiveFailures` at line 1148 once `CONSECUTIVE_FAILURE_LIMIT` (3, line 53) is reached, before the `frontierOpen` veto at line 1211, so ...
  - Evidence: `rg -o "the iteration cap, the floor, stuck recovery, pause, convergence off and the max-iterations policy decide before the frontier veto" .skilled/skills/system-deep-loop/deep-research/feature-catalo...` exit 0: ... floor, stuck recovery, pause, convergence off and the max-iterations policy decide before the frontier veto 53:const CONSECUTIVE_FAILURE_LIMIT = 3; 1148: return emit('STOP', 'error', 'consecutiveFailures', gatesAt(false), []); 1211: return emit('CONTINUE', null, 'frontierOpen', gatesAt(false), []);
- **L6-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:63`: The Validation table credits `runtime/tests/unit/frontier-admit-review.vitest.ts` with "Review admission into the node store and debt entries", but that file contains no debt or `searchDebt` assertion at all. Debt entries are produced by the reducer (`mergeFrontierIntoSearchLedger` in `runtime/scripts/reduce-state.cjs`), not by `frontier-admit.cjs`, so the test cannot cover them.
  - Evidence: `rg -c "searchDebt|debt" .skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts || echo "0 matches in frontier-admit-review.vitest.ts"` exit 0: 0 matches in frontier-admit-review.vitest.ts
- **L6-3** P2 literal `.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md:25`: The doc says the config records "the four configured dimensions", but `reviewDimensions` is written from `{review_dimensions_normalized}`, which is the canonical four plus every configured custom name (the `review_dimensions` input explicitly accepts "custom names"). A run set up with `review_dimensions: correctness,performance` records five dimensions, so the count is not fixed at four.
  - Evidence: `rg -n "review_dimensions: |reviewDimensions: " .skilled/commands/deep/assets/deep-review.yaml` exit 0: ...nability|custom names] - Dimensions to check. The four canonical dimensions are correctness, security, traceability and maintainability; any other name is a custom dimension, reviewed after the canonical four in configured order. Default: all." 868: reviewDimensions: "{review_dimensions_normalized}"
- **L6-4** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:81`: The frontier node store row shape is given as a closed list that omits `budget`, but `admitProposals` writes an optional `budget` field onto an admitted row and the budget admission check reads it back from the stored parent. Without the field on the row, no later child could be held to its parent's budget, so the schema description is incomplete.
  - Evidence: `rg -n "Number.isFinite\(proposal.budget\)" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 441: if (Number.isFinite(proposal.budget) && parent && Number.isFinite(parent.budget)) { 505: ...(Number.isFinite(proposal.budget) ? { budget: proposal.budget } : {}),
- **L7-1** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:43`: The section 2 PACKET FILES table lists eight packet files and has no row for `frontier-nodes.jsonl`, the node store an expansive run keeps. The doc's own description calls it the reference for deep-review packet files, and the sibling state reference counts the store as the tenth state file that `--depth-mode=expansive` adds (state-format.md:34), while quick-reference.md:99 and README.md:140 both ...
  - Evidence: `rg -c "frontier-nodes" .skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md; rg -n "adds a tenth" .skilled/skills/system-deep-loop/deep-review/references/state/state-format.m...` exit 0: exit=1 34:The deep review loop uses 9 state files under the resolved `{artifact_dir}/` owned by the target spec, and a run started with `--depth-mode=expansive` adds a tenth, `frontier-nodes.jsonl`:
- **L7-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:463`: The sentence says `step_read_state` sets `next_dimension` to the active frontier node's next uncovered dimension, with no exception. The workflow puts a traceability branch ahead of the frontier branch: when `max_iterations >= 2`, `current_iteration == max_iterations` and `unfinished_core_protocols` is non-empty, `next_dimension` is `'traceability'` and the frontier node's dimension is not used. T...
  - Evidence: `rg -n "next_dimension: \"When max_iterations" .skilled/commands/deep/assets/deep-review.yaml | cut -c1-260` exit 0: 1157: - next_dimension: "When max_iterations >= 2, current_iteration == max_iterations and unfinished_core_protocols is non-empty, 'traceability': the last iteration under the cap finishes those core protocols. Otherwise, when depth_mode == 'expansive

### D2 Topic checks pass

- **L1-2** P1 literal `.pi/agents/deep-research.md:173`: Same stale source-diversity claim as the .claude mirror: the doc says the orchestrator flags single-weak-source answers, but `evaluateResearchQualityGuards` hardcodes `singleWeakSource = guardOutcome('notEvaluated', [])` and never evaluates it. The live `sourceDiversity` guard counts distinct SOURCE nodes per answered QUESTION, not sources per finding. [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: deep-research source-diversity guards. The singleWeakSource guard is hardcoded notEvaluated at runtime/scripts/convergence.cjs:907 (commit d9a4cec88a3, pre-program), and .pi/agents/deep-research.md:173 (commit 74f5988ba28) describes a flag the code never raises.
  - Evidence: `rg -n "singleWeakSource = guardOutcome|count < 2" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: 878: return typeof count !== 'number' || !Number.isFinite(count) || count < 2; 907: const singleWeakSource = guardOutcome('notEvaluated', []);

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **L6-1** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:16`: The overview says expansive review "admits leaf `frontier_proposal` rows under the same caps as research", but the root-children cap differs by target: `ROOT_CHILDREN_FLOOR` is 6 for research and 8 for review, and `readCaps` sets `maxRootChildren` to that floor. The same paragraph later says the review root cap was raised to 8, so the sentence contradicts both the code and the rest of the doc. Onl... [D1, L6]
  - Evidence: `rg -n "ROOT_CHILDREN_FLOOR" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 61:const ROOT_CHILDREN_FLOOR = Object.freeze({ research: 6, review: 8 }); 269: maxRootChildren: Math.max(maxChildrenPerNode, ROOT_CHILDREN_FLOOR[target]),
  - Critic override: refuted, lane severity P2. The sentence is scoped to leaf `frontier_proposal` rows, and for those the caps are identical across targets. `checkProposal` reaches `childCapFor(proposal.parentId, caps)` (frontier-admit.cjs:429), which returns `maxRootChildren` only when `parentId === 'root'` (frontier-admit.cjs:352-354); a leaf proposal's parent is the frontier node the block named, so it is bounded by `maxChildrenPerNode` (6 ...

## Probes awaiting the critic

None.

## Files no lane reviewed

None.

