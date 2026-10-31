<!-- dispatch: devin NC-004; ledger: 2026-09-26T22:33:11Z 2026-09-26T22:33:48Z 0 37 -->

Running the scenario's test steps.RESULT: PASS | scenario=NC-004 | runtime=Devin CLI (SWE-2 High)
NATIVE: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `cd .skilled/skills/system-skill-advisor/runtime && npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts --reporter=default` | 0 | `Test Files 2 passed (2)`, `Tests 35 passed (35)` — 22 handler tests + 13 renderer tests, vitest v4.1.11 | Tests pass; ambiguity-focused unit tests green | yes |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "review opencode docs and improve the prompt package" --options '{"topK":2,"includeAttribution":true}' --format json` | 0 | `status: "ok"`, `freshness: "live"`; top two: sk-code (score 0.872164, confidence 0.95) and sk-prompt (score 0.800392, confidence 0.95) | Envelope `ok`; two plausible recommendations; close top-two surfaces `ambiguous: true` | yes |
| 3 | Inspect `data.ambiguous` | — | `ambiguous: true`. Confidence gap 0.00 ≤ 0.05 (score gap 0.0718 > 0.05, but the confidence axis is within margin, so the flag must fire). Lane fields contain only lane names/evidence types — no prompt literal leaked | `ambiguous` flag set when either axis is within 0.05; attribution remains prompt-safe; no overstatement of certainty | yes |
DEVIATIONS: none — both commands were run verbatim as written in the scenario file.
NOTES: The score gap (0.0718) alone would not trigger ambiguity; the flag correctly fired on the confidence axis (both candidates at 0.95). Advisor reported `freshness: "live"` with generation 498, so this was a live daemon result, not a fail-open empty envelope. No files were written to the repository; no temp files needed.
