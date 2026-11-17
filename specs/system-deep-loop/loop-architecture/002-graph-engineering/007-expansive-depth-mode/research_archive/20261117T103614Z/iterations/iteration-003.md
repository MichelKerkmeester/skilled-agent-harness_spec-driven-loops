# Iteration 3: Q3 - what the existing breadth levers provide and lack

## Focus

Q3. For each existing breadth lever, decide two things. What scope does it add? Can it add new questions or nodes during a run, or does it only re-pick from the existing set? The levers are divergent mode (the Council pivot), the coverage graph, sliding-window mode, native fan-out, the `wave_orchestration` appendix, and the deep-review dimension model. Iteration 1 finding 10 already covered `convergenceMode: off` and `stopPolicy: max-iterations`, which run longer in the same direction. This iteration only refers back to it.

## Actions Taken

1. Read the pivot transaction in `divergent-pivot.ts`: `preparePivotTransaction`, `finalizePivotTransaction`, the default limits and the candidate dedup in `pivot-candidates.ts`.
2. Read the research candidate generator, `buildCandidateSeeds` and `buildResearchPivotPreparationInput` in `divergent-research-pivot.ts`. Read the YAML wiring of the pivot: the eligibility branch, the prepare command and the apply step.
3. Read the sliding-window path in `convergence.cjs` and `computeResearchQuestionCoverageFromData` in `coverage-graph-signals.ts`. Read the header of `iteration-graph-upsert.cjs`.
4. Read the `reference_only_appendix` in both workflow YAMLs and the wave section of `loop-protocol.md`.
5. Read the fan-out feature-catalog entries and the `research_topic` binding in `fanout-run.cjs`. Grepped the review YAML and `convergence.cjs` for the dimension and search-debt model.

## Findings

1. **The divergent pivot fires only at a STOP candidate and returns one focus string.** The YAML enters the pivot only when `convergence_mode == 'divergent'` and the stop reason is `composite_converged` or `all_questions_answered`. A successful pivot sets `next_focus` to the selected candidate's focus and re-runs the reducer. Under `confirm` an approval gate runs first. Its "choose a different ranked candidate" option is marked unavailable, because no ranking contract exists. The selected candidate becomes `currentFocus` and nothing else. No question enters the registry, so the stop denominator from iteration 1 finding 2 is unchanged. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1056] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1127] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1131] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1491]

2. **The pivot is hard-bounded to a shallow, single-hop redirect.** It defaults to `maxPivots: 3` and `maxCouncilSeatOutputs: 9`. Each pivot persists the invariants `rounds: 1, seats: 3, depth: 1, recursionAllowed: false`, and a recursion guard fails any pivot started inside another pivot. Three seats with fixed mandates (analytical, critical, and a third) choose one candidate from the frontier. The frontier exists only inside the transaction, and the run adopts only the winner. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:285] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1197] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1232] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:407]

3. **Pivot candidates are drawn only from existing state, and by design they never widen the topic.** `buildCandidateSeeds` has four seed sources:
   - registry `openQuestions` and `carriedForwardOpenQuestions`
   - registry `questionConflicts`
   - five free-text fields on state records (`verificationGaps`, `contradictions`, `missingSourceClasses`, `alternateEvidenceMethods`, `unansweredAdjacentQuestions`) plus `CONTRADICTS` graph edges
   - the last 3 `keyFindings`, each turned into an "independently verify" candidate

   The code states the rationale for the last source outright: "The direction tests an existing in-scope finding rather than widening the research topic." Candidates that match a strategy non-goal are dropped. Prior and rejected candidates are deduplicated by Jaccard similarity over title and focus. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:198] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:208] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:244] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:281] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:352] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/pivot-candidates.ts:165]

4. **On `all_questions_answered` the pivot has almost nothing to draw on, so each pivot buys about one iteration.** When every registry question is answered, `openQuestions` is empty. The candidates left are carried-forward free text and re-verification of the last 3 findings. The pivot adds no registry question, so the next convergence check meets the same `all_questions_answered` candidate again. The likely result is at most 3 extra verification-style iterations, then a stop. [INFERENCE: based on finding 1 (no registry write), finding 3 (seed sources), and iteration 1 finding 2 (STOP candidate when every registered question is answered)] Confirming this needs a divergent-mode run log that shows the stop reason after each pivot.

5. **Projection gap: the pivot's state-record seeds are probably dead in practice.** The prepare command reads `--state-log`, which is the gateway-refreshed `deep-research-state.jsonl`. The upsert script's own header says that projection "does not carry the iteration's graphEvents". This run's projected iteration rows 1 and 2 carry only `type, iteration, run, status, newInfoRatio, ruledOut, focus, mode, answeredQuestions, timestamp`. The iteration-1 record held extra fields such as `target_agent` and `graphEvents`, and both were dropped. So the five free-text seed fields and the `CONTRADICTS` edge seeds are likely never present when the pivot reads them. The agent record schema in `.claude/agents/deep-research.md` Step 8 does not define those five fields anyway. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1068] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:8] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-state.jsonl:6] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-state.jsonl:7] [INFERENCE: the projection drops non-whitelisted fields, based on the two observed rows] Confirming this needs a read of the projection writer's field whitelist in the append gateway.

6. **The coverage graph is the only lever whose question set can grow during a run, but it can only block a stop.** The graph is fed by agent-declared `graphEvents`, which the upsert script reads from the delta file. `questionCoverage` counts every `QUESTION` node, and it counts a question as covered only when at least 2 findings answer it. With no QUESTION nodes the value is 0. The research graph threshold is 0.7, and an `uncovered_questions` blocker turns blocking below it. So an agent that emits new `QUESTION` nodes lowers coverage and can hold the loop open. Nothing routes those nodes into focus selection: iteration 2 found that `resolveNextFocus` draws on registry and carried-forward questions, not the graph. That makes the graph a second, open question set that steers nothing. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:570] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:578] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:584] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:434] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:455] [INFERENCE: emitting QUESTION nodes can hold the loop open; testable by emitting an unanswered QUESTION node and checking for STOP_BLOCKED or CONTINUE in the graph decision] An expansive sub-mode can reuse this hook: a frontier node can be a QUESTION node that is also promoted into focus.

7. **Sliding-window mode changes only how novelty is measured.** With `convergenceMode: 'sliding-window'`, `buildGraphNoveltyTelemetry` computes a windowed graph novelty delta over the last `slidingWindowSize` snapshots. That windowed value replaces the full-history value in the novelty-corroboration guard. It touches no focus, question or scope state. It can keep a run alive longer when recent graph growth is high, but it never chooses new directions. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:55] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:534] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:565] `off` and `max-iterations` are covered by iteration 1 finding 10: they give longer runs on the same question set. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1134]

8. **Native fan-out widens across models, not across scope.** Every research lineage gets the same `research_topic` line, and each one runs the full loop in its own `lineages/{label}/` sub-packet. The only per-lineage parameter is the executor. The research merge deduplicates `keyFindings` by id with cross-model attribution, and deduplicates `openQuestions` and `ruledOutDirections`. N lineages therefore re-derive overlapping 3-5 question sets on one topic. The operator cannot partition sub-questions or sub-targets across lineages. The review path takes one shared `--review-focus` for all lineages. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1667] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1670] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:185] [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:22] The merge description comes from the feature catalog, a weaker source than the merge code, which was not read.

9. **`wave_orchestration` is the one design that partitions by question, and it is not executed.** It appears only in the research YAML's `reference_only_appendix`, with the note "Wave execution is intentionally excluded from workflow.steps". The outline is three steps: check for 3+ independent unanswered questions, dispatch up to 3 parallel agents on distinct questions, then score by median newInfoRatio and promote the top branches. `loop-protocol.md` calls it reference guidance for "a future runtime that explicitly adds wave support". It includes one widening rule: when an iteration scores more than 2x the wave average, its adjacent questions get priority in the next wave. Its prune-below-median rule narrows, though, and it draws only on existing unanswered questions. The review YAML has no wave appendix. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2072] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2078] [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:438] [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:455] [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:475] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:2310]

10. **The deep-review scope is a fixed dimension list ordered once at init.** `review_dimensions` defaults to the four dimensions: correctness, security, traceability and maintainability. `step_order_dimensions` builds `dimension_queue` once. The graph decision gates on `dimensionCoverage >= 0.8` as a `blocking_guard`, and the legal stop path checks dimension coverage separately at line 790. No step adds a dimension or a sub-target mid-run. The only open-ended review signal is `searchDebt`, which is read as a stop fact; only its existence was confirmed. The P0 override in the review YAML (`p0_override`, where one new P0 blocks convergence) sits under `reference_only_appendix`, so it should not be treated as live behavior without checking the executed steps. [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:54] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:628] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:468] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:476] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:790] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:898] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:2322]

### Synthesis: the Q3 answer in one table

| Lever | What it adds | Can it add questions or nodes mid-run? | What it lacks for expansive depth |
|---|---|---|---|
| Divergent pivot | One Council-chosen focus at a STOP candidate, at most 3 times | No. It sets `next_focus` only. | No registry write, depth 1, candidates restricted to existing state, state-record seeds likely dead (finding 5) |
| Coverage graph | Graph signals that can block a stop | Yes: agent-declared `QUESTION` nodes | Never steers focus; it is a second question set the reducer ignores |
| Sliding-window | A windowed novelty corroboration | No | Measurement only |
| `off` / `max-iterations` | Duration | No | Same direction (iteration 1 finding 10) |
| Native fan-out | Model diversity and cross-model attribution | No | No scope partitioning; same topic per lineage |
| `wave_orchestration` | A design for question-partitioned parallelism | Partly: adjacent-question boost | Not executed; prunes below median; research only |
| Review dimensions | 4 fixed axes with a coverage gate | No | No sub-target decomposition and no dimension discovery |

[INFERENCE: based on findings 1-10] No existing lever both discovers new scope and feeds it to focus selection and the stop denominator. The graph discovers but does not steer. The pivot steers but does not discover. The wave design partitions, but it is not executed. An expansive sub-mode needs a frontier that does all three: discover, steer and count.

## Ruled Out

- Treating sliding-window mode as a breadth lever. It only swaps the novelty measure (finding 7).
- Treating fan-out as scope partitioning. Every lineage gets the same topic (finding 8).

## Dead Ends

- Re-reading `off` and `max-iterations`. Iteration 1 finding 10 already covers them, and they should stay out of further breadth analysis.

## Edge Cases

- Ambiguous input: none for the focus. The review-side pivot adapter (`divergent-review-pivot.ts`) was not read. Finding 1-5 claims are research-pivot claims only.
- Contradictory evidence: none.
- Missing dependencies: the merge code and the projection writer's field whitelist were not read. Finding 8's merge details rely on the feature catalog. Finding 5 is an inference from observed projection rows.
- Partial success: none. `progressiveSynthesis` is true in config, but the prompt pack's ALLOWED WRITE PATHS list excludes `research/research.md`. The dispatch prompt outranks the agent default, so `research.md` was not updated.

## SCOPE VIOLATIONS

none

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:285, :1179-1240, :1450-1505
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/pivot-candidates.ts:165, :263
- .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:186-290, :323-360
- .skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs:88-105
- .skilled/commands/deep/assets/deep-research.yaml:71, :1056-1185, :2072-2084
- .skilled/commands/deep/assets/deep-review.yaml:54, :628, :2310-2340
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:55, :434-455, :468-486, :520-565, :790, :898, :1134
- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:570-590, :769
- .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:1-60
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:185-207, :1641-1670, :3563
- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md, fanout-merge.md
- .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:438-479
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-state.jsonl:6-7

## Assessment

- New information ratio: 0.80. Of the 10 findings, 8 are fully new. Finding 6 is partially new: it extends iteration 1 finding 8 with the open graph question set. Finding 10 is partially new: it extends iteration 1 finding 5's note that review has no minimum-iterations floor. (8 + 0.5 x 2) / 10 = 0.90, minus 0.10 because findings 4 and 5 are inference-weighted. Reported as 0.80.
- Questions addressed: Q3.
- Questions answered: Q3.

## Questions Answered

- Q3: What do the existing breadth levers actually provide and lack: divergent mode (Council pivot), the coverage graph, sliding-window mode, stop-policy=max-iterations, native fan-out, and the wave_orchestration reference-only appendix?

## Questions Remaining

- Q4: Which graph-loop principles in the 002-graph-engineering program (children 001-006, research/, reference/, context/) are usable for a widening sub-mode: frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out, budgets and stop rules?
- Q5: What should the expansive-depth sub-mode be (frontier data model, decomposition of a target into nodes, expansion and pruning rules, depth budget, stop rule) so it handles both example targets: last-100-commits bug/drift hunt and system-skill-advisor chat-time auto-utilization?
- Q6: How does the sub-mode integrate additively and opt-in into the agents (deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence.cjs without changing default behavior?

## Reflection

- What worked and why: the pivot's mode-adapter table in `divergent-pivot.cjs` pointed straight at `divergent-research-pivot.ts`, where the seed sources and their rationale strings answer the core question directly. Checking this run's own projection rows against the seed fields exposed the projection gap.
- What did not work and why: the review-side pivot adapter and the merge code did not fit the 24-call budget, so the review-pivot behavior and the merge internals rest on structure and the catalog.
- What I would do differently: read the gateway projection whitelist early. Several adapters depend on which fields survive the projection.

## Next Focus

Q4: mine the 002-graph-engineering program (children 001-006, research/, reference/, context/) for graph-loop principles: frontier expansion, node and edge discovery, coverage-driven traversal, swarm fan-out, and budgets and stop rules. Map each principle to the gap this iteration found: a frontier that discovers new scope, steers focus and counts in the stop denominator. A side check worth one call: confirm the append-gateway projection field whitelist (finding 5).
