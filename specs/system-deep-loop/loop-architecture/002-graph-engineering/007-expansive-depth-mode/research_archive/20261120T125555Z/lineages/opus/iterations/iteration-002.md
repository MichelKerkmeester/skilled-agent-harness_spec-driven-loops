# Iteration 2: Open design questions (per-node stuck count in research, the lineage completion rule, pivot admission)

## Focus
Frontier node F-1-003 (depth 1, scope .skilled/commands/deep/assets/deep-research.yaml, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs, specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode): Open design questions: should research count stuck passes per frontier node as review now does (deep-research.yaml:1488)? Does the lineage completion check break resume and extend for older committed research lineages that predate the closeout row, and what is the right rule? Is there a cheap design that makes pivot admission into the frontier work despite D-011-10?

## Actions Taken
1. Read the per-node counter, `deriveLoopCounters` with its `nodeScoped` gate (convergence.cjs:1405-1468, 1770-1790), and the research stuck branch (deep-research.yaml:1520-1536).
2. Read `checkLineageCompletion` (lineage-timestamp-window.ts:183-247) and its only caller (fanout-run.cjs:4829-4852). Also read `readStoredLineageSessionId` (fanout-run.cjs:763-778) and the extend-with-fan-out refusal (deep-research.yaml:372-382).
3. Applied the research completion rule to every committed research lineage state log: `git ls-files '*/research/lineages/*/deep-research-state.jsonl'` returned 343 files.
4. Read D-011-10 and D-011-11 (011-review-frontier-mode/decision-record.md:68-69) and `applyBandBudget` (frontier-admit.cjs:360-396).

## Findings
1. **(a) Yes: research should count stuck passes per node. Today it closes the wrong node.**
   - `nodeScoped` is gated to `loopType === 'review'` (convergence.cjs:1774-1778), so research counts low-yield passes lineage-wide.
   - The research stuck branch then closes "the node the latest iteration focus names" as exhausted:stuck (deep-research.yaml:1523-1532).
   - Research picks breadth-first by fewest visits (deep-research/scripts/reduce-state.cjs:2507-2512), so consecutive iterations usually visit different nodes. Three low passes over three nodes therefore close the third node after a single visit. A productive pass on a sibling also resets a genuinely stuck node's count, the defect D-011-11 fixed for review.
   - The topic's `deep-research.yaml:1488` reference is stale at HEAD. That line is pivot-override prompt text, and the stuck branch is at 1520-1536.
   - **Change:** drop the `loopType === 'review'` term from `nodeScoped`. For research, bind `nodeId` to the node named by the latest evidence-bearing iteration's focus marker, the same node the YAML branch closes. Pass the same `nodeId` to the dashboard count (deep-research/scripts/reduce-state.cjs:3048) so dashboard and decision agree.
   - Research rows carry no `findingsNew`, so `recordsNewFinding` (convergence.cjs:1397-1403) is always false for research and the ratio alone decides. That is sound, because research `newInfoRatio` is per-iteration and does not dilute as the run grows.
   - Value M-H, effort S, risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1774] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1523] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2507] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md:69]
2. **(b) Measured: 78 of 343 committed research lineages (23%) fail the research completion rule retroactively.** Of these, 72 have no terminal row and 6 have no iteration row. 26 of the 78 have `config.status == "complete"`. The terminal-looking names those failing logs used instead:
   - `phase_synthesis` x8 (one beside `legal_stop_evaluated`)
   - `synthesized` x3
   - `maxIterationsReached` x3
   - `stopped` x2
   - `stop`, `loop_stop`, `convergence_reached` and `completed` x1 each
   - none at all x52

   The "3 of 12" in the topic is a small sample of a 23% population rate. The research terminal set is `synthesis_complete | phase_synthesis_complete | synthesis | synthesis_incomplete` (fanout-run.cjs:1241, 1248-1251). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1248] [SOURCE: git ls-files '*/research/lineages/*/deep-research-state.jsonl' (343 files), rule applied by a read-only node pass]
3. **(b) It does not break resume or extend. It does break the re-dispatch of a lineage that already finished.**
   - The only caller is the post-attempt check (fanout-run.cjs:4831-4840). It requires a terminal row stamped inside this attempt's window, so old rows before the window are irrelevant (lineage-timestamp-window.ts:170-181).
   - A resumed unfinished lineage writes its own closeout row through `synthesis-closeout.cjs` and passes. `--extend` is refused with fan-out before any spawn (deep-research.yaml:372-382).
   - The real break is this path:
     - When a lineage's config is `status: complete`, `readStoredLineageSessionId` returns null and mints a new session (fanout-run.cjs:763-778).
     - The spawned workflow then classifies `completed-session` and halts without a terminal row (deep-research.yaml:665, 748-752).
     - The post-attempt check therefore fails it as `stale_terminal_event`.
     - So re-running a fan-out to retry one failed lineage re-spawns every already-finished lineage and reports each as failed.
   - **Right rule:** classify before spawn. A lineage whose config is `complete`, and whose log has a terminal row or passes `completionFromArtifacts` (fanout-run.cjs:1282-1312: research.md plus every iteration on disk), is skipped and reported `complete (prior attempt)`, and the merge consumes it as is. The post-attempt check stays strict, because closeout is now scripted. Legacy names never need to enter the strict set.
   - Value H (this is also the "rerun one failed lineage" recovery path), effort S-M, risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:772] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:207] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:748] [INFERENCE: based on the classify, halt and stale-window path traced above; not reproduced by a live re-dispatch]
4. **(c) A cheap pivot-admission design: admit the accepted candidate as a synthetic `frontier_proposal` at depth 2 under the last worked node.**
   - D-011-10 dropped admission for three reasons:
     - a minimum seed spends the whole depth-1 band
     - pivot candidates carry no scope
     - `all_dimensions_clean` forms before `frontier_drained`
   - The design: pipe the accepted candidate through the existing `frontier-admit.cjs admit` as `{type:"frontier_proposal", parentId:<last worked node>, question:<candidate focus>, scope:<parent scope>, evidence:"pivot <pivotId>"}`. How it meets each reason:
     - Depth 2 draws on the 35% band. The pivot is eligible only once the frontier is drained (deep-research.yaml:1358, deep-review.yaml:1483), so depth 1 has no open node, and `applyBandBudget` carries depth 1's unspent allotment into depth 2 (frontier-admit.cjs:383-394).
     - The inherited parent scope satisfies relevance.
     - The admitted node re-opens the frontier, so the `frontierOpen` veto (convergence.cjs:1216-1218) holds the stop until it is worked, which is the intended order.
   - If any of the six checks prunes the row, fall back to today's D-011-10 focus-only behavior.
   - No new admission code. One step per YAML.
   - Value M, effort S-M, risk medium: the pivot transaction tests and the D-011-10 amendment need reverting. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md:68] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:383] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1216] [INFERENCE: carry arithmetic from applyBandBudget, with maxIterations 10 giving depth-2 allotment 3.5 + the depth-1 remainder]

## Questions Answered
- F-1-003, all three parts: (a) yes, with a concrete change; (b) measured, no resume or extend break, a re-dispatch break with a pre-spawn rule; (c) a cheap design that reuses `admit`.

## Questions Remaining
- F-1-001 part B.
- F-1-005.

## Ruled Out
- Widening `TERMINAL_STOP_EVENTS_BY_LOOP_TYPE.research` to legacy names such as `phase_synthesis` and `maxIterationsReached`. That would loosen the strict post-attempt check for every new run to fix a classification problem that belongs before spawn.

## Dead Ends
None.

## Edge Cases
- Ambiguous input: the stale `deep-research.yaml:1488` resolves to the stuck branch at 1520-1536.
- Contradictory evidence: the topic's "3 of 12" against the measured 78 of 343. Both are consistent: a sample against the population.
- Missing dependencies: none.
- Partial success: Finding 3's re-dispatch break is traced through code, not reproduced live.

## Sources Consulted
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1216-1218, 1397-1468, 1770-1790
- .skilled/commands/deep/assets/deep-research.yaml:372-382, 665, 748-752, 1358, 1520-1536
- .skilled/commands/deep/assets/deep-review.yaml:1483
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:763-778, 1241-1312, 1975-1990, 4829-4852
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:140-247
- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:360-396
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md:68-69
- 343 committed `*/research/lineages/*/deep-research-state.jsonl` files (read-only pass)

## Assessment
- New information ratio: 0.88
- Questions addressed: F-1-003
- Questions answered: F-1-003

## Reflection
- What worked and why: measuring the completion rule over every committed lineage replaced an argument with a number, and showed the topic's sample understated the rate.
- What did not work and why: the cited YAML line number had drifted, so grepping for the branch name was the reliable anchor.
- What I would do differently: write a tiny re-dispatch fixture to prove Finding 3 live. That is out of scope for a report-only lineage.

## Recommended Next Focus
- F-1-005, prior art (web).
- Then F-1-001 part B: fanout-run.cjs `LINEAGE_COMMAND_ADAPTERS` and its synthesis-name tolerance, the convergence.cjs size, and the YAML confirm and dry-run scaffolding.
