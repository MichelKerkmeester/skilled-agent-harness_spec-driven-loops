<!-- dispatch: codex NC-004; ledger: 2026-09-27T13:53:32Z 2026-09-27T13:54:08Z 0 36 -->

RESULT: PASS | scenario=NC-004 | runtime=Claude Code
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `npm exec -- vitest run …advisor-recommend.vitest.ts …advisor-renderer.vitest.ts` | 0 | 2 test files passed; 35 tests passed | Tests pass | Yes |
| 2–3 | `skill-advisor.cjs advisor_recommend … --format json`; inspect `data.ambiguous` | 0 | `status: ok`; top two were `sk-code` (score 0.871809, confidence 0.95) and `sk-prompt` (score 0.800092, confidence 0.95); `ambiguous: true`. Lane attribution contained no prompt text. | Close passing candidates set ambiguity; attribution stays prompt-safe | Yes |
DEVIATIONS: none
NOTES: none
