# Iteration 016 — Cross-model verify (MiniMax M3): T10 benchmark-substrate novelty

**Focus:** Independent MiniMax M3 attempt to REFUTE iter 006 (reviewer-prompt regression shape missing; novelty 0.85).
**Executor:** cli-opencode `minimax-coding-plan/MiniMax-M3` (read-only; orchestrator-written artifacts). **Status:** complete. **Agreement:** AGREE. **newInfoRatio:** 0.6.

## Verdicts
- **[V-016-C1] CONFIRMED** — Lane B fixtures are function/code-task oracles, NOT reviewer-prompt-vs-expected-verdict (`model-benchmark/README.md:17,21-25`; `benchmark-fixtures/README.md:17` fixtures carry `{name,args,expect}` no `expectedVerdict`; `code-task-scorer.cjs:300-365` returns correctness_pass_rate, zero verdict lexicon; `start-model-benchmark-loop.md:344` default scorer = byte-identical pattern matcher).
- **[V-016-C2] CONFIRMED** — Lane C gold is routing/usefulness (`score-skill-benchmark.cjs:33` WEIGHTS d1-d5 routing/discovery/efficiency/usefulness/structural; `:55-69` expected = skillId/intentKeys/resources, no verdict dim).
- **[V-016-C3] CONFIRMED** — reviewer-prompt-regression shape genuinely missing; "could be built" ≠ "already exists" (peck `revim-code-reviewer/config.sh:4-11` `CHECKOUT/INPUT/EXPECTED=fail` real diff + ground-truth verdict has no Lane-B/C analogue; the pattern scorer could be re-targeted but no fixture today takes a reviewer-prompt + known-buggy diff).

## New considerations (M3 added — implementation sketch)
- **Cheapest add:** a `reviewer-*.json` Lane B fixture shape `{agent, prompt_template, input_kind:"diff"|"state_ref", input, expectedVerdict:"pass"|"fail"|"block"}` + a sibling scorer to `code-task-scorer.cjs` that runs the agent, extracts the verdict (pattern-first, LLM-grader fallback via existing `--grader llm`), compares. Reuses `dispatch-model.cjs` + the 5dim envelope; ~1 fixture schema + ~1 scorer branch.
- Mirror the t3-* visible+hidden oracle split so the reviewer prompt can't overfit to the known answer.

## Verdict contribution
**T10 cross-model CONFIRMED — the 0.85 novelty holds.** And M3 supplied a concrete, low-cost implementation path (reviewer fixture schema + scorer branch reusing existing dispatch + 5dim envelope). Strengthens packet 010 with a ready design seed.
