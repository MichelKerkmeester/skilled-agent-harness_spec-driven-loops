# Deep Research Dashboard - Session Overview

## STATUS

- Topic: Communication projection quality, architecture, and value
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-deepseek-1786568849119-wn6hux
- Executor: cli-opencode / opencode-go/deepseek-v4-pro
- Stop policy: max-iterations

## PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|---|---:|---:|---|
| 1 | Tokenization granularity and the prompt-token mismatch | quality | 0.92 | 6 | complete |
| 2 | Prompt profile contract and the fail-closed control-evidence gate | quality | 0.84 | 6 | complete |
| 3 | Meaning-preservation judge wiring and the semantic-veto layer | evaluation | 0.78 | 6 | complete |
| 4 | Architecture — local primitive vs structured/templated/semantic-diff/hybrid | architecture | 0.72 | 6 | complete |
| 5 | Value — where projection earns its complexity | value | 0.70 | 6 | complete |

- iterationsCompleted: 5
- keyFindings: 23
- openQuestions: 1
- resolvedQuestions: 5

## QUESTIONS

- Answered: 5 / 5 (quality efficacy remains an open validation item)
- [x] Root cause identified: prompt describes values the model cannot see; unchanged echo accepted via restored.text === sourceText short-circuit. (iteration 1)
- [x] Quality levers mapped: temperature/thinking gated fail-closed for the shipped DeepSeek preset; no few-shot field; adjacent spans not coalesced. (iteration 2)
- [x] Judge wiring: not composed into production; evaluation veto hard-disables it; judge sees restored plaintext; proxy reviewer is provisional. (iteration 3)
- [x] Architecture: hybrid deterministic skeleton + bounded prose slots; semantic diff is a safety gate; Codex is the only full-projection path. (iteration 4)
- [x] Value: conditional for complex user-facing prose; deterministic-first rollout is reversible via provider-free rollback. (iteration 5)
- [ ] Quality efficacy versus the deterministic baseline still requires a fixed-corpus comparison and human evidence.

## TREND

- Ratios: 0.92 -> 0.84 -> 0.78 -> 0.72 -> 0.70
- Stuck count: 0
- Convergence: telemetry only; max-iterations forces continuation
- Guard violations: none

## DEAD ENDS

- Relaxing token identity/order/count checks would weaken exact restoration and was ruled out.
- Assuming the two-message wire body is a sufficient prompt was ruled out; it carries no token contract.
- Assuming temperature/thinking tuning or a model-tier upgrade fixes quality was ruled out; both are gated fail-closed or unsourced.
- Using the offline LLM proxy reviewer as the runtime meaning judge was ruled out; it is comparative and provisional.
- Replacing local restoration with remote structured rendering was ruled out; it moves exactness/privacy across the provider boundary.
- Using semantic diff as a readability generator was ruled out; it is a safety/diagnostic layer.
- Enabling projection for every message or using hosted routing as the default was ruled out; deterministic/native output and consent/fresh evidence apply.

## NEXT FOCUS

Synthesis complete: `research.md` and `resource-map.md` contain the reconciled findings, the hybrid architecture recommendation, the conditional value conclusion, and the open quality-efficacy validation item.

## SYNTHESIS

- Architecture: retain local protected-span tokenize/restore; add a deterministic skeleton plus bounded prose slots; semantic diff remains a safety gate.
- Quality: fix the prompt-token mismatch (name the token contract), coalesce adjacent spans, extend the versioned profile with examples/rubric, supply fresh confirmed capability evidence, and wire a local/privacy-approved reject-only judge.
- Value: conditional positive for complex user-facing prose; deterministic/native output remains the default elsewhere.
- Safety: preserve exact-original, safe-native, content-free telemetry, privacy-before-ranking, human release evidence, and provider-free rollback.
