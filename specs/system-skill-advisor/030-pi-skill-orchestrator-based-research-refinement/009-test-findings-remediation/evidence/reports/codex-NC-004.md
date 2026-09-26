<!-- dispatch: codex NC-004; ledger: 2026-09-26T22:35:48Z 2026-09-26T22:36:25Z 0 37 -->

RESULT: PASS | scenario=NC-004 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `npm exec -- vitest run …advisor-recommend.vitest.ts …advisor-renderer.vitest.ts --reporter=default` | 0 | 2 test files passed; 35 tests passed | Tests pass | Yes |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend … --format json` | 0 | `status: ok`; top two `sk-code` and `sk-prompt`, both confidence `0.95`; scores `0.872164` and `0.800392`; `ambiguous: true`; lane breakdowns contain no prompt literal | Close passing candidates set `ambiguous: true`; attribution remains prompt-safe; rendered brief does not overstate certainty | Yes |
| 3 | Inspect `data.ambiguous` | 0 | `data.ambiguous` is `true` | Confirm ambiguity flag for close candidates | Yes |
DEVIATIONS: none
NOTES: The score gap is greater than 0.05, but the confidence gap is 0, within the scenario’s ambiguity margin.
