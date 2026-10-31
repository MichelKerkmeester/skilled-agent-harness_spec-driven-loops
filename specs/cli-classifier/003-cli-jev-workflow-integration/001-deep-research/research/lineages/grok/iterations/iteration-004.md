# Iteration 4: grok-04 — Deep-loop stop, the case against a Jev judge

## Focus

Whether the rule that one model is one opinion rules out a Jev stop signal, or whether a different-family numeric judge counts as a second lens. Focus Area is `grok-04`.

Sibling read: the newest DeepSeek file is `research/lineages/deepseek/iterations/iteration-002.md`. MiMo has no iteration file yet. DeepSeek's iteration 2 drops a live advisor tie-break because the child is killed at 2500 ms and the shim returns `{}`, and it ranks an offline eval arm ahead of a cached shadow lane because no cross-prompt cache exists. That ordering is tighter than this lineage's iteration 2, which called the shadow lane `next`. I adopt the tighter order for routing and do not repeat it as a new finding. This iteration is about stop.

## Actions Taken

Opened the delegation rule's judgment section, the stopping-clock shadow bridge, the convergence decision text, the reducer's flatline warning, and claude-jev's jaggedness list. No live `jev` call.

## Findings

The rule splits factual questions from judgment questions. A factual question can be settled by one reader because the repository can contradict it. A judgment question is not a finding from one lens. The allowed moves are a second model family, a conversion into something the repository can answer, or an escalation to the operator. Agreement between two runs of the same model is the same opinion twice. When two delegates disagree, the rule says not to average them. [SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:112-128] [SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:161-162]

A stop decision is a judgment about whether to stop spending iterations. A Python `jev-cli` probability fused into that decision is an average with a number attached. It is not a second written finding.

The code already has the shape that keeps a second computation from becoming the decision. `createStoppingClocksShadowResult` freezes `authority: 'legacy-convergence'` and stores the other result under `stopping_clocks_shadow`. The legacy object stays `authoritative`. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-shadow.ts:10-19]

Convergence text says a passing graph still does not stop by itself. `STOP_ALLOWED` means "STOP is allowed pending newInfoRatio agreement." Low cross-executor agreement is a blocking guard: "Findings are not yet confirmed by multiple model lenses." [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:471-472] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:481]

That guard wants another model's findings, not a probability. Jev does not write findings. The claude-jev README, citing TypeSafe's jaggedness page, says Jev does not count, does not do arithmetic, cannot compare dates, and does not generate text. `newInfoRatio`, sparkline windows, and agreement rates are counts and arithmetic. Asking Jev whether the loop should stop asks it to do the work the catalogue refuses. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/README.md:262-275]

The reducer already distrusts a novelty number that looks healthy. When `newInfoRatio` stays at or above 0.9 for the whole flatline window, it emits `novelty_signal_inert` and says convergence claims derived from that signal are untrustworthy. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:965-984]

A Jev `noul` of "this iteration is new" that sits near 1.0 on repeated findings would be the same inert signal, with a bill.

### Idea: Python `jev-cli` `noul` that can allow or block STOP

| Field | Content |
|---|---|
| **Idea** | A `noul`, "this loop has converged," is OR-ed or averaged into `decisionReason`. |
| **Value** | Fewer iterations if the number is right. |
| **Seam** | `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:481` is the sentence that still waits on `newInfoRatio`. The shadow slot that must not be promoted is `.skilled/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-shadow.ts:16`. |
| **Metric, baseline, harness** | Iterations saved at equal cited-finding count. Baseline UNKNOWN. The measurement digest names a replay gap for deep-loop stop. No archived lineage was scored in this iteration. |
| **Cost, latency, privacy** | One call per iteration, after the iteration file exists. The iteration text leaves the machine. Stop is offline relative to the 1800 ms and 2500 ms hooks, so the deadline from iterations 2 and 3 does not apply. |
| **Opt-in and no key** | There is no flag on `decisionReason` today. A missing key must leave `authority: 'legacy-convergence'` and must not flip `STOP_ALLOWED`. Exit 3 is a skipped shadow, not a stop and not a continue. |
| **Complexity** | Small if it only logs. Large if `decisionReason` reads it, because every loop mode inherits the new authority. |
| **Verdict** | drop. It would average a non-counting model into a counting decision, and it would fake the cross-executor agreement guard, which asks for findings from another lens. |
| **Confidence** | Confirmed from the rule, the shadow freeze, and the jaggedness list. |
| **Kill criterion** | Any path where `stopping_clocks_shadow` or a Jev field is read by the STOP decision. Also drop if the question text asks for a count, a ratio, a date order, or "should we stop." |

### Idea: shadow `noul` on one checkable claim, logged beside the legacy result

| Field | Content |
|---|---|
| **Idea** | After an iteration, a Python `jev-cli` `noul` asks whether the iteration's cited paths appear in the previous iteration. Code records the probability on the shadow object. `authoritative` is unchanged. |
| **Value** | A second-family number a person can compare with `newInfoRatio`, without letting either number stop the loop alone. |
| **Seam** | `.skilled/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-shadow.ts:11` |
| **Metric, baseline, harness** | Correlation with later human "this repeated a finding" labels, and the reducer's `novelty_signal_inert` rate. Baseline UNKNOWN. Harness would be a replay over archived `deep-research-state.jsonl` files. The measurement digest calls this the deep-loop stop gap. |
| **Cost, latency, privacy** | One offline call per iteration. Cited paths and a short claim leave the machine. Not the whole repository. |
| **Opt-in and no key** | A research-config flag defaulting off, same posture as `SPECKIT_ADVISOR_*` from iteration 2. No key: field omitted. The loop's stop math does not branch on the field's absence. |
| **Complexity** | About 50 lines in the shadow builder and the state record. No change to `decisionReason`. |
| **Verdict** | later. The slot exists and the authority string is already frozen. Building it before a replay harness exists repeats the inert-novelty failure with a new name. |
| **Confidence** | Confirmed that the shadow object refuses to replace `authoritative`. The usefulness of the `noul` is inferred. |

## Sources Consulted

- `.skilled/repo-rules/delegation-and-orchestration.md`
- `.skilled/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-shadow.ts`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/README.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/lineages/deepseek/iterations/iteration-002.md`
- MiMo lineage iterations directory: empty

## Assessment

newInfoRatio: 0.64

Novelty justification: The frozen `authority: 'legacy-convergence'` string, the agreement-rate blocker that wants findings rather than a probability, and the jaggedness ban on counting are new. Fail-open on a missing judgment was already established in iteration 3.

Convergence telemetry: rolling average of 1.0, 0.72, 0.7, 0.64 is about 0.77. Mode is off. The flatline warning fires only at or above 0.9, so this decline is informative and still does not stop the loop.

## Reflection

What worked: reading `agreementRate`'s blocker text. It asks for another model's findings. Jev does not produce those.

What failed: treating "different family" as automatically a second lens. The rule's second lens has to be able to disagree in writing. A scalar cannot.

Ruled out: a Jev field that can move `STOP_ALLOWED` or `STOP_BLOCKED`.

Correction carried from DeepSeek iteration 2, not claimed as new research: the advisor shadow lane is `later`, behind an offline arm, because a live cache producer does not exist. This lineage's iteration 2 ranked that lane as `next`. The offline arm is the one that can lose safely.

## Recommended Next Focus

`grok-05`: whether the jev-review funnel and the claude-jev review catalogue carry over to deep-review and fan-out merge.

## Hand-off

- Verdict: a Jev stop signal that has authority is a drop. A shadow `noul` that cannot move `authoritative` is later, and only for a question that is not a count.
- Kill criterion: the shadow field is read by the stop decision, or the question asks Jev to count, compare ratios, or decide the stop.
- Jev is structurally bad at loop state that is arithmetic: `newInfoRatio`, windows, agreement rates, iteration counts.
- Sibling agreement after this iteration is not independent. DeepSeek already dropped the live advisor call.
- MiMo had no iteration file to contest.
