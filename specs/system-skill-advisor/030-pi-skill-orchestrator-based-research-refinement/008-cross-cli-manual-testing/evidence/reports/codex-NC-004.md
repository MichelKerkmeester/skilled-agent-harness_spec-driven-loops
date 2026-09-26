<!-- dispatch: codex NC-004; ledger: 2026-09-26T19:29:22Z 2026-09-26T19:30:07Z 0 45 -->

RESULT: PASS | scenario=NC-004 | runtime=Codex
NATIVE: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `npm exec -- vitest run ...advisor-recommend.vitest.ts ...advisor-renderer.vitest.ts --reporter=default` | 0 | 2 test files passed; 35 tests passed | Tests pass | Yes |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend ... --format json` | 0 | `status: ok`; top recommendations `sk-code` and `sk-prompt`; both confidence `0.95`; `ambiguous: true`; attribution lists lane features, not prompt text | Plausible close top two; ambiguity surfaced; attribution remains prompt-safe | Yes |
| 3 | Inspect `data.ambiguous` | 0 | `true`; top-two confidence difference is `0.00` | Close top two within `0.05` set `ambiguous: true`; brief does not overstate certainty | Yes |
DEVIATIONS: none
NOTES: none
