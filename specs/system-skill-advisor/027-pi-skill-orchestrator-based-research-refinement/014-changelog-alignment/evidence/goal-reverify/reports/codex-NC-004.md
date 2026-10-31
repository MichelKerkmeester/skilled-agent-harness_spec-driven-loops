<!-- dispatch: codex NC-004; ledger: 2026-09-28T13:49:10Z 2026-09-28T13:49:55Z 0 45 -->

RESULT: PASS | scenario=NC-004 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `npm exec -- vitest run ...advisor-recommend.vitest.ts ...advisor-renderer.vitest.ts --reporter=default` | 0 | 2 test files passed; 35 tests passed | Tests pass | Yes |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt ... --options ... --format json` | 0 | `status: ok`; top recommendations `sk-code` and `sk-prompt`; `ambiguous: true`; lane breakdown contains no prompt text | Close passing recommendations are marked ambiguous; rendered output avoids overstating certainty; lane attribution is prompt-safe | Yes |
DEVIATIONS: None
NOTES: The first vitest invocation yielded before completion; the completed rerun passed.
