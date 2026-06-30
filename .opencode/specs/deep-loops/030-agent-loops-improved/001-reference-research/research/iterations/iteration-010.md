# Iteration 10: S2-02 LLM-Judge Hardening Stack

## Focus

S2-02: what is kasper's full LLM-judge hardening stack in `evaluate.ts` and `scorer.ts`, and in what order do retry, fallback score-card, dual timeout races, format-strip retry, and JSON extraction fire? Target mapping: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`.

## Actions Taken

- Read kasper's scorer implementation and tests around retries, fallback cards, timeout races, StructuredOutput recovery, and JSON parsing.
- Read kasper's evaluation wrapper to see how fallback cards are treated after scoring.
- Resolved the shorthand target path to `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`.
- Compared the target validator's current deterministic checks against kasper's retryable judge pipeline.

## Findings

1. Retry wraps the whole scoring attempt; fallback is last-resort or retried if still within budget. `Scorer.evaluate()` loops from attempt `0` through `scoring_retries`, returns immediately on a non-fallback card, retries fallback cards until the final attempt, and converts final errors into a neutral fallback card [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:293`]. The fallback score-card is fixed at `0.5` across overall and category scores with the failure reason in weaknesses [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:357`]. Target: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`; port-difficulty: med; tag: quick-win. Why it helps: a future LLM/prose judge can be retryable without making validator failures indistinguishable from low-quality agent output.

2. The timeout stack has two production races before parse recovery begins. Scoring-session creation races the SDK call against a timeout capped at `min(scoring_timeout_ms, 30000)` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:394`]. The prompt call then races against the full scoring timeout and logs late responses if the model returns after timeout fire [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:545`]. Target: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`; port-difficulty: med; tag: quick-win. Why it helps: validation can distinguish setup timeout, prompt timeout, and parse failure instead of returning one generic degraded verdict.

3. Format-strip retry fires after prompt transport errors, with an empty-output variant after the first response. On `tool_choice` or `Thinking mode` errors, kasper logs `scoring_format_retry`, deletes `promptBody.format`, and re-runs the prompt [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:608`]. If the first response is empty and a format is present, it logs `scoring_empty_retry_no_format`, deletes the format, and re-prompts [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:745`]. Caveat: normal scoring currently avoids native structured format entirely because some models route it through an SDK tool path that never executes [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:440`]. Target: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`; port-difficulty: easy; tag: quick-win. Why it helps: if post-dispatch validation adds model judging, it should model structured-output retry as an adapter behavior, not as the only judge path.

4. JSON extraction is a cascade, not a single `JSON.parse`. First, kasper extracts newest useful response content from assistant text or a tool-input string [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:1160`]. Then `parseResponseJSON()` tries fenced JSON first and raw balanced JSON second, using JSONC parsing after extracting a balanced object [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:1267`]. If that yields no object and the response contains a tool call, it polls session messages for `tool_result` content or completed `tool.input` values [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:760`]. Last, it parses `# StructuredOutput [overall_score=...]` reasoning text as a score-only fallback [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:1013`]. Target: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`; port-difficulty: med; tag: deep-rewrite. Why it helps: the current target validates deterministic JSONL and markdown structure [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:572`], but an LLM judge stage would need salvage logic for model/provider output variance.

5. Fallback cards are quarantined from persistence and improvement decisions. After scoring, `runEvaluation()` logs fallback or zero-score cards as skipped, adds the session to the evaluated set, optionally shows a warning toast, and returns false before recording the session or considering improvements [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:272`]. Integration tests assert invalid JSON does not create a scored session and fallback cards do not trigger improvements [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/tests/integration.test.ts:858`]. Target: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`; port-difficulty: med; tag: quick-win. Why it helps: degraded judge output should become an advisory/event, not contaminate convergence, coverage, or backlog scoring.

## Questions Answered

S2-02 is answered. The firing order is:

1. `runEvaluation()` prepares either split per-pair inputs or one whole-session input, then calls `ctx.scorer.evaluate()` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:173`].
2. `Scorer.evaluate()` enters the attempt loop. Non-fallback cards return; fallback cards retry until the last attempt; thrown errors retry until final fallback [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:301`].
3. Each `tryEvaluate()` creates a scoring session through the create-timeout race [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:394`].
4. It sends the judge prompt through the prompt-timeout race [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:545`].
5. Prompt errors containing `tool_choice` or `Thinking mode` trigger format-strip retry; empty responses with a format also trigger no-format retry [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:608`].
6. Extraction tries fenced JSON, raw balanced JSON, tool-result/tool-input message polling, and StructuredOutput bracket fallback, in that order [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/scorer.ts:1298`].
7. Missing or failed structured scoring becomes a neutral fallback score-card, which `runEvaluation()` skips for persistence and improvements [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:272`].

## Questions Remaining

- Whether post-dispatch validation should add an LLM judge stage as advisory-only first, or make it strict behind an explicit environment flag.
- Whether the format-strip retry should be ported now or only when a validator actually uses provider-native structured output.
- Whether judge fallback events should be appended to the same state log or emitted only in the per-iteration delta file.

## Next Focus

[S2-03] How kasper enforces `min_observations_for_update` before acting on a weakness, mapped to deep-loop-runtime convergence gating.
