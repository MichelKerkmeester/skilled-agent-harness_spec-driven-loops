# Iteration 2: Q2 - focus selection end to end, plus closing Q7

## Focus

Primary: Q2. Trace how the next iteration's target is chosen: the reducer-written Next Focus, `least_explored`, stuck recovery, the rejected-pattern cache, the ideas backlog and `research/inbox.jsonl` question injection. Also check whether anything adds questions or scope during a run. Secondary: close Q7. Check whether the research branch of `dispatch-iteration.cjs` passes or strips `CLAUDE_CONFIG_DIR`, and how `fanout-run.cjs` behaves. Both come from the dispatch prompt's focus line, which overrides the strategy's §11 text (see finding 6).

## Actions Taken

1. Grepped `reduce-state.cjs` (3402 lines) and `deep-research.yaml` for the focus, inbox, ideas, rejected-pattern and recovery symbols.
2. Read `resolveNextFocus` and `buildRegistry`'s question resolution in `reduce-state.cjs`. Read `deriveNextFocusFromContinuity` and `buildCarriedForwardOpenQuestions` in `continuity-thread.cjs`.
3. Searched `.skilled` for `inbox.jsonl` and `angle-bank` writers outside docs and tests.
4. Read `buildExecutorDispatchEnv`, `isAllowedExecutorEnvKey` and `runAuditedExecutorCommand` in `executor-audit.ts`. Read both `runClaude` branches in `dispatch-iteration.cjs` and the fan-out env block in `fanout-run.cjs`.
5. Grepped both workflow YAMLs, `executor-config.ts` and `research.md` for the config-dir wiring.

## Findings

### Q2: focus selection

1. **The reducer's Next Focus has a fixed precedence.** First match wins:
   1. An active divergent-pivot focus.
   2. A blocked-stop recovery block (`BLOCKED on ... Recovery: ...`), when the blocked stop is newer than the latest iteration.
   3. The latest carried-forward open question.
   4. `Follow up on: <last finding of the latest iteration>`.
   5. The first open registry question.

   A promoted idea replaces the focus only when the continuity focus is empty, `[none yet]` or `[all tracked questions are resolved]`. Every candidate list is filtered through the rejected-pattern index first.

   [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2420] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2433] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2454] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2463] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:130]

2. **Carried-forward questions steer focus but never enter the stop denominator.** `buildCarriedForwardOpenQuestions` collects every free-text item under an iteration's `Questions Remaining` heading, and every `openQuestions` or `questionsRemaining` value on a record, that does not match an open registry question. These items are kept separately as `carriedForwardOpenQuestions`. The registry's `keyedQuestions`, `openQuestions` and `metrics.openQuestions` are built only from the strategy and inbox questions. So an emergent question can become the next focus, but it never raises `totalQuestions`, and it can never block `all_questions_answered` or lower `questionEntropy` (iteration-1 findings 2-3).

   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:76] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2578] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2587] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2642]

3. **`research/inbox.jsonl` is the only path that grows the canonical question set, and nothing in the runtime writes to it.** The reducer reads the inbox on every reduce step and merges its rows into the registry. Those rows do count toward `totalQuestions`. But no runtime script or YAML writes the inbox. Outside docs, tests and the trigger index, `inbox.jsonl` appears only in `reduce-state.cjs`. The `angle-bank` origin exists only as an enum value in the reducer. An operator or an analyst has to append rows by hand.

   [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1137] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3139] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:129] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md] [INFERENCE: a grep of .skilled for inbox.jsonl and angle-bank found no writer]

4. **A question can be resolved by a matching focus string, and the matching is literal.** A question counts as resolved when one of three things holds:
   - An eligible record's `answeredQuestions` contains its normalized text.
   - `answeredQuestions` is non-empty and the record's `keyQuestions` holds only this question.
   - The record's `focus` equals the question text.

   Records with status `error`, `failed`, `failure`, `stuck` or `thought` do not count. Resolution is exact string equality and has no semantic test. An expansive mode that rewrites or splits questions needs stable question ids.

   [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2481] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2496]

5. **The YAML focus pipeline narrows by design.**
   - `least_explored` is the first unanswered question not covered by the latest focus.
   - Stuck recovery sets `next_focus` to `RECOVERY: Widen scope. Try fundamentally different approach. Least-explored question: {least_explored}`. "Widen scope" is only prompt text. The target is still one of the existing questions.
   - `step_rejected_pattern_cache` then removes suppressed next-focus, recovery and idea candidates, and halts when all of them are suppressed.
   - `step_ideas_backlog_lifecycle` uses a promoted idea only when `next_focus` is empty or every question is resolved.

   Every stage picks one target from a list that already exists. None of them adds a target.

   [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:857] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1218] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1222] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1264] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1280]

6. **Free text the agent writes under "Questions Remaining" takes over the reducer's Next Focus, and this run shows it.** Iteration 1 wrote a status sentence under `Questions Remaining`: "Q2-Q6 untouched. Q7 partly addressed: ...". That sentence does not match any registry question, so it became the latest carried-forward question. It now sits verbatim in strategy §11 NEXT FOCUS. This iteration's dispatch prompt replaced it with a real focus line, which means the orchestrator had to correct the reducer's output by hand.

   The agent's own `## Recommended Next Focus` section is parsed into a `nextFocus` field. A grep for `.nextFocus` in the reducer finds no reader, so that recommendation appears to be ignored when the focus is chosen. This is an inference: a destructured read would not show up in that grep.

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-strategy.md:485] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/iterations/iteration-001.md:199] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/prompts/iteration-2.md:16] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1930] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1944] [INFERENCE: an empty grep for "\.nextFocus" in reduce-state.cjs]

### Q7: config-dir routing (closed)

7. **The explicit flag fails loudly. A configured configDir is dropped silently on research.**
   - On the direct CLI path, `validateFlags` rejects `--claude-config-dir` on a research run with a UsageError.
   - On the workflow path, `/deep:research` accepts a per-executor `--config-dir=PATH`, and `executor-config.ts` allows `configDir` for `cli-claude-code` whatever the loop type. However, the research YAML's cli-claude-code dispatch line has no `--claude-config-dir`. The review YAML passes `--claude-config-dir "{optional_claude_config_dir}"`, bound from `config.executor.configDir`.
   - The research branch of `runClaude` also leaves `configDir` out of its executor object, so the audit record shows no configDir.

   The topic's "silently not routed" claim holds for the configured value. This resolves the contradiction iteration 1 recorded.

   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:216] [SOURCE: .skilled/commands/deep/research.md:110] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:115] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1442] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:1519] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:407]

8. **An ambient `CLAUDE_CONFIG_DIR` still reaches the research child.** The research branch passes no `guardContext`. `runAuditedExecutorCommand` therefore builds the child env from `process.env`. `buildExecutorDispatchEnv` keeps every key that passes `isAllowedExecutorEnvKey`, and `CLAUDE_` is an allowed prefix for `cli-claude-code`. So the child silently uses whichever account the parent shell has, not the one the operator configured.

   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1455] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1078] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:155] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:284]

9. **Fan-out is not affected.** `fanout-run.cjs` checks `lineage.configDir` for any `cli-claude-code` lineage, with no loop-type condition, and injects `CLAUDE_CONFIG_DIR` into the spawned lineage's env after the allowlist filter. It does not call `dispatch-iteration.cjs`. The blast radius is single-lineage `/deep:research` runs with `--executor=cli-claude-code --config-dir=...`. Whether a fan-out lineage's own iterations later re-dispatch through `dispatch-iteration.cjs` is not verified (inference).

   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3962] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3995] [INFERENCE: an empty grep for dispatch-iteration in fanout-run.cjs]

### Synthesis: what an expansive sub-mode needs from focus selection

[INFERENCE: from findings 1-6 and iteration-1 findings 2-3] Focus selection is a picker over a fixed list. The one channel that grows the list, the inbox, has no automated writer. The channel the agent can write to, carried-forward questions, moves focus but is invisible to the stop logic. An expansive sub-mode can reuse the inbox as its write path. A frontier step would append `origin: angle-bank` rows with stable ids, which already count toward `totalQuestions` and already carry provenance badges. The sub-mode would also need to:

- record questions it promotes in the iteration's `keyQuestions`, so the focusAlignment guard does not fail;
- read the agent's `Recommended Next Focus` rather than relying on the `Questions Remaining` takeover.

## Ruled Out

- Treating stuck recovery as a widening mechanism: "Widen scope" is prompt text only, and the target is still `least_explored` from the existing questions (finding 5).
- Treating the ideas backlog as a scope source during the run: a promoted idea is used only when no other focus exists (findings 1 and 5).

## Dead Ends

None.

## Edge Cases

- Ambiguous input: the strategy's Next Focus and the dispatch prompt's focus disagreed. I followed the dispatch prompt, as the agent contract's precedence requires.
- Contradictory evidence: resolved. The iteration-1 contradiction about "silent" versus "loud" applies to two different paths (findings 7-8).
- Missing dependencies: none.
- Partial success: the claim that the agent's `Recommended Next Focus` is unused rests on a grep. Fan-out re-dispatch is unverified.

## SCOPE VIOLATIONS

None. I did not update `research/research.md`, because it is not on this prompt's allowed-write list. Iteration 1 skipped it for the same reason.

## Sources Consulted

- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1-30, 113-130, 845-918, 1137, 1927-1944, 2420-2530, 2578-2642, 3139
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:76-166
- .skilled/commands/deep/assets/deep-research.yaml:845-879, 971, 1214-1290, 1442
- .skilled/commands/deep/assets/deep-review.yaml:1519-1525
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:153-155, 274-285, 1066-1100, 1429-1456
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:90, 115
- .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:208-226, 352-440
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3958-3996
- .skilled/commands/deep/research.md:110

## Assessment

- New information ratio: 0.89. Seven of 9 findings are fully new. Two are partly new: finding 5 overlaps iteration-1 finding 9, and finding 7 settles a defect iteration 1 opened. (7 + 0.5 × 2) / 9 = 0.89.
- Questions addressed: Q2, Q7
- Questions answered: Q2, Q7

## Questions Answered

- Q2: answered (findings 1-6 and Synthesis).
- Q7: answered (findings 7-9).

## Questions Remaining

- Q3: What do the existing breadth levers actually provide and lack: divergent mode (Council pivot), the coverage graph, sliding-window mode, stop-policy=max-iterations, native fan-out, and the wave_orchestration reference-only appendix?
- Q4: Which graph-loop principles in the 002-graph-engineering program (children 001-006, research/, reference/, context/) are usable for a widening sub-mode: frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out, budgets and stop rules?
- Q5: What should the expansive-depth sub-mode be (frontier data model, decomposition of a target into nodes, expansion and pruning rules, depth budget, stop rule) so it handles both example targets: last-100-commits bug/drift hunt and system-skill-advisor chat-time auto-utilization?
- Q6: How does the sub-mode integrate additively and opt-in into the agents (deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence.cjs without changing default behavior?
- Q3 focus: what do divergent-pivot.cjs (Council pivot and frontier), the coverage graph, sliding-window mode and the wave_orchestration appendix actually add as scope, and can any of them write new questions or nodes during a run?

## Reflection

- What worked and why: grepping `reduce-state.cjs` for focus symbols led straight to `resolveNextFocus` and its helper module, so I read about 250 of 3402 lines. Comparing this run's own strategy §11 with the prompt pack gave live evidence of the takeover.
- What did not work and why: the first two greps used `--include` globs that zsh expanded and rejected, which cost two calls. Plain recursive grep with a path filter fixed it.
- What I would do differently: run a grep for a field's readers before claiming the field is unused, and include destructuring patterns.

## Recommended Next Focus

Q3: breadth levers. Read `divergent-pivot.cjs` (the Council pivot, its frontier and `saturatedDirections`), the coverage-graph upsert path, sliding-window mode and the `reference_only_appendix.wave_orchestration` in `deep-research.yaml`. For each lever, decide whether it can add questions or nodes during a run, or only re-picks from the existing set.
