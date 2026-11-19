# Iteration 5 - Overengineering

## Dispatcher
- Iteration 5 of 10, dimension `overengineering` (custom), native leaf `@deep-review`.
- Rubric: strategy Review Charter overengineering rubric, `.skilled/repo-rules/prevent-overengineering.md` (reversal-cost order, options earn existence only with two real callers needing different values, no wrapper or layer without behavior).
- Operator focus addressed: code and runtime first (frontier-admit.cjs, both workflow YAML expansive steps, both config assets, convergence.cjs); every finding names what to delete or collapse.

## Files Reviewed
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` (constants 43-110, readCaps 297-327, expansiveBudget 342-349, seedBudget 371-397, scope helpers 410-503, checkProposal 512-568, admitProposals 582-655, seedNodes 670-723, closeNode 737-770, runCli 1035-1097)
- `.skilled/commands/deep/assets/deep-review.yaml` (step_frontier_seed 903-928, step_frontier_budget 930-963, step_frontier_reduce_seed 1079-1086, step_frontier_activate 1703-1710)
- `.skilled/commands/deep/assets/deep-research.yaml` (step_frontier_seed 755-770, step_frontier_budget 775-808)
- `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:17-22`, `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:11-16`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` (diff, 72 added lines)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1940,1961-1990`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:339-351`
- `.skilled/agents/deep-review.md:266-267`, `.skilled/agents/deep-research.md:301-302`

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Per-proposal `budget` field and admission check 5 bound a number nothing spends** -- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:558 -- A leaf may attach an optional integer `budget` to a `frontier_proposal` (`.skilled/agents/deep-review.md:266`, `.skilled/agents/deep-research.md:301`); check 5 prunes a child whose `budget` exceeds its parent's (frontier-admit.cjs:558-564) and the admitted row keeps the value (frontier-admit.cjs:637). A repo-wide search of the runtime scripts, reducers and libs for `.budget` finds no other reader: iteration spend is metered by the reducer's depth-band shares from `expansiveDepth.budgetSplit` (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1961-1990`), never by a node's own `budget`. So the field is a leaf-supplied number compared only to another leaf-supplied number; it gates admission on a quantity with no consumer, and it reuses the reason name `budget` that the reducer also writes for band exhaustion, so a `pruned/budget` row and an `exhausted/budget` row mean different things. Delete check 5, the `budget` spread on the admitted row, and the `budget` field from both agent proposal schemas; the six-check contract becomes five (relevance, dedupe, depth, fanout, cycle). Current requirement served: none found.
   Finding class: option-without-consumer.
   Scope proof: frontier-admit.cjs:558-564 and :637 are the only `.budget` reads in runtime/scripts, deep-*/scripts and runtime/lib outside tests; reduce-state.cjs:2052 and :2541 read the band `budget` object, a different field.
   Affected surface hints: frontier-admit.cjs checkProposal and admitProposals; .skilled/agents/deep-review.md and deep-research.md proposal schema lines and their runtime mirrors; frontier-admit.vitest.ts cases at 189-201; docs listing "relevance, dedupe, depth, fan-out, budget and cycle".
   Case: a leaf proposes a child with budget 5 under a parent recorded with budget 3; admission prunes it as `budget`, yet had it been admitted with no budget field the run would spend exactly the same iterations on it, because only the band shares meter spend.
2. **The seed command computes and prints the expansive budget that step_frontier_budget recomputes; its `--max-iterations-source` flag exists only for that discarded output** -- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:720 -- `seedNodes` spreads `seedBudget(...)` into its result (frontier-admit.cjs:720), `runCli` threads `--max-iterations-source` through to it and writes a stderr budget line (frontier-admit.cjs:1075-1079, flag registered at :920), and both YAML seed steps pass `--max-iterations-source "{max_iterations_source}"` (`.skilled/commands/deep/assets/deep-review.yaml:924`, `.skilled/commands/deep/assets/deep-research.yaml:769`). But the seed step's declared output is only the admitted and pruned rows (deep-review.yaml:927-928); the budget the run actually uses comes from the next step, which calls `seedBudget` again and writes it into the config (deep-review.yaml:950, deep-research.yaml:795). fanout-run.cjs:340-349 sizes lineage budgets through `expansiveBudget` directly and never reads the seed result. Two code paths derive the same value from the same store; one of them is printed and dropped. Delete the `seedBudget` spread from `seedNodes`, the `maxIterationsSource` option on `seedNodes`, the `max-iterations-source` CLI flag and its stderr line, and the flag from both seed commands; step_frontier_budget stays the single budget writer. Current requirement served: none beyond a duplicate log line.
   Finding class: duplicate-derivation-path.
   Scope proof: the only callers of seedNodes are runCli (frontier-admit.cjs:1069) and tests; the only non-test readers of `derivedMaxIterations` are the stderr line at frontier-admit.cjs:1077 and step_frontier_budget's own inline call.
   Affected surface hints: frontier-admit.cjs seedNodes, VALUE_FLAGS, runCli seed branch; both YAML step_frontier_seed commands; any frontier-admit.vitest.ts assertion on the seed result's budget fields; docs that describe the seed step printing the budget.
   Case: an operator passes --max-iterations 30; the seed command is invoked with source `flag` and prints a 30-iteration budget, step_frontier_budget is skipped, and nothing consumed the seed's printed value, so the flag and the computation changed no state.

## Traceability Checks
- `spec_code`: partial (unchanged). The overengineering pass checked the expansive admission contract against the agent schemas (deep-review.md:266-267) but did not close the R1-P1-001 relevance gap.
- `skill_agent`: partial. Agent proposal schemas (.skilled/agents/deep-review.md:266, deep-research.md:301) match frontier-admit's six checks word for word; the match itself carries the dead `budget` check (finding 1).

## Integration Evidence
- Command workflows: `.skilled/commands/deep/assets/deep-review.yaml` step_frontier_seed / step_frontier_budget / step_frontier_activate; `.skilled/commands/deep/assets/deep-research.yaml` step_frontier_seed / step_frontier_budget.
- Caller agents: `.skilled/agents/deep-review.md`, `.skilled/agents/deep-research.md` (frontier_proposal schema).
- Reducer: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` band budget and active-row visit attribution.

## Edge Cases
- Two-instance duplication (readCaps:313-316 and seedBudget:388 both compute `max(1, floor(budget / 2))`): the rule says wait for a third instance before abstracting, so recorded, not raised. It interacts with finding 2: deleting the seed-time budget path does not remove either copy.
- No contradictions with prior iterations; finding 2 is distinct from R4-P2-002 (that finding is the inline `node -e` writer duplicated across the two YAMLs; this one is the seed command duplicating that writer's derivation inside frontier-admit.cjs).

## Confirmed-Clean Surfaces
- `expansiveDepth.budgetSplit` in both config assets is read (reduce-state.cjs:1966-1970), so not a dead option.
- `step_frontier_activate` (deep-review.yaml:1703) earns its place: the reducer counts node visits from `active` rows (reduce-state.cjs:1940).
- `touchedFileList` object spelling (frontier-admit.cjs:461-467) mirrors the spelling terminal-gates reads, so it is a second real caller shape, not speculative.
- convergence.cjs frontier veto and `frontier_drained`: 72 lines, no new option or layer beyond `depthMode`.
- `step_frontier_reduce_seed` (deep-review.yaml:1079): needed so iteration 1 sees the seeded frontier.

## Ruled Out
- Dead `budgetSplit` config key: read by reduce-state.cjs:1966-1970.
- Redundant `step_frontier_activate`: the reducer attributes visits from `active` rows.
- Speculative object-form `reviewScopeFiles` support: matches terminal-gates' existing reader.
- Abstracting the twice-written half-budget node cap: two instances, below the rule's threshold.

## Next Focus
- Dimension: sk-code-alignment.
- Focus area: comment hygiene in frontier-admit.cjs, reduce-state.cjs, fanout-run.cjs, upsert.cjs and convergence.cjs (phase/slice/defect labels such as D5 or phase ids); JS/CJS surface rules; test-what-changed over frontier-admit.vitest.ts and stop-decision-yaml-contract.vitest.ts.
- Reason: rotation; last uncovered dimension.
- Rotation status: correctness, security, traceability, maintainability, overengineering covered; sk-code-alignment remains.
- Carry-forward: spec_code partial (R1-P1-001); checklist_evidence partial; 010 CHK-032 unverified; feature_catalog_code and playbook_capability unrun.
- Required evidence: file:line in changed code for each hygiene or surface-rule finding.

Review verdict: CONDITIONAL
