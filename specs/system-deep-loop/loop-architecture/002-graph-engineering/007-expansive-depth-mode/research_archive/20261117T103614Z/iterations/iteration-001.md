# Iteration 1: Q1 - the stop decision in convergence.cjs and the minIterations floor

## Focus

Q1: why do the current research and review loops stop early or stay narrow? Trace the stop decision in `convergence.cjs` (newInfoRatio, weighted vote, minIterations floor, quality guards, graph decision) and name which signals reward narrow depth. Taken from strategy "Next Focus". One adjacent check on Q7 (the config-dir defect) was added because it was a single grep on a file already in the source pointers; the full Q7 blast-radius analysis is deferred.

## Actions Taken

1. Mapped `convergence.cjs` (1938 lines) by grepping for its stop, threshold, guard and graph symbols.
2. Read `computeStopSignals`, `evaluateResearchQualityGuards` and `buildStopDecision` in full (lines 759-1180).
3. Read the graph evaluators (`evaluateResearch`, `evaluateReview`), `combineGraphDecision`, the novelty-corroboration guard and the stop-input assembly (`stopDecisionResearchFacts`, `deriveLoopCounters`, ratio sourcing).
4. Read `step_check_convergence` in `deep-research.yaml` and grepped `deep-review.yaml` for a minIterations floor.
5. Read the `--claude-config-dir` validation and the `runClaude` research and review branches in `dispatch-iteration.cjs`.

## Findings

1. **The stop order is fixed and the script owns it.** First match wins: max-iterations cap, 3 consecutive failures, stuck threshold, convergence-mode `off`, stop-policy `max-iterations`, then a STOP candidate, then the minIterations floor, then quality guards, then the graph decision. The YAML only branches on the result and never recomputes it. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1115] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1130] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1138] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:963]

2. **Research progress is measured against a question set fixed at init.** `totalQuestions` is just `answeredCount + openCount` from the findings registry. A STOP candidate (`all_questions_answered`) exists as soon as every registered question is answered, and it skips the weighted vote. Nothing in the stop path counts unexplored scope, so a loop that answers its 3-5 init questions narrowly has done everything the stop logic can see. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1415] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1149]

3. **The weighted vote rewards answering the known questions, not finding new ones.** The research vote has three signals: rolling average of the last 3 newInfoRatios below the threshold (weight 0.30), the MAD noise floor (0.35, needs 4 ratios), and `questionEntropy`, the answered fraction, at or above 0.85 (0.35). Unavailable signals drop out of the denominator. So in iterations 1-2, `questionEntropy` alone carries the vote: 6 of 7 answered gives a score of 1.0, which is above 0.60. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:805] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:811] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:819] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:833] [INFERENCE: denominator renormalization at convergence.cjs:824-830 plus the 0.85 cutoff at :819]

4. **newInfoRatio is a self-reported, focus-relative number.** The ratios come straight from the agent's iteration records, filtered only by status. The agent contract scores novelty per finding of the current focus. Deep drilling on one sub-question naturally produces falling ratios, and a rolling average under 0.05 counts as a stop vote. The only cross-check is a novelty-corroboration guard, which blocks STOP only when the reported novelty is low AND graph novelty is above its floor. It can veto a stop, but it can never add scope. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:807] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:568] [SOURCE: .skilled/agents/deep-research.md] [INFERENCE: ratio sourcing at convergence.cjs:1601-1604 reads record.newInfoRatio unmodified]

5. **minIterations is a lower bound only, and it is research-only.** It applies only when `loopType === 'research' && minIterations > 1`, and the shipped research default is 3. Once it clears it does nothing to extend depth. The review loop has no minIterations floor in `convergence.cjs`, and `deep-review.yaml` never mentions one. Review can stop as early as its rolling-average signal (2 ratios) plus the coverage vote allow. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:550] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:775] [INFERENCE: an empty grep for minIterations in .skilled/commands/deep/assets/deep-review.yaml]

6. **The focusAlignment quality guard actively penalizes widening.** It fails when any iteration answers a question that is not in that iteration's own `keyQuestions` list, which turns a STOP candidate into CONTINUE (`qualityGuardFailed`). Today that is harmless, but it means an iteration answering an emergent question is booked as a violation rather than as scope growth. An expansive mode must either register the new question first or exempt frontier-born questions from the guard. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:880] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1168]

7. **The sourceDiversity guard deepens evidence per question, not the scope.** It requires at least 2 cited SOURCE nodes per answered question. That is depth along an existing question, never breadth. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:864]

8. **The graph decision can block a stop but cannot widen.** `STOP_ALLOWED` requires every trace entry to pass: questionCoverage >= 0.7, claimVerificationRate >= 0.6, contradictionDensity <= 0.15, sourceDiversity >= 1.5 and evidenceDepth >= 1.5. All five are ratios over the existing QUESTION/FINDING/SOURCE nodes, and none measures unvisited frontier nodes. A missing graph decision yields CONTINUE (`graphDecisionMissing`), so the graph is a veto layer over the question set, not a frontier. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:432] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1799] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1004]

9. **The stuck path recovers but never widens.** A ratio below threshold increments `stuckCount`, and an `insight` status resets it. Reaching `stuckThreshold` gives STUCK_RECOVERY, not a scope expansion. How recovery chooses its new focus belongs to Q2. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1335] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1130]

10. **The only built-in ways to run longer are blunt.** `convergenceMode: off` and `stopPolicy: max-iterations` turn the vote into telemetry and run to the cap. They extend duration, not direction, so the loop still works the same fixed question set. Their real breadth effect belongs to Q3. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1138] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:963]

11. **Q7, partly addressed. The recorded defect is only half right.** An explicit `--claude-config-dir` on a research run is not silently ignored: `validateFlags` rejects it with the UsageError "flag '--claude-config-dir' is only valid with --executor cli-claude-code --loop-type review". The silent path is the environment: only the review branch builds `parentEnv` with `CLAUDE_CONFIG_DIR` and passes `guardContext: { env: parentEnv }`. The research branch passes no guardContext, so whether an ambient `CLAUDE_CONFIG_DIR` reaches the child depends on `runAuditedExecutorCommand`'s default env filtering, which is not yet verified. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:217] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:355] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:400]

### Synthesis: signals that reward narrow depth

[INFERENCE: from findings 2-8] Every stop signal is anchored to the init-time question registry: all_questions_answered, questionEntropy, the graph's questionCoverage, and the sourceDiversity and focusAlignment guards. The one scope-agnostic signal, self-reported newInfoRatio, is focus-relative and falls naturally as a focus is drilled. No signal measures unexplored surface: unvisited files or commits, unexpanded graph nodes, or emergent questions. Narrow-and-done therefore looks the same as converged. An expansive sub-mode needs at least one frontier-anchored signal, such as "open frontier nodes above the priority floor", that can veto STOP. It also needs a path that adds questions or nodes during the run, so the denominator in findings 2-3 can grow.

## Ruled Out

- Treating minIterations as the cause of early stopping: it only delays a stop, and raising it adds iterations without adding direction (finding 5).
- `convergenceMode: off` and `stopPolicy: max-iterations` as a widening fix: duration only (finding 10).

## Dead Ends

None this iteration.

## Edge Cases

- Ambiguous input: none for Q1.
- Contradictory evidence: the topic describes the config-dir defect as "silently not routed". The code shows an explicit flag is loudly rejected, and only the environment path may be silent. Both versions are kept. Q7 remains open.
- Missing dependencies: none.
- Partial success: Q7 was only partly addressed, because `runAuditedExecutorCommand`'s env handling was not read.

## SCOPE VIOLATIONS

None. `research/research.md` was not updated: progressiveSynthesis is true in the config, but the iteration prompt's allowed-write list does not include it, and the prompt pack is authoritative.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:40-75, 348-470, 533-595, 759-893, 1004-1180, 1300-1341, 1380-1440, 1596-1636, 1790-1810
- .skilled/commands/deep/assets/deep-research.yaml:550, 844-1020
- .skilled/commands/deep/assets/deep-review.yaml (grep for minIterations: no hits)
- .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:208-224, 352-440

## Assessment

- New information ratio: 0.91 (10 of 11 findings fully new; finding 11 is partly new because it refines a defect the topic already names)
- Questions addressed: Q1, Q7 (partial)
- Questions answered: Q1

## Questions Answered

- Q1: answered. See Findings 1-10 and the Synthesis.

## Questions Remaining

- Q2-Q6 untouched. Q7 partly addressed: the explicit flag is rejected; the env inheritance on the research branch is unverified.

## Reflection

- What worked and why: grepping for decision symbols before reading let me read only the roughly 400 lines that decide the outcome, out of 1938.
- What did not work and why: nothing failed. The novelty guard's full graph-novelty math (`computeGraphNoveltyDelta`) was not read, so its sensitivity is unquantified.
- What I would do differently: read `runAuditedExecutorCommand` alongside the Q7 check to close it in one pass.

## Recommended Next Focus

Q2: focus selection. Cover the reducer-written Next Focus in `reduce-state.cjs`, least_explored, stuck recovery and the rejected-pattern cache, and check whether `inbox.jsonl` or anything else ever adds questions mid-run. That is the counterpart to the fixed denominator in findings 2-3. Carry forward for Q7: read `runAuditedExecutorCommand` and `buildExecutorDispatchEnv` env defaults for the research branch.
