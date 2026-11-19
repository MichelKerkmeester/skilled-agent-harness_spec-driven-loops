# Iteration 001: Correctness

## Dispatcher

- Run: 1 of 3, session 2026-11-19T15:38:08.666Z, generation 2, lineageMode restart.
- Dimension: correctness.
- Route: mode=review, target_agent=deep-review, native leaf, no sub-agents.
- Operator focus: covered by reading only the logic the range added or changed (`git diff 21c4b325b5a..f30fcdb42f6 -- <file>`), production scripts first. Tests were read only as counterevidence for the finding below.

## Dimension

Correctness of the expansive-depth control path: frontier admission (`frontier-admit.cjs`), the review frontier projection in the reducer (`runtime/scripts/reduce-state.cjs`), the stop decision changes (`convergence.cjs`), the fan-out frontier merge (`fanout-merge.cjs`) and the review YAML steps that consume them (`deep-review.yaml`).

## Files Reviewed

- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs (whole file, new in range)
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs (range diff)
- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs (range diff, frontier projection and next-focus)
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs (range diff, frontier merge and traceability merge, partial)
- .skilled/commands/deep/assets/deep-review.yaml (next_dimension, frontier seed, budget, close, block and admit steps)
- .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts (counterevidence only)
- .skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts (counterevidence only)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Expansive review frontier requires and dispatches dimensions the run's configured reviewDimensions excluded** -- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1224 -- `buildDimensionUniverse` always starts from the canonical four (`REQUIRED_DIMENSIONS`, which includes `traceability`) and only appends configured custom names, so it never narrows to a configured subset. The new frontier projection uses that universe to decide when a node is answered (`coveredDimensions.length === universe.length`, reduce-state.cjs:2026) and which dimension the node still owes (`nextDimension`, reduce-state.cjs:2037). The review YAML then sets `next_dimension` from `registry.frontier.activeNextDimension` whenever depth mode is expansive (deep-review.yaml:1169), and the reducer's next focus says "review the <dimension> dimension" for the active node (reduce-state.cjs:2422). The budget sizer counts the same universe (`reviewDimensionCount`, frontier-admit.cjs:381). The same range taught the stop decision the opposite rule: "A run configured with a dimension list that leaves traceability out never reviews it" (convergence.cjs:1507), and the YAML's `traceability_in_run` is false for such a list (deep-review.yaml:1168). An expansive review configured with `reviewDimensions: ["correctness","security","maintainability"]` (this run's own shape, with depthMode switched to expansive) therefore dispatches a traceability iteration for every frontier node, and no node can reach `answered` until that excluded dimension is reviewed, so `frontier_drained` (convergence.cjs:1169) cannot fire before each node has spent an iteration on traceability.
   Finding class: cross-consumer contract mismatch (configured dimension set vs. frontier dimension universe).
   Scope proof: every cited line is added in 21c4b325b5a..f30fcdb42f6; `buildDimensionUniverse`, `buildReviewFrontier`, `pickReviewFrontierFocus`, `reviewDimensionCount`, the convergence `reviewTraceabilityCovered` early return and the YAML `next_dimension` frontier branch are all new in the range.
   Affected surface hints: runtime/scripts/reduce-state.cjs `buildDimensionUniverse` / `buildReviewFrontier` / `pickReviewFrontierFocus`; runtime/scripts/frontier-admit.cjs `reviewDimensionCount` / `expansiveBudget`; .skilled/commands/deep/assets/deep-review.yaml `next_dimension`; runtime/scripts/convergence.cjs `reviewTraceabilityCovered`; the reducer test that pins all four (deep-review-state-reducer.vitest.ts:1058).
   Case: expansive review run, reviewDimensions [correctness, security, maintainability], one seeded node; after three iterations cover those three dimensions the node is still open with nextDimension traceability, and the fourth iteration is dispatched to traceability although traceability_in_run is false.

```json
{"type":"claim_adjudication","findingId":"R1-P1-001","claim":"Under depthMode expansive, a review configured with a dimension subset still requires and dispatches every canonical dimension per frontier node, contradicting the range's own rule that an excluded traceability dimension is never reviewed.","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1224",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2026",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2037",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2422",".skilled/commands/deep/assets/deep-review.yaml:1168",".skilled/commands/deep/assets/deep-review.yaml:1169",".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1507",".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:381"],"counterevidenceSought":"Searched the reducer and frontier tests for a subset-dimension expansive case and the packet spec.md and decision-record.md for a rule pinning the frontier universe to the canonical four. The reducer test at deep-review-state-reducer.vitest.ts:1058 pins the four-dimension rule deliberately with a config of [correctness, security]; spec.md and decision-record.md hold no statement on it (rg returned no hit).","alternativeExplanation":"The four-dimension node universe may be an intended design choice (a node is only settled once every canonical lens has looked at it). If so, the defect moves to the other side: convergence.cjs:1507 and traceability_in_run then misstate the contract for expansive runs, and the operator's reviewDimensions is silently widened.","finalSeverity":"P1","confidence":0.7,"downgradeTrigger":"Downgrade to P2 if a governing spec or decision record states that an expansive review node is answered only after all canonical dimensions regardless of reviewDimensions, and the operator-facing setup documents that widening."}
```

Skeptic/referee (compact): the skeptic case is that the test fixture pins the behavior on purpose. The referee keeps P1 because the same range ships two consumers (the convergence early return and `traceability_in_run`) that state the configured list is authoritative, so the system contradicts itself on a reachable config, and the visible effect is budget spent on a dimension the operator excluded.

### P2 Findings

None.

## Traceability Checks

- spec_code: partial. The packet spec.md and decision-record.md do not state which dimension set an expansive review node must cover; the code picks the canonical four plus custom names (reduce-state.cjs:1224) while the stop path honours the configured list (convergence.cjs:1507).
- checklist_evidence: not run this iteration (traceability is not a configured dimension; recorded as owed only if the run adds it).

## Integration Evidence

- Command workflow: .skilled/commands/deep/assets/deep-review.yaml `step_read_state` extract `next_dimension` (line 1169) and `active_frontier_node` (line 1193), the stuck close (line 1611), the pre-dispatch `--status active` close (line 1717) and the admit step (line 2049).
- Script surfaces: runtime/scripts/frontier-admit.cjs CLI (`seed`, `budget`, `block`, `admit`, `close`), runtime/scripts/reduce-state.cjs registry `frontier`, runtime/scripts/convergence.cjs `stopDecisionReviewFacts`.

## Edge Cases

- Iteration number: dispatch says 1; the state log holds no `type:"iteration"` record, so the JSONL-derived value is also 1. No mismatch.
- The current run itself is depthMode default, so the finding does not affect this review run; it is reached only with depthMode expansive plus a dimension subset.
- Coverage is partial: fanout-run.cjs, upsert.cjs, dispatch-iteration.cjs, verify-iteration.cjs, the deep-research reducer, the ledger schemas and divergent-pivot changes were not read this iteration and are carried forward, not passed.

## Confirmed-Clean Surfaces

- frontier-admit.cjs admission order and caps: relevance, dedupe, depth, fan-out, budget and cycle run in the stated order; a pruned parent blocks its children; the seed skips the run-wide cap only for depth-1 rows; node ids keep counting from the highest stored serial (frontier-admit.cjs:249, :577).
- frontier-admit.cjs closeNode: a settled status cannot move and a pruned node cannot be revived (frontier-admit.cjs:805).
- Research focus parse: the reducer writes `Frontier node <id> (depth ...)`, and `renderFrontierBlock`'s `/^Frontier node (\S+) /` captures the bare id (frontier-admit.cjs:857, deep-research reduce-state.cjs:2520).
- convergence.cjs frontier veto and `frontier_drained`: the drained candidate needs total >= 1, open 0 and answered >= 1, and the veto runs after the cap and the minimum-iteration floor (convergence.cjs:1169, :1207).
- reduce-state.cjs budget bands: open nodes in a band whose spend reaches its share are projected as exhausted, and unspent share rolls down only from a band with no open node.

## Ruled Out

- fanout-merge.cjs partition guard compares partition ids against a flat set of lineage-local ids across all lineages; collision would need two lineages to report the same depth-1 id, and depth-1 ids are minted only by the single seed, so a missing node cannot be masked in practice.
- Commit-range relevance check: the target string tokenizes to a revision range and admission falls back to `reviewScopeFiles`; an empty file list admits every scope by stated design, not by accident (frontier-admit.cjs:534).

## Next Focus

- Dimension: security.
- Focus area: trust boundaries in the new and changed scripts: leaf-written proposal text and scope flowing through frontier-admit.cjs into prompts, focus files and the node store; fanout-run.cjs lineage path construction and spawn arguments; upsert.cjs input parsing; the YAML shell steps that interpolate `{active_frontier_node}` and other registry values into commands.
- Reason: correctness covered the frontier control path; security is next in the configured order.
- Rotation status: correctness done (1/3), security and maintainability remaining.
- Carry-forward: correctness coverage of fanout-run.cjs, upsert.cjs, dispatch-iteration.cjs, verify-iteration.cjs and the deep-research reducer is still unread; read them under the security lens.
- Required evidence: file:line for each shell interpolation of a registry or leaf-sourced value.

Review verdict: CONDITIONAL
